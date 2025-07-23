import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaStar, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/EventDetails.scss';

interface PlatformEvent {
  id: string;
  eventName: string;
  societyName: string;
  date: string;
  time: string;
  location: string;
  eventCategory: string;
  neededVolunteers: number;
  description: string;
  organizedBy: {
    name: string;
    avatar: string;
    userId: string;
    rating: number;
    totalEvents: number;
    email: string;
    phone: string;
  };
  imageUrls: string[];
  maxParticipants: number;
  eventStatus: 'draft' | 'organized' | 'finalized';
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
  approvalDeadline: string;
  verificationChecks: {
    contentVerified: boolean;
    organizerVerified: boolean;
    locationChecked: boolean;
    safetyChecked: boolean;
  };
  activities: string[];
  requirements: string[];
  reports?: Array<{
    id: string;
    reason: string;
    description: string;
    submittedBy: string;
    submittedAt: string;
  }>;
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<PlatformEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock data fetch
    const mockEvent: PlatformEvent = {
      id: id || 'event-001',
      eventName: 'Astronomy Workshop 2024',
      societyName: 'Space Explorers Society',
      date: '2024-03-15',
      time: '18:00 - 21:00',
      location: 'Main Campus Auditorium',
      eventCategory: 'Workshop',
      neededVolunteers: 5,
      description: 'Learn about celestial navigation and telescope handling in this hands-on workshop. Participants will get practical experience with different types of telescopes and learn how to identify major constellations and celestial objects.',
      organizedBy: {
        name: 'Dr. Sarah Chen',
        avatar: 'SC',
        userId: 'user_456',
        rating: 4.8,
        totalEvents: 23,
        email: 'sarah.chen@university.edu',
        phone: '+1-555-0123'
      },
      imageUrls: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ],
      maxParticipants: 50,
      eventStatus: 'finalized',
      created_at: '2024-01-10T10:30:00Z',
      status: 'pending',
      priority: 'high',
      reportCount: 0,
      approvalDeadline: '2024-01-25T23:59:59Z',
      verificationChecks: {
        contentVerified: true,
        organizerVerified: true,
        locationChecked: true,
        safetyChecked: false
      },
      activities: [
        'Telescope handling workshop',
        'Constellation identification',
        'Planet observation',
        'Q&A session with astronomers'
      ],
      requirements: [
        'No prior experience needed',
        'Comfortable clothing',
        'Notebook (optional)'
      ]
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

