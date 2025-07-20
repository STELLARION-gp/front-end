import React, { useState } from 'react';
import { FaArrowLeft, FaSearch, FaTimes, FaExclamationTriangle, FaThumbsUp, FaComments, FaPoll, FaEye, FaFlag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/PollsModeration.scss';
import Button from '../../components/Button';

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
              <h1>Polls, Votes & Threads</h1>
              <h1>Moderation</h1>
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
      </header>

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
            <Button
              variant={selectedFilter === filter ? 'primary' : 'ghost'}
              size='medium'
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.replace('_', ' ').charAt(0).toUpperCase() + filter.replace('_', ' ').slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="polls-list">
          {filteredPolls.length === 0 ? (
            <div className="empty-state">
              <p>No polls found for your filter/search.</p>
            </div>
          ) : (
            filteredPolls.map(poll => (
              <div
                key={poll.id}
                className={`poll-item priority-${poll.priority} status-${poll.status.replace('_', '-')}`}
                onClick={() => navigate(`/dashboard/moderation/polls/details/${poll.id}`)}
              >
                <div className="item-header">
                  <div className="poll-type">
                    <span className="type-icon">{getTypeIcon(poll.type)}</span>
                    <span className="type-label">{poll.type.charAt(0).toUpperCase() + poll.type.slice(1)}</span>
                  </div>
                  <div className={`priority-badge priority-${poll.priority}`}>
                    {poll.priority}
                  </div>
                  <div className={`status-indicator status-${poll.status.replace('_', '-')}`}>
                    {poll.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="item-content">
                  <h3 className="poll-title">{poll.title}</h3>
                  <p className="poll-description">{poll.description.substring(0, 150)}...</p>
                  <div className="item-meta">
                    <span className="creator">by {poll.createdBy.username}</span>
                    <span className="category">{poll.category}</span>
                    <span className="date">{formatDate(poll.createdAt)}</span>
                  </div>
                </div>

                <div className="poll-stats">
                  <div className="stat-item">
                    <span className="stat-label">Votes:</span>
                    <span className="stat-value">{poll.totalVotes}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Comments:</span>
                    <span className="stat-value">{poll.comments}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Engagement:</span>
                    <span className="stat-value">{getEngagementRate(poll)}%</span>
                  </div>
                </div>

                {poll.reports && poll.reports.count > 0 && (
                  <div className="reports-info">
                    <FaFlag className="flag-icon" />
                    <span>{poll.reports.count} report{poll.reports.count !== 1 ? 's' : ''}</span>
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

                <div className="item-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/moderation/polls/details/${poll.id}`);
                    }}
                    title="View poll details"
                  >
                    <FaEye />
                  </button>
                  {poll.status === 'active' && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollsModeration;
