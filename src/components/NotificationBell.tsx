import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { NotificationService } from "../services/notificationService";
import type { Notification } from "../types/notification.types";
import { NotificationDropdown } from "./NotificationDropdown";
import { SparklesIcon } from "@heroicons/react/24/outline";
import "../styles/components/notificationBell.scss";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to unread count
    const unsubscribeCount = NotificationService.subscribeToUnreadCount(
      user.uid,
      (count) => {
        console.log("🔔 Unread count updated:", count);
        setUnreadCount(count);
      }
    );

    // Subscribe to notifications (limit to recent 20)
    const unsubscribeNotifications =
      NotificationService.subscribeToNotifications(
        user.uid,
        (notifications) => {
          console.log(
            "🔔 NotificationBell received notifications:",
            notifications.length
          );
          console.log("🔔 Notifications data:", notifications);
          setNotifications(notifications);
        },
        { limit: 20 }
      );

    return () => {
      unsubscribeCount();
      unsubscribeNotifications();
    };
  }, [user?.uid]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown when scrolling (especially on home page)
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        // Close dropdown when user scrolls
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  // Debug logging
  console.log("🔔 NotificationBell render:", {
    isOpen,
    unreadCount,
    totalNotifications: notifications.length,
    user: user.uid,
  });

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className={`notification-bell-button ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <SparklesIcon className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
