import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Image, Video, Eye, Heart, Upload, Search, Grid, List, Folder, Filter, ArrowUpDown, Play, Download, Share, X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/pages/guide/_guideMediaDashboard.scss';

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
  },
  {
    id: 7,
    title: "Milky Way Panorama",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=7",
    thumbnail: "https://picsum.photos/400/300?random=7",
    tour: "Galactic Center Tour",
    location: "Atacama Desert",
    date: "2025-05-28",
    tags: ["milky-way", "panorama", "galactic-center", "night-sky"],
    size: "12.8 MB",
    views: 1247,
    likes: 203,
    description: "Stunning panoramic view of the Milky Way's galactic center"
  },
  {
    id: 8,
    title: "International Space Station Transit",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=8",
    tour: "ISS Observation Session",
    location: "Kennedy Space Center",
    date: "2025-05-25",
    tags: ["iss", "transit", "space-station", "orbital"],
    size: "89.7 MB",
    views: 756,
    likes: 124,
    description: "ISS transit across the moon's surface captured in real-time"
  },
  {
    id: 9,
    title: "Venus Transit Composite",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=9",
    thumbnail: "https://picsum.photos/400/300?random=9",
    tour: "Planetary Transits Workshop",
    location: "Mauna Kea Observatory",
    date: "2025-05-22",
    tags: ["venus", "transit", "solar", "composite"],
    size: "6.3 MB",
    views: 445,
    likes: 78,
    description: "Composite image showing Venus transit across the sun's disk"
  },
  {
    id: 10,
    title: "Comet NEOWISE Trail",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=10",
    tour: "Comet Hunting Expedition",
    location: "Rocky Mountain Observatory",
    date: "2025-05-20",
    tags: ["comet", "neowise", "tail", "timelapse"],
    size: "134.5 MB",
    views: 923,
    likes: 167,
    description: "Time-lapse of Comet NEOWISE's magnificent tail development"
  },
  {
    id: 11,
    title: "Solar Flare Activity",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=11",
    thumbnail: "https://picsum.photos/400/300?random=11",
    tour: "Solar Observation Day",
    location: "National Solar Observatory",
    date: "2025-05-18",
    tags: ["solar-flare", "sun", "chromosphere", "magnetic-field"],
    size: "8.9 MB",
    views: 612,
    likes: 95,
    description: "Spectacular solar flare captured with hydrogen-alpha filter"
  },
  {
    id: 12,
    title: "Ring Nebula in Lyra",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=12",
    thumbnail: "https://picsum.photos/400/300?random=12",
    tour: "Planetary Nebulae Tour",
    location: "Apache Point Observatory",
    date: "2025-05-15",
    tags: ["ring-nebula", "lyra", "planetary-nebula", "dying-star"],
    size: "7.2 MB",
    views: 834,
    likes: 142,
    description: "The famous Ring Nebula showing intricate gas shell structure"
  },
  {
    id: 13,
    title: "Meteor Shower Peak",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=13",
    tour: "Perseid Meteor Watch",
    location: "Death Valley",
    date: "2025-05-12",
    tags: ["meteor-shower", "perseids", "shooting-stars", "night-sky"],
    size: "156.3 MB",
    views: 1456,
    likes: 278,
    description: "Peak activity of the Perseid meteor shower with multiple fireballs"
  },
  {
    id: 14,
    title: "Eagle Nebula Pillars",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=14",
    thumbnail: "https://picsum.photos/400/300?random=14",
    tour: "Deep Space Photography",
    location: "Las Campanas Observatory",
    date: "2025-05-10",
    tags: ["eagle-nebula", "pillars-of-creation", "star-formation", "emission"],
    size: "15.4 MB",
    views: 1123,
    likes: 198,
    description: "The iconic Pillars of Creation in the Eagle Nebula"
  },
  {
    id: 15,
    title: "Binary Star Eclipse",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=15",
    tour: "Variable Stars Program",
    location: "Lowell Observatory",
    date: "2025-05-08",
    tags: ["binary-star", "eclipse", "variable", "photometry"],
    size: "78.9 MB",
    views: 567,
    likes: 89,
    description: "Eclipsing binary star system showing dramatic brightness changes"
  },
  {
    id: 16,
    title: "Aurora Borealis Dance",
    type: "video" as const,
    url: "#",
    thumbnail: "https://picsum.photos/400/300?random=16",
    tour: "Northern Lights Expedition",
    location: "Fairbanks, Alaska",
    date: "2025-05-05",
    tags: ["aurora", "northern-lights", "geomagnetic", "atmosphere"],
    size: "198.7 MB",
    views: 2134,
    likes: 456,
    description: "Mesmerizing aurora borealis dancing across the arctic sky"
  },
  {
    id: 17,
    title: "Horsehead Nebula Silhouette",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=17",
    thumbnail: "https://picsum.photos/400/300?random=17",
    tour: "Orion Constellation Tour",
    location: "Cerro Tololo Observatory",
    date: "2025-05-03",
    tags: ["horsehead-nebula", "dark-nebula", "orion", "silhouette"],
    size: "9.6 MB",
    views: 789,
    likes: 134,
    description: "The distinctive silhouette of the Horsehead Nebula in Orion"
  },
  {
    id: 18,
    title: "Supernova Remnant",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=18",
    thumbnail: "https://picsum.photos/400/300?random=18",
    tour: "Stellar Evolution Workshop",
    location: "Keck Observatory",
    date: "2025-05-01",
    tags: ["supernova", "remnant", "shock-wave", "stellar-death"],
    size: "11.2 MB",
    views: 645,
    likes: 107,
    description: "Expanding shock waves from an ancient supernova explosion"
  },
    {
    id: 19,
    title: "Supernova Remnant",
    type: "image" as const,
    url: "https://picsum.photos/800/600?random=18",
    thumbnail: "https://picsum.photos/400/300?random=18",
    tour: "Stellar Evolution Workshop",
    location: "Keck Observatory",
    date: "2025-05-01",
    tags: ["supernova", "remnant", "shock-wave", "stellar-death"],
    size: "11.2 MB",
    views: 645,
    likes: 107,
    description: "Expanding shock waves from an ancient supernova explosion"
  }
];

