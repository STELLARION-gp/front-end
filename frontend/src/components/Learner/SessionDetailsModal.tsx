import React, { useState } from "react";
import Button from "../Button";
import type { Session } from "../../services/sessionsService";
import { sessionsService } from "../../services/sessionsService";
import "../../styles/components/learner/SessionDetailsModal.scss";
import DateIcon from "../../assets/svg/DateIcon";
import TimeIcon from "../../assets/svg/TimeIcon";
import DurationIcon from "../../assets/svg/DurationIcon";
import ParticipantsIcon from "../../assets/svg/ParticipantsIcon";
import FreeIcon from "../../assets/svg/FreeIcon";
import DifficultyIcon from "../../assets/svg/DifficultyIcon";
import SessionPaymentModal from "./SessionPaymentModal";
import type { CardDetails } from "./SessionPaymentModal";
// import { useToast } from "../../contexts/ToastContext";

interface SessionDetailsModalProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
  onRegister?: (sessionId: number) => void;
  onEnrollmentSuccess?: () => void; // Callback to refresh the sessions list
  isEnrolled?: boolean; // Flag to indicate if user is already enrolled
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  open,
  onClose,
  onRegister,
  onEnrollmentSuccess,
  isEnrolled = false,
}) => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  // const { showSuccess, showError } = useToast();

  if (!open || !session) return null;

  const handlePayment = async (cardDetails: CardDetails) => {
    try {
      setPaymentLoading(true);
      console.log("Processing payment for session:", session.id);

      // Call the enrollment API with payment details
      const result = await sessionsService.enrollInPaidSession(
        session.id,
        cardDetails
      );

      console.log("Enrollment successful:", result);

      // Close both modals on success
      setPaymentModalOpen(false);
      setPaymentLoading(false);

      showSuccess(`Payment successful! You are now enrolled in "${session.title}".`);

      // Trigger refresh of sessions list
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess();
      }

      onClose();
    } catch (error: any) {
      setPaymentLoading(false);
      console.error("Payment failed:", error);
      showError(error.message || "Payment failed. Please try again.");
    }
  };

  const creatorName =
    session.creator?.display_name ||
    `${session.creator?.first_name || ""} ${
      session.creator?.last_name || ""
    }`.trim() ||
    "Unknown Instructor";

  const sessionDate = new Date(session.session_date);
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Handle session_time - backend now sends as "HH:MM:SS" string format
  let formattedTime = "";
  if (typeof session.session_time === "string") {
    // Extract HH:MM from string format like "14:30:00"
    const timeParts = session.session_time.split(":");
    if (timeParts.length >= 2) {
      const hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      formattedTime = `${displayHours}:${minutes} ${period}`;
    } else {
      formattedTime = session.session_time;
    }
  } else if (session.session_time) {
    // Fallback: If it's a Date object (shouldn't happen with updated backend)
    const timeDate = new Date(session.session_time);
    if (!isNaN(timeDate.getTime())) {
      const hours = timeDate.getHours();
      const minutes = timeDate.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const minutesStr = minutes.toString().padStart(2, "0");
      formattedTime = `${displayHours}:${minutesStr} ${period}`;
    } else {
      formattedTime = "Time not available";
    }
  } else {
    formattedTime = "Time not available";
  }

  return (
    <div className="session-details-modal-backdrop" onClick={onClose}>
      <div
        className="session-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="session-details-close" onClick={onClose}>
          ×
        </button>

        <div className="session-details-header">
          <h2>{session.title}</h2>
          <div className="session-badges">
            <span className={`badge badge-${session.session_type}`}>
              {session.session_type === "live" ? " Live" : " Recorded"}
            </span>
            <span className={`badge badge-${session.payment_type}`}>
              {session.payment_type === "paid" ? (
                <>
                  <span>Paid Rs {session.price}</span>
                </>
              ) : (
                <>
                  <FreeIcon size={14} />
                  <span>Free</span>
                </>
              )}
            </span>
            <span className={`badge badge-${session.difficulty_level}`}>
              {session.difficulty_level.charAt(0).toUpperCase() +
                session.difficulty_level.slice(1)}
            </span>
          </div>
        </div>

        <div className="session-details-body">
          <div className="session-info-section">
            <h3> Session Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">
                  <DateIcon size={16} /> Date:
                </span>
                <span className="info-value">{formattedDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <TimeIcon size={16} /> Time:
                </span>
                <span className="info-value">{formattedTime}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <DurationIcon size={16} /> Duration:
                </span>
                <span className="info-value">{session.duration} minutes</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <ParticipantsIcon size={16} /> Max Participants:
                </span>
                <span className="info-value">
                  {session.max_participants || "Unlimited"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label"> Instructor:</span>
                <span className="info-value">{creatorName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <DifficultyIcon size={16} /> Level:
                </span>
                <span className="info-value">{session.difficulty_level}</span>
              </div>
            </div>
          </div>

          <div className="session-description-section">
            <h3>Description</h3>
            <p>{session.description}</p>
          </div>

          {session.materials && session.materials.length > 0 && (
            <div className="session-materials-section">
              <h3> Materials Needed</h3>
              <ul>
                {session.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          )}

          {session.session_notes && (
            <div className="session-notes-section">
              <h3> Additional Notes</h3>
              <p>{session.session_notes}</p>
            </div>
          )}

          {session.session_link && session.payment_type === "free" && (
            <div className="session-link-section">
              <h3> Session Link</h3>
              <a
                href={session.session_link}
                target="_blank"
                rel="noopener noreferrer"
                className="session-link"
              >
                {session.session_type === "live"
                  ? "Join Live Session"
                  : "Watch Recording"}
              </a>
            </div>
          )}
        </div>

        <div className="session-details-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>

          {!isEnrolled && (
            <>
              {session.payment_type === "paid" ? (
                <Button
                  variant="primary"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  💳 Pay Rs {session.price}
                </Button>
              ) : (
                <>
                  {session.session_type === "live" && (
                    <Button
                      variant="primary"
                      onClick={() => onRegister && onRegister(session.id)}
                    >
                      Register for Session
                    </Button>
                  )}
                  {session.session_type === "recorded" &&
                    session.session_link && (
                      <Button
                        variant="primary"
                        onClick={() =>
                          session.session_link &&
                          window.open(session.session_link, "_blank")
                        }
                      >
                        Watch Recording
                      </Button>
                    )}
                </>
              )}
            </>
          )}

          {isEnrolled && (
            <div className="enrolled-badge">✓ Already Enrolled</div>
          )}
        </div>
      </div>

      <SessionPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPayment={handlePayment}
        sessionTitle={session.title}
        amount={session.price || 0}
        loading={paymentLoading}
      />
    </div>
  );
};

export default SessionDetailsModal;
