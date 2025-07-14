import React, { useState, useEffect } from 'react';
import '../../styles/pages/mentor/mentees.scss';
import signupImg from '../../assets/signup.jpg';
import groupChatIcon from '../../assets/groupchat.png';
import { useNavigate } from 'react-router-dom';
import { useMentee } from '../../contexts/MenteeContext';

const mentees = [
  { id: 1, name: 'Luna Skywatchet', img: signupImg },
  { id: 2, name: 'Luna Skywatchet', img: signupImg },
  { id: 3, name: 'Luna Skywatchet', img: signupImg },
  { id: 4, name: 'Luna Skywatchet', img: signupImg },
  { id: 5, name: 'Luna Skywatchet', img: signupImg },
  { id: 6, name: 'Luna Skywatchet', img: signupImg },
  { id: 7, name: 'Luna Skywatchet', img: signupImg },
  { id: 8, name: 'Luna Skywatchet', img: signupImg },
  { id: 9, name: 'Luna Skywatchet', img: signupImg }
];

const Mentees: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { setMenteeCount } = useMentee();
  const filteredMentees = mentees.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  // Update mentee count in real-time
  useEffect(() => {
    setMenteeCount(filteredMentees.length);
  }, [filteredMentees.length, setMenteeCount]);

  return (
    <>
      <div className="dashboard-page mentor-dashboard mentor-dashboard-large mentees-page">
        <div className="mentees-header-row">
          <h2 className="mentees-title">Mentees</h2>
          <div className="mentees-search-container">
            <input
              type="text"
              className="mentees-search-input"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search mentees"
            />
            <span className="mentees-search-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="#64748b" strokeWidth="2" />
                <line x1="16.3" y1="16.3" x2="21" y2="21" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
        <div className="mentees-grid">
          {filteredMentees.map((mentee) => (
            <div className="mentee-card" key={mentee.id}>
              <img src={mentee.img} alt={mentee.name} className="mentee-avatar" />
              <div className="mentee-name">{mentee.name}</div>
              <button className="mentee-info-btn" onClick={() => navigate('/dashboard/mentee-profile')}>View</button>
            </div>
          ))}
        </div>
        <div className="mentees-see-more-wrapper">
          <button className="mentees-see-more">See More</button>
        </div>
      </div>
      <div className="mentees-groupchat-icon" onClick={() => navigate('/dashboard/groupchat')} style={{ cursor: 'pointer' }}>
        <img src={groupChatIcon} alt="Group Chat" style={{ width: 38, height: 38 }} />
      </div>
    </>
  );
};

export default Mentees; 