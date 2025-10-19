import React, { useState, useEffect } from 'react';
import Button from './Button';
import { spaceNewsService, type CreateSpaceNewsRequest } from '../services/spaceNewsService';
import '../styles/components/SpaceNewsModal.scss';

interface SpaceNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const SpaceNewsModal: React.FC<SpaceNewsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateSpaceNewsRequest>({
    title: '',
    content: '',
    category: 'General',
    image_urls: [],
    publish_date: ''
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Set default publish date to current time
      setFormData((prev: CreateSpaceNewsRequest) => ({
        ...prev,
        publish_date: new Date().toISOString().slice(0, 16) // Format for datetime-local input
      }));
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const loadedCategories = await spaceNewsService.getCategories();
      setCategories(loadedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Use default categories if API fails
      setCategories([
        'General', 'NASA', 'SpaceX', 'ESA', 'Astronomy', 'Space Exploration',
        'Planetary Science', 'Astrophysics', 'Telescopes', 'Satellites', 'Mars',
        'Moon', 'Solar System', 'Exoplanets', 'Black Holes', 'Research'
      ]);
    }
  };

  const handleInputChange = (field: keyof CreateSpaceNewsRequest, value: string) => {
    setFormData((prev: CreateSpaceNewsRequest) => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      // For now, create a local URL for the image
      // In production, this would use the actual media upload service
      const imageUrl = URL.createObjectURL(file);
      
      setFormData((prev: CreateSpaceNewsRequest) => ({
        ...prev,
        image_urls: [...(prev.image_urls || []), imageUrl]
      }));
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: CreateSpaceNewsRequest) => ({
      ...prev,
      image_urls: prev.image_urls?.filter((_: string, i: number) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newsData: CreateSpaceNewsRequest = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        image_urls: formData.image_urls || [],
        publish_date: formData.publish_date
      };

      await spaceNewsService.createSpaceNews(newsData);
      
      onSuccess('Space news created successfully!');
      resetForm();
      onClose();
    } catch (err) {
      console.error('Create space news error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create space news');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'General',
      image_urls: [],
      publish_date: ''
    });
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="space-news-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Space News</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter news title..."
              maxLength={255}
              className="form-input"
              required
            />
            <small className="char-count">{formData.title.length}/255</small>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="form-select"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="publish_date">Publish Date</label>
            <input
              id="publish_date"
              type="datetime-local"
              value={formData.publish_date}
              onChange={(e) => handleInputChange('publish_date', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter news content..."
              rows={8}
              className="form-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Images</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-file-input"
              disabled={uploadingImage}
            />
            {uploadingImage && <p className="upload-status">Uploading image...</p>}
            
            {formData.image_urls && formData.image_urls.length > 0 && (
              <div className="uploaded-images">
                {formData.image_urls.map((url: string, index: number) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Upload ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <Button
              type="submit"
              variant="primary"
              disabled={loading || uploadingImage}
            >
              {loading ? 'Creating...' : 'Create News'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpaceNewsModal;