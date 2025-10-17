import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaBan, FaCheck, FaExclamationTriangle, FaClock, FaFlag, FaEnvelope, FaIdCard, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import '../../styles/pages/moderator/ProfileDetails.scss';
import Button from '../../components/Button';

interface ProfileReport {
  id: string;
  userId: string;
  username: string;
  email: string;
  profileImage?: string;
  reportedBy?: string[];
  reportReason?: string[];
  reportDetails?: string;
  requestType?: 'role-upgrade' | 'learner-to-guide' | 'learner-to-influencer';
  status: 'reported' | 'pending' | 'approved' | 'banned' | 'warned';
  accountCreated: Date;
  lastActive: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  violations?: number;
  currentRole?: string;
  requestedRole?: string;
  totalPosts?: number;
  totalComments?: number;
  joinedCommunities?: string[];
  reputation?: number;
}

const mockProfiles: ProfileReport[] = [
  // Reported accounts
  {
    id: '1',
    userId: 'usr_123',
    username: 'SpamBot42',
    email: 'spam@example.com',
    reportedBy: ['User789', 'StarGazer01'],
    reportReason: ['Spam', 'Fake account'],
    reportDetails: 'This account has been posting spam comments and appears to be automated.',
    status: 'reported',
    accountCreated: new Date('2024-01-10T08:00:00'),
    lastActive: new Date('2024-01-15T14:30:00'),
    priority: 'high',
    violations: 3,
    totalPosts: 42,
    totalComments: 156,
    joinedCommunities: ['Astronomy Lovers', 'Space Explorers'],
    reputation: -15
  },
  {
    id: '2',
    userId: 'usr_456',
    username: 'ToxicCommenter',
    email: 'toxic@example.com',
    reportedBy: ['CommunityMod', 'NightWatcher'],
    reportReason: ['Harassment', 'Inappropriate behavior'],
    reportDetails: 'User has been harassing other members in astronomy discussions.',
    status: 'reported',
    accountCreated: new Date('2023-12-15T10:00:00'),
    lastActive: new Date('2024-01-15T16:45:00'),
    priority: 'critical',
    violations: 7,
    totalPosts: 12,
    totalComments: 89,
    joinedCommunities: ['Cosmic Discussions', 'Telescope Enthusiasts'],
    reputation: -32
  },
  // Role upgrade requests
  {
    id: '3',
    userId: 'usr_789',
    username: 'AstroLearner',
    email: 'learner@example.com',
    status: 'pending',
    accountCreated: new Date('2024-01-05T12:00:00'),
    lastActive: new Date('2024-01-14T20:15:00'),
    priority: 'low',
    requestType: 'learner-to-guide',
    currentRole: 'Learner',
    requestedRole: 'Guide',
    totalPosts: 24,
    totalComments: 112,
    joinedCommunities: ['Beginner Astronomers', 'Stargazing 101'],
    reputation: 45
  },
  {
    id: '4',
    userId: 'usr_101',
    username: 'CosmicExplorer',
    email: 'explorer@example.com',
    status: 'pending',
    accountCreated: new Date('2023-11-20T09:00:00'),
    lastActive: new Date('2024-01-16T11:20:00'),
    priority: 'medium',
    requestType: 'learner-to-influencer',
    currentRole: 'Learner',
    requestedRole: 'Influencer',
    totalPosts: 56,
    totalComments: 203,
    joinedCommunities: ['Deep Space', 'Astrophotography'],
    reputation: 78
  },
  // Previously handled cases
  {
    id: '5',
    userId: 'usr_202',
    username: 'ApprovedUser',
    email: 'approved@example.com',
    status: 'approved',
    accountCreated: new Date('2023-10-15T14:00:00'),
    lastActive: new Date('2024-01-16T18:30:00'),
    priority: 'low',
    totalPosts: 32,
    totalComments: 145,
    joinedCommunities: ['Space Photography', 'Telescope Reviews'],
    reputation: 56
  },
  {
    id: '6',
    userId: 'usr_303',
    username: 'WarnedUser',
    email: 'warned@example.com',
    status: 'warned',
    accountCreated: new Date('2023-09-10T11:00:00'),
    lastActive: new Date('2024-01-15T22:15:00'),
    priority: 'medium',
    totalPosts: 18,
    totalComments: 67,
    joinedCommunities: ['Amateur Astronomers', 'Night Sky'],
    reputation: 12
  },
  {
    id: '7',
    userId: 'usr_404',
    username: 'BannedUser',
    email: 'banned@example.com',
    status: 'banned',
    accountCreated: new Date('2023-08-05T16:00:00'),
    lastActive: new Date('2024-01-10T19:45:00'),
    priority: 'high',
    totalPosts: 5,
    totalComments: 23,
    joinedCommunities: ['Space Debates', 'Cosmic Theories'],
    reputation: -8
  }
];

