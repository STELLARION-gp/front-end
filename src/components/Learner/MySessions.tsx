import React, { useState, useEffect } from "react";
import RecordedSessionCard from "./RecordedSessionCard";
import SessionDetailsModal from "./SessionDetailsModal";
import { sessionsService, type Session } from "../../services/sessionsService";
import "../../styles/components/learner/MySessions.scss";

const MySessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch only enrolled sessions for the authenticated user
      const response = await sessionsService.getEnrolledSessions({
        limit: 100,
        sort_by: 'enrollment_date',
        sort_order: 'desc'
      });
      setSessions(response.data);
    } catch (err: any) {
      console.error('Error fetching enrolled sessions:', err);
      setError(err.message || 'Failed to load your enrolled sessions');
    } finally {
      setLoading(false);
    }
  };

  const filtered = sessions.filter((s) => {
    const creatorName = s.creator?.display_name || 
      `${s.creator?.first_name || ''} ${s.creator?.last_name || ''}`.trim();
    
    const matchesSearch = search === '' || 
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      creatorName.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = sessionType === '' || s.session_type === sessionType;
    
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="my-sessions">
        <h3>My Sessions</h3>
        <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          Loading your sessions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-sessions">
        <h3>My Sessions</h3>
        <div style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          {error}
        </div>
        <button 
          onClick={fetchMySessions}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-sessions">
      <h3>My Sessions</h3>
      <p className="my-sessions-subtitle">
        View and access all your enrolled sessions
      </p>
      
      <div className="my-sessions-filters">
        <input
          type="text"
          placeholder="Search your sessions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={sessionType}
          onChange={e => setSessionType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="live">Live Sessions</option>
          <option value="recorded">Recorded Sessions</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="no-sessions">
          {search || sessionType ? (
            <div>
              <p>No sessions found matching your filters.</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSessionType('');
                }}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h4>No Enrolled Sessions Yet</h4>
              <p>You haven't enrolled in any sessions yet.</p>
              <p>Browse our live and recorded sessions to get started!</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="sessions-count">
            Showing {filtered.length} session{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="my-sessions-list">
            {filtered.map((session) => {
              const creatorName = session.creator?.display_name || 
                `${session.creator?.first_name || ''} ${session.creator?.last_name || ''}`.trim() || 
                'Unknown';
              
              const sessionDate = new Date(session.session_date);
              const formattedDate = sessionDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              
              return (
                <RecordedSessionCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  date={formattedDate}
                  instructor={creatorName}
                  category={session.payment_type}
                  difficulty={session.difficulty_level}
                  description={session.description}
                  duration={session.duration}
                  price={session.price}
                  onViewDetails={() => handleViewDetails(session)}
                />
              );
            })}
          </div>
        </>
      )}

      <SessionDetailsModal
        session={selectedSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default MySessions;
