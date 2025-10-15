// Notification Service (Frontend)
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  limit as firestoreLimit,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "../firebase";
import type {
  Notification,
  NotificationType,
  NotificationPriority,
} from "../types/notification.types";

const NOTIFICATIONS_COLLECTION = "notifications";

export class NotificationService {
  /**
   * Subscribe to real-time notifications for a user
   */
  static subscribeToNotifications(
    userId: string,
    onUpdate: (notifications: Notification[]) => void,
    options?: {
      read?: boolean;
      type?: NotificationType;
      priority?: NotificationPriority;
      limit?: number;
    }
  ): Unsubscribe {
    try {
      let notificationQuery = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      // Apply filters
      if (options?.read !== undefined) {
        notificationQuery = query(
          notificationQuery,
          where("read", "==", options.read)
        );
      }

      if (options?.type) {
        notificationQuery = query(
          notificationQuery,
          where("type", "==", options.type)
        );
      }

      if (options?.priority) {
        notificationQuery = query(
          notificationQuery,
          where("priority", "==", options.priority)
        );
      }

      if (options?.limit) {
        notificationQuery = query(
          notificationQuery,
          firestoreLimit(options.limit)
        );
      }

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        notificationQuery,
        (snapshot) => {
          console.log("📬 Notifications received:", snapshot.docs.length);

          const notifications: Notification[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Notification data:", { id: doc.id, data });

            return {
              id: doc.id,
              userId: data.userId,
              title: data.title,
              message: data.message,
              type: data.type,
              priority: data.priority,
              color: data.color,
              link: data.link,
              read: data.read || false, // Ensure boolean value
              metadata: data.metadata,
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate()
                  : new Date(data.createdAt),
              updatedAt:
                data.updatedAt instanceof Timestamp
                  ? data.updatedAt.toDate()
                  : data.updatedAt
                  ? new Date(data.updatedAt)
                  : undefined,
              expiresAt:
                data.expiresAt instanceof Timestamp
                  ? data.expiresAt.toDate()
                  : data.expiresAt
                  ? new Date(data.expiresAt)
                  : undefined,
            };
          });

          console.log("✅ Parsed notifications:", notifications.length);

          // Filter out expired notifications
          const validNotifications = notifications.filter((n) => {
            if (!n.expiresAt) return true;
            return new Date() <= n.expiresAt;
          });

          console.log("✅ Valid notifications:", validNotifications.length);
          onUpdate(validNotifications);
        },
        (error) => {
          console.error("Error in notifications listener:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to notifications:", error);
      throw error;
    }
  }

  /**
   * Subscribe to unread notification count
   */
  static subscribeToUnreadCount(
    userId: string,
    onUpdate: (count: number) => void
  ): Unsubscribe {
    try {
      const notificationQuery = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(
        notificationQuery,
        (snapshot) => {
          // Filter out expired notifications
          let count = 0;
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const expiresAt =
              data.expiresAt instanceof Timestamp
                ? data.expiresAt.toDate()
                : data.expiresAt
                ? new Date(data.expiresAt)
                : null;

            if (!expiresAt || new Date() <= expiresAt) {
              count++;
            }
          });

          onUpdate(count);
        },
        (error) => {
          console.error("Error in unread count listener:", error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error subscribing to unread count:", error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark a notification as unread
   */
  static async markAsUnread(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(notificationRef, {
        read: false,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
