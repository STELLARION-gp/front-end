import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/guide/_mediaUploadPanel.scss';
import { uploadSingleTour, uploadAlbumTour } from '../../services/apiTours';


interface PendingFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  progress: number; // 0-100
  error?: string;
}

// Icons
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertCircleIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const UploadCloudIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"/>
    <polyline points="9 15 12 12 15 15"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
  </svg>
);

interface MediaUploadPanelProps { allowedTypes?: string[]; }

interface UploadMode { type: 'single' | 'album'; }

const MediaUploadPanel: React.FC<MediaUploadPanelProps> = ({
  allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf']
}) => {
  const [uploadMode, setUploadMode] = useState<UploadMode>({ type: 'single' });
  const [tourForm, setTourForm] = useState({ tour_name: '', description: '', location: '', tags: '' });
  const [pending, setPending] = useState<PendingFile[]>([]); // waiting bay
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const addFilesToWaitingBay = (files: FileList | File[]) => {
    const arr = Array.isArray(files) ? files : Array.from(files);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPending(prev => {
      const next: PendingFile[] = [...prev];
      for (const f of arr) {
        if (uploadMode.type === 'single' && next.length >= 1) {
          // replace existing file in single mode
          const old = next[0];
          URL.revokeObjectURL(old.preview);
          next[0] = {
            id: crypto.randomUUID(),
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            type: f.type,
            progress: 0
          };
        } else if (uploadMode.type === 'album') {
          next.push({
            id: crypto.randomUUID(),
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            type: f.type,
            progress: 0
          });
        } else if (uploadMode.type === 'single') {
          next.push({
            id: crypto.randomUUID(),
            file: f,
            preview: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            type: f.type,
            progress: 0
          });
        }
      }
      return next;
    });
  };

  const removePending = (id: string) => {
    setPending(p => {
      const target = p.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return p.filter(f => f.id !== id);
    });
  };

  const resetPanel = () => {
    // revoke previews
    pending.forEach(p => URL.revokeObjectURL(p.preview));
    setPending([]);
    setTourForm({ tour_name: '', description: '', location: '', tags: '' });
    setOverallProgress(0);
    setIsUploading(false);
  };

  const startUpload = async () => {
    if (pending.length === 0) return;
    if (!tourForm.tour_name || !tourForm.description || !tourForm.location) {
      setErrorMsg('Please fill required tour fields.');
      return;
    }
    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOverallProgress(0);
    try {
      if (uploadMode.type === 'single') {
        const file = pending[0].file;
        await uploadSingleTour(file, tourForm, pct => setOverallProgress(pct));
      } else {
        const files = pending.map(p => p.file);
        await uploadAlbumTour(files, tourForm, pct => setOverallProgress(pct));
      }
      setOverallProgress(100);
      setSuccessMsg('Upload Successful');
      setTimeout(() => {
        resetPanel();
        setSuccessMsg(null);
      }, 1800);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setErrorMsg(msg);
      setIsUploading(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) addFilesToWaitingBay(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFilesToWaitingBay(e.target.files);
    e.target.value = '';
  };

  const openFileDialog = () => { if (fileInputRef.current) { fileInputRef.current.value=''; fileInputRef.current.click(); } };

  // album modal removed in new flow (waiting bay replaces it)

  // (legacy functions removed)

  // no per-file metadata editing in waiting bay for now

  // removed unused formatFileSize helper

  // legacy refresh removed

  // no initial list fetch (as per new spec: don't display uploaded media)

  // waiting bay only; no gallery filtering required

  const renderMediaContent = () => (
    <div className="media-upload-panel">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="toast-notification toast-success">
          <div className="toast-icon">
            <CheckCircleIcon />
          </div>
          <div className="toast-content">
            <div className="toast-title">Success!</div>
            <div className="toast-message">{successMsg}</div>
          </div>
        </div>
      )}
      {errorMsg && (
        <div className="toast-notification toast-error">
          <div className="toast-icon">
            <AlertCircleIcon />
          </div>
          <div className="toast-content">
            <div className="toast-title">Upload Failed</div>
            <div className="toast-message">{errorMsg}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="set-availability__header">
        <div className="header-content">
          <div className="header-navigation">
            <Button
              variant="primary"
              size="medium"
              icon={<ArrowLeftIcon />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/media')}
            >
              Back to Services
            </Button>
          </div>
          
          <div className="title-section">
            <h1 className="page-title">Media Upload Panel</h1>
            <div className="flex items-center justify-center">
              <p className="page-subtitle">
                One Click Away from Sharing Memories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="upload-content-card">
        {/* Mode Selector */}
        <div className="mode-selector-container">
          <div className="mode-selector">
            <button 
              type="button" 
              onClick={() => setUploadMode({ type: 'single' })} 
              className={`mode-btn ${uploadMode.type === 'single' ? 'active' : ''}`}
            >
              <span className="mode-icon">📷</span>
              <span>Single</span>
            </button>
            <button 
              type="button" 
              onClick={() => setUploadMode({ type: 'album' })} 
              className={`mode-btn ${uploadMode.type === 'album' ? 'active' : ''}`}
            >
              <span className="mode-icon">🖼️</span>
              <span>Album</span>
            </button>
          </div>
        </div>

        {/* Tour Metadata Form */}
        <div className="tour-form-grid">
          <div className="form-group">
            <label className="form-label">Tour Name <span className="required">*</span></label>
            <input 
              className="form-input" 
              placeholder="Enter tour name" 
              value={tourForm.tour_name} 
              onChange={e => setTourForm(f => ({...f, tour_name: e.target.value}))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location <span className="required">*</span></label>
            <input 
              className="form-input" 
              placeholder="Enter location" 
              value={tourForm.location} 
              onChange={e => setTourForm(f => ({...f, location: e.target.value}))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <input 
              className="form-input" 
              placeholder="astronomy, education" 
              value={tourForm.tags} 
              onChange={e => setTourForm(f => ({...f, tags: e.target.value}))} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <input 
              className="form-input" 
              placeholder="Brief description" 
              value={tourForm.description} 
              onChange={e => setTourForm(f => ({...f, description: e.target.value}))} 
            />
          </div>
        </div>

        {/* Upload Drop Zone */}
        <div 
          className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`} 
          onDragEnter={handleDragIn} 
          onDragLeave={handleDragOut} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
        >
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <UploadCloudIcon />
            </div>
            <h3 className="dropzone-title">
              {uploadMode.type === 'single' ? 'Drop your file here' : 'Drop multiple files here'}
            </h3>
            <p className="dropzone-subtitle">
              or click the button below to browse
            </p>
            <div className="mt-4">
              <Button 
                variant="primary" 
                size="small" 
                onClick={openFileDialog} 
                disabled={isUploading}
              >
                {uploadMode.type === 'single' ? 'Select File' : 'Select Files'}
              </Button>
            </div>
            <p className="dropzone-formats">
              Supported: JPEG, PNG, MP4, PDF
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          key={uploadMode.type}
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden-file-input"
          multiple={uploadMode.type === 'album'}
          aria-label={uploadMode.type === 'album' ? 'Upload multiple media files for album' : 'Upload single media file'}
        />

        {/* Waiting Bay */}
        {pending.length > 0 && (
          <div className="waiting-bay">
            <div className="waiting-bay-header">
              <div className="waiting-bay-title">
                <span className="pulse-dot"></span>
                <h4>Waiting Bay</h4>
                <span className="file-count">{pending.length} file{pending.length > 1 ? 's' : ''}</span>
              </div>
              {!isUploading && (
                <button onClick={resetPanel} className="clear-all-btn">
                  Clear All
                </button>
              )}
            </div>
            <div className="waiting-bay-grid">
              {pending.map(f => (
                <div key={f.id} className="file-card">
                  <div className="file-preview">
                    {f.type.startsWith('image') ? (
                      <img src={f.preview} alt={f.name} className="preview-image" />
                    ) : (
                      <div className="preview-placeholder">
                        <span className="file-ext">{f.type.split('/')[1]?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="file-info">
                    <div className="file-name" title={f.name}>{f.name}</div>
                    <div className="file-size">{(f.size / 1024).toFixed(1)} KB</div>
                  </div>
                  {!isUploading && (
                    <button 
                      onClick={() => removePending(f.id)} 
                      className="remove-file-btn"
                      aria-label="Remove file"
                      title="Remove file"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="upload-progress-container">
            <div className="progress-info">
              <span className="progress-label">Uploading...</span>
              <span className="progress-percentage">{overallProgress}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div 
                className="progress-bar-fill" 
                data-progress={overallProgress}
              >
                <div className="progress-shimmer"></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button 
            variant="primary" 
            size="medium" 
            onClick={startUpload} 
            disabled={pending.length === 0 || isUploading || !tourForm.tour_name || !tourForm.description || !tourForm.location}
          >
            {isUploading ? `Uploading ${overallProgress}%` : `Upload ${pending.length || ''} ${uploadMode.type === 'single' ? 'File' : 'Files'}`}
          </Button>
          <Button 
            variant="secondary" 
            size="medium" 
            onClick={resetPanel} 
            disabled={isUploading || pending.length === 0}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );

  return renderMediaContent();
};

export default MediaUploadPanel;