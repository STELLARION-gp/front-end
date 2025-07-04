import { useState } from 'react'
import Button from '../../components/Button'
import Card, { CardActions, CardContent, CardSubtitle, CardTitle } from '../../components/Card'
import { 
  CalendarIcon, 
  UsersIcon, 
  ClockIcon, 
  MapPinIcon,
  StarIcon,
  TrophyIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import '../../styles/pages/enthusiast/Volunteering.scss'

type ActiveTab = 'upcoming' | 'registered' | 'history'

interface VolunteerOpportunity {
  id: number
  title: string
  organization: string
  date: string
  time: string
  location: string
  description: string
  participantsNeeded: number
  currentParticipants: number
  roles: string[]
  category: 'event' | 'education' | 'research' | 'outreach'
  requiredSkills?: string[]
  image?: string
}

interface UserVolunteerRecord {
  id: number
  eventTitle: string
  organization: string
  date: string
  role: string
  hoursContributed: number
  status: 'completed' | 'upcoming' | 'cancelled'
  rating?: number
  feedback?: string
}

const Volunteering = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upcoming')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [registrationData, setRegistrationData] = useState({
    motivation: '',
    experience: '',
    availability: '',
    emergencyContact: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock data for volunteer opportunities
  const volunteerOpportunities: VolunteerOpportunity[] = [
    {
      id: 1,
      title: "International Astronomy Day Event",
      organization: "Sri Lanka Astronomical Association",
      date: "2025-08-15",
      time: "09:00 - 17:00",
      location: "Colombo Planetarium",
      description: "Help organize and facilitate public astronomy activities, telescope demonstrations, and educational workshops for International Astronomy Day.",
      participantsNeeded: 20,
      currentParticipants: 12,
      roles: ["Event Coordinator", "Telescope Operator", "Workshop Facilitator", "Registration Assistant"],
      category: "event",
      requiredSkills: ["Public Speaking", "Telescope Operation"],
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800"
    },
    {
      id: 2,
      title: "Dark Sky Preservation Campaign",
      organization: "Environment Protection Society",
      date: "2025-08-20",
      time: "18:00 - 22:00",
      location: "Nuwara Eliya District",
      description: "Join our initiative to reduce light pollution and preserve dark skies for better astronomical observations and wildlife protection.",
      participantsNeeded: 15,
      currentParticipants: 8,
      roles: ["Campaign Coordinator", "Community Liaison", "Data Collector", "Social Media Manager"],
      category: "outreach",
      requiredSkills: ["Community Engagement", "Data Analysis"],
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800"
    },
    {
      id: 3,
      title: "School Science Fair Astronomy Booth",
      organization: "Colombo Science Foundation",
      date: "2025-09-05",
      time: "08:00 - 16:00",
      location: "Royal College, Colombo",
      description: "Set up and manage an interactive astronomy booth at the annual school science fair, inspiring young minds about space and science.",
      participantsNeeded: 8,
      currentParticipants: 5,
      roles: ["Booth Manager", "Activity Coordinator", "Science Demonstrator", "Student Mentor"],
      category: "education",
      requiredSkills: ["Working with Children", "Science Communication"],
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800"
    },
    {
      id: 4,
      title: "Meteor Shower Observation Research",
      organization: "University of Colombo Astronomy Dept",
      date: "2025-09-12",
      time: "20:00 - 04:00",
      location: "Hakgala Botanical Garden",
      description: "Assist professional astronomers in collecting data during the Perseid meteor shower peak for research purposes.",
      participantsNeeded: 12,
      currentParticipants: 3,
      roles: ["Data Recorder", "Equipment Assistant", "Observation Logger", "Safety Monitor"],
      category: "research",
      requiredSkills: ["Night Vision Capability", "Attention to Detail"],
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800"
    }
  ]

  // Mock data for user's registered volunteering
  const registeredVolunteering: UserVolunteerRecord[] = [
    {
      id: 1,
      eventTitle: "Star Party at Horton Plains",
      organization: "Sri Lanka Astronomical Association",
      date: "2025-08-25",
      role: "Telescope Operator",
      hoursContributed: 6,
      status: "upcoming"
    },
    {
      id: 2,
      eventTitle: "Solar Eclipse Public Viewing",
      organization: "Colombo Planetarium",
      date: "2025-09-15",
      role: "Safety Coordinator",
      hoursContributed: 8,
      status: "upcoming"
    }
  ]

  // Mock data for volunteer history
  const volunteerHistory: UserVolunteerRecord[] = [
    {
      id: 1,
      eventTitle: "World Space Week Celebration",
      organization: "UNESCO Sri Lanka",
      date: "2025-07-10",
      role: "Workshop Facilitator",
      hoursContributed: 12,
      status: "completed",
      rating: 5,
      feedback: "Excellent workshop delivery and participant engagement!"
    },
    {
      id: 2,
      eventTitle: "Asteroid Detection Training",
      organization: "NASA Citizen Science Program",
      date: "2025-06-22",
      role: "Data Analyst",
      hoursContributed: 4,
      status: "completed",
      rating: 4,
      feedback: "Great attention to detail in data analysis."
    },
    {
      id: 3,
      eventTitle: "Community Stargazing Night",
      organization: "Kandy Astronomy Club",
      date: "2025-05-18",
      role: "Event Coordinator",
      hoursContributed: 8,
      status: "completed",
      rating: 5,
      feedback: "Outstanding organization and leadership skills."
    }
  ]

  const totalEvents = volunteerHistory.filter(v => v.status === 'completed').length
  const totalHours = volunteerHistory.reduce((acc, v) => v.status === 'completed' ? acc + v.hoursContributed : acc, 0)
  const upcomingEvents = registeredVolunteering.filter(v => v.status === 'upcoming').length
  const averageRating = volunteerHistory.filter(v => v.rating).reduce((acc, v, _, arr) => acc + (v.rating || 0) / arr.length, 0)

  const filterCategories = ['event', 'education', 'research', 'outreach']

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredOpportunities = volunteerOpportunities.filter(opportunity => 
    selectedFilters.length === 0 || selectedFilters.includes(opportunity.category)
  )

  const handleRegisterVolunteering = (opportunityId: number) => {
    const opportunity = volunteerOpportunities.find(op => op.id === opportunityId)
    if (opportunity) {
      setSelectedOpportunity(opportunity)
      setSelectedRole(opportunity.roles[0] || '')
      setShowRegistrationModal(true)
    }
  }

  const handleCloseRegistrationModal = () => {
    setShowRegistrationModal(false)
    setSelectedOpportunity(null)
    setSelectedRole('')
    setIsSubmitting(false)
    setShowConfirmation(false)
    setRegistrationData({
      motivation: '',
      experience: '',
      availability: '',
      emergencyContact: ''
    })
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!selectedRole || !registrationData.motivation.trim() || 
        !registrationData.availability.trim() || !registrationData.emergencyContact.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success confirmation
      setShowConfirmation(true)
      setIsSubmitting(false)
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleCloseRegistrationModal()
      }, 3000)
      
    } catch (error) {
      console.error('Registration failed:', error)
      setIsSubmitting(false)
      alert('Registration failed. Please try again.')
    }
  }

  const handleRegistrationDataChange = (field: string, value: string) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancelRegistration = (registrationId: number) => {
    // Handle cancellation logic
    console.log('Cancelling registration:', registrationId)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event': return <CalendarIcon className="w-5 h-5" />
      case 'education': return <UsersIcon className="w-5 h-5" />
      case 'research': return <StarIcon className="w-5 h-5" />
      case 'outreach': return <TrophyIcon className="w-5 h-5" />
      default: return <CalendarIcon className="w-5 h-5" />
    }
  }

  const renderUpcomingOpportunities = () => (
    <div className="volunteering__opportunities">
      {/* Statistics Cards */}
      <div className="volunteering__stats">
        <Card className="volunteering__stat-card" variant="elevated">
          <div className="stat-content">
            <TrophyIcon className="stat-icon" />
            <div>
              <div className="stat-number">{totalEvents}</div>
              <div className="stat-label">Events Completed</div>
            </div>
          </div>
        </Card>
        <Card className="volunteering__stat-card" variant="elevated">
          <div className="stat-content">
            <ClockIcon className="stat-icon" />
            <div>
              <div className="stat-number">{totalHours}</div>
              <div className="stat-label">Hours Contributed</div>
            </div>
          </div>
        </Card>
        <Card className="volunteering__stat-card" variant="elevated">
          <div className="stat-content">
            <CalendarIcon className="stat-icon" />
            <div>
              <div className="stat-number">{upcomingEvents}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
        </Card>
        <Card className="volunteering__stat-card" variant="elevated">
          <div className="stat-content">
            <StarIcon className="stat-icon" />
            <div>
              <div className="stat-number">{averageRating.toFixed(1)}</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="volunteering__filters">
        <h3>Filter by Category:</h3>
        <div className="filter-buttons">
          {filterCategories.map(category => (
            <Button
              key={category}
              variant={selectedFilters.includes(category) ? 'primary' : 'secondary'}
              size="small"
              onClick={() => handleFilterToggle(category)}
              icon={getCategoryIcon(category)}
              iconPosition="left"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        {selectedFilters.length > 0 && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => setSelectedFilters([])}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Opportunity Cards */}
      <div className="volunteering__grid">
        {filteredOpportunities.map(opportunity => (
          <Card key={opportunity.id} className="opportunity-card" variant="elevated" hover>
            {opportunity.image && (
              <div className="opportunity-image">
                <img src={opportunity.image} alt={opportunity.title} />
                <div className="category-badge">
                  {getCategoryIcon(opportunity.category)}
                  <span>{opportunity.category}</span>
                </div>
              </div>
            )}
            <CardContent>
              <CardTitle>{opportunity.title}</CardTitle>
              <CardSubtitle>{opportunity.organization}</CardSubtitle>
              
              <div className="opportunity-details">
                <div className="detail-item">
                  <CalendarIcon className="detail-icon" />
                  <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <ClockIcon className="detail-icon" />
                  <span>{opportunity.time}</span>
                </div>
                <div className="detail-item">
                  <MapPinIcon className="detail-icon" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="detail-item">
                  <UsersIcon className="detail-icon" />
                  <span>{opportunity.currentParticipants}/{opportunity.participantsNeeded} volunteers</span>
                </div>
              </div>

              <p className="opportunity-description">{opportunity.description}</p>

              <div className="opportunity-roles">
                <h4>Available Roles:</h4>
                <div className="roles-list">
                  {opportunity.roles.map((role, index) => (
                    <span key={index} className="role-tag">{role}</span>
                  ))}
                </div>
              </div>

              {opportunity.requiredSkills && (
                <div className="required-skills">
                  <h4>Required Skills:</h4>
                  <div className="skills-list">
                    {opportunity.requiredSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="primary"
                onClick={() => handleRegisterVolunteering(opportunity.id)}
                icon={<PlusIcon className="w-4 h-4" />}
                iconPosition="left"
              >
                Register to Volunteer
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderRegisteredEvents = () => (
    <div className="registered-events">
      <h2>My Registered Volunteering</h2>
      <p>Events you're registered to volunteer for</p>
      
      <div className="registered-events__list">
        {registeredVolunteering.map(event => (
          <Card key={event.id} className="registered-event-card" variant="outlined">
            <CardContent>
              <div className="event-header">
                <div>
                  <CardTitle>{event.eventTitle}</CardTitle>
                  <CardSubtitle>{event.organization}</CardSubtitle>
                </div>
                <div className="event-status upcoming">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Registered</span>
                </div>
              </div>
              
              <div className="event-details">
                <div className="detail-item">
                  <CalendarIcon className="detail-icon" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <UsersIcon className="detail-icon" />
                  <span>Role: {event.role}</span>
                </div>
                <div className="detail-item">
                  <ClockIcon className="detail-icon" />
                  <span>Expected: {event.hoursContributed} hours</span>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleCancelRegistration(event.id)}
              >
                Cancel Registration
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderVolunteerHistory = () => (
    <div className="volunteer-history">
      <h2>My Volunteering History</h2>
      <p>Your completed volunteer activities and achievements</p>
      
      <div className="history-stats">
        <div className="history-summary">
          <div className="summary-item">
            <TrophyIcon className="summary-icon" />
            <div>
              <span className="summary-number">{totalEvents}</span>
              <span className="summary-label">Events Completed</span>
            </div>
          </div>
          <div className="summary-item">
            <ClockIcon className="summary-icon" />
            <div>
              <span className="summary-number">{totalHours}</span>
              <span className="summary-label">Total Hours</span>
            </div>
          </div>
          <div className="summary-item">
            <StarIcon className="summary-icon" />
            <div>
              <span className="summary-number">{averageRating.toFixed(1)}/5</span>
              <span className="summary-label">Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="history-events">
        {volunteerHistory.map(event => (
          <Card key={event.id} className="history-event-card" variant="outlined">
            <CardContent>
              <div className="event-header">
                <div>
                  <CardTitle>{event.eventTitle}</CardTitle>
                  <CardSubtitle>{event.organization}</CardSubtitle>
                </div>
                <div className="event-status completed">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Completed</span>
                </div>
              </div>
              
              <div className="event-details">
                <div className="detail-item">
                  <CalendarIcon className="detail-icon" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <UsersIcon className="detail-icon" />
                  <span>Role: {event.role}</span>
                </div>
                <div className="detail-item">
                  <ClockIcon className="detail-icon" />
                  <span>{event.hoursContributed} hours contributed</span>
                </div>
              </div>

              {event.rating && (
                <div className="event-rating">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`star ${i < event.rating! ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="rating-text">{event.rating}/5</span>
                </div>
              )}

              {event.feedback && (
                <div className="event-feedback">
                  <h4>Feedback:</h4>
                  <p>"{event.feedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return renderUpcomingOpportunities()
      case 'registered':
        return renderRegisteredEvents()
      case 'history':
        return renderVolunteerHistory()
      default:
        return renderUpcomingOpportunities()
    }
  }

  return (
    <div className="volunteering">
      <div className="volunteering__header">
        <h1>Volunteering</h1>
        <p>Make a difference in the astronomy community through volunteer opportunities</p>
      </div>

      {/* Tab Navigation */}
      <div className="volunteering__tabs">
        <Button
          variant={activeTab === 'upcoming' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('upcoming')}
          icon={<CalendarIcon className="w-4 h-4" />}
          iconPosition="left"
        >
          Opportunities
        </Button>
        <Button
          variant={activeTab === 'registered' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('registered')}
          icon={<CheckCircleIcon className="w-4 h-4" />}
          iconPosition="left"
        >
          My Registrations ({upcomingEvents})
        </Button>
        <Button
          variant={activeTab === 'history' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('history')}
          icon={<TrophyIcon className="w-4 h-4" />}
          iconPosition="left"
        >
          My History ({totalEvents})
        </Button>
      </div>

      {/* Content Area */}
      <div className="volunteering__content">
        {renderTabContent()}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && selectedOpportunity && (
        <div className="registration-modal-backdrop" onClick={handleCloseRegistrationModal}>
          <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
            <div className="registration-modal__header">
              <h2>Register for Volunteering</h2>
              <button 
                className="registration-modal__close"
                onClick={handleCloseRegistrationModal}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="registration-modal__content">
              {showConfirmation ? (
                // Success Confirmation View
                <div className="confirmation-view">
                  <div className="confirmation-icon">
                    <CheckCircleIcon className="w-16 h-16 text-green-500" />
                  </div>
                  <h3>Registration Successful!</h3>
                  <p>
                    Your volunteer registration for <strong>{selectedOpportunity.title}</strong> has been submitted successfully.
                  </p>
                  <p>
                    You will receive a confirmation email shortly with next steps and event details.
                  </p>
                  <div className="selected-role-confirmation">
                    <strong>Selected Role:</strong> {selectedRole}
                  </div>
                </div>
              ) : (
                // Registration Form View
                <>
                  {/* Event Information */}
                  <div className="event-info-section">
                    <h3>Event Details</h3>
                    <div className="event-summary">
                      <h4>{selectedOpportunity.title}</h4>
                      <p className="organization">{selectedOpportunity.organization}</p>
                      
                      <div className="event-meta">
                        <div className="meta-item">
                          <CalendarIcon className="meta-icon" />
                          <span>{new Date(selectedOpportunity.date).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item">
                          <ClockIcon className="meta-icon" />
                          <span>{selectedOpportunity.time}</span>
                        </div>
                        <div className="meta-item">
                          <MapPinIcon className="meta-icon" />
                          <span>{selectedOpportunity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form className="registration-form" onSubmit={handleRegistrationSubmit}>
                    {/* Role Selection */}
                    <div className="form-group">
                      <label htmlFor="role-select">Preferred Role *</label>
                      <select
                        id="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        disabled={isSubmitting}
                        required
                      >
                        {selectedOpportunity.roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Motivation */}
                    <div className="form-group">
                      <label htmlFor="motivation">Why do you want to volunteer for this event? *</label>
                      <textarea
                        id="motivation"
                        rows={4}
                        value={registrationData.motivation}
                        onChange={(e) => handleRegistrationDataChange('motivation', e.target.value)}
                        placeholder="Tell us about your motivation and what you hope to contribute..."
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    {/* Experience */}
                    <div className="form-group">
                      <label htmlFor="experience">Relevant Experience</label>
                      <textarea
                        id="experience"
                        rows={3}
                        value={registrationData.experience}
                        onChange={(e) => handleRegistrationDataChange('experience', e.target.value)}
                        placeholder="Describe any relevant experience or skills..."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Availability */}
                    <div className="form-group">
                      <label htmlFor="availability">Availability Confirmation *</label>
                      <textarea
                        id="availability"
                        rows={2}
                        value={registrationData.availability}
                        onChange={(e) => handleRegistrationDataChange('availability', e.target.value)}
                        placeholder="Confirm your availability for the entire duration..."
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="form-group">
                      <label htmlFor="emergency-contact">Emergency Contact *</label>
                      <input
                        type="text"
                        id="emergency-contact"
                        value={registrationData.emergencyContact}
                        onChange={(e) => handleRegistrationDataChange('emergencyContact', e.target.value)}
                        placeholder="Name and phone number"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    {/* Required Skills Notice */}
                    {selectedOpportunity.requiredSkills && selectedOpportunity.requiredSkills.length > 0 && (
                      <div className="required-skills-notice">
                        <h4>Required Skills for this Role:</h4>
                        <div className="skills-tags">
                          {selectedOpportunity.requiredSkills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <p className="skills-disclaimer">
                          By applying, you confirm that you have experience with the required skills listed above.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="form-actions">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCloseRegistrationModal}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        icon={isSubmitting ? undefined : <CheckCircleIcon className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Volunteering
