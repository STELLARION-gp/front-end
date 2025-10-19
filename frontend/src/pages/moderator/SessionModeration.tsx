import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSearch, FaCheck, FaTimes, FaUser, FaMapMarkerAlt, FaEye, FaClock, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/SessionModeration.scss';
import Button from '../../components/Button';
import { sessionsService, type Session } from '../../services/sessionsService';

const SessionModeration: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch sessions on component mount and when filters change
  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionsService.getPendingSessions({
        page: currentPage,
        limit: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (response.success) {
        setSessions(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
      const errorMessage = (err as Error).message || 'Failed to load sessions';
      setError(`${errorMessage}. Please check: 1) Backend is running, 2) Database has moderation columns, 3) You have moderator permissions.`);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleApprove = async (sessionId: number) => {
    if (!confirm('Are you sure you want to approve this session?')) {
      return;
    }

    try {
      await sessionsService.approveSession(sessionId);
      alert('Session approved successfully!');
      loadSessions(); // Reload the list
    } catch (err) {
      console.error('Error approving session:', err);
      alert((err as Error).message || 'Failed to approve session');
    }
  };

  const handleRejectClick = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedSessionId || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await sessionsService.rejectSession(selectedSessionId, rejectionReason);
      alert('Session rejected successfully!');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedSessionId(null);
      loadSessions(); // Reload the list
    } catch (err) {
      console.error('Error rejecting session:', err);
      alert((err as Error).message || 'Failed to reject session');
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.creator?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === 'all' || 
      session.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return '🛠️';
      case 'mentoring': return '👨‍🏫';
      case 'group_learning': return '👥';
      case 'discussion': return '💬';
      case 'lecture': return '📖';
      case 'webinar': return '🎥';
      default: return '📚';
    }
  };

  const formatDateTime = (dateString: string | Date) => {
    if (!dateString) return 'TBD';
    const sessionDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
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
              <span className="stat-number">{sessions.filter(s => s.status === 'rejected').length}</span>
              <span className="stat-label">Rejected</span>
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
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
            <Button
              variant='primary'
              size='large'
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error: {error}</p>
            <Button onClick={loadSessions}>Retry</Button>
          </div>
        ) : (
          <div className="sessions-list">
            {filteredSessions.length === 0 ? (
              <div className="empty-state">
                <p>No session proposals found for your filter/search.</p>
              </div>
            ) : (
              filteredSessions.map(session => (
                <div
                  key={session.id}
                  className={`session-item status-${session.status?.replace('_', '-') || 'pending'}`}
                  onClick={() => navigate(`/dashboard/moderation/session/details/${session.id}`)}
                >
                  <div className="item-header">
                    <div className="session-type">
                      <span className="type-icon">{getSessionTypeIcon(session.session_type)}</span>
                      <span className="type-label">{session.session_type?.replace('_', ' ')}</span>
                    </div>
                    <div className={`status-indicator_1 status-${session.status?.replace('_', '-') || 'pending'}`}>
                      {session.status?.replace('_', ' ') || 'pending'}
                    </div>
                  </div>

                  <div className="item-content">
                    <h3 className="session-title">{session.title}</h3>
                    <p className="session-description">{session.description?.substring(0, 150)}...</p>
                    <div className="item-meta">
                      <span className="proposer">by {session.creator?.display_name || 'Unknown'}</span>
                      <span className="date">{formatDateTime(session.session_date)}</span>
                    </div>
                  </div>

                  <div className="session-details">
                    <div className="session-info">
                      <span className="info-item">
                        <FaClock size={12} />
                        {session.duration || 60} min
                      </span>
                      <span className="info-item">
                        <FaMapMarkerAlt size={12} />
                        {session.session_type === 'live' ? 'Online' : 'Recorded'}
                      </span>
                      <span className="info-item">
                        <FaUser size={12} />
                        Max {session.max_participants || 'N/A'}
                      </span>
                      {session.price && (
                        <span className="info-item">
                          <FaDollarSign size={12} />
                          ${session.price}
                        </span>
                      )}
                    </div>
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
                          className="action-btn reject-btn"
                          title="Reject session"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(session.id);
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Session</h3>
            <p>Please provide a reason for rejecting this session:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={5}
            />
            <div className="modal-actions">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
              >
                Reject Session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionModeration;
