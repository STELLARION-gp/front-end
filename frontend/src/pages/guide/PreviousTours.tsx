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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'earnings'>('date');
  const [selectedTour, setSelectedTour] = useState<CompletedTour | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    // Simulate fetching completed tours
    const dummyTours: CompletedTour[] = [
      {
        id: '1',
        serviceName: 'Deep Space Observation Night',
        date: '2025-06-15',
        startTime: '20:00',
        endTime: '23:30',
        duration: 3.5,
        participants: ['Alice Johnson', 'Bob Smith', 'Carol Martinez', 'David Lee'],
        participantCount: 4,
        location: 'Mount Wilson Observatory',
        rating: 4.8,
        averageRating: 4.8,
        totalReviews: 4,
        earnings: 480,
        photos: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
        weatherConditions: 'Clear skies, 15°C',
        equipmentUsed: ['Celestron NexStar 8SE', 'Orion SkyQuest XT10'],
        highlights: ['Saturn rings clearly visible', 'Andromeda Galaxy photography'],
        category: 'observation',
        reviews: [
          {
            id: '1',
            userName: 'Alice Johnson',
            rating: 5,
            comment: 'Absolutely incredible experience! The guide was knowledgeable and passionate.',
            date: '2025-06-16',
            verified: true
          },
          {
            id: '2',
            userName: 'Bob Smith',
            rating: 5,
            comment: 'Best stargazing tour I\'ve ever been on. Highly recommend!',
            date: '2025-06-16',
            verified: true
          }
        ]
      },
      {
        id: '2',
        serviceName: 'Astrophotography Masterclass',
        date: '2025-06-10',
        startTime: '18:00',
        endTime: '02:00',
        duration: 8,
        participants: ['Emma Wilson', 'Frank Chen', 'Grace Kim', 'Henry Davis', 'Iris Zhang', 'Jack Brown'],
        participantCount: 6,
        location: 'Dark Sky Reserve - Joshua Tree',
        rating: 4.9,
        averageRating: 4.9,
        totalReviews: 6,
        earnings: 720,
        photos: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
        weatherConditions: 'Perfect conditions, 12°C',
        equipmentUsed: ['Canon EOS Ra', 'Sky-Watcher Star Adventurer', 'Various lenses'],
        highlights: ['Milky Way core shots', 'Long exposure techniques', 'Post-processing workshop'],
        category: 'photography',
        reviews: [
          {
            id: '3',
            userName: 'Emma Wilson',
            rating: 5,
            comment: 'Learned so much about astrophotography techniques. Amazing results!',
            date: '2025-06-11',
            verified: true
          }
        ]
      },
      {
        id: '3',
        serviceName: 'Telescope Building Workshop',
        date: '2025-06-05',
        startTime: '09:00',
        endTime: '17:00',
        duration: 8,
        participants: ['Lisa Park', 'Mike Taylor', 'Nina Rodriguez', 'Oscar Lee'],
        participantCount: 4,
        location: 'Community Workshop Space',
        rating: 4.7,
        averageRating: 4.7,
        totalReviews: 4,
        earnings: 600,
        photos: ['/api/placeholder/400/300'],
        weatherConditions: 'Indoor workshop',
        equipmentUsed: ['Dobsonian telescope kits', 'Various tools'],
        highlights: ['Built functional telescopes', 'Understanding optics', 'First light success'],
        category: 'workshop',
        reviews: []
      },
      {
        id: '4',
        serviceName: 'Planetary Observation Session',
        date: '2025-05-28',
        startTime: '21:00',
        endTime: '23:00',
        duration: 2,
        participants: ['Paul Green', 'Quinn Adams'],
        participantCount: 2,
        location: 'Local Observatory',
        rating: 4.5,
        averageRating: 4.5,
        totalReviews: 2,
        earnings: 200,
        photos: ['/api/placeholder/400/300'],
        weatherConditions: 'Partly cloudy, 18°C',
        equipmentUsed: ['Refractor telescope'],
        highlights: ['Jupiter and moons', 'Mars observation'],
        category: 'observation',
        reviews: []
      }
    ];
    
    setTours(dummyTours);
    setFilteredTours(dummyTours);
  }, []);

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

  return (
    <div className="previous-tours-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-top">
            <Button
              variant="ghost"
              size="medium"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/dashboard/booking-requests')}
            >
              Back to Booking Requests
            </Button>
          </div>
          <div className="title-section">
            <h2>Previous Tours</h2>
            <p>View your completed tours and manage reviews</p>
          </div>
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
              <div className="earnings-icon">$</div>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Earnings</span>
              <strong className="stat-value">${totalEarnings}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <Card className="filters-container" variant="outlined">
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
        </Card>
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
              <Card className="tour-card" variant="outlined" hover>
                <div className="tour-header">
                  <div className="tour-image">
                    <img 
                      src={tour.photos[0] || '/api/placeholder/400/200'} 
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
                    <span className="earnings-amount">${tour.earnings}</span>
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
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<MessageCircle className="w-4 h-4" />}
                    onClick={() => handleViewReviews(tour)}
                  >
                    Reviews ({tour.totalReviews})
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon={<Share2 className="w-4 h-4" />}
                  >
                    Share
                  </Button>
                </div>
              </Card>
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

              <div className="modal-content">
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

              <div className="modal-content">
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
