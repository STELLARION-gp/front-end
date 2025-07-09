import React, { useState } from 'react'
import '../../styles/pages/influencer/Sessions.scss';
import Button from '../../components/Button';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('my-sessions')
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

  const renderMyServices = () => (
    <div className="my-sessions-section">
      <div className="section-header">
        <h2>My Sessions</h2>
        <Button 
          onClick={() => setActiveTab('new-session')}
        >
          + Create New Session
        </Button>
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
                  <Button>Manage Session</Button>
                  <Button>View Details</Button>
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
                  <Button>Edit Pricing</Button>
                  <Button>View Analytics</Button>
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

  const renderPricing = () => (
    <div className="pricing-panel">
      <h2>Pricing & Session Management</h2>
      
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Create New Session</h3>
          <div className="create-session-quick">
            <p>Quick session creation with your default settings</p>
            <div className="form-group">
              <label>Session Title</label>
              <input type="text" placeholder="Enter session title" />
            </div>
            <div className="form-group">
              <label>Session Type</label>
              <select>
                <option value="live">Live Session</option>
                <option value="recorded">Recorded Session</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date & Time</label>
              <div className="date-time-row">
                <input type="date" />
                <input type="time" />
              </div>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" placeholder="60" />
            </div>
            <Button 
              onClick={() => setActiveTab('new-session')}
            >
              Create Full Session
            </Button>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Default Pricing</h3>
          <div className="price-settings">
            <div className="form-group">
              <label>Live Session Rate (LKR)</label>
              <input type="number" placeholder="3000" />
            </div>
            <div className="form-group">
              <label>Recorded Session Rate (LKR)</label>
              <input type="number" placeholder="1500" />
            </div>
            <div className="form-group">
              <label>Default Duration (minutes)</label>
              <input type="number" placeholder="60" />
            </div>
            <div className="form-group">
              <label>Default Max Participants</label>
              <input type="number" placeholder="20" />
            </div>
            <Button>Update Default Settings</Button>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Discount Management</h3>
          <div className="discount-settings">
            <div className="form-group">
              <label>Discount Percentage</label>
              <input type="number" placeholder="20" />
            </div>
            <div className="form-group">
              <label>Valid Until</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Apply to Session Type</label>
              <select>
                <option value="all">All Sessions</option>
                <option value="live">Live Sessions Only</option>
                <option value="recorded">Recorded Sessions Only</option>
              </select>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="freeAccess" />
              <label htmlFor="freeAccess">Enable Free Access</label>
            </div>
            <Button>Apply Discount</Button>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Session Settings</h3>
          <div className="session-default-settings">
            <h4>Default Session Configuration</h4>
            <div className="settings-grid">
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Auto-accept registrations
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Send reminder emails
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Require camera for participants
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Record sessions by default
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Allow late joins (up to 10 min)
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Mute participants on join
                </label>
              </div>
            </div>
            
            <h4>Notification Settings</h4>
            <div className="settings-grid">
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Email me when someone registers
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" defaultChecked />
                  Send session reminders to participants
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  SMS notifications for urgent updates
                </label>
              </div>
            </div>

            <h4>Session Templates</h4>
            <div className="template-options">
              <div className="form-group">
                <label>Default Session Category</label>
                <select>
                  <option value="observation">Observation</option>
                  <option value="photography">Astrophotography</option>
                  <option value="theory">Theory & Concepts</option>
                  <option value="equipment">Equipment & Setup</option>
                </select>
              </div>
              <div className="form-group">
                <label>Default Difficulty Level</label>
                <select>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <Button>Save Settings</Button>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Availability Settings</h3>
          <div className="availability-settings">
            <div className="toggle-group">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span>Allow New Bookings</span>
            </div>
            <p className="toggle-description">
              Temporarily disable session bookings for maintenance or schedule changes
            </p>
            
            <div className="form-group">
              <label>Weekly Schedule</label>
              <div className="schedule-grid">
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" />
                    <span>Monday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" placeholder="Start" />
                    <input type="time" placeholder="End" />
                  </div>
                </div>
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" />
                    <span>Tuesday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" placeholder="Start" />
                    <input type="time" placeholder="End" />
                  </div>
                </div>
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Wednesday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" defaultValue="19:00" />
                    <input type="time" defaultValue="22:00" />
                  </div>
                </div>
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" />
                    <span>Thursday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" placeholder="Start" />
                    <input type="time" placeholder="End" />
                  </div>
                </div>
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Friday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" defaultValue="20:00" />
                    <input type="time" defaultValue="23:00" />
                  </div>
                </div>
                <div className="day-schedule">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>Saturday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" defaultValue="18:00" />
                    <input type="time" defaultValue="22:00" />
                  </div>
                </div>

                <div className="day-schedule">
                  <label>
                    <input type="checkbox" />
                    <span>Sunday</span>
                  </label>
                  <div className="time-slots">
                    <input type="time" placeholder="Start" />
                    <input type="time" placeholder="End" />
                  </div>
                </div>
              </div>
            </div>

            <div className="availability-status active">
              <span className="status-indicator"></span>
              Bookings Currently Active
            </div>
          </div>
        </div>
      </div>
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
          variant={activeTab === 'pricing' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('pricing')}
        >
          Settings & Pricing
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
        {activeTab === 'pricing' && renderPricing()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  )
}

export default Sessions


