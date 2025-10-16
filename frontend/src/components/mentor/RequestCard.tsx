import React from "react";
import "../../styles/components/mentor/RequestCard.scss";

interface RequestCardProps {
  request: {
    id: number;
    name: string;
    email: string;
    level: string;
    interests: string;
    details: string;
    motivation: string;
    background: string;
    requestDate: string;
    urgency: 'high' | 'medium' | 'low';
    expectedDuration: string;
    preferredMeetingTime: string;
    goals: string;
    image?: string;
  };
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
  onViewDetails: (requestId: number) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onAccept, 
  onReject, 
  onViewDetails 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="request-card request-card--modern">
      <div className="request-card__urgency-badge">
        <span 
          className="urgency-indicator"
          style={{ backgroundColor: getUrgencyColor(request.urgency) }}
        >
          {request.urgency}
        </span>
        <span className="request-date">
          {formatDate(request.requestDate)}
        </span>
      </div>

      <div className="request-card__avatar-section">
        {request.image && (
          <img 
            src={request.image} 
            alt={request.name} 
            className="request-card__image" 
          />
        )}
        <div className="request-card__level-badge">
          {request.level}
        </div>
      </div>

      <div className="request-card__content">
        <h3 className="request-card__name">{request.name}</h3>
        
        <div className="request-card__email">
          {request.email}
        </div>
        
        <div className="request-card__interests">
          <strong>Interests:</strong> {request.interests}
        </div>
        
        <div className="request-card__details">
          {request.details}
        </div>

        <div className="request-card__motivation">
          <strong>Motivation:</strong>
          <p>{request.motivation}</p>
        </div>
        
        <div className="request-card__meta">
          <div className="meta-item">
            <strong>Duration:</strong> {request.expectedDuration}
          </div>
          <div className="meta-item">
            <strong>Meeting Time:</strong> {request.preferredMeetingTime}
          </div>
        </div>

        <div className="request-card__goals">
          <strong>Goals:</strong> {request.goals}
        </div>

        <div className="request-card__actions">
          <button 
            className="request-card__btn request-card__btn--details"
            onClick={() => onViewDetails(request.id)}
          >
            View Details
          </button>
          
          <button 
            className="request-card__btn request-card__btn--accept"
            onClick={() => onAccept(request.id)}
          >
            Accept
          </button>
          
          <button 
            className="request-card__btn request-card__btn--reject"
            onClick={() => onReject(request.id)}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;