export default function ProfileDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProfile = mockProfiles.find(item => item.id === id);
      setProfile(foundProfile || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApprove = () => {
    if (profile) {
      setProfile({ ...profile, status: 'approved' });
      // In real app, would make API call here
    }
  };

  const handleWarn = () => {
    if (profile) {
      setProfile({ ...profile, status: 'warned' });
      // In real app, would make API call here
    }
  };

  const handleBan = () => {
    if (profile) {
      setProfile({ ...profile, status: 'banned' });
      // In real app, would make API call here
    }
  };

  const handleApproveRequest = () => {
    if (profile) {
      setProfile({ ...profile, status: 'approved' });
      // In real app, would make API call here
    }
  };

  const handleRejectRequest = () => {
    if (profile) {
      setProfile({ ...profile, status: 'warned' });
      // In real app, would make API call here
    }
  };

  const getRiskLevel = (violations: number = 0) => {
    if (violations >= 5) return { level: 'Critical Risk', class: 'critical' };
    if (violations >= 3) return { level: 'High Risk', class: 'high-risk' };
    if (violations >= 1) return { level: 'Medium Risk', class: 'medium-risk' };
    return { level: 'Clean', class: 'clean' };
  };

  const getRequestTypeLabel = (requestType?: string) => {
    switch(requestType) {
      case 'learner-to-guide': return 'Guide Request';
      case 'learner-to-influencer': return 'Influencer Request';
      default: return 'Role Upgrade';
    }
  };

  if (loading) {
    return (
      <div className="profile-details">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-details">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h2>Profile Not Found</h2>
          <p>The requested profile could not be found.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/moderation/profile')}
          >
            Back to Profile Moderation
          </Button>
        </div>
      </div>
    );
  }

  const riskLevel = getRiskLevel(profile.violations);
  const isReported = profile.status === 'reported';
  const isRequest = profile.status === 'pending';

  return (
    <div className="profile-details">
      {/* Header */}
      <header className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation/profile')}
            >
              Back to Profile List
            </Button>
            <div className="title-section">
              <h1>
                {isRequest ? 'Role Upgrade Request' : 'Profile Report Details'}
              </h1>
              <p>
                {isRequest ? 'Review and process this role request' : 'Review and moderate this user profile'}
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            {isReported && (
              <>
                <Button
                  variant="success"
                  size="medium"
                  icon={<FaCheck />}
                  iconPosition="left"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="warning"
                  size="medium"
                  icon={<FaExclamationTriangle />}
                  iconPosition="left"
                  onClick={handleWarn}
                >
                  Warn
                </Button>
                <Button
                  variant="danger"
                  size="medium"
                  icon={<FaBan />}
                  iconPosition="left"
                  onClick={handleBan}
                >
                  Ban
                </Button>
              </>
            )}
            {isRequest && (
              <>
                <Button
                  variant="success"
                  size="medium"
                  icon={<FaCheck />}
                  iconPosition="left"
                  onClick={handleApproveRequest}
                >
                  Approve Request
                </Button>
                <Button
                  variant="danger"
                  size="medium"
                  icon={<FaBan />}
                  iconPosition="left"
                  onClick={handleRejectRequest}
                >
                  Reject Request
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="details-content">
        <div className={`profile-card ${isRequest ? 'request-card' : ''}`}>
          {/* Profile Header */}
          <div className="profile-header">
            <div className="user-section">
              <div className="avatar-large">
                {isRequest ? (
                  profile.requestType === 'learner-to-influencer' ? <FaUserTie /> : <FaUserGraduate />
                ) : <FaUser />}
              </div>
              <div className="user-info">
                <h2 className="username">{profile.username}</h2>
                <div className="user-meta">
                  <span className="email">
                    <FaEnvelope className="meta-icon" />
                    {profile.email}
                  </span>
                  <span className="user-id">
                    <FaIdCard className="meta-icon" />
                    ID: {profile.userId}
                  </span>
                  {isRequest && (
                    <div className="request-info">
                      <span className="current-role">{profile.currentRole}</span>
                      <span className="arrow">→</span>
                      <span className="requested-role">{profile.requestedRole}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="status-section">
              <div className={`priority-badge priority-${profile.priority}`}>
                {profile.priority} priority
              </div>
              {isReported && (
                <div className={`risk-badge ${riskLevel.class}`}>
                  {riskLevel.level}
                </div>
              )}
              {isRequest && (
                <div className="request-type-badge">
                  {getRequestTypeLabel(profile.requestType)}
                </div>
              )}
              <div className={`status-badge status-${profile.status}`}>
                {profile.status}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="info-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Account Created</div>
                <div className="info-value">
                  <FaClock className="info-icon" />
                  {profile.accountCreated.toLocaleString()}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Last Active</div>
                <div className="info-value">
                  <FaClock className="info-icon" />
                  {profile.lastActive.toLocaleString()}
                </div>
              </div>
              {isReported && (
                <div className="info-item">
                  <div className="info-label">Total Violations</div>
                  <div className={`info-value violations-count ${riskLevel.class}`}>
                    <FaExclamationTriangle className="info-icon" />
                    {profile.violations} ({riskLevel.level})
                  </div>
                </div>
              )}
              {profile.reputation !== undefined && (
                <div className="info-item">
                  <div className="info-label">Reputation Score</div>
                  <div className={`info-value reputation ${profile.reputation < 0 ? 'negative' : 'positive'}`}>
                    {profile.reputation}
                  </div>
                </div>
              )}
              {isRequest && (
                <div className="info-item">
                  <div className="info-label">Request Type</div>
                  <div className="info-value">
                    {getRequestTypeLabel(profile.requestType)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="activity-section">
            <h3>Activity Statistics</h3>
            <div className="activity-grid">
              <div className="activity-stat">
                <span className="stat-number">{profile.totalPosts || 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="activity-stat">
                <span className="stat-number">{profile.totalComments || 0}</span>
                <span className="stat-label">Comments</span>
              </div>
              <div className="activity-stat">
                <span className="stat-number">{profile.joinedCommunities?.length || 0}</span>
                <span className="stat-label">Communities</span>
              </div>
            </div>
            {profile.joinedCommunities && profile.joinedCommunities.length > 0 && (
              <div className="communities-list">
                <h4>Joined Communities</h4>
                <div className="community-tags">
                  {profile.joinedCommunities.map((community, index) => (
                    <span key={index} className="community-tag">{community}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reports Section - Only for reported profiles */}
          {isReported && (
            <div className="reports-section">
              <h3>
                <FaFlag className="section-icon" />
                Report Details ({profile.reportedBy?.length || 0} reports)
              </h3>
              
              <div className="report-content">
                <div className="reporters-section">
                  <h4>Reported by:</h4>
                  <div className="reporters-list">
                    {profile.reportedBy?.map((reporter, index) => (
                      <span key={index} className="reporter-tag">{reporter}</span>
                    ))}
                  </div>
                </div>

                <div className="reasons-section">
                  <h4>Report reasons:</h4>
                  <div className="reason-tags">
                    {profile.reportReason?.map((reason, index) => (
                      <span key={index} className="reason-tag">{reason}</span>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h4>Report details:</h4>
                  <div className="report-text">{profile.reportDetails}</div>
                </div>
              </div>
            </div>
          )}

          {/* Request Details - Only for role requests */}
          {isRequest && (
            <div className="request-section">
              <h3>
                <FaUser className="section-icon" />
                Role Upgrade Request Details
              </h3>
              <div className="request-content">
                <div className="request-info-item">
                  <h4>Current Role:</h4>
                  <p>{profile.currentRole}</p>
                </div>
                <div className="request-info-item">
                  <h4>Requested Role:</h4>
                  <p>{profile.requestedRole}</p>
                </div>
                <div className="request-info-item">
                  <h4>Request Type:</h4>
                  <p>{getRequestTypeLabel(profile.requestType)}</p>
                </div>
                <div className="request-info-item">
                  <h4>Request Justification:</h4>
                  <div className="request-text">
                    This user has demonstrated consistent positive contributions to the community and meets all requirements for the requested role.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-section">
            {isReported && (
              <>
                <Button
                  variant="success"
                  size="large"
                  icon={<FaCheck />}
                  iconPosition="left"
                  onClick={handleApprove}
                >
                  Approve Profile
                </Button>
                <Button
                  variant="warning"
                  size="large"
                  icon={<FaExclamationTriangle />}
                  iconPosition="left"
                  onClick={handleWarn}
                >
                  Issue Warning
                </Button>
                <Button
                  variant="danger"
                  size="large"
                  icon={<FaBan />}
                  iconPosition="left"
                  onClick={handleBan}
                >
                  Ban User
                </Button>
              </>
            )}
            {isRequest && (
              <>
                <Button
                  variant="success"
                  size="large"
                  icon={<FaCheck />}
                  iconPosition="left"
                  onClick={handleApproveRequest}
                >
                  Approve Request
                </Button>
                <Button
                  variant="danger"
                  size="large"
                  icon={<FaBan />}
                  iconPosition="left"
                  onClick={handleRejectRequest}
                >
                  Reject Request
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}