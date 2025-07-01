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

  // Filter and sort services
  const filteredServices = useMemo(() => {
    const filtered = dummyServices.filter(service => {
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
  }, [searchTerm, selectedCategory, sortBy, showFeaturedOnly]);

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
        <Card className="filters-card" variant="outlined">
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
        </Card>
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
                <div className="action-buttons">
                  <Button variant="secondary" size="small">
                    Edit
                  </Button>
                  <Button variant="primary" size="small">
                    View Details
                  </Button>
                </div>
              </div>
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
    </div>
  );
};

export default ServiceListing;
