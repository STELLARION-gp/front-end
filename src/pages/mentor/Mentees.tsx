import React, { useState, useEffect } from 'react';
import '../../styles/pages/mentor/mentees.scss';
import signupImg from '../../assets/signup.webp';
import groupChatIcon from '../../assets/groupchat.png';
import { useNavigate } from 'react-router-dom';
import { useMentee } from '../../contexts/mentor/MenteeContext';
import StudentCard from '../../components/mentor/StudentCard';

// Enhanced mentees data structure
const mentees = [
  { 
    id: 1, 
    name: 'Luna Skywatcher', 
    img: signupImg,
    level: 'Advanced',
    interests: 'Astrophotography, Deep Space Objects',
    description: 'Passionate about capturing the beauty of nebulae and galaxies. Currently working on improving long-exposure techniques.',
    joinDate: '2024-01-15',
    isActive: true,
    progress: 85,
    sessionsCompleted: 12
  },
  { 
    id: 2, 
    name: 'Heshan Malith', 
    img: signupImg,
    level: 'Intermediate',
    interests: 'Planetary Science, Solar System',
    description: 'Enthusiastic about studying planetary formations and atmospheric phenomena across our solar system.',
    joinDate: '2024-02-03',
    isActive: true,
    progress: 68,
    sessionsCompleted: 8
  },
  { 
    id: 3, 
    name: 'Senesh Dinelka', 
    img: signupImg,
    level: 'Beginner',
    interests: 'Telescopes, Stargazing',
    description: 'New to astronomy but very eager to learn. Interested in getting started with basic telescope observations.',
    joinDate: '2024-02-20',
    isActive: true,
    progress: 32,
    sessionsCompleted: 3
  },
  { 
    id: 4, 
    name: 'Kalindu Mendis', 
    img: signupImg,
    level: 'Intermediate',
    interests: 'Cosmology, Dark Matter',
    description: 'Fascinated by the mysteries of dark matter and the large-scale structure of the universe.',
    joinDate: '2024-01-28',
    isActive: true,
    progress: 72,
    sessionsCompleted: 10
  },
  { 
    id: 5, 
    name: 'Maleesha Tharindu', 
    img: signupImg,
    level: 'Advanced',
    interests: 'Stellar Evolution, Binary Stars',
    description: 'Studying the lifecycle of stars and the dynamics of binary star systems.',
    joinDate: '2024-01-10',
    isActive: true,
    progress: 91,
    sessionsCompleted: 15
  },
  { 
    id: 6, 
    name: 'Adam Sam', 
    img: signupImg,
    level: 'Beginner',
    interests: 'Moon Phases, Constellation Mapping',
    description: 'Just starting out with astronomy. Very interested in learning about moon phases and identifying constellations.',
    joinDate: '2024-02-25',
    isActive: true,
    progress: 25,
    sessionsCompleted: 2
  },
  { 
    id: 7, 
    name: 'Freddy Johnas', 
    img: signupImg,
    level: 'Intermediate',
    interests: 'Exoplanets, SETI',
    description: 'Passionate about the search for extraterrestrial life and studying potentially habitable exoplanets.',
    joinDate: '2024-02-08',
    isActive: true,
    progress: 55,
    sessionsCompleted: 6
  },
  { 
    id: 8, 
    name: 'Liam Collins', 
    img: signupImg,
    level: 'Advanced',
    interests: 'Radio Astronomy, Pulsars',
    description: 'Working on understanding radio signals from space, particularly interested in pulsar research.',
    joinDate: '2024-01-18',
    isActive: true,
    progress: 88,
    sessionsCompleted: 14
  },
  { 
    id: 9, 
    name: 'Andrew Swane', 
    img: signupImg,
    level: 'Beginner',
    interests: 'Solar Observation, Meteor Showers',
    description: 'Interested in safe solar observation techniques and tracking annual meteor shower events.',
    joinDate: '2024-02-22',
    isActive: false,
    progress: 18,
    sessionsCompleted: 1
  }
];

