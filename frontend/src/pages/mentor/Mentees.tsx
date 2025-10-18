// pages/mentor/Mentees.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedApplications, type MenteeApplication } from '../../services/menteeApplicationApi';
import Button from '../../components/Button';

const Mentees: React.FC = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<MenteeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMentees();
    // Add pulse animation and responsive styles
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @media (max-width: 1200px) {
        .mentor-mentees-grid-responsive {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchMentees = async () => {
    try {
      setLoading(true);
      const data = await getReceivedApplications();
      // Filter only accepted applications
      const acceptedMentees = data.filter(app => app.application_status === 'accepted');
      setMentees(acceptedMentees);
      setError('');
    } catch (err: any) {
      console.error('Error fetching mentees:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load mentees.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentees = mentees.filter(mentee => {
    const searchLower = searchQuery.toLowerCase();
    const displayName = mentee.learner?.display_name || '';
    const firstName = mentee.learner?.first_name || '';
    const lastName = mentee.learner?.last_name || '';
    const email = mentee.learner?.email || '';
    
    return (
      displayName.toLowerCase().includes(searchLower) ||
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    );
  });

  const handleMenteeClick = (applicationId: number) => {
    navigate(`/dashboard/mentee-profile/${applicationId}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#c7d0e6' }}>
          Loading mentees...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '2.5rem' }}>My Mentees</h1>
        <p style={{ color: '#c7d0e6', fontSize: '1.1rem' }}>Connect and manage your mentee relationships</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#ef4444'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search mentees by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1',
            minWidth: '300px',
            padding: '0.9rem 1.2rem',
            background: '#19223a',
            border: '2px solid #2e3a5e',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
        />
        <span style={{
          padding: '0.9rem 1.5rem',
          background: '#19223a',
          border: '2px solid #2e3a5e',
          borderRadius: '12px',
          color: '#4f8cff',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          {filteredMentees.length} {filteredMentees.length === 1 ? 'Mentee' : 'Mentees'}
        </span>
      </div>

      {/* Mentees Grid */}
      {filteredMentees.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#19223a',
          border: '2px dashed #2e3a5e',
          borderRadius: '12px'
        }}>
          {searchQuery ? (
            <p style={{ color: '#c7d0e6', fontSize: '1.1rem', marginBottom: '1rem' }}>
              No mentees found matching "{searchQuery}"
            </p>
          ) : (
            <>
              <p style={{ color: '#c7d0e6', fontSize: '1.1rem', marginBottom: '1rem' }}>
                You don't have any mentees yet.
              </p>
              <p style={{ color: '#c7d0e6', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Accept mentee applications to start mentoring!
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/mentor/mentee-applications')}
              >
                View Applications
              </Button>
            </>
          )}
        </div>
      ) : (
        <div 
          className="mentor-mentees-grid-responsive"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}
        >
          {filteredMentees.map((mentee) => {
            const learner = mentee.learner;
            const displayName = learner?.display_name || 
                               `${learner?.first_name || ''} ${learner?.last_name || ''}`.trim() || 
                               'Anonymous';
            
            return (
              <div 
                key={mentee.application_id} 
                onClick={() => handleMenteeClick(mentee.application_id)}
                style={{
                  background: '#19223a',
                  border: '2px solid #2e3a5e',
                  borderRadius: '16px',
                  padding: '2rem',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4f8cff';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 140, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2e3a5e';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f8cff 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    border: '3px solid #2e3a5e',
                    flexShrink: '0'
                  }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '20px',
                    color: '#22c55e',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      animation: 'pulse 2s infinite'
                    }}></span>
                    Active
                  </span>
                </div>

                <div style={{ flex: '1' }}>
                  <h3 style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                    margin: '0 0 0.5rem 0',
                    fontWeight: '700'
                  }}>
                    {displayName}
                  </h3>
                  <p style={{
                    color: '#8b93ab',
                    margin: '0 0 1rem 0',
                    fontSize: '0.95rem'
                  }}>
                    📧 {learner?.email}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <span style={{
                      color: '#8b93ab',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      📅 Connected: {new Date(mentee.reviewed_at || mentee.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  {mentee.interest_statement && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: '#0f1629',
                      borderRadius: '8px',
                      border: '1px solid #2e3a5e'
                    }}>
                      <strong style={{
                        color: '#4f8cff',
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem'
                      }}>
                        Interest:
                      </strong>
                      <p style={{
                        color: '#c7d0e6',
                        margin: '0',
                        lineHeight: '1.5',
                        fontSize: '0.95rem'
                      }}>
                        {mentee.interest_statement.length > 80 
                          ? `${mentee.interest_statement.substring(0, 80)}...` 
                          : mentee.interest_statement}
                      </p>
                    </div>
                  )}
                </div>

                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #2e3a5e'
                  }}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => handleMenteeClick(mentee.application_id)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Mentees;
