import React, { useState } from 'react';
import Button from '../../components/Button';
import '../../styles/pages/enthusiast/Stargazing.scss';

interface Review {
  id: number;
  userName: string;
  rating: number;
  reviewText: string;
  date: string;
}

interface StargazingSpot {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  bestTime: string;
  description: string;
  facilities: string[];
  reviews: Review[];
}

const stargazingSpots: StargazingSpot[] = [
  {
    id: 1,
    name: "Horton Plains National Park",
    location: "Nuwara Eliya, Central Province",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    rating: 4.9,
    bestTime: "8:30 PM - 5:30 AM",
    description: "Located at 2,100m elevation, Horton Plains offers exceptional stargazing with minimal light pollution. The high altitude and cool climate provide crystal-clear night skies perfect for observing constellations and the Milky Way.",
    facilities: ["Camping Permits", "Parking", "Nature Trails", "Visitor Center", "Restrooms", "Wildlife Viewing"],
    reviews: [
      {
        id: 1,
        userName: "Tharindu_Astro",
        rating: 5,
        reviewText: "Amazing experience! The high altitude makes the stars incredibly bright. Saw the Southern Cross clearly and even some shooting stars. The cold weather is worth it for these views!",
        date: "2024-06-15"
      },
      {
        id: 2,
        userName: "NaturePhotoLK",
        rating: 5,
        reviewText: "Perfect for astrophotography! The lack of light pollution here is incredible. Captured some stunning Milky Way shots. Remember to bring warm clothes - it gets very cold at night.",
        date: "2024-06-10"
      },
      {
        id: 3,
        userName: "HikingBuddySL",
        rating: 4,
        reviewText: "Beautiful stargazing spot! World's End provides an amazing backdrop. The camping experience under these stars is unforgettable. Wildlife Department staff are very helpful.",
        date: "2024-06-05"
      }
    ]
  },
  {
    id: 2,
    name: "Pidurangala Rock",
    location: "Sigiriya, North Central Province",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
    rating: 4.7,
    bestTime: "9:00 PM - 4:30 AM",
    description: "Ancient rock formation offering panoramic views of the Cultural Triangle. The elevated position provides excellent stargazing opportunities with Sigiriya Rock as a dramatic silhouette against the night sky.",
    facilities: ["Parking", "Local Guides", "Temple Access", "Photography Spots", "Hiking Trails"],
    reviews: [
      {
        id: 1,
        userName: "CulturalExplorerLK",
        rating: 5,
        reviewText: "Magical experience! Watching the stars above with Sigiriya Rock in view is absolutely breathtaking. The climb is challenging but worth every step for this view.",
        date: "2024-06-18"
      },
      {
        id: 2,
        userName: "AncientWondersSL",
        rating: 4,
        reviewText: "Great combination of history and astronomy. The ancient temple adds a spiritual element to stargazing. Best visited during dry season for clearest skies.",
        date: "2024-06-12"
      }
    ]
  },
  {
    id: 3,
    name: "Knuckles Mountain Range",
    location: "Matale & Kandy Districts",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
    rating: 4.8,
    bestTime: "8:00 PM - 5:00 AM",
    description: "UNESCO World Heritage site offering pristine night skies away from city lights. The mountain peaks provide multiple elevated viewing points with spectacular 360-degree views of the star-filled sky.",
    facilities: ["Eco-lodges", "Camping Sites", "Hiking Trails", "Local Guides", "Village Homestays", "Organic Food"],
    reviews: [
      {
        id: 1,
        userName: "MountaineerSL",
        rating: 5,
        reviewText: "Absolutely pristine skies! The biodiversity here is amazing during the day, and the stars at night are phenomenal. Stayed at a village homestay - locals are incredibly welcoming.",
        date: "2024-06-20"
      },
      {
        id: 2,
        userName: "EcoTouristLK",
        rating: 5,
        reviewText: "Best stargazing experience in Sri Lanka! The lack of light pollution combined with high altitude creates perfect conditions. The mini-world's end viewpoint is spectacular.",
        date: "2024-06-14"
      },
      {
        id: 3,
        userName: "NightSkyWatcher",
        rating: 4,
        reviewText: "Incredible experience! Multiple viewpoints mean you can choose your perfect spot. The trek can be challenging, but the reward is worth it. Saw satellites passing overhead clearly.",
        date: "2024-06-08"
      }
    ]
  },
  {
    id: 4,
    name: "Yala National Park - Block 1",
    location: "Hambantota & Monaragala Districts",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=250&fit=crop",
    rating: 4.6,
    bestTime: "9:30 PM - 4:30 AM",
    description: "Famous wildlife park that transforms into a stargazer's paradise after dark. The open savanna landscape provides unobstructed horizon views, perfect for observing rising constellations and meteor showers.",
    facilities: ["Safari Camping", "Wildlife Lodges", "Park Rangers", "4WD Access", "Photography Hides", "Visitor Center"],
    reviews: [
      {
        id: 1,
        userName: "WildlifeLoverSL",
        rating: 5,
        reviewText: "Unique experience combining wildlife and astronomy! Heard leopards calling while watching the stars. The open landscape provides amazing horizon views. Night camping is unforgettable.",
        date: "2024-06-16"
      },
      {
        id: 2,
        userName: "SafariGuide_Yala",
        rating: 4,
        reviewText: "Great spot for stargazing after the safari ends. The lack of artificial lights in the park makes for excellent star visibility. Rangers are knowledgeable about local astronomy too.",
        date: "2024-06-11"
      }
    ]
  },
  {
    id: 5,
    name: "Mannar Island - Baobab Hill",
    location: "Mannar District, Northern Province",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    rating: 4.5,
    bestTime: "8:45 PM - 5:15 AM",
    description: "Remote island location with ancient baobab trees creating a unique stargazing atmosphere. The isolation from major cities ensures dark skies, while the coastal location offers views of stars reflecting on the water.",
    facilities: ["Camping Areas", "Local Guesthouses", "Fishing Boats", "Historical Sites", "Beach Access", "Cultural Tours"],
    reviews: [
      {
        id: 1,
        userName: "IslandExplorerLK",
        rating: 5,
        reviewText: "Most unique stargazing spot in Sri Lanka! The ancient baobab trees silhouetted against the stars create an otherworldly atmosphere. Very peaceful and isolated.",
        date: "2024-06-19"
      },
      {
        id: 2,
        userName: "CulturalTravelerSL",
        rating: 4,
        reviewText: "Fascinating combination of history, culture, and astronomy. The local Tamil community shares amazing stories about star navigation. Best accessed by boat during calm weather.",
        date: "2024-06-13"
      }
    ]
  },
  {
    id: 6,
    name: "Ella Rock Summit",
    location: "Ella, Uva Province",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
    rating: 4.7,
    bestTime: "8:30 PM - 5:00 AM",
    description: "Iconic viewpoint offering spectacular views of the hill country and night sky. The elevated position at 1,041m provides excellent stargazing conditions with the Southern Cross prominently visible.",
    facilities: ["Hiking Trails", "Local Guides", "Tea Estate Views", "Photography Points", "Village Guesthouses", "Railway Access"],
    reviews: [
      {
        id: 1,
        userName: "HillCountryHiker",
        rating: 5,
        reviewText: "Incredible 360-degree views! The train journey to Ella adds to the adventure. Watching stars above the tea plantations is magical. The Southern Cross is clearly visible from here.",
        date: "2024-06-17"
      },
      {
        id: 2,
        userName: "BackpackerSL",
        rating: 4,
        reviewText: "Popular spot but worth the crowd. The hike up can be challenging in the dark, so bring good torches. The reward is amazing views of both the hill country and stars above.",
        date: "2024-06-09"
      }
    ]
  }
];

const Stargazing: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<StargazingSpot | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    rating: 0
  });
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    reviewText: ''
  });
  const [addSpotForm, setAddSpotForm] = useState({
    name: '',
    location: '',
    bestTime: '',
    description: '',
    image: '',
    facilities: ['']
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'star--filled' : 'star--empty'}`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (spot: StargazingSpot) => {
    setSelectedSpot(spot);
    setShowAddReview(false);
  };

  const closeModal = () => {
    setSelectedSpot(null);
    setShowAddReview(false);
    setReviewForm({ userName: '', rating: 5, reviewText: '' });
  };

  const handleAddReview = () => {
    setShowAddReview(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpot && reviewForm.userName.trim() && reviewForm.reviewText.trim()) {
      // In a real app, this would be sent to a backend
      console.log('Submitting review:', {
        spotId: selectedSpot.id,
        ...reviewForm,
        date: new Date().toISOString().split('T')[0]
      });
      
      // Reset form and close
      setReviewForm({ userName: '', rating: 5, reviewText: '' });
      setShowAddReview(false);
      
      // Show success message (in a real app, you'd update the state with the new review)
      alert('Thank you for your review! It has been submitted successfully.');
    }
  };

  const handleCancelReview = () => {
    setShowAddReview(false);
    setReviewForm({ userName: '', rating: 5, reviewText: '' });
  };

  const handleAddSpotFormChange = (field: string, value: string) => {
    setAddSpotForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...addSpotForm.facilities];
    newFacilities[index] = value;
    setAddSpotForm(prev => ({
      ...prev,
      facilities: newFacilities
    }));
  };

  const addFacility = () => {
    setAddSpotForm(prev => ({
      ...prev,
      facilities: [...prev.facilities, '']
    }));
  };

  const removeFacility = (index: number) => {
    const newFacilities = addSpotForm.facilities.filter((_, i) => i !== index);
    setAddSpotForm(prev => ({
      ...prev,
      facilities: newFacilities.length > 0 ? newFacilities : ['']
    }));
  };

  const handleSubmitAddSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (addSpotForm.name.trim() && addSpotForm.location.trim() && addSpotForm.description.trim()) {
      // In a real app, this would be sent to a backend
      console.log('Adding new stargazing spot:', {
        ...addSpotForm,
        id: stargazingSpots.length + 1,
        rating: 0,
        reviews: [],
        facilities: addSpotForm.facilities.filter(f => f.trim())
      });
      
      // Reset form and close modal
      setAddSpotForm({
        name: '',
        location: '',
        bestTime: '',
        description: '',
        image: '',
        facilities: ['']
      });
      setShowAddSpotModal(false);
      
      // Show success message
      alert('Stargazing spot added successfully!');
    }
  };

  const handleCancelAddSpot = () => {
    setShowAddSpotModal(false);
    setAddSpotForm({
      name: '',
      location: '',
      bestTime: '',
      description: '',
      image: '',
      facilities: ['']
    });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      rating: 0
    });
  };

  const hasActiveFilters = () => {
    return filters.location || filters.rating > 0;
  };

  const filteredSpots = stargazingSpots.filter(spot => {
    // Location filter
    if (filters.location && !spot.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Rating filter - show spots with rating >= selected rating
    if (filters.rating > 0 && spot.rating < filters.rating) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="stargazing">
      <div className="stargazing__header">
        <div className="stargazing__header-top">
          <div className="stargazing__header-content">
            <h1 className="stargazing__title">Stargazing Destinations</h1>
            <p className="stargazing__subtitle">
              Discover the most spectacular dark sky locations for astronomical observation
            </p>
          </div>
          <div className="stargazing__header-actions">
            <button 
              className={`stargazing__filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {hasActiveFilters() && <span className="filter-badge">●</span>}
            </button>
            <Button 
              className="stargazing__add-button"
              onClick={() => setShowAddSpotModal(true)}
            >
              + Add Stargazing Spot
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="stargazing__filters">
            <div className="stargazing__filter-row">
              <div className="stargazing__filter-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              <div className="stargazing__filter-group">
                <label>Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: Number(e.target.value)})}
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={3.5}>3.5+ Stars</option>
                  <option value={3.0}>3.0+ Stars</option>
                </select>
              </div>
              <div className="stargazing__filter-actions">
                <button 
                  className="stargazing__clear-filters"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters()}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="stargazing__grid">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="stargazing-card">
            <div className="stargazing-card__rating-badge">
              <span className="stargazing-card__rating-value">{spot.rating.toFixed(1)}</span>
              <div className="stargazing-card__stars">
                {renderStars(Math.floor(spot.rating))}
              </div>
            </div>
            
            <div className="stargazing-card__image-container">
              <img 
                src={spot.image} 
                alt={spot.name}
                className="stargazing-card__image"
              />
            </div>

            <div className="stargazing-card__content">
              <div className="stargazing-card__content-top">
                <h3 className="stargazing-card__title">{spot.name}</h3>
                
                <div className="stargazing-card__location">
                  <span className="stargazing-card__location-icon">📍</span>
                  <span className="stargazing-card__location-text">{spot.location}</span>
                </div>


                <p className="stargazing-card__description">
                  {spot.description}
                </p>
              </div>

                <div className="stargazing-card__actions">
                  <Button
                    onClick={() => handleViewDetails(spot)}
                    className="stargazing-card__view-button"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
        
        ))}
      </div>

      {/* Modal for detailed view */}
      {selectedSpot && (
        <div className="stargazing-modal" onClick={closeModal}>
          <div className="stargazing-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="stargazing-modal__close" onClick={closeModal}>
              ×
            </button>
            
            <div className="stargazing-modal__header">
              <div className="stargazing-modal__info">
                <h2 className="stargazing-modal__title">{selectedSpot.name}</h2>
                <div className="stargazing-modal__location">
                  <span className="stargazing-modal__location-icon">📍</span>
                  <span>{selectedSpot.location}</span>
                </div>
                <div className="stargazing-modal__rating">
                  <span className="stargazing-modal__rating-value">{selectedSpot.rating.toFixed(1)}</span>
                  <div className="stargazing-modal__stars">
                    {renderStars(Math.floor(selectedSpot.rating))}
                  </div>
                </div>
              </div>
            </div>

            <div className="stargazing-modal__body">
              <div className="stargazing-modal__time">
                <h3>Best Viewing Time</h3>
                <p>🌙 {selectedSpot.bestTime}</p>
              </div>

              <div className="stargazing-modal__description">
                <h3>Description</h3>
                <p>{selectedSpot.description}</p>
              </div>

              <div className="stargazing-modal__facilities">
                <h3>All Available Facilities</h3>
                <div className="stargazing-modal__facilities-grid">
                  {selectedSpot.facilities.map((facility, index) => (
                    <span key={index} className="stargazing-modal__facility-item">
                      ✓ {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div className="stargazing-modal__reviews">
                <div className="stargazing-modal__reviews-header">
                  <h3>Reviews ({selectedSpot.reviews.length})</h3>
                  <Button
                    onClick={handleAddReview}
                    className="stargazing-modal__add-review-btn"
                  >
                    Add Review
                  </Button>
                </div>

                {showAddReview && (
                  <div className="stargazing-modal__review-form">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div className="review-form__field">
                        <label htmlFor="userName">Your Name</label>
                        <input
                          type="text"
                          id="userName"
                          value={reviewForm.userName}
                          onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
                          required
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="review-form__field">
                        <label htmlFor="rating">Rating</label>
                        <select
                          id="rating"
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                        >
                          <option value={5}>5 Stars - Excellent</option>
                          <option value={4}>4 Stars - Very Good</option>
                          <option value={3}>3 Stars - Good</option>
                          <option value={2}>2 Stars - Fair</option>
                          <option value={1}>1 Star - Poor</option>
                        </select>
                      </div>

                      <div className="review-form__field">
                        <label htmlFor="reviewText">Your Review</label>
                        <textarea
                          id="reviewText"
                          value={reviewForm.reviewText}
                          onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                          required
                          placeholder="Share your experience at this stargazing location..."
                          rows={4}
                        />
                      </div>

                      <div className="review-form__actions">
                        <Button type="submit" className="review-form__submit">
                          Submit Review
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleCancelReview}
                          className="review-form__cancel"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="stargazing-modal__reviews-list">
                  {selectedSpot.reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-item__header">
                        <div className="review-item__user-info">
                          <span className="review-item__user-name">{review.userName}</span>
                          <div className="review-item__rating">
                            <span className="review-item__rating-value">{review.rating.toFixed(1)}</span>
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="review-item__date">{formatDate(review.date)}</span>
                      </div>
                      <div className="review-item__content">
                        <p>{review.reviewText}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Spot Modal */}
      {showAddSpotModal && (
        <div className="stargazing-modal" onClick={() => setShowAddSpotModal(false)}>
          <div className="stargazing-modal__content stargazing-modal__content--add-spot" onClick={(e) => e.stopPropagation()}>
            <div className="stargazing-modal__header">
              <h2>Add New Stargazing Spot</h2>
              <button className="stargazing-modal__close" onClick={() => setShowAddSpotModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitAddSpot} className="add-spot-form">
              <div className="add-spot-form__row">
                <div className="add-spot-form__group">
                  <label htmlFor="spotName">Spot Name *</label>
                  <input
                    type="text"
                    id="spotName"
                    value={addSpotForm.name}
                    onChange={(e) => handleAddSpotFormChange('name', e.target.value)}
                    placeholder="Enter spot name"
                    required
                  />
                </div>
                <div className="add-spot-form__group">
                  <label htmlFor="spotLocation">Location *</label>
                  <input
                    type="text"
                    id="spotLocation"
                    value={addSpotForm.location}
                    onChange={(e) => handleAddSpotFormChange('location', e.target.value)}
                    placeholder="City, State/Country"
                    required
                  />
                </div>
              </div>

              <div className="add-spot-form__row">
                <div className="add-spot-form__group">
                  <label htmlFor="bestTime">Best Time</label>
                  <input
                    type="text"
                    id="bestTime"
                    value={addSpotForm.bestTime}
                    onChange={(e) => handleAddSpotFormChange('bestTime', e.target.value)}
                    placeholder="e.g., 9:00 PM - 4:00 AM"
                  />
                </div>
                <div className="add-spot-form__group">
                  <label htmlFor="spotImage">Image URL</label>
                  <input
                    type="url"
                    id="spotImage"
                    value={addSpotForm.image}
                    onChange={(e) => handleAddSpotFormChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="add-spot-form__group add-spot-form__group--full">
                <label htmlFor="spotDescription">Description *</label>
                <textarea
                  id="spotDescription"
                  value={addSpotForm.description}
                  onChange={(e) => handleAddSpotFormChange('description', e.target.value)}
                  placeholder="Describe what makes this spot special for stargazing..."
                  rows={4}
                  required
                />
              </div>

              <div className="add-spot-form__group add-spot-form__group--full">
                <label>Facilities</label>
                <div className="facilities-list">
                  {addSpotForm.facilities.map((facility, index) => (
                    <div key={index} className="facility-input">
                      <input
                        type="text"
                        value={facility}
                        onChange={(e) => handleFacilityChange(index, e.target.value)}
                        placeholder="e.g., Parking, Restrooms, Telescopes"
                      />
                      {addSpotForm.facilities.length > 1 && (
                        <button
                          type="button"
                          className="facility-remove"
                          onClick={() => removeFacility(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="facility-add"
                    onClick={addFacility}
                  >
                    + Add Facility
                  </button>
                </div>
              </div>

              <div className="add-spot-form__actions">
                <button
                  type="button"
                  className="add-spot-form__cancel"
                  onClick={handleCancelAddSpot}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="add-spot-form__submit"
                >
                  Add Stargazing Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stargazing;
