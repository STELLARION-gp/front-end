import React from "react";
import "../../styles/pages/mentor/MentorNotification.scss";

interface MentorNotificationProps {
  name: string;
  message: string;
  time?: string;
}

const notifications = [
  {
    name: "Alice",
    message: "Your session request has been approved!",
    time: "2 min ago",
  },
  {
    name: "Bob",
    message: "New mentee has joined your group.",
    time: "10 min ago",
  },
  {
    name: "Charlie",
    message: "Session feedback received.",
    time: "1 hour ago",
  },
];

const MentorNotification: React.FC = () => {
  return (
    <div className="mentor-notification-container">
      <h2 style={{ color: '#fff', marginBottom: 24 }}>Notifications</h2>
      {notifications.map((n, i) => (
        <div className="mentor-notification" key={i}>
          <div className="mentor-notification__content">
            <div className="mentor-notification__header">
              <span className="mentor-notification__name">{n.name}</span>
              {n.time && <span className="mentor-notification__time">{n.time}</span>}
            </div>
            <div className="mentor-notification__message">{n.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentorNotification; 