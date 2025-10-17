import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

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

// Firestore instance with long polling to fix QUIC protocol errors
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  experimentalForceLongPolling: true, // Fix for ERR_QUIC_PROTOCOL_ERROR
});

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
// Add additional parameters for better compatibility
googleProvider.setCustomParameters({
  prompt: "select_account",
});

console.log("🔧 Firebase initialized with config:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

export { app, auth, analytics, googleProvider, db };
