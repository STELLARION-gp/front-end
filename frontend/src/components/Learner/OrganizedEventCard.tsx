import React, { useState, useEffect } from "react";
import "../../styles/components/learner/OrganizedEventCard.scss";
import { CalendarDays, MapPin, Mail, Users, Check } from "lucide-react";
import Button from "../Button";
import { eventService, type Event } from "../../services/eventService";
import { auth } from "../../firebase";

interface OrganizedEventProps {
  event: Event;
  onRegistrationChange?: () => void;
}

const OrganizedEventCard: React.FC<OrganizedEventProps> = ({ event, onRegistrationChange }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        checkRegistrationStatus();
        fetchRegistrationCount();
      } else {
        setCheckingStatus(false);
      }
    });

    return () => unsubscribe();
  }, [event.id]);

  const checkRegistrationStatus = async () => {
    try {
      setCheckingStatus(true);
      const status = await eventService.checkRegistrationStatus(event.id);
      setIsRegistered(status.isRegistered);
    } catch (error) {
      console.error('Error checking registration status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const fetchRegistrationCount = async () => {
    try {
      const data = await eventService.getEventRegistrations(event.id);
      setRegistrationCount(data.count);
    } catch (error) {
      console.error('Error fetching registration count:', error);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      alert('Please log in to register for events');
      return;
    }

    if (isRegistered) {
      // Unregister
      if (!window.confirm('Are you sure you want to cancel your registration?')) {
        return;
      }

      setLoading(true);
      try {
        await eventService.unregisterFromEvent(event.id);
        setIsRegistered(false);
        setRegistrationCount(prev => prev - 1);
        alert('Successfully unregistered from event. Check your notifications.');
        if (onRegistrationChange) {
          onRegistrationChange();
        }
      } catch (error: any) {
        alert(error.message || 'Failed to unregister from event');
      } finally {
        setLoading(false);
      }
    } else {
      // Register
      setLoading(true);
      try {
        await eventService.registerForEvent(event.id);
        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
        alert('Successfully registered for event! Check your notifications 🔔');
        if (onRegistrationChange) {
          onRegistrationChange();
        }
      } catch (error: any) {
        alert(error.message || 'Failed to register for event');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getAttendeesText = () => {
    if (event.max_participants) {
      return `${registrationCount}/${event.max_participants} registered`;
    }
    return `${registrationCount} registered`;
  };

  const isEventFull = event.max_participants ? registrationCount >= event.max_participants : false;

  return (
    <div className="organized-event-card">
      <img 
        className="organized-image" 
        src={event.image_urls[0] || 'https://via.placeholder.com/400x300?text=Event+Image'} 
        alt={event.event_name} 
      />

      <div className="organized-top-overlay">
        <div className="organized-header">
          <h3 className="organized-title">{event.event_name}</h3>
          <span className="organized-category">{event.event_category}</span>
        </div>

        <div className="organized-sponsors">
          <span className="sponsored-by-label">Organized by:</span>
          <span className="sponsor-chip">{event.society_name}</span>
        </div>
      </div>

      <div className="organized-hidden-content">
        <div className="organized-details">
          <div className="organized-detail">
            <CalendarDays size={16} /> {formatDate(event.date)} • {event.time}
          </div>
          <div className="organized-detail">
            <MapPin size={16} /> {event.location}
          </div>
          <div className="organized-detail">
            <Mail size={16} /> {event.organized_by}
          </div>
          <div className="organized-detail">
            <Users size={16} /> {getAttendeesText()}
          </div>
        </div>
        <p className="organized-description">{event.description}</p>
        
        {checkingStatus ? (
          <Button className="organized-register-btn" disabled>
            Checking...
          </Button>
        ) : !isAuthenticated ? (
          <Button className="organized-register-btn" onClick={() => alert('Please log in to register')}>
            Login to Register
          </Button>
        ) : isRegistered ? (
          <Button 
            className="organized-register-btn organized-registered-btn" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              <>
                <Check size={16} /> Registered
              </>
            )}
          </Button>
        ) : isEventFull ? (
          <Button className="organized-register-btn" disabled>
            Event Full
          </Button>
        ) : (
          <Button 
            className="organized-register-btn" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Now'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrganizedEventCard;
