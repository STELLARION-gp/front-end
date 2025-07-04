import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import '../../styles/pages/guide/_guideMediaDashboard.scss';

// Icons
const UploadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L12 12M12 2L8 6M12 2L16 6M3 12L3 20C3 20.5523 3.44772 21 4 21L20 21C20.5523 21 21 20.5523 21 20L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 4H21V6H3V4ZM7 10H17V12H7V10ZM10 16H14V18H10V16Z" fill="currentColor"/>
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const GridIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ListIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const FolderIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const mockMediaData: MediaItem[] = [
  {
    id: 1,
    title: "Saturn Ring Structure",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800",
    thumbnail: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=300",
    tour: "Saturn Observation Night",
    location: "Mount Wilson Observatory",
    date: "2025-06-15",
    tags: ["saturn", "rings", "telescope"],
    size: "2.4 MB",
    views: 245,
    likes: 32
  },
  {
    id: 2,
    title: "Jupiter's Great Red Spot",
    type: "video" as const,
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=300",
    tour: "Jupiter Close-up Session",
    location: "Palomar Observatory",
    date: "2025-06-10",
    tags: ["jupiter", "great-red-spot", "timelapse"],
    size: "45.2 MB",
    views: 412,
    likes: 67
  },
  {
    id: 3,
    title: "Andromeda Galaxy Core",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800",
    thumbnail: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300",
    tour: "Deep Space Photography",
    location: "Dark Sky Reserve",
    date: "2025-06-08",
    tags: ["galaxy", "andromeda", "deep-space"],
    size: "5.8 MB",
    views: 892,
    likes: 156
  },
  {
    id: 4,
    title: "Lunar Eclipse Sequence",
    type: "video" as const,
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518066000714-58c45f1a2c64?w=300",
    tour: "Lunar Eclipse Special",
    location: "City Observatory",
    date: "2025-06-05",
    tags: ["moon", "eclipse", "sequence"],
    size: "67.3 MB",
    views: 634,
    likes: 98
  },
  {
    id: 5,
    title: "Orion Nebula Details",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300",
    tour: "Nebula Photography Workshop",
    location: "Remote Desert Site",
    date: "2025-06-03",
    tags: ["nebula", "orion", "star-formation"],
    size: "4.1 MB",
    views: 523,
    likes: 89
  },
  {
    id: 6,
    title: "Mars Opposition 2025",
    type: "image" as const,
    url: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=300",
    tour: "Mars Opposition Special",
    location: "High Altitude Observatory",
    date: "2025-06-01",
    tags: ["mars", "opposition", "planetary"],
    size: "3.2 MB",
    views: 367,
    likes: 54
  }
];

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  tour: string;
  location: string;
  date: string;
  tags: string[];
  size: string;
  views: number;
  likes: number;
}

