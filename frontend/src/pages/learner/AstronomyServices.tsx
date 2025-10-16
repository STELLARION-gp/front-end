import React, { useState, useEffect } from "react";
import ServiceCard from "../../components/Learner/ServiceCard";
import BookingModal from "../../components/Learner/BookingModal";
import { getServices } from "../../services/servicesService";
import { getMyBookings, cancelBooking, createReview, type Booking } from "../../services/bookingService";
import type { Service } from "../../services/servicesService";
import "../../styles/pages/learner/AstronomyServices.scss";

// Custom SVG icons (from ServiceListing)
const CalendarIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect
			x="3"
			y="4"
			width="18"
			height="18"
			rx="2"
			ry="2"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="16"
			y1="2"
			x2="16"
			y2="6"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="8"
			y1="2"
			x2="8"
			y2="6"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
		<line
			x1="3"
			y1="10"
			x2="21"
			y2="10"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
	</svg>
);
const StarIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"
			stroke="#4f8cff"
			strokeWidth="2"
			fill="none"
		/>
	</svg>
);
const MapIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M9 20l-5.447-2.724A2 2 0 0 1 2 15.382V5.618a2 2 0 0 1 1.553-1.894L9 2m0 18v-18m0 18l6-3m0 0V2m0 15l5.447-2.724A2 2 0 0 0 22 15.382V5.618a2 2 0 0 0-1.553-1.894L15 2"
			stroke="#4f8cff"
			strokeWidth="2"
		/>
	</svg>
);
const CommentsIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
	>
		<path
			d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
			stroke="#4f8cff"
			strokeWidth="2"
			fill="none"
		/>
	</svg>
);

export const services = [
	{
		id: 1,
		title: "Event Booking",
        price: 20,
		description:
			"Book your spot for upcoming astronomy events, star parties, and workshops.",
		image:
			"https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
		guideName: "Dr. Stella Orion",
		guideImage:
			"https://randomuser.me/api/portraits/women/44.jpg",
		rating: 4.9,
		location: "Mount Wilson Observatory",
		duration: "3 hours",
		tags: ["Events", "Star Party", "Workshop"],
		icon: <CalendarIcon />,
	},
	{
		id: 2,
		title: "Telescope Rental",
        price: 15,
		description:
			"Rent high-quality telescopes and accessories for your stargazing sessions.",
		image:
			"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=200&fit=crop",
		guideName: "Prof. Neil Cosmos",
		guideImage:
			"https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4.7,
		location: "Alpine Astrophotography Center",
		duration: "2 hours",
		tags: ["Telescope", "Rental", "Gear"],
		icon: <StarIcon />,
	},
	{
		id: 3,
		title: "Astronomy Guides",
        price: 30,
		description:
			"Connect with experienced guides for personalized astronomy tours and sessions.",
		image:
			"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=200&fit=crop",
		guideName: "Dr. Luna Sky",
		guideImage:
			"https://randomuser.me/api/portraits/women/65.jpg",
		rating: 4.8,
		location: "City Observatory Deck",
		duration: "1.5 hours",
		tags: ["Guided Tour", "Learning", "Night Sky"],
		icon: <MapIcon />,
	},
	{
		id: 4,
		title: "Ask an Expert",
        price: 10,
		description:
			"Get your astronomy questions answered by professionals and enthusiasts.",
		image:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
		guideName: "Prof. Neil Cosmos",
		guideImage:
			"https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4.6,
		location: "Online",
		duration: "Flexible",
		tags: ["Q&A", "Expert", "Advice"],
		icon: <CommentsIcon />,
	},
];

const filterOptions = [
  { label: "Service Name", value: "title" },
  { label: "Guide Name", value: "guideName" },
  { label: "Location", value: "location" },
];
const priceOrderOptions = [
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
];


type FilterKey = "title" | "guideName" | "location";

// Transform API service to match ServiceCard props
interface ServiceCardData {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  guideName: string;
  guideImage: string;
  rating: number;
  location: string;
  duration: string;
  tags: string[];
  icon: React.ReactElement;
}

const transformService = (service: Service): ServiceCardData => {
  const guideName = service.creator?.display_name || 
                   `${service.creator?.first_name || ''} ${service.creator?.last_name || ''}`.trim() ||
                   'Guide';
  
  return {
    id: service.id,
    title: service.title,
    price: service.price,
    description: service.description,
    image: service.image_url,
    guideName,
    guideImage: "https://randomuser.me/api/portraits/men/32.jpg", // Default avatar
    rating: service.rating || 0,
    location: service.location,
    duration: service.duration,
    tags: service.tags,
    icon: <CalendarIcon />
  };
};

