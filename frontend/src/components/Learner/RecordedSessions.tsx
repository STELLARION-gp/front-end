import React, { useState } from "react";
import RecordedSessionCard from "./RecordedSessionCard";
import { recordedSessions } from "./recordedSessionsData";
import "../../styles/pages/learner/RecordedSessionCard.scss";

const RecordedSessions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  const filtered = recordedSessions.filter((s) =>
    (s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase())) &&
    (difficulty ? s.difficulty === difficulty : true) &&
    (category ? s.category === category : true)
  );

  const uniqueDifficulties = Array.from(new Set(recordedSessions.map(s => s.difficulty)));
  const uniqueCategories = Array.from(new Set(recordedSessions.map(s => s.category)));

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
      <div className="recorded-sessions-list">
        {filtered.map((session) => (
          <RecordedSessionCard key={session.id} {...session} />
        ))}
        {filtered.length === 0 && <div style={{ color: '#60a5fa', marginTop: '1.5rem', fontSize: '1.1rem' }}>No sessions found.</div>}
      </div>
    </div>
  );
};

export default RecordedSessions;
