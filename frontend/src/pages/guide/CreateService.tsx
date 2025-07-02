import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/pages/guide/_createService.scss';

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
    <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

interface ServiceFormData {
  title: string;
  description: string;
  category: 'stargazing' | 'astrophotography' | 'telescope' | 'planetarium' | 'workshop' | 'expedition';
  price: number;
  duration: string;
  maxParticipants: number;
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  nextAvailable: string;
  image: string;
  featured: boolean;
  tags: string[];
}

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    category: 'stargazing',
    price: 0,
    duration: '',
    maxParticipants: 1,
    location: '',
    difficulty: 'Beginner',
    equipment: [],
    nextAvailable: '',
    image: '',
    featured: false,
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'stargazing', label: 'Stargazing', icon: '🔭' },
    { value: 'astrophotography', label: 'Astrophotography', icon: '📸' },
    { value: 'telescope', label: 'Telescope', icon: '🔬' },
    { value: 'planetarium', label: 'Planetarium', icon: '🌌' },
    { value: 'workshop', label: 'Workshop', icon: '🛠️' },
    { value: 'expedition', label: 'Expedition', icon: '🏔️' }
  ];

  const difficulties = [
    { value: 'Beginner', label: 'Beginner', color: '#10b981' },
    { value: 'Intermediate', label: 'Intermediate', color: '#f59e0b' },
    { value: 'Advanced', label: 'Advanced', color: '#ef4444' }
  ];

  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleArrayInputChange = (field: 'equipment' | 'tags', value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    handleInputChange(field, arrayValue);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (formData.maxParticipants <= 0) newErrors.maxParticipants = 'Max participants must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.nextAvailable) newErrors.nextAvailable = 'Next available date is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Service created:', formData);
      
      // Navigate back to services list
      navigate('/dashboard/services');
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/services');
  };

  return (
    <div className="create-service">
      <div className="create-service-container">
        {/* Header */}
        <div className="create-service__header">
          <div className="header-content">
            <div className="header-navigation">
              <Button
                variant="secondary"
                size="medium"
                icon={<ArrowLeftIcon />}
                iconPosition="left"
                onClick={handleCancel}
              >
                Back to Services
              </Button>
            </div>
            
            <div className="title-section">
              <h1 className="page-title">Create New Service</h1>
              <p className="page-subtitle">
                Share your expertise and create an amazing astronomy experience
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-sections">
            
            {/* Basic Information */}
            <Card className="form-section" variant="elevated">
              <div className="section-header">
                <h2 className="section-title">Basic Information</h2>
                <p className="section-subtitle">Essential details about your service</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="title">Service Title *</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g., Deep Space Observation Experience"
                    maxLength={100}
                  />
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level *</label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="form-select"
                  >
                    {difficulties.map(diff => (
                      <option key={diff.value} value={diff.value}>
                        {diff.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Describe your service in detail. What will participants experience? What makes it special?"
                    rows={4}
                    maxLength={1000}
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                  <span className="character-count">{formData.description.length}/1000</span>
                </div>
              </div>
            </Card>

            {/* Pricing & Logistics */}
            <Card className="form-section" variant="elevated">
              <div className="section-header">
                <h2 className="section-title">Pricing & Logistics</h2>
                <p className="section-subtitle">Set your pricing and practical details</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="price">Price (USD) *</label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration *</label>
                  <input
                    id="duration"
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className={`form-input ${errors.duration ? 'error' : ''}`}
                    placeholder="e.g., 3 hours, 2 days"
                  />
                  {errors.duration && <span className="error-message">{errors.duration}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="maxParticipants">Max Participants *</label>
                  <input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 1)}
                    className={`form-input ${errors.maxParticipants ? 'error' : ''}`}
                    placeholder="1"
                    min="1"
                  />
                  {errors.maxParticipants && <span className="error-message">{errors.maxParticipants}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="nextAvailable">Next Available Date *</label>
                  <input
                    id="nextAvailable"
                    type="date"
                    value={formData.nextAvailable}
                    onChange={(e) => handleInputChange('nextAvailable', e.target.value)}
                    className={`form-input ${errors.nextAvailable ? 'error' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.nextAvailable && <span className="error-message">{errors.nextAvailable}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    placeholder="e.g., Dark Sky Observatory, Mount Wilson"
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
              </div>
            </Card>

            {/* Media & Additional Details */}
            <Card className="form-section" variant="elevated">
              <div className="section-header">
                <h2 className="section-title">Media & Additional Details</h2>
                <p className="section-subtitle">Add images and extra information</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="image">Image URL *</label>
                  <div className="image-input-wrapper">
                    <ImageIcon className="image-icon" />
                    <input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className={`form-input ${errors.image ? 'error' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {errors.image && <span className="error-message">{errors.image}</span>}
                  {formData.image && (
                    <div className="image-preview">
                      <img src={formData.image} alt="Service preview" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} />
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="equipment">Equipment Provided</label>
                  <input
                    id="equipment"
                    type="text"
                    value={formData.equipment.join(', ')}
                    onChange={(e) => handleArrayInputChange('equipment', e.target.value)}
                    className="form-input"
                    placeholder="Professional Telescope, Star Charts, Red Light Flashlight (comma-separated)"
                  />
                  <span className="input-help">List the equipment you'll provide, separated by commas</span>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="tags">Tags</label>
                  <input
                    id="tags"
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                    className="form-input"
                    placeholder="Deep Space, Galaxies, Nebulae, Night Sky (comma-separated)"
                  />
                  <span className="input-help">Add relevant tags to help people find your service</span>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="form-checkbox"
                    />
                    <StarIcon className="featured-icon" />
                    <span className="checkbox-text">Mark as Featured Service</span>
                  </label>
                  <span className="input-help">Featured services appear prominently in search results</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              size="large"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              icon={<SaveIcon />}
              iconPosition="left"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Service...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
