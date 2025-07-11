import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/mentor/menteeProfile.scss';
import signupImg from '../../assets/signup.jpg';
import groupChatIcon from '../../assets/groupchat.png';
import { StarIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const sharedDocs = [
  { id: 1, name: 'No Documents Shared', url: '#' }
];

const rating = 4;

const MenteeRequest: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="dashboard-page mentor-dashboard mentor-dashboard-large mentee-profile-page">
        <div className="mentee-profile-layout">
          {/* Left: Profile Info */}
          <div className="mentee-profile-left">
            <div className="mentee-profile-avatar">
              <img src={signupImg} alt="Mentee Avatar" />
            </div>
            <div className="mentee-profile-info-list">
              <div className="mentee-profile-info-item">
                <label>Full Name</label>
                <div className="value">Luna Skywatchet</div>
              </div>
              <div className="mentee-profile-info-item">
                <label>College</label>
                <div className="value">Stellarion University</div>
              </div>
              <div className="mentee-profile-info-item">
                <label>Email</label>
                <div className="value">luna@stellarion.edu</div>
              </div>
              <div className="mentee-profile-info-item rating">
                <label>Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {[1,2,3,4,5].map((i) => (
                    <StarIcon key={i} style={{ width: 20, color: i <= rating ? '#fbbf24' : '#cbd5e1' }} />
                  ))}
                  <span className="rating-number" style={{ color: '#a0aec0', fontWeight: 500, marginLeft: 8 }}>{`Rated ${rating}.0/5.0`}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Documents & Stats */}
          <div className="mentee-profile-right">
            <div className="mentee-profile-docs-box">
              <div className="mentee-profile-docs-title">Shared documents</div>
              <div className="mentee-profile-docs-list">
                {sharedDocs.map(doc => (
                  <a className="mentee-profile-doc-link" key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer">
                    <DocumentTextIcon className="mentee-profile-doc-icon" />
                    <span className="mentee-profile-doc-title">{doc.name}</span>
                  </a>
                ))}
              </div>
              {/* <button className="mentee-profile-docs-seemore mentor-btn-blue mentor-btn-small">See More</button> */}
            </div>
            <div className="mentee-profile-stats-box">
              <div className="mentee-profile-stats-title">Personal stats</div>
              <div className="mentee-profile-stats-grid">
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Night camps participated</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Sessions participated</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Quiz completed</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">60/100</div>
                  <div className="stat-desc">Quiz average</div>
                </div>
              </div>
              <div className="mentee-profile-stats-actions" style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 18 }}>
                <button className="mentor-btn-blue mentor-btn-small" onClick={() => navigate('/dashboard/mentordashboard')}>Accept</button>
                <button className="mentor-btn-red mentor-btn-small" onClick={() => navigate('/dashboard/mentordashboard')}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mentee-profile-privatechat-icon">
        <img src={groupChatIcon} alt="Private Chat" style={{ width: 38, height: 38 }} />
      </div>
    </>
  );
};

export default MenteeRequest; 