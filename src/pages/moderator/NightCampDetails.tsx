import React, { useState, useEffect, useContext } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheck, FaTimes, FaClock, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/pages/moderator/NightCampDetails.scss';

interface NightCamp {
  id: number;
  name: string;
  organized_by?: string;
  sponsored_by?: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  number_of_participants: number;
  image_urls: string[];
  emergency_contact?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  activities: Array<{
    id: number;
    night_camp_id: number;
    activity: string;
    created_at: string;
  }>;
  equipment: Array<{
    id: number;
    night_camp_id: number;
    category: 'provided' | 'required' | 'optional';
    equipment_name: string;
    created_at: string;
  }>;
  volunteering: Array<{
    id: number;
    night_camp_id: number;
    volunteering_role: string;
    number_of_applicants: number;
    created_at: string;
  }>;
}

interface VolunteeringApplication {
  id: number;
  night_camp_id: number;
  user_id: number;
  volunteering_role: string;
  motivation: string;
  experience: string;
  availability: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  reviewed_by?: number;
  review_date?: string;
  review_notes?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_display_name?: string;
  reviewed_by_name?: string;
}

const NightCampDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);
  const [camp, setCamp] = useState<NightCamp | null>(null);
  const [applications, setApplications] = useState<VolunteeringApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check authentication
    if (!authContext?.user) {
      navigate('/login');
      return;
    }

    // Check if user has moderator or admin role
    if (authContext.userProfile?.role !== 'moderator' && authContext.userProfile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (id) {
      fetchNightCamp();
    }
  }, [id, navigate, authContext]);

  // Fetch applications when volunteering tab is active
  useEffect(() => {
    if (activeTab === 'volunteering' && camp && id) {
      fetchApplications();
    }
  }, [activeTab, camp, id]);

  const fetchNightCamp = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/nightcamps/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch night camp details');
      }

      const result = await response.json();
      setCamp(result.data);
    } catch (error) {
      console.error('Error fetching night camp:', error);
      setError('Failed to load night camp details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!id || !authContext?.user) return;

    try {
      setApplicationsLoading(true);
      const token = await authContext.user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/nightcamps/${id}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const result = await response.json();
      setApplications(result.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId: number) => {
    if (!authContext?.user) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this application? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const token = await authContext.user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/nightcamps/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      // Remove the application from the state
      setApplications(prev => prev.filter(app => app.id !== applicationId));
      
      // Refresh the camp data to update volunteer counts
      fetchNightCamp();
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to delete application');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: number, status: 'approved' | 'rejected', reviewNotes?: string) => {
    if (!authContext?.user) return;

    try {
      const token = await authContext.user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/nightcamps/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status, 
          review_notes: reviewNotes || '' 
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status} application`);
      }

      // Update the application status in the state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status, review_date: new Date().toISOString(), review_notes: reviewNotes }
            : app
        )
      );
      
      // Refresh the camp data to update volunteer counts
      fetchNightCamp();
    } catch (error) {
      console.error(`Error ${status}ing application:`, error);
      setError(`Failed to ${status} application`);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!camp || !authContext?.user) return;

    try {
      const token = await authContext.user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/nightcamps/${camp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setCamp(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const getEquipmentByCategory = (category: 'provided' | 'required' | 'optional') => {
    return camp?.equipment?.filter(item => item.category === category) || [];
  };

  if (loading) {
    return (
      <div className="nightcamp-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/night-camps')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Loading Night Camp Details...</h1>
                <p>Please wait while we fetch the camp information</p>
              </div>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="nightcamp-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/night-camps')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Night Camp Not Found</h1>
                <p>{error || 'The requested night camp could not be found'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="error-actions">
          <Button variant="primary" onClick={fetchNightCamp}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="nightcamp-details">
      {/* Header */}
      <div className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation/night-camps')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>{camp.name}</h1>
              <p>Night Camp Event Details & Moderation</p>
            </div>
          </div>
          <div className="header-badges">
            <div className={`status-badge status-${camp.status || 'pending'}`}>
              {camp.status || 'pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="details-nav">
        <div className="nav-tabs">
          {['overview', 'activities', 'equipment', 'volunteering'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'border'}
              size="small"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="details-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="content-grid">
              <div className="main-section">
                <div className="info-card">
                  <h3>Event Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <strong>Date:</strong>
                        <span>{formatDate(camp.date)} {camp.time && `at ${formatTime(camp.time)}`}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <div>
                        <strong>Location:</strong>
                        <span>{camp.location}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaUsers />
                      <div>
                        <strong>Max Participants:</strong>
                        <span>{camp.number_of_participants}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Description</h3>
                  <p>{camp.description || 'No description provided'}</p>
                </div>

                <div className="info-card">
                  <h3>Organizer Information</h3>
                  <div className="organizer-details">
                    <div className="info-item">
                      <strong>Organized by:</strong>
                      <span>{camp.organized_by || 'Not specified'}</span>
                    </div>
                    {camp.sponsored_by && (
                      <div className="info-item">
                        <strong>Sponsored by:</strong>
                        <span>{camp.sponsored_by}</span>
                      </div>
                    )}
                    {camp.emergency_contact && (
                      <div className="info-item">
                        <strong>Emergency Contact:</strong>
                        <span>{camp.emergency_contact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {camp.image_urls && camp.image_urls.length > 0 && (
                  <div className="info-card">
                    <h3>Images</h3>
                    <div className="image-gallery">
                      {camp.image_urls.map((url, index) => (
                        <img 
                          key={index} 
                          src={url} 
                          alt={`Camp image ${index + 1}`}
                          className="camp-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{camp.activities?.length || 0}</span>
                      <span className="stat-label">Activities</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{camp.equipment?.length || 0}</span>
                      <span className="stat-label">Equipment Items</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{camp.volunteering?.length || 0}</span>
                      <span className="stat-label">Volunteer Roles</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{camp.number_of_participants}</span>
                      <span className="stat-label">Max Participants</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Timestamps</h3>
                  <div className="timestamp-info">
                    <div className="timestamp-item">
                      <strong>Created:</strong>
                      <span>{formatDate(camp.created_at)}</span>
                    </div>
                    <div className="timestamp-item">
                      <strong>Last Updated:</strong>
                      <span>{formatDate(camp.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="activities-tab">
            <div className="info-card">
              <h3>Activities ({camp.activities?.length || 0})</h3>
              {camp.activities && camp.activities.length > 0 ? (
                <div className="activities-list">
                  {camp.activities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <FaCheck className="check-icon" />
                      <span>{activity.activity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No activities specified for this night camp.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="equipment-tab">
            <div className="info-card">
              <h3>Equipment ({camp.equipment?.length || 0} items)</h3>
              <div className="equipment-sections">
                <div className="equipment-section">
                  <h4>Provided Equipment</h4>
                  <ul>
                    {getEquipmentByCategory('provided').map((item) => (
                      <li key={item.id}>{item.equipment_name}</li>
                    ))}
                  </ul>
                  {getEquipmentByCategory('provided').length === 0 && (
                    <p className="no-data">No provided equipment listed.</p>
                  )}
                </div>
                <div className="equipment-section">
                  <h4>Required Equipment</h4>
                  <ul>
                    {getEquipmentByCategory('required').map((item) => (
                      <li key={item.id}>{item.equipment_name}</li>
                    ))}
                  </ul>
                  {getEquipmentByCategory('required').length === 0 && (
                    <p className="no-data">No required equipment listed.</p>
                  )}
                </div>
                <div className="equipment-section">
                  <h4>Optional Equipment</h4>
                  <ul>
                    {getEquipmentByCategory('optional').map((item) => (
                      <li key={item.id}>{item.equipment_name}</li>
                    ))}
                  </ul>
                  {getEquipmentByCategory('optional').length === 0 && (
                    <p className="no-data">No optional equipment listed.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'volunteering' && (
          <div className="volunteering-tab">
            <div className="info-card">
              <h3>Volunteering Opportunities ({camp.volunteering?.length || 0})</h3>
              {camp.volunteering && camp.volunteering.length > 0 ? (
                <div className="volunteering-list">
                  {camp.volunteering.map((role) => (
                    <div key={role.id} className="volunteering-item">
                      <div className="role-info">
                        <h4>{role.volunteering_role}</h4>
                        <span className="applicant-count">
                          {role.number_of_applicants} applicant{role.number_of_applicants !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No volunteering opportunities specified for this night camp.</p>
              )}
            </div>

            <div className="info-card">
              <h3>Volunteer Applications ({applications.length})</h3>
              {applicationsLoading ? (
                <div className="loading-applications">
                  <div className="loading-spinner small"></div>
                  <span>Loading applications...</span>
                </div>
              ) : applications.length > 0 ? (
                <div className="applications-list">
                  {applications.map((application) => (
                    <div key={application.id} className="application-item">
                      <div className="application-header">
                        <div className="applicant-info">
                          <h4 className="applicant-name">
                            <FaUser className="icon" />
                            {application.applicant_name || application.applicant_display_name}
                          </h4>
                          <span className="applicant-email">
                            <FaEnvelope className="icon" />
                            {application.applicant_email}
                          </span>
                        </div>
                        <div className="application-actions">
                          <div className={`status-badge status-${application.status}`}>
                            {application.status}
                          </div>
                          {application.status === 'pending' && (
                            <div className="action-buttons">
                              <Button
                                variant="success"
                                size="small"
                                onClick={() => handleUpdateApplicationStatus(application.id, 'approved')}
                              >
                                <FaCheck /> Approve
                              </Button>
                              <Button
                                variant="warning"
                                size="small"
                                onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                              >
                                <FaTimes /> Reject
                              </Button>
                            </div>
                          )}
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleDeleteApplication(application.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="application-details">
                        <div className="detail-row">
                          <strong>Role:</strong> {application.volunteering_role}
                        </div>
                        <div className="detail-row">
                          <strong>Applied:</strong> {formatDate(application.application_date)}
                        </div>
                        {application.review_date && (
                          <div className="detail-row">
                            <strong>Reviewed:</strong> {formatDate(application.review_date)}
                            {application.reviewed_by_name && (
                              <span className="reviewer"> by {application.reviewed_by_name}</span>
                            )}
                          </div>
                        )}
                        {application.review_notes && (
                          <div className="detail-row">
                            <strong>Review Notes:</strong>
                            <p className="review-notes">{application.review_notes}</p>
                          </div>
                        )}
                        <div className="detail-row">
                          <strong>Motivation:</strong>
                          <p className="motivation-text">{application.motivation}</p>
                        </div>
                        {application.experience && (
                          <div className="detail-row">
                            <strong>Experience:</strong>
                            <p className="experience-text">{application.experience}</p>
                          </div>
                        )}
                        {application.availability && (
                          <div className="detail-row">
                            <strong>Availability:</strong>
                            <p className="availability-text">{application.availability}</p>
                          </div>
                        )}
                        {application.emergency_contact_name && (
                          <div className="detail-row">
                            <strong>Emergency Contact:</strong>
                            <div className="emergency-contact">
                              <span>{application.emergency_contact_name}</span>
                              {application.emergency_contact_phone && (
                                <span className="phone">
                                  <FaPhone className="icon" />
                                  {application.emergency_contact_phone}
                                </span>
                              )}
                              {application.emergency_contact_relationship && (
                                <span className="relationship">({application.emergency_contact_relationship})</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No volunteer applications received yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="details-actions">
        <Button
          variant="success"
          size="medium"
          onClick={() => handleStatusUpdate('approved')}
          disabled={camp.status === 'approved'}
        >
          <FaCheck /> Approve Event
        </Button>
        <Button
          variant="warning"
          size="medium"
          onClick={() => handleStatusUpdate('needs-review')}
          disabled={camp.status === 'needs-review'}
        >
          <FaClock /> Request Changes
        </Button>
        <Button
          variant="danger"
          size="medium"
          onClick={() => handleStatusUpdate('rejected')}
          disabled={camp.status === 'rejected'}
        >
          <FaTimes /> Reject Event
        </Button>
        <Button
          variant="ghost"
          size="medium"
          onClick={() => navigate(`/dashboard/moderation/night-camps/edit/${camp.id}`)}
        >
          <FaEdit /> Edit Event
        </Button>
      </div>
    </div>
  );
};

export default NightCampDetails;
