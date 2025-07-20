import { useState } from 'react';
import { FaArrowLeft, FaUser, FaBan, FaCheck, FaTimes, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/ProfileModeration.scss';
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
}

const mockProfiles: ProfileReport[] = [
  {
    id: '1',
    userId: 'usr_123',
    username: 'SpamBot42',
    email: 'spam@example.com',
    reportedBy: ['User789', 'StarGazer01'],
    reportReason: ['Spam', 'Fake account'],
    reportDetails: 'This account has been posting spam comments and appears to be automated.',
    status: 'pending',
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
    status: 'pending',
    accountCreated: new Date('2023-12-15T10:00:00'),
    lastActive: new Date('2024-01-15T16:45:00'),
    priority: 'critical',
    violations: 7
  },
  {
    id: '3',
    userId: 'usr_789',
    username: 'FakePhotographer',
    email: 'fake@example.com',
    reportedBy: ['PhotoExpert'],
    reportReason: ['Copyright violation', 'Stolen content'],
    reportDetails: 'Profile contains stolen astrophotography images without attribution.',
    status: 'pending',
    accountCreated: new Date('2024-01-05T12:00:00'),
    lastActive: new Date('2024-01-14T20:15:00'),
    priority: 'medium',
    violations: 2
  }
];

export default function ProfileModeration() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileReport[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<ProfileReport | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'banned' | 'warned'>('pending');
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

  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = filter === 'all' || profile.status === filter;
    const matchesSearch = profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRiskLevel = (violations: number) => {
    if (violations >= 5) return { level: 'High Risk', color: '#ff4757' };
    if (violations >= 3) return { level: 'Medium Risk', color: '#ffa502' };
    if (violations >= 1) return { level: 'Low Risk', color: '#f39c12' };
    return { level: 'Clean', color: '#2ed573' };
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
              <p>Review user profiles and handle violations</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{filteredProfiles.filter(p => p.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredProfiles.filter(p => p.status === 'banned').length}</span>
              <span className="stat-label">Banned</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredProfiles.length}</span>
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
            placeholder="Search usernames or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'warned', 'banned'].map(status => (
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
            
            return (
              <div
                key={profile.id}
                className={`profile-item ${selectedProfile?.id === profile.id ? 'selected' : ''}`}
                onClick={() => setSelectedProfile(profile)}
              >
                <div className="profile-header">
                  <div className="user-info">
                    <div className="avatar">
                      <FaUser />
                    </div>
                    <div className="user-details">
                      <h3 className="username">{profile.username}</h3>
                      <p className="email">{profile.email}</p>
                      <span className="user-id">ID: {profile.userId}</span>
                    </div>
                  </div>
                  
                  <div className="status-badges">
                    <div 
                      className={`priority-badge priority-${profile.priority}`}
                    >
                      {profile.priority}
                    </div>
                    <div 
                      className={`risk-badge risk-${riskLevel.level.toLowerCase().replace(' ', '-')}`}
                    >
                      {riskLevel.level}
                    </div>
                    <div 
                      className={`status-indicator status-${profile.status}`}
                    >
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="profile-content">
                  <div className="violations-info">
                    <FaExclamationTriangle className="shield-icon" />
                    <span>{profile.violations} violation(s)</span>
                  </div>

                  <div className="report-summary">
                    <p><strong>Reports:</strong> {profile.reportedBy.length} user(s)</p>
                    <div className="report-reasons">
                      {profile.reportReason.map((reason, index) => (
                        <span key={index} className="reason-tag">{reason}</span>
                      ))}
                    </div>
                  </div>

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
                  {profile.status === 'pending' && (
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedProfile && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>Profile Details</h3>
              <button 
                className="close-panel"
                onClick={() => setSelectedProfile(null)}
                title="Close Panel"
              >
                <FaTimes />
              </button>
            </div>

            <div className="panel-content">
              <div className="detail-section">
                <h4>User Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Username:</label>
                    <span>{selectedProfile.username}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedProfile.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span>{selectedProfile.userId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Account Created:</label>
                    <span>{selectedProfile.accountCreated.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Active:</label>
                    <span>{selectedProfile.lastActive.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Violations:</label>
                    <span 
                      className={`violations-count risk-${getRiskLevel(selectedProfile.violations).level.toLowerCase()}`}
                    >
                      {selectedProfile.violations} ({getRiskLevel(selectedProfile.violations).level})
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Report Details</h4>
                <div className="report-content">
                  <div className="reporters">
                    <strong>Reported by:</strong> {selectedProfile.reportedBy.join(', ')}
                  </div>
                  <div className="reasons">
                    <strong>Reasons:</strong>
                    <div className="reasons-list">
                      {selectedProfile.reportReason.map((reason, index) => (
                        <span key={index} className="reason-chip">{reason}</span>
                      ))}
                    </div>
                  </div>
                  <div className="details">
                    <strong>Details:</strong>
                    <p className="report-text">{selectedProfile.reportDetails}</p>
                  </div>
                </div>
              </div>

              {selectedProfile.status === 'pending' && (
                <div className="panel-actions">
                  <button
                    className="panel-btn approve"
                    onClick={() => handleApproveUser(selectedProfile.id)}
                  >
                    <FaCheck />
                    Approve Profile
                  </button>
                  <button
                    className="panel-btn warn"
                    onClick={() => handleWarnUser(selectedProfile.id)}
                  >
                    <FaExclamationTriangle />
                    Issue Warning
                  </button>
                  <button
                    className="panel-btn ban"
                    onClick={() => handleBanUser(selectedProfile.id)}
                  >
                    <FaBan />
                    Ban User
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
