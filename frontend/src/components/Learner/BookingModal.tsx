import React, { useState, useEffect } from 'react';
// Using PayHere for booking payments (no Stripe required for service bookings)
import { getServiceById, getServiceAvailability, type Service, type ServiceAvailability } from '../../services/servicesService';
import { createBooking, getServiceReviews, type Review } from '../../services/bookingService';
import '../../styles/components/learner/BookingModal.scss';

// No Stripe initialization here; service bookings use PayHere gateway via backend
import paymentService from '../../services/paymentService';

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
  const [bookingStep, setBookingStep] = useState<'details' | 'confirmation'>('details');

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
      
      // Debug: Check time format from API
      if (availabilityData.length > 0) {
        console.log('Availability data:', availabilityData[0]);
        console.log('Start time:', availabilityData[0].start_time, 'Type:', typeof availabilityData[0].start_time);
        console.log('End time:', availabilityData[0].end_time, 'Type:', typeof availabilityData[0].end_time);
      }
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = service ? parseFloat(service.price.toString()) * participants : 0;

  // Helper to extract time from datetime string or return time as-is
  const extractTimeFromString = (time: string): string => {
    if (!time) return '';
    
    const timeStr = String(time).trim();
    
    // If it's a full datetime string (contains T), extract the time part
    if (timeStr.includes('T')) {
      return timeStr.split('T')[1].split('.')[0]; // Get HH:MM:SS part
    }
    
    // Otherwise return as-is (already in HH:MM:SS format)
    return timeStr;
  };

  const handlePayment = async () => {

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

    setPaymentProcessing(true);
    setError(null);

    try {
      // 1) Create booking (pending payment)
      const booking = await createBooking({
        service_id: serviceId,
        availability_id: selectedDate.id,
        participants,
        total_price: totalPrice,
        special_requests: specialRequests || undefined,
        booking_date: selectedDate.available_date,
        booking_time: extractTimeFromString(selectedDate.start_time),
      });

      // 2) Ask backend to create a PayHere order for this booking
      const paymentOrder = await paymentService.createBookingPaymentOrder(booking.id);

      console.log('PayHere order from backend:', paymentOrder);

      // 3) Initialize PayHere callbacks
      // Wait for payhere to be available on window (retry briefly)
      let payhere = (window as any).payhere;
      if (!payhere) {
        // Try loading for up to 3 seconds
        await new Promise((resolve) => {
          let attempts = 0;
          const interval = setInterval(() => {
            payhere = (window as any).payhere;
            attempts++;
            if (payhere || attempts > 30) {
              clearInterval(interval);
              resolve(null);
            }
          }, 100);
        });
      }

      if (!payhere) {
        throw new Error('PayHere payment gateway could not load. Please refresh the page and try again.');
      }

      // Attach callbacks similar to other payment modal
      payhere.onCompleted = (orderId: string) => {
        console.log('Payment completed. OrderID:', orderId);
        setPaymentProcessing(false);
        setBookingStep('confirmation');
        setTimeout(() => onSuccess(booking.id), 1500);
      };

      payhere.onDismissed = () => {
        console.log('Payment dismissed');
        setPaymentProcessing(false);
      };

      payhere.onError = (err: any) => {
        console.error('PayHere error', err);
        setError('Payment failed. Please try again.');
        setPaymentProcessing(false);
      };

      // Start the PayHere checkout
      const payment = paymentOrder.payhere_data;

      // Basic validation of payment object
      const requiredFields = [
        'merchant_id',
        'order_id',
        'amount',
        'currency',
        'hash',
        'first_name',
        'last_name',
        'email',
      ];
  const payObj: any = payment;
  const missing = requiredFields.filter((f) => !payObj[f]);
      if (missing.length > 0) {
        console.error('Missing payhere fields:', missing);
        throw new Error('Payment gateway returned incomplete payment data');
      }

      payhere.startPayment(payment);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
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
    if (!time) return '';
    
    // Extract time if it's a datetime string
    const timeStr = extractTimeFromString(time);
    
    // Handle time in HH:MM:SS or HH:MM format
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) {
      console.warn('Invalid time format:', time);
      return time; // Return as-is if invalid format
    }
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].padStart(2, '0'); // Ensure 2-digit minutes
    
    // Validate hours
    if (isNaN(hours) || hours < 0 || hours > 23) {
      console.warn('Invalid hours:', hours);
      return time;
    }
    
    // Convert to 12-hour format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${minutes} ${period}`;
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
                <span>Rs. {service.price.toLocaleString()} × {participants} participant{participants > 1 ? 's' : ''}</span>
                <span>Rs. {(parseFloat(service.price.toString()) * participants).toLocaleString()}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>Rs. {Math.round(totalPrice).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              className="btn-primary btn-full"
              disabled={!selectedDate || participants < 1 || paymentProcessing}
            >
              {paymentProcessing ? 'Processing...' : `Pay Rs. ${Math.round(totalPrice).toLocaleString()}`}
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
            <BookingModalContent {...props} />
          </div>
    </div>
  );
};

export default BookingModal;
