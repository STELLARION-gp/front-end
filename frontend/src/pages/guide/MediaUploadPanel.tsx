import React, { useState, useRef, useCallback } from 'react';
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
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [albumData, setAlbumData] = useState<AlbumData>({
    name: '',
    description: '',
    tourName: '',
    location: '',
    tags: []
  });
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

  const handleFiles = async (files: FileList) => {
    if (files.length > 1 && uploadMode.type === 'single') {
      // Multiple files selected, offer album mode
      setPendingFiles(files);
      setShowAlbumModal(true);
      return;
    }

    const commonData = uploadMode.type === 'album' ? {
      description: albumData.description,
      tourName: albumData.tourName,
      location: albumData.location,
      tags: albumData.tags
    } : {};

    const newMediaFiles: MediaFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[file.name] || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [file.name]: currentProgress + 10 };
          });
        }, 100);

        const mediaFile = await processFile(file);
        // Apply common album data if in album mode
        const finalMediaFile = { ...mediaFile, ...commonData };
        newMediaFiles.push(finalMediaFile);
        
        // Complete the progress
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          setTimeout(() => {
            setUploadProgress(prev => {
              const updated = { ...prev };
              delete updated[file.name];
              return updated;
            });
          }, 1000);
        }, 1000);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }

    if (newMediaFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...newMediaFiles]);
      onMediaUploaded?.(newMediaFiles);
    }

    // Reset album mode if it was used
    if (uploadMode.type === 'album') {
      setUploadMode({ type: 'single' }); // Reset to single mode after album upload
      setShowAlbumModal(false);
      setPendingFiles(null);
      setAlbumData({
        name: '',
        description: '',
        tourName: '',
        location: '',
        tags: []
      });
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
      if (uploadMode.type === 'album' || e.dataTransfer.files.length > 1) {
        // For album mode or multiple files, show album modal
        setPendingFiles(e.dataTransfer.files);
        setShowAlbumModal(true);
      } else {
        // Single file upload - reset to single mode first
        setUploadMode({ type: 'single' });
        handleFiles(e.dataTransfer.files);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (uploadMode.type === 'album' || e.target.files.length > 1) {
        // For album mode or multiple files, show album modal
        setPendingFiles(e.target.files);
        setShowAlbumModal(true);
      } else {
        // Single file upload - reset to single mode first
        setUploadMode({ type: 'single' });
        handleFiles(e.target.files);
      }
    }
    // Reset the input
    e.target.value = '';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleAlbumUpload = () => {
    if (pendingFiles) {
      setUploadMode({ type: 'album' });
      handleFiles(pendingFiles);
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
          <h2 className="panel-title">Tour Media Gallery</h2>
          <p className="panel-subtitle">
            Upload and manage photos and videos from your astronomy tours
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
            <Button
              variant="secondary"
              size="medium"
              onClick={openFileDialog}
              icon={<PlusIcon />}
              iconPosition="left"
            >
              {uploadMode.type === 'album' ? 'Upload Album' : 'Upload Media'}
            </Button>
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
              : 'Drop your media files here'
            }
          </h3>
          <p>or click to browse files</p>
          <div className="upload-info">
            <span>Supports: JPEG, PNG, WebP, MP4, WebM, MOV</span>
            <span>Max size: {maxFileSize}MB per file</span>
            {uploadMode.type === 'album' && (
              <span>💡 Album mode: Upload multiple files with shared details</span>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden-file-input"
        aria-label="Upload media files"
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-section">
          <h3>Uploading Files...</h3>            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="progress-item">
                <span className="file-name">{fileName}</span>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill progress-${Math.round(progress / 10) * 10}`}
                  />
                </div>
                <span className="progress-text">{progress}%</span>
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
          <h3>No media uploaded yet</h3>
          <p>Start building your astronomy tour portfolio by uploading your first photos or videos!</p>
        </div>
      )}

      {/* Album Upload Modal */}
      {showAlbumModal && pendingFiles && (
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
                <p>You're about to upload <strong>{pendingFiles.length} files</strong> as an album.</p>
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
                  {Array.from(pendingFiles).map((file, index) => (
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