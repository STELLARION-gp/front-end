import React, { useState } from 'react';
import { FaArrowLeft, FaSearch, FaCheck, FaTimes, FaExclamationTriangle, FaThumbsUp, FaComments, FaPoll } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/PollsModeration.scss';

interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  type: 'poll' | 'vote' | 'thread';
  category: string;
  options?: string[];
  votes?: { [option: string]: number };
  totalVotes: number;
  comments: number;
  status: 'active' | 'closed' | 'reported' | 'suspended';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  endsAt?: string;
  isAnonymous: boolean;
  allowMultipleVotes: boolean;
  reports?: {
    count: number;
    reasons: string[];
    details: string;
  };
  moderatorNotes?: string;
  tags: string[];
  engagement: {
    views: number;
    interactions: number;
    shares: number;
  };
}

const PollsModeration: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  // Mock data for polls, votes, and threads
  const [polls] = useState<Poll[]>([
    {
      id: 'poll_001',
      title: 'Best Programming Language for Beginners',
      description: 'What programming language would you recommend for someone just starting their coding journey?',
      createdBy: {
        id: 'user_001',
        username: 'CodeTeacher',
        email: 'codeteacher@example.com',
        avatar: 'CT'
      },
      type: 'poll',
      category: 'Education',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      votes: { 'Python': 45, 'JavaScript': 32, 'Java': 18, 'C++': 12 },
      totalVotes: 107,
      comments: 23,
      status: 'active',
      priority: 'medium',
      createdAt: '2024-01-10T14:30:00Z',
      endsAt: '2024-01-17T14:30:00Z',
      isAnonymous: false,
      allowMultipleVotes: false,
      tags: ['Programming', 'Education', 'Beginners'],
      engagement: {
        views: 245,
        interactions: 130,
        shares: 8
      }
    },
    {
      id: 'thread_001',
      title: 'Inappropriate Political Discussion',
      description: 'Discussion thread that has deviated into inappropriate political content and personal attacks.',
      createdBy: {
        id: 'user_002',
        username: 'DebateUser',
        email: 'debateuser@example.com',
        avatar: 'DU'
      },
      type: 'thread',
      category: 'General Discussion',
      totalVotes: 0,
      comments: 89,
      status: 'reported',
      priority: 'high',
      createdAt: '2024-01-08T09:15:00Z',
      isAnonymous: false,
      allowMultipleVotes: false,
      reports: {
        count: 12,
        reasons: ['Political content', 'Personal attacks', 'Off-topic'],
        details: 'Thread started as astronomy discussion but devolved into political arguments with personal attacks on members.'
      },
      tags: ['Discussion', 'Astronomy'],
      engagement: {
        views: 456,
        interactions: 101,
        shares: 2
      }
    },
    {
      id: 'vote_001',
      title: 'Community Event Venue Selection',
      description: 'Vote for the preferred venue for our upcoming stargazing meetup.',
      createdBy: {
        id: 'user_003',
        username: 'EventOrganizer',
        email: 'events@example.com',
        avatar: 'EO'
      },
      type: 'vote',
      category: 'Events',
      options: ['City Observatory', 'Mountain Peak', 'Desert Location', 'Beach Area'],
      votes: { 'City Observatory': 23, 'Mountain Peak': 31, 'Desert Location': 15, 'Beach Area': 19 },
      totalVotes: 88,
      comments: 15,
      status: 'active',
      priority: 'low',
      createdAt: '2024-01-12T11:00:00Z',
      endsAt: '2024-01-15T23:59:00Z',
      isAnonymous: true,
      allowMultipleVotes: false,
      tags: ['Events', 'Stargazing', 'Community'],
      engagement: {
        views: 178,
        interactions: 103,
        shares: 5
      }
    },
    {
      id: 'poll_002',
      title: 'Spam Poll About Cryptocurrency',
      description: 'Promotional poll trying to advertise cryptocurrency trading platform.',
      createdBy: {
        id: 'user_004',
        username: 'CryptoSpammer',
        email: 'spammer@fake.com',
        avatar: 'CS'
      },
      type: 'poll',
      category: 'Finance',
      options: ['Buy now', 'Invest more', 'Join platform', 'Get rich quick'],
      votes: { 'Buy now': 2, 'Invest more': 1, 'Join platform': 0, 'Get rich quick': 1 },
      totalVotes: 4,
      comments: 0,
      status: 'suspended',
      priority: 'high',
      createdAt: '2024-01-13T16:45:00Z',
      isAnonymous: false,
      allowMultipleVotes: true,
      reports: {
        count: 8,
        reasons: ['Spam', 'Commercial promotion', 'Inappropriate content'],
        details: 'Clear spam attempting to promote cryptocurrency trading platform.'
      },
      moderatorNotes: 'Suspended for spam. User flagged for review.',
      tags: ['Cryptocurrency', 'Trading'],
      engagement: {
        views: 67,
        interactions: 12,
        shares: 0
      }
    }
  ]);

  const handleApprove = (pollId: string) => {
    console.log('Approving poll:', pollId);
    // Implementation would update poll status
  };

  const handleSuspend = (pollId: string) => {
    console.log('Suspending poll:', pollId);
    // Implementation would update poll status
  };

  const handleDelete = (pollId: string) => {
    console.log('Deleting poll:', pollId);
    // Implementation would delete poll
  };

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.createdBy.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poll.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'polls' && poll.type === 'poll') ||
                         (selectedFilter === 'votes' && poll.type === 'vote') ||
                         (selectedFilter === 'threads' && poll.type === 'thread') ||
                         poll.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'poll': return <FaPoll />;
      case 'vote': return <FaThumbsUp />;
      case 'thread': return <FaComments />;
      default: return <FaPoll />;
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

  const getEngagementRate = (poll: Poll) => {
    return poll.engagement.views > 0 
      ? Math.round((poll.engagement.interactions / poll.engagement.views) * 100)
      : 0;
  };

  return (
    <div className="polls-moderation">
      {/* Header */}
      <div className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/moderator')} title="Back to Moderation Dashboard">
              <FaArrowLeft />
            </button>
            <div className="title-section">
              <h1>Polls, Votes & Threads Moderation</h1>
              <p>Manage community polls, voting, and discussion threads</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.status === 'reported').length}</span>
              <span className="stat-label">Reported</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.status === 'active').length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.priority === 'high').length}</span>
              <span className="stat-label">High Priority</span>
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
            placeholder="Search polls, votes, threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'polls', 'votes', 'threads', 'reported', 'suspended'].map(filter => (
            <button
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="polls-list">
          {filteredPolls.map(poll => (
            <div
              key={poll.id}
              className={`poll-item ${selectedPoll?.id === poll.id ? 'selected' : ''}`}
              onClick={() => setSelectedPoll(poll)}
            >
              <div className="poll-header">
                <div className="poll-info">
                  <div className="type-icon">
                    {getTypeIcon(poll.type)}
                  </div>
                  <div className="poll-details">
                    <h3 className="poll-title">{poll.title}</h3>
                    <p className="poll-category">{poll.category}</p>
                    <div className="creator-info">
                      <span>by {poll.createdBy.username}</span>
                      <span className="separator">•</span>
                      <span>{formatDate(poll.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="status-badges">
                  <div 
                    className={`priority-badge priority-${poll.priority}`}
                  >
                    {poll.priority}
                  </div>
                  <div 
                    className={`status-badge status-${poll.status}`}
                  >
                    {poll.status}
                  </div>
                </div>
              </div>

              <div className="poll-content">
                <div className="poll-description">
                  <p>{poll.description.substring(0, 150)}...</p>
                </div>

                <div className="poll-stats">
                  <div className="stat-item">
                    <FaThumbsUp size={12} />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                  <div className="stat-item">
                    <FaComments size={12} />
                    <span>{poll.comments} comments</span>
                  </div>
                  <div className="stat-item">
                    <span>{poll.engagement.views} views</span>
                  </div>
                  <div className="stat-item">
                    <span>{getEngagementRate(poll)}% engagement</span>
                  </div>
                </div>

                {poll.reports && poll.reports.count > 0 && (
                  <div className="reports-info">
                    <FaExclamationTriangle />
                    <span>{poll.reports.count} reports</span>
                    <div className="report-reasons">
                      {poll.reports.reasons.slice(0, 2).map(reason => (
                        <span key={reason} className="reason-tag">{reason}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="poll-tags">
                  {poll.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {poll.tags.length > 3 && (
                    <span className="tag more">+{poll.tags.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="poll-actions">
                <button 
                  className="action-btn approve-btn"
                  title="Approve poll"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(poll.id);
                  }}
                >
                  <FaCheck />
                </button>
                <button 
                  className="action-btn suspend-btn"
                  title="Suspend poll"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSuspend(poll.id);
                  }}
                >
                  <FaExclamationTriangle />
                </button>
                <button 
                  className="action-btn delete-btn"
                  title="Delete poll"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(poll.id);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedPoll && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>{selectedPoll.type.charAt(0).toUpperCase() + selectedPoll.type.slice(1)} Details</h3>
              <button 
                className="close-panel"
                title="Close panel"
                onClick={() => setSelectedPoll(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="panel-content">
              <div className="detail-section">
                <h4>Basic Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Title:</label>
                    <span>{selectedPoll.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedPoll.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span>{selectedPoll.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span>{selectedPoll.status}</span>
                  </div>
                  <div className="detail-item">
                    <label>Anonymous:</label>
                    <span>{selectedPoll.isAnonymous ? 'Yes' : 'No'}</span>
                  </div>
                  {selectedPoll.allowMultipleVotes && (
                    <div className="detail-item">
                      <label>Multiple Votes:</label>
                      <span>Allowed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <div className="poll-description-full">
                  {selectedPoll.description}
                </div>
              </div>

              {selectedPoll.options && (
                <div className="detail-section">
                  <h4>Options & Results</h4>
                  <div className="options-list">
                    {selectedPoll.options.map(option => (
                      <div key={option} className="option-item">
                        <div className="option-label">{option}</div>
                        <div className="option-stats">
                          <div className="vote-count">
                            {selectedPoll.votes?.[option] || 0} votes
                          </div>
                          <div className="vote-percentage">
                            {selectedPoll.totalVotes > 0 
                              ? Math.round(((selectedPoll.votes?.[option] || 0) / selectedPoll.totalVotes) * 100)
                              : 0}%
                          </div>
                        </div>
                        <div 
                          className="vote-bar"
                          data-percentage={selectedPoll.totalVotes > 0 
                            ? Math.round(((selectedPoll.votes?.[option] || 0) / selectedPoll.totalVotes) * 100)
                            : 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Engagement Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">{selectedPoll.engagement.views}</div>
                    <div className="metric-label">Views</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{selectedPoll.engagement.interactions}</div>
                    <div className="metric-label">Interactions</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{selectedPoll.totalVotes}</div>
                    <div className="metric-label">Total Votes</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{selectedPoll.comments}</div>
                    <div className="metric-label">Comments</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Creator Information</h4>
                <div className="creator-details">
                  <div className="creator-avatar">
                    {selectedPoll.createdBy.avatar}
                  </div>
                  <div className="creator-info">
                    <div><strong>{selectedPoll.createdBy.username}</strong></div>
                    <div>{selectedPoll.createdBy.email}</div>
                    <div>ID: {selectedPoll.createdBy.id}</div>
                  </div>
                </div>
              </div>

              {selectedPoll.reports && selectedPoll.reports.count > 0 && (
                <div className="detail-section">
                  <h4>Reports ({selectedPoll.reports.count})</h4>
                  <div className="reports-details">
                    <div className="report-reasons">
                      <strong>Reasons:</strong>
                      <div className="reasons-list">
                        {selectedPoll.reports.reasons.map((reason, index) => (
                          <span key={index} className="reason-chip">{reason}</span>
                        ))}
                      </div>
                    </div>
                    <div className="report-details">
                      <strong>Details:</strong>
                      <div className="report-text">
                        {selectedPoll.reports.details}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPoll.moderatorNotes && (
                <div className="detail-section">
                  <h4>Moderator Notes</h4>
                  <div className="moderator-notes">
                    {selectedPoll.moderatorNotes}
                  </div>
                </div>
              )}

              <div className="panel-actions">
                <button 
                  className="panel-btn approve"
                  onClick={() => handleApprove(selectedPoll.id)}
                >
                  <FaCheck />
                  Approve
                </button>
                <button 
                  className="panel-btn suspend"
                  onClick={() => handleSuspend(selectedPoll.id)}
                >
                  <FaExclamationTriangle />
                  Suspend
                </button>
                <button 
                  className="panel-btn delete"
                  onClick={() => handleDelete(selectedPoll.id)}
                >
                  <FaTimes />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollsModeration;
