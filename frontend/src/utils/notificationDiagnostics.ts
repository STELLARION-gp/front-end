/**
 * Notification Diagnostics Utility
 *
 * Run this in the browser console to diagnose notification issues:
 *
 * import { runNotificationDiagnostics } from './utils/notificationDiagnostics';
 * runNotificationDiagnostics();
 */

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

export async function runNotificationDiagnostics() {
  console.log("🔍 Running Notification Diagnostics...\n");

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("❌ No user logged in");
    return;
  }

  console.log("✅ User ID:", user.uid);
  console.log("✅ User Email:", user.email);
  console.log("\n--- Testing Firestore Queries ---\n");

  try {
    // Test 1: Simple query without filters
    console.log("Test 1: Fetching all notifications for user (no filters)...");
    const simpleQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );

    const simpleSnapshot = await getDocs(simpleQuery);
    console.log(
      `✅ Simple query returned ${simpleSnapshot.docs.length} notifications`
    );

    if (simpleSnapshot.docs.length > 0) {
      console.log("Sample notification:", simpleSnapshot.docs[0].data());
    }
  } catch (error: any) {
    console.error("❌ Simple query failed:", error.code, error.message);

    if (error.code === "permission-denied") {
      console.log("\n🚨 PERMISSION DENIED - Firestore Rules Issue");
      console.log("Fix: Update Firestore security rules in Firebase Console");
      console.log("Navigate to: Firestore Database → Rules\n");
    }
  }

  try {
    // Test 2: Query with orderBy (requires composite index)
    console.log("\nTest 2: Fetching notifications with orderBy...");
    const orderedQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const orderedSnapshot = await getDocs(orderedQuery);
    console.log(
      `✅ Ordered query returned ${orderedSnapshot.docs.length} notifications`
    );
  } catch (error: any) {
    console.error("❌ Ordered query failed:", error.code, error.message);

    if (error.code === "failed-precondition") {
      console.log("\n🚨 MISSING INDEX");
      console.log(
        "Firebase should provide a link to create the index automatically."
      );
      console.log("Check the console for a URL to create the index.\n");
    }
  }

  try {
    // Test 3: Query for unread notifications only
    console.log("\nTest 3: Fetching unread notifications...");
    const unreadQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false)
    );

    const unreadSnapshot = await getDocs(unreadQuery);
    console.log(
      `✅ Unread query returned ${unreadSnapshot.docs.length} notifications`
    );
  } catch (error: any) {
    console.error("❌ Unread query failed:", error.code, error.message);
  }

  console.log("\n--- Diagnostics Complete ---\n");
  console.log(
    "If all tests passed, the issue may be with real-time listeners (onSnapshot)."
  );
  console.log(
    "If tests failed with permission-denied, update Firestore security rules."
  );
  console.log(
    "If tests failed with failed-precondition, create the required composite index."
  );
}

// Make it globally available in console
if (typeof window !== "undefined") {
  (window as any).runNotificationDiagnostics = runNotificationDiagnostics;
}
