import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import RequestCard from '../../components/mentor/RequestCard';
import avatarImg from '../../assets/world.png';
import '../../styles/pages/mentor/mentorprofile.scss';
// navigation not used here
import '../../styles/pages/mentor/menteeProfile.scss';

// runtime requests state (fetched from backend)
type Req = any;


const MentorshipRequest: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Req | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mentor-requests');
      const json = await res.json();
      if (json.success) setRequests(json.data || []);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await fetch(`/api/mentor-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      fetchRequests();
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('Accept failed', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`/api/mentor-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      fetchRequests();
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/mentor-requests/${id}`);
      const json = await res.json();
      if (json.success) setSelected(json.data);
      else setSelected(null);
    } catch (err) {
      console.error('Failed to load details', err);
    }
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

  {loading && <div style={{ color: '#a0aec0', marginBottom: 12 }}>Loading...</div>}
  {viewMode === 'cards' ? (
        // Card View
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          width: '100%'
        }}>
          {requests.map((req: Req) => (
            <RequestCard
              key={req.id}
              request={req}
              onAccept={() => handleAccept(String(req.id))}
              onReject={() => handleReject(String(req.id))}
              onViewDetails={() => handleViewDetails(String(req.id))}
            />
          ))}
        </div>
      ) : (
        // List View (Original)
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', margin: '0 auto' }}>
          {requests.map((req: Req) => (
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
                <Button className="mentor-btn-blue mentor-btn-small" onClick={() => handleViewDetails(String(req.id))}>
                  Details
                </Button>
                <Button className="mentor-btn-green mentor-btn-small" onClick={() => handleAccept(String(req.id))}>
                  Accept
                </Button>
                <Button className="mentor-btn-red mentor-btn-small" onClick={() => handleReject(String(req.id))}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selected && (
        <div className="mentee-modal-overlay" onClick={() => setSelected(null)}>
          <div className="mentee-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mentee-modal-title">{selected.name || 'Request Details'}</div>
            <div style={{ color: '#a0aec0', marginBottom: 12 }}>{selected.email}</div>
            <div style={{ color: '#fff', marginBottom: 12 }}>{selected.message}</div>
            <div style={{ color: '#94a3b8', marginBottom: 12 }}><strong>Goals:</strong> {selected.goals}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button className="mentor-btn-green" onClick={() => handleAccept(String(selected.id))}>Accept</Button>
              <Button className="mentor-btn-red" onClick={() => handleReject(String(selected.id))}>Reject</Button>
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipRequest;