import React, { useState } from 'react';
import Button from '../../components/Button';
import RequestCard from '../../components/mentor/RequestCard';
import avatarImg from '../../assets/world.png';
import signupImg from '../../assets/signup.webp';
import '../../styles/pages/mentor/mentorprofile.scss';
import { useNavigate } from 'react-router-dom';

// Enhanced requests data
const requests = [
  {
    id: 1,
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    details: 'Aspiring astrophysicist, 2nd year BSc',
    level: 'Intermediate',
    interests: 'Stellar Evolution, Neutron Stars',
    motivation: 'I am passionate about understanding how stars evolve and die. I would love to learn more about neutron stars and their properties.',
    background: 'Physics undergraduate with strong mathematical foundation. Completed courses in quantum mechanics and thermodynamics.',
    requestDate: '2024-08-15',
    urgency: 'medium' as const,
    expectedDuration: '6 months',
    preferredMeetingTime: 'Weekends',
    goals: 'Learn advanced astrophysics concepts and research methodologies',
    image: signupImg
  },
  {
    id: 2,
    name: 'Tom Lee',
    email: 'tom.lee@gradschool.edu',
    details: 'Interested in exoplanets, 1st year MSc',
    level: 'Advanced',
    interests: 'Exoplanets, Habitable Zones',
    motivation: 'Currently working on my MSc thesis about potentially habitable exoplanets. Need guidance on research direction and methodology.',
    background: 'MSc student in Astronomy. Published one paper on planetary atmospheres. Working with space telescope data.',
    requestDate: '2024-08-14',
    urgency: 'high' as const,
    expectedDuration: '12 months',
    preferredMeetingTime: 'Weekday evenings',
    goals: 'Complete MSc thesis and prepare for PhD applications',
    image: signupImg
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya.patel@student.ac.uk',
    details: 'Wants to learn about black holes',
    level: 'Beginner',
    interests: 'Black Holes, General Relativity',
    motivation: 'Fascinated by black holes after watching documentaries. Want to understand the science behind them and maybe pursue astronomy.',
    background: 'Computer Science student with strong math skills. Self-taught basic astronomy through online courses.',
    requestDate: '2024-08-13',
    urgency: 'low' as const,
    expectedDuration: '3 months',
    preferredMeetingTime: 'Flexible',
    goals: 'Understand black hole physics and determine if astronomy is right career path',
    image: signupImg
  }
];

const MentorshipRequest: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const navigate = useNavigate();

  const handleAccept = (id: number) => {
    console.log('Accepting request:', id);
    navigate('/dashboard/mentordashboard');
  };

  const handleReject = (id: number) => {
    console.log('Rejecting request:', id);
    navigate('/dashboard/mentordashboard');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/menteerequest/${id}`);
  };

  return (
    <div className="dashboard-page mentor-dashboard mentor-dashboard-large" style={{ minHeight: '100vh', width: '100%', background: 'rgba(59,130,246,0.07)', borderRadius: 16, padding: '2rem', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>Mentorship Requests ({requests.length})</h2>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              background: viewMode === 'list' ? '#6366f1' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode('cards')}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              background: viewMode === 'cards' ? '#6366f1' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Card View
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        // Card View
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          width: '100%'
        }}>
          {requests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              onAccept={handleAccept}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        // List View (Original)
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', margin: '0 auto' }}>
          {requests.map(req => (
            <div key={req.id} className="advanced-features mentor-profile-field-box" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '1rem 2rem', minWidth: 400, maxWidth: 1200, width: '100%' }}>
              <img src={req.image || avatarImg} alt={req.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#1a202c' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '1.08rem', color: '#fff' }}>{req.name}</div>
                <div style={{ color: '#a0aec0', fontSize: '1rem', marginTop: 2 }}>{req.details}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
                  <strong>Interests:</strong> {req.interests}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
                <Button className="mentor-btn-blue mentor-btn-small" onClick={() => handleViewDetails(req.id)}>
                  Details
                </Button>
                <Button className="mentor-btn-green mentor-btn-small" onClick={() => handleAccept(req.id)}>
                  Accept
                </Button>
                <Button className="mentor-btn-red mentor-btn-small" onClick={() => handleReject(req.id)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorshipRequest;