import React from "react";
import Button from "../Button";
import PriceIcon from "../../assets/svg/PriceIcon";
import DurationIcon from "../../assets/svg/DurationIcon";
import FreeIcon from "../../assets/svg/FreeIcon";
import StarIcon from "../../assets/svg/StarIcon";


export interface SessionCardProps {
  id?: number;
  title: string;
  date: string;
  organizer: string;
  isInfluencer?: boolean;
  category: string;
  difficulty: string;
  description: string;
  rating?: number;
  duration?: number;
  price?: number | null;
  image?: string;
  onViewDetails?: () => void;
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
  duration,
  price,
  image,
  onViewDetails,
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
        {isInfluencer && (
          <StarIcon 
            className="influencer-badge-icon" 
            size={16}
          />
        )}
      </span>
      <span className="session-category">
        {category === 'paid' ? (
          <>
            <PriceIcon size={14} />
            <span>Paid{price ? ` Rs ${price}` : ''}</span>
          </>
        ) : (
          <>
            <FreeIcon size={14} />
            <span>Free</span>
          </>
        )}
      </span>
      <span className="session-difficulty">
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
      {duration && (
        <span className="session-duration">
          <DurationIcon size={14} />
          <span>{duration} min</span>
        </span>
      )}
    </div>
    <div className="session-desc">{description}</div>
    {rating !== undefined && (
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
      <Button onClick={onViewDetails || (() => {})}>View Details</Button>
    </div>
  </div>
);

export default SessionCard;
