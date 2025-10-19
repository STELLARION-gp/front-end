import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/EventDetails.scss';
import { getEvent, moderateEvent, mapBackendEvent } from '../../services/eventsService';
import { profileService } from '../../services/profileService';

// Narrowed interface to match backend mapping (extra UI-only props optional)
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
  organizedBy: string; // backend provides a string
  imageUrls: string[];
  maxParticipants: number;
  eventStatus: string; // 'draft'|'organized'|'finalized'
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
  created_by?: number;
  moderated_by?: number | null;
  // Optional presentation fields
  activities?: string[];
  requirements?: string[];
  verificationChecks?: {
    contentVerified?: boolean;
    organizerVerified?: boolean;
    locationChecked?: boolean;
    safetyChecked?: boolean;
  };
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<PlatformEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string|null>(null);
  const [moderating, setModerating] = useState(false);
  const [currentUser, setCurrentUser] = useState<{id:number; role:string}|null>(null);

  useEffect(() => {
    (async()=>{
      if(!id) { setError('Missing event id'); setLoading(false); return; }
      try {
        setLoading(true); setError(null);
        // load user profile
        const profileRes = await profileService.getUserProfile();
        if(profileRes.success && profileRes.data?.id){
          setCurrentUser({ id: profileRes.data.id, role: profileRes.data.role || 'learner' });
        }
        // fetch event
        const res = await getEvent(Number(id));
        // backend expected response shape { success, event }
        const raw = res.event ? res.event : res; // fallback if directly event object
        const mapped = mapBackendEvent(raw);
        setEvent(mapped as PlatformEvent);
      } catch(e){
        setError(e instanceof Error? e.message:'Failed to load event');
      } finally { setLoading(false); }
    })();
  }, [id]);

  const canModerate = () => {
    if(!event || !currentUser) return false;
    const roleOk = ['admin','moderator'].includes(currentUser.role);
    if(!roleOk) return false;
    if(currentUser.role==='moderator' && event.created_by && event.created_by===currentUser.id) return false;
    return event.status==='pending';
  };

  const doModerate = async(action:'approve'|'reject') => {
    if(!event) return;
    setModerating(true); const previous = event.status;
    try {
      setEvent({...event, status: action==='approve'?'approved':'rejected'});
      await moderateEvent(Number(event.id), action);
    } catch(e) {
      setEvent({...event, status: previous});
      setError(e instanceof Error? e.message:'Moderation failed');
    } finally { setModerating(false); }
  };
  // Legacy helpers referencing removed mock fields mapped to optional
  const verificationChecks = event?.verificationChecks || { contentVerified:false, organizerVerified:false, locationChecked:false, safetyChecked:false };
  const activities = event?.activities || [];
  const requirements = event?.requirements || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = (checks: typeof verificationChecks) => {
    const entries = Object.entries(checks || {});
    const total = entries.length || 1;
    const completed = entries.filter(([,v])=>!!v).length;
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
              <div className={`status-badge status-${event.status}`}>{event.status}</div>
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

                {/* Event Images Gallery */}
                {event.imageUrls && event.imageUrls.length > 0 && (
                  <div className="info-card">
                    <h3>Event Images</h3>
                    <div className="event-image-gallery">
                      {event.imageUrls.map((url, index) => (
                        <div key={index} className="gallery-item">
                          <img src={url} alt={`${event.eventName} - Image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="info-card">
                  <h3>Activities</h3>
                  <div className="activities-list">
                    {activities.map((activity, index) => (
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
                    {requirements.map((requirement, index) => (
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
                        <span className="stat-value">{getCompletionPercentage(verificationChecks)}%</span>
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
          {event.organizedBy?.[0] || 'O'}
                </div>
                <div className="organizer-details">
          <h4>{event.organizedBy}</h4>
          <div className="organizer-rating text-xs opacity-70">Organizer</div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <strong>Society:</strong>
                      <span>{event.societyName}</span>
                    </div>
                    <div className="contact-item">
            <strong>Created:</strong>
            <span>{new Date(event.created_at).toLocaleString()}</span>
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
                  <span>Overall Progress: {getCompletionPercentage(verificationChecks)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    data-progress={getCompletionPercentage(verificationChecks)}
                  ></div>
                </div>
              </div>
              <div className="verification-checklist">
                {Object.entries(verificationChecks).map(([key, checked]) => (
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
      {error && <div className="p-3 text-sm text-red-400">{error}</div>}
      <div className="details-actions">
        {canModerate() && (
          <>
            <Button
              variant="success"
              size="medium"
              onClick={()=>doModerate('approve')}
              disabled={moderating}
            >
              {moderating? '...' : <><FaCheck /> Approve Event</>}
            </Button>
            <Button
              variant="danger"
              size="medium"
              onClick={()=>doModerate('reject')}
              disabled={moderating}
            >
              {moderating? '...' : <><FaTimes /> Reject Event</>}
            </Button>
          </>
        )}
        {!canModerate() && event.status==='pending' && (
          <div className="text-xs opacity-70">You can't moderate this event (either not authorized or you're the creator).</div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;