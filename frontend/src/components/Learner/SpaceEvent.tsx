import React from "react";
import "../../styles/components/learner/UpcomingEventCard.scss"

type SpaceEvent = {
  id: number;
  event: string;
  date: string;
};

const UpcomingEventCard: React.FC<{ event: SpaceEvent }> = ({ event }) => (
  <div className="space-event-card">
    <div className="space-event-icon">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#2563eb"/>
        <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div>
      <div className="space-event-title">{event.event}</div>
      <div className="space-event-date">
        {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  </div>
);

export default UpcomingEventCard;

