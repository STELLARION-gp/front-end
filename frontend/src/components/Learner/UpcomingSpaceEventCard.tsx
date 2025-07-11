import React from "react";
import "../../styles/components/learner/UpcomingSpaceEventCard.scss";
import Button from "../Button";

interface UpcomingSpaceEventCardProps {
  event: string;
  date: string;
  category: string;
  visibility?: string;
  bestTime?: string;
  duration?: string;
  description?: string;
}

const categoryIcons: Record<string, string> = {
  meteor: "☄️",
  eclipse: "🌑",
  moon: "🌕",
  meetup: "👥",
};

const UpcomingSpaceEventCard: React.FC<UpcomingSpaceEventCardProps> = ({
  event,
  date,
  category,
  visibility,
  bestTime,
  duration,
  description,
}) => {
  const icon = categoryIcons[category] || "🌌";

  const handleSetReminder = () => {
    alert(`Reminder set for: ${event} on ${new Date(date).toLocaleDateString()}`);
  };

  return (
    <div className="space-event-card">
      <div className="space-event-icon">{icon}</div>
      <div className="space-event-info">
        <h3 className="space-event-title">{event}</h3>
        <p className="space-event-date">📅 {new Date(date).toLocaleDateString()}</p>
        {description && <p className="space-event-description">{description}</p>}
        <div className="space-event-details">
          {visibility && <p><strong>Visibility:</strong> {visibility}</p>}
          {bestTime && <p><strong>Best Time:</strong> {bestTime}</p>}
          {duration && <p><strong>Duration:</strong> {duration}</p>}
        </div>
        <div className="space-event-actions">
          <Button onClick={handleSetReminder} className="space-event-btn">Set Reminder</Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSpaceEventCard;