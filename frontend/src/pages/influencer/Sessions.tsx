import React, { useState } from 'react'
import '../../styles/pages/influencer/Sessions.scss';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('overview')
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
    category: 'observation',
    materials: [],
    notes: ''
  })

  // Mock data
  const upcomingSessions = [
    { id: 1, title: 'Deep Space Photography', date: '2024-01-15', time: '20:00', participants: 12, maxParticipants: 20, price: 45 },
    { id: 2, title: 'Planetary Observation', date: '2024-01-18', time: '21:30', participants: 8, maxParticipants: 15, price: 35 }
  ]

  const recordedSessions = [
    { id: 1, title: 'Beginner Stargazing', price: 25, purchases: 156, rating: 4.8, earnings: 3900 },
    { id: 2, title: 'Telescope Setup Guide', price: 30, purchases: 89, rating: 4.9, earnings: 2670 }
  ]

  const renderOverview = () => (
    <div className="sessions-overview">
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-content">
            <h3>24</h3>
            <p>Total Sessions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>$12,450</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>342</h3>
            <p>Total Participants</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>4.7</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="sessions-grid">
        <div className="sessions-section">
          <h2>Upcoming Live Sessions</h2>
          <div className="sessions-list">
            {upcomingSessions.map(session => (
              <div key={session.id} className="session-card live-session">
                <div className="session-header">
                  <h3>{session.title}</h3>
                  <span className="session-status live">LIVE</span>
                </div>
                <div className="session-details">
                  <p><span className="icon">📅</span> {session.date} at {session.time}</p>
                  <p><span className="icon">👥</span> {session.participants}/{session.maxParticipants} participants</p>
                  <p><span className="icon">💰</span> ${session.price}</p>
                </div>
                <div className="session-actions">
                  <button className="btn-primary">Manage Session</button>
                  <button className="btn-secondary">Upload Materials</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sessions-section">
          <h2>Recorded Sessions</h2>
          <div className="sessions-list">
            {recordedSessions.map(session => (
              <div key={session.id} className="session-card recorded-session">
                <div className="session-header">
                  <h3>{session.title}</h3>
                  <span className="session-status recorded">RECORDED</span>
                </div>
                <div className="session-details">
                  <p><span className="icon">💰</span> ${session.price}</p>
                  <p><span className="icon">📊</span> {session.purchases} purchases</p>
                  <p><span className="icon">⭐</span> {session.rating}/5.0</p>
                  <p><span className="icon">💵</span> ${session.earnings} earned</p>
                </div>
                <div className="session-actions">
                  <button className="btn-primary">Edit Pricing</button>
                  <button className="btn-secondary">View Analytics</button>
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
            <label>Price ($)</label>
            <input 
              type="number" 
              value={newSession.price}
              onChange={(e) => setNewSession({...newSession, price: e.target.value})}
              placeholder="0.00"
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
          <button type="button" className="btn-secondary">Save as Draft</button>
          <button type="submit" className="btn-primary">Create Session</button>
        </div>
      </form>
    </div>
  )

  const renderPricing = () => (
    <div className="pricing-panel">
      <h2>Session Pricing Management</h2>
      
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Default Pricing</h3>
          <div className="price-settings">
            <div className="form-group">
              <label>Live Session Rate</label>
              <input type="number" placeholder="45.00" />
            </div>
            <div className="form-group">
              <label>Recorded Session Rate</label>
              <input type="number" placeholder="25.00" />
            </div>
            <button className="btn-primary">Update Rates</button>
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
            <div className="checkbox-group">
              <input type="checkbox" id="freeAccess" />
              <label htmlFor="freeAccess">Enable Free Access</label>
            </div>
            <button className="btn-primary">Apply Discount</button>
          </div>
        </div>

        <div className="pricing-card">
          <h3>Availability Settings</h3>
          <div className="availability-settings">
            <div className="toggle-group">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
                Allow New Bookings
              </label>
            </div>
            <p className="toggle-description">
              Temporarily disable session bookings for maintenance or schedule changes
            </p>
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
      <h2>Session Analytics</h2>
      
      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Earnings Trend</h3>
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
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-value">89%</span>
              <span className="metric-label">Attendance Rate</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">4.8</span>
              <span className="metric-label">Avg Rating</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">156</span>
              <span className="metric-label">Total Reviews</span>
            </div>
            <div className="metric-item">
              <span className="metric-value">$2,340</span>
              <span className="metric-label">This Month</span>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Recent Reviews</h3>
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
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setActiveTab('new-session')}
          >
            + Create New Session
          </button>
        </div>
      </div>

      <div className="sessions-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'new-session' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-session')}
        >
          New Session
        </button>
        <button 
          className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing & Settings
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="sessions-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'new-session' && renderNewSession()}
        {activeTab === 'pricing' && renderPricing()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  )
}

export default Sessions
