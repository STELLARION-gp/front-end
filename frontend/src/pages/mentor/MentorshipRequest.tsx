import React from 'react';
import Button from '../../components/Button';
import avatarImg from '../../assets/world.png';
import '../../styles/pages/mentor/mentorprofile.scss';
import { useNavigate } from 'react-router-dom';

const requests = [
  { id: 1, name: 'Jane Smith', details: 'Aspiring astrophysicist, 2nd year BSc', img: avatarImg },
  { id: 2, name: 'Tom Lee', details: 'Interested in exoplanets, 1st year MSc', img: avatarImg },
  { id: 3, name: 'Priya Patel', details: 'Wants to learn about black holes', img: avatarImg },
];

const MentorshipRequest = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-page mentor-dashboard mentor-dashboard-large" style={{ minHeight: '100vh', width: '100%', background: 'rgba(59,130,246,0.07)', borderRadius: 16, padding: '2rem', boxSizing: 'border-box' }}>
      <h2>Mentorship Requests</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', margin: '0 auto' }}>
        {requests.map(req => (
          <div key={req.id} className="advanced-features mentor-profile-field-box" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '1rem 2rem', minWidth: 400, maxWidth: 1200, width: '100%' }}>
            <img src={req.img} alt={req.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#1a202c' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#fff' }}>{req.name}</div>
              <div style={{ color: '#a0aec0', fontSize: '1rem', marginTop: 2 }}>{req.details}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
              <Button className="mentor-btn-blue mentor-btn-small" onClick={() => navigate('/dashboard/menteerequest')}>
                Details
              </Button>
              <Button className="mentor-btn-green mentor-btn-small" onClick={() => navigate('/dashboard/mentordashboard')}>
                Accept
              </Button>
              <Button className="mentor-btn-red mentor-btn-small" onClick={() => navigate('/dashboard/mentordashboard')}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipRequest; 