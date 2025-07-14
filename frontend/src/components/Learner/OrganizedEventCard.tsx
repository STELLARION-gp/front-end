import React, { useState } from "react";
import "../../styles/components/learner/OrganizedEventCard.scss";
import { CalendarDays, MapPin, Mail, Users } from "lucide-react";
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
      <img className="organized-image" src={event.imageUrl} alt={event.name} />

      <div className="organized-top-overlay">
        <div className="organized-header">
          <h3 className="organized-title">{event.name}</h3>
          <span className="organized-category">{event.category}</span>
        </div>

        <div className="organized-sponsors">
            <span className="sponsored-by-label">Sponsored by:</span>
            {event.sponsors.map((sponsor, idx) => (
                <span className="sponsor-chip" key={idx}>{sponsor}</span>
            ))}
        </div>

      </div>

      <div className="organized-hidden-content">
        <div className="organized-details">
          <div className="organized-detail"><CalendarDays size={16} /> {new Date(event.date).toLocaleDateString()}</div>
          <div className="organized-detail"><MapPin size={16} /> {event.location}</div>
          <div className="organized-detail"><Mail size={16} /> {event.contact}</div>
          <div className="organized-detail"><Users size={16} /> {event.attendees} expected</div>
        </div>
        <p className="organized-description">{event.description}</p>
        <Button className="organized-register-btn" onClick={() => alert(`Registering for ${event.name}`)}>
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default OrganizedEventCard;
