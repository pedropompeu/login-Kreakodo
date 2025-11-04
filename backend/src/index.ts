import express, { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import authMiddleware from './middleware/authMiddleware';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS as string));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

interface User {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin' | 'superadmin';
  active: boolean;
  createdAt: admin.firestore.FieldValue;
  lastLoginAt: admin.firestore.FieldValue;
}

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Signup route to create user document in Firestore
app.post(
  '/api/auth/signup',
  authLimiter,
  [
    body('uid').notEmpty().withMessage('UID is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('username').notEmpty().withMessage('Username is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { uid, email, fullName, username } = req.body;

      console.log('Creating user document:', { uid, email, fullName, username });

      await db.collection('users').doc(uid).set({
        uid,
        email,
        fullName,
        username: username.startsWith('@') ? username : `@${username}`,
        role: 'user',
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('User document created successfully');
      res.status(201).json({ message: 'User document created successfully.' });
    } catch (error: any) {
      console.error('Error creating user document:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Middleware to check if user is admin or superadmin
const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  const userDoc = await db.collection('users').doc(req.user.uid).get();
  const user = userDoc.data() as User;

  if (user && (user.role === 'admin' || user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
};

// Middleware to check if user is superadmin
const isSuperAdmin = async (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  const userDoc = await db.collection('users').doc(req.user.uid).get();
  const user = userDoc.data() as User;

  if (user && user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: SuperAdmin access required.' });
  }
};

// GET /api/users/check-username - Check if username is available
app.get('/api/users/check-username', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    const formattedUsername = `@${String(username).replace(/^@/, '')}`;
    const snapshot = await db.collection('users').where('username', '==', formattedUsername).limit(1).get();
    
    res.status(200).json({ available: snapshot.empty });
  } catch (error: any) {
    console.error('Error checking username:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/by-username/:username - Get user by username (for login)
app.get('/api/users/by-username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const formattedUsername = `@${username.replace(/^@/, '')}`;
    
    const snapshot = await db.collection('users').where('username', '==', formattedUsername).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    const userData = snapshot.docs[0].data();
    res.status(200).json({ email: userData.email });
  } catch (error: any) {
    console.error('Error getting user by username:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users - List users (Admin only)
app.get('/api/users', authMiddleware, isAdmin, async (req: any, res) => {
  try {
    const { q, sort, order, active } = req.query;
    let usersRef: any = db.collection('users');

    if (active !== undefined) {
      usersRef = usersRef.where('active', '==', active === 'true');
    }

    if (q) {
      // Basic search by username or fullName
      usersRef = usersRef.orderBy('username').startAt(q).endAt(q + '\uf8ff');
    }

    if (sort) {
      usersRef = usersRef.orderBy(sort, order === 'desc' ? 'desc' : 'asc');
    }

    const snapshot = await usersRef.get();
    const users = snapshot.docs.map((doc: any) => doc.data());
    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:uid - Get user details (Admin/Self)
app.get('/api/users/:uid', authMiddleware, async (req: any, res) => {
  try {
    const { uid } = req.params;

    if (req.user.uid !== uid) {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      const user = userDoc.data() as User;
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Forbidden: You can only view your own profile.' });
      }
    }

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(userDoc.data());
  } catch (error: any) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:uid - Edit user details (Admin/Self)
app.put(
  '/api/users/:uid',
  authMiddleware,
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('username').notEmpty().withMessage('Username is required'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { uid } = req.params;
      const { fullName, username } = req.body;

      if (req.user.uid !== uid) {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        const user = userDoc.data() as User;
        if (user.role !== 'admin' && user.role !== 'superadmin') {
          return res.status(403).json({ message: 'Forbidden: You can only edit your own profile.' });
        }
      }

      await db.collection('users').doc(uid).update({
        fullName,
        username: `@${username.replace(/^@/, '')}`,
      });

      res.status(200).json({ message: 'User updated successfully.' });
    } catch (error: any) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: error.message });
    }
  }
);

// PATCH /api/users/:uid/deactivate - Deactivate user (Admin/SuperAdmin)
app.patch('/api/users/:uid/deactivate', authMiddleware, isAdmin, async (req: any, res) => {
  try {
    const { uid } = req.params;

    await db.collection('users').doc(uid).update({ active: false });
    res.status(200).json({ message: 'User deactivated successfully.' });
  } catch (error: any) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/users/:uid/activate - Activate user (Admin/SuperAdmin)
app.patch('/api/users/:uid/activate', authMiddleware, isAdmin, async (req: any, res) => {
  try {
    const { uid } = req.params;

    await db.collection('users').doc(uid).update({ active: true });
    res.status(200).json({ message: 'User activated successfully.' });
  } catch (error: any) {
    console.error('Error activating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:uid/promote - Promote user to admin (SuperAdmin only)
app.post('/api/users/:uid/promote', authMiddleware, isSuperAdmin, async (req: any, res) => {
  try {
    const { uid } = req.params;

    await db.collection('users').doc(uid).update({ role: 'admin' });
    res.status(200).json({ message: 'User promoted to admin successfully.' });
  } catch (error: any) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

export default app;
