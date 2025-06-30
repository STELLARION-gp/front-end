import React, { useState } from 'react'
import Button from '../../components/Button'
import Card, { CardActions, CardContent, CardSubtitle, CardTitle } from '../../components/Card'
import ProgressBar from '../../components/ProgressBar'
import DateIcon from '../../assets/svg/DateIcon'
import TimeIcon from '../../assets/svg/TimeIcon'
import LocationIcon from '../../assets/svg/LocationIcon'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import '../../styles/pages/NightCamps.scss'

type ActiveSection = 'upcoming' | 'organizing' | 'registered' | 'volunteers'

const NightCamps = () => {

  const camps = [
    {
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
      title: "Moonlight Astronomy Camp",
      date: "August 12, 2025",
      time: "7:30 PM",
      location: "Kandy",
      participants: 28,
      maxParticipants:40,
      description: "Explore the night sky and discover constellations...",
      rolls: ["Observatory & Equipment Coordinator", "Night Sky Education Specialist", "Space Science Activity Leader"]
    },
    {
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
                <ProgressBar 
                  current={camp.participants}
                  max={camp.maxParticipants}
                  label="Registered Participants"
                  className="progress-bar--small"
                />
              </div>
            </CardContent>
            <CardActions>
              <Button variant="primary">
                Register Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}
      case 'organizing':{
         
        return (
          <div className="volunteer-camps">
            <h2 className="volunteer-camps__title">Join Organizing Committee</h2>
            <div className="card-grid card-grid--medium">
        {camps.map((camps, index) => (
          <Card 
            key={index}
            variant="elevated"
            hover={true}
            className="card-animate"
          >
            <CardTitle>{camps.title}</CardTitle>
            <CardSubtitle>{camps.description}</CardSubtitle>
            <CardContent>
              <div className="camp-info">
                <div className="camp-info__item">
                  <DateIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camps.date}</span>
                </div>
                <div className="camp-info__item">
                  <TimeIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camps.time}</span>
                </div>
                <div className="camp-info__item">
                  <LocationIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camps.location}</span>
                </div>
                <div className="camp-info__item">
                  <ParticipantsIcon className="camp-info__icon" size={16} />
                  <span className="camp-info__text">{camps.maxParticipants} participants</span>
                </div>
                <div className="camp-info__item">
                  <div className="camp-info__roles-header">Volunteering Roles</div>
                  <ul className="camp-info__roles">
                    {camps.rolls.map((role, roleIndex) => (
                      <li key={roleIndex}>{role}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <Button variant="primary">
                Register Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
          </div>
        )}
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
                          variant="ghost" 
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
            <p className="volunteer-camps-table__subtitle">Manage your volunteer registrations and roles</p>
            
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
                                variant="primary" 
                                size="small"
                                onClick={() => handleRoleChange(camp.id, editingRole.role)}
                                className="volunteer-camps-table__save-btn"
                              >
                                Save
                              </Button>
                              <Button 
                                variant="ghost" 
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
                              variant="ghost" 
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
                          variant="ghost" 
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
            variant={activeSection === 'upcoming' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('upcoming')}
          >
            Upcoming Camps
          </Button>
          <Button 
            variant={activeSection === 'organizing' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('organizing')}
          >
            Join Organizing Committee
          </Button>
          <Button 
            variant={activeSection === 'registered' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('registered')}
          >
            Registered Camps
          </Button>
          <Button 
            variant={activeSection === 'volunteers' ? 'primary' : 'ghost'}
            onClick={() => setActiveSection('volunteers')}
          >
            My Volunteers
          </Button>
        </div>

        {/* Content Area */}
        <div className="night-camps__content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default NightCamps
