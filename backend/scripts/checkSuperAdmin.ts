import * as admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS as string));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

async function checkSuperAdmin() {
  try {
    const usersSnapshot = await db.collection('users').get();
    
    console.log('\n=== All Users in Firestore ===\n');
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`UID: ${doc.id}`);
      console.log(`Email: ${data.email}`);
      console.log(`Username: ${data.username}`);
      console.log(`Role: ${data.role}`);
      console.log(`Active: ${data.active}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSuperAdmin();
