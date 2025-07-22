import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../components/Button';
import '../../styles/pages/moderator/EventDetails.scss';

interface Event {
  id: string;
  event_name: string;
  description: string;
  visibility: 'public' | 'private' | 'members-only';
  best_time: string;
  duration: string;
  date: string;
  added_person: {
    name: string;
    avatar: string;
    userId: string;
    rating: number;
    totalEvents: number;
  };
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
  approvalDeadline: string;
  verificationChecks: {
    contentVerified: boolean;
    moderatorVerified: boolean;
    safetyChecked: boolean;
    guidelinesChecked: boolean;
  };
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock data - in real app, fetch based on id
    const mockEvent: Event = {
      id: id || 'event-001',
      event_name: 'Perseid Meteor Shower Observation',
      description: 'Join us for an extraordinary night of meteor watching during the peak of the Perseid meteor shower. We\'ll provide telescopes and expert guidance for the best viewing experience. This event will take place at one of the darkest locations in our region, providing optimal conditions for meteor observation.',
      visibility: 'public',
      best_time: '10:00 PM - 2:00 AM',
      duration: '4 hours',
      date: '2024-08-12',
      added_person: {
        name: 'Dr. Sarah Chen',
        avatar: 'SC',
        userId: 'user_456',
        rating: 4.8,
        totalEvents: 23
      },
      created_at: '2024-01-15T10:30:00Z',
      status: 'pending',
      priority: 'high',
      reportCount: 0,
      approvalDeadline: '2024-01-25T23:59:59Z',
      verificationChecks: {
        contentVerified: true,
        moderatorVerified: true,
        safetyChecked: false,
        guidelinesChecked: true
      }
    };

    setTimeout(() => {
      setEvent(mockEvent);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApprove = () => {
    if (event) {
      setEvent({ ...event, status: 'approved' });
    }
  };

  const handleReject = () => {
    if (event) {
      setEvent({ ...event, status: 'rejected' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerificationProgress = () => {
    if (!event) return 0;
    const checks = Object.values(event.verificationChecks);
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  if (loading) {
    return (
      <div className="event-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/events')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Loading Event Details...</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/events')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Event Not Found</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details">
      {/* Header */}
      <div className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation/events')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>{event.event_name}</h1>
              <p>Event moderation details and verification</p>
            </div>
          </div>
          <div className="header-badges">
            <span className={`priority-badge priority-${event.priority}`}>
              {event.priority}
            </span>
            <span className={`status-badge status-${event.status}`}>
              {event.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="details-nav">
        <div className="nav-tabs">
          {['overview', 'verification', 'history'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="details-content">
        <div className="content-grid">
          <div className="main-section">
            {activeTab === 'overview' && (
              <>
                <div className="info-card">
                  <h3>Event Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <span className="label">Date</span>
                        <span className="value">{formatDate(event.date)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaClock />
                      <div>
                        <span className="label">Best Time</span>
                        <span className="value">{event.best_time}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaClock />
                      <div>
                        <span className="label">Duration</span>
                        <span className="value">{event.duration}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaEye />
                      <div>
                        <span className="label">Visibility</span>
                        <span className="value">{event.visibility}</span>
                      </div>
                    </div>
                  </div>
                  <div className="description-section">
                    <h4>Description</h4>
                    <p>{event.description}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'verification' && (
              <>
                <div className="info-card">
                  <h3>Verification Progress</h3>
                  <div className="verification-progress">
                    <div className="progress-header">
                      <span>Verification Completion</span>
                      <span>{getVerificationProgress()}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        data-progress={getVerificationProgress()}
                      ></div>
                    </div>
                  </div>

                  <div className="verification-checklist">
                    <div className={`verification-item ${event.verificationChecks.contentVerified ? 'verified' : 'pending'}`}>
                      {event.verificationChecks.contentVerified ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Content Verified</span>
                    </div>
                    <div className={`verification-item ${event.verificationChecks.moderatorVerified ? 'verified' : 'pending'}`}>
                      {event.verificationChecks.moderatorVerified ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Moderator Verified</span>
                    </div>
                    <div className={`verification-item ${event.verificationChecks.safetyChecked ? 'verified' : 'pending'}`}>
                      {event.verificationChecks.safetyChecked ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Safety Checked</span>
                    </div>
                    <div className={`verification-item ${event.verificationChecks.guidelinesChecked ? 'verified' : 'pending'}`}>
                      {event.verificationChecks.guidelinesChecked ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Guidelines Checked</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <>
                <div className="info-card">
                  <h3>Event History</h3>
                  <div className="history-timeline">
                    <div className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>Event Created</h4>
                        <p>{formatDate(event.created_at)}</p>
                        <span>By {event.added_person.name}</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>Submitted for Review</h4>
                        <p>{formatDate(event.created_at)}</p>
                        <span>Pending moderator approval</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="sidebar-section">
            <div className="info-card">
              <h3>Event Creator</h3>
              <div className="organizer-profile">
                <div className="organizer-avatar-large">{event.added_person.avatar}</div>
                <div className="organizer-details">
                  <h4>{event.added_person.name}</h4>
                  <div className="organizer-rating">
                    <span>★ {event.added_person.rating}</span>
                    <span>• {event.added_person.totalEvents} events</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Moderation Info</h3>
              <div className="moderation-stats">
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className={`stat-value status-${event.status}`}>
                    {event.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Priority</span>
                  <span className={`stat-value priority-${event.priority}`}>
                    {event.priority}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Reports</span>
                  <span className="stat-value">{event.reportCount}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Deadline</span>
                  <span className="stat-value">{formatDate(event.approvalDeadline)}</span>
                </div>
              </div>

              {event.reportCount > 0 && (
                <div className="report-warning">
                  <FaExclamationTriangle />
                  <span>{event.reportCount} report{event.reportCount > 1 ? 's' : ''} require attention</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="details-actions">
        <Button
          variant="success"
          size="large"
          onClick={handleApprove}
          disabled={event.status === 'approved'}
        >
          <FaCheckCircle /> Approve Event
        </Button>
        <Button
          variant="border"
          size="large"
          onClick={() => setEvent({ ...event, status: 'needs-review' })}
        >
          Request Changes
        </Button>
        <Button
          variant="danger"
          size="large"
          onClick={handleReject}
          disabled={event.status === 'rejected'}
        >
          <FaTimesCircle /> Reject Event
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;
