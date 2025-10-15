import React, { useState, useEffect } from "react";
import SessionCard from "./SessionCard";
import SessionDetailsModal from "./SessionDetailsModal";
import { sessionsService, type Session } from "../../services/sessionsService";
import "../../styles/pages/learner/AstronomySessionsPage.scss";

const UpcomingSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionsService.getSessions({
        session_type: 'live',
        is_enabled: true,
        sort_by: 'session_date',
        sort_order: 'asc',
        limit: 50
      });
      setSessions(response.data);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Failed to load sessions');
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
    
    const matchesDifficulty = difficulty === '' || s.difficulty_level === difficulty;
    const matchesPayment = paymentType === '' || s.payment_type === paymentType;
    
    return matchesSearch && matchesDifficulty && matchesPayment;
  });

  const uniqueDifficulties = Array.from(new Set(sessions.map(s => s.difficulty_level)));

  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="upcoming-sessions">
        <h3>Upcoming Live Sessions</h3>
        <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          Loading sessions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-sessions">
        <h3>Upcoming Live Sessions</h3>
        <div style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-sessions">
      <h3>Upcoming Live Sessions</h3>
      <div style={{ display: 'flex', gap: '1rem', margin: '0.7rem 0 1.2rem 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by title or instructor"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '0.45rem 0.8rem', borderRadius: 7, border: '1.5px solid #334155', background: '#232b3b', color: '#e5e7eb', fontSize: '1rem', outline: 'none', minWidth: 180 }}
        />
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          style={{ padding: '0.45rem 0.8rem', borderRadius: 7, border: '1.5px solid #334155', background: '#232b3b', color: '#e5e7eb', fontSize: '1rem', outline: 'none' }}
        >
          <option value="">All Difficulties</option>
          {uniqueDifficulties.map(d => (
            <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
          ))}
        </select>
        <select
          value={paymentType}
          onChange={e => setPaymentType(e.target.value)}
          style={{ padding: '0.45rem 0.8rem', borderRadius: 7, border: '1.5px solid #334155', background: '#232b3b', color: '#e5e7eb', fontSize: '1rem', outline: 'none' }}
        >
          <option value="">All Types</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div className="upcoming-sessions-list">
        {filtered.map((session) => {
          const creatorName = session.creator?.display_name || 
            `${session.creator?.first_name || ''} ${session.creator?.last_name || ''}`.trim() || 
            'Unknown';
          
          return (
            <SessionCard
              key={session.id}
              id={session.id}
              title={session.title}
              date={new Date(session.session_date).toLocaleDateString()}
              organizer={creatorName}
              category={session.payment_type}
              difficulty={session.difficulty_level}
              description={session.description}
              duration={session.duration}
              price={session.price}
              onViewDetails={() => handleViewDetails(session)}
            />
          );
        })}
        {filtered.length === 0 && (
          <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>
            No sessions found.
          </div>
        )}
      </div>

      <SessionDetailsModal
        session={selectedSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegister={(sessionId) => {
          console.log('Register for session:', sessionId);
          // TODO: Implement registration logic
        }}
      />
    </div>
  );
};

export default UpcomingSessions;