const Mentees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'joinDate'>('name');
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  const { setMenteeCount } = useMentee();

  // Filter and sort mentees
  const filteredMentees = mentees
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .filter(m => showInactive || m.isActive)
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.progress - a.progress;
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const visibleMentees = filteredMentees.slice(0, visibleCount);
  const hasMore = filteredMentees.length > visibleCount;

  // Update mentee count in real-time
  useEffect(() => {
    setMenteeCount(filteredMentees.filter(m => m.isActive).length);
  }, [filteredMentees, setMenteeCount]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [search, showInactive, sortBy]);

  const handleViewProfile = (menteeId: number) => {
    navigate(`/dashboard/mentee-profile/${menteeId}`);
  };

  const handleMessage = (menteeId: number) => {
    navigate(`/dashboard/chat/${menteeId}`);
  };

  const handleScheduleSession = (menteeId: number) => {
    navigate(`/dashboard/schedule-session/${menteeId}`);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleClearSearch = () => {
    setSearch('');
    setShowInactive(false);
    setSortBy('name');
  };

  return (
    <>
      <div className="dashboard-page mentor-dashboard mentor-dashboard-large mentees-page">
        <div className="mentees-header">
          <div className="mentees-header-row">
        <h2 className="mentees-title">
          My Mentees <span className="mentees-count">({filteredMentees.filter(m => m.isActive).length})</span>
        </h2>
        <div className="mentees-view-toggle">
          <button className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view" title="Grid View">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg>
          </button>
          <button className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')} aria-label="Card view" title="Card View">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v4H4V4zm0 6h16v4H4v-4zm0 6h16v4H4v-4z"/></svg>
          </button>
        </div>
          </div>
          <div className="mentees-controls">
        <div className="mentees-search-container">
          <input type="text" className="mentees-search-input" placeholder="Search mentees..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search mentees" />
          <span className="mentees-search-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="#64748b" strokeWidth="2" /><line x1="16.3" y1="16.3" x2="21" y2="21" stroke="#64748b" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
        </div>
        <div className="mentees-filters">
          <select className="mentees-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'progress' | 'joinDate')}>
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="joinDate">Sort by Join Date</option>
          </select>
          <label className="mentees-checkbox-label">
            <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} /> Show Inactive
          </label>
        </div>
          </div>
        </div>
        {viewMode === 'cards' ? (
          <div className="mentees-cards-grid">
        {visibleMentees.map((mentee) => (
          <StudentCard key={mentee.id} student={{ id: mentee.id, name: mentee.name, level: mentee.level, interests: mentee.interests, description: mentee.description, joinDate: mentee.joinDate, image: mentee.img, isActive: mentee.isActive }} onAccept={handleViewProfile} onMessage={handleMessage} onScheduleSession={handleScheduleSession} />
        ))}
          </div>
        ) : (
          <div className="mentees-grid">
        {visibleMentees.map((mentee) => (
          <div className={`mentee-card ${!mentee.isActive ? 'inactive' : ''}`} key={mentee.id}>
            <img src={mentee.img} alt={mentee.name} className="mentee-avatar" />
            <div className="mentee-info">
          <div className="mentee-name">{mentee.name}</div>
          <div className="mentee-level">{mentee.level}</div>
          <div className="mentee-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${mentee.progress}%` }}></div>
            </div>
            <span className="progress-text">{mentee.progress}%</span>
          </div>
          <div className="mentee-sessions">{mentee.sessionsCompleted} sessions completed</div>
            </div>
            <div className="mentee-actions">
          <button className="mentee-info-btn primary" onClick={() => handleViewProfile(mentee.id)}>View Profile</button>
          <button className="mentee-info-btn secondary" onClick={() => handleMessage(mentee.id)}>Message</button>
            </div>
            {!mentee.isActive && <div className="inactive-badge">Inactive</div>}
          </div>
        ))}
          </div>
        )}
        {filteredMentees.length === 0 && (
          <div className="no-mentees">
        <div className="no-mentees-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <p>No mentees found matching your criteria.</p>
        {(search || showInactive || sortBy !== 'name') && <button className="clear-search-btn" onClick={handleClearSearch}>Clear All Filters</button>}
          </div>
        )}
        {hasMore && <div className="mentees-see-more-wrapper"><button className="mentees-see-more" onClick={handleLoadMore}>Load More Mentees ({filteredMentees.length - visibleCount} remaining)</button></div>}
        {filteredMentees.length > 0 && (
          <div className="mentees-summary">
        <div className="summary-item"><span className="summary-label">Total Mentees:</span> <span className="summary-value">{filteredMentees.length}</span></div>
        <div className="summary-item"><span className="summary-label">Active:</span> <span className="summary-value">{filteredMentees.filter(m => m.isActive).length}</span></div>
        <div className="summary-item"><span className="summary-label">Average Progress:</span> <span className="summary-value">{Math.round(filteredMentees.reduce((acc, m) => acc + m.progress, 0) / filteredMentees.length)}%</span></div>
          </div>
        )}
      </div>

      {/* Group Chat Icon */}
      <div 
        className="mentees-groupchat-icon" 
        onClick={() => navigate('/dashboard/groupchat')} 
        style={{ cursor: 'pointer' }}
        title="Open Group Chat"
      >
        <img src={groupChatIcon} alt="Group Chat" style={{ width: 38, height: 38 }} />
        <div className="chat-badge">
          {filteredMentees.filter(m => m.isActive).length}
        </div>
      </div>
    </>
  );
};

export default Mentees;