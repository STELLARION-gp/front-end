import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ErrorBoundary from '../../components/ErrorBoundary';
import { FaMapMarkerAlt, FaStar, FaEye, FaClock, FaCalendarAlt, FaCamera, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import '../../styles/pages/moderator/SpotsDetails.scss';
import { stargazingSpotService } from '../../services/stargazingSpotService';
import type { StargazingSpot } from '../../services/stargazingSpotService';
import { factCheckService } from '../../services/factCheckService';
import type { FactCheckReport } from '../../services/factCheckService';

type SpotDetails = StargazingSpot;

const SpotsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [spot, setSpot] = useState<SpotDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [factCheckReport, setFactCheckReport] = useState<FactCheckReport | null>(null);
  const [checkingFacts, setCheckingFacts] = useState(false);
  const [showFactCheckModal, setShowFactCheckModal] = useState(false);

  // Fetch spot details from API
  useEffect(() => {
    const fetchSpotDetails = async () => {
      setLoading(true);
      try {
        if (!id) {
          console.error('❌ No spot ID provided');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Fetching spot details for ID:', id);
        const response = await stargazingSpotService.getStargazingSpotById(parseInt(id));
        
        if (response.success && response.data) {
          console.log('✅ Spot details loaded:', response.data);
          
          // Ensure image_urls is always an array
          const spotData = {
            ...response.data,
            image_urls: response.data.image_urls || []
          };
          
          setSpot(spotData);
        } else {
          console.error('❌ Failed to load spot:', response.message);
          setSpot(null);
        }
      } catch (error) {
        console.error('❌ Error fetching spot details:', error);
        setSpot(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpotDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Moderate spot (approve or reject)
  const handleAction = async (action: 'approve' | 'reject') => {
    if (!spot) return;
    
    setActionLoading(action);
    try {
      console.log(`🔄 ${action}ing spot:`, spot.id);
      
      const response = await stargazingSpotService.moderateStargazingSpot(spot.id, action);
      
      if (response.success && response.data) {
        console.log(`✅ Spot ${action}ed successfully`);
        setSpot(response.data);
        alert(`Spot ${action}ed successfully!`);
      } else {
        throw new Error(response.message || `Failed to ${action} spot`);
      }
    } catch (error) {
      console.error(`❌ Error ${action}ing spot:`, error);
      alert(`Error ${action}ing spot. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Run fact check on spot description
  const handleFactCheck = async () => {
    if (!spot || checkingFacts) return;
    
    setCheckingFacts(true);
    setShowFactCheckModal(true); // Show modal immediately
    try {
      console.log('🔍 Starting fact check for spot:', spot.name);
      const report = await factCheckService.checkBlogContent(spot.description, spot.name);
      console.log('✅ Fact check complete:', report);
      setFactCheckReport(report);
    } catch (error) {
      console.error('❌ Error during fact check:', error);
      alert('Error running fact check. Please try again.');
      setShowFactCheckModal(false); // Close modal on error
    } finally {
      setCheckingFacts(false);
    }
  };

  const closeFactCheckModal = () => {
    setShowFactCheckModal(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getCredibilityBadge = (level: string) => {
    switch (level) {
      case 'high': return { icon: <FaCheckCircle />, class: 'credibility-high' };
      case 'medium': return { icon: <FaExclamationCircle />, class: 'credibility-medium' };
      case 'low': return { icon: <FaTimesCircle />, class: 'credibility-low' };
      case 'very-low': return { icon: <FaTimesCircle />, class: 'credibility-very-low' };
      default: return { icon: <FaExclamationCircle />, class: 'credibility-medium' };
    }
  };

  if (loading) {
    return (
      <div className="spots-details">
        <div className="details-header">
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
                <h1>Loading Spot Details...</h1>
                <p>Please wait while we fetch the information</p>
              </div>
            </div>
          </div>
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
                <h1>Spot Not Found</h1>
                <p>The requested location could not be found</p>
              </div>
            </div>
          </div>
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
              <h1>Spot Details</h1>
              <p>Review stargazing location submission</p>
            </div>
          </div>
          <div className="header-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={handleFactCheck}
              loading={checkingFacts}
            >
              🔍 Run Fact Check
            </Button>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          {/* Spot Information */}
          <div className="detail-card spot-info">
            <div className="card-header">
              <h2>Spot Information</h2>
              <div className={`spot-status status-${spot.status}`}>
                {spot.status.charAt(0).toUpperCase() + spot.status.slice(1)}
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
                  <span>{spot.location}</span>
                </div>
                {spot.best_time && (
                  <div className="meta-item">
                    <FaClock />
                    <span>Best Time: {spot.best_time}</span>
                  </div>
                )}
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>Created: {formatDate(spot.created_at)}</span>
                </div>
                <div className="meta-item">
                  <FaStar />
                  <span>Rating: {spot.rating}/5 ({spot.review_count || 0} reviews)</span>
                </div>
              </div>

              {spot.facilities && Array.isArray(spot.facilities) && spot.facilities.length > 0 && (
                <div className="spot-facilities">
                  <h4>Facilities</h4>
                  <div className="facilities-list">
                    {spot.facilities.map((facility, index) => (
                      <span key={index} className="facility-tag">{facility}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          {spot.image_urls && Array.isArray(spot.image_urls) && spot.image_urls.length > 0 && (
            <div className="detail-card photos-section">
              <div className="card-header">
                <h2><FaCamera /> Photos ({spot.image_urls.length})</h2>
              </div>
              <div className="card-content">
                <div className="photos-grid">
                  {spot.image_urls.map((url, index) => (
                    <div key={index} className="photo-item">
                      <img src={url} alt={`${spot.name} - Image ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submitter Information */}
          {spot.creator && (
            <div className="detail-card submitter-info">
              <div className="card-header">
                <h2>Submitter Information</h2>
              </div>
              <div className="card-content">
                <div className="submitter-profile">
                  <div className="submitter-avatar">
                    {(spot.creator.display_name || spot.creator.first_name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="submitter-details">
                    <div className="submitter-username">
                      {spot.creator.display_name || `${spot.creator.first_name} ${spot.creator.last_name}`}
                    </div>
                    <div className="submitter-id">User ID: {spot.creator.id}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fact Check Results */}
          {factCheckReport && (
            <div className="detail-card fact-check-section">
              <div className="card-header">
                <h2>Fact Check Report</h2>
                <div className={`credibility-badge credibility-${factCheckReport.credibilityLevel}`}>
                  {getCredibilityBadge(factCheckReport.credibilityLevel).icon}
                  <span>{factCheckReport.credibilityLevel.toUpperCase()}</span>
                </div>
              </div>
              <div className="card-content">
                <div className="fact-check-overview">
                  <div className="score-circle">
                    <div className="score-value">{factCheckReport.overallScore}</div>
                    <div className="score-label">Overall Score</div>
                  </div>
                  <div className="claims-summary">
                    <div className="claim-stat verified">
                      <FaCheckCircle />
                      <span>{factCheckReport.verifiedClaims} Verified</span>
                    </div>
                    <div className="claim-stat false">
                      <FaTimesCircle />
                      <span>{factCheckReport.falseClaiims} False</span>
                    </div>
                    <div className="claim-stat unverified">
                      <FaExclamationCircle />
                      <span>{factCheckReport.unverifiedClaims} Unverified</span>
                    </div>
                  </div>
                </div>

                {factCheckReport.warnings && factCheckReport.warnings.length > 0 && (
                  <div className="fact-check-warnings">
                    <h4>⚠️ Warnings</h4>
                    <ul>
                      {factCheckReport.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {factCheckReport.recommendations && factCheckReport.recommendations.length > 0 && (
                  <div className="fact-check-recommendations">
                    <h4>💡 Recommendations</h4>
                    <ul>
                      {factCheckReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {factCheckReport.claims && factCheckReport.claims.length > 0 && (
                  <div className="fact-check-claims">
                    <h4>📋 Detected Claims ({factCheckReport.claims.length})</h4>
                    {factCheckReport.claims.map((claim, index) => (
                      <div key={index} className={`claim-item rating-${claim.rating}`}>
                        <div className="claim-header">
                          <span className={`claim-rating ${claim.rating}`}>
                            {claim.rating.toUpperCase()}
                          </span>
                          <span className="claim-confidence">{claim.confidence}% confidence</span>
                        </div>
                        <div className="claim-text">{claim.claim}</div>
                        {claim.sources.length > 0 && (
                          <div className="claim-sources">
                            <strong>Sources:</strong>
                            {claim.sources.map((source, idx) => (
                              <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer">
                                {source.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-content">
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
              </div>
            </div>
          </div>

          {/* Moderation Info */}
          {spot.moderated_by && spot.moderator && (
            <div className="detail-card moderation-info">
              <div className="card-header">
                <h2>Moderation Info</h2>
              </div>
              <div className="card-content">
                <div className="moderation-details">
                  <div className="mod-item">
                    <span className="label">Moderated By:</span>
                    <span className="value">
                      {spot.moderator.display_name || `${spot.moderator.first_name} ${spot.moderator.last_name}`}
                    </span>
                  </div>
                  <div className="mod-item">
                    <span className="label">Moderated At:</span>
                    <span className="value">{formatDate(spot.moderated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="detail-card verification-status">
            <div className="card-header">
              <h2>Verification Status</h2>
            </div>
            <div className="card-content">
              <div className="verification-items">
                <div className={`verification-item ${spot.image_urls && spot.image_urls.length > 0 ? 'verified' : 'missing'}`}>
                  <FaCamera />
                  <span>Photos: {spot.image_urls && spot.image_urls.length > 0 ? `✓ (${spot.image_urls.length})` : '✗'}</span>
                </div>
                <div className={`verification-item ${spot.location ? 'verified' : 'missing'}`}>
                  <FaMapMarkerAlt />
                  <span>Location: {spot.location ? '✓' : '✗'}</span>
                </div>
                <div className={`verification-item ${spot.description ? 'verified' : 'missing'}`}>
                  <FaEye />
                  <span>Description: {spot.description ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fact Check Modal */}
      {showFactCheckModal && (
        <div className="fact-check-modal-overlay" onClick={closeFactCheckModal}>
          <div className="fact-check-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={closeFactCheckModal}
              aria-label="Close modal"
              title="Close"
            >
              <FaTimes />
            </button>

            {checkingFacts ? (
              <div className="modal-loading">
                <div className="loading-spinner"></div>
                <p>Analyzing spot description...</p>
              </div>
            ) : factCheckReport ? (
              <div className="fact-check-modal-body">
                <h2 className="modal-title">
                  <FaCheckCircle className="icon-check" />
                  Fact Check Results
                </h2>

                {/* Credibility Badge */}
                <div className={`credibility-badge ${
                  factCheckReport.overallScore >= 70 ? 'high' :
                  factCheckReport.overallScore >= 50 ? 'medium' : 'low'
                }`}>
                  {factCheckReport.overallScore >= 70 ? 'HIGH CREDIBILITY' :
                   factCheckReport.overallScore >= 50 ? 'MODERATE CREDIBILITY' : 'LOW CREDIBILITY'}
                </div>

                {/* Score Overview */}
                <div className="fact-check-overview">
                  <div className="score-circle">
                    <div className="score-value">{factCheckReport.overallScore}</div>
                    <div className="score-label">Credibility Score</div>
                  </div>

                  <div className="claims-summary">
                    <div className="claim-stat verified">
                      <FaCheckCircle />
                      <span>{factCheckReport.verifiedClaims} Verified</span>
                    </div>
                    <div className="claim-stat false">
                      <FaTimesCircle />
                      <span>{factCheckReport.falseClaiims} False</span>
                    </div>
                    <div className="claim-stat unverified">
                      <FaExclamationCircle />
                      <span>{factCheckReport.unverifiedClaims} Unverified</span>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {factCheckReport.warnings && factCheckReport.warnings.length > 0 && (
                  <div className="fact-check-warnings">
                    <h3><FaExclamationTriangle /> Warnings</h3>
                    <ul>
                      {factCheckReport.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {factCheckReport.recommendations && factCheckReport.recommendations.length > 0 && (
                  <div className="fact-check-recommendations">
                    <h3><FaInfoCircle /> Recommendations</h3>
                    <ul>
                      {factCheckReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Individual Claims */}
                {factCheckReport.claims && factCheckReport.claims.length > 0 && (
                  <div className="fact-check-claims">
                    <h3>Analyzed Claims ({factCheckReport.claims.length})</h3>
                    <div className="claims-list">
                      {factCheckReport.claims.map((claim, index) => (
                        <div key={index} className={`claim-item ${claim.rating.toLowerCase()}`}>
                          <div className="claim-header">
                            <span className="claim-number">#{index + 1}</span>
                            <span className={`claim-rating ${claim.rating.toLowerCase()}`}>
                              {claim.rating === 'true' && <FaCheckCircle />}
                              {claim.rating === 'false' && <FaTimesCircle />}
                              {claim.rating === 'mixture' && <FaExclamationCircle />}
                              {claim.rating === 'unverified' && <FaExclamationCircle />}
                              {claim.rating.toUpperCase()}
                            </span>
                          </div>
                          <p className="claim-text">{claim.claim}</p>
                          {claim.sources && claim.sources.length > 0 && (
                            <div className="claim-sources">
                              <strong>Sources:</strong>
                              {claim.sources.map((source, idx) => (
                                <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer">
                                  {source.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <p className="disclaimer">
                    <FaInfoCircle /> This analysis is automated and may not be 100% accurate. 
                    Manual verification is recommended for critical decisions.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap with Error Boundary for better error handling
const SpotsDetailsWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <SpotsDetails />
  </ErrorBoundary>
);

export default SpotsDetailsWithErrorBoundary;
