import { useState } from 'react';
import { FaArrowLeft, FaUser, FaBan, FaCheck, FaSearch, FaExclamationTriangle, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/ProfileModeration.scss';
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
    violations: 3
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
    violations: 7
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
    requestedRole: 'Guide'
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
    requestedRole: 'Influencer'
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
    priority: 'low'
  },
  {
    id: '6',
    userId: 'usr_303',
    username: 'WarnedUser',
    email: 'warned@example.com',
    status: 'warned',
    accountCreated: new Date('2023-09-10T11:00:00'),
    lastActive: new Date('2024-01-15T22:15:00'),
    priority: 'medium'
  },
  {
    id: '7',
    userId: 'usr_404',
    username: 'BannedUser',
    email: 'banned@example.com',
    status: 'banned',
    accountCreated: new Date('2023-08-05T16:00:00'),
    lastActive: new Date('2024-01-10T19:45:00'),
    priority: 'high'
  }
];

export default function ProfileModeration() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileReport[]>(mockProfiles);
  const [filter, setFilter] = useState<'all' | 'reported' | 'pending' | 'approved' | 'banned' | 'warned'>('reported');
  const [searchTerm, setSearchTerm] = useState('');

  const handleBanUser = (profileId: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === profileId ? { ...profile, status: 'banned' as const } : profile
      )
    );
  };

  const handleWarnUser = (profileId: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === profileId ? { ...profile, status: 'warned' as const } : profile
      )
    );
  };

  const handleApproveUser = (profileId: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === profileId ? { ...profile, status: 'approved' as const } : profile
      )
    );
  };

  const handleApproveRequest = (profileId: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === profileId ? { ...profile, status: 'approved' as const } : profile
      )
    );
  };

  const handleRejectRequest = (profileId: string) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.id === profileId ? { ...profile, status: 'warned' as const } : profile
      )
    );
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = filter === 'all' || profile.status === filter;
    const matchesSearch = profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRiskLevel = (violations: number = 0) => {
    if (violations >= 5) return { level: 'Critical Risk', color: '#ff4757' };
    if (violations >= 3) return { level: 'High Risk', color: '#ffa502' };
    if (violations >= 1) return { level: 'Medium Risk', color: '#f39c12' };
    return { level: 'Clean', color: '#2ed573' };
  };

  const getRequestTypeLabel = (requestType?: string) => {
    switch(requestType) {
      case 'learner-to-guide': return 'Guide Request';
      case 'learner-to-influencer': return 'Influencer Request';
      default: return 'Role Upgrade';
    }
  };

  return (
    <div className="profile-moderation">
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
              <h1>Profile Moderation</h1>
              <p>Review reported accounts and role upgrade requests</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{profiles.filter(p => p.status === 'reported').length}</span>
              <span className="stat-label">Reported</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{profiles.filter(p => p.status === 'pending').length}</span>
              <span className="stat-label">Requests</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredProfiles.length}</span>
              <span className="stat-label">Showing</span>
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
            placeholder="Search usernames or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['all', 'reported', 'pending', 'approved', 'warned', 'banned'].map(status => (
            <Button
              variant='primary'
              size='large'
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status as typeof filter)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="profiles-list">
          {filteredProfiles.map(profile => {
            const riskLevel = getRiskLevel(profile.violations);
            const isReported = profile.status === 'reported';
            const isRequest = profile.status === 'pending';
            
            return (
              <div
                key={profile.id}
                className={`profile-item ${isRequest ? 'request-item' : ''}`}
                onClick={() => navigate(`/dashboard/moderation/profile/details/${profile.id}`)}
              >
                <div className="profile-header">
                  <div className="user-info">
                    <div className="avatar">
                      {isRequest ? (
                        profile.requestType === 'learner-to-influencer' ? <FaUserTie /> : <FaUserGraduate />
                      ) : <FaUser />}
                    </div>
                    <div className="user-details">
                      <h3 className="username">{profile.username}</h3>
                      <p className="email">{profile.email}</p>
                      <span className="user-id">ID: {profile.userId}</span>
                      {isRequest && (
                        <div className="request-info">
                          <span className="current-role">{profile.currentRole}</span>
                          <span className="arrow">→</span>
                          <span className="requested-role">{profile.requestedRole}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="status-badges">
                    {isReported && (
                      <>
                        <div className={`priority-badge priority-${profile.priority}`}>
                          {profile.priority}
                        </div>
                        <div className={`risk-badge risk-${riskLevel.level.toLowerCase().replace(' ', '-')}`}>
                          {riskLevel.level}
                        </div>
                      </>
                    )}
                    {isRequest && (
                      <div className="request-type-badge">
                        {getRequestTypeLabel(profile.requestType)}
                      </div>
                    )}
                    <div className={`status-indicator status-${profile.status}`}>
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="profile-content">
                  {isReported && (
                    <>
                      <div className="violations-info">
                        <FaExclamationTriangle className="shield-icon" />
                        <span>{profile.violations} violation(s)</span>
                      </div>

                      <div className="report-summary">
                        <p><strong>Reports:</strong> {profile.reportedBy?.length} user(s)</p>
                        <div className="report-reasons">
                          {profile.reportReason?.map((reason, index) => (
                            <span key={index} className="reason-tag">{reason}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {isRequest && (
                    <div className="request-details">
                      <p><strong>Request Type:</strong> {getRequestTypeLabel(profile.requestType)}</p>
                      <p><strong>Current Role:</strong> {profile.currentRole}</p>
                      <p><strong>Requested Role:</strong> {profile.requestedRole}</p>
                    </div>
                  )}

                  <div className="activity-info">
                    <div className="activity-item">
                      <span className="label">Created:</span>
                      <span className="value">{profile.accountCreated.toLocaleDateString()}</span>
                    </div>
                    <div className="activity-item">
                      <span className="label">Last Active:</span>
                      <span className="value">{profile.lastActive.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  {isReported && profile.status === 'reported' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveUser(profile.id);
                        }}
                        title="Approve Profile"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn warn-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWarnUser(profile.id);
                        }}
                        title="Issue Warning"
                      >
                        <FaExclamationTriangle />
                      </button>
                      <button
                        className="action-btn ban-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBanUser(profile.id);
                        }}
                        title="Ban User"
                      >
                        <FaBan />
                      </button>
                    </>
                  )}
                  {isRequest && profile.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveRequest(profile.id);
                        }}
                        title="Approve Request"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn warn-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectRequest(profile.id);
                        }}
                        title="Reject Request"
                      >
                        <FaBan />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}