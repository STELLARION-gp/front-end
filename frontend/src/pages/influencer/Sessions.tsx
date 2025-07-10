import React, { useState } from 'react'
import '../../styles/pages/influencer/Sessions.scss';
import Button from '../../components/Button';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('my-sessions')
  const [showManageModal, setShowManageModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [newSession, setNewSession] = useState({
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
    { id: 1, title: 'Deep Space Photography', date: '2024-01-15', time: '20:00', participants: 12, maxParticipants: 20, price: 13500, status: 'upcoming' },
    { id: 2, title: 'Planetary Observation', date: '2024-01-18', time: '21:30', participants: 8, maxParticipants: 15, price: 10500, status: 'upcoming' }
  ]

  const recordedSessions = [
    { id: 1, title: 'Beginner Stargazing', price: 1500, purchases: 156, rating: 4.8, earnings: 234000 },
    { id: 2, title: 'Telescope Setup Guide', price: 2000, purchases: 89, rating: 4.9, earnings: 178000 }
  ]

  const handleEditSession = (session) => {
    setSelectedSession(session)
    setShowEditModal(true)
  }

  const handleViewDetails = (session) => {
    setSelectedSession(session)
    setShowDetailsModal(true)
  }

  const handleManageSession = (session) => {
    setSelectedSession(session)
    setShowManageModal(true)
  }

  const handleViewAnalytics = (session) => {
    setSelectedSession(session)
    setShowAnalyticsModal(true)
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
              <div key={session.id} className="session-card live-session">
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by You</p>
                  </div>
                  <span className="session-status live">LIVE</span>
                </div>
                <div className="session-details">
                  <p><span className="icon">📅</span> {session.date} at {session.time}</p>
                  <p><span className="icon">👥</span> {session.participants}/{session.maxParticipants} participants</p>
                  <p><span className="icon">💰</span> LKR {session.price}</p>
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
                <div className="session-actions">
                  <Button onClick={() => handleManageSession(session)}>Manage Session</Button>
                  <Button onClick={() => handleViewDetails(session)}>View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sessions-section">
          <h3>Recorded Sessions</h3>
          <div className="sessions-list">
            {recordedSessions.map(session => (
              <div key={session.id} className="session-card recorded-session">
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by You</p>
                  </div>
                  <span className="session-status recorded">RECORDED</span>
                </div>
                <div className="session-details">
                  <p><span className="icon">💰</span> LKR {session.price}</p>
                  <p><span className="icon">📊</span> {session.purchases} purchases</p>
                  <p><span className="icon">⭐</span> {session.rating}/5.0</p>
                  <p><span className="icon">💵</span> LKR {session.earnings} earned</p>
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
                  <span className="stat-value">LKR {selectedSession.earnings || (selectedSession.participants * selectedSession.price) || 0}</span>
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
                  <span className="metric-label">Total Participants</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">LKR {selectedSession.earnings || (selectedSession.participants * selectedSession.price)}</span>
                  <span className="metric-label">Revenue Generated</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{selectedSession.rating || 'N/A'}/5.0</span>
                  <span className="metric-label">Average Rating</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">92%</span>
                  <span className="metric-label">Completion Rate</span>
                </div>
              </div>
            </div>

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
