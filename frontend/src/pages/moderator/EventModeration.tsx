import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/EventModeration.scss';

interface Event {
  Id: string;
  Event_name: string;
  Description: string;
  Visibility: 'public' | 'private' | 'unlisted';
  Best_time: string;
  Duration: string;
  Date: string;
  Added_person: string; // moderator
  Created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EventModeration: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private' | 'unlisted'>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        Id: '1',
        Event_name: 'Space Exploration Workshop',
        Description: 'Interactive workshop about space exploration and astronomy for beginners.',
        Visibility: 'public',
        Best_time: '18:00',
        Duration: '2 hours',
        Date: '2024-01-15',
        Added_person: 'John Moderator',
        Created_at: '2024-01-10T10:30:00Z',
        status: 'pending'
      },
      {
        Id: '2',
        Event_name: 'Advanced Coding Bootcamp',
        Description: 'Intensive coding session covering advanced programming concepts.',
        Visibility: 'private',
        Best_time: '14:00',
        Duration: '4 hours',
        Date: '2024-01-20',
        Added_person: 'Sarah Tech',
        Created_at: '2024-01-12T14:15:00Z',
        status: 'approved'
      },
      {
        Id: '3',
        Event_name: 'Community Gaming Night',
        Description: 'Fun gaming session for community members to connect and play together.',
        Visibility: 'public',
        Best_time: '20:00',
        Duration: '3 hours',
        Date: '2024-01-18',
        Added_person: 'Mike Game',
        Created_at: '2024-01-11T16:45:00Z',
        status: 'rejected'
      }
    ];
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.Event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.Added_person.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesVisibility = visibilityFilter === 'all' || event.Visibility === visibilityFilter;
      
      return matchesSearch && matchesStatus && matchesVisibility;
    });
    
    setFilteredEvents(filtered);
  }, [searchTerm, statusFilter, visibilityFilter, events]);

  const handleEventAction = (eventId: string, action: 'approve' | 'reject') => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.Id === eventId 
          ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' }
          : event
      )
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return '🌍';
      case 'private': return '🔒';
      case 'unlisted': return '👁️‍🗨️';
      default: return '🌍';
    }
  };

  return (
    <div className="event-moderation">
      <div className="moderation-header">
        <div className="header-content">
          <h1 className="page-title">Event Moderation</h1>
          <p className="page-subtitle">Review and manage community events</p>
        </div>
        <button 
          className="create-button"
          onClick={() => navigate('/dashboard/moderation/events/create')}
        >
          <span className="button-icon">+</span>
          Create Event
        </button>
      </div>

      <div className="moderation-controls">
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search events by name, description, or moderator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
              className="filter-select"
              title="Filter events by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Visibility</label>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'public' | 'private' | 'unlisted')}
              className="filter-select"
              title="Filter events by visibility"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.Id} className="event-card">
            <div className="card-header">
              <div className="event-title-section">
                <h3 className="event-title">{event.Event_name}</h3>
                <div className="event-meta">
                  <span className="visibility-badge">
                    {getVisibilityIcon(event.Visibility)} {event.Visibility}
                  </span>
                  <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-content">
              <p className="event-description">{event.Description}</p>
              
              <div className="event-details">
                <div className="detail-row">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{new Date(event.Date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰ Best Time:</span>
                  <span className="detail-value">{event.Best_time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏱️ Duration:</span>
                  <span className="detail-value">{event.Duration}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👤 Moderator:</span>
                  <span className="detail-value">{event.Added_person}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📝 Created:</span>
                  <span className="detail-value">{new Date(event.Created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="action-button view-button"
                onClick={() => navigate(`/dashboard/moderation/events/details/${event.Id}`)}
              >
                View Details
              </button>
              
              {event.status === 'pending' && (
                <div className="moderation-actions">
                  <button
                    className="action-button approve-button"
                    onClick={() => handleEventAction(event.Id, 'approve')}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="action-button reject-button"
                    onClick={() => handleEventAction(event.Id, 'reject')}
                  >
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3 className="empty-title">No events found</h3>
          <p className="empty-message">
            {searchTerm || statusFilter !== 'all' || visibilityFilter !== 'all'
              ? 'Try adjusting your search criteria or filters'
              : 'No events have been submitted yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventModeration;
