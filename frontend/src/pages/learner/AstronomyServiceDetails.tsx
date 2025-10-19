import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../../components/Learner/Chat";
import BookingModal from "../../components/Learner/BookingModal";
import { getServiceById, getServiceAvailability, type Service, type ServiceAvailability } from "../../services/servicesService";
import { getServiceReviews, type Review } from "../../services/bookingService";
import "../../styles/pages/learner/AstronomyServiceDetails.scss";
import Button from "../../components/Button";

const AstronomyServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceData();
    }
  }, [id]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const serviceId = parseInt(id!);
      const [serviceData, availabilityData, reviewsData] = await Promise.all([
        getServiceById(serviceId),
        getServiceAvailability(serviceId, { available_only: true }),
        getServiceReviews(serviceId, { limit: 10 })
      ]);

      setService(serviceData);
      setAvailability(availabilityData);
      setReviews(reviewsData.reviews);
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    setBookingModalOpen(false);
    navigate('/dashboard/my-bookings');
  };

  const handleGuideClick = () => {
    navigate("/dashboard/guide-profile");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="service-details-loading">Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div className="service-details-error">
        <p>{error || 'Service not found'}</p>
        <Button onClick={() => navigate('/dashboard/astronomy-services')}>Back to Services</Button>
      </div>
    );
  }

  return (
    <div className="service-details">
      <div className="service-details__header">
        <Button 
          onClick={() => navigate('/dashboard/astronomy-services')}
          className="back-button"
        >
          ← Back to Services
        </Button>
      </div>

      <div className="service-details-container">
      <div className="service-details-main">
        <div className="service-details-card">
          <img
            src={service.image_url}
            alt={service.title}
            className="service-details-image"
          />
          <div className="service-details-info">
            <h1>{service.title}</h1>
            <div className="service-rating-location">
              <span className="rating">
                {renderStars(service.rating || 0)} {(service.rating || 0).toFixed(1)}
              </span>
              <span className="location">📍 {service.location}</span>
            </div>
            <p className="service-details-desc">{service.description}</p>

            <div className="service-details-meta">
              <div className="meta-item">
                <strong>Duration:</strong> {service.duration}
              </div>
              <div className="meta-item">
                <strong>Price:</strong> <span className="price">Rs. {service.price.toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <strong>Max Participants:</strong> {service.max_participants}
              </div>
              <div className="meta-item">
                <strong>Difficulty:</strong> {service.difficulty}
              </div>
            </div>

            {service.tags && service.tags.length > 0 && (
              <div className="service-details-tags">
                {service.tags.map((tag: string) => (
                  <span key={tag} className="service-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              className="guide-details"
              onClick={handleGuideClick}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label={`View profile of guide`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleGuideClick();
              }}
            >
              <div>
                <div className="guide-name">
                  {service.creator?.display_name || 
                   `${service.creator?.first_name || ''} ${service.creator?.last_name || ''}`.trim() ||
                   'Guide'}
                </div>
                <div className="guide-role">Astronomy Guide</div>
              </div>
            </div>

            <Button 
              onClick={() => setBookingModalOpen(true)}
              className="book-now-btn"
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Additional Information Sections */}
        <div className="service-additional-info">
          {/* What's Included */}
          {service.equipment && service.equipment.length > 0 && (
            <div className="info-section">
              <h3>Equipment Provided</h3>
              <ul className="equipment-list">
                {service.equipment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* What to Expect */}
          {service.what_to_expect && (
            <div className="info-section">
              <h3>What to Expect</h3>
              <p>{service.what_to_expect}</p>
            </div>
          )}

          {/* Requirements */}
          {service.requirements && (
            <div className="info-section">
              <h3>Requirements</h3>
              <p>{service.requirements}</p>
            </div>
          )}

          {/* Meeting Point */}
          {service.meeting_point && (
            <div className="info-section">
              <h3>Meeting Point</h3>
              <p>{service.meeting_point}</p>
            </div>
          )}

          {/* Cancellation Policy */}
          {service.cancellation_policy && (
            <div className="info-section">
              <h3>Cancellation Policy</h3>
              <p>{service.cancellation_policy}</p>
            </div>
          )}

          {/* Availability */}
          {availability.length > 0 && (
            <div className="info-section">
              <h3>Upcoming Availability</h3>
              <div className="availability-preview">
                {availability.slice(0, 3).map((slot) => (
                  <div key={slot.id} className="availability-item">
                    <span className="date">{formatDate(slot.available_date)}</span>
                    <span className="slots">{slot.slots_available - slot.slots_booked} spots left</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="info-section">
              <h3>Reviews ({service.rating ? service.rating.toFixed(1) : 'N/A'} ⭐)</h3>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">
                        {review.user?.display_name || 
                         `${review.user?.first_name || ''} ${review.user?.last_name || ''}`.trim() || 
                         'Anonymous'}
                      </span>
                      <span className="review-rating">{renderStars(review.rating)}</span>
                    </div>
                    <p className="review-text">{review.review}</p>
                    <span className="review-date">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="service-details-chat">
        <Chat guideName={service.creator?.display_name || 'Guide'} />
      </div>

      {/* Booking Modal */}
      <BookingModal
        serviceId={service.id}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />
      </div>
    </div>
  );
};

export default AstronomyServiceDetails;
