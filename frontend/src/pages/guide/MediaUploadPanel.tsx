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
        {/* Header */}
        <div className="set-availability__header">
          <div className="header-content">
            <div className="header-navigation">
              <Button
                variant="primary"
                size="medium"
                icon={<ArrowLeftIcon />}
                iconPosition="left"
                onClick={() => navigate('/dashboard/services')}
              >
                Back to Services
              </Button>
            </div>
            
            <div className="title-section">
              <h1 className="page-title">Media Upload Panel</h1>
              <div className="flex items-center justify-center">
                <p>
                  One Click Away from Sharing Memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      <div className="media-upload-header space-y-4">
        <div className="flex gap-2">
          <button type="button" onClick={() => setUploadMode({ type: 'single' })} className={`px-3 py-1 rounded text-sm border ${uploadMode.type==='single'?'bg-indigo-600 text-white':'bg-white/5 text-gray-300'}`}>Single</button>
          <button type="button" onClick={() => setUploadMode({ type: 'album' })} className={`px-3 py-1 rounded text-sm border ${uploadMode.type==='album'?'bg-indigo-600 text-white':'bg-white/5 text-gray-300'}`}>Album</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Tour Name *" value={tourForm.tour_name} onChange={e=>setTourForm(f=>({...f,tour_name:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Location *" value={tourForm.location} onChange={e=>setTourForm(f=>({...f,location:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Tags (comma separated)" value={tourForm.tags} onChange={e=>setTourForm(f=>({...f,tags:e.target.value}))} />
          <input className="border rounded px-3 py-2 bg-white/5" placeholder="Description *" value={tourForm.description} onChange={e=>setTourForm(f=>({...f,description:e.target.value}))} />
        </div>
        {errorMsg && <div className="text-sm text-red-500">{errorMsg}</div>}
        {successMsg && <div className="text-sm text-green-500">{successMsg}</div>}
      </div>
      
      {/* Upload Area */}
      <div className={`upload-area ${dragActive ? 'drag-active' : ''} border-2 border-dashed rounded p-8 text-center`} onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop}>
        <p className="text-sm text-gray-400 mb-3">{uploadMode.type==='single'?'Choose a file':'Select multiple files'} or drag & drop here.</p>
        <Button variant="primary" size="small" onClick={openFileDialog} disabled={isUploading}>Add {uploadMode.type==='single'?'File':'Files'}</Button>
      </div>

      {/* Hidden File Input */}
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
      {/* Waiting Bay */}
      <div className="mt-6 space-y-4">
        {pending.length > 0 && (
          <div className="rounded border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Waiting Bay ({pending.length} file{pending.length>1?'s':''})</h4>
              {!isUploading && <button onClick={resetPanel} className="text-xs text-gray-400 hover:text-white">Clear All</button>}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {pending.map(f => (
                <div key={f.id} className="relative group border border-white/10 rounded overflow-hidden bg-black/30">
                  {f.type.startsWith('image') ? (
                    <img src={f.preview} alt={f.name} className="h-32 w-full object-cover" />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-xs text-gray-400">{f.type}</div>
                  )}
                  <div className="p-2 text-xs truncate">{f.name}</div>
                  {!isUploading && (
                    <button onClick={()=>removePending(f.id)} className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded px-1 text-[10px]">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {isUploading && (
          <div className="w-full bg-white/10 rounded h-3 overflow-hidden progress-shell">
            {(() => { const b = Math.min(100, Math.max(0, Math.round(overallProgress/5)*5)); return <div className={`h-full bg-indigo-500 transition-all duration-200 progress-bar p${b}`} /> })()}
          </div>
        )}
        <div className="flex gap-3">
          <Button variant="primary" size="medium" onClick={startUpload} disabled={pending.length===0 || isUploading || !tourForm.tour_name || !tourForm.description || !tourForm.location}>
            {isUploading ? `Uploading ${overallProgress}%` : `Upload ${pending.length||''} ${uploadMode.type==='single'?'File':'Files'}`}
          </Button>
          <Button variant="secondary" size="medium" onClick={resetPanel} disabled={isUploading || pending.length===0}>Reset</Button>
        </div>
      </div>
    </div>
  );

  return renderMediaContent();
};

export default MediaUploadPanel;