import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking, createReview, type Booking } from "../../services/bookingService";
import "../../styles/pages/learner/MyBookings.scss";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = filterStatus !== 'all' 
        ? { status: filterStatus as any, limit: 50 }
        : { limit: 50 };
      
      const response = await getMyBookings(params);
      setBookings(response.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const reason = prompt('Please provide a reason for cancellation (optional):');
      await cancelBooking(bookingId, reason || undefined);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedBooking) return;

    try {
      setReviewLoading(true);
      await createReview(selectedBooking.id, {
        rating,
        comment: reviewText,
      });
      
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setSelectedBooking(null);
      setRating(5);
      setReviewText('');
      fetchBookings();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return 'N/A';
    
    // Handle different time formats
    let timeStr = String(time).trim();
    
    // If it's a full datetime string, extract the time part
    if (timeStr.includes('T')) {
      timeStr = timeStr.split('T')[1].split('.')[0]; // Get HH:MM:SS part
    }
    
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

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={() => interactive && setRating(i + 1)}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="bookings-loading">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="bookings-error">
        <p>{error}</p>
        <button onClick={fetchBookings}>Retry</button>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <button 
          className="browse-services-button"
          onClick={() => navigate('/dashboard/astronomy-services')}
        >
          Browse Services
        </button>
      </div>

      <div className="bookings-filters">
        <button
          className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={`filter-button ${filterStatus === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('confirmed')}
        >
          Confirmed
        </button>
        <button
          className={`filter-button ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-button ${filterStatus === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings found</p>
          <button onClick={() => navigate('/dashboard/astronomy-services')}>
            Explore Services
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img 
                  src={booking.service?.image_url || 'https://via.placeholder.com/300x200'} 
                  alt={booking.service?.title || 'Service'}
                />
                <span className={getStatusClass(booking.booking_status)}>
                  {booking.booking_status}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-main">
                  <h3 
                    className="service-title"
                    onClick={() => navigate(`/dashboard/astronomy-services/${booking.service_id}`)}
                  >
                    {booking.service?.title || 'Service'}
                  </h3>
                  
                  {booking.service?.creator && (
                    <p className="guide-name">
                      Hosted by {booking.service.creator.display_name || 
                                `${booking.service.creator.first_name || ''} ${booking.service.creator.last_name || ''}`.trim()}
                    </p>
                  )}

                  <div className="booking-info">
                    <div className="info-row">
                      <span className="label">📅 Date:</span>
                      <span>{formatDate(booking.booking_date)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">🕐 Time:</span>
                      <span>{formatTime(booking.booking_time)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">👥 Participants:</span>
                      <span>{booking.participants_count}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📍 Location:</span>
                      <span>{booking.service?.location || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">💰 Total:</span>
                      <span className="price">${booking.total_amount}</span>
                    </div>
                    {booking.special_requests && (
                      <div className="info-row">
                        <span className="label">📝 Special Requests:</span>
                        <span>{booking.special_requests}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {booking.booking_status === 'confirmed' && (
                      <button
                        className="action-button cancel-button"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    
                    {booking.booking_status === 'completed' && (
                      <button
                        className="action-button review-button"
                        onClick={() => openReviewModal(booking)}
                      >
                        Write a Review
                      </button>
                    )}
                    
                    <button
                      className="action-button view-button"
                      onClick={() => navigate(`/dashboard/astronomy-services/${booking.service_id}`)}
                    >
                      View Service
                    </button>
                  </div>

                  {booking.cancellation_reason && (
                    <div className="cancellation-info">
                      <strong>Cancellation Reason:</strong>
                      <p>{booking.cancellation_reason}</p>
                    </div>
                  )}
                </div>

                <div className="booking-meta">
                  <div className="payment-status">
                    <span className={`payment-badge payment-${booking.payment_status}`}>
                      Payment: {booking.payment_status}
                    </span>
                  </div>
                  <div className="booking-date">
                    Booked on {formatDate(booking.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            
            <h2>Write a Review</h2>
            
            <div className="review-service-info">
              <h3>{selectedBooking.service?.title}</h3>
              <p>How was your experience?</p>
            </div>

            <div className="review-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with others..."
                  rows={5}
                  required
                />
              </div>

              <button
                className="submit-review-button"
                onClick={handleReviewSubmit}
                disabled={reviewLoading || !reviewText.trim()}
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