// Pagination constants
const ITEMS_PER_PAGE = 18;

const GuideMediaDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedTour, setSelectedTour] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes' | 'title'>('date');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedMedia.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMedia = filteredAndSortedMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedTour, searchTerm, sortBy]);

  // Statistics
  const stats = useMemo(() => ({
    total: mockMediaData.length,
    images: mockMediaData.filter(item => item.type === 'image').length,
    videos: mockMediaData.filter(item => item.type === 'video').length,
    totalViews: mockMediaData.reduce((sum, item) => sum + item.views, 0),
    totalLikes: mockMediaData.reduce((sum, item) => sum + item.likes, 0),
    totalSize: mockMediaData.reduce((sum, item) => sum + parseFloat(item.size), 0).toFixed(1)
  }), []);

  // Handle media item actions
  const handleDownload = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement download functionality
    console.log('Download:', item.title);
  };

  const handleShare = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
    console.log('Share:', item.title);
  };

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  return (
    <div className="dashboard-page-new">
      {/* Page Header */}
      <div className="page-header">
        <h2>Media Gallery</h2>
        <div className="header-actions">
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => navigate('/dashboard/media/upload')}
          >
            <Upload className="w-4 h-4 mr-2" />
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
      <div className="controls-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, tour, location, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <Folder className="filter-icon" />
            <select
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
              className="filter-select"
              title="Filter by tour"
            >
              {tours.map(tour => (
                <option key={tour} value={tour}>
                  {tour === 'all' ? 'All Tours' : tour}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <Filter className="filter-icon" />
            <div className="filter-buttons">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              >
                All ({mockMediaData.length})
              </button>
              <button
                onClick={() => setSelectedFilter('images')}
                className={`filter-btn ${selectedFilter === 'images' ? 'active' : ''}`}
              >
                Images ({stats.images})
              </button>
              <button
                onClick={() => setSelectedFilter('videos')}
                className={`filter-btn ${selectedFilter === 'videos' ? 'active' : ''}`}
              >
                Videos ({stats.videos})
              </button>
            </div>
          </div>

          <div className="filter-group">
            <ArrowUpDown className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes' | 'title')}
              className="filter-select"
              title="Sort by"
            >
              <option value="date">Latest First</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>

          <div className="view-mode-group">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      <div className={`media-gallery ${viewMode}`}>
        {paginatedMedia.length > 0 ? (
          paginatedMedia.map((item) => (
            <div
              key={item.id}
              className="media-item"
            >
              <div 
                className="media-preview"
                onClick={() => handleMediaClick(item)}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="media-thumbnail"
                  onError={(e) => {
                    e.currentTarget.src = 'https://picsum.photos/400/300?random=' + item.id;
                  }}
                />
                {item.type === 'video' && (
                  <div className="video-overlay">
                    <Play className="play-icon" />
                  </div>
                )}
                <div className="media-overlay">
                  <div className="overlay-actions">
                    <button 
                      className="action-btn" 
                      title="Download"
                      onClick={(e) => handleDownload(item, e)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="action-btn" 
                      title="Share"
                      onClick={(e) => handleShare(item, e)}
                    >
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                className="media-info"
                onClick={() => handleMediaClick(item)}
              >
                <h3 className="media-title">{item.title}</h3>
                <div className="media-meta">
                  <div className="meta-item">
                    <Folder className="w-4 h-4" />
                    <span>{item.tour}</span>
                  </div>
                  <div className="meta-item">
                    <span>📍 {item.location}</span>
                  </div>
                  <div className="meta-item">
                    <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="media-stats">
                  <div className="stat">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="stat">
                    <Heart className="w-4 h-4" />
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🌌</div>
            <h3>No cosmic captures found</h3>
            <p>Start your journey by uploading stunning astronomy photos and videos</p>
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate('/dashboard/media/upload')}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Media
            </Button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls" >
          <Button
            onClick={() => {
              console.log('Previous clicked, currentPage:', currentPage);
              setCurrentPage(prev => Math.max(prev - 1, 1));
            }}
              variant="primary" 
              size="medium"
              disabled={currentPage === 1}            
          >
            <ChevronLeft className="w-4 h-4" />
            PREV
          </Button>
          
          <div className="pagination-info">
            <span className="current-page">
              Page {currentPage} of {totalPages}
            </span>
            <span className="items-info">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedMedia.length)} of {filteredAndSortedMedia.length} items
            </span>
          </div>
          
          <Button
            onClick={() => {
              console.log('Next clicked, currentPage:', currentPage);
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
            }}
              variant="primary" 
              size="medium"
          >
            NEXT
          <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={() => setSelectedMedia(null)}>
          <div className="modal-backdrop" />
          <div className="modal-container">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="modal-header">
                <div className="header-content">
                  <div className="media-type-badge">
                    {selectedMedia.type === 'image' ? (
                      <><Image className="w-4 h-4" /> Image</>
                    ) : (
                      <><Video className="w-4 h-4" /> Video</>
                    )}
                  </div>
                  <h2 className="modal-title">{selectedMedia.title}</h2>
                  <p className="modal-subtitle">
                    {selectedMedia.tour} • {selectedMedia.location}
                  </p>
                </div>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedMedia(null)}
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="modal-body">
                <div className="modal-layout">
                  {/* Media Preview */}
                  <div className="media-section">
                    <div className="media-preview-container">
                      {selectedMedia.type === 'image' ? (
                        <img 
                          src={selectedMedia.url} 
                          alt={selectedMedia.title}
                          className="modal-media"
                          onError={(e) => {
                            e.currentTarget.src = selectedMedia.thumbnail;
                          }}
                        />
                      ) : (
                        <div className="video-preview-container">
                          <img 
                            src={selectedMedia.thumbnail} 
                            alt={selectedMedia.title}
                            className="video-background"
                          />
                          <div className="video-overlay-large">
                            <div className="play-button-large">
                              <Play className="w-8 h-8" />
                            </div>
                            <p className="video-text">Click to play video</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Media Actions */}
                    <div className="media-actions-bar">
                      <div className="action-group">
                        <button 
                          className="action-button primary"
                          title="Download"
                          onClick={(e) => handleDownload(selectedMedia, e)}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          className="action-button secondary"
                          title="Share"
                          onClick={(e) => handleShare(selectedMedia, e)}
                        >
                          <Share className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="engagement-stats">
                        <div className="stat-item">
                          <Eye className="w-4 h-4" />
                          <span>{selectedMedia.views.toLocaleString()} views</span>
                        </div>
                        <div className="stat-item">
                          <Heart className="w-4 h-4" />
                          <span>{selectedMedia.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Panel */}
                  <div className="info-section">
                    <div className="info-content">
                      {/* Description */}
                      {selectedMedia.description && (
                        <div className="description-card">
                          <h3 className="section-title">Description</h3>
                          <p className="description-text">{selectedMedia.description}</p>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="details-card">
                        <h3 className="section-title">Details</h3>
                        <div className="details-grid">
                          <div className="detail-item">
                            <div className="detail-icon">
                              <Folder className="w-4 h-4" />
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Tour</span>
                              <span className="detail-value">{selectedMedia.tour}</span>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon">
                              📍
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Location</span>
                              <span className="detail-value">{selectedMedia.location}</span>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon">
                              📅
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">Date Captured</span>
                              <span className="detail-value">
                                {new Date(selectedMedia.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="detail-item">
                            <div className="detail-icon">
                              💾
                            </div>
                            <div className="detail-content">
                              <span className="detail-label">File Size</span>
                              <span className="detail-value">{selectedMedia.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="tags-card">
                        <h3 className="section-title">Tags</h3>
                        <div className="tags-container">
                          {selectedMedia.tags.map((tag, index) => (
                            <span key={index} className="tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Edit Button */}
                      <div className="edit-section">
                        <Button variant="border" size="medium" className="edit-button">
                          Edit Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideMediaDashboard;