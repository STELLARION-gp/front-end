import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaSearch, FaTimes, FaCheck, /* FaExclamationTriangle, */ FaThumbsUp, FaComments, FaPoll, FaEye, /* FaFlag */ } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/pages/moderator/PollsModeration.scss';
import Button from '../../components/Button';
import { pollService, type Poll } from '../../services/pollService';

const PollsModeration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch polls on component mount and when filters change
  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pollService.getModerationPolls({
        page: currentPage,
        limit: 20,
        status: selectedFilter,
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (response.success) {
        setPolls(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error loading polls:', err);
      const errorMessage = (err as Error).message || 'Failed to load polls';
      setError(`${errorMessage}. Please check: 1) Backend is running, 2) You have moderator permissions.`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  // Handle notification from navigation state
  useEffect(() => {
    const state = location.state as { message?: string; type?: 'success' | 'error' } | null;
    if (state?.message) {
      setNotification({
        message: state.message,
        type: state.type || 'success'
      });

      // Clear notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      // Clear navigation state
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleApprove = async (pollId: number) => {
    if (!confirm('Are you sure you want to approve this poll?')) {
      return;
    }

    try {
      await pollService.approvePoll(pollId);
      setNotification({
        message: 'Poll approved successfully!',
        type: 'success'
      });
      loadPolls(); // Reload the list

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error('Error approving poll:', err);
      setNotification({
        message: (err as Error).message || 'Failed to approve poll',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleRejectClick = (pollId: number) => {
    setSelectedPollId(pollId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedPollId) {
      setNotification({
        message: 'No poll selected',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      await pollService.rejectPoll(selectedPollId, rejectionReason || undefined);
      setNotification({
        message: rejectionReason 
          ? `Poll rejected: ${rejectionReason}` 
          : 'Poll rejected successfully!',
        type: 'success'
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedPollId(null);
      loadPolls(); // Reload the list

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error('Error rejecting poll:', err);
      setNotification({
        message: (err as Error).message || 'Failed to reject poll',
        type: 'error'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Unused handler - kept for future use
  // const handleDelete = async (pollId: number) => {
  //   if (!confirm('Are you sure you want to permanently delete this poll?')) {
  //     return;
  //   }

  //   try {
  //     await pollService.deletePoll(pollId);
  //     alert('Poll deleted successfully!');
  //     loadPolls(); // Reload the list
  //   } catch (err) {
  //     console.error('Error deleting poll:', err);
  //     alert((err as Error).message || 'Failed to delete poll');
  //   }
  // };

  // Client-side search filtering (status filtering is handled by API)
  const filteredPolls = polls.filter(poll => {
    if (!searchTerm) return true;
    
    const matchesSearch = 
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.creator?.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Unknown';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status?: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-pending">⏳ Pending</span>;
      case 'approved':
        return <span className="status-badge status-approved">✅ Approved</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">❌ Rejected</span>;
      default:
        return <span className="status-badge status-pending">⏳ Pending</span>;
    }
  };

  return (
    <div className="polls-moderation">
      {/* Success Notification */}
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

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
              <h1>Poll Moderation</h1>
              <p>Review and manage community polls</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{polls.filter(p => p.status === 'rejected').length}</span>
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
            placeholder="Search polls, creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(filter => (
            <Button
              variant='primary'
              size='large'
              key={filter}
              className={`filter-tab ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => {
                setSelectedFilter(filter);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="polls-moderation-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading polls...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Error: {error}</p>
            <Button onClick={loadPolls}>Retry</Button>
          </div>
        ) : (
          <div className="polls-moderation-list">
            {filteredPolls.length === 0 ? (
              <div className="empty-state">
                <p>No polls found for your filter/search.</p>
              </div>
            ) : (
              filteredPolls.map(poll => (
                <div
                  key={poll.id}
                  className={`polls-item status-${poll.status || 'pending'}`}
                  onClick={() => navigate(`/dashboard/moderation/polls/details/${poll.id}`)}
                >
                  <div className="polls-item-header">
                    <div className="poll-type">
                      <FaPoll className="type-icon" />
                      <span className="type-label">Poll</span>
                    </div>
                    {getStatusBadge(poll.status)}
                  </div>

                  <div className="polls-item-content">
                    <h3 className="poll-title">{poll.title}</h3>
                    <p className="poll-description">
                      {poll.description?.substring(0, 150)}
                      {poll.description && poll.description.length > 150 ? '...' : ''}
                    </p>
                    <div className="poll-meta">
                      <span className="creator">
                        by {poll.creator?.display_name || poll.creator?.first_name || 'Unknown'}
                      </span>
                      <span className="date">{formatDate(poll.created_at)}</span>
                    </div>
                  </div>

                  <div className="polls-item-stats">
                    <span className="stat-item">
                      <FaThumbsUp size={12} />
                      {poll.total_votes} votes
                    </span>
                    <span className="stat-item">
                      <FaComments size={12} />
                      {poll.comment_count} comments
                    </span>
                    {poll.is_active ? (
                      <span className="stat-item active">
                        ● Active
                      </span>
                    ) : (
                      <span className="stat-item inactive">
                        ○ Closed
                      </span>
                    )}
                  </div>

                  <div className="polls-item-actions">
                    <button
                      className="polls-action-btn polls-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/moderation/polls/details/${poll.id}`);
                      }}
                      title="View poll details"
                    >
                      <FaEye />
                    </button>
                    {poll.status !== 'approved' && (
                      <>
                        <button
                          className="polls-action-btn polls-approve-btn"
                          title="Approve poll"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(poll.id);
                          }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="polls-action-btn polls-reject-btn"
                          title="Reject poll"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(poll.id);
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
            <h3>Reject Poll</h3>
            <p>Please provide a reason for rejecting this poll (optional):</p>
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
              >
                Reject Poll
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollsModeration;
