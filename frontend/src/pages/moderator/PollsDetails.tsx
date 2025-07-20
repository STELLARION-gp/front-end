import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { FaEye, FaThumbsUp, FaClock, FaFlag, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import '../../styles/moderator/PollsDetails.scss';

interface PollDetails {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  type: string;
  category: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'suspended' | 'expired';
  visibility: 'public' | 'private' | 'community';
  reports: Array<{
    id: string;
    reporterId: string;
    reporterUsername: string;
    reason: string;
    description: string;
    timestamp: string;
    status: 'pending' | 'reviewed' | 'dismissed';
  }>;
  threads: number;
  shares: number;
  engagement: {
    views: number;
    interactions: number;
    comments: number;
  };
  tags: string[];
  moderationHistory: Array<{
    id: string;
    action: string;
    moderator: string;
    timestamp: string;
    reason: string;
  }>;
}

const PollsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<PollDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchPollDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPoll: PollDetails = {
          id: id || '1',
          title: 'What\'s the best time for stargazing this weekend?',
          description: 'Planning a community stargazing event and want to know when most people would prefer to meet. Consider factors like moon phase, weather predictions, and personal schedules.',
          creator: {
            id: 'user123',
            username: 'AstroEnthusiast',
            avatar: '/default-avatar.png',
            verified: true
          },
          type: 'Multiple Choice',
          category: 'Community Events',
          options: [
            { id: 'opt1', text: 'Friday Evening (8-11 PM)', votes: 47, percentage: 35.3 },
            { id: 'opt2', text: 'Saturday Night (9 PM-12 AM)', votes: 62, percentage: 46.6 },
            { id: 'opt3', text: 'Sunday Early Morning (5-7 AM)', votes: 24, percentage: 18.1 }
          ],
          totalVotes: 133,
          createdAt: '2024-01-15T10:30:00Z',
          expiresAt: '2024-01-22T23:59:59Z',
          status: 'active',
          visibility: 'public',
          reports: [
            {
              id: 'rep1',
              reporterId: 'user456',
              reporterUsername: 'StarWatcher',
              reason: 'Inappropriate Content',
              description: 'The poll description contains misleading information about weather conditions.',
              timestamp: '2024-01-16T14:22:00Z',
              status: 'pending'
            }
          ],
          threads: 8,
          shares: 15,
          engagement: {
            views: 234,
            interactions: 156,
            comments: 23
          },
          tags: ['stargazing', 'community', 'weekend', 'astronomy'],
          moderationHistory: [
            {
              id: 'mod1',
              action: 'Reviewed',
              moderator: 'ModeratorAlpha',
              timestamp: '2024-01-16T09:15:00Z',
              reason: 'Routine content review'
            }
          ]
        };

        setPoll(mockPoll);
      } catch (error) {
        console.error('Error fetching poll details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPollDetails();
    }
  }, [id]);

  const handleAction = async (action: string) => {
    if (!poll) return;
    
    setActionLoading(action);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} poll:`, poll.id);
      
      // Update poll status based on action
      if (action === 'suspend') {
        setPoll(prev => prev ? { ...prev, status: 'suspended' } : null);
      }
      
      // Show success message
      alert(`Poll ${action}ed successfully!`);
      
    } catch (error) {
      console.error(`Error ${action}ing poll:`, error);
      alert(`Error ${action}ing poll. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="polls-details">
        <div className="details-header">
          <Button
            variant="border"
            size="small"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <h1>Loading Poll Details...</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="polls-details">
        <div className="details-header">
          <Button
            variant="border"
            size="small"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
          <h1>Poll Not Found</h1>
        </div>
        <div className="error-container">
          <p>The requested poll could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="polls-details">
      <div className="details-header">
        <Button
          variant="border"
          size="small"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        <h1>Poll Details</h1>
        <div className="header-actions">
          <Button
            variant="border"
            size="small"
          >
            👁 {poll.engagement.views} Views
          </Button>
        </div>
      </div>

      <div className="details-content">
        <div className="main-content">
          {/* Poll Information */}
          <div className="detail-card poll-info">
            <div className="card-header">
              <h2>Poll Information</h2>
              <div className={`poll-status ${poll.status}`}>
                {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
              </div>
            </div>
            <div className="card-content">
              <div className="poll-title">
                <h3>{poll.title}</h3>
              </div>
              <div className="poll-description">
                <p>{poll.description}</p>
              </div>
              
              <div className="poll-meta">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>Created: {formatDate(poll.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <FaClock />
                  <span>Expires: {formatDate(poll.expiresAt)}</span>
                </div>
                <div className="meta-item">
                  <FaUsers />
                  <span>Total Votes: {poll.totalVotes}</span>
                </div>
              </div>

              <div className="poll-tags">
                {poll.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Poll Options & Results */}
          <div className="detail-card poll-options">
            <div className="card-header">
              <h2>Poll Options & Results</h2>
            </div>
            <div className="card-content">
              <div className="options-list">
                {poll.options.map((option, index) => (
                  <div key={option.id} className="option-item">
                    <div className="option-header">
                      <span className="option-number">{index + 1}</span>
                      <span className="option-text">{option.text}</span>
                      <span className="option-percentage">{option.percentage}%</span>
                    </div>
                    <div className="option-bar">
                      <div 
                        className={`option-fill option-fill-${index}`}
                        data-percentage={option.percentage}
                      ></div>
                    </div>
                    <div className="option-votes">{option.votes} votes</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Creator Information */}
          <div className="detail-card creator-info">
            <div className="card-header">
              <h2>Creator Information</h2>
            </div>
            <div className="card-content">
              <div className="creator-profile">
                <img src={poll.creator.avatar} alt={poll.creator.username} className="creator-avatar" />
                <div className="creator-details">
                  <div className="creator-username">
                    {poll.creator.username}
                    {poll.creator.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="creator-id">ID: {poll.creator.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="detail-card engagement-stats">
            <div className="card-header">
              <h2>Engagement Statistics</h2>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <FaEye />
                  <div className="stat-value">{poll.engagement.views}</div>
                  <div className="stat-label">Views</div>
                </div>
                <div className="stat-item">
                  <FaThumbsUp />
                  <div className="stat-value">{poll.engagement.interactions}</div>
                  <div className="stat-label">Interactions</div>
                </div>
                <div className="stat-item">
                  <FaUsers />
                  <div className="stat-value">{poll.totalVotes}</div>
                  <div className="stat-label">Total Votes</div>
                </div>
                <div className="stat-item">
                  <FaFlag />
                  <div className="stat-value">{poll.threads}</div>
                  <div className="stat-label">Threads</div>
                </div>
              </div>
            </div>
          </div>
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
                  variant="warning"
                  size="small"
                  onClick={() => handleAction('suspend')}
                  loading={actionLoading === 'suspend'}
                  disabled={poll.status === 'suspended'}
                >
                  🚫 {poll.status === 'suspended' ? 'Suspended' : 'Suspend Poll'}
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleAction('delete')}
                  loading={actionLoading === 'delete'}
                >
                  🗑 Delete Poll
                </Button>
              </div>
            </div>
          </div>

          {/* Reports */}
          {poll.reports.length > 0 && (
            <div className="detail-card reports-section">
              <div className="card-header">
                <h2>Reports ({poll.reports.length})</h2>
              </div>
              <div className="card-content">
                <div className="reports-list">
                  {poll.reports.map(report => (
                    <div key={report.id} className="report-item">
                      <div className="report-header">
                        <span className="reporter">@{report.reporterUsername}</span>
                        <span className={`report-status ${report.status}`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="report-reason">{report.reason}</div>
                      <div className="report-description">{report.description}</div>
                      <div className="report-time">{formatDate(report.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Moderation History */}
          {poll.moderationHistory.length > 0 && (
            <div className="detail-card moderation-history">
              <div className="card-header">
                <h2>Moderation History</h2>
              </div>
              <div className="card-content">
                <div className="history-list">
                  {poll.moderationHistory.map(entry => (
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
        </div>
      </div>
    </div>
  );
};

export default PollsDetails;
