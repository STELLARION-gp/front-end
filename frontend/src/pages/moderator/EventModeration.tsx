import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/EventModeration.scss';

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
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
}

const EventModeration: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for platform events
  useEffect(() => {
    const mockEvents: PlatformEvent[] = [
      {
        id: 'event-001',
        eventName: 'Astronomy Workshop 2024',
        societyName: 'Space Explorers Society',
        date: '2024-03-15',
        time: '18:00',
        location: 'Main Campus Auditorium',
        eventCategory: 'Workshop',
        neededVolunteers: 5,
        description: 'Learn about celestial navigation and telescope handling in this hands-on workshop.',
        organizedBy: 'Dr. Sarah Chen',
        imageUrls: ['img1.jpg', 'img2.jpg'],
        maxParticipants: 50,
        eventStatus: 'finalized',
        created_at: '2024-01-10T10:30:00Z',
        status: 'pending',
        priority: 'high',
        reportCount: 0
      },
      {
        id: 'event-002',
        eventName: 'Annual Stargazing Night',
        societyName: 'Astronomy Club',
        date: '2024-04-20',
        time: '20:00',
        location: 'University Observatory',
        eventCategory: 'Observation',
        neededVolunteers: 8,
        description: 'Join us for a night of stargazing with professional telescopes and guided tours of the night sky.',
        organizedBy: 'Prof. James Wilson',
        imageUrls: ['img3.jpg'],
        maxParticipants: 100,
        eventStatus: 'organized',
        created_at: '2024-01-15T14:20:00Z',
        status: 'approved',
        priority: 'medium',
        reportCount: 0
      },
      {
        id: 'event-003',
        eventName: 'Cosmic Photography Contest',
        societyName: 'Photography Society',
        date: '2024-05-10',
        time: '14:00',
        location: 'Arts Building Gallery',
        eventCategory: 'Competition',
        neededVolunteers: 3,
        description: 'Submit your best astrophotography shots for a chance to win prizes and exhibition space.',
        organizedBy: 'Lisa Thompson',
        imageUrls: [],
        maxParticipants: 30,
        eventStatus: 'draft',
        created_at: '2024-01-05T09:15:00Z',
        status: 'needs-review',
        priority: 'low',
        reportCount: 2
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'approved' as const } : event
    ));
  };

  const handleReject = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'rejected' as const } : event
    ));
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

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
          {['all', 'pending', 'approved', 'needs-review', 'rejected'].map(filter => (
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
                    <span className="event-label">Status:</span>
                    <span className="event-value">{event.eventStatus}</span>
                  </div>
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
                <Button
                  variant="success"
                  size="small"
                  onClick={() => handleApprove(event.id)}
                  disabled={event.status === 'approved'}
                >
                  ✓ Approve
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleReject(event.id)}
                  disabled={event.status === 'rejected'}
                >
                  ✗ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventModeration;