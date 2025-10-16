import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getServiceById, getServiceAvailability, type Service, type ServiceAvailability } from '../../services/servicesService';
import { createBooking, getServiceReviews, type Review } from '../../services/bookingService';
import '../../styles/components/learner/BookingModal.scss';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

interface BookingModalProps {
  serviceId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: number) => void;
}

const BookingModalContent: React.FC<Omit<BookingModalProps, 'isOpen'>> = ({
  serviceId,
  onClose,
  onSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [service, setService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<ServiceAvailability[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<ServiceAvailability | null>(null);
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  useEffect(() => {
    fetchServiceData();
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [serviceData, availabilityData, reviewsData] = await Promise.all([
        getServiceById(serviceId),
        getServiceAvailability(serviceId, { available_only: true }),
        getServiceReviews(serviceId, { limit: 5 })
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

  const totalPrice = service ? parseFloat(service.price.toString()) * participants : 0;

  const handleBookingSubmit = async () => {
    if (!selectedDate || !service) {
      setError('Please select a date and time');
      return;
    }

    if (participants < 1 || participants > service.max_participants) {
      setError(`Participants must be between 1 and ${service.max_participants}`);
      return;
    }

    const availableSlots = selectedDate.slots_available - selectedDate.slots_booked;
    if (participants > availableSlots) {
      setError(`Only ${availableSlots} slots available`);
      return;
    }

    setBookingStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !selectedDate || !service) {
      return;
    }

    setPaymentProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Create booking
      const booking = await createBooking({
        service_id: serviceId,
        availability_id: selectedDate.id,
        participants,
        total_price: totalPrice,
        special_requests: specialRequests || undefined,
      });

      setBookingStep('confirmation');
      
      // Call success callback after a short delay to show confirmation
      setTimeout(() => {
        onSuccess(booking.id);
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setBookingStep('details');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
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
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="booking-modal-loading">
        <div className="spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="booking-modal-error">
        <p>{error}</p>
        <button onClick={onClose} className="btn-close">Close</button>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="booking-modal-content">
      {/* Header with close button */}
      <div className="booking-modal-header">
        <h2>{service.title}</h2>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
      </div>

      {/* Service Preview */}
      <div className="service-preview">
        <img src={service.image_url} alt={service.title} className="service-image" />
        <div className="service-meta">
          <span className="rating">{renderStars(service.rating || 0)} {(service.rating || 0).toFixed(1)}</span>
          <span className="location">📍 {service.location}</span>
          <span className="duration">⏱️ {service.duration}</span>
        </div>
        <p className="service-description">{service.description}</p>
      </div>

      {bookingStep === 'details' && (
        <>
          {/* Booking Details Section */}
          <div className="booking-section">
            <h3>Booking Details</h3>
            
            {error && <div className="error-message">{error}</div>}

            {/* Date Selection */}
            <div className="form-group">
              <label>Select Date & Time *</label>
              <div className="availability-grid">
                {availability.length > 0 ? (
                  availability.map((slot) => {
                    const availableSlots = slot.slots_available - slot.slots_booked;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        className={`availability-slot ${selectedDate?.id === slot.id ? 'selected' : ''} ${availableSlots === 0 ? 'disabled' : ''}`}
                        onClick={() => setSelectedDate(slot)}
                        disabled={availableSlots === 0}
                      >
                        <div className="slot-date">{formatDate(slot.available_date)}</div>
                        <div className="slot-time">{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</div>
                        <div className="slot-availability">{availableSlots} spots left</div>
                      </button>
                    );
                  })
                ) : (
                  <p className="no-availability">No available dates at the moment. Please check back later.</p>
                )}
              </div>
            </div>

            {/* Participants Selection */}
            <div className="form-group">
              <label htmlFor="participants">Number of Participants *</label>
              <div className="participants-selector">
                <button 
                  type="button"
                  onClick={() => setParticipants(Math.max(1, participants - 1))}
                  className="qty-btn"
                  disabled={participants <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  id="participants"
                  value={participants}
                  onChange={(e) => setParticipants(Math.max(1, Math.min(service.max_participants, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={service.max_participants}
                  className="qty-input"
                />
                <button 
                  type="button"
                  onClick={() => setParticipants(Math.min(service.max_participants, participants + 1))}
                  className="qty-btn"
                  disabled={participants >= service.max_participants}
                >
                  +
                </button>
              </div>
              <small>Max {service.max_participants} participants</small>
            </div>

            {/* Special Requests */}
            <div className="form-group">
              <label htmlFor="special-requests">Special Requests (Optional)</label>
              <textarea
                id="special-requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requirements or requests..."
                rows={3}
                className="form-textarea"
              />
            </div>

            {/* Price Summary */}
            <div className="price-summary">
              <div className="price-row">
                <span>${service.price} × {participants} participant{participants > 1 ? 's' : ''}</span>
                <span>${(parseFloat(service.price.toString()) * participants).toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleBookingSubmit}
              className="btn-primary btn-full"
              disabled={!selectedDate || participants < 1}
            >
              Continue to Payment
            </button>
          </div>

          {/* Service Details */}
          {(service.equipment && service.equipment.length > 0) || 
           service.what_to_expect || 
           service.requirements || 
           service.cancellation_policy ? (
            <div className="booking-section">
              <h3>What's Included</h3>
              <div className="service-details-grid">
                {service.equipment && service.equipment.length > 0 && (
                  <div className="detail-item">
                    <h4>Equipment Provided</h4>
                    <ul>
                      {service.equipment.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {service.cancellation_policy && (
                  <div className="detail-item">
                    <h4>Cancellation Policy</h4>
                    <p>{service.cancellation_policy}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="booking-section">
              <h3>Recent Reviews ({service.rating ? service.rating.toFixed(1) : 'N/A'} ⭐)</h3>
              <div className="reviews-list">
                {reviews.slice(0, 3).map((review) => (
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {bookingStep === 'payment' && (
        <div className="booking-section payment-section">
          <h3>Payment Details</h3>
          
          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <p><strong>Service:</strong> {service.title}</p>
            <p><strong>Date:</strong> {selectedDate && formatDate(selectedDate.available_date)}</p>
            <p><strong>Time:</strong> {selectedDate && `${formatTime(selectedDate.start_time)} - ${formatTime(selectedDate.end_time)}`}</p>
            <p><strong>Participants:</strong> {participants}</p>
            <p className="total-price"><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label>Card Details</label>
              <div className="card-element-wrapper">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#e0e0e0',
                        '::placeholder': {
                          color: '#aaa',
                        },
                      },
                      invalid: {
                        color: '#ff6b6b',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="payment-actions">
              <button 
                type="button"
                onClick={() => setBookingStep('details')}
                className="btn-secondary"
                disabled={paymentProcessing}
              >
                Back
              </button>
              <button 
                type="submit"
                className="btn-primary"
                disabled={!stripe || paymentProcessing}
              >
                {paymentProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {bookingStep === 'confirmation' && (
        <div className="booking-section confirmation-section">
          <div className="success-icon">✓</div>
          <h3>Booking Confirmed!</h3>
          <p>Your booking has been successfully confirmed. You will receive a confirmation email shortly.</p>
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      )}
    </div>
  );
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={props.onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <Elements stripe={stripePromise}>
          <BookingModalContent {...props} />
        </Elements>
      </div>
    </div>
  );
};

export default BookingModal;
