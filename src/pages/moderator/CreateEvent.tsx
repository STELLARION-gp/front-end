import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaSave, FaImage } from 'react-icons/fa';
import Button from '../../components/Button';
import '../../styles/pages/moderator/CreateEvent.scss';
import { createEvent, type EventPayload } from '../../services/eventsService';

interface CreateEventForm {
  eventName: string;
  societyName: string;
  description: string;
  visibility: 'public' | 'private' | 'members-only';
  date: string;
  time: string;
  location: string;
  eventCategory: string;
  neededVolunteers: string; // string for input
  organizedBy: string;
  images: File[];
  imageUrls: string[];
  maxParticipants: string;
  eventStatus: 'draft' | 'organized' | 'finalized';
  created_at: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventForm>({
    eventName: '',
    societyName: '',
    description: '',
    visibility: 'public',
    date: '',
    time: '',
    location: '',
    eventCategory: '',
    neededVolunteers: '',
    organizedBy: '',
    images: [],
    imageUrls: [],
    maxParticipants: '',
    eventStatus: 'draft',
    created_at: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof CreateEventForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files);
      const previewUrls = fileArr.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
  images: [...prev.images, ...fileArr],
  imageUrls: [...prev.imageUrls, ...previewUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
  images: prev.images.filter((_, i) => i !== index),
  imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setApiError(null); setApiSuccess(null);
      // Build payload converting numeric fields
      const payload: EventPayload = {
        eventName: formData.eventName.trim(),
        societyName: formData.societyName.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        eventCategory: formData.eventCategory.trim(),
        neededVolunteers: formData.neededVolunteers ? Number(formData.neededVolunteers) : undefined,
        organizedBy: formData.organizedBy.trim(),
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        eventStatus: formData.eventStatus,
        images: formData.images.length ? formData.images : undefined,
        imageUrls: undefined
      };
      await createEvent(payload);
      setApiSuccess('Event created successfully');
      // Optional: small delay then navigate
      setTimeout(()=> navigate('/dashboard/moderation/events'), 800);
    } catch (error) {
      console.error('Error creating event:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event">
      {/* Header */}
      <div className="create-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation/events')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>Create Event</h1>
              <p>Create a new platform-organized event or competition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-content">
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3><FaUser /> Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="eventName">Event Name *</label>
                <input
                  type="text"
                  id="eventName"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="societyName">Society Name *</label>
                <input
                  type="text"
                  id="societyName"
                  value={formData.societyName}
                  onChange={(e) => handleInputChange('societyName', e.target.value)}
                  placeholder="Enter society name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizedBy">Organized By *</label>
                <input
                  type="text"
                  id="organizedBy"
                  value={formData.organizedBy}
                  onChange={(e) => handleInputChange('organizedBy', e.target.value)}
                  placeholder="Enter organizer name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the event in detail..."
                  required
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="form-section">
              <h3><FaCalendarAlt /> Event Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Event Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Event Time *</label>
                  <input
                    type="text"
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    placeholder="e.g., 8:00 PM - 11:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="event_category">Event Category *</label>
                  <input
                    type="text"
                    id="eventCategory"
                    value={formData.eventCategory}
                    onChange={(e) => handleInputChange('eventCategory', e.target.value)}
                    placeholder="e.g., Workshop, Competition"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="max_participants">Max Participants</label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="Maximum number of participants"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="neededVolunteers">Needed Volunteers Count</label>
                <input
                  type="number"
                  id="neededVolunteers"
                  value={formData.neededVolunteers}
                  onChange={(e) => handleInputChange('neededVolunteers', e.target.value)}
                  placeholder="Number of volunteers needed"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="form-section">
              <h3><FaImage /> Additional Settings</h3>
              
              <div className="form-group">
                <label htmlFor="imageUrls">Event Images</label>
                <input
                  type="file"
                  id="imageUrls"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
                <div className="image-preview">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={url} alt={`Event preview ${index}`} />
                      <button type="button" onClick={() => removeImage(index)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="eventStatus">Event Status *</label>
                <select
                  id="eventStatus"
                  value={formData.eventStatus}
                  onChange={(e) => handleInputChange('eventStatus', e.target.value as 'draft' | 'organized' | 'finalized')}
                  required
                >
                  <option value="draft">Draft - Not visible to public</option>
                  <option value="organized">Organized - Open for sponsoring</option>
                  <option value="finalized">Finalized - Open for participant registration</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="visibility">Event Visibility *</label>
                <select
                  id="visibility"
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value as 'public' | 'private' | 'members-only')}
                  required
                >
                  <option value="public">Public - Everyone can see and join</option>
                  <option value="members-only">Members Only - Only registered members can see and join</option>
                  <option value="private">Private - Invitation only</option>
                </select>
              </div>

              <div className="visibility-info">
                {formData.visibility === 'public' && (
                  <div className="info-card public">
                    <h4>Public Event</h4>
                    <p>This event will be visible to everyone and anyone can join. Perfect for community-wide events and open workshops.</p>
                  </div>
                )}
                {formData.visibility === 'members-only' && (
                  <div className="info-card members">
                    <h4>Members Only Event</h4>
                    <p>Only registered community members can see and participate in this event. Great for exclusive member activities.</p>
                  </div>
                )}
                {formData.visibility === 'private' && (
                  <div className="info-card private">
                    <h4>Private Event</h4>
                    <p>This event is invitation-only. Only people with direct invitations can see and join the event.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="form-actions flex flex-col gap-4">
            {apiError && <div className="text-sm text-red-400">{apiError}</div>}
            {apiSuccess && <div className="text-sm text-green-400">{apiSuccess}</div>}
            <Button
              type="button"
              variant="border"
              size="large"
              onClick={() => navigate('/dashboard/moderation/events')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isSubmitting}
            >
              <FaSave /> 
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;