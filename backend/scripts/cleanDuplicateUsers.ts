import * as admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = require(path.resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS as string));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
});

const auth = admin.auth();
const db = admin.firestore();

async function cleanDuplicateUsers() {
  try {
    console.log('\n=== Checking for duplicate users ===\n');

    // Get all users from Firebase Auth
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users;

    console.log(`Total users in Firebase Auth: ${users.length}\n`);

    // Group by email
    const emailMap = new Map<string, admin.auth.UserRecord[]>();
    
    users.forEach((user) => {
      if (user.email) {
        if (!emailMap.has(user.email)) {
          emailMap.set(user.email, []);
        }
        emailMap.get(user.email)!.push(user);
      }
    });

    // Find duplicates
    const duplicates: string[] = [];
    emailMap.forEach((userList, email) => {
      if (userList.length > 1) {
        duplicates.push(email);
        console.log(`\n⚠️  Duplicate email found: ${email}`);
        console.log(`   Number of accounts: ${userList.length}`);
        
        userList.forEach((user, index) => {
          console.log(`\n   Account ${index + 1}:`);
          console.log(`   UID: ${user.uid}`);
          console.log(`   Created: ${user.metadata.creationTime}`);
          console.log(`   Last Sign In: ${user.metadata.lastSignInTime}`);
          console.log(`   Provider: ${user.providerData.map(p => p.providerId).join(', ')}`);
        });
      }
    });

    if (duplicates.length === 0) {
      console.log('\n✅ No duplicate users found!\n');
      process.exit(0);
      return;
    }

    console.log(`\n\n=== Found ${duplicates.length} duplicate email(s) ===\n`);

    // For pedrolpompeu@gmail.com, keep only the one with Firestore document
    const targetEmail = 'pedrolpompeu@gmail.com';
    const targetUsers = emailMap.get(targetEmail);

    if (targetUsers && targetUsers.length > 1) {
      console.log(`\n🔧 Fixing ${targetEmail}...\n`);

      // Find which one has Firestore document
      let userWithFirestore: admin.auth.UserRecord | null = null;

      for (const user of targetUsers) {
        const docRef = db.collection('users').doc(user.uid);
        const doc = await docRef.get();
        
        if (doc.exists) {
          const data = doc.data();
          console.log(`   ✅ UID ${user.uid} has Firestore document (role: ${data?.role})`);
          userWithFirestore = user;
        } else {
          console.log(`   ❌ UID ${user.uid} has NO Firestore document`);
        }
      }

      if (userWithFirestore) {
        console.log(`\n   Keeping UID: ${userWithFirestore.uid}`);
        
        // Delete others
        for (const user of targetUsers) {
          if (user.uid !== userWithFirestore.uid) {
            console.log(`   🗑️  Deleting UID: ${user.uid}`);
            // Uncomment to actually delete:
            // await auth.deleteUser(user.uid);
            console.log(`   ⚠️  SKIPPED (uncomment to delete)`);
          }
        }
      }
    }

    console.log('\n=== Done ===\n');
    console.log('To actually delete duplicate users, uncomment the deleteUser line in the script.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanDuplicateUsers();
