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
  sessionType: 'mentoring' | 'group_learning' | 'workshop' | 'discussion' | 'lecture';
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
    id: 'astro_001',
    title: 'Advanced Astrophotography Techniques',
    description: 'Master the art of capturing celestial objects with your DSLR or telescope, covering long exposures, stacking, and post-processing.',
    proposedBy: {
      id: 'user_101',
      username: 'CosmicPhotographer',
      email: 'cosmic.photo@example.com',
      avatar: 'CP'
    },
    sessionType: 'workshop',
    subject: 'Astrophotography',
    date: '2024-02-15',
    time: '20:00',
    duration: 120,
    location: 'online',
    maxParticipants: 20,
    requirements: ['DSLR camera or telescope (optional)', 'Basic photography knowledge'],
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-10T10:30:00Z',
    lastUpdated: '2024-01-10T10:30:00Z',
    category: 'Astronomy',
    targetAudience: 'Intermediate',
    tags: ['Astrophotography', 'Photography', 'Night Sky', 'Workshop'],
    reports: {
      count: 1,
      reasons: ['Scheduling conflict']
    }
  },
  {
    id: 'astro_002',
    title: 'සිංහල තාරකා විද්‍යාව: පැරණි සිංහල ජ්‍යොතිෂය හා තාරකා නිරීක්ෂණය',
    description: 'සිංහල ජනතාවගේ තාරකා විද්‍යාත්මක දැනුම, ජ්‍යොතිෂ්‍ය ක්‍රම, සහ පැරණි තාරකා නිරීක්ෂණ ක්‍රම ගැන ඉගෙන ගනිමු.',
    proposedBy: {
      id: 'user_102',
      username: 'SinhalaJyothishaya',
      email: 'sinhala.jyothisha@example.com',
      avatar: 'SJ'
    },
    sessionType: 'group_learning',
    subject: 'Sinhala Astronomy',
    date: '2024-02-20',
    time: '18:30',
    duration: 90,
    location: 'physical',
    venue: 'Colombo Planetarium',
    maxParticipants: 30,
    requirements: ['සිංහල භාෂා දැනුම', 'තාරකා විද්‍යාව පිළිබඳ උනන්දුව'],
    status: 'approved',
    priority: 'medium',
    submittedAt: '2024-01-08T15:45:00Z',
    lastUpdated: '2024-01-09T09:15:00Z',
    category: 'Cultural Astronomy',
    targetAudience: 'All levels',
    tags: ['Sinhala Astronomy', 'Jyothishya', 'Cultural Heritage', 'Sinhala']
  },
  {
    id: 'astro_003',
    title: 'Black Holes and Gravitational Waves',
    description: 'Explore the fascinating physics of black holes, gravitational waves, and their detection by LIGO and other observatories.',
    proposedBy: {
      id: 'user_103',
      username: 'SpacePhysicist',
      email: 'space.physics@example.com',
      avatar: 'SP'
    },
    sessionType: 'lecture',
    subject: 'Theoretical Astronomy',
    date: '2024-02-25',
    time: '19:30',
    duration: 90,
    location: 'hybrid',
    venue: 'University Astrophysics Dept - Lecture Hall A',
    maxParticipants: 50,
    requirements: ['Basic physics knowledge helpful but not required'],
    status: 'approved',
    priority: 'high',
    submittedAt: '2024-01-05T11:20:00Z',
    lastUpdated: '2024-01-07T14:30:00Z',
    category: 'Theoretical Astronomy',
    targetAudience: 'Advanced',
    tags: ['Black Holes', 'Gravitational Waves', 'LIGO', 'Theoretical Physics']
  },
  {
    id: 'astro_004',
    title: 'ශ්‍රී ලංකාවේ තාරකා නිරීක්ෂණ ස්ථාන හා මෙවලම්',
    description: 'ශ්‍රී ලංකාවේ හොඳම තාරකා නිරීක්ෂණ ස්ථාන, භාවිතා කළ හැකි මෙවලම්, සහ දේශීය තාරකා සමාජ ගැන දැන ගනිමු.',
    proposedBy: {
      id: 'user_104',
      username: 'LKAstronomy',
      email: 'lk.astronomy@example.com',
      avatar: 'LK'
    },
    sessionType: 'mentoring',
    subject: 'Local Astronomy',
    date: '2024-03-05',
    time: '17:00',
    duration: 60,
    location: 'online',
    maxParticipants: 40,
    requirements: ['තාරකා විද්‍යාව පිළිබඳ උනන්දුව'],
    status: 'pending',
    priority: 'medium',
    submittedAt: '2024-01-12T08:15:00Z',
    lastUpdated: '2024-01-12T08:15:00Z',
    category: 'Local Astronomy',
    targetAudience: 'Beginner',
    tags: ['Sri Lanka', 'Astronomy Locations', 'Sinhala', 'Beginner']
  },
  {
    id: 'astro_005',
    title: 'Exoplanet Discovery and Characterization',
    description: 'Learn about the methods astronomers use to discover and characterize planets orbiting other stars in our galaxy.',
    proposedBy: {
      id: 'user_105',
      username: 'ExoplanetHunter',
      email: 'exoplanet.hunter@example.com',
      avatar: 'EH'
    },
    sessionType: 'workshop',
    subject: 'Exoplanets',
    date: '2024-03-10',
    time: '18:00',
    duration: 120,
    location: 'online',
    maxParticipants: 25,
    requirements: ['Basic astronomy knowledge'],
    status: 'revision_requested',
    priority: 'high',
    submittedAt: '2024-01-15T14:20:00Z',
    lastUpdated: '2024-01-18T11:10:00Z',
    moderatorNotes: 'Please include more details about the data analysis techniques to be covered.',
    category: 'Planetary Science',
    targetAudience: 'Intermediate',
    tags: ['Exoplanets', 'Space Exploration', 'Astrobiology', 'Research']
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
      case 'lecture': return '📖';
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
