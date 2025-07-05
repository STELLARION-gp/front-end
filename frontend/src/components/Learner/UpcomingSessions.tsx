import React, { useState } from "react";
import SessionCard from "./SessionCard";
import { upcomingSessions } from "./upcomingSessionsData";
import "../../styles/pages/learner/AstronomySessionsPage.scss";

const UpcomingSessions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");


  const filtered = upcomingSessions.filter((s) =>
    (s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.organizer.toLowerCase().includes(search.toLowerCase())) &&
    (difficulty ? s.difficulty === difficulty : true) &&
    (category ? s.category === category : true)
  );

  const uniqueDifficulties = Array.from(new Set(upcomingSessions.map(s => s.difficulty)));
  const uniqueCategories = Array.from(new Set(upcomingSessions.map(s => s.category)));

  return (
    <div className="upcoming-sessions">
      <h3>Upcoming Live Sessions</h3>
      <div style={{ display: 'flex', gap: '1rem', margin: '0.7rem 0 1.2rem 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by title or organizer"
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
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '0.45rem 0.8rem', borderRadius: 7, border: '1.5px solid #334155', background: '#232b3b', color: '#e5e7eb', fontSize: '1rem', outline: 'none' }}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="upcoming-sessions-list">
        {filtered.map((session) => (
          <SessionCard key={session.id} {...session} />
        ))}
        {filtered.length === 0 && <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>No sessions found.</div>}
      </div>
    </div>
  );
};

export default UpcomingSessions;
