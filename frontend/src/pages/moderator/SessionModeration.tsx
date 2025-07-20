import React, { useState } from 'react';
import { FaArrowLeft, FaSearch, FaCheck, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/SessionModeration.scss';
import Button from '../../components/Button';

interface SessionProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  sessionType: 'mentoring' | 'group_learning' | 'workshop' | 'discussion';
  subject: string;
  date: string;
  time: string;
  duration: number; // in minutes
  location: 'online' | 'physical' | 'hybrid';
  venue?: string;
  maxParticipants: number;
  requirements: string[];
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  priority: 'low' | 'medium' | 'high';
  submittedAt: string;
  lastUpdated: string;
  moderatorNotes?: string;
  category: string;
  targetAudience: string;
  tags: string[];
  reports?: {
    count: number;
    reasons: string[];
  };
}

const SessionModeration: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for session proposals
  const [sessions] = useState<SessionProposal[]>([
    {
      id: 'session_001',
      title: 'Advanced React Patterns Workshop',
      description: 'Deep dive into advanced React patterns including hooks, context, and state management with real-world examples.',
      proposedBy: {
        id: 'user_001',
        username: 'ReactMaster',
        email: 'react.master@example.com',
        avatar: 'RM'
      },
      sessionType: 'workshop',
      subject: 'React/Frontend Development',
      date: '2024-01-15',
      time: '14:00',
      duration: 120,
      location: 'online',
      maxParticipants: 25,
      requirements: ['Basic React knowledge', 'VS Code installed', 'Node.js 16+'],
      status: 'pending',
      priority: 'high',
      submittedAt: '2024-01-10T10:30:00Z',
      lastUpdated: '2024-01-10T10:30:00Z',
      category: 'Technical',
      targetAudience: 'Intermediate Developers',
      tags: ['React', 'JavaScript', 'Frontend', 'Workshop'],
      reports: {
        count: 2,
        reasons: ['Inappropriate content', 'Spam']
      }
    },
    {
      id: 'session_002',
      title: 'Astronomy for Beginners',
      description: 'Learn the basics of stargazing, constellation identification, and using telescopes effectively.',
      proposedBy: {
        id: 'user_002',
        username: 'StarGazer2024',
        email: 'stargazer@example.com',
        avatar: 'SG'
      },
      sessionType: 'group_learning',
      subject: 'Astronomy',
      date: '2024-01-20',
      time: '19:00',
      duration: 90,
      location: 'physical',
      venue: 'City Observatory',
      maxParticipants: 15,
      requirements: ['Interest in astronomy', 'Warm clothing'],
      status: 'approved',
      priority: 'medium',
      submittedAt: '2024-01-08T15:45:00Z',
      lastUpdated: '2024-01-09T09:15:00Z',
      category: 'Science',
      targetAudience: 'All levels',
      tags: ['Astronomy', 'Stargazing', 'Science', 'Beginner-friendly']
    },
    {
      id: 'session_003',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts, algorithms, and practical applications using Python and scikit-learn.',
      proposedBy: {
        id: 'user_003',
        username: 'MLEnthusiast',
        email: 'ml.enthusiast@example.com',
        avatar: 'ME'
      },
      sessionType: 'mentoring',
      subject: 'Machine Learning',
      date: '2024-01-25',
      time: '16:00',
      duration: 180,
      location: 'hybrid',
      venue: 'Tech Hub - Room 101',
      maxParticipants: 12,
      requirements: ['Python basics', 'Mathematics foundation', 'Jupyter Notebook'],
      status: 'revision_requested',
      priority: 'high',
      submittedAt: '2024-01-05T11:20:00Z',
      lastUpdated: '2024-01-07T14:30:00Z',
      moderatorNotes: 'Please provide more detailed prerequisites and reduce session duration.',
      category: 'Technical',
      targetAudience: 'Intermediate',
      tags: ['Machine Learning', 'Python', 'AI', 'Data Science']
    }
  ]);

  const handleApprove = (sessionId: string) => {
    console.log('Approving session:', sessionId);
    // Implementation would update session status
  };

  const handleReject = (sessionId: string) => {
    console.log('Rejecting session:', sessionId);
    // Implementation would update session status
  };

  const handleRequestRevision = (sessionId: string) => {
    console.log('Requesting revision for session:', sessionId);
    // Implementation would update session status
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.proposedBy.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || session.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return '🛠️';
      case 'mentoring': return '👨‍🏫';
      case 'group_learning': return '👥';
      case 'discussion': return '💬';
      default: return '📚';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="session-moderation">
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
              <h1>Session Proposal Moderation</h1>
              <p>Review and manage learning session proposals</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{sessions.filter(s => s.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{sessions.filter(s => s.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{sessions.filter(s => s.priority === 'high').length}</span>
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
            placeholder="Search sessions, proposers, or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'rejected', 'revision_requested'].map(filter => (
            <Button
              variant='primary'
              size='large'
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
        <div className="sessions-list">
          {filteredSessions.length === 0 ? (
            <div className="empty-state">
              <p>No session proposals found for your filter/search.</p>
            </div>
          ) : (
            filteredSessions.map(session => (
              <div
                key={session.id}
                className={`session-item priority-${session.priority} status-${session.status.replace('_', '-')}`}
                onClick={() => navigate(`/dashboard/moderation/session/details/${session.id}`)}
              >
                <div className="item-header">
                  <div className="session-type">
                    <span className="type-icon">{getSessionTypeIcon(session.sessionType)}</span>
                    <span className="type-label">{session.sessionType.replace('_', ' ').charAt(0).toUpperCase() + session.sessionType.replace('_', ' ').slice(1)}</span>
                  </div>
                  <div className={`priority-badge priority-${session.priority}`}>
                    {session.priority}
                  </div>
                  <div className={`status-indicator status-${session.status.replace('_', '-')}`}>
                    {session.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="item-content">
                  <h3 className="session-title">{session.title}</h3>
                  <p className="session-description">{session.description.substring(0, 150)}...</p>
                  <div className="item-meta">
                    <span className="proposer">by {session.proposedBy.username}</span>
                    <span className="subject">{session.subject}</span>
                    <span className="date">{formatDateTime(session.date, session.time)}</span>
                  </div>
                </div>

                <div className="session-details">
                  <div className="session-info">
                    <span className="info-item">
                      <FaCalendarAlt size={12} />
                      {session.duration} min
                    </span>
                    <span className="info-item">
                      <FaMapMarkerAlt size={12} />
                      {session.location}
                    </span>
                    <span className="info-item">
                      <FaUser size={12} />
                      Max {session.maxParticipants}
                    </span>
                  </div>
                  
                  {session.reports && session.reports.count > 0 && (
                    <div className="reports-info">
                      <FaExclamationTriangle className="flag-icon" />
                      <span>{session.reports.count} report{session.reports.count !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                <div className="session-tags">
                  {session.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {session.tags.length > 3 && (
                    <span className="tag more">+{session.tags.length - 3} more</span>
                  )}
                </div>

                <div className="item-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/moderation/session/details/${session.id}`);
                    }}
                    title="View session details"
                  >
                    <FaEye />
                  </button>
                  {session.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        title="Approve session"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(session.id);
                        }}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn revision-btn"
                        title="Request revision"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestRevision(session.id);
                        }}
                      >
                        <FaExclamationTriangle />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        title="Reject session"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(session.id);
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

export default SessionModeration;
