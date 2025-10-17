// Notification Types (Frontend)

export const NotificationPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type NotificationPriority =
  (typeof NotificationPriority)[keyof typeof NotificationPriority];

export const NotificationType = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  SYSTEM: "system",
  SOCIAL: "social",
  PAYMENT: "payment",
  EVENT: "event",
  MESSAGE: "message",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationMetadata {
  source?: string;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  color?: string;
  link?: string;
  read: boolean;
  metadata?: NotificationMetadata;
  createdAt: Date;
  updatedAt?: Date;
  expiresAt?: Date;
}

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  color?: string;
  link?: string;
  metadata?: NotificationMetadata;
  expiresAt?: Date;
}

// Helper function to get color based on type and priority
export function getNotificationColor(
  type: NotificationType,
  priority: NotificationPriority,
  customColor?: string
): string {
  if (customColor) return customColor;

  const priorityColors: Record<NotificationPriority, string> = {
    [NotificationPriority.LOW]: "#6B7280",
    [NotificationPriority.MEDIUM]: "#3B82F6",
    [NotificationPriority.HIGH]: "#F59E0B",
    [NotificationPriority.URGENT]: "#EF4444",
  };

  const typeColors: Record<NotificationType, string> = {
    [NotificationType.INFO]: "#3B82F6",
    [NotificationType.SUCCESS]: "#10B981",
    [NotificationType.WARNING]: "#F59E0B",
    [NotificationType.ERROR]: "#EF4444",
    [NotificationType.SYSTEM]: "#8B5CF6",
    [NotificationType.SOCIAL]: "#EC4899",
    [NotificationType.PAYMENT]: "#10B981",
    [NotificationType.EVENT]: "#06B6D4",
    [NotificationType.MESSAGE]: "#6366F1",
  };

  return typeColors[type] || priorityColors[priority];
}

// Helper to get icon based on notification type
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    [NotificationType.INFO]: "📢",
    [NotificationType.SUCCESS]: "✅",
    [NotificationType.WARNING]: "⚠️",
    [NotificationType.ERROR]: "❌",
    [NotificationType.SYSTEM]: "⚙️",
    [NotificationType.SOCIAL]: "👥",
    [NotificationType.PAYMENT]: "💳",
    [NotificationType.EVENT]: "📅",
    [NotificationType.MESSAGE]: "💬",
  };

  return icons[type] || "📢";
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
