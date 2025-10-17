import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaUsers, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/EventModeration.scss';
import { listEvents, moderateEvent, mapBackendEvent } from '../../services/eventsService';
import { profileService } from '../../services/profileService';

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
  organizedBy: string;
  imageUrls: string[];
  maxParticipants: number;
  eventStatus: 'draft' | 'organized' | 'finalized';
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
  organizerRating?: number;
  created_by?: number; // backend user id of creator
}

const EventModeration: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{id:number; role:string}|null>(null);
  const [moderating, setModerating] = useState<number|null>(null);
  const [error, setError] = useState<string|null>(null);

  // Load real events
  useEffect(()=> {
    (async()=>{
      try {
        setLoading(true);
        setError(null);
        // current user profile
        const profileRes = await profileService.getUserProfile();
        if (profileRes.success && profileRes.data?.id) {
          setCurrentUser({ id: profileRes.data.id, role: profileRes.data.role || 'learner' });
        }
        const res = await listEvents();
        const backendEvents = (res.events || []).map((e:unknown)=> mapBackendEvent(e));
  type BackendMapped = ReturnType<typeof mapBackendEvent>;
  const mapped: PlatformEvent[] = backendEvents.map((ev: BackendMapped) => ({
          id: ev.id,
          eventName: ev.eventName,
          societyName: ev.societyName,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          eventCategory: ev.eventCategory,
          neededVolunteers: ev.neededVolunteers,
          description: ev.description,
          organizedBy: ev.organizedBy,
          imageUrls: ev.imageUrls,
          maxParticipants: ev.maxParticipants,
          eventStatus: ev.eventStatus as PlatformEvent['eventStatus'],
          created_at: ev.created_at,
          status: (ev.status as PlatformEvent['status']) || 'pending',
          priority: ev.priority,
          reportCount: ev.reportCount,
          organizerRating: undefined,
          created_by: ev.created_by
        }));
        setEvents(mapped);
      } catch (err) {
        setError(err instanceof Error? err.message:'Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const canModerate = (ev: PlatformEvent) => {
    if(!currentUser) return false;
    const roleOk = ['admin','moderator'].includes(currentUser.role);
    if(!roleOk) return false;
    // Prevent moderators (but not admins) from moderating their own events
    if(currentUser.role === 'moderator' && ev.created_by && ev.created_by === currentUser.id) return false;
    return true;
  };

  const moderate = async (eventId: string, action: 'approve'|'reject') => {
    const prev = events;
    try {
      setModerating(Number(eventId));
      // optimistic update
      setEvents(prev.map(ev => ev.id===eventId ? { ...ev, status: action==='approve'?'approved':'rejected'} : ev));
      await moderateEvent(Number(eventId), action);
    } catch(e) {
      // rollback on failure
      setEvents(prev);
      setError(e instanceof Error? e.message:'Moderation failed');
    } finally { setModerating(null); }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="event-moderation">
        <div className="event-header">
          <div className="event-header-content">
            <div className="event-header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation')}
              >
                ← Back
              </Button>
              <div className="event-title-section">
                <h1>Loading Platform Events...</h1>
                <p>Please wait while we fetch the events</p>
              </div>
            </div>
          </div>
        </div>
        <div className="event-loading-container">
          <div className="event-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-moderation">
      {error && <div className="p-4 text-sm text-red-400">{error}</div>}
      {/* Header */}
      <div className="event-header">
        <div className="event-header-content">
          <div className="event-header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation')}
            >
              ← Back
            </Button>
            <div className="event-title-section">
              <h1>Platform Event Moderation</h1>
              <p>Review and approve platform organized events and competitions</p>
            </div>
          </div>
          <div className="event-header-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate('/dashboard/moderation/events/create')}
            >
              <FaPlus /> Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="event-search-box">
          <FaSearch className="event-search-icon" />
          <input
            type="text"
            placeholder="Search events, societies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="event-filter-tabs">
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
            <Button
              key={filter}
              variant={filterStatus === filter ? 'primary' : 'ghost'}
              size="medium"
              onClick={() => setFilterStatus(filter)}
            >
              {filter === 'all' ? 'ALL' : filter.replace('-', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="event-list">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-item" onClick={() => navigate(`/dashboard/moderation/events/details/${event.id}`)}>
              <div className="event-item-header">
                <div className="event-item-info">
                  <div className="event-icon">
                    {event.eventCategory === 'Workshop' ? '📚' : 
                     event.eventCategory === 'Competition' ? '🏆' : '🔭'}
                  </div>
                  <div className="event-item-details">
                    <h3 className="event-title">{event.eventName}</h3>
                    <p className="event-organizer">by {event.organizedBy} ({event.societyName})</p>
                    <div className="event-meta">
                      <span className="event-meta-item">
                        <FaCalendarAlt />
                        {event.date} at {event.time}
                      </span>
                      <span className="event-meta-item">
                        <FaMapMarkerAlt />
                        {event.location}
                      </span>
                      <span className="event-meta-item">
                        <FaUsers />
                        Max {event.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>
                <div className="event-status-badges">
                  <div className={`event-priority-badge priority-${event.priority}`}>
                    {event.priority}
                  </div>
                  <div className={`event-status-badge status-${event.status.replace('-', '')}`}>
                    {event.status.replace('-', ' ')}
                  </div>
                </div>
              </div>

              <div className="event-item-content">
                <div className="event-description">
                  <p>{event.description.substring(0, 150)}...</p>
                </div>

                <div className="event-stats">
                  <div className="event-stat-item">
                    <span className="event-label">Volunteers Needed:</span>
                    <span className="event-value">{event.neededVolunteers}</span>
                  </div>
                  <div className="event-stat-item">
                    <span className="event-label">Category:</span>
                    <span className="event-value">{event.eventCategory}</span>
                  </div>
                  <div className="event-stat-item">
                    <span className="event-label">Created:</span>
                    <span className="event-value">{formatDate(event.created_at)}</span>
                  </div>
                  {event.organizerRating && (
                    <div className="event-stat-item">
                      <span className="event-label">Rating:</span>
                      <span className="event-value">
                        <FaStar className="event-star-icon" />
                        {event.organizerRating}
                      </span>
                    </div>
                  )}
                  {event.reportCount > 0 && (
                    <div className="event-stat-item">
                      <span className="event-label">Reports:</span>
                      <span className="event-value warning">{event.reportCount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="event-item-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate(`/dashboard/moderation/events/details/${event.id}`)}
                >
                  <FaEye /> View Details
                </Button>
                {canModerate(event) && event.status==='pending' && (
                  <>
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => { moderate(event.id,'approve'); }}
                      disabled={moderating===Number(event.id)}
                    >
                      {moderating===Number(event.id)? '...' : '✓ Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => { moderate(event.id,'reject'); }}
                      disabled={moderating===Number(event.id)}
                    >
                      {moderating===Number(event.id)? '...' : '✗ Reject'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventModeration;