import React, { useState, useEffect } from "react";
import Button from "./Button";
import {
  astronomyEventsService,
  type CreateEventRequest,
} from "../services/astronomyEventsService";
import { apiService } from "../services/api";
import "../styles/components/AstronomyEventModal.scss";

interface AstronomyEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const AstronomyEventModal: React.FC<AstronomyEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateEventRequest>({
    name: "",
    description: "",
    visibility: "naked_eye",
    best_time: "",
    image_url: "",
    event_date: "",
    end_date: "",
    duration: "",
    event_type: "meteor_shower",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      visibility: "naked_eye",
      best_time: "",
      image_url: "",
      event_date: "",
      end_date: "",
      duration: "",
      event_type: "meteor_shower",
    });
    setError(null);
    setUploadedImageUrl(null);
    setUploadError(null);
  };

  // Set default date when modal opens
  useEffect(() => {
    if (isOpen) {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData((prev) => ({
        ...prev,
        event_date: tomorrow.toISOString().split("T")[0],
      }));
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelection = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setUploadError(null);

    // Upload immediately after selection
    setUploadingImage(true);
    try {
      const response = await apiService.uploadMedia(file);
      const imageUrl = response?.file?.file_path || response?.cloudinary?.url;

      if (!imageUrl) {
        throw new Error("Failed to get image URL from upload response");
      }

      setUploadedImageUrl(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));
    } catch (err) {
      console.error("Image upload error:", err);
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setUploadError(null);
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Event name and description are required");
      return;
    }

    if (!formData.event_date) {
      setError("Event date is required");
      return;
    }

    if (!formData.duration.trim()) {
      setError("Duration is required");
      return;
    }

    if (!formData.best_time.trim()) {
      setError("Best time is required");
      return;
    }

    setLoading(true);
    try {
      setError(null);

      const eventData: CreateEventRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        best_time: formData.best_time.trim(),
        image_url: formData.image_url || undefined,
        event_date: formData.event_date,
        end_date: formData.end_date || undefined,
        duration: formData.duration.trim(),
        event_type: formData.event_type,
      };

      await astronomyEventsService.createEvent(eventData);

      onSuccess("Astronomy event created successfully!");
      resetForm();
      onClose();
    } catch (err) {
      console.error("Create event error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create astronomy event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="astronomy-event-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create Astronomy Event</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Event Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Perseid Meteor Shower Peak"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event_type">Event Type</label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
              >
                <option value="meteor_shower">Meteor Shower</option>
                <option value="solar_eclipse">Solar Eclipse</option>
                <option value="lunar_eclipse">Lunar Eclipse</option>
                <option value="planetary_alignment">Planetary Alignment</option>
                <option value="comet_appearance">Comet Appearance</option>
                <option value="supermoon">Supermoon</option>
                <option value="new_moon">New Moon</option>
                <option value="planetary_conjunction">
                  Planetary Conjunction
                </option>
                <option value="saturn_rings_visible">
                  Saturn Rings Visible
                </option>
                <option value="jupiter_moons_visible">
                  Jupiter Moons Visible
                </option>
                <option value="venus_phase">Venus Phase</option>
                <option value="mars_opposition">Mars Opposition</option>
                <option value="asteroid_flyby">Asteroid Flyby</option>
                <option value="auroral_activity">Auroral Activity</option>
                <option value="space_station_pass">Space Station Pass</option>
                <option value="satellite_pass">Satellite Pass</option>
                <option value="planetary_parade">Planetary Parade</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the astronomy event..."
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event_date">Event Date *</label>
              <input
                type="date"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
              >
                <option value="naked_eye">Naked Eye</option>
                <option value="binoculars">Binoculars</option>
                <option value="telescope">Telescope</option>
                <option value="special_equipment">Special Equipment</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2-3 hours, All night"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="best_time">Best Time *</label>
            <input
              type="text"
              id="best_time"
              name="best_time"
              value={formData.best_time}
              onChange={handleInputChange}
              placeholder="e.g., After midnight, Dawn, 9 PM onwards"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Event Image</label>
            <div className="image-upload-section">
              {!uploadedImageUrl && !uploadingImage && (
                <div className="upload-button-wrapper">
                  <input
                    type="file"
                    id="event_image"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    onChange={handleImageSelection}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="event_image" className="upload-button-label">
                    📷 Select Image
                  </label>
                  <p className="upload-hint">
                    JPEG, PNG, GIF, or WebP (max 5MB)
                  </p>
                </div>
              )}

              {uploadingImage && (
                <div className="upload-status">
                  <span className="uploading-spinner">⏳</span> Uploading
                  image...
                </div>
              )}

              {uploadError && (
                <div className="error-message">{uploadError}</div>
              )}

              {uploadedImageUrl && !uploadingImage && (
                <div className="uploaded-images">
                  <div className="image-preview">
                    <img src={uploadedImageUrl} alt="Event preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AstronomyEventModal;
