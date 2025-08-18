import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Button from '../../components/Button';
import '../../styles/pages/guide/_mediaUploadPanel.scss';
import { apiService } from '../../services/api';
import { auth } from '../../firebase';
import { uploadSingleTour, uploadAlbumTour } from '../../services/apiTours';


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

const StarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GalaxyIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const RocketIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4.5 16.5C4.5 16.5 5.5 7.5 13 4C13 4 18 2 20 4C22 6 20 11 20 11C16.5 18.5 7.5 19.5 7.5 19.5L4.5 16.5Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M13.5 10.5L15.5 12.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 15L9 18L10.5 16.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const TelescopeIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 3L21 21M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 12L8 16M16 8L12 12" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 1V5M12 19V23M5 12H1M23 12H19" stroke="currentColor" strokeWidth="2"/>
  </svg>
);


interface MediaFile {
  id: string | number;
  file?: File; // present only for newly added local files pre-upload mapping
  url: string; // blob: URL or server file_path
  type: 'image' | 'video' | 'other';
  name: string;
  size: number; // bytes
  uploadDate: Date;
  description?: string;
  tourName?: string;
  location?: string;
  tags?: string[];
  file_path?: string; // server path
  file_type?: string; // original mime from server
}

interface ServerMediaFile {
  id: number | string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at?: string;
}

