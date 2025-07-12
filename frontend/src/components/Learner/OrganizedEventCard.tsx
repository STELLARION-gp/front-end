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
      <div className="organized-event-image">
        <img src={event.imageUrl} alt={event.name} />
      </div>

      <div className="organized-event-content">
        <div className="organized-header">
          <h3 className="organized-title">{event.name}</h3>
          <span className="organized-category">{event.category}</span>
        </div>

        <div className="organized-details">
          <div className="organized-detail"><CalendarDaysIcon size={16} /> {new Date(event.date).toLocaleDateString()}</div>
          <div className="organized-detail"><MapPinIcon size={16} /> {event.location}</div>
          <div className="organized-detail"><MailIcon size={16} /> {event.contact}</div>
          <div className="organized-detail"><UsersIcon size={16} /> {event.attendees} expected</div>
        </div>

        <p className="organized-description">{event.description}</p>

        <div className="organized-sponsors">
          <span>Sponsored by: </span>
          {event.sponsors.map((sponsor, index) => (
            <span key={index} className="organized-sponsor-tag">{sponsor}</span>
          ))}
        </div>

        <div className="organized-action">
          <Button onClick={() => alert(`Registering for ${event.name}`)} className="organized-register-btn">
            Register Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizedEventCard;
