import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaBan, FaCheck, FaExclamationTriangle, FaFlag, FaEnvelope, FaIdCard } from 'react-icons/fa';
import '../../styles/pages/moderator/ProfileDetails.scss';
import Button from '../../components/Button';

interface ProfileReport {
  id: string;
  userId: string;
  username: string;
  email: string;
  profileImage?: string;
  reportedBy: string[];
  reportReason: string[];
  reportDetails: string;
  status: 'pending' | 'approved' | 'banned' | 'warned';
  accountCreated: Date;
  lastActive: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  violations: number;
  joinedCommunities?: string[];
  totalPosts?: number;
  totalComments?: number;
  reputation?: number;
}

// Mock data - in real app this would come from API
const mockProfiles: ProfileReport[] = [
  {
    id: '1',
    userId: 'usr_123',
    username: 'SpamBot42',
    email: 'spam@example.com',
    reportedBy: ['User789', 'StarGazer01'],
    reportReason: ['Spam', 'Fake account'],
    reportDetails: 'This account has been posting spam comments and appears to be automated. Multiple users have reported suspicious behavior including repetitive messages and bot-like posting patterns.',
    status: 'pending',
    accountCreated: new Date('2024-01-10T08:00:00'),
    lastActive: new Date('2024-01-15T14:30:00'),
    priority: 'high',
    violations: 3,
    joinedCommunities: ['Astrophotography', 'Deep Sky Objects'],
    totalPosts: 45,
    totalComments: 128,
    reputation: -15
  },
  {
    id: '2',
    userId: 'usr_456',
    username: 'ToxicCommenter',
    email: 'toxic@example.com',
    reportedBy: ['CommunityMod', 'NightWatcher'],
    reportReason: ['Harassment', 'Inappropriate behavior'],
    reportDetails: 'User has been harassing other members in astronomy discussions, using offensive language and making personal attacks.',
    status: 'pending',
    accountCreated: new Date('2023-12-15T10:00:00'),
    lastActive: new Date('2024-01-15T16:45:00'),
    priority: 'critical',
    violations: 7,
    joinedCommunities: ['General Discussion', 'Equipment Reviews'],
    totalPosts: 23,
    totalComments: 156,
    reputation: -42
  },
  {
    id: '3',
    userId: 'usr_789',
    username: 'FakePhotographer',
    email: 'fake@example.com',
    reportedBy: ['PhotoExpert'],
    reportReason: ['Copyright violation', 'Stolen content'],
    reportDetails: 'Profile contains stolen astrophotography images without attribution. Claims ownership of professional astronomical photographs.',
    status: 'pending',
    accountCreated: new Date('2024-01-05T12:00:00'),
    lastActive: new Date('2024-01-14T20:15:00'),
    priority: 'medium',
    violations: 2,
    joinedCommunities: ['Astrophotography', 'Image Sharing'],
    totalPosts: 12,
    totalComments: 34,
    reputation: 8
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

  const getRiskLevel = (violations: number) => {
    if (violations >= 5) return { level: 'High Risk', color: '#ff4757', class: 'high-risk' };
    if (violations >= 3) return { level: 'Medium Risk', color: '#ffa502', class: 'medium-risk' };
    if (violations >= 1) return { level: 'Low Risk', color: '#f39c12', class: 'low-risk' };
    return { level: 'Clean', color: '#2ed573', class: 'clean' };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1>Profile Report Details</h1>
              <p>Review and moderate this user profile</p>
            </div>
          </div>
          
          <div className="header-actions">
            {profile.status === 'pending' && (
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="details-content">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-type">
              <span className="type-icon"><FaUser /></span>
              <span className="type-label">User Profile</span>
            </div>
            <div className="profile-status">
              <div className={`priority-badge priority-${profile.priority}`}>
                {profile.priority} priority
              </div>
              <div className={`risk-badge ${riskLevel.class}`}>
                {riskLevel.level}
              </div>
              <div className={`status-badge status-${profile.status}`}>
                {profile.status}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="user-section">
            <div className="user-info">
              <div className="avatar-large">
                <FaUser />
              </div>
              <div className="user-details">
                <div className="username">
                  {profile.username}
                </div>
                <div className="user-meta">
                  <span className="email">
                    <FaEnvelope className="meta-icon" />
                    {profile.email}
                  </span>
                  <span className="user-id">
                    <FaIdCard className="meta-icon" />
                    ID: {profile.userId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="account-metadata">
            <h3>Account Information</h3>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-value">{formatDate(profile.accountCreated)}</span>
                <span className="metadata-label">Account Created</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-value">{formatDate(profile.lastActive)}</span>
                <span className="metadata-label">Last Active</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-value">{profile.violations}</span>
                <span className="metadata-label">Violations</span>
              </div>
              {profile.reputation !== undefined && (
                <div className="metadata-item">
                  <span className={`metadata-value ${profile.reputation < 0 ? 'negative' : 'positive'}`}>
                    {profile.reputation}
                  </span>
                  <span className="metadata-label">Reputation</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Statistics */}
          {(profile.totalPosts || profile.totalComments || profile.joinedCommunities) && (
            <div className="activity-metadata">
              <h3>Activity Statistics</h3>
              <div className="activity-grid">
                {profile.totalPosts !== undefined && (
                  <div className="activity-stat">
                    <span className="stat-number">{profile.totalPosts}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                )}
                {profile.totalComments !== undefined && (
                  <div className="activity-stat">
                    <span className="stat-number">{profile.totalComments}</span>
                    <span className="stat-label">Comments</span>
                  </div>
                )}
                {profile.joinedCommunities && (
                  <div className="activity-stat">
                    <span className="stat-number">{profile.joinedCommunities.length}</span>
                    <span className="stat-label">Communities</span>
                  </div>
                )}
              </div>
              {profile.joinedCommunities && (
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
          )}

          {/* Reports Section */}
          <div className="reports-section">
            <h3>
              <FaFlag className="flag-icon" />
              Report Details ({profile.reportedBy.length} reports)
            </h3>
            
            <div className="report-details">
              <div className="reporters">
                <h4>Reported by:</h4>
                <ul>
                  {profile.reportedBy.map((reporter, index) => (
                    <li key={index}>{reporter}</li>
                  ))}
                </ul>
              </div>

              <div className="reasons">
                <h4>Report reasons:</h4>
                <div className="reason-tags">
                  {profile.reportReason.map((reason, index) => (
                    <span key={index} className="reason-tag">{reason}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="report-description">
              <h4>Report details:</h4>
              <div className="report-text">{profile.reportDetails}</div>
            </div>
          </div>

          {/* Action Buttons */}
          {profile.status === 'pending' && (
            <div className="action-section">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
