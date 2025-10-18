import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaClock, FaArrowLeft } from 'react-icons/fa';
import Button from '../../components/Button';
import stargazingSpotService from '../../services/stargazingSpotService';
import { AuthContext } from '../../contexts/AuthContext';
import type { 
  StargazingSpot as ApiStargazingSpot,
  CreateReviewRequest
} from '../../services/stargazingSpotService';
import '../../styles/pages/enthusiast/SpotDetails.scss';

const SpotDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [spot, setSpot] = useState<ApiStargazingSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  });

  useEffect(() => {
    if (id) {
      fetchSpotDetails();
    }
  }, [id]);

  const fetchSpotDetails = async () => {
    try {
      setLoading(true);
      const response = await stargazingSpotService.getStargazingSpotById(Number(id));
      
      if (response.success && response.data) {
        setSpot(response.data);
      } else {
        setError('Failed to load spot details');
      }
    } catch (err) {
      console.error('Error fetching spot details:', err);
      setError('Failed to load spot details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to submit a review.');
      return;
    }
    
    if (!spot) return;

    try {
      setSubmittingReview(true);
      
      const reviewData: CreateReviewRequest = {
        rating: reviewForm.rating,
        review_text: reviewForm.reviewText.trim()
      };

      const response = await stargazingSpotService.addReview(spot.id, reviewData);
      
      if (response.success) {
        setReviewForm({ rating: 5, reviewText: '' });
        setShowReviewForm(false);
        await fetchSpotDetails();
        alert('Thank you for your review!');
      } else {
        alert(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaStar key={i} className="star empty" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="spot-details">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading spot details...</p>
        </div>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="spot-details">
        <div className="error-state">
          <p>{error || 'Spot not found'}</p>
          <Button onClick={() => navigate('/dashboard/enthusiast/stargazing')}>
            Back to Stargazing
          </Button>
        </div>
      </div>
    );
  }

  const images = spot.image_urls && spot.image_urls.length > 0 
    ? spot.image_urls 
    : [spot.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop'];

  return (
    <div className="spot-details">
      {/* Header */}
      <div className="spot-header">
        <Button
          variant="ghost"
          size="medium"
          onClick={() => navigate('/dashboard/enthusiast/stargazing')}
          className="back-button"
        >
          <FaArrowLeft /> Back to Stargazing
        </Button>
      </div>

      {/* Main Content */}
      <div className="spot-content">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={images[selectedImageIndex]} alt={spot.name} />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${spot.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spot Information */}
        <div className="spot-info">
          <div className="info-header">
            <h1 className="spot-name">{spot.name}</h1>
            <div className="rating-display">
              <div className="stars">{renderStars(spot.rating)}</div>
              <span className="rating-number">{spot.rating.toFixed(1)}</span>
              <span className="review-count">({spot.review_count || 0} reviews)</span>
            </div>
          </div>

          <div className="info-section">
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <span className="label">Location:</span>
              <span className="value">{spot.location}</span>
            </div>
            {spot.best_time && (
              <div className="info-item">
                <FaClock className="icon" />
                <span className="label">Best Time:</span>
                <span className="value">{spot.best_time}</span>
              </div>
            )}
          </div>

          <div className="description-section">
            <h2>About This Location</h2>
            <p>{spot.description}</p>
          </div>

          {spot.facilities && spot.facilities.length > 0 && (
            <div className="facilities-section">
              <h2>Available Facilities</h2>
              <div className="facilities-grid">
                {spot.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <span className="checkmark">✓</span>
                    {facility}
                  </div>
                ))}
              </div>
            </div>
          )}

          {spot.creator && (
            <div className="creator-section">
              <h3>Submitted by</h3>
              <p>{spot.creator.display_name || spot.creator.first_name || 'Anonymous'}</p>
              <p className="submit-date">on {formatDate(spot.created_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews ({spot.reviews?.length || 0})</h2>
          {user && !showReviewForm && (
            <Button
              variant="primary"
              size="medium"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="review-form-container">
            <form onSubmit={handleSubmitReview} className="review-form">
              <h3>Write Your Review</h3>
              
              <div className="form-group">
                <label>Your Rating</label>
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${reviewForm.rating >= star ? 'filled' : ''}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Share your experience at this stargazing location..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ rating: 5, reviewText: '' });
                  }}
                  disabled={submittingReview}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingReview || !reviewForm.reviewText.trim()}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          {spot.reviews && spot.reviews.length > 0 ? (
            spot.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">
                      {review.user?.display_name || review.user?.first_name || 'Anonymous'}
                    </span>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="review-date">{formatDate(review.created_at)}</span>
                </div>
                <p className="review-text">{review.review_text}</p>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to review this spot!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
