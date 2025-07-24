import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaSave, FaImage } from 'react-icons/fa';
import Button from '../../components/Button';
import '../../styles/pages/moderator/CreateEvent.scss';

interface CreateEventForm {
  event_name: string;
  society_name: string;
  description: string;
  visibility: 'public' | 'private' | 'members-only';
  date: string;
  time: string;
  location: string;
  event_category: string;
  needed_volunteers_count: string;
  organized_by: string;
  image_urls: string[];
  max_participants: string;
  event_status: 'draft' | 'organized' | 'finalized';
  created_at: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventForm>({
    event_name: '',
    society_name: '',
    description: '',
    visibility: 'public',
    date: '',
    time: '',
    location: '',
    event_category: '',
    needed_volunteers_count: '',
    organized_by: '',
    image_urls: [],
    max_participants: '',
    event_status: 'draft',
    created_at: new Date().toISOString().split('T')[0] // Set current date as default
  });

  const handleInputChange = (field: keyof CreateEventForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...files]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Event Created:', formData);
      navigate('/dashboard/moderation/events');
    } catch (error) {
      console.error('Error creating event:', error);
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
                <label htmlFor="event_name">Event Name *</label>
                <input
                  type="text"
                  id="event_name"
                  value={formData.event_name}
                  onChange={(e) => handleInputChange('event_name', e.target.value)}
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="society_name">Society Name *</label>
                <input
                  type="text"
                  id="society_name"
                  value={formData.society_name}
                  onChange={(e) => handleInputChange('society_name', e.target.value)}
                  placeholder="Enter society name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="organized_by">Organized By *</label>
                <input
                  type="text"
                  id="organized_by"
                  value={formData.organized_by}
                  onChange={(e) => handleInputChange('organized_by', e.target.value)}
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
                    id="event_category"
                    value={formData.event_category}
                    onChange={(e) => handleInputChange('event_category', e.target.value)}
                    placeholder="e.g., Workshop, Competition"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="max_participants">Max Participants</label>
                  <input
                    type="number"
                    id="max_participants"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', e.target.value)}
                    placeholder="Maximum number of participants"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="needed_volunteers_count">Needed Volunteers Count</label>
                <input
                  type="number"
                  id="needed_volunteers_count"
                  value={formData.needed_volunteers_count}
                  onChange={(e) => handleInputChange('needed_volunteers_count', e.target.value)}
                  placeholder="Number of volunteers needed"
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="form-section">
              <h3><FaImage /> Additional Settings</h3>
              
              <div className="form-group">
                <label htmlFor="image_urls">Event Images</label>
                <input
                  type="file"
                  id="image_urls"
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                />
                <div className="image-preview">
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={url} alt={`Event preview ${index}`} />
                      <button type="button" onClick={() => removeImage(index)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="event_status">Event Status *</label>
                <select
                  id="event_status"
                  value={formData.event_status}
                  onChange={(e) => handleInputChange('event_status', e.target.value as 'draft' | 'organized' | 'finalized')}
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
          <div className="form-actions">
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