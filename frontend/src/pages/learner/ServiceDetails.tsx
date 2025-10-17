import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, getServiceAvailability, type Service, type ServiceAvailability } from "../../services/servicesService";
import { createBooking } from "../../services/bookingService";
import { getServiceReviews, type Review } from "../../services/bookingService";
import "../../styles/pages/learner/ServiceDetails.scss";

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [service, setService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking form state
  const [selectedSlot, setSelectedSlot] = useState<ServiceAvailability | null>(null);
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [serviceData, availabilityData, reviewsData] = await Promise.all([
        getServiceById(parseInt(id!)),
        getServiceAvailability(parseInt(id!), { available_only: true }),
        getServiceReviews(parseInt(id!), { limit: 10 })
      ]);
      
      setService(serviceData);
      setAvailability(availabilityData);
      setReviews(reviewsData.reviews);
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !service) return;
    
    try {
      setBookingLoading(true);
      const totalPrice = parseFloat(service.price.toString()) * participants;
      
      await createBooking({
        service_id: service.id,
        availability_id: selectedSlot.id,
        participants,
        total_price: totalPrice,
        special_requests: specialRequests || undefined,
      });
      
      alert('Booking successful!');
      setShowBookingModal(false);
      navigate('/dashboard/my-bookings');
    } catch (err) {
      console.error('Booking error:', err);
      alert(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="service-details-loading">Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div className="service-details-error">
        <p>{error || 'Service not found'}</p>
        <button onClick={() => navigate('/dashboard/astronomy-services')}>
          Back to Services
        </button>
      </div>
    );
  }

  const guideName = service.creator?.display_name || 
                   `${service.creator?.first_name || ''} ${service.creator?.last_name || ''}`.trim() ||
                   'Guide';

  const totalPrice = parseFloat(service.price.toString()) * participants;

  return (
    <div className="service-details-container">
      <button className="back-button" onClick={() => navigate('/dashboard/astronomy-services')}>
        ← Back to Services
      </button>

      <div className="service-header">
        <div className="service-image">
          <img src={service.image_url} alt={service.title} />
          {service.featured && <span className="featured-badge">Featured</span>}
        </div>
        
        <div className="service-main-info">
          <h1>{service.title}</h1>
          
          <div className="service-meta">
            <div className="rating">
              {renderStars(Math.round(service.rating || 0))}
              <span className="rating-value">{service.rating?.toFixed(1) || 'N/A'}</span>
              <span className="reviews-count">({reviews.length} reviews)</span>
            </div>
            
            <div className="service-stats">
              <span className="stat">
                <strong>{service.bookings_count}</strong> bookings
              </span>
              <span className="stat">
                <strong>{service.category}</strong>
              </span>
              <span className="stat">
                <strong>{service.difficulty}</strong>
              </span>
            </div>
          </div>

          <div className="guide-info">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt={guideName}
              className="guide-avatar"
            />
            <div>
              <p className="guide-label">Hosted by</p>
              <p className="guide-name">{guideName}</p>
            </div>
          </div>

          <div className="price-section">
            <div className="price">
              <span className="amount">Rs. {service.price.toLocaleString()}</span>
              <span className="per-person">per person</span>
            </div>
            <button 
              className="book-button"
              onClick={() => setShowBookingModal(true)}
              disabled={availability.length === 0}
            >
              {availability.length > 0 ? 'Book Now' : 'No Availability'}
            </button>
          </div>
        </div>
      </div>

      <div className="service-content">
        <div className="main-column">
          <section className="section">
            <h2>About This Experience</h2>
            <p>{service.description}</p>
          </section>

          {service.what_to_expect && (
            <section className="section">
              <h2>What to Expect</h2>
              <p>{service.what_to_expect}</p>
            </section>
          )}

          <section className="section">
            <h2>Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Duration:</strong>
                <span>{service.duration}</span>
              </div>
              <div className="detail-item">
                <strong>Location:</strong>
                <span>{service.location}</span>
              </div>
              <div className="detail-item">
                <strong>Max Participants:</strong>
                <span>{service.max_participants} people</span>
              </div>
              <div className="detail-item">
                <strong>Difficulty:</strong>
                <span>{service.difficulty}</span>
              </div>
              {service.languages.length > 0 && (
                <div className="detail-item">
                  <strong>Languages:</strong>
                  <span>{service.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </section>

          {service.equipment && service.equipment.length > 0 && (
            <section className="section">
              <h2>Equipment Provided</h2>
              <ul className="equipment-list">
                {service.equipment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {service.requirements && (
            <section className="section">
              <h2>Requirements</h2>
              <p>{service.requirements}</p>
            </section>
          )}

          {service.meeting_point && (
            <section className="section">
              <h2>Meeting Point</h2>
              <p>{service.meeting_point}</p>
            </section>
          )}

          {service.cancellation_policy && (
            <section className="section">
              <h2>Cancellation Policy</h2>
              <p>{service.cancellation_policy}</p>
            </section>
          )}

          <section className="section">
            <h2>Reviews ({reviews.length})</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <strong>
                          {review.user?.display_name || 
                           `${review.user?.first_name || ''} ${review.user?.last_name || ''}`.trim() ||
                           'Anonymous'}
                        </strong>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="review-date">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <p className="review-text">{review.review}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </section>
        </div>

        <div className="sidebar-column">
          <div className="availability-card sticky">
            <h3>Available Dates</h3>
            {availability.length > 0 ? (
              <div className="availability-list">
                {availability.slice(0, 5).map((slot) => {
                  const availableSlots = slot.slots_available - slot.slots_booked;
                  return (
                    <div 
                      key={slot.id} 
                      className={`availability-slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="slot-date">{formatDate(slot.available_date)}</div>
                      <div className="slot-time">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                      <div className="slot-availability">
                        {availableSlots} spot{availableSlots !== 1 ? 's' : ''} left
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-availability">No availability at the moment</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            
            <h2>Complete Your Booking</h2>
            
            <div className="booking-summary">
              <h3>{service.title}</h3>
              {selectedSlot ? (
                <div className="selected-slot-info">
                  <p><strong>Date:</strong> {formatDate(selectedSlot.available_date)}</p>
                  <p><strong>Time:</strong> {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}</p>
                </div>
              ) : (
                <p className="error-message">Please select a time slot</p>
              )}
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Number of Participants</label>
                <input
                  type="number"
                  min="1"
                  max={selectedSlot ? selectedSlot.slots_available - selectedSlot.slots_booked : service.max_participants}
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requirements or requests..."
                  rows={3}
                />
              </div>

              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Rs. {service.price.toLocaleString()} × {participants} participant{participants !== 1 ? 's' : ''}</span>
                  <span>Rs. {Math.round(totalPrice).toLocaleString()}</span>
                </div>
                <div className="breakdown-total">
                  <strong>Total</strong>
                  <strong>Rs. {Math.round(totalPrice).toLocaleString()}</strong>
                </div>
              </div>

              <button
                className="confirm-booking-button"
                onClick={handleBooking}
                disabled={!selectedSlot || bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
