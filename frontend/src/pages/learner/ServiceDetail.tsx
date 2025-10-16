import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { getServiceById, getServiceAvailability } from '../../services/servicesService';
import type { Service, ServiceAvailability } from '../../services/servicesService';
import '../../styles/pages/learner/ServiceDetail.scss';

// Icons
const StarIcon: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13 16v-1.5a2.5 2.5 0 00-2.5-2.5h-7A2.5 2.5 0 001 14.5V16M11 7A4 4 0 103 7a4 4 0 008 0z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailability | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [serviceData, availabilityData] = await Promise.all([
          getServiceById(parseInt(id)),
          getServiceAvailability(parseInt(id), { available_only: true })
        ]);
        
        setService(serviceData);
        setAvailability(availabilityData);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  const handleBooking = (slot: ServiceAvailability) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon key={i} filled={i < Math.floor(rating)} />
    ));
  };

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-error">
        <h2>Error</h2>
        <p>{error || 'Service not found'}</p>
        <Button onClick={() => navigate('/dashboard/astronomy-services')}>
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="service-detail">
      <div className="service-detail-container">
        {/* Header */}
        <div className="service-detail-header">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard/astronomy-services')}
            className="back-button"
          >
            <ArrowLeftIcon />
            Back to Services
          </Button>
        </div>

        {/* Service Image */}
        <div className="service-image-section">
          <img src={service.image_url} alt={service.title} />
          {service.featured && (
            <div className="featured-badge">
              <StarIcon filled />
              Featured
            </div>
          )}
        </div>

        {/* Service Info */}
        <div className="service-info-section">
          <div className="service-header-info">
            <div className="title-rating">
              <h1>{service.title}</h1>
              {service.rating && service.rating > 0 && (
                <div className="rating-display">
                  <div className="stars">{renderStars(service.rating)}</div>
                  <span className="rating-number">{service.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="price-section">
              <span className="price">${service.price}</span>
              <span className="price-label">per session</span>
            </div>
          </div>

          {/* Guide Info */}
          {service.creator && (
            <div className="guide-info">
              <h3>Your Guide</h3>
              <div className="guide-details">
                <div className="guide-name">
                  {service.creator.display_name || `${service.creator.first_name} ${service.creator.last_name}`}
                </div>
                <div className="guide-email">{service.creator.email}</div>
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="key-details">
            <div className="detail-item">
              <ClockIcon />
              <span>{service.duration}</span>
            </div>
            <div className="detail-item">
              <UsersIcon />
              <span>Max {service.max_participants} participants</span>
            </div>
            <div className="detail-item">
              <LocationIcon />
              <span>{service.location}</span>
            </div>
            <div className="detail-item">
              <div className={`difficulty-badge ${service.difficulty.toLowerCase()}`}>
                {service.difficulty}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>About This Service</h3>
            <p>{service.description}</p>
          </div>

          {/* What to Expect */}
          {service.what_to_expect && (
            <div className="what-to-expect-section">
              <h3>What to Expect</h3>
              <p>{service.what_to_expect}</p>
            </div>
          )}

          {/* Equipment */}
          {service.equipment && service.equipment.length > 0 && (
            <div className="equipment-section">
              <h3>Equipment Provided</h3>
              <div className="equipment-list">
                {service.equipment.map((item, index) => (
                  <span key={index} className="equipment-item">{item}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="tags-section">
              <div className="tags-list">
                {service.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {service.requirements && (
            <div className="requirements-section">
              <h3>Requirements</h3>
              <p>{service.requirements}</p>
            </div>
          )}

          {/* Cancellation Policy */}
          {service.cancellation_policy && (
            <div className="policy-section">
              <h3>Cancellation Policy</h3>
              <p>{service.cancellation_policy}</p>
            </div>
          )}
        </div>

        {/* Availability Section */}
        <div className="availability-section">
          <h2>
            <CalendarIcon />
            Available Time Slots
          </h2>
          {availability.length > 0 ? (
            <div className="availability-grid">
              {availability.map((slot) => (
                <div key={slot.id} className="availability-card">
                  <div className="slot-date">{formatDate(slot.available_date)}</div>
                  <div className="slot-time">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                  <div className="slot-info">
                    <span className="slots-available">
                      {slot.slots_available - slot.slots_booked} spots left
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleBooking(slot)}
                    disabled={slot.slots_available - slot.slots_booked === 0}
                  >
                    {slot.slots_available - slot.slots_booked === 0 ? 'Fully Booked' : 'Book Now'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-availability">
              <p>No available time slots at the moment.</p>
              <p>Please check back later or contact the guide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <BookingModal
          service={service}
          slot={selectedSlot}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedSlot(null);
            // Refresh availability
            if (id) {
              getServiceAvailability(parseInt(id), { available_only: true })
                .then(setAvailability)
                .catch(console.error);
            }
          }}
        />
      )}
    </div>
  );
};

// Booking Modal Component
interface BookingModalProps {
  service: Service;
  slot: ServiceAvailability;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, slot, onClose, onSuccess }) => {
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableSpots = slot.slots_available - slot.slots_booked;
  const totalPrice = service.price * participants;

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement booking API call
      console.log('Booking:', {
        service_id: service.id,
        availability_id: slot.id,
        participants,
        total_price: totalPrice
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Booking successful! Payment will be processed.');
      onSuccess();
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Your Session</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="booking-summary">
            <h3>{service.title}</h3>
            <div className="booking-details">
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">{formatDate(slot.available_date)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time:</span>
                <span className="value">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Duration:</span>
                <span className="value">{service.duration}</span>
              </div>
              <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">{service.location}</span>
              </div>
            </div>
          </div>

          <div className="participants-selector">
            <label>Number of Participants</label>
            <div className="counter">
              <button
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                disabled={participants <= 1}
              >
                -
              </button>
              <span>{participants}</span>
              <button
                onClick={() => setParticipants(Math.min(availableSpots, participants + 1))}
                disabled={participants >= availableSpots}
              >
                +
              </button>
            </div>
            <span className="spots-info">{availableSpots} spots available</span>
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Price per person:</span>
              <span>${service.price.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Participants:</span>
              <span>×{participants}</span>
            </div>
            <div className="price-row total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBooking} disabled={loading}>
            {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)} & Book`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
