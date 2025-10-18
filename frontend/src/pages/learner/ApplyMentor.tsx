import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/pages/learner/ApplyMentor.scss";
import "../../styles/pages/influencer/SessionsNotification.scss";
import Button from "../../components/Button";
import { getMentorProfileById } from "../../services/mentorApi";
import type { MentorProfile } from "../../services/mentorApi";

const ApplyMentor: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interest, setInterest] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Show notification helper
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 5000); // Auto-hide after 5 seconds
  };

  // Fetch mentor details
  useEffect(() => {
    const fetchMentor = async () => {
      if (!mentorId) {
        setError("Invalid mentor ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMentorProfileById(Number(mentorId));
        setMentor(data);
        setError("");
      } catch (err: any) {
        console.error('Error fetching mentor:', err);
        setError('Failed to load mentor details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 2) {
      setError("You can upload a maximum of 2 documents.");
      return;
    }
    setFiles([...files, ...selected].slice(0, 2));
    setError("");
  };

  const handleRemoveFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!interest.trim()) {
      setError("Please enter your interest.");
      showNotification("error", "Please enter your interest.");
      return;
    }

    if (!mentorId) {
      setError("Invalid mentor ID.");
      showNotification("error", "Invalid mentor ID.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Import the API function
      const { submitMenteeApplication } = await import('../../services/menteeApplicationApi');
      
      // Submit the application with documents
      await submitMenteeApplication(
        Number(mentorId),
        interest,
        files.length > 0 ? files : undefined
      );

      showNotification("success", "✨ Application submitted successfully! The mentor will review your application.");
      
      // Navigate after showing notification
      setTimeout(() => {
        navigate("/dashboard/mentors");
      }, 2000); // Give user time to see the notification
    } catch (err: any) {
      console.error('Error submitting application:', err);
      const errorMsg = err.response?.data?.error || 'Failed to submit application. Please try again.';
      setError(errorMsg);
      showNotification("error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="apply-mentor-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading mentor details...</p>
      </div>
    );
  }

  // Mentor not found or error
  if (!mentor || error) {
    return (
      <div className="apply-mentor-page" style={{ padding: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.5)', 
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '1rem'
        }}>
          <p>⚠️ {error || 'Mentor not found.'}</p>
        </div>
        <Button onClick={() => navigate('/dashboard/mentors')}>
          ← Back to Mentors
        </Button>
      </div>
    );
  }

  // Calculate available slots
  // Note: menteeCount defaults to 0 until mentor-mentee tracking is implemented
  const availableSlots = mentor.maxMentees && mentor.menteeCount !== undefined
    ? mentor.maxMentees - mentor.menteeCount 
    : mentor.maxMentees || 0;

  // Format specialties for display
  const specialties = mentor.specialties?.join(', ') || 'Astronomy';

  return (
    <div className="apply-mentor-page">
      <div className="mentor-card mentor-card--modern mentor-card--apply">
        <div className="mentor-card__avatar-bg">
          {mentor.avatarUrl && (
            <img src={mentor.avatarUrl} alt={mentor.name} className="mentor-card__image" />
          )}
        </div>
        <div className="mentor-card__info__apply">
          <h2 className="mentor-card__name">{mentor.name}</h2>
          <div className="mentor-card__expertise"><b>{specialties}</b></div>
          <div className="mentor-card__desc">{mentor.bio}</div>
          <div className="mentor-card__slots">Available Slots: {availableSlots}</div>
          <div className="mentor-card__email">Email: {mentor.email}</div>
          
          {/* Display qualifications */}
          {mentor.qualifications && mentor.qualifications.length > 0 && (
            <div className="mentor-card__qualifications" style={{ marginTop: '1rem' }}>
              <strong>Qualifications:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                {mentor.qualifications.map((qual, idx) => (
                  <li key={idx}>{qual}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <form className="apply-form" onSubmit={handleSubmit}>
        <h3>Application Form</h3>
        
        <div>
          <label htmlFor="interest">Why are you interested in this mentorship? *</label>
          <textarea
            id="interest"
            value={interest}
            onChange={e => setInterest(e.target.value)}
            rows={4}
            placeholder="Describe your interest and what you hope to learn from this mentor..."
            required
          />
        </div>
        
        <div>
          <label htmlFor="cv-upload">Upload CV or supporting documents (optional, max 2):</label>
          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            onChange={handleFileChange}
            disabled={files.length >= 2}
          />
        </div>
        
        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, idx) => (
              <div key={idx} className="file-item">
                <span>{file.name}</span>
                <button type="button" onClick={() => handleRemoveFile(idx)}>&times;</button>
              </div>
            ))}
          </div>
        )}
        
        {error && <div className="error-msg">{error}</div>}
        
        <div className="button-container">
          <Button 
            type="button" 
            onClick={() => navigate('/dashboard/mentors')}
            variant="secondary"
            size="medium"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting} 
            variant="primary"
            size="medium"
          >
            {submitting ? '⏳ Submitting...' : '✓ Submit Application'}
          </Button>
        </div>
      </form>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification({ ...notification, show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyMentor;
