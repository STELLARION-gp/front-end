import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Card, { CardActions, CardContent, CardSubtitle, CardTitle } from '../../components/Card'
import ProgressBar from '../../components/ProgressBar'
import VolunteeringApplicationModal from '../../components/VolunteeringApplicationModal'
import DateIcon from '../../assets/svg/DateIcon'
import TimeIcon from '../../assets/svg/TimeIcon'
import LocationIcon from '../../assets/svg/LocationIcon'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import '../../styles/pages/enthusiast/NightCamps.scss'
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { nightCampService, type NightCampWithDetails, type VolunteeringApplication, type NightCampRegistration } from '../../services/nightCampService';

type ActiveSection = 'upcoming' | 'organizing' | 'registered' | 'volunteers'

const NightCamps = () => {
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();

  // State for real data
  const [realNightCamps, setRealNightCamps] = useState<NightCampWithDetails[]>([]);
  const [userApplications, setUserApplications] = useState<VolunteeringApplication[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<NightCampRegistration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [registrationsError, setRegistrationsError] = useState<string | null>(null);
  const [campConfirmedCounts, setCampConfirmedCounts] = useState<{ [campId: number]: number }>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<NightCampWithDetails | null>(null);
  
  // Details modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCampForDetails, setSelectedCampForDetails] = useState<NightCampWithDetails | null>(null);

  // Load night camps data
  useEffect(() => {
    loadNightCamps();
    if (userRole !== 'learner') {
      loadUserApplications();
    }
    loadUserRegistrations();
  }, [userRole]);

  const loadNightCamps = async () => {
    setError(null);
    try {
      const camps = await nightCampService.getAllNightCamps();
      console.log('Loaded night camps with statuses:', camps.map(camp => ({ id: camp.id, name: camp.name, status: camp.status })));
      setRealNightCamps(camps);
      
      // Load approved counts for each camp
      await loadConfirmedCounts(camps);
    } catch (err) {
      console.error('Failed to load night camps:', err);
      setError('Failed to load night camps. Please try again.');
    }
  };

  const loadConfirmedCounts = async (camps: NightCampWithDetails[]) => {
    const counts: { [campId: number]: number } = {};
    
    // Fetch confirmed registration count for each camp using the public endpoint
    await Promise.all(
      camps.map(async (camp) => {
        try {
          const countData = await nightCampService.getConfirmedRegistrationCount(camp.id);
          counts[camp.id] = countData.confirmedRegistrations;
        } catch (err) {
          console.error(`Failed to load confirmed registration count for camp ${camp.id}:`, err);
          counts[camp.id] = 0; // Default to 0 if we can't fetch the data
        }
      })
    );
    
    setCampConfirmedCounts(counts);
  };

  const loadUserApplications = async () => {
    setApplicationsError(null);
    try {
      const applications = await nightCampService.getUserVolunteeringApplications();
      setUserApplications(applications);
    } catch (err) {
      console.error('Failed to load user applications:', err);
      setApplicationsError('Failed to load your applications. Please try again.');
    }
  };

  const loadUserRegistrations = async () => {
    setRegistrationsError(null);
    try {
      const registrations = await nightCampService.getUserRegistrations();
      setUserRegistrations(registrations);
    } catch (err) {
      console.error('Failed to load user registrations:', err);
      setRegistrationsError('Failed to load your registrations. Please try again.');
    }
  };

  const handleRegisterForCamp = async (campId: number) => {
    try {
      await nightCampService.registerForNightCamp(campId);
      alert('Registration submitted successfully! Your registration is pending approval.');
      // Refresh the registrations list
      loadUserRegistrations();
      // Refresh approved counts for all camps
      await loadConfirmedCounts(realNightCamps);
      // Close any open modals
      setIsDetailsModalOpen(false);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to register for camp:', err);
      alert(err.response?.data?.message || 'Failed to register for camp. Please try again.');
    }
  };

  const handleVolunteerClick = (camp: NightCampWithDetails) => {
    setSelectedCamp(camp);
    setIsModalOpen(true);
  };

  const handleViewDetails = async (campId: number) => {
    try {
      // Get the detailed camp information from the backend
      const campDetails = await nightCampService.getNightCampById(campId);
      if (campDetails) {
        setSelectedCampForDetails(campDetails);
        setIsDetailsModalOpen(true);
      } else {
        alert('Camp not found.');
      }
    } catch (error) {
      console.error('Failed to load camp details:', error);
      alert('Failed to load camp details. Please try again.');
    }
  };

  const handleApplicationSubmit = async (applicationData: {
    volunteering_role: string;
    motivation: string;
    experience: string;
    availability: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
  }) => {
    if (!selectedCamp) return;

    try {
      await nightCampService.applyForVolunteering({
        night_camp_id: selectedCamp.id,
        ...applicationData
      });
      
      alert('Application submitted successfully!');
      setIsModalOpen(false);
      setSelectedCamp(null);
    } catch (error) {
      console.error('Failed to submit application:', error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const handleRoleUpdate = async (applicationId: number, newRole: string) => {
    try {
      await nightCampService.updateUserVolunteeringApplication(applicationId, {
        volunteering_role: newRole
      });
      
      // Refresh applications
      await loadUserApplications();
      setEditingApplication(null);
      alert('Role updated successfully!');
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleCancelApplication = async (applicationId: number, campName: string) => {
    if (window.confirm(`Are you sure you want to cancel your application for "${campName}"?`)) {
      try {
        // Since we don't have a delete endpoint for user's own applications,
        // we could either implement one or handle this differently
        console.log(`Would cancel application ID: ${applicationId}`);
        alert('Cancel functionality would be implemented here');
      } catch (error) {
        console.error('Failed to cancel application:', error);
        alert('Failed to cancel application. Please try again.');
      }
    }
  };

  const handleOpenVolunteerManagement = (nightCampId: number) => {
    navigate(`/dashboard/volunteer-management/${nightCampId}`);
  };

  // Legacy static data for other tabs (keeping existing functionality)
  const [activeSection, setActiveSection] = useState<ActiveSection>('upcoming')
  const [editingApplication, setEditingApplication] = useState<{
    applicationId: number;
    role: string;
    availableRoles: string[];
  } | null>(null);

  const renderContent = () => {
    switch (activeSection) {
      case 'upcoming': {
        if (error) {
          return (
            <div className="upcoming-camps">
              <h2 className="upcoming-camps__title">Upcoming Camps</h2>
              <div className="error-message">
                {error}
                <Button onClick={loadNightCamps} className="retry-button">
                  Try Again
                </Button>
              </div>
            </div>
    );
  }

  // Filter only approved night camps for the upcoming section
  const approvedCamps = realNightCamps.filter(camp => camp.status === 'approved');

  if (approvedCamps.length === 0) {
    return (
      <div className="upcoming-camps">
        <h2 className="upcoming-camps__title">Upcoming Camps</h2>
        <div className="no-camps-message">
          No approved upcoming night camps available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-camps">
      <h2 className="upcoming-camps__title">Upcoming Camps</h2>
      <div className="card-grid card-grid--small">
        {approvedCamps.map((camp, index) => (
          <Card 
            key={camp.id || index}
            variant="elevated"
            hover={true}
            className="card-animate"
          >
            <CardTitle>{camp.name}</CardTitle>
            <CardSubtitle>{camp.description || 'Join us for an amazing night camp experience'}</CardSubtitle>
            <CardContent>
              <div className="camp-info">
                <div className="camp-info__item">
                  <DateIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">
                    {new Date(camp.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {camp.time && (
                  <div className="camp-info__item">
                    <TimeIcon className="camp-info__icon" size={16} />
                    <span className="camp-info__text">{camp.time}</span>
                  </div>
                )}
                <div className="camp-info__item">
                  <LocationIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.location}</span>
                </div>
                <div className="camp-info__item">
                  <ParticipantsIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.number_of_participants} max participants</span>
                </div>
              </div>
              <div className="camp-participation">
                <div className="camp-participation__header">
                  <span className="camp-participation__label">Registration Status</span>
                  <div className="camp-participation__count">
                    <span className="count-numbers">
                      {(campConfirmedCounts[camp.id] || 0)} / {camp.number_of_participants} registered
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  className="progress-bar--participants"
                  current={campConfirmedCounts[camp.id] || 0}
                  max={camp.number_of_participants}
                />
              </div>
            </CardContent>
            <CardActions >
              <Button 
                size="small"
                onClick={() => handleViewDetails(camp.id)}
                className="btn--view-details"
              
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ marginRight: '0.5rem' }}
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Details
              </Button>
              {/* {userRole === 'learner' && ( */}
                <Button 
                  className="btn--night-camps" 
                  onClick={() => handleRegisterForCamp(camp.id)}
                >
                  Register Now
                </Button>
              {/* )} */}
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}
      case 'organizing': {
        if (error) {
          return (
            <div className="volunteer-camps">
              <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
              <div className="error-message">
                {error}
                <Button onClick={loadNightCamps} className="retry-button">
                  Try Again
                </Button>
              </div>
            </div>
          );
        }

        if (realNightCamps.length === 0) {
          return (
            <div className="volunteer-camps">
              <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
              <div className="no-camps-message">
                No night camps available for volunteering at the moment.
              </div>
            </div>
          );
        }

        // Filter only approved night camps for volunteering
        const approvedCampsForVolunteering = realNightCamps.filter(camp => camp.status === 'approved');

        if (approvedCampsForVolunteering.length === 0) {
          return (
            <div className="volunteer-camps">
              <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
              <div className="no-camps-message">
                No approved night camps available for volunteering at the moment.
              </div>
            </div>
          );
        }

        return (
          <div className="volunteer-camps">
            <h2 className="upcoming-camps__title">Join Organizing Committee</h2>
            <div className="card-grid card-grid--medium">
              {approvedCampsForVolunteering.map((camp, index) => (
                <Card 
                  key={camp.id || index}
                  variant="elevated"
                  hover={true}
                  className="card-animate"
                >
                  <CardTitle>{camp.name}</CardTitle>
                  <CardSubtitle>{camp.description || 'Join us for an amazing night camp experience'}</CardSubtitle>
                  <CardContent>
                    <div className="camp-info">
                      <div className="camp-info__item">
                        <DateIcon className="camp-info__icon" size={16} />
                        <span className="camp-info__text">
                          {new Date(camp.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      {camp.time && (
                        <div className="camp-info__item">
                          <TimeIcon className="camp-info__icon" size={16} />
                          <span className="camp-info__text">{camp.time}</span>
                        </div>
                      )}
                      <div className="camp-info__item">
                        <LocationIcon className="camp-info__icon" size={16} />
                        <span className="camp-info__text">{camp.location}</span>
                      </div>
                      <div className="camp-info__item">
                        <ParticipantsIcon className="camp-info__icon" size={16} />
                        <span className="camp-info__text">{camp.number_of_participants} max participants</span>
                      </div>
                      <div className="camp-info__item">
                        <div className="camp-info__roles-header">Available Volunteering Roles</div>
                        <ul className="camp-info__roles">
                          {camp.volunteering && camp.volunteering.length > 0 ? (
                            camp.volunteering.map((volunteer, roleIndex) => (
                              <li key={roleIndex}>{volunteer.volunteering_role}</li>
                            ))
                          ) : (
                            <li>No specific roles listed</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button 
                      className="btn--night-camps"
                      onClick={() => handleVolunteerClick(camp)}
                    >
                      Apply as Volunteer
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </div>
        );
      }
      case 'registered': {
        if (registrationsError) {
          return (
            <div className="registered-camps">
              <h2 className="registered-camps__title">Registered Camps</h2>
              <div className="error">{registrationsError}</div>
            </div>
          );
        }

        const handleCancelRegistration = async (campId: number, campName: string) => {
          if (window.confirm(`Are you sure you want to cancel your registration for "${campName}"?`)) {
            try {
              // Call cancel registration API (would need to be implemented in backend)
              console.log(`Cancelling registration for camp ID: ${campId}`);
              // For now, just refresh the registrations
              loadUserRegistrations();
            } catch (err) {
              console.error('Failed to cancel registration:', err);
              alert('Failed to cancel registration. Please try again.');
            }
          }
        };

        return (
          <div className="registered-camps">
            <h2 className="registered-camps__title">Registered Camps</h2>
            {userRegistrations.length === 0 ? (
              <div className="no-data">You haven't registered for any camps yet.</div>
            ) : (
              <div className="registered-camps__table-container">
                <table className="registered-camps__table">
                  <thead>
                    <tr>
                      <th>Camp Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRegistrations.map((registration) => (
                      <tr key={registration.id} className="registered-camps__row">
                        <td className="registered-camps__cell registered-camps__cell--name">
                          <div className="registered-camps__camp-info">
                            <span className="registered-camps__camp-name">{registration.night_camp_name}</span>
                            <span className="registered-camps__registered-date">
                              Registered: {new Date(registration.registered_date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="registered-camps__cell">
                          <div className="registered-camps__info-item">
                            <DateIcon className="registered-camps__icon" size={14} />
                            <span>{registration.night_camp_date ? new Date(registration.night_camp_date).toLocaleDateString() : 'TBA'}</span>
                          </div>
                        </td>
                        <td className="registered-camps__cell">
                          <div className="registered-camps__info-item">
                            <TimeIcon className="registered-camps__icon" size={14} />
                            <span>{registration.night_camp_time || 'TBA'}</span>
                          </div>
                        </td>
                        <td className="registered-camps__cell">
                          <div className="registered-camps__info-item">
                            <LocationIcon className="registered-camps__icon" size={14} />
                            <span>{registration.night_camp_location || 'TBA'}</span>
                          </div>
                        </td>
                        <td className="registered-camps__cell">
                          <span className={`registered-camps__status registered-camps__status--${registration.status.toLowerCase()}`}>
                            {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                          </span>
                        </td>
                        <td className="registered-camps__cell registered-camps__cell--actions">
                          <Button 
                            size="small"
                            onClick={() => handleCancelRegistration(registration.camp_id, registration.night_camp_name || 'Unknown Camp')}
                            className="registered-camps__cancel-btn"
                            disabled={registration.status === 'cancelled'}
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      }
      case 'volunteers': {
        if (applicationsError) {
          return (
            <div className="volunteer-camps-table">
              <h2 className="volunteer-camps-table__title">My Volunteering Applications</h2>
              <div className="error-message">
                {applicationsError}
                <Button onClick={loadUserApplications} className="retry-button">
                  Try Again
                </Button>
              </div>
            </div>
          );
        }

        if (userApplications.length === 0) {
          return (
            <div className="volunteer-camps-table">
              <h2 className="volunteer-camps-table__title">My Volunteering Applications</h2>
              <div className="no-applications-message">
                You haven't applied for any volunteering positions yet. Check out the "Join Organizing Committee" tab to apply!
              </div>
            </div>
          );
        }

        const getAvailableRolesForCamp = (nightCampId: number): string[] => {
          const camp = realNightCamps.find(c => c.id === nightCampId);
          return camp?.volunteering.map(v => v.volunteering_role) || ['General Volunteer'];
        };

        const handleRoleChange = async (applicationId: number, newRole: string) => {
          try {
            await handleRoleUpdate(applicationId, newRole);
          } catch (error) {
            console.error('Failed to update role:', error);
          }
        };

        const handleCancelVolunteering = async (applicationId: number, campName: string) => {
          try {
            await handleCancelApplication(applicationId, campName);
          } catch (error) {
            console.error('Failed to cancel application:', error);
          }
        };

        return (
          <div className="volunteer-camps-table">
            <h2 className="volunteer-camps-table__title">My Volunteering Applications</h2>
            
            <div className="volunteer-camps-table__table-container">
              <table className="volunteer-camps-table__table">
                <thead>
                  <tr>
                    <th>Camp Name</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userApplications.map((application) => {
                    const availableRoles = getAvailableRolesForCamp(application.night_camp_id);
                    const isPending = application.status === 'pending';
                    
                    return (
                      <tr key={application.id} className="volunteer-camps-table__row">
                        <td className="volunteer-camps-table__cell volunteer-camps-table__cell--name">
                          <div className="volunteer-camps-table__camp-info">
                            <span className="volunteer-camps-table__camp-name">
                              {application.night_camp_name || 'Unknown Camp'}
                            </span>
                            <span className="volunteer-camps-table__registered-date">
                              Applied: {new Date(application.application_date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="volunteer-camps-table__cell">
                          <div className="volunteer-camps-table__info-item">
                            <DateIcon className="volunteer-camps-table__icon" size={14} />
                            <span>
                              {application.night_camp_date 
                                ? new Date(application.night_camp_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })
                                : 'Date not available'
                              }
                            </span>
                          </div>
                        </td>
                        <td className="volunteer-camps-table__cell">
                          <div className="volunteer-camps-table__info-item">
                            <LocationIcon className="volunteer-camps-table__icon" size={14} />
                            <span>{application.night_camp_location || 'Location not available'}</span>
                          </div>
                        </td>
                        <td className="volunteer-camps-table__cell volunteer-camps-table__cell--role">
                          {editingApplication?.applicationId === application.id ? (
                            <div className="volunteer-camps-table__role-edit">
                              <select 
                                className="volunteer-camps-table__role-select"
                                value={editingApplication.role}
                                onChange={(e) => setEditingApplication({
                                  applicationId: application.id, 
                                  role: e.target.value,
                                  availableRoles
                                })}
                              >
                                {availableRoles.map((role) => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                              <div className="volunteer-camps-table__role-actions">
                                <Button 
                                  size="small"
                                  onClick={() => handleRoleChange(application.id, editingApplication.role)}
                                  className="volunteer-camps-table__save-btn"
                                >
                                  Save
                                </Button>
                                <Button 
                                  size="small"
                                  onClick={() => setEditingApplication(null)}
                                  className="volunteer-camps-table__cancel-edit-btn"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="volunteer-camps-table__role-display">
                              <span className="volunteer-camps-table__role-text">
                                {application.volunteering_role}
                              </span>
                              {isPending && (
                                <Button 
                                  size="small"
                                  onClick={() => setEditingApplication({
                                    applicationId: application.id, 
                                    role: application.volunteering_role,
                                    availableRoles
                                  })}
                                  className="volunteer-camps-table__edit-btn"
                                >
                                  Edit
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="volunteer-camps-table__cell">
                          <span className={`volunteer-camps-table__status volunteer-camps-table__status--${application.status}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          {application.reviewed_at && (
                            <div className="volunteer-camps-table__review-info">
                              Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}
                              {application.reviewed_by_name && (
                                <span> by {application.reviewed_by_name}</span>
                              )}
                            </div>
                          )}
                          {application.review_notes && (
                            <div className="volunteer-camps-table__review-notes">
                              Notes: {application.review_notes}
                            </div>
                          )}
                        </td>
                        <td className="volunteer-camps-table__cell volunteer-camps-table__cell--actions">
                          {isPending && (
                            <Button 
                              size="small"
                              onClick={() => handleCancelVolunteering(application.id, application.night_camp_name || 'this camp')}
                              className="volunteer-camps-table__cancel-btn"
                            >
                              Cancel
                            </Button>
                          )}
                          {application.status === 'approved' && (
                            <Button 
                              size="small"
                              variant="primary"
                              onClick={() => handleOpenVolunteerManagement(application.night_camp_id)}
                              className="volunteer-camps-table__open-btn"
                            >
                              OPEN
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }

   return (
    <div className="night-camps">
      <div className="night-camps__container">
        {/* Header Section */}
        <div className="night-camps__header">
          <h1 className="night-camps__header-title">Night Camps</h1>
          <p className="night-camps__header-subtitle">
            Explore our exciting night camps and astronomical adventures
          </p>
        </div>
         
        {/* Navigation Buttons */}
        <div className="night-camps__navigation">
          <Button 
            variant={activeSection === 'upcoming' ? 'primary' : 'secondary'}
            onClick={() => setActiveSection('upcoming')}
          >
            Upcoming Camps
          </Button>
          {/* Only show these tabs if NOT learner */}
          {userRole !== 'learner' && (
            <Button 
              variant={activeSection === 'organizing' ? 'primary' : 'secondary'}
              onClick={() => setActiveSection('organizing')}
            >
              Join Organizing Committee
            </Button>
          )}
          <Button 
            variant={activeSection === 'registered' ? 'primary' : 'secondary'}
            onClick={() => setActiveSection('registered')}
          >
            Registered Camps
          </Button>
          {userRole !== 'learner' && (
            <Button 
              variant={activeSection === 'volunteers' ? 'primary' : 'secondary'}
              onClick={() => setActiveSection('volunteers')}
            >
              My Volunteers
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="night-camps__content">
          {renderContent()}
        </div>

        {/* Volunteering Application Modal */}
        {isModalOpen && selectedCamp && (
          <VolunteeringApplicationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCamp(null);
            }}
            onSubmit={handleApplicationSubmit}
            nightCampName={selectedCamp.name}
            availableRoles={selectedCamp.volunteering.map(v => v.volunteering_role)}
          />
        )}

        {/* Night Camp Details Modal */}
        {isDetailsModalOpen && selectedCampForDetails && (
          <div className="camp-details-modal">
            <div className="camp-details-modal__overlay" onClick={() => setIsDetailsModalOpen(false)} />
            <div className="camp-details-modal__content">
              <div className="camp-details-modal__header">
                <h2 className="camp-details-modal__title">{selectedCampForDetails.name}</h2>
                <Button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="camp-details-modal__close"
                  size="small"
                >
                  ✕
                </Button>
              </div>
              
              <div className="camp-details-modal__body">
                {/* Basic Information */}
                <div className="camp-details-section">
                  <h3 className="camp-details-section__title">Event Details</h3>
                  <div className="camp-details-info">
                    <div className="camp-details-info__item">
                      <DateIcon className="camp-details-info__icon" size={20} />
                      <div>
                        <span className="camp-details-info__label">Date:</span>
                        <span className="camp-details-info__value">
                          {new Date(selectedCampForDetails.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    {selectedCampForDetails.time && (
                      <div className="camp-details-info__item">
                        <TimeIcon className="camp-details-info__icon" size={20} />
                        <div>
                          <span className="camp-details-info__label">Time:</span>
                          <span className="camp-details-info__value">{selectedCampForDetails.time}</span>
                        </div>
                      </div>
                    )}
                    <div className="camp-details-info__item">
                      <LocationIcon className="camp-details-info__icon" size={20} />
                      <div>
                        <span className="camp-details-info__label">Location:</span>
                        <span className="camp-details-info__value">{selectedCampForDetails.location}</span>
                      </div>
                    </div>
                    <div className="camp-details-info__item">
                      <ParticipantsIcon className="camp-details-info__icon" size={20} />
                      <div>
                        <span className="camp-details-info__label">Max Participants:</span>
                        <span className="camp-details-info__value">{selectedCampForDetails.number_of_participants}</span>
                      </div>
                    </div>
                    {selectedCampForDetails.organized_by && (
                      <div className="camp-details-info__item">
                        <div>
                          <span className="camp-details-info__label">Organized by:</span>
                          <span className="camp-details-info__value">{selectedCampForDetails.organized_by}</span>
                        </div>
                      </div>
                    )}
                    {selectedCampForDetails.sponsored_by && (
                      <div className="camp-details-info__item">
                        <div>
                          <span className="camp-details-info__label">Sponsored by:</span>
                          <span className="camp-details-info__value">{selectedCampForDetails.sponsored_by}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedCampForDetails.description && (
                    <div className="camp-details-description">
                      <h4>Description</h4>
                      <p>{selectedCampForDetails.description}</p>
                    </div>
                  )}
                </div>

                {/* Activities */}
                {selectedCampForDetails.activities && selectedCampForDetails.activities.length > 0 && (
                  <div className="camp-details-section">
                    <h3 className="camp-details-section__title">Activities</h3>
                    <ul className="camp-details-list">
                      {selectedCampForDetails.activities.map((activity, index) => (
                        <li key={index}>{activity.activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Equipment */}
                {selectedCampForDetails.equipment && selectedCampForDetails.equipment.length > 0 && (
                  <div className="camp-details-section">
                    <h3 className="camp-details-section__title">Equipment</h3>
                    <div className="camp-details-equipment">
                      {['provided', 'required', 'optional'].map(category => {
                        const categoryEquipment = selectedCampForDetails.equipment.filter(
                          eq => eq.category === category
                        );
                        if (categoryEquipment.length === 0) return null;
                        
                        return (
                          <div key={category} className="camp-details-equipment__category">
                            <h4 className="camp-details-equipment__category-title">
                              {category.charAt(0).toUpperCase() + category.slice(1)} Equipment
                            </h4>
                            <ul className="camp-details-list">
                              {categoryEquipment.map((eq, index) => (
                                <li key={index}>{eq.equipment_name}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Volunteering Roles */}
                {selectedCampForDetails.volunteering && selectedCampForDetails.volunteering.length > 0 && (
                  <div className="camp-details-section">
                    <h3 className="camp-details-section__title">Volunteers</h3>
                    <div className="camp-details-volunteering">
                      {selectedCampForDetails.volunteering.map((volunteer, index) => (
                        <div key={index} className="camp-details-volunteering__role">
                          <span className="camp-details-volunteering__role-name">
                            {volunteer.volunteering_role}
                          </span>
                          <span className="camp-details-volunteering__role-count">
                            ({volunteer.number_of_applicants} applicants)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {selectedCampForDetails.emergency_contact && (
                  <div className="camp-details-section">
                    <h3 className="camp-details-section__title">Emergency Contact</h3>
                    <p className="camp-details-emergency">{selectedCampForDetails.emergency_contact}</p>
                  </div>
                )}
              </div>
              
              <div className="camp-details-modal__footer">
                {userRole === 'learner' && (
                  <Button 
                    className="btn--night-camps"
                    onClick={() => handleRegisterForCamp(selectedCampForDetails.id)}
                  >
                    Register for This Camp
                  </Button>
                )}
                {userRole !== 'learner' && (
                  <Button 
                    className="btn--night-camps"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleVolunteerClick(selectedCampForDetails);
                    }}
                  >
                    Apply as Volunteer
                  </Button>
                )}
                <Button 
                  variant="secondary"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NightCamps


