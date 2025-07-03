// Firebase Test Users Creation Script
// Run this with: node create-test-users.js

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";

// Your Firebase config (same as in firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyBadpzMDQbSPAUm7ZnVg5JrTx4aYI9Fw9M",
  authDomain: "stellarion-b76d6.firebaseapp.com",
  projectId: "stellarion-b76d6",
  storageBucket: "stellarion-b76d6.firebasestorage.app",
  messagingSenderId: "878329880283",
  appId: "1:878329880283:web:657ca38190719f2b5036fe",
  measurementId: "G-SJ5C76NF7G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Test users to create
const testUsers = [
  { email: 'admin@gmail.com', password: 'admin123', displayName: 'Admin User' },
  { email: 'moderator@gmail.com', password: 'moderator', displayName: 'Moderator User' },
  { email: 'mentor@gmail.com', password: 'mentor', displayName: 'Mentor User' },
  { email: 'influencer@gmail.com', password: 'influencer', displayName: 'Influencer User' },
  { email: 'guide@gmail.com', password: 'guide123', displayName: 'Guide User' },
  { email: 'enthusiast@gmail.com', password: 'enthusiast', displayName: 'Enthusiast User' },
  { email: 'learner@gmail.com', password: 'learner', displayName: 'Learner User' }
];

async function createTestUsers() {
  console.log('🔥 Creating Firebase test users...\n');
  
  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(userCredential.user, { displayName: user.displayName });
      console.log(`✅ Successfully created: ${user.email}\n`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}`);
        
        // Test if we can sign in with existing user
        try {
          await signInWithEmailAndPassword(auth, user.email, user.password);
          console.log(`✅ Existing user sign-in works: ${user.email}\n`);
        } catch (signInError) {
          console.log(`❌ Existing user sign-in failed: ${user.email} - ${signInError.message}\n`);
        }
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
        console.log(''); // Empty line for readability
      }
    }
  }
  
  console.log('🎉 Finished processing all test users!');
  console.log('\n📋 Test Credentials Summary:');
  console.log('================================');
  testUsers.forEach(user => {
    console.log(`${user.displayName.padEnd(20)} | ${user.email.padEnd(25)} | ${user.password}`);
  });
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Set USE_MOCK_PROFILE = false in AuthContext.tsx');
  console.log('2. Try logging in with any of the above credentials');
  console.log('3. The auto-creation feature should also work now!');
  
  process.exit(0);
}

// Run the script
createTestUsers().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
