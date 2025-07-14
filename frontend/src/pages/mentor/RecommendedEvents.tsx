import React from 'react';
import { useRecommendedEvents } from '../../contexts/mentor/RecommendedEventsContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/mentor/recommendedEvents.scss';

const RecommendedEvents: React.FC = () => {
  const { recommendedEvents } = useRecommendedEvents();
  const navigate = useNavigate();

  return (
    <div className="recommended-events-page">
      <div className="recommended-events-header">
        <h2>Recommended Events</h2>
        <button
          className="recommend-events-btn"
          onClick={() => navigate('/dashboard/recommend-events')}
        >
          Recommend Events
        </button>
      </div>
      <div className="recommended-events-list">
        {recommendedEvents.length === 0 ? (
          <div className="no-events">No recommended events yet. Click "Recommend Events" to add.</div>
        ) : (
          recommendedEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-title">{event.title}</div>
              <div className="event-desc">{event.description}</div>
              <button className="event-details-btn" disabled>
                Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedEvents; 