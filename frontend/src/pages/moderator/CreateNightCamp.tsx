import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaUpload, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/CreateNightCamp.scss';

interface CreateNightCampForm {
  name: string;
  organizedBy: string;
  description: string;
  date: string;
  time: string;
  location: string;
  numberOfParticipants: number;
  imageUrls: string[];
  price: number;
  activities: string[];
  equipment: {
    provided: string[];
    required: string[];
    optional: string[];
  };
  emergencyContact: string;
  duration: string;
  weatherDependent: boolean;
}

const CreateNightCamp: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateNightCampForm>({
    name: '',
    organizedBy: '',
    description: '',
    date: '',
    time: '',
    location: '',
    numberOfParticipants: 10,
    imageUrls: [''],
    price: 0,
    activities: [''],
    equipment: {
      provided: [''],
      required: [''],
      optional: ['']
    },
    emergencyContact: '',
    duration: '',
    weatherDependent: false
  });

  const handleInputChange = (field: keyof CreateNightCampForm, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'imageUrls' | 'activities', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleEquipmentChange = (category: 'provided' | 'required' | 'optional', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [category]: prev.equipment[category].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (field: 'imageUrls' | 'activities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'imageUrls' | 'activities', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const addEquipmentItem = (category: 'provided' | 'required' | 'optional') => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [category]: [...prev.equipment[category], '']
      }
    }));
  };

  const removeEquipmentItem = (category: 'provided' | 'required' | 'optional', index: number) => {
    if (formData.equipment[category].length > 1) {
      setFormData(prev => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          [category]: prev.equipment[category].filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== ''),
        activities: formData.activities.filter(activity => activity.trim() !== ''),
        equipment: {
          provided: formData.equipment.provided.filter(item => item.trim() !== ''),
          required: formData.equipment.required.filter(item => item.trim() !== ''),
          optional: formData.equipment.optional.filter(item => item.trim() !== '')
        }
      };

      console.log('Night Camp Created:', cleanedData);
      navigate('/moderation/camps');
    } catch (error) {
      console.error('Error creating night camp:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-nightcamp">
      {/* Header */}
      <div className="create-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/moderation/camps')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>Create Night Camp Event</h1>
              <p>Create a new overnight stargazing experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-content">
        <form onSubmit={handleSubmit} className="camp-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Event Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter event name"
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
                    placeholder="Organizer name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the night camp experience..."
                  required
                />
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="form-section">
              <h3>Schedule & Location</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">
                    <FaCalendarAlt /> Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Start Time *</label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration *</label>
                  <input
                    type="text"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 10 hours"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">
                    <FaMapMarkerAlt /> Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location details"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="participants">
                    <FaUsers /> Max Participants *
                  </label>
                  <input
                    type="number"
                    id="participants"
                    min="1"
                    max="100"
                    value={formData.numberOfParticipants}
                    onChange={(e) => handleInputChange('numberOfParticipants', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.weatherDependent}
                    onChange={(e) => handleInputChange('weatherDependent', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Weather Dependent Event
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h3>Pricing</h3>
              <div className="form-group">
                <label htmlFor="price">
                  <FaDollarSign /> Total Price per Person *
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Activities */}
            <div className="form-section">
              <h3>Activities</h3>
              <div className="dynamic-list">
                {formData.activities.map((activity, index) => (
                  <div key={index} className="dynamic-item">
                    <input
                      type="text"
                      value={activity}
                      onChange={(e) => handleArrayChange('activities', index, e.target.value)}
                      placeholder="Enter activity"
                    />
                    <div className="item-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={() => addArrayItem('activities')}
                      >
                        <FaPlus />
                      </Button>
                      {formData.activities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          onClick={() => removeArrayItem('activities', index)}
                        >
                          <FaMinus />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="form-section">
              <h3>Equipment</h3>
              
              <div className="equipment-category">
                <h4>Provided Equipment</h4>
                <div className="dynamic-list">
                  {formData.equipment.provided.map((item, index) => (
                    <div key={index} className="dynamic-item">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleEquipmentChange('provided', index, e.target.value)}
                        placeholder="Equipment provided"
                      />
                      <div className="item-actions">
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          onClick={() => addEquipmentItem('provided')}
                        >
                          <FaPlus />
                        </Button>
                        {formData.equipment.provided.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="small"
                            onClick={() => removeEquipmentItem('provided', index)}
                          >
                            <FaMinus />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="equipment-category">
                <h4>Required Equipment</h4>
                <div className="dynamic-list">
                  {formData.equipment.required.map((item, index) => (
                    <div key={index} className="dynamic-item">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleEquipmentChange('required', index, e.target.value)}
                        placeholder="Equipment required"
                      />
                      <div className="item-actions">
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          onClick={() => addEquipmentItem('required')}
                        >
                          <FaPlus />
                        </Button>
                        {formData.equipment.required.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="small"
                            onClick={() => removeEquipmentItem('required', index)}
                          >
                            <FaMinus />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="equipment-category">
                <h4>Optional Equipment</h4>
                <div className="dynamic-list">
                  {formData.equipment.optional.map((item, index) => (
                    <div key={index} className="dynamic-item">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleEquipmentChange('optional', index, e.target.value)}
                        placeholder="Optional equipment"
                      />
                      <div className="item-actions">
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          onClick={() => addEquipmentItem('optional')}
                        >
                          <FaPlus />
                        </Button>
                        {formData.equipment.optional.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="small"
                            onClick={() => removeEquipmentItem('optional', index)}
                          >
                            <FaMinus />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="form-section">
              <h3>
                <FaUpload /> Images
              </h3>
              <div className="dynamic-list">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="dynamic-item">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleArrayChange('imageUrls', index, e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <div className="item-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={() => addArrayItem('imageUrls')}
                      >
                        <FaPlus />
                      </Button>
                      {formData.imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="small"
                          onClick={() => removeArrayItem('imageUrls', index)}
                        >
                          <FaMinus />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety */}
            <div className="form-section">
              <h3>Safety Information</h3>
              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact *</label>
                <input
                  type="tel"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="form-actions">
            <Button
              type="button"
              variant="border"
              size="large"
              onClick={() => navigate('/moderation/camps')}
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
              {isSubmitting ? 'Creating...' : 'Create Night Camp'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNightCamp;