interface MediaUploadPanelProps {
  onMediaUploaded?: (media: MediaFile[]) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadMode { type: 'single' | 'album'; }

const MediaUploadPanel: React.FC<MediaUploadPanelProps> = ({
  onMediaUploaded,
  // maxFileSize removed (backend already validates size)
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadMode, setUploadMode] = useState<UploadMode>({ type: 'single' });
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [tourForm, setTourForm] = useState({ tour_name: '', description: '', location: '', tags: '' });
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // removed loadingExisting/listError (legacy refresh logic retained minimal)
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle one or multiple files: upload each, prepend server-returned file object
  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    if (!tourForm.tour_name || !tourForm.description || !tourForm.location) {
      setUploadError('Please fill Tour Name, Description, and Location before uploading.');
      return;
    }
    try {
      setIsSubmitting(true);
  interface UploadResponse { media?: ServerMediaFile[] }
      let res: UploadResponse | undefined;
      // Basic client-side validation to avoid server 500s
      const MAX_SIZE_MB = 5;
      for (const f of fileArray) {
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
          setUploadError(`File ${f.name} exceeds ${MAX_SIZE_MB}MB limit.`);
          setIsSubmitting(false);
          return;
        }
      }
      if (uploadMode.type === 'single') {
        if (fileArray.length !== 1) {
          setUploadError('Single mode expects exactly one file');
          return;
        }
  res = await uploadSingleTour(fileArray[0], tourForm) as unknown as UploadResponse;
      } else {
  res = await uploadAlbumTour(fileArray, tourForm) as unknown as UploadResponse;
      }
      setSubmitMsg({ type: 'success', text: 'Upload successful' });
      if (onMediaUploaded) {
  const mediaResp: ServerMediaFile[] = res?.media || [];
  const media: MediaFile[] = mediaResp.map(m => ({
            id: m.id,
            url: m.file_path,
      type: m.file_type.startsWith('image') ? 'image' : (m.file_type.startsWith('video') ? 'video' : 'other'),
            name: m.file_name,
            size: m.file_size,
            uploadDate: new Date(m.created_at || Date.now()),
            file_path: m.file_path,
            file_type: m.file_type,
            tourName: tourForm.tour_name,
            location: tourForm.location,
            description: tourForm.description,
            tags: tourForm.tags ? tourForm.tags.split(',').map(t=>t.trim()) : []
        }));
        onMediaUploaded(media);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload failed';
      setSubmitMsg({ type: 'error', text: message });
      setUploadError(message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMsg(null), 4000);
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
    if (pendingFiles && pendingFiles.length > 0) {
      // Process the files
      handleFiles(pendingFiles);
      
      // Close the modal and reset state
      setShowAlbumModal(false);
      setPendingFiles(null);
      setTourForm({ tour_name: '', description: '', location: '', tags: '' });
    }
  };

  const cancelAlbumUpload = () => {
    setShowAlbumModal(false);
    setPendingFiles(null);
    setTourForm({ tour_name: '', description: '', location: '', tags: '' });
  };

  const deleteMedia = (id: string | number) => {
    setMediaFiles(prev => {
      const updated = prev.filter(media => media.id !== id);
      const mediaToDelete = prev.find(media => media.id === id);
      if (mediaToDelete && mediaToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(mediaToDelete.url);
      }
      return updated;
    });
    if (selectedMedia?.id === id) setSelectedMedia(null);
  };

  const updateMediaDetails = (id: string | number, updates: Partial<MediaFile>) => {
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
    setIsSubmitting(true);
    try {
      const refreshed: unknown = await apiService.listMedia();
      const files: ServerMediaFile[] = (refreshed && typeof refreshed === 'object' && 'files' in refreshed)
        ? (refreshed as { files: ServerMediaFile[] }).files
        : [];
      setMediaFiles(files.map((f) => ({
        id: f.id,
        url: f.file_path,
        type: f.file_type?.startsWith('image/') ? 'image' : (f.file_type?.startsWith('video/') ? 'video' : 'other'),
        name: f.file_name,
        size: f.file_size,
        uploadDate: new Date(f.created_at || Date.now()),
        file_path: f.file_path,
        file_type: f.file_type
      })));
      setSubmitMsg({ type: 'success', text: 'Media list refreshed' });
      setTimeout(() => setSubmitMsg(null), 2500);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to refresh media list';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial fetch of existing media
  useEffect(() => {
    (async () => {
      try {
        if (!auth.currentUser) return;
        const data: unknown = await apiService.listMedia();
        const files: ServerMediaFile[] = (data && typeof data === 'object' && 'files' in data)
          ? (data as { files: ServerMediaFile[] }).files : [];
        setMediaFiles(files.map(f => ({
          id: f.id,
          url: f.file_path,
          type: f.file_type?.startsWith('image/') ? 'image' : (f.file_type?.startsWith('video/') ? 'video' : 'other'),
          name: f.file_name,
          size: f.file_size,
          uploadDate: new Date(f.created_at || Date.now()),
          file_path: f.file_path,
          file_type: f.file_type
        })));
      } catch { /* silent initial load */ }
    })();
  }, []);

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
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setUploadMode({ type: 'single' })} className={`px-3 py-1 rounded text-sm border ${uploadMode.type==='single'?'bg-indigo-600 text-white':'bg-white/5 text-gray-300'}`}>Single Upload</button>
            <button type="button" onClick={() => setUploadMode({ type: 'album' })} className={`px-3 py-1 rounded text-sm border ${uploadMode.type==='album'?'bg-indigo-600 text-white':'bg-white/5 text-gray-300'}`}>Album Upload</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Tour Name *" value={tourForm.tour_name} onChange={e=>setTourForm(f=>({...f,tour_name:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Location *" value={tourForm.location} onChange={e=>setTourForm(f=>({...f,location:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Tags (comma separated)" value={tourForm.tags} onChange={e=>setTourForm(f=>({...f,tags:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5 md:col-span-1" placeholder="Description *" value={tourForm.description} onChange={e=>setTourForm(f=>({...f,description:e.target.value}))} />
        </div>
        {submitMsg && <div className={`text-sm mb-2 ${submitMsg.type==='success'?'text-green-500':'text-red-500'}`}>{submitMsg.text}</div>}
        {uploadError && <div className="text-sm text-red-500 mb-2">{uploadError}</div>}
      </div>
      
      {/* Upload Area */}
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} border-2 border-dashed rounded p-10 text-center cursor-pointer`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="upload-content space-y-3">
          <p className="text-sm text-gray-400">{uploadMode.type==='single'?'Click or drag a file to upload a new Tour with one media file.':'Click or drag files to upload a Tour Album.'}</p>
          <button type="button" onClick={openFileDialog} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={!tourForm.tour_name||!tourForm.description||!tourForm.location||isSubmitting}>{isSubmitting?'Uploading...': uploadMode.type==='single'?'Select File':'Select Files'}</button>
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

  {/* Upload Progress - currently not implemented for tour upload */}

      {/* Media Controls */}
      {mediaFiles.length > 0 && (
        <div className="media-controls">
          <div className="filters">
            <div className="filter-tabs">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setFilter('all')}
                className="filter-tab-component"
              >
                All ({mediaFiles.length})
              </Button>
              <Button
                variant={filter === 'images' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setFilter('images')}
                className="filter-tab-component"
              >
                Images ({mediaFiles.filter(m => m.type === 'image').length})
              </Button>
              <Button
                variant={filter === 'videos' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setFilter('videos')}
                className="filter-tab-component"
              >
                Videos ({mediaFiles.filter(m => m.type === 'video').length})
              </Button>
            </div>
            
            <div className="view-controls">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode('grid')}
                className="view-btn-component"
              >
                ⊞
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode('list')}
                className="view-btn-component"
              >
                ☰
              </Button>
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
            <h3><RocketIcon className="submit-icon" /> Manage Uploaded Media</h3>
            <p>You currently have {mediaFiles.length} media file{mediaFiles.length > 1 ? 's' : ''} stored.</p>
            <p className="submit-warning">Use Refresh to sync with server if you've uploaded from another tab.</p>
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
              {isSubmitting ? 'Refreshing...' : `Refresh (${mediaFiles.length}) Media List`}
            </Button>
            {submitMsg && submitMsg.type === 'success' && (
              <div className="success-message">
                ✅ Media list refreshed
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
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMedia(media.id);
                    }}
                    className="delete-btn-wrapper"
                  >
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => {}}
                      className="delete-btn-component"
                    >
                      ✕
                    </Button>
                  </div>
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
          <div className="empty-icon">
            <GalaxyIcon className="galaxy-icon" />
          </div>
          <h3>Media Upload Portal</h3>
          <p>Upload your astronomy tour photos and videos, then submit them to your database.</p>
          <p className="empty-instructions">
            <span className="instruction-item">
              <StarIcon className="instruction-icon" /> 
              <span>Choose Single or Album upload mode</span>
            </span>
            <span className="instruction-item">
              <TelescopeIcon className="instruction-icon" /> 
              <span>Upload your media files</span>
            </span>
            <span className="instruction-item">
              <PlusIcon className="instruction-icon" /> 
              <span>Add descriptions and details</span>
            </span>
            <span className="instruction-item">
              <RocketIcon className="instruction-icon" /> 
              <span>Submit to database</span>
            </span>
          </p>
        </div>
      )}

      {/* Album Upload Modal */}
      {showAlbumModal && (
        <div className="album-modal" onClick={cancelAlbumUpload}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Album Upload</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={cancelAlbumUpload}
                className="close-btn-component"
              >
                ✕
              </Button>
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
                    value={tourForm.tour_name}
                    onChange={(e) => setTourForm(f => ({ ...f, tour_name: e.target.value }))}
                    placeholder="e.g., Saturn Observation Night"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumDescription">Album Description:</label>
                  <textarea
                    id="albumDescription"
                    value={tourForm.description}
                    onChange={(e) => setTourForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe this collection of photos/videos..."
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumTourName">Tour Name:</label>
                  <input
                    type="text"
                    id="albumTourName"
                    value={tourForm.tour_name}
                    onChange={(e) => setTourForm(f => ({ ...f, tour_name: e.target.value }))}
                    placeholder="e.g., Stargazing Night at Mount Wilson"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumLocation">Location:</label>
                  <input
                    type="text"
                    id="albumLocation"
                    value={tourForm.location}
                    onChange={(e) => setTourForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g., Mount Wilson Observatory, California"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="albumTags">Tags:</label>
                  <input
                    type="text"
                    id="albumTags"
                    value={tourForm.tags}
                    onChange={(e) => setTourForm(f => ({ ...f, tags: e.target.value }))}
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
              <Button
                variant="secondary"
                size="small"
                onClick={() => setSelectedMedia(null)}
                className="close-btn-component"
              >
                ✕
              </Button>
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

  return renderMediaContent();
};

export default MediaUploadPanel;