const AstronomyServices: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services');
  
  // Services state
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<FilterKey>("title");
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc">("asc");
  const [services, setServices] = useState<ServiceCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  
  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Fetch services from API
  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else {
      fetchBookings();
    }
  }, [activeTab, filterStatus]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getServices({ status: 'active' });
      const transformedServices = response.services.map(transformService);
      setServices(transformedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError(null);
      
      const params = filterStatus !== 'all' 
        ? { status: filterStatus as any, limit: 50 }
        : { limit: 50 };
      
      const response = await getMyBookings(params);
      setBookings(response.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookingsError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const filteredServices = services
    .filter((service) => {
      let value = "";
      if (filterBy === "title") value = service.title;
      else if (filterBy === "guideName") value = service.guideName;
      else if (filterBy === "location") value = service.location;
      return value.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (priceOrder === "asc") return a.price - b.price;
      else return b.price - a.price;
    });

  const handleBookClick = (id: number) => {
    setSelectedServiceId(id);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingModalOpen(false);
    setActiveTab('bookings'); // Switch to bookings tab
    fetchBookings();
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

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
    setRating(5);
    setReviewText('');
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

	return (
		<div className="astronomy-services-container">
			<h2>Astronomy Services</h2>
			<p>Explore various astronomy-related services and manage your bookings.</p>
      
      {/* Tab Buttons */}
      <div className="services-tabs">
        <button 
          className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <>
          {loading ? (
            <div className="services-loading">Loading services...</div>
          ) : error ? (
            <div className="services-error">
              <p>{error}</p>
              <button onClick={fetchServices}>Retry</button>
            </div>
          ) : (
            <>
              <div className="services-filter-bar">
                <input
                  type="text"
                  placeholder={`Search by ${filterOptions.find(f => f.value === filterBy)?.label}`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="services-search-input"
                />
                <select
                  value={filterBy}
                  onChange={e => setFilterBy(e.target.value as FilterKey)}
                  className="services-filter-select"
                >
                  {filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={priceOrder}
                  onChange={e => setPriceOrder(e.target.value as "asc" | "desc")}
                  className="services-filter-select"
                >
                  {priceOrderOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="astronomy-services-sections">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, idx) => (
                    <ServiceCard 
                      key={idx} 
                      {...service} 
                      onBookClick={() => handleBookClick(service.id)}
                    />
                  ))
                ) : (
                  <div className="no-services-found">No services found.</div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bookings-section">
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

          {bookingsLoading ? (
            <div className="bookings-loading">Loading bookings...</div>
          ) : bookingsError ? (
            <div className="bookings-error">
              <p>{bookingsError}</p>
              <button onClick={fetchBookings}>Retry</button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found.</p>
              <button onClick={() => setActiveTab('services')} className="browse-services-btn">
                Browse Services
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <img 
                      src={booking.service?.image_url || 'https://via.placeholder.com/150'} 
                      alt={booking.service?.title}
                      className="booking-service-image"
                    />
                    <div className="booking-info">
                      <h3>{booking.service?.title || 'Service'}</h3>
                      <p className="service-category">{booking.service?.category}</p>
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
                      <span className="price">${booking.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">💳 Payment Status:</span>
                      <span className={`payment-status payment-${booking.payment_status}`}>
                        {booking.payment_status}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📍 Location:</span>
                      <span>{booking.service?.location}</span>
                    </div>
                    {booking.special_requests && (
                      <div className="detail-row">
                        <span className="label">📝 Special Requests:</span>
                        <span>{booking.special_requests}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {booking.booking_status === 'confirmed' && (
                      <>
                        <button 
                          className="btn-cancel"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                        <button 
                          className="btn-review"
                          onClick={() => openReviewModal(booking)}
                        >
                          Write Review
                        </button>
                      </>
                    )}
                    {booking.booking_status === 'completed' && (
                      <button 
                        className="btn-review"
                        onClick={() => openReviewModal(booking)}
                      >
                        Write Review
                      </button>
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
      )}

      {/* Booking Modal */}
      {selectedServiceId && (
        <BookingModal
          serviceId={selectedServiceId}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="service-info-mini">
                <img src={selectedBooking.service?.image_url} alt={selectedBooking.service?.title} />
                <div>
                  <h4>{selectedBooking.service?.title}</h4>
                  <p>{formatDate(selectedBooking.booking_date)}</p>
                </div>
              </div>

              <div className="rating-section">
                <label>Rating *</label>
                <div className="stars-input">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="review-section">
                <label htmlFor="review-text">Your Review</label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service..."
                  rows={5}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowReviewModal(false)}
                disabled={reviewLoading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleReviewSubmit}
                disabled={reviewLoading || rating < 1}
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

export default AstronomyServices;
