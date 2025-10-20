import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/pages/learner/ServicesTab.scss";
import { getMyBookings, type Booking } from "../../services/bookingService";

const ServicesTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch bookings from API
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

  // Map date string to service name for calendar tooltip
  const dateServiceMap = Object.fromEntries(
    bookings
      .filter(b => b.booking_status === 'confirmed')
      .map(b => {
        const dateStr = new Date(b.booking_date).toISOString().slice(0, 10);
        return [dateStr, b.service?.title || 'Service'];
      })
  );

  // Calendar tile content and tooltip
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = date.toISOString().slice(0, 10);
      if (dateServiceMap[dateStr]) {
        return "calendar-booked";
      }
    }
    return "";
  };

  // Tooltip for service name
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handleDateMouseOver = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (dateServiceMap[dateStr]) {
      setHoveredDate(dateStr);
    } else {
      setHoveredDate(null);
    }
  };
  const handleDateMouseOut = () => setHoveredDate(null);

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
    
    let timeStr = String(time).trim();
    if (timeStr.includes('T')) {
      timeStr = timeStr.split('T')[1].split('.')[0];
    }
    
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) return time;
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].padStart(2, '0');
    
    if (isNaN(hours) || hours < 0 || hours > 23) return time;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours}:${minutes} ${period}`;
  };

  const getStatusClass = (status: string) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const handleGuideClick = (creatorId?: number) => {
    if (creatorId) {
      navigate(`/dashboard/guide-profile/${creatorId}`);
    }
  };

  return (
    <div className="services-tab-main-layout">
      <div className="services-tab-container">
        <h2>Your Astronomy Services</h2>
        
        {/* Status Filter */}
        <div className="bookings-filter">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter-select"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="bookings-loading">Loading your services...</div>
        ) : error ? (
          <div className="bookings-error">
            <p>{error}</p>
            <button onClick={fetchBookings}>Retry</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <p>No service bookings found.</p>
            <button 
              onClick={() => navigate('/dashboard/astronomy-services')} 
              className="browse-services-btn"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-info">
                    <h3>{booking.service?.title || 'Service'}</h3>
                    <p className="service-category">{booking.service?.category}</p>
                    {booking.service?.creator && (
                      <p 
                        className="service-guide clickable-guide"
                        onClick={() => handleGuideClick(booking.service?.creator?.id)}
                        title="View guide profile"
                      >
                        👤 Guide: {booking.service.creator.display_name || 
                                  `${booking.service.creator.first_name || ''} ${booking.service.creator.last_name || ''}`.trim() ||
                                  'Guide'}
                      </p>
                    )}
                    <span className={getStatusClass(booking.booking_status)}>
                      {booking.booking_status}
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">📅 Date:</span>
                    <span>{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">🕐 Time:</span>
                    <span>{formatTime(booking.booking_time)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">👥 Participants:</span>
                    <span>{booking.participants_count}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">💰 Total Amount:</span>
                    <span className="price">Rs. {booking.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">💳 Payment Status:</span>
                    <span className={`payment-status payment-${booking.payment_status}`}>
                      {booking.payment_status}
                    </span>
                  </div>
                  {booking.special_requests && (
                    <div className="detail-row">
                      <span className="label">📝 Special Requests:</span>
                      <span>{booking.special_requests}</span>
                    </div>
                  )}
                  {booking.booking_status === 'cancelled' && booking.cancellation_reason && (
                    <div className="cancellation-reason">
                      <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="services-tab-calendar">
        <h3>Booking Calendar</h3>
        <Calendar
          tileContent={({ date, view }: { date: Date; view: string }) => {
            if (view === "month") {
              const dateStr = date.toISOString().slice(0, 10);
              if (dateServiceMap[dateStr]) {
                return (
                  <div
                    className="calendar-dot"
                    onMouseEnter={() => handleDateMouseOver(date)}
                    onMouseLeave={handleDateMouseOut}
                  />
                );
              }
            }
            return null;
          }}
          tileClassName={tileClassName}
        />
        {hoveredDate && (
          <div className="calendar-tooltip">
            {dateServiceMap[hoveredDate]}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
