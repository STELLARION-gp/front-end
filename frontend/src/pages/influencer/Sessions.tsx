import { useState } from 'react'
import '../../styles/pages/influencer/Sessions.scss';
import Button from '../../components/Button';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('my-sessions')
  const [showManageModal, setShowManageModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  type Material = {
    id: number
    name: string
    type: string
    file: File | null
    url: string
  }

  const [newSession, setNewSession] = useState<{
    title: string
    description: string
    type: string
    price: string
    duration: string
    date: string
    time: string
    maxParticipants: string
    difficulty: string
    link: string
    category: string
    materials: Material[]
    notes: string
  }>({
    title: '',
    description: '',
    type: 'live',
    price: '',
    duration: '',
    date: '',
    time: '',
    maxParticipants: '',
    difficulty: 'beginner',
    link: '',
    category: 'observation',
    materials: [],
    notes: ''
  })

  // Mock data
  const liveSessions = [
    { id: 1, title: 'Deep Space Photography', date: '2024-01-15', time: '20:00', participants: 12, maxParticipants: 20, price: 13500, status: 'upcoming', registrationEnabled: true },
    { id: 2, title: 'Planetary Observation', date: '2024-01-18', time: '21:30', participants: 8, maxParticipants: 15, price: 10500, status: 'upcoming', registrationEnabled: false }
  ]

  const recordedSessions = [
    { id: 1, title: 'Beginner Stargazing', price: 1500, purchases: 156, rating: 4.8, earnings: 234000, registrationEnabled: true },
    { id: 2, title: 'Telescope Setup Guide', price: 2000, purchases: 89, rating: 4.9, earnings: 178000, registrationEnabled: false }
  ]

  type Session = {
    id: number
    title: string
    date?: string
    time?: string
    participants?: number
    maxParticipants?: number
    price: number
    status?: string
    registrationEnabled?: boolean
    purchases?: number
    rating?: number
    earnings?: number
    // Add other fields as needed
  }

  const handleEditSession = (session: Session) => {
    setSelectedSession(session)
    setShowEditModal(true)
  }

  const handleViewAnalytics = (session:Session) => {
    setSelectedSession(session)
    setShowAnalyticsModal(true)
  }

  const handleStartSession = (session:Session) => {
    // Handle starting the live session
    console.log('Starting session:', session.title)
    // You can add navigation to the session room or open a new window
    // window.open(`https://stellarion.com/session/${session.id}/room`, '_blank')
  }

  const handleAddMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      name: '',
      type: 'pdf',
      file: null,
      url: ''
    }
    setNewSession({
      ...newSession,
      materials: [...newSession.materials, newMaterial]
    })
  }

  const handleRemoveMaterial = (materialId: number) => {
    setNewSession({
      ...newSession,
      materials: newSession.materials.filter(material => material.id !== materialId)
    })
  }

  const handleMaterialChange = (
    materialId: number,
    field: keyof Material,
    value: string | File | null
  ) => {
    setNewSession({
      ...newSession,
      materials: newSession.materials.map(material =>
        material.id === materialId
          ? { ...material, [field]: value }
          : material
      )
    })
  }

  const handleFileUpload = (materialId: number, file: File) => {
    setNewSession({
      ...newSession,
      materials: newSession.materials.map(material =>
        material.id === materialId
          ? { ...material, file: file, name: file.name }
          : material
      )
    })
  }


  const handleRegistrationChange = (sessionId: number, isEnabled: boolean) => {
    // Handle registration status change
    console.log(`Setting registration for session ${sessionId} to ${isEnabled}`)
    // Here you would update the session status in your state/database
  }

  const renderMyServices = () => (
    <div className="my-sessions-section">
      <div className="section-header">
        <h2>My Sessions</h2>
      </div>

      <div className="sessions-grid">
        <div className="sessions-section">
          <h3>Live Sessions</h3>
          <div className="sessions-list">
            {liveSessions.map(session => (
              <div key={session.id} className={`session-card live-session ${!session.registrationEnabled ? 'registration-disabled' : ''}`}>
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by You</p>
                  </div>
                  <div className="session-status-container">
                    <span className="session-status live">LIVE</span>
                    {!session.registrationEnabled && (
                      <span className="registration-status disabled">Registration Closed</span>
                    )}
                  </div>
                </div>
                <div className="session-details">
                  <p><span className="icon">📅</span> {session.date} at {session.time}</p>
                  <p><span className="icon">👥</span> {session.participants}/{session.maxParticipants} participants</p>
                  <p><span className="icon">💰</span> LKR {session.price}</p>
                  {!session.registrationEnabled && (
                    <p className="registration-note">⚠️ New registrations are currently disabled</p>
                  )}
                </div>
                <div className="session-link">
                  <p className="link-label">Session Link:</p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={`https://stellarion.com/session/${session.id}`}
                      readOnly
                      className="session-link-input"
                    />
                  </div>
                </div>
                <div className="registration-control-section">
                  <div className="control-header">
                    <h4>Registration Settings</h4>
                
                  </div>
                  <div className="registration-toggle">
                    <div className="toggle-options">
                      <label className={`toggle-option ${session.registrationEnabled ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`registration-${session.id}`}
                          checked={session.registrationEnabled === true}
                          onChange={() => handleRegistrationChange(session.id, true)}
                        />
                        <span className="option-icon">🟢</span>
                        <span className="option-text">
                          <strong>Available</strong>
            
                        </span>
                      </label>
                      <label className={`toggle-option ${!session.registrationEnabled ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`registration-${session.id}`}
                          checked={session.registrationEnabled === false}
                          onChange={() => handleRegistrationChange(session.id, false)}
                        />
                        <span className="option-icon">🔴</span>
                        <span className="option-text">
                          <strong>Unavailable</strong>
                          
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="session-actions">
                  <Button onClick={() => handleStartSession(session)} variant="primary">Start Session</Button>
                  <Button onClick={() => handleEditSession(session)}>Edit Session</Button>
                  <Button onClick={() => handleViewAnalytics(session)}>View Analytics</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sessions-section">
          <h3>Recorded Sessions</h3>
          <div className="sessions-list">
            {recordedSessions.map(session => (
              <div key={session.id} className={`session-card recorded-session ${!session.registrationEnabled ? 'registration-disabled' : ''}`}>
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by You</p>
                  </div>
                  <div className="session-status-container">
                    <span className="session-status recorded">RECORDED</span>
                    {!session.registrationEnabled && (
                      <span className="registration-status disabled">Unavailable</span>
                    )}
                  </div>
                </div>
                <div className="session-details">
                  <p><span className="icon">💰</span> LKR {session.price}</p>
                  <p><span className="icon">📊</span> {session.purchases} purchases</p>
                  <p><span className="icon">⭐</span> {session.rating}/5.0</p>
                  <p><span className="icon">💵</span> LKR {session.earnings} earned</p>
                  {!session.registrationEnabled && (
                    <p className="registration-note">⚠️ This session is currently unavailable for purchase</p>
                  )}
                </div>
                <div className="session-link">
                  <p className="link-label">Session Link:</p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={`https://stellarion.com/session/${session.id}`}
                      readOnly
                      className="session-link-input"
                    />
                  </div>
                </div>
                <div className="registration-control-section">
                  <div className="control-header">
                    <h4>Availability Settings</h4>
                    <p className="control-description">Control whether users can purchase this session</p>
                  </div>
                  <div className="registration-toggle">
                    <div className="toggle-options">
                      <label className={`toggle-option ${session.registrationEnabled ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`availability-${session.id}`}
                          checked={session.registrationEnabled === true}
                          onChange={() => handleRegistrationChange(session.id, true)}
                        />
                        <span className="option-icon">🟢</span>
                        <span className="option-text">
                          <strong>Available</strong>
                          
                        </span>
                      </label>
                      <label className={`toggle-option ${!session.registrationEnabled ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`availability-${session.id}`}
                          checked={session.registrationEnabled === false}
                          onChange={() => handleRegistrationChange(session.id, false)}
                        />
                        <span className="option-icon">🔴</span>
                        <span className="option-text">
                          <strong>Unavailable</strong>
                         
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="session-actions">
                  <Button onClick={() => handleEditSession(session)}>Edit Session</Button>
                  <Button onClick={() => handleViewAnalytics(session)}>View Analytics</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderNewSession = () => (
    <div className="new-session-form">
      <div className="form-header">
        <Button 
          onClick={() => setActiveTab('my-sessions')}
        >
          ← Back to My Sessions
        </Button>
      </div>
      <h2>Create New Session</h2>
      <form className="session-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Session Title</label>
            <input 
              type="text" 
              value={newSession.title}
              onChange={(e) => setNewSession({...newSession, title: e.target.value})}
              placeholder="Enter session title"
            />
          </div>
          
          <div className="form-group">
            <label>Session Type</label>
            <select 
              value={newSession.type}
              onChange={(e) => setNewSession({...newSession, type: e.target.value})}
            >
              <option value="live">Live Session</option>
              <option value="recorded">Recorded Session</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (LKR)</label>
            <input 
              type="number" 
              value={newSession.price}
              onChange={(e) => setNewSession({...newSession, price: e.target.value})}
              placeholder="2500"
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input 
              type="number" 
              value={newSession.duration}
              onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
              placeholder="60"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={newSession.date}
              onChange={(e) => setNewSession({...newSession, date: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input 
              type="time" 
              value={newSession.time}
              onChange={(e) => setNewSession({...newSession, time: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Max Participants</label>
            <input 
              type="number" 
              value={newSession.maxParticipants}
              onChange={(e) => setNewSession({...newSession, maxParticipants: e.target.value})}
              placeholder="20"
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select 
              value={newSession.difficulty}
              onChange={(e) => setNewSession({...newSession, difficulty: e.target.value})}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

           <div className="form-group">
            <label>Session Link</label>
            <input 
              type="text" 
              value={newSession.link}
              onChange={(e) => setNewSession({...newSession, link: e.target.value})}
              placeholder="link to your session"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea 
            value={newSession.description}
            onChange={(e) => setNewSession({...newSession, description: e.target.value})}
            placeholder="Describe your session..."
            rows={4}
          />
        </div>

        <div className="materials-section">
          <h3>Session Materials</h3>
          <p className="materials-description">Add materials that participants will receive with this session</p>
          
          {newSession.materials.map((material) => (
            <div key={material.id} className="material-item-form">
              <div className="material-form-grid">
                <div className="form-group">
                  <label>Material Name</label>
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => handleMaterialChange(material.id, 'name', e.target.value)}
                    placeholder="Enter material name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Material Type</label>
                  <select
                    value={material.type}
                    onChange={(e) => handleMaterialChange(material.id, 'type', e.target.value)}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                {material.type === 'link' ? (
                  <div className="form-group">
                    <label>URL</label>
                    <input
                      type="url"
                      value={material.url}
                      onChange={(e) => handleMaterialChange(material.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Upload File</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(material.id, e.target.files[0]);
                        }
                      }}
                      accept={
                        material.type === 'pdf' ? '.pdf' :
                        material.type === 'video' ? '.mp4,.mov,.avi' :
                        material.type === 'image' ? '.jpg,.jpeg,.png,.gif' :
                        material.type === 'audio' ? '.mp3,.wav,.ogg' : '*'
                      }
                    />
                  </div>
                )}

                <div className="material-actions">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => handleRemoveMaterial(material.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="add-material-section">
            <Button 
              type="button"
              variant="secondary"
              onClick={handleAddMaterial}
            >
              + Add Material
            </Button>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Session Notes</label>
          <textarea 
            value={newSession.notes}
            onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
            placeholder="Additional notes for participants..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <Button type="button">Save as Draft</Button>
          <Button type="submit">Create Session</Button>
        </div>
      </form>
    </div>
  )

  const renderAnalytics = () => (
    <div className="analytics-dashboard">
      <h2>My Sessions Analytics</h2>
      
      <div className="analytics-grid">
        <div className="chart-container">
          <h3>My Sessions Earnings Trend</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="bar" style={{height: '60%'}}></div>
              <div className="bar" style={{height: '80%'}}></div>
              <div className="bar" style={{height: '45%'}}></div>
              <div className="bar" style={{height: '90%'}}></div>
              <div className="bar" style={{height: '70%'}}></div>
              <div className="bar" style={{height: '95%'}}></div>
            </div>
            <div className="chart-labels">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        <div className="analytics-stats">
          <h3>My Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">89%</span>
              <span className="metric-label">My Attendance Rate</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">4.8</span>
              <span className="metric-label">My Avg Rating</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">156</span>
              <span className="metric-label">My Total Reviews</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">LKR 140,400</span>
              <span className="metric-label">My Earnings This Month</span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Recent Reviews for My Sessions</h3>
          <div className="reviews-list">
            <div className="review-item">
              <div className="review-rating">⭐⭐⭐⭐⭐</div>
              <p>"Amazing session on deep space photography!"</p>
              <span className="review-author">- Sarah K.</span>
            </div>
            <div className="review-item">
              <div className="review-rating">⭐⭐⭐⭐⭐</div>
              <p>"Very informative and well structured."</p>
              <span className="review-author">- Mike D.</span>
            </div>
            <div className="review-item">
              <div className="review-rating">⭐⭐⭐⭐</div>
              <p>"Great for beginners, highly recommend!"</p>
              <span className="review-author">- Lisa M.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderManageSessionModal = () => {
    if (!showManageModal || !selectedSession) return null

    return (
      <div className="modal-overlay" onClick={() => setShowManageModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Manage Session: {selectedSession.title}</h3>
            <button className="close-btn" onClick={() => setShowManageModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="session-info">
              <h4>Session Details</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>Date & Time:</label>
                  <span>{selectedSession.date} at {selectedSession.time}</span>
                </div>
                <div className="info-item">
                  <label>Participants:</label>
                  <span>{selectedSession.participants}/{selectedSession.maxParticipants}</span>
                </div>
                <div className="info-item">
                  <label>Price:</label>
                  <span>LKR {selectedSession.price}</span>
                </div>
              </div>
            </div>

            <div className="session-controls">
              <h4>Session Controls</h4>
              <div className="control-buttons">
                <Button>Start Session</Button>
                <Button variant="secondary">Edit Details</Button>
                <Button variant="secondary">Send Reminder</Button>
                <Button variant="secondary">View Participants</Button>
                <Button variant="secondary">Cancel Session</Button>
              </div>
            </div>

            <div className="session-settings">
              <h4>Settings</h4>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Allow late joins
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Record session
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Require camera
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input type="checkbox" />
                    Mute participants on join
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowManageModal(false)}>
              Close
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    )
  }

  const renderDetailsModal = () => {
    if (!showDetailsModal || !selectedSession) return null

    return (
      <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Session Details: {selectedSession.title}</h3>
            <button className="close-btn" onClick={() => setShowDetailsModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="session-overview">
              <h4>Overview</h4>
              <div className="overview-stats">
                <div className="stat-item">
                  <span className="stat-label">Status:</span>
                  <span className="stat-value">{selectedSession.date ? 'Scheduled' : 'Recorded'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Current Participants:</span>
                  <span className="stat-value">{selectedSession.participants || selectedSession.purchases || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Revenue:</span>
                  <span className="stat-value">LKR {selectedSession.earnings || ((selectedSession.participants ?? 0) * selectedSession.price) || 0}</span>
                </div>
              </div>
            </div>

            <div className="participants-section">
              <h4>Participants List</h4>
              <div className="participants-list">
                <div className="participant-item">
                  <span className="participant-name">John Doe</span>
                  <span className="participant-email">john@example.com</span>
                  <span className="participant-status">Confirmed</span>
                </div>
                <div className="participant-item">
                  <span className="participant-name">Jane Smith</span>
                  <span className="participant-email">jane@example.com</span>
                  <span className="participant-status">Confirmed</span>
                </div>
                <div className="participant-item">
                  <span className="participant-name">Mike Johnson</span>
                  <span className="participant-email">mike@example.com</span>
                  <span className="participant-status">Pending</span>
                </div>
              </div>
            </div>

            <div className="session-materials">
              <h4>Session Materials</h4>
              <div className="materials-list">
                <div className="material-item">
                  <span className="material-icon">📄</span>
                  <span className="material-name">Introduction to Deep Space.pdf</span>
                  <Button variant="secondary" size="small">Download</Button>
                </div>
                <div className="material-item">
                  <span className="material-icon">🎥</span>
                  <span className="material-name">Setup Tutorial.mp4</span>
                  <Button variant="secondary" size="small">View</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            <Button>Export Details</Button>
          </div>
        </div>
      </div>
    )
  }

  const renderEditModal = () => {
    if (!showEditModal || !selectedSession) return null

    return (
      <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Edit Session: {selectedSession.title}</h3>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <form className="edit-session-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Session Title</label>
                  <input type="text" defaultValue={selectedSession.title} />
                </div>
                <div className="form-group">
                  <label>Price (LKR)</label>
                  <input type="number" defaultValue={selectedSession.price} />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={3} placeholder="Session description..."></textarea>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select>
                    <option value="observation">Observation</option>
                    <option value="photography">Astrophotography</option>
                    <option value="theory">Theory & Concepts</option>
                  </select>
                </div>
              </div>

              <div className="pricing-options">
                <h4>Pricing Options</h4>
                <div className="pricing-grid">
                  <div className="pricing-item">
                    <label>
                      <input type="checkbox" />
                      Enable Early Bird Discount (20% off)
                    </label>
                  </div>
                  <div className="pricing-item">
                    <label>
                      <input type="checkbox" />
                      Bulk Purchase Discount (3+ sessions)
                    </label>
                  </div>
                  <div className="pricing-item">
                    <label>
                      <input type="checkbox" />
                      Student Discount (15% off)
                    </label>
                  </div>
                </div>
              </div>

              <div className="visibility-settings">
                <h4>Visibility Settings</h4>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Visible to public
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      Featured session
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Allow reviews
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalyticsModal = () => {
    if (!showAnalyticsModal || !selectedSession) return null

    const isLiveSession = selectedSession.date && selectedSession.time
    
    return (
      <div className="modal-overlay" onClick={() => setShowAnalyticsModal(false)}>
        <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Analytics: {selectedSession.title}</h3>
            <button className="close-btn" onClick={() => setShowAnalyticsModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="analytics-overview">
              <h4>Performance Overview</h4>
              <div className="metrics-row">
                <div className="metric-card">
                  <span className="metric-value">{selectedSession.purchases || selectedSession.participants}</span>
                  <span className="metric-label">{isLiveSession ? 'Registered Participants' : 'Total Purchases'}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">LKR {selectedSession.earnings || ((selectedSession.participants ?? 0) * selectedSession.price)}</span>
                  <span className="metric-label">Revenue Generated</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{selectedSession.rating || 'N/A'}/5.0</span>
                  <span className="metric-label">Average Rating</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{isLiveSession ? `${(selectedSession.maxParticipants ?? 0) - (selectedSession.participants ?? 0)} spots` : '92%'}</span>
                  <span className="metric-label">{isLiveSession ? 'Available Spots' : 'Completion Rate'}</span>
                </div>
              </div>
            </div>

            {isLiveSession && (
              <div className="current-registrations">
                <h4>Session Status</h4>
                <div className="registration-stats">
                  <div className="registration-item">
                    <span className="registration-label">Registration Rate:</span>
                    <span className="registration-value">{Math.round(((selectedSession.participants ?? 0) / (selectedSession.maxParticipants ?? 1)) * 100)}%</span>
                  </div>
                  <div className="registration-item">
                    <span className="registration-label">Days Until Session:</span>
                    <span className="registration-value">
                      {selectedSession.date
                        ? Math.ceil((new Date(selectedSession.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        : 'N/A'} days
                    </span>
                  </div>
                  <div className="registration-item">
                    <span className="registration-label">Current Registrations:</span>
                    <span className="registration-value">{selectedSession.participants}/{selectedSession.maxParticipants}</span>
                  </div>
                </div>
              </div>
            )}

            {!isLiveSession && (
              <div className="engagement-analytics">
                <h4>Engagement Metrics</h4>
                <div className="engagement-stats">
                  <div className="engagement-item">
                    <span className="engagement-label">Average Watch Time:</span>
                    <span className="engagement-value">45 minutes</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Questions Asked:</span>
                    <span className="engagement-value">23</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Interaction Rate:</span>
                    <span className="engagement-value">78%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="revenue-breakdown">
              <h4>Revenue Breakdown</h4>
              <div className="revenue-stats">
                <div className="revenue-item">
                  <span className="revenue-label">Base Price Revenue:</span>
                  <span className="revenue-value">LKR {(selectedSession.price * (selectedSession.purchases || selectedSession.participants || 0))}</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">Platform Fee (10%):</span>
                  <span className="revenue-value">-LKR {Math.round((selectedSession.price * (selectedSession.purchases || selectedSession.participants || 0)) * 0.1)}</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">Net Earnings:</span>
                  <span className="revenue-value">LKR {selectedSession.earnings || Math.round((selectedSession.price * (selectedSession.purchases || selectedSession.participants || 0)) * 0.9)}</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h4>Recent Feedback</h4>
              <div className="feedback-list">
                <div className="feedback-item">
                  <div className="feedback-rating">⭐⭐⭐⭐⭐</div>
                  <p>"Excellent session with clear explanations!"</p>
                  <span className="feedback-author">- Sarah K.</span>
                </div>
                <div className="feedback-item">
                  <div className="feedback-rating">⭐⭐⭐⭐</div>
                  <p>"Very informative, would recommend to others."</p>
                  <span className="feedback-author">- Mike D.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
              Close
            </Button>
            <Button>Export Report</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>Astronomy Sessions</h1>
      </div>

      <div className="sessions-tabs">
        <Button 
          variant={activeTab === 'my-sessions' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('my-sessions')}
        >
          My Sessions
        </Button>
        <Button 
          variant={activeTab === 'new-session' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('new-session')}
        >
          Create Session
        </Button>
        <Button 
          variant={activeTab === 'analytics' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('analytics')}
        >
          My Analytics
        </Button>
      </div>

      <div className="sessions-content">
        {activeTab === 'my-sessions' && renderMyServices()}
        {activeTab === 'new-session' && renderNewSession()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {renderManageSessionModal()}
      {renderDetailsModal()}
      {renderEditModal()}
      {renderAnalyticsModal()}
    </div>
  )
}

export default Sessions

