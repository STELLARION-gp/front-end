import React from "react";
import Button from "../Button";
import type { Session } from "../../services/sessionsService";
import "../../styles/components/learner/SessionDetailsModal.scss";

interface SessionDetailsModalProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
  onRegister?: (sessionId: number) => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  open,
  onClose,
  onRegister
}) => {
  if (!open || !session) return null;

  const creatorName = session.creator?.display_name || 
    `${session.creator?.first_name || ''} ${session.creator?.last_name || ''}`.trim() || 
    'Unknown Instructor';

  const sessionDate = new Date(session.session_date);
  const formattedDate = sessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = new Date(session.session_time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="session-details-modal-backdrop" onClick={onClose}>
      <div className="session-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="session-details-close" onClick={onClose}>
          ×
        </button>

        <div className="session-details-header">
          <h2>{session.title}</h2>
          <div className="session-badges">
            <span className={`badge badge-${session.session_type}`}>
              {session.session_type === 'live' ? '🔴 Live' : '📼 Recorded'}
            </span>
            <span className={`badge badge-${session.payment_type}`}>
              {session.payment_type === 'paid' ? `💰 Paid Rs ${session.price}` : '🆓 Free'}
            </span>
            <span className={`badge badge-${session.difficulty_level}`}>
              {session.difficulty_level.charAt(0).toUpperCase() + session.difficulty_level.slice(1)}
            </span>
          </div>
        </div>

        <div className="session-details-body">
          <div className="session-info-section">
            <h3>📋 Session Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">📅 Date:</span>
                <span className="info-value">{formattedDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⏰ Time:</span>
                <span className="info-value">{formattedTime}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⏱️ Duration:</span>
                <span className="info-value">{session.duration} minutes</span>
              </div>
              <div className="info-item">
                <span className="info-label">👥 Max Participants:</span>
                <span className="info-value">
                  {session.max_participants || 'Unlimited'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">👨‍🏫 Instructor:</span>
                <span className="info-value">{creatorName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📊 Level:</span>
                <span className="info-value">{session.difficulty_level}</span>
              </div>
            </div>
          </div>

          <div className="session-description-section">
            <h3>📝 Description</h3>
            <p>{session.description}</p>
          </div>

          {session.materials && session.materials.length > 0 && (
            <div className="session-materials-section">
              <h3>📚 Materials Needed</h3>
              <ul>
                {session.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          )}

          {session.session_notes && (
            <div className="session-notes-section">
              <h3>📌 Additional Notes</h3>
              <p>{session.session_notes}</p>
            </div>
          )}

          {session.session_link && session.payment_type === 'free' && (
            <div className="session-link-section">
              <h3>🔗 Session Link</h3>
              <a 
                href={session.session_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="session-link"
              >
                {session.session_type === 'live' ? 'Join Live Session' : 'Watch Recording'}
              </a>
            </div>
          )}
        </div>

        <div className="session-details-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {session.payment_type === 'paid' ? (
            <Button 
              variant="primary" 
              onClick={() => {
                console.log('Proceeding to payment for session:', session.id);
                // TODO: Implement payment flow
              }}
            >
              💳 Pay Rs {session.price}
            </Button>
          ) : (
            <>
              {session.session_type === 'live' && (
                <Button 
                  variant="primary" 
                  onClick={() => onRegister && onRegister(session.id)}
                >
                  Register for Session
                </Button>
              )}
              {session.session_type === 'recorded' && session.session_link && (
                <Button 
                  variant="primary"
                  onClick={() => session.session_link && window.open(session.session_link, '_blank')}
                >
                  Watch Recording
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;
