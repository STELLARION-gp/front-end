import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ConfirmDialog from '../../components/ConfirmDialog';
import SuccessMessage from '../../components/SuccessMessage';
import '../../styles/pages/guide/_serviceListing.scss';
import type { 
  Service as ApiService, 
  UpdateServiceRequest
} from '../../services/servicesService';
import { 
  getMyServices, 
  updateService, 
  deleteService,
  getGuideServiceStats 
} from '../../services/servicesService';

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

// const ServiceIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
//   <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
//     <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
//     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//     <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
//   </svg>
// );

// const BookingIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
//   <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
//     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
//     <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
//     <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
//     <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
//     <path d="M8 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const RevenueIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
//   <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
//     <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
//     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
//   </svg>
// );

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

const CalendarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// const EditIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none">
//     <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// Local Service interface extending API Service
interface Service extends Omit<ApiService, 'id' | 'media'> {
  id: string; // Convert number ID to string for component compatibility
  image: string; // Direct image URL
  currentBookings?: number; // Add bookings count
  totalReviews?: number; // Add reviews count
}

// Transform API service to local Service interface
const transformApiService = (apiService: ApiService): Service => {
  // Priority: 1. image_url (direct field), 2. media array, 3. default fallback
  const firstMedia = apiService.media?.[0];
  const imageUrl = apiService.image_url || firstMedia?.media_url || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop';
  
  return {
    ...apiService,
    id: apiService.id.toString(),
    image: imageUrl,
    currentBookings: apiService.bookings_count || 0,
    totalReviews: 0, // TODO: Add reviews count to API
    rating: apiService.rating || 0
  };
};

const ServiceListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'date' | 'popularity'>('rating');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stats state
  const [stats, setStats] = useState({
    total_services: 0,
    active_services: 0,
    total_bookings: 0,
    total_revenue: 0,
    average_rating: 0
  });
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<Service | null>(null);
  
  // Message states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');

  // Helper function to refresh stats
  const refreshStats = async () => {
    try {
      const statsResponse = await getGuideServiceStats();
      setStats(statsResponse);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  };

  // Fetch services and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch services and stats in parallel
        const [servicesResponse, statsResponse] = await Promise.all([
          getMyServices({}),
          getGuideServiceStats()
        ]);
        
        const transformedServices = servicesResponse.services.map(transformApiService);
        setServices(transformedServices);
        setStats(statsResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return a.price - b.price;
        case 'date':
          return new Date(a.next_available).getTime() - new Date(b.next_available).getTime();
        case 'popularity':
          return (b.totalReviews || 0) - (a.totalReviews || 0);
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

  const handleSaveEdit = async () => {
    if (!editForm) return;
    
    try {
      setLoading(true);
      
      // Prepare update data (without id as it's in the URL parameter)
      const updateData: Partial<UpdateServiceRequest> = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        price: editForm.price,
        duration: editForm.duration,
        max_participants: editForm.max_participants,
        location: editForm.location,
        difficulty: editForm.difficulty,
        equipment: editForm.equipment,
        tags: editForm.tags,
        featured: editForm.featured,
        next_available: typeof editForm.next_available === 'string' ? editForm.next_available : editForm.next_available.toISOString()
      };
      
      const updatedService = await updateService(parseInt(editForm.id), updateData);
      
      // Update local state with the updated service
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === editForm.id ? transformApiService(updatedService) : service
        )
      );
      
      // Refresh stats to reflect changes
      await refreshStats();
      
      handleCloseModals();
      setSuccessMessageText('Service updated successfully!');
      setShowSuccessMessage(true);
    } catch (err) {
      console.error('Error updating service:', err);
      setErrorMessageText(`Failed to update service: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      setLoading(true);
      await deleteService(parseInt(serviceToDelete.id));
      
      // Remove from local state
      setServices(prevServices => prevServices.filter(s => s.id !== serviceToDelete.id));
      
      // Refresh stats to reflect deletion
      await refreshStats();
      
      handleCloseModals();
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      setSuccessMessageText('Service deleted successfully!');
      setShowSuccessMessage(true);
    } catch (err) {
      console.error('Error deleting service:', err);
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      setErrorMessageText(`Failed to delete service: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
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
      <div className="service-listing-container">
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
              variant="secondary"
              size="medium"
              icon={<CalendarIcon />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/services/availability')}
            >
              Manage Availability
            </Button>
            <Button
              variant="primary"
              size="medium"
              icon={<PlusIcon />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/services/create')}
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
              {/* <div className="stat-icon">
                <ServiceIcon className="icon" />
              </div> */}
              <div className="stat-info">
                <h3 className="stat-number">{stats.total_services}</h3>
                <p className="stat-label">Total Services</p>
                <span className="stat-change positive">{stats.active_services} active</span>
              </div>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              {/* <div className="stat-icon">
                <StarIcon className="icon star-icon" filled />
              </div> */}
              <div className="stat-info">
                <h3 className="stat-number">{stats.average_rating > 0 ? stats.average_rating.toFixed(1) : 'N/A'}</h3>
                <p className="stat-label">Average Rating</p>
                {stats.average_rating > 0 && (
                  <div className="stat-stars">
                    {renderStars(stats.average_rating)}
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              {/* <div className="stat-icon">
                <BookingIcon className="icon" />
              </div> */}
              <div className="stat-info">
                <h3 className="stat-number">{stats.total_bookings}</h3>
                <p className="stat-label">Total Bookings</p>
                <span className="stat-change positive">All time</span>
              </div>
            </div>
          </Card>
          <Card className="stat-card" variant="elevated">
            <div className="stat-content">
              {/* <div className="stat-icon">
                <RevenueIcon className="icon" />
              </div> */}
              <div className="stat-info">
                <h3 className="stat-number">Rs. {stats.total_revenue.toLocaleString()}</h3>
                <p className="stat-label">Total Revenue</p>
                <span className="stat-change positive">All time</span>
              </div>
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

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state">
          <div className="error-content">
            <h3>Error Loading Services</h3>
            <p>{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && (
        <div className="services-grid">
          {filteredServices.map(service => (
          <div key={service.id} className="service-card1">
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
                  {renderStars(service.rating || 0)}
                  <span className="rating-text">
                    {service.rating || 0} ({service.totalReviews || 0})
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
                  <span>{service.currentBookings || 0}/{service.max_participants}</span>
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
                  <span className="price">Rs. {service.price.toLocaleString()}</span>
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
                variant="danger" 
                size="small"
                onClick={() => handleDeleteService(service)}
              >
                Delete
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                icon={<CalendarIcon />}
                iconPosition="left"
                onClick={() => navigate(`/dashboard/services/${service.id}/availability`)}
              >
                Availability
              </Button>
              <Button 
                variant="primary" 
                size="small"
                onClick={() => handleViewService(service)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredServices.length === 0 && (
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
            
            <div className="modal-content1">
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
                      {renderStars(selectedService.rating || 0)}
                    </div>
                    <span className="rating-text">
                      {selectedService.rating || 0} ({selectedService.totalReviews || 0} reviews)
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
                      <span className="value">{new Date(selectedService.next_available).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Bookings:</span>
                      <span className="value">{selectedService.currentBookings || 0}/{selectedService.max_participants} spots</span>
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
              <Button 
                variant="secondary"
                icon={<CalendarIcon />}
                iconPosition="left"
                onClick={() => {
                  handleCloseModals();
                  navigate(`/dashboard/services/${selectedService.id}/availability`);
                }}
              >
                Set Availability
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
            
            <div className="modal-content1">
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
                      value={editForm.max_participants}
                      onChange={(e) => handleEditFormChange('max_participants', parseInt(e.target.value))}
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
                      value={typeof editForm.next_available === 'string' ? editForm.next_available.split('T')[0] : new Date(editForm.next_available).toISOString().split('T')[0]}
                      onChange={(e) => handleEditFormChange('next_available', e.target.value)}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone and will remove all associated availability slots and bookings.`}
        confirmText="Delete Service"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setServiceToDelete(null);
        }}
      />

      {/* Success Message */}
      <SuccessMessage
        isOpen={showSuccessMessage}
        title="Success!"
        message={successMessageText}
        type="success"
        onClose={() => setShowSuccessMessage(false)}
      />

      {/* Error Message */}
      <SuccessMessage
        isOpen={showErrorMessage}
        title="Error"
        message={errorMessageText}
        type="error"
        onClose={() => setShowErrorMessage(false)}
      />
      </div>
    </div>
  );
};

export default ServiceListing;
