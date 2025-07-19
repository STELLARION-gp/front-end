import React, { useState } from 'react';
import { FaArrowLeft, FaSearch, FaCheck, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/SessionModeration.scss';

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
  const [selectedSession, setSelectedSession] = useState<SessionProposal | null>(null);

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
      <div className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/moderator')} title="Back to Moderation Dashboard">
              <FaArrowLeft />
            </button>
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
      </div>

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
            <button
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="sessions-list">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${selectedSession?.id === session.id ? 'selected' : ''}`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="session-header">
                <div className="session-info">
                  <div className="session-type-icon">
                    {getSessionTypeIcon(session.sessionType)}
                  </div>
                  <div className="session-details">
                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-subject">{session.subject}</p>
                    <div className="proposer-info">
                      <FaUser size={12} />
                      <span>by {session.proposedBy.username}</span>
                    </div>
                  </div>
                </div>
                <div className="status-badges">
                  <div 
                    className={`priority-badge priority-${session.priority}`}
                  >
                    {session.priority}
                  </div>
                  <div 
                    className={`status-badge status-${session.status.replace('_', '-')}`}
                  >
                    {session.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div className="session-content">
                <div className="session-description">
                  <p>{session.description.substring(0, 150)}...</p>
                </div>

                <div className="session-metadata">
                  <div className="metadata-item">
                    <FaCalendarAlt size={12} />
                    <span>{formatDateTime(session.date, session.time)}</span>
                  </div>
                  <div className="metadata-item">
                    <FaMapMarkerAlt size={12} />
                    <span>{session.location} {session.venue && `- ${session.venue}`}</span>
                  </div>
                  <div className="metadata-item">
                    <span>Duration: {session.duration} min</span>
                  </div>
                  <div className="metadata-item">
                    <span>Max: {session.maxParticipants} participants</span>
                  </div>
                </div>

                {session.reports && session.reports.count > 0 && (
                  <div className="reports-info">
                    <FaExclamationTriangle />
                    <span>{session.reports.count} reports</span>
                  </div>
                )}

                <div className="session-tags">
                  {session.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {session.tags.length > 3 && (
                    <span className="tag more">+{session.tags.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="session-actions">
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
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedSession && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>Session Details</h3>
              <button 
                className="close-panel"
                title="Close panel"
                onClick={() => setSelectedSession(null)}
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
                    <span>{selectedSession.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedSession.sessionType.replace('_', ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Subject:</label>
                    <span>{selectedSession.subject}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span>{selectedSession.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Target Audience:</label>
                    <span>{selectedSession.targetAudience}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Schedule & Location</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Date & Time:</label>
                    <span>{formatDateTime(selectedSession.date, selectedSession.time)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{selectedSession.duration} minutes</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedSession.location}</span>
                  </div>
                  {selectedSession.venue && (
                    <div className="detail-item">
                      <label>Venue:</label>
                      <span>{selectedSession.venue}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Max Participants:</label>
                    <span>{selectedSession.maxParticipants}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Description</h4>
                <div className="session-description-full">
                  {selectedSession.description}
                </div>
              </div>

              <div className="detail-section">
                <h4>Requirements</h4>
                <div className="requirements-list">
                  {selectedSession.requirements.map((req, index) => (
                    <div key={index} className="requirement-item">
                      • {req}
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Proposer Information</h4>
                <div className="proposer-details">
                  <div className="proposer-avatar">
                    {selectedSession.proposedBy.avatar}
                  </div>
                  <div className="proposer-info">
                    <div><strong>{selectedSession.proposedBy.username}</strong></div>
                    <div>{selectedSession.proposedBy.email}</div>
                    <div>ID: {selectedSession.proposedBy.id}</div>
                  </div>
                </div>
              </div>

              {selectedSession.reports && selectedSession.reports.count > 0 && (
                <div className="detail-section">
                  <h4>Reports ({selectedSession.reports.count})</h4>
                  <div className="reports-details">
                    <div className="report-reasons">
                      {selectedSession.reports.reasons.map((reason, index) => (
                        <span key={index} className="reason-chip">{reason}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedSession.moderatorNotes && (
                <div className="detail-section">
                  <h4>Moderator Notes</h4>
                  <div className="moderator-notes">
                    {selectedSession.moderatorNotes}
                  </div>
                </div>
              )}

              <div className="panel-actions">
                <button 
                  className="panel-btn approve"
                  onClick={() => handleApprove(selectedSession.id)}
                >
                  <FaCheck />
                  Approve
                </button>
                <button 
                  className="panel-btn revision"
                  onClick={() => handleRequestRevision(selectedSession.id)}
                >
                  <FaExclamationTriangle />
                  Request Revision
                </button>
                <button 
                  className="panel-btn reject"
                  onClick={() => handleReject(selectedSession.id)}
                >
                  <FaTimes />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionModeration;
