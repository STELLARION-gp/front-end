import React, { useState, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import '../../styles/pages/guide/_mediaUploadPanel.scss';

// Simple Upload Icon Component
const UploadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L12 12M12 2L8 6M12 2L16 6M3 12L3 20C3 20.5523 3.44772 21 4 21L20 21C20.5523 21 21 20.5523 21 20L21 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  uploadDate: Date;
  description?: string;
  tourName?: string;
  location?: string;
  tags?: string[];
}

interface MediaUploadPanelProps {
  onMediaUploaded?: (media: MediaFile[]) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  showSidebar?: boolean; // Whether to show sidebar layout
}

interface UploadMode {
  type: 'single' | 'album';
  albumName?: string;
  albumDescription?: string;
}

interface AlbumData {
  name: string;
  description: string;
  tourName: string;
  location: string;
  tags: string[];
}

const MediaUploadPanel: React.FC<MediaUploadPanelProps> = ({
  onMediaUploaded,
  maxFileSize = 50, // 50MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'],
  showSidebar = true // Default to showing sidebar
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadMode, setUploadMode] = useState<UploadMode>({ type: 'single' });
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [albumData, setAlbumData] = useState<AlbumData>({
    name: '',
    description: '',
    tourName: '',
    location: '',
    tags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please upload images (JPEG, PNG, WebP) or videos (MP4, WebM, MOV).`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit.`;
    }
    return null;
  };

  const processFile = useCallback((file: File): Promise<MediaFile> => {
    return new Promise((resolve, reject) => {
      const validation = validateFile(file);
      if (validation) {
        reject(new Error(validation));
        return;
      }

      const id = generateId();
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';

      const mediaFile: MediaFile = {
        id,
        file,
        url,
        type,
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
      };

      resolve(mediaFile);
    });
  }, [maxFileSize, allowedTypes]);

  const handleFiles = async (files: FileList | File[]) => {
    console.log('🎯 handleFiles called with files:', files);
    console.log('🎯 Files length:', files.length);
    console.log('🎯 Upload mode:', uploadMode.type);
    
    const commonData = uploadMode.type === 'album' ? {
      description: albumData.description,
      tourName: albumData.tourName,
      location: albumData.location,
      tags: albumData.tags
    } : {};

    console.log('🎯 Common data:', commonData);

    // Convert FileList to array if necessary
    const fileArray = Array.isArray(files) ? files : Array.from(files);

    // Process files sequentially for better progress tracking
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      console.log(`🎯 Processing file ${i + 1}/${fileArray.length}: ${file.name}`);
      
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const mediaFile = await processFile(file);
        
        // Simulate realistic upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 12 + 8; // Random increment between 8-20%
          
          setUploadProgress(prev => ({ ...prev, [file.name]: Math.min(progress, 100) }));
          
          if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Apply common album data if in album mode
            const finalMediaFile = { ...mediaFile, ...commonData };
            
            // Add the file to media files immediately after completion
            setMediaFiles(prev => [...prev, finalMediaFile]);
            
            // Complete the progress after a short delay
            setTimeout(() => {
              setUploadProgress(prev => {
                const updated = { ...prev };
                delete updated[file.name];
                return updated;
              });
              
              // Call onMediaUploaded for this individual file
              onMediaUploaded?.([finalMediaFile]);
            }, 300);
          }
        }, 120);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }

  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (uploadMode.type === 'single') {
        if (e.dataTransfer.files.length === 1) {
          // Single upload mode with single file - process directly
          handleFiles(e.dataTransfer.files);
        } else {
          // Single mode but multiple files - ask user if they want to switch to album mode
          const switchToAlbum = confirm(
            `You're in Single Upload mode but dropped ${e.dataTransfer.files.length} files. ` +
            'Would you like to switch to Album mode to upload all files together?'
          );
          
          if (switchToAlbum) {
            setUploadMode({ type: 'album' });
            const files = e.dataTransfer.files;
            // Set pending files first, then show modal
            setPendingFiles(Array.from(files));
            // Use React's flushSync to ensure state is updated immediately
            flushSync(() => {
              setShowAlbumModal(true);
            });
          } else {
            // Just upload the first file in single mode
            const singleFile = new DataTransfer();
            singleFile.items.add(e.dataTransfer.files[0]);
            handleFiles(singleFile.files);
            alert(`Only uploaded the first file (${e.dataTransfer.files[0].name}). Switch to Album mode to upload multiple files.`);
          }
        }
      } else if (uploadMode.type === 'album') {
        // Album mode - show modal for batch upload
        const files = e.dataTransfer.files;
        setPendingFiles(Array.from(files));
        // Use React's flushSync to ensure state is updated immediately
        flushSync(() => {
          setShowAlbumModal(true);
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (uploadMode.type === 'single') {
        if (e.target.files.length === 1) {
          // Single upload mode with single file - process directly
          handleFiles(e.target.files);
        } else {
          // Single mode but multiple files - ask user if they want to switch to album mode
          const switchToAlbum = confirm(
            `You're in Single Upload mode but selected ${e.target.files.length} files. ` +
            'Would you like to switch to Album mode to upload all files together?'
          );
          
          if (switchToAlbum) {
            setUploadMode({ type: 'album' });
            const files = e.target.files;
            // Set pending files first, then show modal
            setPendingFiles(Array.from(files));
            // Use React's flushSync to ensure state is updated immediately
            flushSync(() => {
              setShowAlbumModal(true);
            });
          } else {
            // Just upload the first file in single mode
            const singleFile = new DataTransfer();
            singleFile.items.add(e.target.files[0]);
            handleFiles(singleFile.files);
            alert(`Only uploaded the first file (${e.target.files[0].name}). Switch to Album mode to upload multiple files.`);
          }
        }
      } else if (uploadMode.type === 'album') {
        // Album mode - show modal for batch upload
        const files = e.target.files;
        setPendingFiles(Array.from(files));
        // Use React's flushSync to ensure state is updated immediately
        flushSync(() => {
          setShowAlbumModal(true);
        });
      }
    }
    // Reset the input
    e.target.value = '';
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      // Reset the input value to ensure onChange fires even if the same files are selected
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleAlbumUpload = () => {
    console.log('🎯 handleAlbumUpload called');
    console.log('🎯 pendingFiles:', pendingFiles);
    console.log('🎯 pendingFiles length:', pendingFiles?.length);
    console.log('🎯 albumData:', albumData);
    
    if (pendingFiles && pendingFiles.length > 0) {
      console.log('🎯 Processing files...');
      // Process the files
      handleFiles(pendingFiles);
      
      // Close the modal and reset state
      setShowAlbumModal(false);
      setPendingFiles(null);
      setAlbumData({
        name: '',
        description: '',
        tourName: '',
        location: '',
        tags: []
      });
    } else {
      console.log('🎯 No pending files found!');
    }
  };

  const cancelAlbumUpload = () => {
    setShowAlbumModal(false);
    setPendingFiles(null);
    setAlbumData({
      name: '',
      description: '',
      tourName: '',
      location: '',
      tags: []
    });
  };

  const deleteMedia = (id: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(media => media.id !== id);
      const mediaToDelete = prev.find(media => media.id === id);
      if (mediaToDelete) {
        URL.revokeObjectURL(mediaToDelete.url);
      }
      return updated;
    });
    if (selectedMedia?.id === id) {
      setSelectedMedia(null);
    }
  };

  const updateMediaDetails = (id: string, updates: Partial<MediaFile>) => {
    setMediaFiles(prev => prev.map(media => 
      media.id === id ? { ...media, ...updates } : media
    ));
    if (selectedMedia?.id === id) {
      setSelectedMedia(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitToDatabase = async () => {
    if (mediaFiles.length === 0) {
      alert('No media files to submit. Please upload some files first.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simulate API call to backend database
      // In a real implementation, this would send the media files data to your backend
      const mediaData = mediaFiles.map(media => ({
        id: media.id,
        name: media.name,
        type: media.type,
        size: media.size,
        description: media.description,
        tourName: media.tourName,
        location: media.location,
        tags: media.tags,
        uploadDate: media.uploadDate.toISOString(),
        // In real implementation, you'd upload the actual file and get a URL back
        fileUrl: media.url // This would be a permanent URL from your storage service
      }));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate API call
      console.log('Submitting media files to database:', mediaData);
      
      // Simulate successful response
      setSubmitSuccess(true);
      
      // Show success message
      alert(`Successfully saved ${mediaFiles.length} media files to the database!`);
      
      // Wait a moment for user to see success message, then refresh page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting media files:', error);
      alert('Failed to save media files to database. Please try again.');
      setIsSubmitting(false);
    }
  };

  const filteredMedia = mediaFiles.filter(media => {
    const matchesFilter = filter === 'all' || 
      (filter === 'images' && media.type === 'image') ||
      (filter === 'videos' && media.type === 'video');
    
    const matchesSearch = searchTerm === '' ||
      media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const renderMediaContent = () => (
    <div className="media-upload-panel">
      <div className="media-upload-header">
        <div className="header-content">
          <h2 className="panel-title">Media Upload Portal</h2>
          <p className="panel-subtitle">
            Upload astronomy tour photos and videos, then submit them to your database
          </p>
        </div>
        
        <div className="header-actions">
          <div className="upload-mode-tabs">
            <button
              className={`mode-tab ${uploadMode.type === 'single' ? 'active' : ''}`}
              onClick={() => setUploadMode({ type: 'single' })}
            >
              Single Upload
            </button>
            <button
              className={`mode-tab ${uploadMode.type === 'album' ? 'active' : ''}`}
              onClick={() => setUploadMode({ type: 'album' })}
            >
              Album Upload
            </button>
          </div>
          
          <div className="upload-buttons">
            <button
              className="upload-btn"
              onClick={openFileDialog}
              title={uploadMode.type === 'album' ? 'Upload Album' : 'Upload Media'}
            >
              <PlusIcon className="upload-icon" />
              <span className="upload-text">
                {uploadMode.type === 'album' ? 'Upload Album' : 'Upload Media'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="upload-content">
          <div className="upload-icon">
            <UploadIcon className="upload-svg-icon" />
          </div>
          <h3>
            {uploadMode.type === 'album' 
              ? 'Drop multiple files to create an album' 
              : 'Drop a media file here'
            }
          </h3>
          <p>or click to browse {uploadMode.type === 'album' ? 'files' : 'file'}</p>
          <div className="upload-info">
            <span>Supports: JPEG, PNG, WebP, MP4, WebM, MOV</span>
            <span>Max size: {maxFileSize}MB per file</span>
            {uploadMode.type === 'album' ? (
              <span>💡 Album mode: Upload multiple files with shared details</span>
            ) : (
              <span>📷 Single mode: Upload one file at a time</span>
            )}
          </div>
        </div>
      </div>

      {/* File Input */}
      <input
        key={uploadMode.type} // Force re-render when mode changes
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden-file-input"
        multiple={uploadMode.type === 'album'}
        aria-label={uploadMode.type === 'album' ? 'Upload multiple media files for album' : 'Upload single media file'}
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-section">
          <h3>Uploading Files...</h3>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="progress-item">
              <span className="file-name">{fileName}</span>
              <div className="progress-bar">
                <div 
                  className={`progress-fill progress-${Math.min(Math.round(progress / 5) * 5, 100)}`}
                />
              </div>
              <span className="progress-text">{Math.round(progress)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Media Controls */}
      {mediaFiles.length > 0 && (
        <div className="media-controls">
          <div className="filters">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({mediaFiles.length})
              </button>
              <button 
                className={`filter-tab ${filter === 'images' ? 'active' : ''}`}
                onClick={() => setFilter('images')}
              >
                Images ({mediaFiles.filter(m => m.type === 'image').length})
              </button>
              <button 
                className={`filter-tab ${filter === 'videos' ? 'active' : ''}`}
                onClick={() => setFilter('videos')}
              >
                Videos ({mediaFiles.filter(m => m.type === 'video').length})
              </button>
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by filename, description, tour name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Submit to Database Section */}
      {mediaFiles.length > 0 && (
        <div className="submit-section">
          <div className="submit-info">
            <h3>🚀 Ready to Submit</h3>
            <p>
              You have {mediaFiles.length} media file{mediaFiles.length > 1 ? 's' : ''} ready to be submitted to your astronomy tour database.
            </p>
            <p className="submit-warning">
              ⚠️ After successful submission, the page will refresh to start a new upload session.
            </p>
          </div>
          <div className="submit-actions">
            <Button
              variant="primary"
              size="large"
              onClick={handleSubmitToDatabase}
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth={true}
            >
              {isSubmitting ? 'Submitting to Database...' : `Submit ${mediaFiles.length} Files to Database`}
            </Button>
            {submitSuccess && (
              <div className="success-message">
                ✅ Successfully submitted to database! Refreshing page...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      {filteredMedia.length > 0 ? (
        <div className={`media-gallery ${viewMode}`}>
          {filteredMedia.map((media) => (
            <div 
              key={media.id} 
              className="media-item"
              onClick={() => setSelectedMedia(media)}
            >
              <div className="media-preview">
                {media.type === 'image' ? (
                  <img 
                    src={media.url} 
                    alt={media.name}
                    className="media-thumbnail"
                  />
                ) : (
                  <video 
                    src={media.url}
                    className="media-thumbnail"
                    muted
                    preload="metadata"
                  />
                )}
                <div className="media-overlay">
                  <div className="media-type-badge">
                    {media.type === 'image' ? '📷' : '🎥'}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMedia(media.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="media-info">
                <h4 className="media-name">{media.name}</h4>
                <p className="media-size">{formatFileSize(media.size)}</p>
                {media.description && (
                  <p className="media-description">{media.description}</p>
                )}
                {media.tourName && (
                  <p className="media-tour">Tour: {media.tourName}</p>
                )}
                {media.location && (
                  <p className="media-location">📍 {media.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : mediaFiles.length > 0 ? (
        <div className="no-results">
          <p>No media found matching your search criteria.</p>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🌌</div>
          <h3>Media Upload Portal</h3>
          <p>Upload your astronomy tour photos and videos, then submit them to your database.</p>
          <p className="empty-instructions">
            1. Choose Single or Album upload mode<br/>
            2. Upload your media files<br/>
            3. Add descriptions and details<br/>
            4. Submit to database
          </p>
        </div>
      )}

      {/* Album Upload Modal */}
      {showAlbumModal && (
        <div className="album-modal" onClick={cancelAlbumUpload}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Album Upload</h3>
              <button 
                className="close-btn"
                onClick={cancelAlbumUpload}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="album-info">
                <p>You're about to upload <strong>{pendingFiles?.length || 0} files</strong> as an album.</p>
                <p>Fill in the common details that will be applied to all files:</p>
                <div className="upload-tip">
                  💡 Individual files can still be edited later with unique details
                </div>
              </div>
              
              <div className="album-form">
                <div className="form-group">
                  <label htmlFor="albumName">Album Name:</label>
                  <input
                    type="text"
                    id="albumName"
                    value={albumData.name}
                    onChange={(e) => setAlbumData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Saturn Observation Night"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumDescription">Album Description:</label>
                  <textarea
                    id="albumDescription"
                    value={albumData.description}
                    onChange={(e) => setAlbumData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this collection of photos/videos..."
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumTourName">Tour Name:</label>
                  <input
                    type="text"
                    id="albumTourName"
                    value={albumData.tourName}
                    onChange={(e) => setAlbumData(prev => ({ ...prev, tourName: e.target.value }))}
                    placeholder="e.g., Stargazing Night at Mount Wilson"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumLocation">Location:</label>
                  <input
                    type="text"
                    id="albumLocation"
                    value={albumData.location}
                    onChange={(e) => setAlbumData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Mount Wilson Observatory, California"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumTags">Tags:</label>
                  <input
                    type="text"
                    id="albumTags"
                    value={albumData.tags.join(', ')}
                    onChange={(e) => setAlbumData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                    }))}
                    placeholder="e.g., telescope, saturn, rings, astrophotography"
                  />
                  <small>Separate tags with commas</small>
                </div>
              </div>
              
              <div className="file-preview">
                <h4>Files to Upload:</h4>
                <div className="file-list">
                  {pendingFiles && Array.from(pendingFiles).map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({formatFileSize(file.size)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <Button
                variant="secondary"
                size="medium"
                onClick={cancelAlbumUpload}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleAlbumUpload}
              >
                Upload Album
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedMedia.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedMedia(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="media-preview-large">
                {selectedMedia.type === 'image' ? (
                  <img 
                    src={selectedMedia.url} 
                    alt={selectedMedia.name}
                    className="large-media"
                  />
                ) : (
                  <video 
                    src={selectedMedia.url}
                    className="large-media"
                    controls
                  />
                )}
              </div>
              
              <div className="media-details">
                <div className="detail-section">
                  <h4>File Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>File Size:</label>
                      <span>{formatFileSize(selectedMedia.size)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Upload Date:</label>
                      <span>{selectedMedia.uploadDate.toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type:</label>
                      <span>{selectedMedia.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Tour Details</h4>
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      value={selectedMedia.description || ''}
                      onChange={(e) => updateMediaDetails(selectedMedia.id, { description: e.target.value })}
                      placeholder="Describe this photo/video from your astronomy tour..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tourName">Tour Name:</label>
                    <input
                      type="text"
                      id="tourName"
                      value={selectedMedia.tourName || ''}
                      onChange={(e) => updateMediaDetails(selectedMedia.id, { tourName: e.target.value })}
                      placeholder="e.g., Stargazing Night at Mount Wilson"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                      type="text"
                      id="location"
                      value={selectedMedia.location || ''}
                      onChange={(e) => updateMediaDetails(selectedMedia.id, { location: e.target.value })}
                      placeholder="e.g., Mount Wilson Observatory, California"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tags">Tags:</label>
                    <input
                      type="text"
                      id="tags"
                      value={selectedMedia.tags?.join(', ') || ''}
                      onChange={(e) => updateMediaDetails(selectedMedia.id, { 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                      })}
                      placeholder="e.g., telescope, saturn, rings, astrophotography"
                    />
                    <small>Separate tags with commas</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <Button
                variant="danger"
                size="medium"
                onClick={() => {
                  deleteMedia(selectedMedia.id);
                  setSelectedMedia(null);
                }}
              >
                Delete Media
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setSelectedMedia(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return showSidebar ? (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {renderMediaContent()}
      </div>
    </div>
  ) : (
    renderMediaContent()
  );
};

export default MediaUploadPanel;