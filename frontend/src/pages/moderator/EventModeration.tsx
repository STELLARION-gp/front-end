import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, MapPin, Users, Star, CheckCircle, XCircle, AlertTriangle, Clock, Eye, Shield, Camera, BookOpen } from 'lucide-react';
import './EventModeration.scss';

interface Event {
  id: string;
  title: string;
  description: string;
  organizer: {
    name: string;
    avatar: string;
    userId: string;
    rating: number;
    totalEvents: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
  };
  details: {
    type: 'observation' | 'workshop' | 'photography' | 'social' | 'educational';
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
    duration: string;
    maxParticipants: number;
    currentParticipants: number;
    waitlistCount: number;
  };
  schedule: {
    startDate: string;
    endDate: string;
    timezone: string;
    recurring: boolean;
    recurringPattern?: string;
  };
  location: {
    type: 'online' | 'in-person' | 'hybrid';
    name: string;
    address?: string;
    coordinates?: [number, number];
    accessibilityInfo?: string;
  };
  requirements: {
    equipment: string[];
    experience: string;
    ageRestriction?: string;
    physicalRequirements?: string;
  };
  costs: {
    isFree: boolean;
    registrationFee?: number;
    materialFee?: number;
    cancellationPolicy: string;
  };
  content: {
    objectives: string[];
    agenda: string[];
    materials: string[];
    prerequisites: string[];
  };
  safety: {
    riskLevel: 'low' | 'medium' | 'high';
    safetyMeasures: string[];
    emergencyProcedures: string;
    insuranceCoverage: boolean;
  };
  status: 'pending' | 'approved' | 'rejected' | 'needs-review' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  moderationNotes: string[];
  reportCount: number;
  submittedAt: string;
  lastModified: string;
  approvalDeadline: string;
  tags: string[];
  visibility: 'public' | 'members-only' | 'private';
}

