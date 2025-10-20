import { useState, useEffect } from 'react';
import { FaArrowLeft, FaBan, FaCheck, FaSearch, FaExclamationTriangle, FaUserGraduate, FaUserTie, FaFilter, FaUserShield, FaClipboardList, FaRedo } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/pages/moderator/ProfileModeration.scss';
import Button from '../../components/Button';
import applicationModerationService from '../../services/applicationModerationService';

interface ProfileReport {
  id: string;
  applicationId: number;
  userId: number;
  username: string;
  email: string;
  profileImage?: string;
  requestType: 'guide' | 'influencer';
  status: 'pending' | 'accepted' | 'rejected';
  accountCreated: Date;
  lastActive: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  currentRole?: string;
  requestedRole?: string;
  // Guide-specific
  expertiseAreas?: string[];
  experienceYears?: number;
  bio?: string;
  // Influencer-specific
  socialMediaLinks?: Record<string, string>;
  followersCount?: number;
}

export default function ProfileModeration() {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<ProfileReport[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('pending');
  const [typeFilter, setTypeFilter] = useState<'all' | 'guide' | 'influencer'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    guideCount: 0,
    influencerCount: 0,
    total: 0
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Handle notification from navigation state (from ProfileDetails)
  useEffect(() => {
    const state = location.state as { message?: string; type?: 'success' | 'error' } | null;
    if (state?.message) {
      setNotification({ message: state.message, type: state.type || 'success' });
      setTimeout(() => setNotification(null), 5000);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await applicationModerationService.getModerationApplications({
        status: filter,
        type: typeFilter,
        page: page,
        limit: 10
      });

      console.log('API Response:', response); // Debug log

      // Validate response structure
      if (!response || !response.data) {
        throw new Error('Invalid response structure from server');
      }

      if (response.success) {
        // Ensure applications array exists
        const applicationsArray = response.data.applications || [];
        
        // Transform API data to component format
        const transformedApplications: ProfileReport[] = applicationsArray.map(app => ({
          id: `${app.type}-${app.application_id}`,
          applicationId: app.application_id,
          userId: app.user_id || app.users?.id || 0,
          // Handle both joined users table and direct fields
          username: app.users 
            ? `${app.users.first_name || ''} ${app.users.last_name || ''}`.trim()
            : `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unknown',
          email: app.users?.email || app.email || 'No email',
          requestType: app.type,
          status: app.approve_application_status,
          accountCreated: new Date(app.submitted_at || Date.now()),
          lastActive: new Date(app.submitted_at || Date.now()),
          priority: getPriorityFromDate(app.submitted_at || new Date().toISOString()),
          currentRole: app.users?.role || 'user',
          requestedRole: app.type === 'guide' ? 'Guide' : 'Influencer',
          // Guide-specific
          expertiseAreas: app.expertise_areas || [],
          experienceYears: app.experience_years,
          bio: app.bio,
          // Influencer-specific
          socialMediaLinks: app.social_media_links,
          followersCount: app.followers_count
        }));

        setApplications(transformedApplications);
        setStats(response.data.stats || { guideCount: 0, influencerCount: 0, total: 0 });
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        throw new Error(response.message || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError((err as Error).message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine priority based on submission date
  const getPriorityFromDate = (submittedAt: string): 'low' | 'medium' | 'high' | 'critical' => {
    const daysSinceSubmission = Math.floor(
      (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceSubmission > 14) return 'critical';
    if (daysSinceSubmission > 7) return 'high';
    if (daysSinceSubmission > 3) return 'medium';
    return 'low';
  };

  // Fetch applications when filters change
  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, typeFilter, page]);

  const handleApproveApplication = async (application: ProfileReport) => {
    if (!window.confirm(`Are you sure you want to approve this ${application.requestType} application?`)) {
      return;
    }

    try {
      if (application.requestType === 'guide') {
        await applicationModerationService.approveGuideApplication(application.applicationId);
      } else {
        await applicationModerationService.approveInfluencerApplication(application.applicationId);
      }

      setNotification({
        message: `${application.requestType === 'guide' ? 'Guide' : 'Influencer'} application approved successfully!`,
        type: 'success'
      });
      setTimeout(() => setNotification(null), 5000);

      // Refresh the list
      fetchApplications();
    } catch (err) {
      console.error('Error approving application:', err);
      setNotification({
        message: (err as Error).message || 'Failed to approve application',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleRejectApplication = async (application: ProfileReport) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      if (application.requestType === 'guide') {
        await applicationModerationService.rejectGuideApplication(
          application.applicationId,
          reason || undefined
        );
      } else {
        await applicationModerationService.rejectInfluencerApplication(
          application.applicationId,
          reason || undefined
        );
      }

      setNotification({
        message: reason 
          ? `Application rejected: ${reason}`
          : 'Application rejected successfully',
        type: 'success'
      });
      setTimeout(() => setNotification(null), 5000);

      // Refresh the list
      fetchApplications();
    } catch (err) {
      console.error('Error rejecting application:', err);
      setNotification({
        message: (err as Error).message || 'Failed to reject application',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getRequestTypeLabel = (requestType: 'guide' | 'influencer') => {
    return requestType === 'guide' ? 'Guide Request' : 'Influencer Request';
  };

  if (loading && applications.length === 0) {
    return (
      <div className="profile-moderation">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-moderation">
      {/* Notification Banner */}
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button className="close-btn" onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <header className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation')}
            >
              Go back
            </Button>
            <div className="title-section">
              <h1>Application Moderation</h1>
              <p>Review and approve guide and influencer applications</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <FaUserGraduate className="stat-icon guide" />
              <span className="stat-number">{stats.guideCount}</span>
              <span className="stat-label">Guide Apps</span>
            </div>
            <div className="stat-card">
              <FaUserTie className="stat-icon influencer" />
              <span className="stat-number">{stats.influencerCount}</span>
              <span className="stat-label">Influencer Apps</span>
            </div>
            <div className="stat-card">
              <FaClipboardList className="stat-icon total" />
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-tabs">
          <label><FaFilter /> Status:</label>
          {['all', 'pending', 'accepted', 'rejected'].map(status => (
            <Button
              variant='primary'
              size='large'
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => {
                setFilter(status as typeof filter);
                setPage(1);
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="filter-tabs">
          <label><FaUserShield /> Type:</label>
          {['all', 'guide', 'influencer'].map(type => (
            <Button
              variant='primary'
              size='large'
              key={type}
              className={`filter-tab ${typeFilter === type ? 'active' : ''}`}
              onClick={() => {
                setTypeFilter(type as typeof typeFilter);
                setPage(1);
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h3>Failed to load applications</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchApplications}>
            <FaRedo /> Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!error && (
        <div className="moderation-content">
          {loading && applications.length === 0 ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <FaClipboardList className="empty-icon" />
              <h3>No applications found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="profiles-list">
              {filteredApplications.map(application => {
                const isGuide = application.requestType === 'guide';
                
                return (
                  <div
                    key={application.id}
                    className={`profile-item application-item ${application.requestType}`}
                    onClick={() => navigate(`/dashboard/moderation/profile/details/${application.id}`)}
                  >
                    <div className="profile-header">
                      <div className="user-info">
                        <div className={`avatar ${application.requestType}`}>
                          {isGuide ? <FaUserGraduate /> : <FaUserTie />}
                        </div>
                        <div className="user-details">
                          <h3 className="username">{application.username}</h3>
                          <p className="email">{application.email}</p>
                          <span className="user-id">ID: {application.userId}</span>
                          <div className="request-info">
                            <span className="current-role">{application.currentRole || 'User'}</span>
                            <span className="arrow">→</span>
                            <span className="requested-role">{application.requestedRole}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="status-badges">
                        <div className={`priority-badge priority-${application.priority}`}>
                          {application.priority.toUpperCase()}
                        </div>
                        <div className={`request-type-badge ${application.requestType}`}>
                          {getRequestTypeLabel(application.requestType)}
                        </div>
                        <div className={`status-indicator_1 status-${application.status}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="profile-content">
                      {/* Guide-specific fields */}
                      {isGuide && (
                        <div className="application-details">
                          {application.expertiseAreas && application.expertiseAreas.length > 0 && (
                            <div className="detail-item">
                              <strong>Expertise:</strong>
                              <div className="tags">
                                {application.expertiseAreas.map((area, index) => (
                                  <span key={index} className="tag">{area}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {application.experienceYears !== undefined && (
                            <div className="detail-item">
                              <strong>Experience:</strong> {application.experienceYears} years
                            </div>
                          )}
                          {application.bio && (
                            <div className="detail-item">
                              <strong>Bio:</strong> {application.bio.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Influencer-specific fields */}
                      {!isGuide && (
                        <div className="application-details">
                          {application.followersCount !== undefined && (
                            <div className="detail-item">
                              <strong>Followers:</strong> {application.followersCount.toLocaleString()}
                            </div>
                          )}
                          {application.socialMediaLinks && Object.keys(application.socialMediaLinks).length > 0 && (
                            <div className="detail-item">
                              <strong>Platforms:</strong>
                              <div className="tags">
                                {Object.keys(application.socialMediaLinks).map((platform, index) => (
                                  <span key={index} className="tag">{platform}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="activity-info">
                        <div className="activity-item">
                          <span className="label">Created:</span>
                          <span className="value">{new Date(application.accountCreated).toLocaleDateString()}</span>
                        </div>
                        <div className="activity-item">
                          <span className="label">Last Active:</span>
                          <span className="value">{new Date(application.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      {application.status === 'pending' && (
                        <>
                          <button
                            className="action-btn approve-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveApplication(application);
                            }}
                            title="Approve Application"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button
                            className="action-btn reject-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectApplication(application);
                            }}
                            title="Reject Application"
                          >
                            <FaBan /> Reject
                          </button>
                        </>
                      )}
                      {application.status === 'accepted' && (
                        <div className="status-message success">
                          <FaCheck /> Approved
                        </div>
                      )}
                      {application.status === 'rejected' && (
                        <div className="status-message rejected">
                          <FaBan /> Rejected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredApplications.length > 0 && totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <FaArrowLeft /> Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}