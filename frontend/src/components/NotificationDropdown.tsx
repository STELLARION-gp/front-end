import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../types/notification.types";
import {
  getNotificationColor,
  formatRelativeTime,
} from "../types/notification.types";
import { NotificationService } from "../services/notificationService";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useChatbotContext } from "../contexts/ChatbotContext";
import "../styles/components/notificationDropdown.scss";

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationDropdown = ({
  notifications,
  onClose,
}: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const { openChatbot } = useChatbotContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Debug logging
  console.log("🔔 NotificationDropdown rendered");
  console.log("📊 Total notifications received:", notifications.length);
  console.log("📋 Notifications data:", notifications);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read and schedule deletion after 1 day
    if (!notification.read) {
      try {
        await NotificationService.markAsReadWithAutoDelete(notification.id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Toggle expanded view
    if (expandedId === notification.id) {
      setExpandedId(null);
    } else {
      setExpandedId(notification.id);
    }

    // Handle navigation or chatbot opening
    if (notification.link && expandedId !== notification.id) {
      onClose();

      // Check if it's a chatbot-related notification
      if (
        notification.link.includes("chatbot") ||
        notification.type === "message" ||
        notification.metadata?.source === "chatbot"
      ) {
        openChatbot();
      } else {
        navigate(notification.link);
      }
    }
  };

  // Show all notification types (no filter by type)
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  console.log("📌 Unread count:", unreadNotifications.length);
  console.log("📌 Read count:", readNotifications.length);
  console.log("📌 Sample notification:", notifications[0]);

  const isEmpty = notifications.length === 0;

  return (
    <div className={`notification-dropdown ${isEmpty ? "empty" : ""}`}>
      <div className="notification-dropdown-header">
        <h3>Notifications</h3>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <XMarkIcon className="close-icon" />
        </button>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <div className="empty-space-animation">
              <div className="planet"></div>
              <div className="stars">
                <span className="star star-1">✦</span>
                <span className="star star-2">✧</span>
                <span className="star star-3">✦</span>
                <span className="star star-4">✧</span>
                <span className="star star-5">✦</span>
              </div>
            </div>
            <p className="empty-title">All Clear!</p>
            <p className="empty-subtitle">No notifications at the moment</p>
          </div>
        ) : (
          <>
            {/* Always show section title if there are notifications */}
            <div className="notification-section">
              {unreadNotifications.length > 0 && (
                <h4 className="section-title">
                  New ({unreadNotifications.length})
                </h4>
              )}
              {unreadNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isExpanded={expandedId === notification.id}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </div>

            {readNotifications.length > 0 && (
              <div className="notification-section">
                <h4 className="section-title">
                  Earlier ({readNotifications.length})
                </h4>
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isExpanded={expandedId === notification.id}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  isExpanded: boolean;
  onClick: () => void;
}

const NotificationTypeBadge = ({ type }: { type: string }) => {
  const typeMap: Record<string, string> = {
    event: 'Event',
    system: 'System',
    success: 'Success',
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    social: 'Social',
    payment: 'Payment',
    message: 'Message',
    booking: 'Booking',
  };
  return (
    <span className={`notification-type-badge type-${type}`}>{typeMap[type] || type}</span>
  );
};

const NotificationItem = ({
  notification,
  isExpanded,
  onClick,
}: NotificationItemProps) => {
  const color = getNotificationColor(
    notification.type,
    notification.priority,
    notification.color
  );
  const timeAgo = formatRelativeTime(notification.createdAt);

  return (
    <div
      className={`notification-item ${!notification.read ? "unread" : ""} ${
        isExpanded ? "expanded" : ""
      }`}
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      <div className="notification-content">
        <div className="notification-header">
          <h5 className="notification-title">{notification.title}</h5>
          <span className="notification-time">{timeAgo}</span>
          <NotificationTypeBadge type={notification.type} />
        </div>

        <p className={`notification-message ${isExpanded ? "expanded" : ""}`}>
          {notification.message}
        </p>

        {isExpanded && notification.metadata && (
          <div className="notification-metadata">
            {notification.metadata.imageUrl && (
              <img
                src={notification.metadata.imageUrl}
                alt="Notification"
                className="notification-image"
              />
            )}
            {notification.metadata.source && (
              <p className="metadata-item">
                <strong>Source:</strong> {notification.metadata.source}
              </p>
            )}
            {notification.metadata.entityType && (
              <p className="metadata-item">
                <strong>Type:</strong> {notification.metadata.entityType}
              </p>
            )}
          </div>
        )}
      </div>

      {notification.priority === "urgent" && (
        <div className="urgent-indicator">!</div>
      )}
    </div>
  );
};
