import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const idToken = header.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