const GuideMediaDashboard: React.FC = () => {
  const [mediaData] = useState<MediaItem[]>(mockMediaData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setNotification({message: '🌟 Media gallery loaded successfully!', type: 'success'});
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get unique tours for folder filter
  const tours = ['all', ...Array.from(new Set(mediaData.map(item => item.tour)))];

  // Filter media based on search and filters
  const filteredMedia = mediaData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedFilter === 'all' || 
                       (selectedFilter === 'images' && item.type === 'image') ||
                       (selectedFilter === 'videos' && item.type === 'video');
    
    const matchesFolder = selectedFolder === 'all' || item.tour === selectedFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  // Statistics
  const stats = {
    total: mediaData.length,
    images: mediaData.filter(item => item.type === 'image').length,
    videos: mediaData.filter(item => item.type === 'video').length,
    totalViews: mediaData.reduce((sum, item) => sum + item.views, 0),
    totalLikes: mediaData.reduce((sum, item) => sum + item.likes, 0)
  };



  return (
    <div className="guide-media-dashboard">
      {isLoading ? (
        <motion.div 
          className="loading-skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>
          <div className="skeleton-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-stat-card"></div>
            ))}
          </div>
          <div className="skeleton-controls">
            <div className="skeleton-search"></div>
            <div className="skeleton-filters"></div>
          </div>
          <div className="skeleton-gallery">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-media-card"></div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Header Section */}
          <motion.div 
            className="dashboard-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
        <div className="header-content">
          <motion.h1 
            className="page-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            🌌 Media Gallery
          </motion.h1>
          <motion.p 
            className="page-subtitle"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover and manage your cosmic captures from astronomy tours
          </motion.p>
        </div>
        <motion.div 
          className="header-actions"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/dashboard/media/upload">
            <Button
              variant="primary"
              size="medium"
              icon={<UploadIcon />}
              iconPosition="left"
              className="upload-button"
            >
              Upload Media
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="stat-icon">�</div>
          <div className="stat-content">
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {stats.images}
            </motion.div>
            <div className="stat-label">Images</div>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="stat-icon">�</div>
          <div className="stat-content">
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.videos}
            </motion.div>
            <div className="stat-label">Videos</div>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {stats.totalViews.toLocaleString()}
            </motion.div>
            <div className="stat-label">Total Views</div>
          </div>
        </motion.div>
        <motion.div 
          className="stat-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="stat-icon">�</div>
          <div className="stat-content">
            <motion.div 
              className="stat-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.totalLikes}
            </motion.div>
            <div className="stat-label">Total Likes</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls Section */}
      <motion.div 
        className="controls-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Search Bar */}
        <motion.div 
          className="search-container"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="🔍 Search by title, tour, location, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="filters-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Folder Filter */}
          <motion.div 
            className="filter-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <FolderIcon className="filter-icon" />
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="filter-select"
              title="Filter by tour"
            >
              {tours.map(tour => (
                <option key={tour} value={tour}>
                  {tour === 'all' ? '🌟 All Tours' : `🚀 ${tour}`}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Type Filter */}
          <motion.div 
            className="filter-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <FilterIcon className="filter-icon" />
            <div className="filter-buttons">
              <motion.button
                onClick={() => setSelectedFilter('all')}
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All ({stats.total})
              </motion.button>
              <motion.button
                onClick={() => setSelectedFilter('images')}
                className={`filter-btn ${selectedFilter === 'images' ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📸 Images ({stats.images})
              </motion.button>
              <motion.button
                onClick={() => setSelectedFilter('videos')}
                className={`filter-btn ${selectedFilter === 'videos' ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎬 Videos ({stats.videos})
              </motion.button>
            </div>
          </motion.div>

          {/* View Mode */}
          <motion.div 
            className="view-mode-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GridIcon />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ListIcon />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Media Gallery */}
      <motion.div 
        className={`media-gallery ${viewMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <AnimatePresence>
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                className="media-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedMedia(item)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="media-preview">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="media-thumbnail"
                  />
                  {item.type === 'video' && (
                    <div className="video-overlay">
                      <PlayIcon className="play-icon" />
                    </div>
                  )}
                  <div className="media-overlay">
                    <div className="overlay-actions">
                      <button className="action-btn" title="Download">
                        <DownloadIcon />
                      </button>
                      <button className="action-btn" title="Share">
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="media-info">
                  <h3 className="media-title">{item.title}</h3>
                  <div className="media-meta">
                    <span className="media-tour">{item.tour}</span>
                    <span className="media-date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="media-stats">
                    <span className="stat">
                      <span className="stat-icon">👁️</span>
                      {item.views}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">💖</span>
                      {item.likes}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">📁</span>
                      {item.size}
                    </span>
                  </div>
                  <div className="media-tags">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="empty-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🌌
              </motion.div>
              <h3>No cosmic captures found</h3>
              <p>Start your journey by uploading stunning astronomy photos and videos</p>
              <Link to="/dashboard/media/upload">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="primary" size="medium">
                    🚀 Upload Your First Media
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Action Button for Quick Upload */}
      <motion.div
        className="floating-upload-btn"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/dashboard/media/upload">
          <motion.button
            className="fab"
            whileHover={{ 
              boxShadow: "0 20px 40px rgba(102, 126, 234, 0.6)",
              y: -3
            }}
            title="Quick Upload"
          >
            <UploadIcon className="fab-icon" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Media Preview Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            className="media-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{selectedMedia.title}</h3>
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
                      alt={selectedMedia.title}
                      className="large-media"
                    />
                  ) : (
                    <video 
                      src={selectedMedia.url}
                      controls
                      className="large-media"
                    />
                  )}
                </div>
                
                <div className="media-details">
                  <div className="detail-row">
                    <strong>Tour:</strong> {selectedMedia.tour}
                  </div>
                  <div className="detail-row">
                    <strong>Location:</strong> {selectedMedia.location}
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong> {new Date(selectedMedia.date).toLocaleDateString()}
                  </div>
                  <div className="detail-row">
                    <strong>Size:</strong> {selectedMedia.size}
                  </div>
                  <div className="detail-row">
                    <strong>Views:</strong> {selectedMedia.views.toLocaleString()}
                  </div>
                  <div className="detail-row">
                    <strong>Likes:</strong> {selectedMedia.likes}
                  </div>
                  <div className="detail-row">
                    <strong>Tags:</strong>
                    <div className="modal-tags">
                      {selectedMedia.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <Button variant="secondary" size="medium">
                  Edit Details
                </Button>
                <Button variant="primary" size="medium">
                  Download
                </Button>
                <Button variant="primary" size="medium">
                  Share
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Quick Upload */}
      <motion.div
        className="floating-upload-btn"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/dashboard/media/upload">
          <motion.button
            className="fab"
            whileHover={{ 
              boxShadow: "0 20px 40px rgba(102, 126, 234, 0.6)",
              y: -3
            }}
            title="Quick Upload"
          >
            <UploadIcon className="fab-icon" />
          </motion.button>
        </Link>
      </motion.div>
        </>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50, x: 300 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 300 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="notification-close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuideMediaDashboard;
