import React from "react";
import "../../styles/components/learner/UpcomingSpaceEventCard.scss";
import Button from "../Button";

interface UpcomingSpaceEventCardProps {
  event: string;
  date: string;
  category: string;
  imageUrl: string;
  visibility?: string;
  bestTime?: string;
  duration?: string;
  description?: string;
}

const UpcomingSpaceEventCard: React.FC<UpcomingSpaceEventCardProps> = ({
  event,
  date,
  category,
  imageUrl,
  visibility,
  bestTime,
  duration,
  description,
}) => {
  const handleSetReminder = () => {
    alert(`Reminder set for: ${event} on ${new Date(date).toLocaleDateString()}`);
  };

  return (
    <div className="space-event-card">
      <div className="space-event-card__image">
        <img src={imageUrl} alt={event} />
        <div className="space-event-card__date-badge">
          {new Date(date).toLocaleDateString()}
        </div>
      </div>
      <div className="space-event-card__content">
        <h3 className="space-event-card__title">{event}</h3>
        {description && (
          <p className="space-event-card__description">{description}</p>
        )}

        <div className="space-event-card__details">
          {visibility && (
            <div className="event-detail">
              <span className="event-detail__label">Visibility:</span>
              <span className="event-detail__value">{visibility}</span>
            </div>
          )}
          {bestTime && (
            <div className="event-detail">
              <span className="event-detail__label">Best Time:</span>
              <span className="event-detail__value">{bestTime}</span>
            </div>
          )}
          {duration && (
            <div className="event-detail">
              <span className="event-detail__label">Duration:</span>
              <span className="event-detail__value">{duration}</span>
            </div>
          )}
        </div>

        <div className="space-event-card__actions">
          <Button onClick={handleSetReminder} className="space-event-btn">
            Set Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSpaceEventCard;
