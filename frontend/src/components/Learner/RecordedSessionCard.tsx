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
  
  const displayPrice = typeof price === 'number' ? price : 
                      price === null || price === undefined ? null : 
                      Number(price);
  
  const displayDuration = typeof duration === 'number' ? duration : Number(duration);
  
  return (
    <div className="session-card">
      {image && (
        <div className="session-image-wrap">
          <img className="session-image" src={image} alt={title} />
        </div>
      )}
      <div className="session-title">{title}</div>
      <div className="session-meta">
        {date && <span className="session-date">{date}</span>}
        <span className="session-organizer">
          by {instructor}
        </span>
        <span className="session-category">
          {category === 'paid' ? `💰 Paid${displayPrice ? ` Rs ${displayPrice}` : ''}` : '🆓 Free'}
        </span>
        <span className="session-difficulty">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
        {displayDuration && (
          <span className="session-duration">⏱️ {displayDuration} min</span>
        )}
      </div>
      <div className="session-desc">{description}</div>
      {rating > 0 && (
        <div className="session-rating-row">
          <span className="session-rating-label">Rating:</span>
          <span className="session-rating-value">{"  "+rating.toFixed(1) +"  "} / 5</span>
          <span className="session-rating-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < Math.round(rating) ? '#fbbf24' : '#334155', fontSize: '1.1rem' }}>★</span>
            ))}
          </span>
        </div>
      )}
      <div className="session-card-actions">
        <Button onClick={onViewDetails || (() => navigate(`/dashboard/sessions/recorded-sessions/${id}`))}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default RecordedSessionCard;
