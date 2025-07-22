import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaUser, FaSave } from 'react-icons/fa';
import Button from '../../components/Button';
import '../../styles/pages/moderator/CreateEvent.scss';

interface CreateEventForm {
  event_name: string;
  description: string;
  visibility: 'public' | 'private' | 'members-only';
  best_time: string;
  duration: string;
  date: string;
  added_person: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateEventForm>({
    event_name: '',
    description: '',
    visibility: 'public',
    best_time: '',
    duration: '',
    date: '',
    added_person: ''
  });

  const handleInputChange = (field: keyof CreateEventForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
              <p>Create a new community event for moderation</p>
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
                <label htmlFor="added_person">Added by (Moderator) *</label>
                <input
                  type="text"
                  id="added_person"
                  value={formData.added_person}
                  onChange={(e) => handleInputChange('added_person', e.target.value)}
                  placeholder="Moderator name"
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
                  <label htmlFor="best_time">Best Time *</label>
                  <input
                    type="text"
                    id="best_time"
                    value={formData.best_time}
                    onChange={(e) => handleInputChange('best_time', e.target.value)}
                    placeholder="e.g., 8:00 PM - 11:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration *</label>
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="e.g., 3 hours"
                  required
                />
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="form-section">
              <h3><FaEye /> Visibility Settings</h3>
              
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
