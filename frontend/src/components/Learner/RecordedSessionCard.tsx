import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

export interface RecordedSessionCardProps {
  id: number | string;
  title: string;
  date?: string;
  instructor: string;
  category: string;
  difficulty: string;
  description: string;
  rating?: number;
  image?: string;
  price: number | string | null | undefined;
  duration: number | string;
  onViewDetails?: () => void;
}

const RecordedSessionCard: React.FC<RecordedSessionCardProps> = ({
  id,
  title,
  date,
  instructor,
  category,
  difficulty,
  description,
  rating = 0,
  image,
  price,
  duration,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  
  const displayPrice = typeof price === 'number' ? `Rs ${price}` : 
                      price === null || price === undefined ? 'Free' : 
                      price;
  
  const displayDuration = typeof duration === 'number' ? `${duration} min` : duration;
  
  return (
    <div className="recorded-session-card">
      {image && (
        <div className="recorded-session-image-wrap">
          <img className="recorded-session-image" src={image} alt={title} />
        </div>
    )}
    <div className="recorded-session-title">{title}</div>
    <div className="recorded-session-meta">
      {date && <span className="recorded-session-date">{date}</span>}
      <span className="recorded-session-instructor">
        by {instructor}
      </span>
      <span className="recorded-session-category">
        {category === 'paid' ? '💰 Paid' : '🆓 Free'}
      </span>
      <span className="recorded-session-difficulty">
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
      <span className="recorded-session-duration">⏱️ {displayDuration}</span>
    </div>
    <div className="recorded-session-desc">{description}</div>
    {rating > 0 && (
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
    )}
    <div className="recorded-session-purchase-row">
      <span className="recorded-session-price">{displayPrice}</span>
      <Button onClick={onViewDetails || (() => navigate(`/dashboard/sessions/recorded-sessions/${id}`))}>
        View Details
      </Button>
    </div>
  </div>
);
}
export default RecordedSessionCard;
