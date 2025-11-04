import * as admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS as string));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
});

console.log('Firebase Project ID:', admin.app().options.projectId);

const auth = admin.auth();
const db = admin.firestore();

const SUPERADMIN_EMAIL = 'pedrolpompeu@gmail.com';
const SUPERADMIN_FULL_NAME = 'Pedro Pompeu';
const SUPERADMIN_USERNAME = '@pompeu';
const SUPERADMIN_PASSWORD = 'pedro123';

async function seedSuperAdmin() {
  try {
    // 1. Check if user with SUPERADMIN_EMAIL already exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(SUPERADMIN_EMAIL);
      console.log('SuperAdmin user already exists in Firebase Auth.');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('SuperAdmin user not found in Firebase Auth. Creating...');
        userRecord = await auth.createUser({
          email: SUPERADMIN_EMAIL,
          password: SUPERADMIN_PASSWORD,
          displayName: SUPERADMIN_FULL_NAME,
          emailVerified: true,
        });
        console.log('SuperAdmin user created in Firebase Auth.');
      } else {
        throw error;
      }
    }

    // 2. Check if user document exists in Firestore
    const userDocRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      console.log('SuperAdmin user document already exists in Firestore. Updating role...');
      await userDocRef.update({
        role: 'superadmin',
        active: true,
        fullName: SUPERADMIN_FULL_NAME,
        username: SUPERADMIN_USERNAME,
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('SuperAdmin user document updated in Firestore.');
    } else {
      console.log('SuperAdmin user document not found in Firestore. Creating...');
      await userDocRef.set({
        uid: userRecord.uid,
        email: SUPERADMIN_EMAIL,
        fullName: SUPERADMIN_FULL_NAME,
        username: SUPERADMIN_USERNAME,
        role: 'superadmin',
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('SuperAdmin user document created in Firestore.');
    }

    console.log('SuperAdmin seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding SuperAdmin:', error);
    process.exit(1);
  }
}

seedSuperAdmin();