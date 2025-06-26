import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase config
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

// Conditionally initialize analytics (only in browser, not SSR)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Auth instance
const auth = getAuth(app);

export { app, auth, analytics };
