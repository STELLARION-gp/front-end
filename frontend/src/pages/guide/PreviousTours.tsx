import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  MessageCircle, 
  ArrowLeft, 
  Search,
  Eye,
  Share2,
  Trophy,
  MapPin,
  Camera
} from 'lucide-react';
import '../../styles/pages/guide/_previousTours.scss';
import { getGuideBookings, getServiceReviews, type Booking, type Review as ServiceReview } from '../../services/bookingService';

interface CompletedTour {
  id: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  // duration removed — UI will show time range instead
  participants: string[];
  participantCount: number;
  location: string;
  rating?: number;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  earnings: number;
  photos: string[];
  weatherConditions: string;
  equipmentUsed: string[];
  requirements: string[];
  category: 'observation' | 'photography' | 'workshop' | 'expedition';
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const PreviousTours: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<CompletedTour[]>([]);
  const [filteredTours, setFilteredTours] = useState<CompletedTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'earnings'>('date');
  const [selectedTour, setSelectedTour] = useState<CompletedTour | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchCompletedTours = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch completed bookings
        const response = await getGuideBookings({ status: 'completed', limit: 100 });
        
        // Transform bookings to CompletedTour format
        const transformedTours: CompletedTour[] = await Promise.all(
          response.bookings.map(async (booking) => await transformToTour(booking))
        );
        
