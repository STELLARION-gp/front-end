import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/SpotsModeration.scss';

interface StargazingSpot {
  id: string;
  name: string;
  description: string;
  submittedBy: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    elevation: number;
  };
  accessibility: 'easy' | 'moderate' | 'difficult';
  lightPollution: 'class1' | 'class2' | 'class3' | 'class4' | 'class5';
  amenities: string[];
  bestViewingTimes: string[];
  status: 'pending' | 'approved' | 'rejected' | 'needs_verification';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  lastUpdated: string;
  verification: {
    hasPhotos: boolean;
    photoCount: number;
    hasCoordinates: boolean;
    hasDescription: boolean;
    completenessScore: number;
  };
  reports?: {
    count: number;
    reasons: string[];
    details: string;
  };
  moderatorNotes?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

const SpotsModeration: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for stargazing spots
  const [spots] = useState<StargazingSpot[]>([
    {
      id: 'spot_001',
      name: 'Mount Wilson Observatory',
      description: 'Historic observatory with excellent dark skies and minimal light pollution. Perfect for deep sky observations.',
      submittedBy: {
        id: 'user_001',
        username: 'SkyExplorer',
        email: 'skyexplorer@example.com',
        avatar: 'SE'
      },
      location: {
        address: 'Mount Wilson, CA 91023, USA',
        coordinates: { lat: 34.2257, lng: -118.0576 },
        elevation: 1742
      },
      accessibility: 'moderate',
      lightPollution: 'class2',
      amenities: ['Parking', 'Restrooms', 'Observatory tours', 'Gift shop'],
      bestViewingTimes: ['10 PM - 4 AM', 'New moon phases', 'Clear winter nights'],
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-01-10T14:30:00Z',
      lastUpdated: '2024-01-10T14:30:00Z',
      verification: {
        hasPhotos: true,
        photoCount: 8,
        hasCoordinates: true,
        hasDescription: true,
        completenessScore: 95
      },
      rating: 4.8,
      reviewCount: 127,
      tags: ['Observatory', 'Dark Sky', 'Historic', 'Mountain']
    },
    {
      id: 'spot_002',
      name: 'Fake Desert Location',
      description: 'This is a suspicious location with incorrect coordinates and stock photos.',
      submittedBy: {
        id: 'user_002',
        username: 'SpamUser123',
        email: 'spam@fake.com',
        avatar: 'SU'
      },
      location: {
        address: 'Middle of Nowhere, Desert',
        coordinates: { lat: 0, lng: 0 },
        elevation: 0
      },
      accessibility: 'easy',
      lightPollution: 'class1',
      amenities: ['Free WiFi', 'Swimming pool'],
      bestViewingTimes: ['Always perfect'],
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-01-12T09:15:00Z',
      lastUpdated: '2024-01-12T09:15:00Z',
      verification: {
        hasPhotos: false,
        photoCount: 0,
        hasCoordinates: false,
        hasDescription: false,
        completenessScore: 20
      },
      reports: {
        count: 5,
        reasons: ['Fake location', 'Spam', 'Incorrect information'],
        details: 'Multiple users report this location does not exist or coordinates are wrong.'
      },
      rating: 1.2,
      reviewCount: 3,
      tags: ['Suspicious']
    },
    {
      id: 'spot_003',
      name: 'Cherry Springs State Park',
      description: 'International Dark-Sky Association certified dark sky preserve with exceptional viewing conditions.',
      submittedBy: {
        id: 'user_003',
        username: 'AstroPhotographer',
        email: 'astrophoto@example.com',
        avatar: 'AP'
      },
      location: {
        address: '4639 Cherry Springs Rd, Coudersport, PA 16915, USA',
        coordinates: { lat: 41.6611, lng: -77.8278 },
        elevation: 701
      },
      accessibility: 'easy',
      lightPollution: 'class1',
      amenities: ['Parking', 'Restrooms', 'Picnic tables', 'Camping'],
      bestViewingTimes: ['Sunset to sunrise', 'Year-round', 'New moon optimal'],
      status: 'approved',
      priority: 'medium',
      submittedAt: '2024-01-08T16:45:00Z',
      lastUpdated: '2024-01-09T10:20:00Z',
      verification: {
        hasPhotos: true,
        photoCount: 15,
        hasCoordinates: true,
        hasDescription: true,
        completenessScore: 100
      },
      rating: 4.9,
      reviewCount: 289,
      tags: ['Dark Sky Preserve', 'Certified', 'Camping', 'Astrophotography']
    }
  ]);

  const handleSuspend = (spotId: string) => {
    console.log('Suspending spot:', spotId);
    // Implementation would update spot status
  };

  const handleDelete = (spotId: string) => {
    console.log('Deleting spot:', spotId);
    // Implementation would delete spot
  };

  const filteredSpots = spots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.submittedBy.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || spot.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getLightPollutionLabel = (classification: string) => {
    switch (classification) {
      case 'class1': return 'Class I - Excellent';
      case 'class2': return 'Class II - Good';
      case 'class3': return 'Class III - Moderate';
      case 'class4': return 'Class IV - Poor';
      case 'class5': return 'Class V - Very Poor';
      default: return 'Unknown';
    }
  };

  const getAccessibilityIcon = (level: string) => {
    switch (level) {
      case 'easy': return '🟢';
      case 'moderate': return '🟡';
      case 'difficult': return '🔴';
      default: return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="spots-moderation">
      {/* Header */}
      <div className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="border"
              size="small"
              onClick={() => navigate('/moderator')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>Stargazing Spot Moderation</h1>
              <p>Review and verify submitted stargazing locations</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{spots.filter(s => s.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{spots.filter(s => s.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{spots.filter(s => s.reports && s.reports.count > 0).length}</span>
              <span className="stat-label">Reported</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search spots, locations, or submitters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'rejected', 'needs_verification'].map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'primary' : 'border'}
              size="small"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="spots-list">
          {filteredSpots.map(spot => (
            <div key={spot.id} className="spot-item">
              <div className="spot-header">
                <div className="spot-info">
                  <div className="location-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="spot-details">
                    <h3 className="spot-name">{spot.name}</h3>
                    <p className="spot-location">{spot.location.address}</p>
                    <div className="submitter-info">
                      <span>by {spot.submittedBy.username}</span>
                      <span className="separator">•</span>
                      <span>{formatDate(spot.submittedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="status-badges">
                  <div className={`priority-badge priority-${spot.priority}`}>
                    {spot.priority}
                  </div>
                  <div className={`status-badge status-${spot.status.replace('_', '-')}`}>
                    {spot.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="spot-content">
                <div className="spot-description">
                  <p>{spot.description.substring(0, 150)}...</p>
                </div>

                <div className="spot-metadata">
                  <div className="meta-item">
                    <span className="label">Accessibility:</span>
                    <span className="value">
                      {getAccessibilityIcon(spot.accessibility)} {spot.accessibility}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Light Pollution:</span>
                    <span className="value">{getLightPollutionLabel(spot.lightPollution)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Rating:</span>
                    <span className="value">
                      <FaStar className="star-icon" />
                      {spot.rating} ({spot.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Completeness:</span>
                    <span className="value">{spot.verification.completenessScore}%</span>
                  </div>
                </div>

                {spot.reports && spot.reports.count > 0 && (
                  <div className="reports-info">
                    <span className="reports-indicator">
                      ⚠ {spot.reports.count} Report{spot.reports.count > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <div className="spot-tags">
                  {spot.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="spot-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate(`/moderation/spots/details/${spot.id}`)}
                >
                  👁 View Details
                </Button>
                <Button
                  variant="warning"
                  size="small"
                  onClick={() => handleSuspend(spot.id)}
                >
                  🚫 Suspend
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(spot.id)}
                >
                  🗑 Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotsModeration;
