import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaStar, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import stargazingSpotService from '../../services/stargazingSpotService';
import type { StargazingSpot as ApiStargazingSpot } from '../../services/stargazingSpotService';
import '../../styles/pages/moderator/SpotsModeration.scss';

const SpotsModeration: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [spots, setSpots] = useState<ApiStargazingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSpots();
  }, [selectedFilter]);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedFilter === 'all') {
        // Fetch all spots regardless of status by not passing status filter
        response = await stargazingSpotService.getAllStargazingSpots({
          // Don't pass status filter to get all spots
        });
      } else {
        response = await stargazingSpotService.getSpotsByStatus(selectedFilter);
      }
      
      if (response.success && response.data) {
        setSpots(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (spotId: number, action: 'approve' | 'reject') => {
    setActionLoading(`${spotId}-${action}`);
    try {
      const response = await stargazingSpotService.moderateStargazingSpot(spotId, action);
      
      if (response.success) {
        // Refresh the spots list
        await fetchSpots();
        alert(`Spot ${action}d successfully!`);
      }
    } catch (error) {
      console.error(`Error ${action}ing spot:`, error);
      alert(`Error ${action}ing spot. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSpots = spots.filter(spot =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.creator?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              variant="ghost"
              size="medium"
              onClick={() => navigate(-1)}
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
              <span className="stat-number">{spots.filter(s => s.status === 'rejected').length}</span>
              <span className="stat-label">Rejected</span>
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
          {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'primary' : 'border'}
              size="small"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <div className="spots-list">
            {filteredSpots.map(spot => (
              <div key={spot.id} className="spot-item">
                <div className="spot-header">
                  <div className="spot-info_1">
                    <div className="location-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="spot-details_1">
                      <h3 className="spot-name">{spot.name}</h3>
                      <p className="spot-location">{spot.location}</p>
                      <div className="submitter-info">
                        <span>by {spot.creator?.display_name || 'Unknown'}</span>
                        <span className="separator">•</span>
                        <span>{formatDate(spot.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="status-badges">
                    <div className={`status-badge status-${spot.status}`}>
                      {spot.status}
                    </div>
                  </div>
                </div>

                <div className="spot-content">
                  <div className="spot-description">
                    <p>{spot.description.substring(0, 150)}{spot.description.length > 150 ? '...' : ''}</p>
                  </div>

                  {/* Image Gallery Preview */}
                  {spot.image_urls && spot.image_urls.length > 0 && (
                    <div className="spot-images-preview_3">
                      {spot.image_urls.slice(0, 3).map((url, index) => (
                        <img key={index} src={url} alt={`${spot.name} ${index + 1}`} />
                      ))}
                      {spot.image_urls.length > 3 && (
                        <div className="more-images">+{spot.image_urls.length - 3}</div>
                      )}
                    </div>
                  )}

                  <div className="spot-metadata">
                    <div className="metadata-section">
                      <div className="meta-item">
                        <span className="label">Best Time:</span>
                        <span className="value">{spot.best_time || 'Not specified'}</span>
                      </div>
                      <div className="meta-item">
                        <span className="label">Facilities:</span>
                        <span className="value">
                          {Array.isArray(spot.facilities) 
                            ? spot.facilities.length 
                            : typeof spot.facilities === 'string' 
                              ? JSON.parse(spot.facilities).length 
                              : 0} facilities
                        </span>
                      </div>
                    </div>
                    
                    <div className="metadata-section">
                      <div className="meta-item">
                        <span className="label">Rating:</span>
                        <span className="value">
                          <FaStar className="star-icon" />
                          {spot.rating.toFixed(1)} ({spot.review_count || 0} reviews)
                        </span>
                      </div>
                      {spot.moderated_by && (
                        <div className="meta-item">
                          <span className="label">Moderated by:</span>
                          <span className="value">{spot.moderator?.display_name || 'Unknown'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="spot-actions">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => navigate(`/dashboard/moderation/spots/details/${spot.id}`)}
                  >
                    👁 View Details
                  </Button>
                  {spot.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to approve "${spot.name}"?`)) {
                            handleModerate(spot.id, 'approve');
                          }
                        }}
                        disabled={actionLoading === `${spot.id}-approve`}
                      >
                        <FaCheck /> {actionLoading === `${spot.id}-approve` ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to reject "${spot.name}"?`)) {
                            handleModerate(spot.id, 'reject');
                          }
                        }}
                        disabled={actionLoading === `${spot.id}-reject`}
                      >
                        <FaTimes /> {actionLoading === `${spot.id}-reject` ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                  {spot.status === 'approved' && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to reject "${spot.name}"? This will remove it from public view.`)) {
                          handleModerate(spot.id, 'reject');
                        }
                      }}
                      disabled={actionLoading === `${spot.id}-reject`}
                    >
                      <FaTimes /> {actionLoading === `${spot.id}-reject` ? 'Rejecting...' : 'Reject'}
                    </Button>
                  )}
                  {spot.status === 'rejected' && (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to approve "${spot.name}"? This will make it visible to the public.`)) {
                          handleModerate(spot.id, 'approve');
                        }
                      }}
                      disabled={actionLoading === `${spot.id}-approve`}
                    >
                      <FaCheck /> {actionLoading === `${spot.id}-approve` ? 'Approving...' : 'Re-approve'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredSpots.length === 0 && (
              <div className="empty-state">
                <p>No spots found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotsModeration;
