import React, { useState, useMemo } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/pages/guide/_serviceListing.scss';

// Icons
const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = "", filled = false }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2"
    />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M10 6l0 4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M13 16v-1.5a2.5 2.5 0 00-2.5-2.5h-7A2.5 2.5 0 001 14.5V16M16 13l2 2 4-4M11 7A4 4 0 103 7a4 4 0 008 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const SearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// const EditIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
//     <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// Service interface
interface Service {
  id: string;
  title: string;
  description: string;
  category: 'stargazing' | 'astrophotography' | 'telescope' | 'planetarium' | 'workshop' | 'expedition';
  price: number;
  duration: string;
  maxParticipants: number;
  currentBookings: number;
  rating: number;
  totalReviews: number;
  location: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  nextAvailable: string;
  image: string;
  featured: boolean;
  tags: string[];
}

// Dummy data for services
const dummyServices: Service[] = [
  {
    id: '1',
    title: 'Deep Space Observation Experience',
    description: 'Explore distant galaxies, nebulae, and star clusters through professional-grade telescopes. Perfect for beginners wanting to discover the wonders beyond our solar system.',
    category: 'stargazing',
    price: 75,
    duration: '3 hours',
    maxParticipants: 8,
    currentBookings: 5,
    rating: 4.9,
    totalReviews: 127,
    location: 'Dark Sky Observatory, Mount Wilson',
    difficulty: 'Beginner',
    equipment: ['Professional Telescope', 'Star Charts', 'Red Light Flashlight'],
    nextAvailable: '2025-07-05',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
    featured: true,
    tags: ['Deep Space', 'Galaxies', 'Nebulae', 'Night Sky']
  },
  {
    id: '2',
    title: 'Astrophotography Masterclass',
    description: 'Learn the art and science of capturing celestial objects. From camera settings to post-processing techniques, master the skills to photograph the cosmos.',
    category: 'astrophotography',
    price: 150,
    duration: '6 hours',
    maxParticipants: 6,
    currentBookings: 4,
    rating: 4.8,
    totalReviews: 89,
    location: 'Alpine Astrophotography Center',
    difficulty: 'Intermediate',
    equipment: ['DSLR Camera', 'Tripod', 'Intervalometer', 'Editing Software'],
    nextAvailable: '2025-07-08',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
    featured: true,
    tags: ['Photography', 'Long Exposure', 'Milky Way', 'Post-Processing']
  },
  {
    id: '3',
    title: 'Telescope Building Workshop',
    description: 'Build your own Dobsonian telescope from scratch. Learn the principles of optics while creating a powerful instrument for lifelong stargazing.',
    category: 'workshop',
    price: 200,
    duration: '8 hours',
    maxParticipants: 4,
    currentBookings: 2,
    rating: 4.7,
    totalReviews: 34,
    location: 'Stellar Craft Workshop',
    difficulty: 'Advanced',
    equipment: ['Mirror Kit', 'Wood Materials', 'Tools', 'Assembly Guide'],
    nextAvailable: '2025-07-12',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=300&fit=crop',
    featured: false,
    tags: ['DIY', 'Optics', 'Crafting', 'Education']
  },
  {
    id: '4',
    title: 'Planetary Observation Session',
    description: 'Get up close with planets in our solar system. Observe Jupiter\'s moons, Saturn\'s rings, and Mars\' surface features through high-powered telescopes.',
    category: 'stargazing',
    price: 50,
    duration: '2 hours',
    maxParticipants: 10,
    currentBookings: 8,
    rating: 4.6,
    totalReviews: 156,
    location: 'City Observatory Deck',
    difficulty: 'Beginner',
    equipment: ['Planetary Telescope', 'Filters', 'Observation Guide'],
    nextAvailable: '2025-07-03',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400&h=300&fit=crop',
    featured: false,
    tags: ['Planets', 'Solar System', 'Jupiter', 'Saturn']
  },
  {
    id: '5',
    title: 'Dark Sky Photography Expedition',
    description: 'Join us for a multi-day expedition to one of the world\'s darkest sky locations. Capture the Milky Way in all its glory and learn advanced night photography.',
    category: 'expedition',
    price: 450,
    duration: '3 days',
    maxParticipants: 8,
    currentBookings: 3,
    rating: 5.0,
    totalReviews: 23,
    location: 'Atacama Desert, Chile',
    difficulty: 'Advanced',
    equipment: ['Professional Camera', 'Tracking Mount', 'Camping Gear', 'Transport'],
    nextAvailable: '2025-07-20',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
    featured: true,
    tags: ['Expedition', 'Dark Sky', 'Milky Way', 'Desert']
  },
  {
    id: '6',
    title: 'Lunar Photography Workshop',
    description: 'Master the art of photographing our closest celestial neighbor. Learn about lunar phases, crater photography, and creative composition techniques.',
    category: 'astrophotography',
    price: 90,
    duration: '4 hours',
    maxParticipants: 10,
    currentBookings: 7,
    rating: 4.8,
    totalReviews: 72,
    location: 'Moonrise Observatory',
    difficulty: 'Intermediate',
    equipment: ['Telephoto Lens', 'Tripod', 'Moon Filter', 'Timer Remote'],
    nextAvailable: '2025-07-15',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    featured: false,
    tags: ['Moon', 'Craters', 'Phases', 'Composition']
  }
];

const ServiceListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'date' | 'popularity'>('rating');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [services, setServices] = useState<Service[]>(dummyServices);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<Service | null>(null);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    const filtered = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesFeatured = !showFeaturedOnly || service.featured;
      
      return matchesSearch && matchesCategory && matchesFeatured;
    });

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'date':
          return new Date(a.nextAvailable).getTime() - new Date(b.nextAvailable).getTime();
        case 'popularity':
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, showFeaturedOnly, services]);

  // Modal handlers
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setEditForm({ ...service });
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedService(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === editForm.id ? editForm : service
        )
      );
      handleCloseModals();
    }
  };

  const handleEditFormChange = (field: keyof Service, value: string | number | boolean | string[]) => {
    if (editForm) {
      setEditForm(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'stargazing', label: 'Stargazing' },
    { value: 'astrophotography', label: 'Astrophotography' },
    { value: 'telescope', label: 'Telescope' },
    { value: 'planetarium', label: 'Planetarium' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'expedition', label: 'Expedition' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stargazing': return '🔭';
      case 'astrophotography': return '📸';
      case 'telescope': return '🔬';
      case 'planetarium': return '🌌';
      case 'workshop': return '🛠️';
      case 'expedition': return '🏔️';
      default: return '⭐';
    }
  };



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon key={i} className="star-icon" filled={i < Math.floor(rating)} />
    ));
  };

  return (
    <div className="service-listing">
      {/* Header */}
      <div className="service-listing__header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">Guide Services</h1>
            <p className="page-subtitle">
              Share your expertise and guide others through the wonders of the cosmos
            </p>
          </div>
          <div className="header-actions">
            <Button
              variant="primary"
              size="medium"
              icon={<PlusIcon />}
              iconPosition="left"
            >
              Create New Service
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stats-grid">
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              <h3 className="stat-number">24</h3>
              <p className="stat-label">Active Services</p>
              <span className="stat-change positive">+3 this month</span>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              <h3 className="stat-number">4.8</h3>
              <p className="stat-label">Average Rating</p>
              <div className="stat-stars">
                {renderStars(4.8)}
              </div>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              <h3 className="stat-number">156</h3>
              <p className="stat-label">Total Bookings</p>
              <span className="stat-change positive">+12 this week</span>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              <h3 className="stat-number">$3,240</h3>
              <p className="stat-label">Monthly Revenue</p>
              <span className="stat-change positive">+18%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="service-filters">
        <div className="filters-container">
          <div className="filters-content">
            {/* Search */}
            <div className="search-section">
              <div className="search-input-wrapper">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search services, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <label className="filter-label">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
                title="Filter by category"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-section">
              <label className="filter-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'date' | 'popularity')}
                className="filter-select"
                title="Sort services by"
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
                <option value="date">Soonest Available</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="filter-section">
              <label className="featured-toggle">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                />
                <span className="toggle-text">Featured Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {filteredServices.map(service => (
          <Card key={service.id} className="service-card" variant="elevated" hover clickable>
            {/* Service Image */}
            <div className="service-image">
              <img src={service.image} alt={service.title} />
              {service.featured && (
                <div className="featured-badge">
                  <StarIcon className="featured-star" filled />
                  <span>Featured</span>
                </div>
              )}
              <div className="category-badge">
                <span className="category-icon">{getCategoryIcon(service.category)}</span>
                <span className="category-text">{service.category}</span>
              </div>
            </div>

            {/* Service Content */}
            <div className="service-content">
              <div className="service-header">
                <h3 className="service-title">{service.title}</h3>
                <div className="service-rating">
                  {renderStars(service.rating)}
                  <span className="rating-text">
                    {service.rating} ({service.totalReviews})
                  </span>
                </div>
              </div>

              <p className="service-description">{service.description}</p>

              {/* Service Details */}
              <div className="service-details">
                <div className="detail-item">
                  <LocationIcon className="detail-icon" />
                  <span>{service.location}</span>
                </div>
                <div className="detail-item">
                  <ClockIcon className="detail-icon" />
                  <span>{service.duration}</span>
                </div>
                <div className="detail-item">
                  <UsersIcon className="detail-icon" />
                  <span>{service.currentBookings}/{service.maxParticipants}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="service-tags">
                {service.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
                {service.tags.length > 3 && (
                  <span className="tag-more">+{service.tags.length - 3}</span>
                )}
              </div>

              {/* Service Footer */}
              <div className="service-footer">
                <div className="price-section">
                  <span className="price">${service.price}</span>
                  <span className="difficulty-badge" data-difficulty={service.difficulty.toLowerCase()}>
                    {service.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="card-actions">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleEditService(service)}
              >
                Edit
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={() => handleViewService(service)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="empty-state">
          <div className="empty-content">
            <div className="empty-icon">🔍</div>
            <h3>No services found</h3>
            <p>Try adjusting your search criteria or create a new service to get started.</p>
            <Button variant="primary" size="medium">
              Create Your First Service
            </Button>
          </div>
        </div>
      )}

      {/* View Service Modal */}
      {isViewModalOpen && selectedService && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Service Details</h2>
              <button className="modal-close" onClick={handleCloseModals} title="Close modal">
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="service-image-large">
                <img src={selectedService.image} alt={selectedService.title} />
                {selectedService.featured && (
                  <div className="featured-badge">
                    <StarIcon className="featured-star" filled />
                    <span>Featured Service</span>
                  </div>
                )}
              </div>

              <div className="service-info">
                <div className="service-title-rating">
                  <h3>{selectedService.title}</h3>
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(selectedService.rating)}
                    </div>
                    <span className="rating-text">
                      {selectedService.rating} ({selectedService.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <p className="service-description-full">{selectedService.description}</p>

                <div className="service-details-grid">
                  <div className="detail-group">
                    <h4>Pricing & Duration</h4>
                    <div className="detail-item">
                      <span className="label">Price:</span>
                      <span className="value">${selectedService.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span className="value">{selectedService.duration}</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h4>Availability</h4>
                    <div className="detail-item">
                      <span className="label">Next Available:</span>
                      <span className="value">{new Date(selectedService.nextAvailable).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Bookings:</span>
                      <span className="value">{selectedService.currentBookings}/{selectedService.maxParticipants} spots</span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <h4>Service Info</h4>
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{selectedService.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Difficulty:</span>
                      <span className={`difficulty-badge-modal ${selectedService.difficulty.toLowerCase()}`}>
                        {selectedService.difficulty}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{selectedService.location}</span>
                    </div>
                  </div>
                </div>

                <div className="equipment-section">
                  <h4>Equipment Provided</h4>
                  <div className="equipment-list">
                    {selectedService.equipment.map((item, index) => (
                      <span key={index} className="equipment-item">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="tags-section">
                  <h4>Tags</h4>
                  <div className="tags-list">
                    {selectedService.tags.map((tag, index) => (
                      <span key={index} className="tag-modal">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                handleCloseModals();
                handleEditService(selectedService);
              }}>
                Edit Service
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && editForm && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Service</h2>
              <button className="modal-close" onClick={handleCloseModals} title="Close modal">
                <CloseIcon />
              </button>
            </div>
            
            <div className="modal-content">
              <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Service Title</label>
                    <input
                      id="title"
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={editForm.category}
                      onChange={(e) => handleEditFormChange('category', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="stargazing">Stargazing</option>
                      <option value="astrophotography">Astrophotography</option>
                      <option value="telescope">Telescope</option>
                      <option value="planetarium">Planetarium</option>
                      <option value="workshop">Workshop</option>
                      <option value="expedition">Expedition</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      id="price"
                      type="number"
                      value={editForm.price}
                      onChange={(e) => handleEditFormChange('price', parseFloat(e.target.value))}
                      className="form-input"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input
                      id="duration"
                      type="text"
                      value={editForm.duration}
                      onChange={(e) => handleEditFormChange('duration', e.target.value)}
                      className="form-input"
                      placeholder="e.g., 3 hours, 2 days"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxParticipants">Max Participants</label>
                    <input
                      id="maxParticipants"
                      type="number"
                      value={editForm.maxParticipants}
                      onChange={(e) => handleEditFormChange('maxParticipants', parseInt(e.target.value))}
                      className="form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="difficulty">Difficulty Level</label>
                    <select
                      id="difficulty"
                      value={editForm.difficulty}
                      onChange={(e) => handleEditFormChange('difficulty', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      type="text"
                      value={editForm.location}
                      onChange={(e) => handleEditFormChange('location', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      className="form-textarea"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nextAvailable">Next Available Date</label>
                    <input
                      id="nextAvailable"
                      type="date"
                      value={editForm.nextAvailable}
                      onChange={(e) => handleEditFormChange('nextAvailable', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      id="image"
                      type="url"
                      value={editForm.image}
                      onChange={(e) => handleEditFormChange('image', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="equipment">Equipment (comma-separated)</label>
                    <input
                      id="equipment"
                      type="text"
                      value={editForm.equipment.join(', ')}
                      onChange={(e) => handleEditFormChange('equipment', e.target.value.split(',').map(item => item.trim()))}
                      className="form-input"
                      placeholder="Professional Telescope, Star Charts, Red Light Flashlight"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      id="tags"
                      type="text"
                      value={editForm.tags.join(', ')}
                      onChange={(e) => handleEditFormChange('tags', e.target.value.split(',').map(item => item.trim()))}
                      className="form-input"
                      placeholder="Deep Space, Galaxies, Nebulae"
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => handleEditFormChange('featured', e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">Featured Service</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <Button variant="secondary" onClick={handleCloseModals}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListing;
