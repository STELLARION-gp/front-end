import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import stargazingSpotService from "../../services/stargazingSpotService.ts";
import { AuthContext } from "../../contexts/AuthContext";
import type {
  StargazingSpot as ApiStargazingSpot,
  StargazingSpotReview as ApiStargazingSpotReview,
  CreateStargazingSpotRequest,
  CreateReviewRequest,
  StargazingSpotFilters,
} from "../../services/stargazingSpotService.ts";
import "../../styles/pages/enthusiast/Stargazing.scss";

interface Review {
  id: number;
  userName: string;
  rating: number;
  reviewText: string;
  date: string;
}

// Updated interface to match API structure
interface StargazingSpot {
  id: number;
  name: string;
  location: string;
  image: string; // Keep as 'image' for frontend compatibility
  image_urls: string[]; // NEW: Array of Cloudinary URLs
  rating: number;
  bestTime: string; // Keep as 'bestTime' for frontend compatibility
  description: string;
  facilities: string[];
  reviews: Review[];
  status: "pending" | "approved" | "rejected"; // NEW
  // Additional API fields
  image_url?: string;
  best_time?: string;
  created_by?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: number;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
  moderator?: {
    id: number;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
  moderated_by?: number;
  moderated_at?: string;
  review_count?: number;
  average_rating?: number;
}

// Helper function to transform API data to frontend format
const transformApiSpotToFrontend = (apiSpot: ApiStargazingSpot): StargazingSpot => {
  // Backend returns reviews under `stargazing_spot_reviews`; prefer that, fallback to `reviews` if present
  const apiReviews: any[] = (apiSpot as any).stargazing_spot_reviews || (apiSpot as any).reviews || [];

  return {
    id: apiSpot.id,
    name: apiSpot.name,
    location: apiSpot.location,
    image:
      apiSpot.image_urls?.[0] ||
      apiSpot.image_url ||
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    image_urls: apiSpot.image_urls || [],
    rating: apiSpot.rating,
    bestTime: apiSpot.best_time || "",
    description: apiSpot.description,
    facilities: apiSpot.facilities,
    status: apiSpot.status || 'pending',
    reviews: apiReviews.map((review: ApiStargazingSpotReview) => ({
      id: review.id,
      userName: review.user?.display_name || review.user?.first_name || 'Anonymous',
      rating: review.rating,
      reviewText: review.review_text,
      date: new Date(review.created_at).toISOString().split('T')[0]
    })),
    // Include API fields for backend operations
    image_url: apiSpot.image_url,
    best_time: apiSpot.best_time,
    created_by: apiSpot.created_by,
    is_active: apiSpot.is_active,
    created_at: apiSpot.created_at,
    updated_at: apiSpot.updated_at,
    creator: apiSpot.creator,
    moderator: apiSpot.moderator,
    moderated_by: apiSpot.moderated_by,
    moderated_at: apiSpot.moderated_at,
    review_count: apiSpot.review_count,
    average_rating: apiSpot.average_rating,
  };
};

const Stargazing = () => {
  // Get authentication context
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const navigate = useNavigate();

  // State for stargazing spots data
  const [stargazingSpots, setStargazingSpots] = useState<StargazingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedSpot, setSelectedSpot] = useState<StargazingSpot | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [filters, setFilters] = useState({
    location: "",
    rating: 0,
  });
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    rating: 5,
    reviewText: "",
  });
  const [addSpotForm, setAddSpotForm] = useState({
    name: "",
    location: "",
    bestTime: "",
    description: "",
    image: "",
    facilities: [""],
    rating: undefined as number | undefined,
  });

  // NEW: Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Loading states for operations
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingSpot, setSubmittingSpot] = useState(false);
  const [uploadingSpot, setUploadingSpot] = useState(false);

  // Success alert state
  const [successAlert, setSuccessAlert] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  // Fetch stargazing spots on component mount
  useEffect(() => {
    fetchStargazingSpots();
  }, []);

  // Show success alert function
  const showSuccessAlert = (message: string) => {
    setSuccessAlert({ show: true, message });
    setTimeout(() => {
      setSuccessAlert({ show: false, message: "" });
    }, 4000);
  };

  const fetchStargazingSpots = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: StargazingSpotFilters = {
        limit: 50, // Get more spots for the initial load
        sort_by: "created_at",
        sort_order: "desc",
      };

      if (filters.location) {
        apiFilters.location = filters.location;
      }

      const response = await stargazingSpotService.getAllStargazingSpots(
        apiFilters
      );

      if (response.success && response.data) {
        // Filter to show only approved spots
        const approvedSpots = response.data.filter(
          (spot) => spot.status === "approved"
        );
        const transformedSpots = approvedSpots.map(transformApiSpotToFrontend);
        setStargazingSpots(transformedSpots);
      } else {
        setError("Failed to fetch stargazing spots");
      }
    } catch (err) {
      console.error("Error fetching stargazing spots:", err);
      setError("Failed to load stargazing spots. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const closeModal = () => {
    setSelectedSpot(null);
  };

  const handleAddReview = () => {
    setShowAddReview(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      showSuccessAlert("You must be logged in to submit a review.");
      return;
    }

    if (selectedSpot && reviewForm.reviewText.trim()) {
      try {
        setSubmittingReview(true);

        const reviewData: CreateReviewRequest = {
          rating: reviewForm.rating,
          review_text: reviewForm.reviewText.trim(),
        };

        const response = await stargazingSpotService.addReview(
          selectedSpot.id,
          reviewData
        );

        if (response.success) {
          // Reset form and close
          setReviewForm({ userName: "", rating: 5, reviewText: "" });
          setShowAddReview(false);

          // Refresh the selected spot to show the new review
          await refreshSelectedSpot();

          showSuccessAlert(
            "Thank you for your review! It has been submitted successfully."
          );
        } else {
          showSuccessAlert(
            response.message || "Failed to submit review. Please try again."
          );
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        showSuccessAlert("Failed to submit review. Please try again.");
      } finally {
        setSubmittingReview(false);
      }
    }
  };

  const refreshSelectedSpot = async () => {
    if (selectedSpot) {
      try {
        const response = await stargazingSpotService.getStargazingSpotById(
          selectedSpot.id
        );
        if (response.success && response.data) {
          const updatedSpot = transformApiSpotToFrontend(response.data);
          setSelectedSpot(updatedSpot);

          // Also update the spot in the main list
          setStargazingSpots((prev) =>
            prev.map((spot) =>
              spot.id === updatedSpot.id ? updatedSpot : spot
            )
          );
        }
      } catch (error) {
        console.error("Error refreshing spot:", error);
      }
    }
  };

  const handleCancelReview = () => {
    setShowAddReview(false);
    setReviewForm({ userName: "", rating: 5, reviewText: "" });
  };

  const handleAddSpotFormChange = (field: string, value: string) => {
    setAddSpotForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...addSpotForm.facilities];
    newFacilities[index] = value;
    setAddSpotForm((prev) => ({
      ...prev,
      facilities: newFacilities,
    }));
  };

  const addFacility = () => {
    setAddSpotForm((prev) => ({
      ...prev,
      facilities: [...prev.facilities, ""],
    }));
  };

  const removeFacility = (index: number) => {
    const newFacilities = addSpotForm.facilities.filter(
      (_, i) => i !== index
    );
    setAddSpotForm((prev) => ({
      ...prev,
      facilities: newFacilities.length > 0 ? newFacilities : [""],
    }));
  };

  // NEW: Image selection handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 10 images
    if (files.length + selectedImages.length > 10) {
      showSuccessAlert("Maximum 10 images allowed");
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      showSuccessAlert("Only image files are allowed");
    }

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages([...selectedImages, ...validFiles]);
  };

  // NEW: Remove image handler
  const handleRemoveImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmitAddSpot = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!user) {
      showSuccessAlert("You must be logged in to create a stargazing spot.");
      return;
    }

    if (
      addSpotForm.name.trim() &&
      addSpotForm.location.trim() &&
      addSpotForm.description.trim()
    ) {
      try {
        setSubmittingSpot(true);
        setUploadingSpot(true);

        const spotData: CreateStargazingSpotRequest = {
          name: addSpotForm.name.trim(),
          location: addSpotForm.location.trim(),
          description: addSpotForm.description.trim(),
          best_time: addSpotForm.bestTime.trim() || undefined,
          image_url: addSpotForm.image.trim() || undefined,
          facilities: addSpotForm.facilities.filter((f) => f.trim()),
        };

        // Only include rating if it's a valid number between 1-5
        if (
          addSpotForm.rating !== undefined &&
          addSpotForm.rating >= 1 &&
          addSpotForm.rating <= 5
        ) {
          spotData.rating = addSpotForm.rating;
        }

        // Only include images if any are selected
        if (selectedImages.length > 0) {
          spotData.images = selectedImages;
        }

        console.log("Submitting spot data:", {
          ...spotData,
          images: spotData.images
            ? `${spotData.images.length} images`
            : "no images",
        });

        const response = await stargazingSpotService.createStargazingSpot(
          spotData
        );

        if (response.success && response.data) {
          // Reset form and close modal
          setAddSpotForm({
            name: "",
            location: "",
            bestTime: "",
            description: "",
            image: "",
            facilities: [""],
            rating: undefined,
          });
          setSelectedImages([]);
          setImagePreviews([]);
          setShowAddSpotModal(false);

          // Refresh the spots list to include the new spot
          await fetchStargazingSpots();

          showSuccessAlert(
            "Stargazing spot created successfully and submitted for moderation!"
          );
        } else {
          showSuccessAlert(
            response.message ||
              "Failed to create stargazing spot. Please try again."
          );
        }
      } catch (error) {
        console.error("Error creating stargazing spot:", error);
        showSuccessAlert(
          "Failed to create stargazing spot. Please try again."
        );
      } finally {
        setSubmittingSpot(false);
        setUploadingSpot(false);
      }
    }
  };

  const handleCancelAddSpot = () => {
    setShowAddSpotModal(false);
    setAddSpotForm({
      name: "",
      location: "",
      bestTime: "",
      description: "",
      image: "",
      facilities: [""],
      rating: undefined,
    });
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // const clearFilters = () => {
  //   setFilters({
  //     location: '',
  //     rating: 0
  //   });
  // };

  // const hasActiveFilters = () => {
  //   return filters.location || filters.rating > 0;
  // };

  // Handle filter changes and trigger API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) {
        fetchStargazingSpots();
      }
    }, 500); // Debounce filter changes

    return () => clearTimeout(timeoutId);
  }, [filters.location]);

  const filteredSpots = stargazingSpots; // Filtering is now handled by the API

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < totalStars; i++) {
      if (i < filledStars) {
        stars.push("★");
      } else if (i === filledStars && hasHalfStar) {
        stars.push("☆");
      } else {
        stars.push("☆");
      }
    }

    return stars.join("");
  };

  return (
      <div className="stargazing">
        <div className="stargazing__header">
          <div className="stargazing__header-top">
            <div className="stargazing__header-content">
              <h1 className="stargazing__title">Stargazing Destinations</h1>
              <p className="stargazing__subtitle">
                Discover the most spectacular dark sky locations for
                astronomical observation
              </p>
            </div>
            <div className="stargazing__header-actions">
              <button
                className={`stargazing__filter-toggle ${
                  showFilters ? "active" : ""
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                {filters.location && <span className="filter-badge">●</span>}
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
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>
                <div className="stargazing__filter-actions">
                  <button
                    className="stargazing__clear-filters"
                    onClick={() => setFilters({ location: "", rating: 0 })}
                    disabled={!filters.location}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="stargazing__loading">
            <div className="stargazing__loading-spinner"></div>
            <p>Loading stargazing spots...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="stargazing__error">
            <p>{error}</p>
            <button
              className="stargazing__retry-button"
              onClick={fetchStargazingSpots}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Spots Grid */}
        {!loading && !error && (
          <div className="stargazing__grid">
            {filteredSpots.length === 0 ? (
              <div className="stargazing__no-results">
                <p>
                  No stargazing spots found. Try adjusting your filters or add a
                  new spot!
                </p>
              </div>
            ) : (
              filteredSpots.map((spot) => (
                <div key={spot.id} className="stargazing-card">
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
                      <div className="stargazing-card__rating">
                        <span className="stargazing-card__rating-stars">
                          {renderStars(spot.rating)}
                        </span>
                        <span className="stargazing-card__rating-value">
                          {spot.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="stargazing-card__location">
                        <span className="stargazing-card__location-icon">
                          📍
                        </span>
                        <span className="stargazing-card__location-text">
                          {spot.location}
                        </span>
                      </div>

                      <p className="stargazing-card__description">
                        {spot.description}
                      </p>
                    </div>

                    <div className="stargazing-card__actions">
                      <Button
                        onClick={() =>
                          navigate(
                            `/dashboard/enthusiast/stargazing/${spot.id}`
                          )
                        }
                        className="stargazing-card__view-button"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for detailed view */}
        {selectedSpot && (
          <div className="stargazing-modal" onClick={closeModal}>
            <div
              className="stargazing-modal__content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="stargazing-modal__close" onClick={closeModal}>
                ×
              </button>

              <div className="stargazing-modal__header">
                <div className="stargazing-modal__info">
                  <h2 className="stargazing-modal__title">
                    {selectedSpot.name}
                  </h2>
                  <div className="stargazing-modal__location">
                    <span className="stargazing-modal__location-icon">📍</span>
                    <span>{selectedSpot.location}</span>
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
                      <span
                        key={index}
                        className="stargazing-modal__facility-item"
                      >
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
                          <label htmlFor="reviewText">Your Review</label>
                          <textarea
                            id="reviewText"
                            value={reviewForm.reviewText}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                reviewText: e.target.value,
                              })
                            }
                            required
                            placeholder="Share your experience at this stargazing location..."
                            rows={4}
                          />
                        </div>

                        <div className="review-form__actions">
                          <Button
                            type="submit"
                            className="review-form__submit"
                            disabled={submittingReview}
                          >
                            {submittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </Button>
                          <Button
                            type="button"
                            onClick={handleCancelReview}
                            className="review-form__cancel"
                            disabled={submittingReview}
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
                            <span className="review-item__user-name">
                              {review.userName}
                            </span>
                          </div>
                          <span className="review-item__date">
                            {formatDate(review.date)}
                          </span>
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
          <div
            className="stargazing-modal"
            onClick={() => setShowAddSpotModal(false)}
          >
            <div
              className="stargazing-modal__content stargazing-modal__content--add-spot"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="stargazing-modal__header">
                <h2>Add New Stargazing Spot</h2>
                <button
                  className="stargazing-modal__close"
                  onClick={() => setShowAddSpotModal(false)}
                >
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
                      onChange={(e) =>
                        handleAddSpotFormChange("name", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleAddSpotFormChange("location", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleAddSpotFormChange("bestTime", e.target.value)
                      }
                      placeholder="e.g., 9:00 PM - 4:00 AM"
                    />
                  </div>
                  <div className="add-spot-form__group">
                    <label htmlFor="spotImage">Image URL (Optional)</label>
                    <input
                      type="url"
                      id="spotImage"
                      value={addSpotForm.image}
                      onChange={(e) =>
                        handleAddSpotFormChange("image", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* NEW: Image Upload Section */}
                <div className="add-spot-form__group add-spot-form__group--full">
                  <label htmlFor="spotImages">Spot Images (Optional)</label>
                  <p className="help-text">
                    Upload up to 10 images (JPEG, PNG, GIF, WebP)
                  </p>

                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="spotImages"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="spotImages" className="upload-button">
                      📷 Choose Images
                    </label>
                    <span className="image-count">
                      {selectedImages.length} / 10 images selected
                    </span>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="image-preview-grid">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage(index)}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="add-spot-form__group add-spot-form__group--full">
                  <label htmlFor="spotDescription">Description *</label>
                  <textarea
                    id="spotDescription"
                    value={addSpotForm.description}
                    onChange={(e) =>
                      handleAddSpotFormChange("description", e.target.value)
                    }
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
                          onChange={(e) =>
                            handleFacilityChange(index, e.target.value)
                          }
                          placeholder="e.g., Parking, Restrooms, Telescopes"
                        />
                        {addSpotForm.facilities.length > 1 && (
                          <button
                            type="button"
                            className="facility-remove_1"
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

                {/* Add rating input with star selector */}
                <div className="add-spot-form__row">
                  <div className="add-spot-form__group">
                    <label>Your Rating (optional)</label>
                    <div className="star-rating-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${
                            addSpotForm.rating && star <= addSpotForm.rating
                              ? "filled"
                              : ""
                          }`}
                          onClick={() => {
                            setAddSpotForm((prev) => ({
                              ...prev,
                              rating: star,
                            }));
                          }}
                          title={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          ★
                        </button>
                      ))}
                      {addSpotForm.rating && (
                        <button
                          type="button"
                          className="star-clear-btn"
                          onClick={() => {
                            setAddSpotForm((prev) => ({
                              ...prev,
                              rating: undefined,
                            }));
                          }}
                          title="Clear rating"
                        >
                          ✕
                        </button>
                      )}
                      <span className="rating-label">
                        {addSpotForm.rating
                          ? `${addSpotForm.rating} star${
                              addSpotForm.rating > 1 ? "s" : ""
                            }`
                          : "No rating"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="add-spot-form__actions">
                  <button
                    type="button"
                    className="add-spot-form__cancel"
                    onClick={handleCancelAddSpot}
                    disabled={submittingSpot || uploadingSpot}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="add-spot-form__submit"
                    disabled={submittingSpot || uploadingSpot}
                  >
                    {uploadingSpot
                      ? "📤 Uploading..."
                      : submittingSpot
                      ? "Adding..."
                      : "Add Stargazing Spot"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successAlert.show && (
          <div className={`success-alert ${successAlert.show ? "show" : ""}`}>
            <svg
              className="success-alert__icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="success-alert__message">
              {successAlert.message}
            </span>
            <button
              className="success-alert__close"
              onClick={() => setSuccessAlert({ show: false, message: "" })}
            >
              <svg viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L1 13M1 1l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
};

export default Stargazing;
