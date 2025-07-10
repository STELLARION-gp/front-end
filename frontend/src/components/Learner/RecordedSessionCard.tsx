import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

export interface RecordedSessionCardProps {
  id: string;
  title: string;
  date: string;
  instructor: string;
  category: string;
  difficulty: string;
  description: string;
  rating: number;
  image?: string;
  price: string;
  duration: string;
}

const RecordedSessionCard: React.FC<RecordedSessionCardProps> = ({
  id,
  title,
  date,
  instructor,
  category,
  difficulty,
  description,
  rating,
  image,
  price,
  duration,
}) => {
  const navigate = useNavigate();
  return (
    <div className="recorded-session-card">
      {image && (
        <div className="recorded-session-image-wrap">
          <img className="recorded-session-image" src={image} alt={title} />
        </div>
    )}
    <div className="recorded-session-title">{title}</div>
    <div className="recorded-session-meta">
      <span className="recorded-session-date">{date}</span>
      <span className="recorded-session-instructor">
        by {instructor}
      </span>
      <span className="recorded-session-category">{category}</span>
      <span className="recorded-session-difficulty">{difficulty}</span>
      <span className="recorded-session-duration">Duration: {duration}</span>
    </div>
    <div className="recorded-session-desc">{description}</div>
    <div className="recorded-session-rating-row">
      <span className="recorded-session-rating-label">Rating:</span>
      <span className="recorded-session-rating-value">{rating.toFixed(1)} / 5</span>
      <span className="recorded-session-rating-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < Math.round(rating) ? 'star-filled' : 'star-empty'}
          >
            ★
          </span>
        ))}
      </span>
    </div>
    <div className="recorded-session-purchase-row">
      <span className="recorded-session-price">{price}</span>
      <Button onClick={() => navigate(`/dashboard/sessions/recorded-sessions/${id}`)}>Buy Session</Button>
    </div>
  </div>
);
}
export default RecordedSessionCard;
