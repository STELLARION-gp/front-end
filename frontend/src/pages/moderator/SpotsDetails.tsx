import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { FaMapMarkerAlt, FaStar, FaEye, FaClock, FaCalendarAlt, FaCamera } from 'react-icons/fa';
import '../../styles/moderator/SpotsDetails.scss';

interface SpotDetails {
  id: string;
  name: string;
  description: string;
  submittedBy: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    verified: boolean;
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
    reportedBy: Array<{
      id: string;
      username: string;
      timestamp: string;
    }>;
  };
  moderatorNotes?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  photos: Array<{
    id: string;
    url: string;
    caption: string;
    uploadedBy: string;
    timestamp: string;
  }>;
  moderationHistory: Array<{
    id: string;
    action: string;
    moderator: string;
    timestamp: string;
    reason: string;
  }>;
}

const SpotsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spot, setSpot] = useState<SpotDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchSpotDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockSpot: SpotDetails = {
          id: id || '1',
          name: 'Mount Wilson Observatory',
          description: 'Historic observatory with excellent dark skies and minimal light pollution. Perfect for deep sky observations and astrophotography. The site offers unparalleled views of the cosmos with state-of-the-art facilities and guided tours available for astronomy enthusiasts.',
          submittedBy: {
            id: 'user123',
            username: 'SkyExplorer',
            email: 'skyexplorer@example.com',
            avatar: '/default-avatar.png',
            verified: true
          },
          location: {
            address: 'Mount Wilson, CA 91023, USA',
            coordinates: { lat: 34.2257, lng: -118.0576 },
            elevation: 1742
          },
          accessibility: 'moderate',
          lightPollution: 'class2',
          amenities: ['Parking', 'Restrooms', 'Observatory tours', 'Gift shop', 'Cafeteria', 'Telescope rental'],
          bestViewingTimes: ['10 PM - 4 AM', 'New moon phases', 'Clear winter nights', 'Spring and Fall seasons'],
          status: 'pending',
          priority: 'high',
          submittedAt: '2024-01-10T14:30:00Z',
          lastUpdated: '2024-01-15T09:22:00Z',
          verification: {
            hasPhotos: true,
            photoCount: 12,
            hasCoordinates: true,
            hasDescription: true,
            completenessScore: 95
          },
          reports: {
            count: 2,
            reasons: ['Outdated information', 'Accessibility concerns'],
            details: 'Some users reported that the accessibility information might be outdated and road conditions have changed.',
            reportedBy: [
              {
                id: 'user456',
                username: 'AstronomyFan',
                timestamp: '2024-01-14T16:30:00Z'
              },
              {
                id: 'user789',
                username: 'StarGazer2024',
                timestamp: '2024-01-15T08:45:00Z'
              }
            ]
          },
          moderatorNotes: 'Initial review shows high quality submission with detailed information.',
          rating: 4.8,
          reviewCount: 127,
          tags: ['Observatory', 'Dark Sky', 'Historic', 'Mountain', 'Astrophotography'],
          photos: [
            {
              id: 'photo1',
              url: '/images/mount-wilson-1.jpg',
              caption: 'Main observatory building at sunset',
              uploadedBy: 'SkyExplorer',
              timestamp: '2024-01-10T14:30:00Z'
            },
            {
              id: 'photo2',
              url: '/images/mount-wilson-2.jpg',
              caption: 'Night sky view from the observatory deck',
              uploadedBy: 'SkyExplorer',
              timestamp: '2024-01-10T14:35:00Z'
            }
          ],
          moderationHistory: [
            {
              id: 'mod1',
              action: 'Submitted for Review',
              moderator: 'System',
              timestamp: '2024-01-10T14:30:00Z',
              reason: 'New spot submission received'
            },
            {
              id: 'mod2',
              action: 'Initial Review',
              moderator: 'ModeratorBeta',
              timestamp: '2024-01-12T10:15:00Z',
              reason: 'Preliminary verification of submission details'
            }
          ]
        };

        setSpot(mockSpot);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpotDetails();
    }
  }, [id]);

  const handleAction = async (action: string) => {
    if (!spot) return;
    
    setActionLoading(action);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} spot:`, spot.id);
      
      // Update spot status based on action
      if (action === 'approve') {
        setSpot(prev => prev ? { ...prev, status: 'approved' } : null);
      } else if (action === 'reject') {
        setSpot(prev => prev ? { ...prev, status: 'rejected' } : null);
      }
      
      // Show success message
      alert(`Spot ${action}ed successfully!`);
      
    } catch (error) {
      console.error(`Error ${action}ing spot:`, error);
      alert(`Error ${action}ing spot. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  if (loading) {
    return (
      <div className="spots-details">
        <div className="details-header">
          <Button
            variant="border"
            size="small"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <h1>Loading Spot Details...</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="spots-details">
        <div className="details-header">
          <Button
            variant="border"
            size="small"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <h1>Spot Not Found</h1>
        </div>
        <div className="error-container">
          <p>The requested stargazing spot could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spots-details">
      <div className="details-header">
        <Button
          variant="border"
          size="small"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        <h1>Spot Details</h1>
        <div className="header-actions">
          <Button
            variant="border"
            size="small"
          >
            👁 {spot.reviewCount} Reviews
          </Button>
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          {/* Spot Information */}
          <div className="detail-card spot-info">
            <div className="card-header">
              <h2>Spot Information</h2>
              <div className={`spot-status ${spot.status.replace('_', '-')}`}>
                {spot.status.replace('_', ' ').charAt(0).toUpperCase() + spot.status.replace('_', ' ').slice(1)}
              </div>
            </div>
            <div className="card-content">
              <div className="spot-title">
                <h3>{spot.name}</h3>
              </div>
              <div className="spot-description">
                <p>{spot.description}</p>
              </div>
              
              <div className="spot-meta">
                <div className="meta-item">
                  <FaMapMarkerAlt />
                  <span>{spot.location.address}</span>
                </div>
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>Submitted: {formatDate(spot.submittedAt)}</span>
                </div>
                <div className="meta-item">
                  <FaClock />
                  <span>Updated: {formatDate(spot.lastUpdated)}</span>
                </div>
                <div className="meta-item">
                  <FaStar />
                  <span>Rating: {spot.rating}/5 ({spot.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="spot-tags">
                {spot.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="detail-card location-details">
            <div className="card-header">
              <h2>Location Details</h2>
            </div>
            <div className="card-content">
              <div className="location-grid">
                <div className="location-item">
                  <span className="label">Coordinates:</span>
                  <span className="value">{spot.location.coordinates.lat}, {spot.location.coordinates.lng}</span>
                </div>
                <div className="location-item">
                  <span className="label">Elevation:</span>
                  <span className="value">{spot.location.elevation}m</span>
                </div>
                <div className="location-item">
                  <span className="label">Accessibility:</span>
                  <span className="value">
                    {getAccessibilityIcon(spot.accessibility)} {spot.accessibility}
                  </span>
                </div>
                <div className="location-item">
                  <span className="label">Light Pollution:</span>
                  <span className="value">{getLightPollutionLabel(spot.lightPollution)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & Viewing Times */}
          <div className="detail-card amenities-viewing">
            <div className="card-header">
              <h2>Amenities & Best Viewing Times</h2>
            </div>
            <div className="card-content">
              <div className="section">
                <h4>Available Amenities</h4>
                <div className="amenities-list">
                  {spot.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              </div>
              
              <div className="section">
                <h4>Best Viewing Times</h4>
                <div className="viewing-times">
                  {spot.bestViewingTimes.map((time, index) => (
                    <div key={index} className="viewing-time">{time}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          {spot.photos.length > 0 && (
            <div className="detail-card photos-section">
              <div className="card-header">
                <h2>Photos ({spot.photos.length})</h2>
              </div>
              <div className="card-content">
                <div className="photos-grid">
                  {spot.photos.map(photo => (
                    <div key={photo.id} className="photo-item">
                      <div className="photo-placeholder">
                        <FaCamera />
                        <span>Photo</span>
                      </div>
                      <div className="photo-info">
                        <div className="photo-caption">{photo.caption}</div>
                        <div className="photo-meta">
                          by {photo.uploadedBy} • {formatDate(photo.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submitter Information */}
          <div className="detail-card submitter-info">
            <div className="card-header">
              <h2>Submitter Information</h2>
            </div>
            <div className="card-content">
              <div className="submitter-profile">
                <img src={spot.submittedBy.avatar} alt={spot.submittedBy.username} className="submitter-avatar" />
                <div className="submitter-details">
                  <div className="submitter-username">
                    {spot.submittedBy.username}
                    {spot.submittedBy.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="submitter-email">{spot.submittedBy.email}</div>
                  <div className="submitter-id">ID: {spot.submittedBy.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          {/* Verification Status */}
          <div className="detail-card verification-status">
            <div className="card-header">
              <h2>Verification Status</h2>
              <div className="completeness-score">
                {spot.verification.completenessScore}%
              </div>
            </div>
            <div className="card-content">
              <div className="verification-items">
                <div className={`verification-item ${spot.verification.hasPhotos ? 'verified' : 'missing'}`}>
                  <FaCamera />
                  <span>Photos: {spot.verification.hasPhotos ? `✓ (${spot.verification.photoCount})` : '✗'}</span>
                </div>
                <div className={`verification-item ${spot.verification.hasCoordinates ? 'verified' : 'missing'}`}>
                  <FaMapMarkerAlt />
                  <span>Coordinates: {spot.verification.hasCoordinates ? '✓' : '✗'}</span>
                </div>
                <div className={`verification-item ${spot.verification.hasDescription ? 'verified' : 'missing'}`}>
                  <FaEye />
                  <span>Description: {spot.verification.hasDescription ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="detail-card quick-actions">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <Button
                  variant="success"
                  size="small"
                  onClick={() => handleAction('approve')}
                  loading={actionLoading === 'approve'}
                  disabled={spot.status === 'approved'}
                >
                  ✓ {spot.status === 'approved' ? 'Approved' : 'Approve Spot'}
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleAction('reject')}
                  loading={actionLoading === 'reject'}
                  disabled={spot.status === 'rejected'}
                >
                  ✗ {spot.status === 'rejected' ? 'Rejected' : 'Reject Spot'}
                </Button>
                <Button
                  variant="warning"
                  size="small"
                  onClick={() => handleAction('verify')}
                  loading={actionLoading === 'verify'}
                >
                  📋 Request Verification
                </Button>
              </div>
            </div>
          </div>

          {/* Reports */}
          {spot.reports && spot.reports.count > 0 && (
            <div className="detail-card reports-section">
              <div className="card-header">
                <h2>Reports ({spot.reports.count})</h2>
              </div>
              <div className="card-content">
                <div className="reports-list">
                  <div className="report-reasons">
                    {spot.reports.reasons.map((reason, index) => (
                      <span key={index} className="reason-tag">{reason}</span>
                    ))}
                  </div>
                  <div className="report-details">{spot.reports.details}</div>
                  <div className="reporters">
                    <strong>Reported by:</strong>
                    {spot.reports.reportedBy.map(reporter => (
                      <div key={reporter.id} className="reporter">
                        @{reporter.username} • {formatDate(reporter.timestamp)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Moderation History */}
          {spot.moderationHistory.length > 0 && (
            <div className="detail-card moderation-history">
              <div className="card-header">
                <h2>Moderation History</h2>
              </div>
              <div className="card-content">
                <div className="history-list">
                  {spot.moderationHistory.map(entry => (
                    <div key={entry.id} className="history-item">
                      <div className="history-action">{entry.action}</div>
                      <div className="history-moderator">by {entry.moderator}</div>
                      <div className="history-time">{formatDate(entry.timestamp)}</div>
                      <div className="history-reason">{entry.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Moderator Notes */}
          {spot.moderatorNotes && (
            <div className="detail-card moderator-notes">
              <div className="card-header">
                <h2>Moderator Notes</h2>
              </div>
              <div className="card-content">
                <div className="notes-text">
                  {spot.moderatorNotes}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotsDetails;