  const handleRequestChanges = () => {
    if (event) {
      setEvent({ ...event, status: 'needs-review' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = (checks: PlatformEvent['verificationChecks']) => {
    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
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
                <p>Please wait while we fetch the event information</p>
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
                <p>The requested event could not be found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nightcamp-details">
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
              <h1>{event.eventName}</h1>
              <p>Platform Event Details & Moderation</p>
            </div>
          </div>
          <div className="header-badges">
            <div className={`priority-badge priority-${event.priority}`}>
              {event.priority}
            </div>
            <div className={`status-badge status-${event.status.replace('-', '')}`}>
              {event.status.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="details-nav">
        <div className="nav-tabs">
          {['overview', 'organizer', 'verification'].map(tab => (
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
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="content-grid">
              <div className="main-section">
                <div className="info-card">
                  <h3>Event Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <strong>Date:</strong>
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaClock />
                      <div>
                        <strong>Time:</strong>
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <div>
                        <strong>Location:</strong>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaUsers />
                      <div>
                        <strong>Capacity:</strong>
                        <span>{event.maxParticipants} participants</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Description</h3>
                  <p>{event.description}</p>
                </div>

                <div className="info-card">
                  <h3>Activities</h3>
                  <div className="activities-list">
                    {event.activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <FaCheck className="check-icon" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-card">
                  <h3>Requirements</h3>
                  <div className="activities-list">
                    {event.requirements.map((requirement, index) => (
                      <div key={index} className="activity-item">
                        <FaCheck className="check-icon" />
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-table">
                    <div className="stats-row">
                      <div className="stats-cell">
                        <span className="stat-label">VOLUNTEERS NEEDED - </span>
                        <span className="stat-value">{event.neededVolunteers}</span>
                      </div>
                      <div className="stats-cell">
                        <span className="stat-label">MAX PARTICIPANTS - </span>
                        <span className="stat-value">{event.maxParticipants}</span>
                      </div>
                    </div>
                    <div className="stats-row">
                      <div className="stats-cell">
                        <span className="stat-label">CATEGORY - </span>
                        <span className="stat-value">{event.eventCategory}</span>

                      </div>
                      <div className="stats-cell">
                        <span className="stat-label"> VERIFIED - </span>
                        <span className="stat-value">{getCompletionPercentage(event.verificationChecks)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-value">{event.neededVolunteers}</span>
                        <span className="stat-label">VOLUNTEERS NEEDED</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{event.maxParticipants}</span>
                        <span className="stat-label">MAX PARTICIPANTS</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{event.eventCategory}</span>
                        <span className="stat-label">CATEGORY</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{getCompletionPercentage(event.verificationChecks)}%</span>
                        <span className="stat-label">VERIFIED</span>
                    </div>
                  </div>
                </div> */}

                <div className="info-card">
                  <h3>Event Status</h3>
                  <div className="status-display">
                    <div className={`status-item ${event.eventStatus === 'finalized' ? 'active' : ''}`}>
                      <span>Finalized</span>
                    </div>
                    <div className={`status-item ${event.eventStatus === 'organized' ? 'active' : ''}`}>
                      <span>Organized</span>
                    </div>
                    <div className={`status-item ${event.eventStatus === 'draft' ? 'active' : ''}`}>
                      <span>Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organizer' && (
          <div className="organizer-tab">
            <div className="info-card">
              <h3>Organizer Information</h3>
              <div className="organizer-profile">
                <div className="organizer-avatar-large">
                  {event.organizedBy.avatar}
                </div>
                <div className="organizer-details">
                  <h4>{event.organizedBy.name}</h4>
                  <div className="organizer-rating">
                    <FaStar className="star-icon" />
                    <span>{event.organizedBy.rating}</span>
                    <span>({event.organizedBy.totalEvents} events)</span>
                  </div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <strong>Society:</strong>
                      <span>{event.societyName}</span>
                    </div>
                    <div className="contact-item">
                      <strong>Email:</strong>
                      <span>{event.organizedBy.email}</span>
                    </div>
                    <div className="contact-item">
                      <strong>Phone:</strong>
                      <span>{event.organizedBy.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="verification-tab">
            <div className="info-card">
              <h3>Verification Status</h3>
              <div className="verification-progress">
                <div className="progress-header">
                  <span>Overall Progress: {getCompletionPercentage(event.verificationChecks)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getCompletionPercentage(event.verificationChecks)}%` }}
                  ></div>
                </div>
              </div>
              <div className="verification-checklist">
                {Object.entries(event.verificationChecks).map(([key, checked]) => (
                  <div key={key} className={`verification-item ${checked ? 'verified' : 'pending'}`}>
                    <div className="verification-icon">
                      {checked ? <FaCheck /> : <FaClock />}
                    </div>
                    <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="details-actions">
        <Button
          variant="success"
          size="medium"
          onClick={handleApprove}
          disabled={event.status === 'approved'}
        >
          <FaCheck /> Approve Event
        </Button>
        <Button
          variant="warning"
          size="medium"
          onClick={handleRequestChanges}
          disabled={event.status === 'needs-review'}
        >
          <FaClock /> Request Changes
        </Button>
        <Button
          variant="danger"
          size="medium"
          onClick={handleReject}
          disabled={event.status === 'rejected'}
        >
          <FaTimes /> Reject Event
        </Button>
      </div>
    </div>
  );
};

export default EventDetails;