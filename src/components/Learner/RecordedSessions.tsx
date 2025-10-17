import React, { useState, useEffect } from "react";
import RecordedSessionCard from "./RecordedSessionCard";
import SessionDetailsModal from "./SessionDetailsModal";
import { sessionsService, type Session } from "../../services/sessionsService";
import "../../styles/pages/learner/RecordedSessionCard.scss";

const RecordedSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRecordedSessions();
  }, []);

  const fetchRecordedSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionsService.getSessions({
        session_type: 'recorded',
        is_enabled: true,
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: 50
      });
      setSessions(response.data);
    } catch (err: any) {
      console.error('Error fetching recorded sessions:', err);
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
      <div className="recorded-sessions">
        <h3>Recorded Sessions</h3>
        <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          Loading sessions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recorded-sessions">
        <h3>Recorded Sessions</h3>
        <div style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '1.1rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="recorded-sessions">
      <h3>Recorded Sessions</h3>
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
      <div className="recorded-sessions-list">
        {filtered.map((session) => {
          const creatorName = session.creator?.display_name || 
            `${session.creator?.first_name || ''} ${session.creator?.last_name || ''}`.trim() || 
            'Unknown';
          
          return (
            <RecordedSessionCard
              key={session.id}
              id={session.id}
              title={session.title}
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
      />
    </div>
  );
};

export default RecordedSessions;
