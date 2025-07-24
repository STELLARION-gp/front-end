import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { nightCampService, type VolunteerManagementData } from '../../services/nightCampService';
import '../../styles/pages/enthusiast/VolunteerManagement.scss';

const VolunteerManagement: React.FC = () => {
  const { nightCampId } = useParams<{ nightCampId: string }>();
  const navigate = useNavigate();
  
  const [managementData, setManagementData] = useState<VolunteerManagementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

  useEffect(() => {
    if (nightCampId) {
      loadVolunteerManagementData();
    }
  }, [nightCampId]);

  const loadVolunteerManagementData = async () => {
    if (!nightCampId) return;
    
    setError(null);
    
    try {
      const data = await nightCampService.getVolunteerManagement(parseInt(nightCampId));
      setManagementData(data);
    } catch (error) {
      console.error('Error loading volunteer management data:', error);
      setError('Failed to load volunteer management data. Please try again.');
    }
  };

  const handleApproveRegistration = async (registrationId: number) => {
    setActionLoading(registrationId);
    
    try {
      await nightCampService.approveRegistrationByVolunteer(registrationId);
      alert('Registration approved successfully!');
      await loadVolunteerManagementData(); // Refresh data
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Failed to approve registration. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRegistration = async (registrationId: number) => {
    const reason = rejectReason[registrationId] || '';
    setActionLoading(registrationId);
    
    try {
      await nightCampService.rejectRegistrationByVolunteer(registrationId, reason);
      alert('Registration rejected successfully!');
      setShowRejectModal(null);
      setRejectReason(prev => ({ ...prev, [registrationId]: '' }));
      await loadVolunteerManagementData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Failed to reject registration. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (registrationId: number) => {
    setShowRejectModal(registrationId);
  };

  const closeRejectModal = () => {
    setShowRejectModal(null);
    setRejectReason(prev => ({ ...prev, [showRejectModal!]: '' }));
  };

  if (error) {
    return (
      <div className="volunteer-management">
        <div className="volunteer-management__header">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/enthusiast/night-camps')}
            className="back-button"
          >
            ← Back to Night Camps
          </Button>
          <h1>Volunteer Management</h1>
        </div>
        <div className="error-message">
          {error}
          <Button onClick={loadVolunteerManagementData} className="retry-button">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!managementData) {
    return (
      <div className="volunteer-management">
        <div className="volunteer-management__header">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/enthusiast/night-camps')}
            className="back-button"
          >
            ← Back to Night Camps
          </Button>
          <h1>Volunteer Management</h1>
        </div>
        <div className="no-data-message">No volunteer management data available.</div>
      </div>
    );
  }

  return (
    <div className="volunteer-management">
      <div className="volunteer-management__container">
        <div className="volunteer-management__header">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/night-camps')}
            className="back-button"
          >
            ← Back to Night Camps
          </Button>
          <h1>Volunteer Management</h1>
        </div>

      {/* Camp Overview */}
      <div className="camp-overview">
        <h3>{managementData.nightCamp.name}</h3>
        <div className="camp-content">
          <div className="camp-details">
            <div className="camp-detail-item">
              <CalendarIcon className="icon" />
              <span>{new Date(managementData.nightCamp.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              {managementData.nightCamp.time && (
                <span className="time-detail"> at {managementData.nightCamp.time}</span>
              )}
            </div>
            <div className="camp-detail-item">
              <MapPinIcon className="icon" />
              <span>{managementData.nightCamp.location}</span>
            </div>
            <div className="camp-detail-item">
              <UsersIcon className="icon" />
              <span>
                {managementData.totalApproved} / {managementData.maxCapacity} participants
                ({managementData.availableSlots} slots available)
              </span>
            </div>
          </div>
          
          {/* Additional Camp Details */}
          <div className="camp-additional-details">
            {managementData.nightCamp.description && (
              <div className="detail-section">
                <h4>Description</h4>
                <p>{managementData.nightCamp.description}</p>
              </div>
            )}
            
            {managementData.nightCamp.organized_by && (
              <div className="detail-section">
                <h4>Organized By</h4>
                <p>{managementData.nightCamp.organized_by}</p>
              </div>
            )}
            
            {managementData.nightCamp.sponsored_by && (
              <div className="detail-section">
                <h4>Sponsored By</h4>
                <p>{managementData.nightCamp.sponsored_by}</p>
              </div>
            )}
            
            {managementData.nightCamp.emergency_contact && (
              <div className="detail-section">
                <h4>Emergency Contact</h4>
                <p>{managementData.nightCamp.emergency_contact}</p>
              </div>
            )}

            {managementData.nightCamp.activities && managementData.nightCamp.activities.length > 0 && (
              <div className="detail-section">
                <h4>Activities</h4>
                <div className="activities-list">
                  {managementData.nightCamp.activities.map((activity, index) => (
                    <span key={index} className="activity-tag">{activity.activity}</span>
                  ))}
                </div>
              </div>
            )}

            {managementData.nightCamp.equipment && managementData.nightCamp.equipment.length > 0 && (
              <div className="detail-section">
                <h4>Equipment</h4>
                <div className="equipment-list">
                  {managementData.nightCamp.equipment.map((equipment, index) => (
                    <span key={index} className="equipment-tag">
                      {equipment.category}: {equipment.equipment_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Volunteers */}
      <div className="volunteers-section">
        <h3>Current Volunteers ({managementData.volunteers.length})</h3>
        <div className="volunteers-content">
          {managementData.volunteers.length > 0 ? (
            <div className="volunteers-grid">
              {managementData.volunteers.map((volunteer) => (
                <div key={volunteer.id} className="volunteer-card">
                  <div className="volunteer-info">
                    <UserIcon className="volunteer-icon" />
                    <div className="volunteer-details">
                      <span className="volunteer-name">{volunteer.user_name}</span>
                      <span className="volunteer-email">{volunteer.email}</span>
                      <span className="volunteer-role">{volunteer.volunteering_role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-volunteers">No volunteers currently assigned to this camp.</div>
          )}
        </div>
      </div>

      {/* Pending Registrations */}
      <div className="pending-registrations-section">
        <h3>Pending Registrations ({managementData.pendingRegistrations.length})</h3>
        <div className="registrations-content">
          {managementData.pendingRegistrations.length > 0 ? (
            <div className="registrations-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managementData.pendingRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td>{registration.user_name}</td>
                      <td>{registration.email}</td>
                      <td>{new Date(registration.registration_date).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => handleApproveRegistration(registration.id)}
                          disabled={actionLoading === registration.id || managementData.availableSlots <= 0}
                          className="approve-btn"
                        >
                          {actionLoading === registration.id ? (
                            'Approving...'
                          ) : (
                            <>
                              <CheckCircleIcon className="action-icon" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => openRejectModal(registration.id)}
                          disabled={actionLoading === registration.id}
                          className="reject-btn"
                        >
                          <XMarkIcon className="action-icon" />
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-registrations">No pending registrations at this time.</div>
          )}
        </div>
      </div>

      {/* Approved Registrations */}
      <div className="approved-registrations-section">
        <h3>Approved Participants ({managementData.approvedRegistrations.length})</h3>
        <div className="registrations-content">
          {managementData.approvedRegistrations.length > 0 ? (
            <div className="registrations-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {managementData.approvedRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td>{registration.user_name}</td>
                      <td>{registration.email}</td>
                      <td>{new Date(registration.registration_date).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge status-approved">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-registrations">No approved participants yet.</div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Reject Registration</h3>
            <p>Please provide a reason for rejecting this registration (optional):</p>
            <textarea
              value={rejectReason[showRejectModal] || ''}
              onChange={(e) => setRejectReason(prev => ({ 
                ...prev, 
                [showRejectModal]: e.target.value 
              }))}
              placeholder="Enter reason for rejection..."
              rows={4}
              className="reject-reason-textarea"
            />
            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={closeRejectModal}
                disabled={actionLoading === showRejectModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRejectRegistration(showRejectModal)}
                disabled={actionLoading === showRejectModal}
                className="confirm-reject-btn"
              >
                {actionLoading === showRejectModal ? 'Rejecting...' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default VolunteerManagement;