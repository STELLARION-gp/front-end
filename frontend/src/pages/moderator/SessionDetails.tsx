import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaGraduationCap, FaLink, FaFileAlt, FaStickyNote, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/pages/moderator/SessionDetails.scss';
import Button from '../../components/Button';
import { sessionsService, type Session } from '../../services/sessionsService';

const SessionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadSessionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionsService.getSessionById(Number(id));
      if (response.success) {
        setSession(response.data);
      } else {
        setError('Failed to load session details');
      }
    } catch (err) {
      console.error('Error loading session:', err);
      setError((err as Error).message || 'Failed to load session details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadSessionDetails();
  }, [id, loadSessionDetails]);

  const handleApprove = async () => {
    if (!session || !window.confirm('Are you sure you want to approve this session?')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await sessionsService.approveSession(session.id);
      
      if (response.success) {
        alert('Session approved successfully!');
        navigate('/dashboard/moderation/sessions');
      } else {
        alert('Failed to approve session');
      }
    } catch (err) {
      console.error('Error approving session:', err);
      alert((err as Error).message || 'Failed to approve session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    if (!session || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      const response = await sessionsService.rejectSession(session.id, rejectionReason);
      
      if (response.success) {
        alert('Session rejected successfully!');
        navigate('/dashboard/moderation/sessions');
      } else {
        alert('Failed to reject session');
      }
    } catch (err) {
      console.error('Error rejecting session:', err);
      alert((err as Error).message || 'Failed to reject session');
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: string | Date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="session-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="session-details-page">
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error Loading Session</h2>
          <p>{error || 'Session not found'}</p>
          <Button onClick={() => navigate('/dashboard/moderation/sessions')}>
            <FaArrowLeft /> Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-details-page">
      {/* Header with Back Button and Actions */}
      <div className="details-header">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/moderation/sessions')}
          className="back-button"
        >
          <FaArrowLeft /> Back to Sessions
        </Button>

        <div className="header-actions">
          {session.status === 'pending' && (
            <>
              <Button
                variant="success"
                onClick={handleApprove}
                disabled={actionLoading}
                className="approve-btn"
              >
                <FaCheck /> Approve Session
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectClick}
                disabled={actionLoading}
                className="reject-btn"
              >
                <FaTimes /> Reject Session
              </Button>
            </>
          )}
          {session.status === 'approved' && (
            <div className="status-badge approved">
              <FaCheck /> Approved
            </div>
          )}
          {session.status === 'rejected' && (
            <div className="status-badge rejected">
              <FaTimes /> Rejected
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="details-content">
        {/* Title and Status */}
        <div className="session-header">
          <h1 className="session-title">{session.title}</h1>
          <div className="session-meta">
            <span className={`status-tag status-${session.status}`}>
              {session.status?.toUpperCase()}
            </span>
            <span className="type-tag">{session.session_type?.toUpperCase()}</span>
            <span className="payment-tag">{session.payment_type?.toUpperCase()}</span>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section">
          <h2><FaFileAlt /> Description</h2>
          <p className="description-text">{session.description}</p>
        </div>

        {/* Key Information Grid */}
        <div className="detail-section">
          <h2>Session Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div className="info-content">
                <label>Session Date</label>
                <span>{formatDate(session.session_date)}</span>
              </div>
            </div>

            <div className="info-item">
              <FaClock className="info-icon" />
              <div className="info-content">
                <label>Session Time</label>
                <span>{session.session_time ? String(session.session_time) : 'Not specified'}</span>
              </div>
            </div>

            <div className="info-item">
              <FaClock className="info-icon" />
              <div className="info-content">
                <label>Duration</label>
                <span>{session.duration} minutes</span>
              </div>
            </div>

            <div className="info-item">
              <FaUsers className="info-icon" />
              <div className="info-content">
                <label>Max Participants</label>
                <span>{session.max_participants || 'Unlimited'}</span>
              </div>
            </div>

            <div className="info-item">
              <FaGraduationCap className="info-icon" />
              <div className="info-content">
                <label>Difficulty Level</label>
                <span className="difficulty-badge">{session.difficulty_level?.toUpperCase()}</span>
              </div>
            </div>

            <div className="info-item">
              <FaDollarSign className="info-icon" />
              <div className="info-content">
                <label>Price</label>
                <span>{session.payment_type === 'paid' ? `$${session.price}` : 'Free'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Link */}
        {session.session_link && (
          <div className="detail-section">
            <h2><FaLink /> Session Link</h2>
            <a href={session.session_link} target="_blank" rel="noopener noreferrer" className="session-link">
              {session.session_link}
            </a>
          </div>
        )}

        {/* Materials */}
        {session.materials && session.materials.length > 0 && (
          <div className="detail-section">
            <h2><FaFileAlt /> Session Materials</h2>
            <ul className="materials-list">
              {session.materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Session Notes */}
        {session.session_notes && (
          <div className="detail-section">
            <h2><FaStickyNote /> Session Notes</h2>
            <p className="notes-text">{session.session_notes}</p>
          </div>
        )}

        {/* Creator Information */}
        {session.creator && (
          <div className="detail-section">
            <h2>Created By</h2>
            <div className="creator-card">
              <div className="creator-avatar">
                {session.creator.display_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="creator-info">
                <h3>{session.creator.display_name || `${session.creator.first_name} ${session.creator.last_name}`}</h3>
                <p>{session.creator.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Moderation History */}
        <div className="detail-section">
          <h2>Moderation Details</h2>
          <div className="moderation-info">
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`value status-${session.status}`}>{session.status?.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="label">Created At:</span>
              <span className="value">{formatDateTime(session.created_at)}</span>
            </div>
            {session.moderated_at && (
              <div className="info-row">
                <span className="label">Moderated At:</span>
                <span className="value">{formatDateTime(session.moderated_at)}</span>
              </div>
            )}
            {session.approved_at && (
              <div className="info-row">
                <span className="label">Approved At:</span>
                <span className="value">{formatDateTime(session.approved_at)}</span>
              </div>
            )}
            {session.rejected_at && (
              <div className="info-row">
                <span className="label">Rejected At:</span>
                <span className="value">{formatDateTime(session.rejected_at)}</span>
              </div>
            )}
            {session.moderated_by && session.moderator && (
              <div className="info-row">
                <span className="label">Moderated By:</span>
                <span className="value">{session.moderator.display_name || session.moderator.email}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Enabled:</span>
              <span className="value">{session.is_enabled ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {session.status === 'rejected' && session.rejection_reason && (
          <div className="detail-section rejection-section">
            <h2><FaExclamationTriangle /> Rejection Reason</h2>
            <div className="rejection-box">
              <p>{session.rejection_reason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Session</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowRejectModal(false)}
                aria-label="Close modal"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Please provide a detailed reason for rejecting this session. This will be sent to the session creator.
              </p>
              <label htmlFor="rejection-reason">Rejection Reason *</label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this session is being rejected..."
                rows={6}
                required
                autoFocus
              />
              <div className="char-count">
                {rejectionReason.length} characters
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim() || actionLoading}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetails;
