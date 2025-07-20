import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaTag, FaFlag } from 'react-icons/fa';
import '../../styles/pages/moderator/SessionDetails.scss';
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
  duration: number;
  location: 'online' | 'physical' | 'hybrid';
  venue?: string;
  maxParticipants: number;
  requirements: string[];
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  priority: 'low' | 'medium' | 'high' | 'critical';
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

// Mock data - in real app this would come from an API
const mockSessions: SessionProposal[] = [
  {
    id: 'session_001',
    title: 'Advanced React Patterns Workshop',
    description: 'Deep dive into advanced React patterns including hooks, context, and state management with real-world examples. This comprehensive workshop will cover the latest best practices in React development, including performance optimization techniques, custom hooks creation, and advanced component patterns. Participants will work on practical projects and learn how to build scalable React applications.',
    proposedBy: {
      id: 'user_001',
      username: 'ReactMaster',
      email: 'react.master@example.com',
      avatar: 'RM'
    },
    sessionType: 'workshop',
    subject: 'Rocket Science',
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
    tags: ['Stars', 'Rocket Science', 'Science', 'Workshop'],
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
    subject: 'Star Learning',
    date: '2024-01-25',
    time: '16:00',
    duration: 180,
    location: 'hybrid',
    venue: 'Tech Hub - Room 101',
    maxParticipants: 12,
    requirements: ['Astro basics', 'Mathematics foundation', 'Jupyter Notebook'],
    status: 'revision_requested',
    priority: 'high',
    submittedAt: '2024-01-05T11:20:00Z',
    lastUpdated: '2024-01-07T14:30:00Z',
    moderatorNotes: 'Please provide more detailed prerequisites and reduce session duration.',
    category: 'Technical',
    targetAudience: 'Intermediate',
    tags: ['Stargazing', 'Astrophysics', 'AI', 'Galaxy']
  }
];

const SessionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionProposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundSession = mockSessions.find(s => s.id === id);
      setSession(foundSession || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApprove = () => {
    if (session) {
      console.log('Approving session:', session.id);
      // Update session status logic would go here
      setSession({ ...session, status: 'approved' });
    }
  };

  const handleReject = () => {
    if (session) {
      console.log('Rejecting session:', session.id);
      setSession({ ...session, status: 'rejected' });
    }
  };

  const handleRequestRevision = () => {
    if (session) {
      console.log('Requesting revision for session:', session.id);
      setSession({ ...session, status: 'revision_requested' });
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return '🛠️';
      case 'mentoring': return '👨‍🏫';
      case 'group_learning': return '👥';
      case 'discussion': return '💬';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="session-details">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Session Details...</h2>
          <p>Please wait while we fetch the session information.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="session-details">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Session Not Found</h2>
          <p>The session you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="primary"
            size="medium"
            onClick={() => navigate('/dashboard/moderation/session')}
          >
            Back to Session Moderation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-details">
      {/* Header */}
      <header className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation/session')}
            >
              Back to Sessions
            </Button>
            <div className="title-section">
              <h1>Session Proposal Details</h1>
              <p>Review and moderate session proposal</p>
            </div>
          </div>
          
          <div className="header-actions">
            {session.status === 'pending' && (
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
                  onClick={handleRequestRevision}
                >
                  Request Revision
                </Button>
                <Button
                  variant="danger"
                  size="medium"
                  icon={<FaTimes />}
                  iconPosition="left"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="details-content">
        <div className="session-card1">
          {/* Session Header */}
          <div className="session-header">
            <div className="session-info">
              <div className="session-type-badge">
                <span className="type-icon">{getSessionTypeIcon(session.sessionType)}</span>
                <span className="type-label">{session.sessionType.replace('_', ' ')}</span>
              </div>
              <h2 className="session-title">{session.title}</h2>
              <p className="session-subject">{session.subject}</p>
            </div>
            <div className="status-section">
              <div className={`priority-badge priority-${session.priority}`}>
                {session.priority}
              </div>
              <div className={`status-badge status-${session.status.replace('_', '-')}`}>
                {session.status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-item">
                <div className="item-icon">
                  <FaCalendarAlt />
                </div>
                <div className="item-content">
                  <div className="item-label">Date & Time</div>
                  <div className="item-value">{formatDateTime(session.date, session.time)}</div>
                </div>
              </div>
              <div className="overview-item">
                <div className="item-icon">
                  <FaClock />
                </div>
                <div className="item-content">
                  <div className="item-label">Duration</div>
                  <div className="item-value">{session.duration} minutes</div>
                </div>
              </div>
              <div className="overview-item">
                <div className="item-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="item-content">
                  <div className="item-label">Location</div>
                  <div className="item-value">{session.location}{session.venue && ` - ${session.venue}`}</div>
                </div>
              </div>
              <div className="overview-item">
                <div className="item-icon">
                  <FaUsers />
                </div>
                <div className="item-content">
                  <div className="item-label">Max Participants</div>
                  <div className="item-value">{session.maxParticipants}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Proposer Section */}
          <div className="proposer-section">
            <h3>Proposed By</h3>
            <div className="proposer-card">
              <div className="proposer-avatar">
                {session.proposedBy.avatar}
              </div>
              <div className="proposer-info">
                <div className="proposer-name">{session.proposedBy.username}</div>
                <div className="proposer-email">{session.proposedBy.email}</div>
                <div className="proposer-id">ID: {session.proposedBy.id}</div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="description-section">
            <h3>Description</h3>
            <div className="description-content">
              {session.description}
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-card">
              <h3>Session Information</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{session.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Target Audience</span>
                  <span className="detail-value">{session.targetAudience}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Submitted At</span>
                  <span className="detail-value">{new Date(session.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">{new Date(session.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3>Requirements</h3>
              <div className="requirements-list">
                {session.requirements.map((req, index) => (
                  <div key={index} className="requirement-item">
                    <span className="requirement-bullet">•</span>
                    <span className="requirement-text">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="tags-section">
            <h3>
              <FaTag className="section-icon" />
              Tags
            </h3>
            <div className="tags-list">
              {session.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Reports Section */}
          {session.reports && session.reports.count > 0 && (
            <div className="reports-section">
              <h3>
                <FaFlag className="section-icon warning" />
                Reports ({session.reports.count})
              </h3>
              <div className="reports-content">
                <div className="report-reasons">
                  {session.reports.reasons.map((reason, index) => (
                    <span key={index} className="reason-tag">{reason}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Moderator Notes Section */}
          {session.moderatorNotes && (
            <div className="notes-section">
              <h3>
                <FaExclamationTriangle className="section-icon warning" />
                Moderator Notes
              </h3>
              <div className="notes-content">
                {session.moderatorNotes}
              </div>
            </div>
          )}

          {/* Action Section */}
          {session.status === 'pending' && (
            <div className="action-section">
              <Button
                variant="success"
                size="large"
                icon={<FaCheck />}
                iconPosition="left"
                onClick={handleApprove}
              >
                Approve Session
              </Button>
              <Button
                variant="warning"
                size="large"
                icon={<FaExclamationTriangle />}
                iconPosition="left"
                onClick={handleRequestRevision}
              >
                Request Revision
              </Button>
              <Button
                variant="danger"
                size="large"
                icon={<FaTimes />}
                iconPosition="left"
                onClick={handleReject}
              >
                Reject Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
