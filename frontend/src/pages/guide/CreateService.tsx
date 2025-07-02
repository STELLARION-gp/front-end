import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
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

const UploadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FileIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  // Additional fields for better space utilization
  requirements: string;
  cancellationPolicy: string;
  meetingPoint: string;
  whatToExpect: string;
  weatherPolicy: string;
  bookingDeadline: number;
  languages: string[];
  certification: string;
  experience: string;
  groupDiscount: boolean;
  privateBooking: boolean;
  instantBooking: boolean;
  // Media files
  uploadedFiles: File[];
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
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
    tags: [],
    // Additional fields
    requirements: '',
    cancellationPolicy: '',
    meetingPoint: '',
    whatToExpect: '',
    weatherPolicy: '',
    bookingDeadline: 24,
    languages: [],
    certification: '',
    experience: '',
    groupDiscount: false,
    privateBooking: false,
    instantBooking: true,
    uploadedFiles: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleInputChange = (field: keyof ServiceFormData, value: string | number | boolean | string[] | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleArrayInputChange = (field: 'equipment' | 'tags' | 'languages', value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    handleInputChange(field, arrayValue);
  };

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...files]);
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      console.log('Removing file:', fileToRemove.file.name);
      
      // Remove from uploadedFiles state
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Remove from formData.uploadedFiles
      const updatedFiles = formData.uploadedFiles.filter(file => file !== fileToRemove.file);
      handleInputChange('uploadedFiles', updatedFiles);
      
      // Clean up the preview URL to prevent memory leaks
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      console.log('Remaining files:', updatedFiles.length);
    }
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

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all preview URLs when component unmounts
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

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
                Design your astronomy experience with our unified form interface
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-sections">
            <div className="unified-form-container">
              <div className="unified-form-header">
                <h2 className="form-title">Create Your Astronomy Service</h2>
                <p className="form-subtitle">Complete the form below to share your expertise with fellow astronomy enthusiasts</p>
              </div>
              
              <div className="unified-form-content">
                <div className="form-sections-flow">
                  
                  {/* Unified Form Group - All sections in one flow */}
                  <div className="form-section-group">
                    
                    {/* Basic Information */}
                    <div className="section-divider">
                      <h3 className="section-title">✨ Basic Information</h3>
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
                    </div>

                    {/* Pricing & Logistics */}
                    <div className="section-divider">
                      <h3 className="section-title">💰 Pricing & Logistics</h3>
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
                    </div>

                    {/* Requirements & Expectations */}
                    <div className="section-divider">
                      <h3 className="section-title">📋 Requirements & Expectations</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label htmlFor="whatToExpect">What Participants Can Expect</label>
                          <textarea
                            id="whatToExpect"
                            value={formData.whatToExpect}
                            onChange={(e) => handleInputChange('whatToExpect', e.target.value)}
                            className="form-textarea"
                            placeholder="Describe the detailed experience, activities, and outcomes participants can expect..."
                            rows={3}
                            maxLength={500}
                          />
                          <span className="character-count">{formData.whatToExpect.length}/500</span>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="requirements">Requirements & Prerequisites</label>
                          <textarea
                            id="requirements"
                            value={formData.requirements}
                            onChange={(e) => handleInputChange('requirements', e.target.value)}
                            className="form-textarea"
                            placeholder="Any physical requirements, experience levels, or items participants should bring..."
                            rows={3}
                            maxLength={300}
                          />
                          <span className="character-count">{formData.requirements.length}/300</span>
                        </div>

                        <div className="form-group">
                          <label htmlFor="meetingPoint">Meeting Point</label>
                          <input
                            id="meetingPoint"
                            type="text"
                            value={formData.meetingPoint}
                            onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                            className="form-input"
                            placeholder="Observatory parking lot, main entrance"
                          />
                          <span className="input-help">Where participants should meet</span>
                        </div>

                        <div className="form-group">
                          <label htmlFor="languages">Languages Offered</label>
                          <input
                            id="languages"
                            type="text"
                            value={formData.languages.join(', ')}
                            onChange={(e) => handleArrayInputChange('languages', e.target.value)}
                            className="form-input"
                            placeholder="English, Spanish, French"
                          />
                          <span className="input-help">Languages you can conduct service in</span>
                        </div>
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div className="section-divider">
                      <h3 className="section-title">🖼️ Media Upload</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <div 
                            className={`media-upload-dock ${isDragging ? 'drag-over' : ''} ${uploadedFiles.length > 0 ? 'has-files' : ''}`}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const files = Array.from(e.dataTransfer.files);
                              handleFiles(files);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                          >
                            <UploadIcon className="upload-icon" />
                            <div className="upload-text">Drop files here or click to upload</div>
                            <div className="upload-hint">
                              Supports: JPG, PNG, GIF up to 10MB each
                            </div>
                            <button 
                              type="button" 
                              className="upload-button"
                              onClick={() => document.getElementById('file-input')?.click()}
                            >
                              Choose Files
                            </button>
                            <input
                              id="file-input"
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="file-input"
                              title="Upload service images"
                              aria-label="Upload service images"
                            />
                            
                            {uploadedFiles.length > 0 && (
                              <div className="uploaded-files">
                                {uploadedFiles.map((file) => (
                                  <div key={file.id} className="file-item">
                                    <div className="file-info">
                                      <FileIcon className="file-icon" />
                                      <div className="file-details">
                                        <div className="file-name">{file.file.name}</div>
                                        <div className="file-size">{(file.file.size / 1024 / 1024).toFixed(2)} MB</div>
                                      </div>
                                    </div>
                                    <div className="file-actions">
                                      <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => removeFile(file.id)}
                                        aria-label="Remove file"
                                        title="Remove this file"
                                      >
                                        <DeleteIcon className="delete-icon" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {uploadedFiles.length > 0 && uploadedFiles[0].preview && (
                              <div className="uploaded-preview">
                                <img src={uploadedFiles[0].preview} alt="Service preview" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="equipment">Equipment Provided</label>
                          <input
                            id="equipment"
                            type="text"
                            value={formData.equipment.join(', ')}
                            onChange={(e) => handleArrayInputChange('equipment', e.target.value)}
                            className="form-input"
                            placeholder="Professional Telescope, Star Charts"
                          />
                          <span className="input-help">List equipment you'll provide</span>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="tags">Tags</label>
                          <input
                            id="tags"
                            type="text"
                            value={formData.tags.join(', ')}
                            onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                            className="form-input"
                            placeholder="Deep Space, Galaxies, Nebulae"
                          />
                          <span className="input-help">Add relevant search tags</span>
                        </div>

                        <div className="form-group full-width checkbox-group">
                          <label className="checkbox-label" htmlFor="featured">
                            <input
                              id="featured"
                              type="checkbox"
                              checked={formData.featured}
                              onChange={(e) => handleInputChange('featured', e.target.checked)}
                              className="form-checkbox"
                            />
                            <StarIcon className="featured-icon" />
                            <span className="checkbox-text">Mark as Featured Service</span>
                          </label>
                          <span className="input-help">Featured services appear prominently</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Settings */}
                    <div className="section-divider">
                      <h3 className="section-title">⚙️ Booking Settings</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label htmlFor="bookingDeadline">Booking Deadline (hours)</label>
                          <input
                            id="bookingDeadline"
                            type="number"
                            value={formData.bookingDeadline || ''}
                            onChange={(e) => handleInputChange('bookingDeadline', parseInt(e.target.value) || 24)}
                            className="form-input"
                            placeholder="24"
                            min="1"
                            max="168"
                          />
                          <span className="input-help">Hours before service starts</span>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="weatherPolicy">Weather Policy</label>
                          <select
                            id="weatherPolicy"
                            value={formData.weatherPolicy}
                            onChange={(e) => handleInputChange('weatherPolicy', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Select policy</option>
                            <option value="reschedule">Reschedule if cloudy</option>
                            <option value="partial-refund">50% refund if cancelled</option>
                            <option value="full-refund">Full refund if cancelled</option>
                            <option value="no-refund">No weather cancellations</option>
                          </select>
                        </div>

                        <div className="form-group full-width checkbox-group">
                          <label className="checkbox-label" htmlFor="instantBooking">
                            <input
                              id="instantBooking"
                              type="checkbox"
                              checked={formData.instantBooking}
                              onChange={(e) => handleInputChange('instantBooking', e.target.checked)}
                              className="form-checkbox"
                            />
                            <span className="checkbox-text">Enable Instant Booking</span>
                          </label>
                        </div>

                        <div className="form-group full-width checkbox-group">
                          <label className="checkbox-label" htmlFor="groupDiscount">
                            <input
                              id="groupDiscount"
                              type="checkbox"
                              checked={formData.groupDiscount}
                              onChange={(e) => handleInputChange('groupDiscount', e.target.checked)}
                              className="form-checkbox"
                            />
                            <span className="checkbox-text">Offer Group Discounts</span>
                          </label>
                        </div>

                        <div className="form-group full-width checkbox-group">
                          <label className="checkbox-label" htmlFor="privateBooking">
                            <input
                              id="privateBooking"
                              type="checkbox"
                              checked={formData.privateBooking}
                              onChange={(e) => handleInputChange('privateBooking', e.target.checked)}
                              className="form-checkbox"
                            />
                            <span className="checkbox-text">Allow Private Bookings</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Guide Information */}
                    <div className="section-divider">
                      <h3 className="section-title">👨‍🚀 Guide Information</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label htmlFor="experience">Your Experience</label>
                          <textarea
                            id="experience"
                            value={formData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                            className="form-textarea"
                            placeholder="Tell participants about your background in astronomy, years of experience, specializations..."
                            rows={3}
                            maxLength={500}
                          />
                          <span className="character-count">{formData.experience.length}/500</span>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="certification">Certifications & Qualifications</label>
                          <input
                            id="certification"
                            type="text"
                            value={formData.certification}
                            onChange={(e) => handleInputChange('certification', e.target.value)}
                            className="form-input"
                            placeholder="Astronomy degree, Certified guide..."
                          />
                          <span className="input-help">List relevant certifications</span>
                        </div>

                        <div className="form-group full-width">
                          <label htmlFor="cancellationPolicy">Cancellation Policy</label>
                          <textarea
                            id="cancellationPolicy"
                            value={formData.cancellationPolicy}
                            onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                            className="form-textarea"
                            placeholder="Outline your cancellation and refund policy..."
                            rows={3}
                            maxLength={400}
                          />
                          <span className="character-count">{formData.cancellationPolicy.length}/400</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
