import React from "react";
import Button from "../Button";


export interface SessionCardProps {
  title: string;
  date: string;
  organizer: string;
  isInfluencer?: boolean;
  category: string;
  difficulty: string;
  description: string;
  rating: number;
  image?: string;
  // onRegister?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  title,
  date,
  organizer,
  isInfluencer,
  category,
  difficulty,
  description,
  rating,
  image,
  // onRegister,
}) => (
  <div className="session-card">
    {image && (
      <div className="session-image-wrap">
        <img className="session-image" src={image} alt={title} />
      </div>
    )}
    <div className="session-title">{title}</div>
    <div className="session-meta">
      <span className="session-date">{date}</span>
      <span className="session-organizer">
        by {organizer}{" "}
        {isInfluencer && <span className="influencer-badge">🌟</span>}
      </span>
      <span className="session-category">{category}</span>
      <span className="session-difficulty">{difficulty}</span>
    </div>
    <div className="session-desc">{description}</div>
    <div className="session-rating-row">
      <span className="session-rating-label">Rating:</span>
      <span className="session-rating-value">{"  "+rating.toFixed(1) +"  "} / 5</span>
      <span className="session-rating-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < Math.round(rating) ? '#fbbf24' : '#334155', fontSize: '1.1rem' }}>★</span>
        ))}
      </span>
    </div>
    <div className="session-card-actions">
      <Button onClick={() => {}}>Register Now</Button>
      <Button>🔔 Reminder</Button>
    </div>
  </div>
);

export default SessionCard;
