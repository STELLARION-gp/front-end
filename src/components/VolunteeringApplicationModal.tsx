import React, { useState } from 'react';
import Button from './Button';
import './../styles/components/VolunteeringApplicationModal.scss';

interface VolunteeringApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: {
    volunteering_role: string;
    motivation: string;
    experience: string;
    availability: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
  }) => Promise<void>;
  nightCampName: string;
  availableRoles: string[];
}

const VolunteeringApplicationModal: React.FC<VolunteeringApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nightCampName,
  availableRoles
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    volunteering_role: '',
    motivation: '',
    experience: '',
    availability: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.volunteering_role || !formData.motivation) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        volunteering_role: '',
        motivation: '',
        experience: '',
        availability: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: ''
      });
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="volunteering-modal-overlay">
      <div className="volunteering-modal">
        <div className="volunteering-modal__header">
          <h2 className="volunteering-modal__title">Apply for Volunteering</h2>
          <button 
            className="volunteering-modal__close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="volunteering-modal__content">
          <p className="volunteering-modal__camp-name">
            <strong>Night Camp:</strong> {nightCampName}
          </p>

          <form onSubmit={handleSubmit} className="volunteering-form">
            <div className="form-group">
              <label htmlFor="volunteering_role" className="form-label">
                Select Role <span className="required">*</span>
              </label>
              <select
                id="volunteering_role"
                name="volunteering_role"
                value={formData.volunteering_role}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Choose a role...</option>
                {availableRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="motivation" className="form-label">
                Why do you want to volunteer for this role? <span className="required">*</span>
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                placeholder="Tell us about your motivation..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">
                Relevant Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                placeholder="Describe any relevant experience you have..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="availability" className="form-label">
                Availability
              </label>
              <textarea
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="form-textarea"
                rows={2}
                placeholder="When are you available? Any scheduling constraints?"
              />
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Emergency Contact Information</h3>
              
              <div className="form-group">
                <label htmlFor="emergency_contact_name" className="form-label">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_phone" className="form-label">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_relationship" className="form-label">
                  Relationship
                </label>
                <input
                  type="text"
                  id="emergency_contact_relationship"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Parent, Spouse, Friend"
                />
              </div>
            </div>

            <div className="volunteering-modal__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VolunteeringApplicationModal;
