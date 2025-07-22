import { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { nightCampService, type NightCampWithDetails } from '../../services/nightCampService';

type ActiveSection = 'upcoming' | 'organizing' | 'registered' | 'volunteers'

const NightCamps = () => {
  const { userRole } = useRoleAccess();
  const navigate = useNavigate();

  // State for real data
  const [realNightCamps, setRealNightCamps] = useState<NightCampWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<NightCampWithDetails | null>(null);

  // Load night camps data
  useEffect(() => {
    loadNightCamps();
  }, []);

  const loadNightCamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const camps = await nightCampService.getAllNightCamps();
      setRealNightCamps(camps);
    } catch (err) {
      console.error('Failed to load night camps:', err);
      setError('Failed to load night camps. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerClick = (camp: NightCampWithDetails) => {
    setSelectedCamp(camp);
    setIsModalOpen(true);
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

  // Legacy static data for other tabs (keeping existing functionality)
  const camps = [
    {
      id: 1,
      title: "Stargazing Night Camp",
      date: "July 15, 2025",
      time: "8:00 PM",
      location: "Colombo",
      participants: 35,
      maxParticipants:50,
      description: "Join us for a magical night under the stars...",
      rolls: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader"]

    },
    {
      id: 2,
      title: "Moonlight Astronomy Camp",
      date: "June 12, 2025",
      time: "7:30 PM",
      location: "Kandy",
      participants: 28,
      maxParticipants:40,
      description: "Explore the night sky and discover constellations...",
      rolls: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader"]
    },
    {
      id: 3,
      title: "Stargazing Night Camp",
      date: "July 15, 2025",
      time: "8:00 PM",
      location: "Colombo",
      participants: 35,
      maxParticipants:50,
      description: "Join us for a magical night under the stars...",
      rolls: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader"]

    }
  ];
  const [activeSection, setActiveSection] = useState<ActiveSection>('upcoming')
  const [editingRole, setEditingRole] = useState<{campId: number, role: string} | null>(null);

  const renderContent = () => {
    switch (activeSection) {
case 'upcoming': {
  

  return (
    <div className="upcoming-camps">
      <h2 className="upcoming-camps__title">Upcoming Camps</h2>
      <div className="card-grid card-grid--small">
        {camps.map((camp, index) => (
          <Card 
            key={index}
            variant="elevated"
            hover={true}
            className="card-animate"
          >
            <CardTitle>{camp.title}</CardTitle>
            <CardSubtitle>{camp.description}</CardSubtitle>
            <CardContent>
              <div className="camp-info">
                <div className="camp-info__item">
                  <DateIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.date}</span>
                </div>
                <div className="camp-info__item">
                  <TimeIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.time}</span>
                </div>
                <div className="camp-info__item">
                  <LocationIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.location}</span>
                </div>
                <div className="camp-info__item">
                  <ParticipantsIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camp.maxParticipants} max</span>
                </div>
              </div>
              <div className="camp-participation">
                <div className="camp-participation__header">
                  <span className="camp-participation__label">Registrations</span>
                  <div className="camp-participation__count">
                    <span className="count-numbers">
                      {camp.participants} / {camp.maxParticipants}
                    </span>
                  </div>
                </div>
                <ProgressBar 
                  className="progress-bar--participants"
                  current={camp.participants}
                  max={camp.maxParticipants}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button 
                className="btn--night-camps" 
                onClick={() => {
                  if (userRole === 'learner') {
                    navigate(`/dashboard/night-camps/${camp.id}`);
                  }
                }}
              >
                Register Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}
      case 'organizing': {
        if (loading) {
          return (
            <div className="volunteer-camps">
              <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
              <div className="loading-message">Loading night camps...</div>
            </div>
          );
        }

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

        return (
          <div className="volunteer-camps">
            <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
            <div className="card-grid card-grid--medium">
              {realNightCamps.map((camp, index) => (
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
        const registeredCamps = [
          {
            id: 1,
            name: "Meteor Shower Night",
            date: "June 20, 2025",
            time: "9:00 PM",
            location: "Colombo Observatory",
            registeredOn: "June 15, 2025",
            status: "Confirmed"
          },
          {
            id: 2,
            name: "Deep Space Observation",
            date: "July 5, 2025",
            time: "8:30 PM",
            location: "Kandy Science Center",
            registeredOn: "June 25, 2025",
            status: "Pending"
          },
          {
            id: 3,
            name: "Solar Eclipse Viewing",
            date: "August 15, 2025",
            time: "6:00 AM",
            location: "Galle Beach",
            registeredOn: "June 28, 2025",
            status: "Confirmed"
          }
        ];

        const handleCancelRegistration = (campId: number, campName: string) => {
          if (window.confirm(`Are you sure you want to cancel your registration for "${campName}"?`)) {
            // Here you would typically call an API to cancel the registration
            console.log(`Cancelled registration for camp ID: ${campId}`);
            // You could also update the state to remove the camp from the list
          }
        };

        return (
          <div className="registered-camps">
            <h2 className="registered-camps__title">Registered Camps</h2>
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
                  {registeredCamps.map((camp) => (
                    <tr key={camp.id} className="registered-camps__row">
                      <td className="registered-camps__cell registered-camps__cell--name">
                        <div className="registered-camps__camp-info">
                          <span className="registered-camps__camp-name">{camp.name}</span>
                          <span className="registered-camps__registered-date">
                            Registered: {camp.registeredOn}
                          </span>
                        </div>
                      </td>
                      <td className="registered-camps__cell">
                        <div className="registered-camps__info-item">
                          <DateIcon className="registered-camps__icon" size={14} />
                          <span>{camp.date}</span>
                        </div>
                      </td>
                      <td className="registered-camps__cell">
                        <div className="registered-camps__info-item">
                          <TimeIcon className="registered-camps__icon" size={14} />
                          <span>{camp.time}</span>
                        </div>
                      </td>
                      <td className="registered-camps__cell">
                        <div className="registered-camps__info-item">
                          <LocationIcon className="registered-camps__icon" size={14} />
                          <span>{camp.location}</span>
                        </div>
                      </td>
                      <td className="registered-camps__cell">
                        <span className={`registered-camps__status registered-camps__status--${camp.status.toLowerCase()}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="registered-camps__cell registered-camps__cell--actions">
                        <Button 
                          size="small"
                          onClick={() => handleCancelRegistration(camp.id, camp.name)}
                          className="registered-camps__cancel-btn"
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
      case 'volunteers': {
        const volunteerCamps = [
          {
            id: 1,
            name: "Stargazing Night Camp",
            date: "July 15, 2025",
            time: "8:00 PM",
            location: "Colombo Observatory",
            currentRole: "Observatory & Equipment Coordinator",
            availableRoles: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader", "Safety Coordinator"],
            registeredOn: "June 10, 2025",
            status: "Confirmed"
          },
          {
            id: 2,
            name: "Moonlight Astronomy Camp",
            date: "August 12, 2025",
            time: "7:30 PM",
            location: "Kandy Science Center",
            currentRole: "Space Science Activity Leader",
            availableRoles: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader", "Safety Coordinator"],
            registeredOn: "June 20, 2025",
            status: "Confirmed"
          }
        ];

        const handleRoleChange = (campId: number, newRole: string) => {
          // Here you would typically call an API to update the role
          console.log(`Updated role for camp ${campId} to: ${newRole}`);
          setEditingRole(null);
        };

        const handleCancelVolunteering = (campId: number, campName: string) => {
          if (window.confirm(`Are you sure you want to cancel your volunteering for "${campName}"?`)) {
            // Here you would typically call an API to cancel volunteering
            console.log(`Cancelled volunteering for camp ID: ${campId}`);
          }
        };

        return (
          <div className="volunteer-camps-table">
            <h2 className="volunteer-camps-table__title">My Volunteering</h2>
            
            
            <div className="volunteer-camps-table__table-container">
              <table className="volunteer-camps-table__table">
                <thead>
                  <tr>
                    <th>Camp Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerCamps.map((camp) => (
                    <tr key={camp.id} className="volunteer-camps-table__row">
                      <td className="volunteer-camps-table__cell volunteer-camps-table__cell--name">
                        <div className="volunteer-camps-table__camp-info">
                          <span className="volunteer-camps-table__camp-name">{camp.name}</span>
                          <span className="volunteer-camps-table__registered-date">
                            Registered: {camp.registeredOn}
                          </span>
                        </div>
                      </td>
                      <td className="volunteer-camps-table__cell">
                        <div className="volunteer-camps-table__info-item">
                          <DateIcon className="volunteer-camps-table__icon" size={14} />
                          <span>{camp.date}</span>
                        </div>
                      </td>
                      <td className="volunteer-camps-table__cell">
                        <div className="volunteer-camps-table__info-item">
                          <TimeIcon className="volunteer-camps-table__icon" size={14} />
                          <span>{camp.time}</span>
                        </div>
                      </td>
                      <td className="volunteer-camps-table__cell">
                        <div className="volunteer-camps-table__info-item">
                          <LocationIcon className="volunteer-camps-table__icon" size={14} />
                          <span>{camp.location}</span>
                        </div>
                      </td>
                      <td className="volunteer-camps-table__cell volunteer-camps-table__cell--role">
                        {editingRole?.campId === camp.id ? (
                          <div className="volunteer-camps-table__role-edit">
                            <select 
                              className="volunteer-camps-table__role-select"
                              value={editingRole.role}
                              onChange={(e) => setEditingRole({campId: camp.id, role: e.target.value})}
                            >
                              {camp.availableRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            <div className="volunteer-camps-table__role-actions">
                              <Button 
                                size="small"
                                onClick={() => handleRoleChange(camp.id, editingRole.role)}
                                className="volunteer-camps-table__save-btn"
                              >
                                Save
                              </Button>
                              <Button 
                                size="small"
                                onClick={() => setEditingRole(null)}
                                className="volunteer-camps-table__cancel-edit-btn"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="volunteer-camps-table__role-display">
                            <span className="volunteer-camps-table__role-text">{camp.currentRole}</span>
                            <Button 
                              size="small"
                              onClick={() => setEditingRole({campId: camp.id, role: camp.currentRole})}
                              className="volunteer-camps-table__edit-btn"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="volunteer-camps-table__cell volunteer-camps-table__cell--actions">
                        <Button 
                          size="small"
                          onClick={() => handleCancelVolunteering(camp.id, camp.name)}
                          className="volunteer-camps-table__cancel-btn"
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
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
      </div>
    </div>
  )
}

export default NightCamps


