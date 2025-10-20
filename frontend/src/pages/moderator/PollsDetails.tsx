import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaThumbsUp, FaComments, FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/PollsDetails.scss';
import Button from '../../components/Button';
import { pollService, type Poll as PollType } from '../../services/pollService';
import { useToast } from '../../contexts/ToastContext';

const PollsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [poll, setPoll] = useState<PollType | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchPollDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await pollService.getPollById(parseInt(id));
        
        if (response.success) {
          setPoll(response.data);
        }
      } catch (error) {
        console.error('Error fetching poll details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPollDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!poll || !confirm('Are you sure you want to approve this poll?')) return;
    
    setActionLoading('approve');
    try {
      await pollService.approvePoll(poll.id);
      
      // Redirect to polls moderation with success message
      navigate('/dashboard/moderation/polls', { 
        state: { 
          message: 'Poll approved successfully!',
          type: 'success'
        } 
      });
    } catch (error) {
      console.error('Error approving poll:', error);
      showError((error as Error).message || 'Error approving poll. Please try again.');
      setActionLoading(null);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!poll) return;
    
    setActionLoading('reject');
    try {
      await pollService.rejectPoll(poll.id, rejectionReason || undefined);
      
      // Redirect to polls moderation with success message
      navigate('/dashboard/moderation/polls', { 
        state: { 
          message: rejectionReason 
            ? `Poll rejected: ${rejectionReason}` 
            : 'Poll rejected successfully!',
          type: 'success'
        } 
      });
    } catch (error) {
      console.error('Error rejecting poll:', error);
      showError((error as Error).message || 'Error rejecting poll. Please try again.');
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!poll || !confirm('Are you sure you want to permanently delete this poll?')) return;
    
    setActionLoading('delete');
    try {
      await pollService.deletePoll(poll.id);
      showSuccess('Poll deleted successfully!');
      navigate('/dashboard/moderation/polls');
    } catch (error) {
      console.error('Error deleting poll:', error);
      showError((error as Error).message || 'Error deleting poll. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

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
      <header className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate(-1)}
            >
              Back to Polls
            </Button>
            <div className="title-section">
              <h1>Poll Details</h1>
              <p>Review and moderate poll content</p>
            </div>
          </div>
          
          <div className="header-actions">
            {getStatusBadge(poll.status)}
            <div className="view-count">
              <FaEye /> {poll.total_votes} votes
            </div>
          </div>
        </div>
      </header>

      <div className="details-content">
        <div className="main-content">
          {/* Poll Information */}
          <div className="detail-card poll-info">
            <div className="card-header">
              <h2>Poll Information</h2>
            </div>
            <div className="card-content">
              <div className="info-row">
                <label>Title:</label>
                <p>{poll.title}</p>
              </div>
              {poll.description && (
                <div className="info-row">
                  <label>Description:</label>
                  <p>{poll.description}</p>
                </div>
              )}
              <div className="info-row">
                <label>Created:</label>
                <p>{formatDate(poll.created_at)}</p>
              </div>
              <div className="info-row">
                <label>Last Updated:</label>
                <p>{formatDate(poll.updated_at)}</p>
              </div>
              <div className="info-row">
                <label>Status:</label>
                <p>{poll.is_active ? '● Active' : '○ Closed'}</p>
              </div>
              {poll.moderated_at && (
                <div className="info-row">
                  <label>Moderated At:</label>
                  <p>{formatDate(poll.moderated_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Poll Options */}
          <div className="detail-card poll-options">
            <div className="card-header">
              <h2>Poll Options & Results</h2>
              <span className="total-votes">{poll.total_votes} total votes</span>
            </div>
            <div className="card-content">
              {poll.choices.map((choice, index) => (
                <div key={index} className="poll-option">
                  <div className="option-header">
                    <span className="option-text">{choice.choice}</span>
                    <span className="option-votes">{choice.vote_count} votes ({choice.percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="option-bar">
                    <div 
                      className="option-fill" 
                      style={{ width: `${choice.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Info */}
          <div className="detail-card creator-info">
            <div className="card-header">
              <h2>Creator Information</h2>
            </div>
            <div className="card-content">
              <div className="creator-profile">
                <div className="creator-avatar">
                  {poll.creator?.display_name?.charAt(0) || poll.creator?.first_name?.charAt(0) || 'U'}
                </div>
                <div className="creator-details">
                  <h3>{poll.creator?.display_name || `${poll.creator?.first_name || ''} ${poll.creator?.last_name || ''}`.trim() || 'Unknown'}</h3>
                  <p>Creator ID: {poll.creator?.id}</p>
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
                  <FaThumbsUp className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{poll.total_votes}</span>
                    <span className="stat-label">Total Votes</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaComments className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{poll.comment_count}</span>
                    <span className="stat-label">Comments</span>
                  </div>
                </div>
                <div className="stat-item">
                  <FaEye className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-value">{poll.is_active ? 'Active' : 'Closed'}</span>
                    <span className="stat-label">Status</span>
                  </div>
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
                {poll.status !== 'approved' && (
                  <>
                    <Button
                      variant="success"
                      size="medium"
                      onClick={handleApprove}
                      disabled={actionLoading === 'approve'}
                      icon={<FaCheck />}
                      iconPosition="left"
                    >
                      {actionLoading === 'approve' ? 'Approving...' : 'Approve Poll'}
                    </Button>
                    <Button
                      variant="danger"
                      size="medium"
                      onClick={handleRejectClick}
                      disabled={actionLoading === 'reject'}
                      icon={<FaTimes />}
                      iconPosition="left"
                    >
                      {actionLoading === 'reject' ? 'Rejecting...' : 'Reject Poll'}
                    </Button>
                  </>
                )}
                {poll.status === 'approved' && (
                  <div className="moderation-info approved-status">
                    <div className="status-icon">
                      <FaCheck />
                    </div>
                    <div className="status-text">
                      <p className="success-message">This poll has been approved</p>
                      {poll.moderated_at && (
                        <p className="moderation-date">Approved on {formatDate(poll.moderated_at)}</p>
                      )}
                    </div>
                  </div>
                )}
                {poll.status === 'rejected' && (
                  <div className="moderation-info rejected-status">
                    <div className="status-icon">
                      <FaTimes />
                    </div>
                    <div className="status-text">
                      <p className="error-message">This poll was rejected</p>
                      {poll.moderated_at && (
                        <p className="moderation-date">Rejected on {formatDate(poll.moderated_at)}</p>
                      )}
                    </div>
                  </div>
                )}
                {poll.status === 'pending' && (
                  <div className="moderation-info pending-status">
                    <div className="status-icon">
                      ⏳
                    </div>
                    <div className="status-text">
                      <p className="pending-message">Awaiting moderation</p>
                      <p className="moderation-date">Created {formatDate(poll.created_at)}</p>
                    </div>
                  </div>
                )}
                <Button
                  variant="danger"
                  size="medium"
                  onClick={handleDelete}
                  disabled={actionLoading === 'delete'}
                  icon={<FaTrash />}
                  iconPosition="left"
                >
                  {actionLoading === 'delete' ? 'Deleting...' : 'Delete Poll'}
                </Button>
              </div>
            </div>
          </div>
        </div>
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

export default PollsDetails;
