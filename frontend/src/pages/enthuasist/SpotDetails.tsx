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
        stars.push(<FaStar key={i} className="spotdetails-star spotdetails-star-filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="spotdetails-star spotdetails-star-half" />);
      } else {
        stars.push(<FaStar key={i} className="spotdetails-star spotdetails-star-empty" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="spotdetails-page">
        <div className="spotdetails-loading-state">
          <div className="spotdetails-spinner"></div>
          <p>Loading spot details...</p>
        </div>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="spotdetails-page">
        <div className="spotdetails-error-state">
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
    <div className="spotdetails-page_1">
      {/* Header */}
      <div className="spotdetails-hero-header">
        <Button
          variant="ghost"
          size="medium"
          onClick={() => navigate('/dashboard/stargazing')}
          className="spotdetails-back-btn"
        >
          <FaArrowLeft /> Back to Stargazing
        </Button>
        <div className="spotdetails-hero-content">
          <h1 className="spotdetails-hero-title">Stargazing Spot Details</h1>
          <div className="spotdetails-hero-rating">{renderStars(spot.rating)}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="spotdetails-main-content">
        {/* Image Gallery */}
        <div className="spotdetails-gallery">
          <div className="spotdetails-gallery-main">
            <img src={images[selectedImageIndex]} alt={spot.name} />
            <div className="spotdetails-gallery-overlay"></div>
          </div>
          {images.length > 1 && (
            <div className="spotdetails-gallery-thumbs">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`spotdetails-thumb ${index === selectedImageIndex ? 'spotdetails-thumb-active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${spot.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spot Information */}
        <div className="spotdetails-info-card">
          <div className="spotdetails-info-header">
            <h1 className="spotdetails-spot-name">{spot.name}</h1>
            <div className="spotdetails-rating-display">
              <div className="spotdetails-stars-container">{renderStars(spot.rating)}</div>
              <span className="spotdetails-rating-num">{spot.rating.toFixed(1)}</span>
              <span className="spotdetails-review-count">({spot.review_count || 0} reviews)</span>
            </div>
          </div>

          <div className="spotdetails-info-grid">
            <div className="spotdetails-info-item">
              <FaMapMarkerAlt className="spotdetails-info-icon" />
              <div className="spotdetails-info-content">
                <span className="spotdetails-info-label">Location</span>
                <span className="spotdetails-info-value">{spot.location}</span>
              </div>
            </div>
            {spot.best_time && (
              <div className="spotdetails-info-item">
                <FaClock className="spotdetails-info-icon" />
                <div className="spotdetails-info-content">
                  <span className="spotdetails-info-label">Best Time</span>
                  <span className="spotdetails-info-value">{spot.best_time}</span>
                </div>
              </div>
            )}
          </div>

          <div className="spotdetails-description">
            <h2 className="spotdetails-section-title">About This Location</h2>
            <p className="spotdetails-description-text">{spot.description}</p>
          </div>

          {spot.facilities && (
            <div className="spotdetails-facilities">
              <h2 className="spotdetails-section-title">Available Facilities</h2>
              <div className="spotdetails-facilities-grid">
                {(Array.isArray(spot.facilities) 
                  ? spot.facilities 
                  : typeof spot.facilities === 'string' 
                    ? JSON.parse(spot.facilities)
                    : []
                ).map((facility: string, index: number) => (
                  <div key={index} className="spotdetails-facility-chip">
                    <span className="spotdetails-facility-icon">✓</span>
                    {facility}
                  </div>
                ))}
              </div>
            </div>
          )}

          {spot.creator && (
            <div className="spotdetails-creator">
              <h3 className="spotdetails-creator-title">Submitted by</h3>
              <p className="spotdetails-creator-name">{spot.creator.display_name || spot.creator.first_name || 'Anonymous'}</p>
              <p className="spotdetails-creator-date">on {formatDate(spot.created_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="spotdetails-reviews-section">
        <div className="spotdetails-reviews-header">
          <h2 className="spotdetails-reviews-title">Reviews ({spot.reviews?.length || 0})</h2>
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
          <div className="spotdetails-review-form-container">
            <form onSubmit={handleSubmitReview} className="spotdetails-review-form">
              <h3 className="spotdetails-form-title">Write Your Review</h3>
              
              <div className="spotdetails-form-group">
                <label className="spotdetails-form-label">Your Rating</label>
                <div className="spotdetails-star-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`spotdetails-star-btn ${reviewForm.rating >= star ? 'spotdetails-star-btn-filled' : ''}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="spotdetails-form-group">
                <label className="spotdetails-form-label">Your Review</label>
                <textarea
                  className="spotdetails-form-textarea"
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Share your experience at this stargazing location..."
                  rows={5}
                  required
                />
              </div>

              <div className="spotdetails-form-actions">
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
        <div className="spotdetails-reviews-list">
          {spot.reviews && spot.reviews.length > 0 ? (
            spot.reviews.map((review) => (
              <div key={review.id} className="spotdetails-review-card">
                <div className="spotdetails-review-header">
                  <div className="spotdetails-reviewer-info">
                    <span className="spotdetails-reviewer-name">
                      {review.user?.display_name || review.user?.first_name || 'Anonymous'}
                    </span>
                    <div className="spotdetails-review-stars">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="spotdetails-review-date">{formatDate(review.created_at)}</span>
                </div>
                <p className="spotdetails-review-text">{review.review_text}</p>
              </div>
            ))
          ) : (
            <div className="spotdetails-no-reviews">
              <p>No reviews yet. Be the first to review this spot!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