        setTours(transformedTours);
        setFilteredTours(transformedTours);
      } catch (err) {
        console.error('Error fetching completed tours:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTours();
  }, []);

  const transformToTour = async (booking: Booking): Promise<CompletedTour> => {
    // support both shapes: booking.user || booking.users, booking.service || booking.services
    const userObj = (booking as any).user || (booking as any).users || null;
    const userName = userObj
      ? `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() || userObj.email || 'Unknown User'
      : 'Unknown User';

    const serviceObj = (booking as any).service || (booking as any).services || null;
    const serviceName = serviceObj?.title || `Service #${booking.service_id}` || 'Unknown Service';

    // booking_date -> Date
    const dateObj = typeof booking.booking_date === 'string' ? new Date(booking.booking_date) : booking.booking_date;
    const date = dateObj && !isNaN(new Date(dateObj).getTime()) ? new Date(dateObj).toISOString().split('T')[0] : '1970-01-01';

    // parse booking_time safely
    let startTime = '00:00';
    if (booking.booking_time) {
      let timeObj: Date | null = null;
      if (typeof booking.booking_time === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(booking.booking_time)) {
          timeObj = new Date(booking.booking_time);
        } else if (/^\d{2}:\d{2}/.test(booking.booking_time)) {
          timeObj = new Date(`1970-01-01T${booking.booking_time}`);
        }
      } else if (typeof booking.booking_time === 'object' && booking.booking_time !== null && 'getTime' in booking.booking_time) {
        timeObj = booking.booking_time as Date;
      }
      if (timeObj && !isNaN(timeObj.getTime())) {
        startTime = timeObj.toISOString().substring(11, 16);
      }
    }

  const duration = serviceObj?.duration ? parseDuration(serviceObj.duration) : 0;
  const endTime = calculateEndTime(startTime, duration);
    
    // Fetch reviews for this service
    let reviews: Review[] = [];
    let averageRating = 0;
    try {
  if (booking.service_id) {
  const reviewsResponse = await getServiceReviews(booking.service_id);
        reviews = reviewsResponse.reviews.map((r: ServiceReview) => {
          const reviewUser = (r as any).user || (r as any).users || null;
          const reviewerName = reviewUser
            ? (reviewUser.display_name || `${reviewUser.first_name || ''} ${reviewUser.last_name || ''}`.trim() || reviewUser.email || 'Anonymous')
            : 'Anonymous';
          return {
            id: r.id.toString(),
            userName: reviewerName,
            rating: r.rating,
            comment: r.review || '',
            date: typeof r.created_at === 'string' ? r.created_at.split('T')[0] : new Date(r.created_at).toISOString().split('T')[0],
            verified: r.is_verified || false,
          };
        });
        
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
    
    // Determine category based on service category or title
    const category = determineCategory(booking.service?.category || booking.service?.title || '');

    // equipment from serviceObj (JSON) - can be array or JSON string
    let equipmentUsed: string[] = [];
    if (serviceObj?.equipment) {
      try {
        if (typeof serviceObj.equipment === 'string') {
          equipmentUsed = JSON.parse(serviceObj.equipment);
        } else if (Array.isArray(serviceObj.equipment)) {
          equipmentUsed = serviceObj.equipment;
        } else {
          // object -> try to stringify values
          equipmentUsed = Object.values(serviceObj.equipment).map((v: any) => String(v));
        }
      } catch (e) {
        equipmentUsed = [];
      }
    }

    // requirements from serviceObj (string) -> split into array
    const requirements: string[] = serviceObj?.requirements
      ? String(serviceObj.requirements).split(/\r?\n|;/).map(s => s.trim()).filter(Boolean)
      : [];
    
    return {
      id: booking.id.toString(),
      serviceName,
      date,
      startTime,
      endTime,
  // duration field removed from CompletedTour; keep startTime/endTime
      participants: [userName], // Single participant name for now
      participantCount: booking.participants_count,
      location: serviceObj?.location || booking.service?.location || 'Unknown Location',
      averageRating,
      totalReviews: reviews.length,
      earnings: booking.total_amount,
      reviews,
  photos: serviceObj?.image_url ? [serviceObj.image_url] : (booking.service_id ? [] : []),
      weatherConditions: 'N/A',
      equipmentUsed: equipmentUsed,
      requirements: requirements,
      category,
    };
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*(hour|day)/i);
    if (!match) return 0;
    
    const [, amount, unit] = match;
    return unit.toLowerCase() === 'day' ? parseInt(amount) * 24 : parseInt(amount);
  };

  const calculateEndTime = (startTime: string, durationHours: number): string => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const endHour = (startHour + durationHours) % 24;
    
    return `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
  };

  const determineCategory = (categoryOrTitle: string): 'observation' | 'photography' | 'workshop' | 'expedition' => {
    const lower = categoryOrTitle.toLowerCase();
    if (lower.includes('photo')) return 'photography';
    if (lower.includes('workshop') || lower.includes('building')) return 'workshop';
    if (lower.includes('expedition') || lower.includes('trip')) return 'expedition';
    return 'observation';
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = tours;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'earnings':
          return b.earnings - a.earnings;
        default:
          return 0;
      }
    });

    setFilteredTours(filtered);
  }, [tours, searchTerm, selectedCategory, sortBy]);

  // Calculate stats
  const totalEarnings = tours.reduce((sum, tour) => sum + tour.earnings, 0);
  const totalParticipants = tours.reduce((sum, tour) => sum + tour.participantCount, 0);
  const averageRating = tours.length > 0 
    ? tours.reduce((sum, tour) => sum + tour.averageRating, 0) / tours.length 
    : 0;
  const totalTours = tours.length;

  const handleViewDetails = (tour: CompletedTour) => {
    console.log('[PreviousTours] handleViewDetails ->', tour?.id, tour?.serviceName);
    setSelectedTour(tour);
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
    setShowReviewModal(false);
  };

  const handleViewReviews = (tour: CompletedTour) => {
    setSelectedTour(tour);
    setShowReviewModal(true);
  };

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClass = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? 'star-filled' : 'star-empty'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="previous-tours-page">
        <div className="page-header">
          <h2>Previous Tours</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading completed tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="previous-tours-page">
        <div className="page-header">
          <h2>Previous Tours</h2>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="previous-tours-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h2>Previous Tours</h2>
            <p>View your completed tours and manage reviews</p>
          </div>
        </div>
        <div className="header-top">
            <Button
              variant="primary"
              size="medium"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/booking-requests')}
            >
              Back to Booking Requests
            </Button>
          </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-grid">
        <Card className="stat-card total" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Tours</span>
              <strong className="stat-value">{totalTours}</strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card participants" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Participants</span>
              <strong className="stat-value">{totalParticipants}</strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card rating" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Star className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Average Rating</span>
              <strong className="stat-value">{averageRating.toFixed(1)}</strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card earnings" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <div className="earnings-icon">Rs.</div>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Earnings</span>
              <strong className="stat-value">Rs. {totalEarnings.toLocaleString()}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filters-content">
            <div className="search-section">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tours, locations, participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="category-filter">Category:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                  title="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="observation">Observation</option>
                  <option value="photography">Photography</option>
                  <option value="workshop">Workshop</option>
                  <option value="expedition">Expedition</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="sort-filter">Sort by:</label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'earnings')}
                  className="filter-select"
                  title="Sort tours by"
                >
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="earnings">Earnings</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="tours-grid">
        <AnimatePresence>
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="tour-card">
                <div className="tour-header">
                  <div className="tour-image">
                    <img 
                      src={tour.photos[0] || 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=200&fit=crop'} 
                      alt={tour.serviceName}
                    />
                    <div className="category-badge">
                      <span className={`category-${tour.category}`}>
                        {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)}
                      </span>
                    </div>
                    {tour.photos.length > 1 && (
                      <div className="photo-count">
                        <Camera className="w-3 h-3" />
                        {tour.photos.length}
                      </div>
                    )}
                  </div>
                </div>

                <div className="tour-content">
                  <div className="tour-title-section">
                    <h3 className="tour-title">{tour.serviceName}</h3>
                    <div className="tour-rating">
                      {renderStars(tour.averageRating)}
                      <span className="rating-text">
                        {tour.averageRating.toFixed(1)} ({tour.totalReviews})
                      </span>
                    </div>
                  </div>

                  <div className="tour-details">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span>{new Date(tour.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>{tour.startTime} - {tour.endTime}</span>
                    </div>
                    <div className="detail-item">
                      <Users className="detail-icon" />
                      <span>{tour.participantCount} participants</span>
                    </div>
                    {/* <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{tour.location}</span>
                    </div> */}
                  </div>

                  <div className="tour-earnings">
                    <span className="earnings-label">Earnings:</span>
                    <span className="earnings-amount">Rs. {tour.earnings.toLocaleString()}</span>
                  </div>

                  <div className="tour-highlights">
                    {tour.requirements.slice(0, 4).map((req, i) => (
                      <span key={i} className="highlight-tag">
                        {req}
                      </span>
                    ))}
                    {tour.requirements.length > 4 && (
                      <span className="highlight-more">
                        +{tour.requirements.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="tour-actions">
                  <Button
                    variant="primary"
                    size="small"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleViewDetails(tour)}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    icon={<MessageCircle className="w-4 h-4" />}
                    onClick={() => handleViewReviews(tour)}
                  >
                    Reviews
                  </Button>
                  {/* <Button
                    variant="primary"
                    size="small"
                    icon={<Share2 className="w-4 h-4" />}
                  >
                    Share
                  </Button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTours.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <Trophy className="empty-icon" />
            <h3>No tours found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}

      {/* Tour Details Modal */}
      <AnimatePresence>
        {selectedTour && !showReviewModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div
              className="modal-container tour-details-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedTour.serviceName}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <div className="modal-content1">
                <div className="tour-details-content">
                  {/* <div className="tour-images">
                    {selectedTour.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Tour photo ${index + 1}`} />
                    ))}
                  </div> */}

                  <div className="tour-info-grid">
                    <div className="info-section">
                      <h4>Tour Information</h4>
                      <div className="info-items">
                        <div className="info-item">
                          <span className="label">Date:</span>
                          <span className="value">{new Date(selectedTour.date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Time:</span>
                          <span className="value">{selectedTour.startTime} - {selectedTour.endTime}</span>
                        </div>
                        {/* <div className="info-item">
                          <span className="label">Location:</span>
                          <span className="value">{selectedTour.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Weather:</span>
                          <span className="value">{selectedTour.weatherConditions}</span>
                        </div> */}
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Participants ({selectedTour.participantCount})</h4>
                      <div className="participants-list">
                        {selectedTour.participants.map((participant, index) => (
                          <div key={index} className="participant-item">
                            {participant}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Equipment Used</h4>
                      <div className="equipment-list">
                        {selectedTour.equipmentUsed.map((equipment, index) => (
                          <span key={index} className="equipment-tag">
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <div className="highlights-list">
                        {selectedTour.requirements.map((req: string, index: number) => (
                          <div key={index} className="highlight-item">
                            • {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="primary" onClick={handleCloseModal}>
                  Close
                </Button>
                {/* <Button 
                  variant="primary" 
                  onClick={() => setShowReviewModal(true)}
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  View Reviews
                </Button> */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews Modal */}
      <AnimatePresence>
        {selectedTour && showReviewModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <motion.div
              className="modal-container reviews-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Reviews - {selectedTour.serviceName}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <div className="modal-content1">
                <div className="reviews-summary">
                  <div className="rating-overview">
                    <div className="average-rating">
                      <span className="rating-number">{selectedTour.averageRating.toFixed(1)}</span>
                      {renderStars(selectedTour.averageRating, 'large')}
                    </div>
                    <div className="rating-info">
                      <span>{selectedTour.totalReviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {selectedTour.reviews.length > 0 ? (
                    selectedTour.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.userName}</span>
                            {review.verified && <span className="verified-badge">Verified</span>}
                          </div>
                          <div className="review-rating">
                            {renderStars(review.rating, 'small')}
                            <span className="review-date">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="review-comment">
                          {review.comment}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <MessageCircle className="no-reviews-icon" />
                      <p>No reviews yet for this tour</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="primary" onClick={() => setShowReviewModal(false)}>
                  Back to Details
                </Button>
                <Button variant="primary" onClick={handleCloseModal}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreviousTours;