const EventModeration: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: 'event-001',
        title: 'Introduction to Astrophotography: Capturing the Night Sky',
        description: 'Learn the fundamentals of astrophotography in this comprehensive workshop. We\'ll cover camera settings, equipment selection, post-processing techniques, and composition strategies for stunning astronomical images.',
        organizer: {
          name: 'Dr. Maria Gonzalez',
          avatar: 'MG',
          userId: 'user_123',
          rating: 4.9,
          totalEvents: 47,
          verificationStatus: 'verified'
        },
        details: {
          type: 'workshop',
          category: 'Photography',
          difficulty: 'beginner',
          duration: '3 hours',
          maxParticipants: 20,
          currentParticipants: 15,
          waitlistCount: 8
        },
        schedule: {
          startDate: '2024-02-15T19:00:00Z',
          endDate: '2024-02-15T22:00:00Z',
          timezone: 'UTC-8',
          recurring: false
        },
        location: {
          type: 'hybrid',
          name: 'Griffith Observatory - Los Angeles',
          address: '2800 E Observatory Rd, Los Angeles, CA 90027',
          coordinates: [34.1184, -118.3004],
          accessibilityInfo: 'Wheelchair accessible, parking available'
        },
        requirements: {
          equipment: ['DSLR or mirrorless camera', 'Tripod', 'Laptop'],
          experience: 'Basic photography knowledge helpful but not required',
          ageRestriction: '16+ (minors require guardian)',
          physicalRequirements: 'Ability to stand for extended periods'
        },
        costs: {
          isFree: false,
          registrationFee: 45,
          materialFee: 10,
          cancellationPolicy: 'Full refund 48 hours prior to event'
        },
        content: {
          objectives: [
            'Understand camera settings for night sky photography',
            'Learn composition techniques for astronomical subjects',
            'Master basic post-processing workflows',
            'Identify optimal shooting conditions'
          ],
          agenda: [
            'Equipment overview and setup (30 min)',
            'Camera settings and techniques (60 min)',
            'Hands-on shooting practice (90 min)',
            'Post-processing demonstration (30 min)',
            'Q&A and resource sharing (10 min)'
          ],
          materials: ['Course handouts', 'Equipment checklist', 'Processing software trial'],
          prerequisites: ['Basic camera operation', 'Own DSLR/mirrorless camera']
        },
        safety: {
          riskLevel: 'low',
          safetyMeasures: ['Well-lit venue', 'Security present', 'First aid kit available'],
          emergencyProcedures: 'Contact venue security or call 911',
          insuranceCoverage: true
        },
        status: 'pending',
        priority: 'high',
        moderationNotes: [],
        reportCount: 0,
        submittedAt: '2024-01-20T10:30:00Z',
        lastModified: '2024-01-22T14:15:00Z',
        approvalDeadline: '2024-02-01T23:59:59Z',
        tags: ['astrophotography', 'workshop', 'beginner-friendly', 'equipment-required'],
        visibility: 'public'
      },
      {
        id: 'event-002',
        title: 'Virtual Messier Marathon: Exploring Deep Sky Objects',
        description: 'Join us for an online observing session where we\'ll virtually tour Charles Messier\'s famous catalog of deep sky objects. Perfect for cloudy nights or urban observers.',
        organizer: {
          name: 'Alex Thompson',
          avatar: 'AT',
          userId: 'user_456',
          rating: 4.6,
          totalEvents: 23,
          verificationStatus: 'pending'
        },
        details: {
          type: 'observation',
          category: 'Deep Sky',
          difficulty: 'intermediate',
          duration: '2.5 hours',
          maxParticipants: 100,
          currentParticipants: 67,
          waitlistCount: 0
        },
        schedule: {
          startDate: '2024-02-10T01:00:00Z',
          endDate: '2024-02-10T03:30:00Z',
          timezone: 'UTC',
          recurring: true,
          recurringPattern: 'Monthly on new moon'
        },
        location: {
          type: 'online',
          name: 'Zoom Meeting',
          accessibilityInfo: 'Closed captions available, screen reader compatible'
        },
        requirements: {
          equipment: ['Computer or tablet', 'Stable internet connection'],
          experience: 'Basic knowledge of constellations recommended',
          ageRestriction: 'All ages welcome'
        },
        costs: {
          isFree: true,
          cancellationPolicy: 'No cancellation fee - free event'
        },
        content: {
          objectives: [
            'Learn about Messier objects and their significance',
            'Understand different types of deep sky objects',
            'Practice using star charts and finding techniques',
            'Build observing skills for future field sessions'
          ],
          agenda: [
            'Introduction to Charles Messier (15 min)',
            'Object types and characteristics (30 min)',
            'Virtual tour of selected objects (90 min)',
            'Finding techniques and tips (20 min)',
            'Upcoming observing opportunities (15 min)'
          ],
          materials: ['Digital star charts', 'Object fact sheets', 'Recording of session'],
          prerequisites: ['Basic astronomy interest', 'Familiarity with major constellations']
        },
        safety: {
          riskLevel: 'low',
          safetyMeasures: ['Secure meeting platform', 'Moderated chat', 'Recording for review'],
          emergencyProcedures: 'Contact event moderator via platform',
          insuranceCoverage: false
        },
        status: 'needs-review',
        priority: 'medium',
        moderationNotes: ['Organizer verification pending', 'Check recurring event policy'],
        reportCount: 1,
        submittedAt: '2024-01-18T16:45:00Z',
        lastModified: '2024-01-25T09:20:00Z',
        approvalDeadline: '2024-02-05T23:59:59Z',
        tags: ['virtual', 'messier', 'deep-sky', 'beginner-friendly', 'free'],
        visibility: 'public'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesType = filterType === 'all' || event.details.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApprove = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'approved' as const } : event
    ));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleReject = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'rejected' as const } : event
    ));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const handleRequestChanges = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'needs-review' as const } : event
    ));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, status: 'needs-review' } : null);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'observation': return <Eye size={14} />;
      case 'workshop': return <Users size={14} />;
      case 'photography': return <Camera size={14} />;
      case 'social': return <Users size={14} />;
      case 'educational': return <BookOpen size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="event-moderation">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-moderation">
      <div className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" title="Back to Moderation Dashboard">
              <ArrowLeft size={20} />
            </button>
            <div className="title-section">
              <h1>Event Moderation</h1>
              <p>Review and approve community events and workshops</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{events.filter(e => e.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{events.filter(e => e.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{events.filter(e => e.reportCount > 0).length}</span>
              <span className="stat-label">Reported</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{events.reduce((sum, e) => sum + e.details.currentParticipants, 0)}</span>
              <span className="stat-label">Total Participants</span>
            </div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search events, organizers, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-tabs">
            {['all', 'pending', 'approved', 'needs-review', 'rejected'].map(status => (
              <button
                key={status}
                className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status === 'all' ? 'All Status' : status.replace('-', ' ')}
              </button>
            ))}
          </div>
          
          <div className="type-filters">
            {['all', 'observation', 'workshop', 'photography', 'social', 'educational'].map(type => (
              <button
                key={type}
                className={`type-filter ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="moderation-content">
        <div className="events-list">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={`event-item ${selectedEvent?.id === event.id ? 'selected' : ''}`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-header">
                <div className="event-info">
                  <div className="event-details">
                    <div className="event-title-row">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-type">
                        {getEventTypeIcon(event.details.type)}
                        <span>{event.details.type}</span>
                      </div>
                    </div>
                    <div className="organizer-info">
                      <div className="organizer-avatar">{event.organizer.avatar}</div>
                      <div>
                        <p className="organizer-name">
                          {event.organizer.name}
                          {event.organizer.verificationStatus === 'verified' && (
                            <Shield size={12} className="verified-icon" />
                          )}
                        </p>
                        <div className="organizer-stats">
                          <Star size={12} />
                          <span>{event.organizer.rating}</span>
                          <span>•</span>
                          <span>{event.organizer.totalEvents} events</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="status-badges">
                  <span className={`priority-badge priority-${event.priority}`}>
                    {event.priority}
                  </span>
                  <span className={`status-badge status-${event.status}`}>
                    {event.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="event-content">
                <div className="event-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(event.schedule.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{event.location.name}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={14} />
                    <span>{event.details.currentParticipants}/{event.details.maxParticipants}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{event.details.duration}</span>
                  </div>
                </div>

                <div className="event-tags">
                  {event.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {event.tags.length > 3 && (
                    <span className="tag-more">+{event.tags.length - 3}</span>
                  )}
                </div>

                {event.reportCount > 0 && (
                  <div className="report-warning">
                    <AlertTriangle size={14} />
                    <span>{event.reportCount} report{event.reportCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <div className="event-actions">
                <button
                  className="action-btn approve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(event.id);
                  }}
                  title="Approve Event"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className="action-btn review-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestChanges(event.id);
                  }}
                  title="Request Changes"
                >
                  <Clock size={16} />
                </button>
                <button
                  className="action-btn reject-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(event.id);
                  }}
                  title="Reject Event"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedEvent && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>Event Details</h3>
              <button className="close-panel" onClick={() => setSelectedEvent(null)}>
                ×
              </button>
            </div>
            
            <div className="panel-content">
              <div className="detail-section">
                <h4>Event Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Title:</label>
                    <span>{selectedEvent.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span className="event-type-badge">{selectedEvent.details.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span>{selectedEvent.details.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Difficulty:</label>
                    <span className="difficulty-badge">{selectedEvent.details.difficulty}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{selectedEvent.details.duration}</span>
                  </div>
                  <div className="detail-item">
                    <label>Visibility:</label>
                    <span className="visibility-badge">{selectedEvent.visibility}</span>
                  </div>
                </div>
                <div className="description-section">
                  <label>Description:</label>
                  <div className="description-text">{selectedEvent.description}</div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Schedule & Location</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Start:</label>
                    <span>{new Date(selectedEvent.schedule.startDate).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>End:</label>
                    <span>{new Date(selectedEvent.schedule.endDate).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Timezone:</label>
                    <span>{selectedEvent.schedule.timezone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location Type:</label>
                    <span className="location-type">{selectedEvent.location.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Venue:</label>
                    <span>{selectedEvent.location.name}</span>
                  </div>
                  {selectedEvent.location.address && (
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedEvent.location.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Participants & Costs</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Max Participants:</label>
                    <span>{selectedEvent.details.maxParticipants}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current:</label>
                    <span>{selectedEvent.details.currentParticipants}</span>
                  </div>
                  <div className="detail-item">
                    <label>Waitlist:</label>
                    <span>{selectedEvent.details.waitlistCount}</span>
                  </div>
                  <div className="detail-item">
                    <label>Is Free:</label>
                    <span className={selectedEvent.costs.isFree ? 'free-event' : 'paid-event'}>
                      {selectedEvent.costs.isFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {!selectedEvent.costs.isFree && (
                    <>
                      {selectedEvent.costs.registrationFee && (
                        <div className="detail-item">
                          <label>Registration Fee:</label>
                          <span>${selectedEvent.costs.registrationFee}</span>
                        </div>
                      )}
                      {selectedEvent.costs.materialFee && (
                        <div className="detail-item">
                          <label>Material Fee:</label>
                          <span>${selectedEvent.costs.materialFee}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Requirements & Safety</h4>
                <div className="requirements-grid">
                  <div className="requirement-category">
                    <label>Equipment Needed:</label>
                    <ul>
                      {selectedEvent.requirements.equipment.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="requirement-category">
                    <label>Experience Level:</label>
                    <p>{selectedEvent.requirements.experience}</p>
                  </div>
                  {selectedEvent.requirements.ageRestriction && (
                    <div className="requirement-category">
                      <label>Age Restrictions:</label>
                      <p>{selectedEvent.requirements.ageRestriction}</p>
                    </div>
                  )}
                </div>
                <div className="safety-info">
                  <div className="detail-item">
                    <label>Risk Level:</label>
                    <span className={`risk-level risk-${selectedEvent.safety.riskLevel}`}>
                      {selectedEvent.safety.riskLevel}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Insurance Coverage:</label>
                    <span className={selectedEvent.safety.insuranceCoverage ? 'covered' : 'not-covered'}>
                      {selectedEvent.safety.insuranceCoverage ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Content & Objectives</h4>
                <div className="content-lists">
                  <div className="content-category">
                    <label>Learning Objectives:</label>
                    <ul>
                      {selectedEvent.content.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="content-category">
                    <label>Agenda:</label>
                    <ul>
                      {selectedEvent.content.agenda.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Tags & Moderation</h4>
                <div className="tags-display">
                  <label>Tags:</label>
                  <div className="tags-list">
                    {selectedEvent.tags.map(tag => (
                      <span key={tag} className="tag-display">{tag}</span>
                    ))}
                  </div>
                </div>
                {selectedEvent.moderationNotes.length > 0 && (
                  <div className="moderation-notes">
                    <label>Moderation Notes:</label>
                    <ul>
                      {selectedEvent.moderationNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="panel-actions">
              <button className="panel-btn approve" onClick={() => handleApprove(selectedEvent.id)}>
                <CheckCircle size={16} />
                Approve
              </button>
              <button className="panel-btn review" onClick={() => handleRequestChanges(selectedEvent.id)}>
                <Clock size={16} />
                Request Changes
              </button>
              <button className="panel-btn reject" onClick={() => handleReject(selectedEvent.id)}>
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModeration;
