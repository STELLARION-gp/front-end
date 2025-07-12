import React from "react";
import "../../styles/components/learner/OrganizedEventCard.scss";
import { CalendarDaysIcon, MapPinIcon, MailIcon, UsersIcon } from "lucide-react";
import Button from "../Button";

interface OrganizedEventProps {
  event: {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    date: string;
    location: string;
    contact: string;
    attendees: number;
    description: string;
    sponsors: string[];
  };
}

const OrganizedEventCard: React.FC<{ event: OrganizedEventProps["event"] }> = ({ event }) => {
  return (
    <div className="organized-event-card">
      <img src={event.imageUrl} alt={event.name} className="organized-event-image" />

      <div className="organized-event-body">
        <div className="organized-event-header">
          <h3 className="organized-event-name">{event.name}</h3>
          <span className="organized-event-category">{event.category}</span>
        </div>

        <div className="organized-event-details">
          <div className="organized-detail"><CalendarDaysIcon /> {new Date(event.date).toLocaleDateString()}</div>
          <div className="organized-detail"><MapPinIcon /> {event.location}</div>
          <div className="organized-detail"><MailIcon /> {event.contact}</div>
          <div className="organized-detail"><UsersIcon /> {event.attendees} expected</div>
        </div>

        <p className="organized-event-description">{event.description}</p>

        <div className="organized-event-sponsors">
          <span className="organized-sponsor-label">Sponsored by:</span>
          <div className="organized-sponsor-list">
            {event.sponsors.map((sponsor, idx) => (
              <span key={idx} className="organized-sponsor">{sponsor}</span>
            ))}
          </div>
        </div>

        <Button className="organized-register-btn" onClick={() => alert(`Registering for ${event.name}`)}>
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default OrganizedEventCard;
