import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Image, Video, Eye, Heart, Upload } from 'lucide-react';
import '../../styles/pages/guide/_guideMediaDashboard.scss';

// Professional Icons with consistent styling
const UploadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3"/>
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const FilterIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
);

const GridIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const FolderIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m4 20 16 0 0-11-8-1-2-2-6 0z"/>
  </svg>
);

const SortIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M7 12h10M11 18h2"/>
  </svg>
);

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
  description?: string;
}

const mockMediaData: MediaItem[] = [
  {
    id: 1,
    title: "Saturn Ring Structure Analysis",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=1",
    thumbnail: "https://picsum.photos/400/300?random=1",
    tour: "Saturn Observation Night",
    location: "Mount Wilson Observatory",
    date: "2025-06-15",
    tags: ["saturn", "rings", "telescope", "planetary"],
    size: "2.4 MB",
    views: 245,
    likes: 32,
    description: "Detailed capture of Saturn's ring system showing the Cassini Division"
  },
  {
    id: 2,
    title: "Jupiter's Great Red Spot",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=2",
    tour: "Jupiter Close-up Session",
    location: "Palomar Observatory",
    date: "2025-06-10",
    tags: ["jupiter", "storm", "timelapse", "planetary"],
    size: "45.2 MB",
    views: 412,
    likes: 67,
    description: "Time-lapse showing the rotation of Jupiter's Great Red Spot"
  },
  {
    id: 3,
    title: "Andromeda Galaxy Core",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=3",
    thumbnail: "https://picsum.photos/400/300?random=3",
    tour: "Deep Space Photography",
    location: "Dark Sky Reserve",
    date: "2025-06-08",
    tags: ["galaxy", "andromeda", "deep-space", "astrophotography"],
    size: "5.8 MB",
    views: 892,
    likes: 156,
    description: "High-resolution capture of Andromeda's galactic core"
  },
  {
    id: 4,
    title: "Lunar Eclipse Sequence",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=4",
    tour: "Lunar Eclipse Special",
    location: "City Observatory",
    date: "2025-06-05",
    tags: ["moon", "eclipse", "lunar", "timelapse"],
    size: "67.3 MB",
    views: 634,
    likes: 98,
    description: "Complete lunar eclipse sequence from start to totality"
  },
  {
    id: 5,
    title: "Orion Nebula Details",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=5",
    thumbnail: "https://picsum.photos/400/300?random=5",
    tour: "Nebula Photography Workshop",
    location: "Remote Desert Site",
    date: "2025-06-03",
    tags: ["nebula", "orion", "star-formation", "deep-space"],
    size: "4.1 MB",
    views: 523,
    likes: 89,
    description: "Detailed view of star formation in the Orion Nebula"
  },
  {
    id: 6,
    title: "Mars Opposition 2025",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=6",
    thumbnail: "https://picsum.photos/400/300?random=6",
    tour: "Mars Opposition Special",
    location: "High Altitude Observatory",
    date: "2025-06-01",
    tags: ["mars", "opposition", "planetary", "surface"],
    size: "3.2 MB",
    views: 367,
    likes: 54,
    description: "Mars at its closest approach showing surface features"
  }
];

const GuideMediaDashboard: React.FC = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedTour, setSelectedTour] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes' | 'title'>('date');
  const [isLoading] = useState(false);

  // Body scroll lock for modal
  useEffect(() => {
    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMedia]);

  // Get unique tours for filter
  const tours = useMemo(() => 
    ['all', ...Array.from(new Set(mockMediaData.map(item => item.tour)))], 
    []
  );

  // Filter and sort media
  const filteredAndSortedMedia = useMemo(() => {
    const filtered = mockMediaData.filter(item => {
      const matchesSearch = searchTerm === '' || 
                           item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedFilter === 'all' || 
                         (selectedFilter === 'images' && item.type === 'image') ||
                         (selectedFilter === 'videos' && item.type === 'video');
      
      const matchesTour = selectedTour === 'all' || item.tour === selectedTour;
      
      return matchesSearch && matchesType && matchesTour;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [searchTerm, selectedFilter, selectedTour, sortBy]);

  // Statistics
  const stats = useMemo(() => ({
    total: mockMediaData.length,
    images: mockMediaData.filter(item => item.type === 'image').length,
    videos: mockMediaData.filter(item => item.type === 'video').length,
    totalViews: mockMediaData.reduce((sum, item) => sum + item.views, 0),
    totalLikes: mockMediaData.reduce((sum, item) => sum + item.likes, 0),
    totalSize: mockMediaData.reduce((sum, item) => sum + parseFloat(item.size), 0).toFixed(1)
  }), []);

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h2>Media Gallery</h2>
        <div className="header-actions">
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => window.open('/guide/media-upload', '_blank')}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload New Media
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <Card className="stat-card images" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Image className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Images</span>
              <strong className="stat-value">{stats.images}</strong>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card videos" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Video className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Videos</span>
              <strong className="stat-value">{stats.videos}</strong>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card views" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Eye className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Views</span>
              <strong className="stat-value">{stats.totalViews.toLocaleString()}</strong>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card likes" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Heart className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Likes</span>
              <strong className="stat-value">{stats.totalLikes}</strong>
            </div>
          </div>
        </Card>
      </div>

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
                {/* Tour Filter */}
                <motion.div 
                  className="filter-group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <FolderIcon className="filter-icon" />
                  <select
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
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

                {/* Sort Controls */}
                <motion.div 
                  className="filter-group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <SortIcon className="filter-icon" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes' | 'title')}
                    className="filter-select"
                    title="Sort by"
                  >
                    <option value="date">📅 Latest First</option>
                    <option value="views">👁️ Most Viewed</option>
                    <option value="likes">❤️ Most Liked</option>
                    <option value="title">🔤 Alphabetical</option>
                  </select>
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
                {filteredAndSortedMedia.length > 0 ? (
                  filteredAndSortedMedia.map((item, index) => (
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
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/400x300/1a1a2e/64b5f6?text=${encodeURIComponent(item.title)}`;
                          }}
                          loading="lazy"
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
          </>
        )}
      </div>
    </div>
  );
};

export default GuideMediaDashboard;
