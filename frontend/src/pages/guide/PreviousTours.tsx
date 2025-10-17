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
  duration: number;
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
  highlights: string[];
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
    const userName = booking.user
      ? `${booking.user.first_name || ''} ${booking.user.last_name || ''}`.trim() || booking.user.email
      : 'Unknown User';
    
    const serviceName = booking.service?.title || 'Unknown Service';
    const date = typeof booking.booking_date === 'string'
      ? booking.booking_date.split('T')[0]
      : new Date(booking.booking_date).toISOString().split('T')[0];
    
    const startTime = booking.booking_time
      ? typeof booking.booking_time === 'string'
        ? booking.booking_time.substring(11, 16)
        : new Date(booking.booking_time).toTimeString().substring(0, 5)
      : '00:00';
    
    const duration = booking.service?.duration
      ? parseDuration(booking.service.duration)
      : 0;
    
    const endTime = calculateEndTime(startTime, duration);
    
    // Fetch reviews for this service
    let reviews: Review[] = [];
    let averageRating = 0;
    try {
      if (booking.service_id) {
        const reviewsResponse = await getServiceReviews(booking.service_id);
        reviews = reviewsResponse.reviews.map((r: ServiceReview) => ({
          id: r.id.toString(),
          userName: r.user?.display_name || `${r.user?.first_name} ${r.user?.last_name}` || 'Anonymous',
          rating: r.rating,
          comment: r.review || '',
          date: typeof r.created_at === 'string' ? r.created_at.split('T')[0] : new Date(r.created_at).toISOString().split('T')[0],
          verified: r.is_verified || false,
        }));
        
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
    
    // Determine category based on service category or title
    const category = determineCategory(booking.service?.category || booking.service?.title || '');
    
    return {
      id: booking.id.toString(),
      serviceName,
      date,
      startTime,
      endTime,
      duration,
      participants: [userName], // Single participant name for now
      participantCount: booking.participants_count,
      location: booking.service?.location || 'Unknown Location',
      averageRating,
      totalReviews: reviews.length,
      earnings: booking.total_amount,
      reviews,
      photos: booking.service?.image_url ? [booking.service.image_url] : [],
      weatherConditions: 'N/A',
      equipmentUsed: booking.service?.equipment || [],
      highlights: [],
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
                      <span>{tour.duration}h</span>
                    </div>
                    <div className="detail-item">
                      <Users className="detail-icon" />
                      <span>{tour.participantCount} participants</span>
                    </div>
                    <div className="detail-item">
                      <MapPin className="detail-icon" />
                      <span>{tour.location}</span>
                    </div>
                  </div>

                  <div className="tour-earnings">
                    <span className="earnings-label">Earnings:</span>
                    <span className="earnings-amount">Rs. {tour.earnings.toLocaleString()}</span>
                  </div>

                  <div className="tour-highlights">
                    {tour.highlights.slice(0, 2).map((highlight, i) => (
                      <span key={i} className="highlight-tag">
                        {highlight}
                      </span>
                    ))}
                    {tour.highlights.length > 2 && (
                      <span className="highlight-more">
                        +{tour.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="tour-actions">
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleViewDetails(tour)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<MessageCircle className="w-4 h-4" />}
                    onClick={() => handleViewReviews(tour)}
                  >
                    Reviews
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<Share2 className="w-4 h-4" />}
                  >
                    Share
                  </Button>
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
                  <div className="tour-images">
                    {selectedTour.photos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Tour photo ${index + 1}`} />
                    ))}
                  </div>

                  <div className="tour-info-grid">
                    <div className="info-section">
                      <h4>Tour Information</h4>
                      <div className="info-items">
                        <div className="info-item">
                          <span className="label">Date:</span>
                          <span className="value">{new Date(selectedTour.date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration:</span>
                          <span className="value">{selectedTour.duration} hours</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Location:</span>
                          <span className="value">{selectedTour.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Weather:</span>
                          <span className="value">{selectedTour.weatherConditions}</span>
                        </div>
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
                      <h4>Highlights</h4>
                      <div className="highlights-list">
                        {selectedTour.highlights.map((highlight, index) => (
                          <div key={index} className="highlight-item">
                            • {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="ghost" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowReviewModal(true)}
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  View Reviews
                </Button>
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
                <Button variant="ghost" onClick={() => setShowReviewModal(false)}>
                  Back to Details
                </Button>
                <Button variant="ghost" onClick={handleCloseModal}>
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
