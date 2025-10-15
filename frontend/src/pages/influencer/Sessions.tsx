
import { useState, useEffect } from 'react'
import type React from 'react'
import '../../styles/pages/influencer/Sessions.scss';
import '../../styles/pages/influencer/SessionsNotification.scss';
import Button from '../../components/Button';
import { sessionsService } from '../../services/sessionsService'
import { auth } from '../../firebase'
import type { 
  Session as APISession, 
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionFilters 
} from '../../services/sessionsService';

const Sessions = () => {
  const [activeTab, setActiveTab] = useState('my-sessions')
  const [showManageModal, setShowManageModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<APISession | null>(null)
  const [editForm, setEditForm] = useState<{
    title: string
    price: number
    description: string
    difficulty_level: string
  }>({
    title: '',
    price: 0,
    description: '',
    difficulty_level: 'Beginner'
  })
  
  // API state
  const [mySessions, setMySessions] = useState<APISession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
  }>({
    show: false,
    type: 'success',
    message: ''
  })

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
    paymentType: string // 'free' | 'paid'
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
    difficulty: 'Beginner',
    link: '',
    category: 'observation',
    paymentType: 'paid', // default to paid
    notes: ''
  })

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type, message: '' })
    }, 5000) // Auto-hide after 5 seconds
  }

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
        setUserEmail(user.email)
        console.log('✅ User authenticated:', user.email)
      } else {
        setIsAuthenticated(false)
        setUserEmail(null)
        console.warn('⚠️ User not authenticated')
      }
    })

    return () => unsubscribe()
  }, [])

  // Load sessions on component mount and when activeTab changes
  useEffect(() => {
    if (activeTab === 'my-sessions' && isAuthenticated) {
      loadMySessions()
    }
  }, [activeTab, isAuthenticated])

  // Load user's sessions from API
  const loadMySessions = async (filters?: SessionFilters) => {
    if (!isAuthenticated) {
      setError('Please log in to view your sessions')
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('📋 Loading sessions for user:', userEmail)
      const response = await sessionsService.getMySessions({
        page: currentPage,
        limit: 10,
        sort_by: 'session_date',
        sort_order: 'desc',
        ...filters
      })
      setMySessions(response.data || [])
      console.log('✅ Loaded', response.data?.length || 0, 'sessions')
    } catch (err) {
      console.error('❌ Error loading sessions:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions'
      setError(errorMessage)
      
      // If authentication error, provide helpful message
      if (errorMessage.includes('Authentication') || errorMessage.includes('log in')) {
        setError('Authentication required. Please log in to continue.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Create a new session
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      showNotification('error', '🔒 Please log in to create a session.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log('📝 Creating session for user:', userEmail)
      const sessionData: CreateSessionRequest = {
        title: newSession.title,
        description: newSession.description,
        session_type: newSession.type as 'live' | 'recorded',
        payment_type: newSession.paymentType as 'paid' | 'free',
        price: newSession.paymentType === 'free' ? 0 : parseFloat(newSession.price) || 0,
        duration: parseInt(newSession.duration) ,
        session_date: newSession.date, // YYYY-MM-DD format
        session_time: newSession.time, // HH:MM format
        max_participants: parseInt(newSession.maxParticipants) || undefined,
        difficulty_level: newSession.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        session_link: newSession.link || undefined,
        session_notes: newSession.notes || undefined
      }

      const result = await sessionsService.createSession(sessionData)
      console.log('Session created successfully:', result)
      
      // Reset form and switch to my sessions tab
      setNewSession({
        title: '',
        description: '',
        type: 'live',
        price: '',
        duration: '',
        date: '',
        time: '',
        maxParticipants: '',
        difficulty: 'Beginner',
        link: '',
        category: 'observation',
        paymentType: 'paid',
        notes: ''
      })
      
      setActiveTab('my-sessions')
      loadMySessions()
      
      showNotification('success', '✨ Session created successfully!')
    } catch (err) {
      console.error('Error creating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
      showNotification('error', 'Failed to create session: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Update an existing session
  const handleUpdateSession = async (sessionId: number, updates: UpdateSessionRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await sessionsService.updateSession(sessionId, updates)
      console.log('Session updated successfully:', result)
      
      // Reload sessions
      loadMySessions()
      setShowEditModal(false)
      
      showNotification('success', '✅ Session updated successfully!')
    } catch (err) {
      console.error('Error updating session:', err)
      setError(err instanceof Error ? err.message : 'Failed to update session')
      showNotification('error', 'Failed to update session: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  // Delete a session
  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm('Are you sure you want to permanently delete this session? This action cannot be undone.')) return
    
    setLoading(true)
    setError(null)
    
    try {
      await sessionsService.deleteSession(sessionId)
      console.log('Session deleted successfully')
      
      // Reload sessions
      loadMySessions()
      
      showNotification('success', '🗑️ Session deleted successfully!')
    } catch (err) {
      console.error('Error deleting session:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete session')
      showNotification('error', 'Failed to delete session: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleEditSession = (session: APISession) => {
    setSelectedSession(session)
    // Initialize edit form with session data
    setEditForm({
      title: session.title,
      price: session.price || 0,
      description: session.description,
      difficulty_level: session.difficulty_level
    })
    setShowEditModal(true)
  }

  const handleViewAnalytics = (session: APISession) => {
    setSelectedSession(session)
    setShowAnalyticsModal(true)
  }

  const handleStartSession = (session: APISession) => {
    // Handle starting the live session
    console.log('Starting session:', session.title)
    const sessionLink = 'session_link' in session ? session.session_link : undefined
    if (sessionLink) {
      window.open(sessionLink, '_blank')
    } else {
      alert('No meeting link configured for this session')
    }
  }

  const renderMyServices = () => {
    // Check authentication first
    if (!isAuthenticated) {
      return (
        <div className="auth-required-state">
          <h3>🔒 Authentication Required</h3>
          <p>Please log in to view and manage your sessions.</p>
          <p>Current user: {userEmail || 'Not logged in'}</p>
          <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>
      )
    }

    // Separate sessions into live and recorded
    const liveSessions = mySessions.filter(s => s.session_type === 'live')
    const recordedSessions = mySessions.filter(s => s.session_type === 'recorded')

    if (loading) {
      return <div className="loading-state">Loading sessions...</div>
    }

    if (error) {
      return (
        <div className="error-state">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
          {error.includes('Authentication') && (
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          )}
        </div>
      )
    }

    if (mySessions.length === 0) {
      return (
        <div className="empty-state">
          <h3>No sessions yet</h3>
          <p>Create your first session to get started!</p>
          <p>Logged in as: {userEmail}</p>
          <Button onClick={() => setActiveTab('new-session')}>Create Session</Button>
        </div>
      )
    }

    return (
    <div className="my-sessions-section">
      <div className="section-header">
        <h2>My Sessions</h2>
      </div>

      <div className="sessions-grid">
        {liveSessions.length > 0 && (
        <div className="sessions-section">
          <h3>Live Sessions</h3>
          <div className="sessions-list">
            {liveSessions.map(session => {
              const isDisabled = !session.is_enabled
              const sessionDate = new Date(session.session_date)
              
              // Extract time without timezone conversion
              const sessionTimeStr = typeof session.session_time === 'string' 
                ? session.session_time 
                : (() => {
                    const timeDate = new Date(session.session_time);
                    const hours = timeDate.getUTCHours().toString().padStart(2, '0');
                    const minutes = timeDate.getUTCMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                  })()
              
              // Format price to 2 decimal places
              const formattedPrice = session.price ? parseFloat(session.price.toString()).toFixed(2) : '0.00'
              
              return (
              <div key={session.id} className={`influencer-session-card live-session ${isDisabled ? 'registration-disabled' : ''}`}>
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by {session.creator?.display_name || 'You'}</p>
                  </div>
                  <div className="session-status-container">
                    <span className="session-status live">LIVE</span>
                  </div>
                </div>
                <div className="session-details">
                  <p><span className="icon">📅</span> {sessionDate.toLocaleDateString()}</p>
                  <p><span className="icon">🕐</span> {sessionTimeStr}</p>
                  <p><span className="icon">⏱️</span> {session.duration} minutes</p>
                  <p><span className="icon">👥</span> Max {session.max_participants || 'Unlimited'} participants</p>
                  <p><span className="icon">💰</span> LKR {formattedPrice}</p>
                  <p className="session-payment-type">
                    <span className={`payment-label ${session.payment_type}`}>
                      {session.payment_type === 'free' ? 'Free' : 'Paid'}
                    </span>
                  </p>
                  <p><span className="icon">📊</span> {session.difficulty_level}</p>
                  {isDisabled && (
                    <p className="registration-note">⚠️ New registrations are currently disabled</p>
                  )}
                </div>
                <div className="session-link">
                  <p className="link-label">Session Link:</p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={session.session_link || `https://stellarion.com/session/${session.id}`}
                      readOnly
                      className="session-link-input"
                    />
                  </div>
                </div>
                <div className="session-actions">
                  <Button onClick={() => handleStartSession(session)} variant="primary">Start Session</Button>
                  <Button onClick={() => handleEditSession(session)}>Edit Session</Button>
                  <Button onClick={() => handleViewAnalytics(session)}>View Analytics</Button>
                  <Button onClick={() => handleDeleteSession(session.id)} variant="secondary">Delete</Button>
                </div>
              </div>
            )})}
          </div>
        </div>
        )}

        {recordedSessions.length > 0 && (
        <div className="sessions-section">
          <h3>Recorded Sessions</h3>
          <div className="sessions-list">
            {recordedSessions.map(session => {
              const isDisabled = !session.is_enabled
              
              // Format price to 2 decimal places
              const formattedPrice = session.price ? parseFloat(session.price.toString()).toFixed(2) : '0.00'
              
              return (
              <div key={session.id} className={`influencer-session-card recorded-session ${isDisabled ? 'registration-disabled' : ''}`}>
                <div className="session-header">
                  <div className="session-title-info">
                    <h3>{session.title}</h3>
                    <p className="session-instructor">by {session.creator?.display_name || 'You'}</p>
                  </div>
                  <div className="session-status-container">
                    <span className="session-status recorded">RECORDED</span>
                  </div>
                </div>
                <div className="session-details">
                  <p><span className="icon">💰</span> LKR {formattedPrice}</p>
                  <p className="session-payment-type">
                    <span className={`payment-label ${session.payment_type}`}>
                      {session.payment_type === 'free' ? 'Free' : 'Paid'}
                    </span>
                  </p>
                  <p><span className="icon">⏱️</span> {session.duration} minutes</p>
                  <p><span className="icon">�</span> {session.difficulty_level}</p>
                  {isDisabled && (
                    <p className="registration-note">⚠️ This session is currently unavailable for purchase</p>
                  )}
                </div>
                <div className="session-link">
                  <p className="link-label">Session Link:</p>
                  <div className="link-container">
                    <input 
                      type="text" 
                      value={session.session_link || `https://stellarion.com/session/${session.id}`}
                      readOnly
                      className="session-link-input"
                    />
                  </div>
                </div>
                <div className="session-actions">
                  <Button onClick={() => handleEditSession(session)}>Edit Session</Button>
                  <Button onClick={() => handleViewAnalytics(session)}>View Analytics</Button>
                  <Button onClick={() => handleDeleteSession(session.id)} variant="secondary">Delete</Button>
                </div>
              </div>
            )})}
          </div>
        </div>
        )}
      </div>
    </div>
  )
  }

  const renderNewSession = () => (
    <div className="new-session-form">
      <div className="form-header">
        
      </div>
      <h2>Create New Session</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="session-form" onSubmit={handleCreateSession}>
        <div className="form-grid">
          <div className="form-group">
            <label>Session Title</label>
            <input 
              type="text" 
              value={newSession.title}
              onChange={(e) => setNewSession({...newSession, title: e.target.value})}
              placeholder="Enter session title"
              required
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
            <label>Session Payment Type</label>
            <select
              value={newSession.paymentType}
              onChange={e => setNewSession({ ...newSession, paymentType: e.target.value })}
            >
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (LKR)</label>
            <input
              type="number"
              value={newSession.price}
              onChange={e => setNewSession({ ...newSession, price: e.target.value })}
              placeholder={newSession.paymentType === 'free' ? '0' : 'Enter price'}
              disabled={newSession.paymentType === 'free'}
              required={newSession.paymentType === 'paid'}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input 
              type="number" 
              value={newSession.duration}
              onChange={(e) => setNewSession({...newSession, duration: e.target.value})}
              placeholder='Enter duration'
              required
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={newSession.date}
              onChange={(e) => setNewSession({...newSession, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input 
              type="time" 
              value={newSession.time}
              onChange={(e) => setNewSession({...newSession, time: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Max Participants</label>
            <input 
              type="number" 
              value={newSession.maxParticipants}
              onChange={(e) => setNewSession({...newSession, maxParticipants: e.target.value})}
              placeholder="Enter max participants"
              required
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level</label>
            <select 
              value={newSession.difficulty}
              onChange={(e) => setNewSession({...newSession, difficulty: e.target.value})}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
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
            required
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Session'}
          </Button>
        </div>
      </form>
    </div>
  )

  const renderAnalytics = () => (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>My Sessions Analytics</h2>
        <div className="analytics-filters">
          <select className="date-range-filter">
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card total-revenue">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h4>Total Revenue</h4>
            <p className="amount">LKR 412,400</p>
            <span className="trend positive">+12.5% vs last period</span>
          </div>
        </div>
        <div className="summary-card total-sessions">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <h4>Total Sessions</h4>
            <p className="amount">24</p>
            <span className="trend positive">+8.3% vs last period</span>
          </div>
        </div>
        <div className="summary-card average-rating">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <h4>Average Rating</h4>
            <p className="amount">4.8</p>
            <span className="trend positive">+0.2 vs last period</span>
          </div>
        </div>
        <div className="summary-card total-students">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h4>Total Students</h4>
            <p className="amount">245</p>
            <span className="trend positive">+15.8% vs last period</span>
          </div>
        </div>
      </div>

      <div className="analytics-sections">
        <div className="live-sessions-analytics">
          <div className="section-header">
            <h3>Live Sessions Performance</h3>
            <div className="section-actions">
              <button className="action-btn">Export Report</button>
            </div>
          </div>
          <div className="analytics-grid">
            <div className="chart-container">
              <h4>
                Attendance Trend
                <div className="chart-legend">
                  <span className="legend-item">Weekly attendance</span>
                </div>
              </h4>
              <div className="interactive-chart">
                <div className="chart-bars">
                  {[65, 80, 75, 90, 85, 95].map((height, index) => (
                    <div 
                      key={index} 
                      className="bar-wrapper"
                      
                    >
                      <div 
                        className="bar" 
                        style={{height: `${height}%`}}
                      >
                        <span className="bar-tooltip">{height}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </div>
            <div className="metrics-container">
              <div className="metric-card">
                <h5>Completion Rate</h5>
                <div className="circular-progress">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" className="progress-bg" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.9155" 
                      className="progress" 
                      style={{ strokeDashoffset: `${100 - 92}` }}
                    />
                  </svg>
                  <span className="progress-value">92%</span>
                </div>
              </div>
              <div className="metric-card">
                <h5>Average Duration</h5>
                <p className="metric-value">75 mins</p>
                <span className="metric-label">per session</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recorded-sessions-analytics">
          <div className="section-header">
            <h3>Recorded Sessions Performance</h3>
            <div className="section-actions">
              <button className="action-btn">Export Report</button>
            </div>
          </div>
          <div className="analytics-grid">
            <div className="chart-container">
              <h4>
                Purchase Trend
                <div className="chart-legend">
                  <span className="legend-item secondary">Weekly purchases</span>
                </div>
              </h4>
              <div className="interactive-chart">
                <div className="chart-bars">
                  {[45, 60, 75, 85, 70, 90].map((height, index) => (
                    <div 
                      key={index} 
                      className="bar-wrapper"
                      
                    >
                      <div 
                        className="bar secondary" 
                        style={{height: `${height}%`}}
                      >
                        <span className="bar-tooltip">{height}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
            </div>
            <div className="metrics-container">
              <div className="metric-card">
                <h5>Watch Rate</h5>
                <div className="circular-progress">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" className="progress-bg" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.9155" 
                      className="progress" 
                      style={{ strokeDashoffset: `${100 - 85}` }}
                    />
                  </svg>
                  <span className="progress-value">85%</span>
                </div>
              </div>
              <div className="metric-card">
                <h5>Total Watch Time</h5>
                <p className="metric-value">1,245 hrs</p>
                <span className="metric-label">all time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="engagement-section">
        <h3>Student Engagement</h3>
        <div className="engagement-metrics">
          <div className="engagement-card">
            <h4>Recent Reviews</h4>
            <div className="reviews-list">
              {/*
                Mock reviews data
              */}
              { [
                { rating: 5, comment: "Excellent teaching style!", author: "Sarah K." },
                { rating: 4, comment: "Very informative session", author: "Mike D." },
                { rating: 5, comment: "Great practical examples", author: "Lisa M." }
              ].map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-author">- {review.author}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="engagement-card">
            <h4>Top Performing Sessions</h4>
            <div className="top-sessions-list">
              {/*
                Mock top sessions data
              */}
              { [
                { title: "Deep Space Photography", rating: 4.9, students: 45 },
                { title: "Planetary Observation", rating: 4.8, students: 38 },
                { title: "Telescope Setup Guide", rating: 4.7, students: 42 }
              ].map((session, index) => (
                <div key={index} className="top-session-item">
                  <h5>{session.title}</h5>
                  <div className="session-stats">
                    <span className="rating">{"⭐".repeat(Math.round(session.rating))}</span>
                    <span className="students">{session.students} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderManageSessionModal = () => {
    if (!showManageModal || !selectedSession) return null

    const sessionDate = new Date(selectedSession.session_date)
    const sessionTime = typeof selectedSession.session_time === 'string' 
      ? selectedSession.session_time 
      : new Date(selectedSession.session_time).toLocaleTimeString()

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
                  <span>{sessionDate.toLocaleDateString()} at {sessionTime}</span>
                </div>
                <div className="info-item">
                  <label>Max Participants:</label>
                  <span>{selectedSession.max_participants || 'Unlimited'}</span>
                </div>
                <div className="info-item">
                  <label>Price:</label>
                  <span>LKR {selectedSession.price || 0}</span>
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
                  <span className="stat-value">{selectedSession.session_type === 'live' ? 'Live Session' : 'Recorded Session'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Payment Type:</span>
                  <span className="stat-value">{selectedSession.payment_type}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Price:</span>
                  <span className="stat-value">LKR {selectedSession.price || 0}</span>
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSession) return
    
    const updates: UpdateSessionRequest = {
      title: editForm.title,
      price: editForm.price,
      description: editForm.description,
      difficulty_level: editForm.difficulty_level as 'Beginner' | 'Intermediate' | 'Advanced'
    }
    
    await handleUpdateSession(selectedSession.id, updates)
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
            <form className="edit-session-form" onSubmit={handleEditSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Session Title</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (LKR)</label>
                  <input 
                    type="number" 
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    rows={3} 
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Session description..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select 
                    value={editForm.difficulty_level}
                    onChange={(e) => setEditForm({...editForm, difficulty_level: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalyticsModal = () => {
    if (!showAnalyticsModal || !selectedSession) return null

    const isLiveSession = selectedSession.session_type === 'live'
    const sessionPrice = selectedSession.price || 0
    
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
                  <span className="metric-value">0</span>
                  <span className="metric-label">{isLiveSession ? 'Registered Participants' : 'Total Purchases'}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">LKR 0</span>
                  <span className="metric-label">Revenue Generated</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">N/A/5.0</span>
                  <span className="metric-label">Average Rating</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{isLiveSession ? `${selectedSession.max_participants || 'Unlimited'} spots` : 'N/A'}</span>
                  <span className="metric-label">{isLiveSession ? 'Available Spots' : 'Completion Rate'}</span>
                </div>
              </div>
            </div>

            {isLiveSession && (
              <div className="current-registrations">
                <h4>Session Status</h4>
                <div className="registration-stats">
                  <div className="registration-item">
                    <span className="registration-label">Max Participants:</span>
                    <span className="registration-value">{selectedSession.max_participants || 'Unlimited'}</span>
                  </div>
                  <div className="registration-item">
                    <span className="registration-label">Days Until Session:</span>
                    <span className="registration-value">
                      {Math.ceil((new Date(selectedSession.session_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="registration-item">
                    <span className="registration-label">Duration:</span>
                    <span className="registration-value">{selectedSession.duration} minutes</span>
                  </div>
                </div>
              </div>
            )}

            {!isLiveSession && (
              <div className="engagement-analytics">
                <h4>Engagement Metrics</h4>
                <div className="engagement-stats">
                  <div className="engagement-item">
                    <span className="engagement-label">Duration:</span>
                    <span className="engagement-value">{selectedSession.duration} minutes</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Status:</span>
                    <span className="engagement-value">{selectedSession.is_enabled ? 'Available' : 'Disabled'}</span>
                  </div>
                  <div className="engagement-item">
                    <span className="engagement-label">Difficulty:</span>
                    <span className="engagement-value">{selectedSession.difficulty_level}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="revenue-breakdown">
              <h4>Revenue Breakdown</h4>
              <div className="revenue-stats">
                <div className="revenue-item">
                  <span className="revenue-label">Base Price:</span>
                  <span className="revenue-value">LKR {sessionPrice}</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">Platform Fee (10%):</span>
                  <span className="revenue-value">-LKR {Math.round(sessionPrice * 0.1)}</span>
                </div>
                <div className="revenue-item">
                  <span className="revenue-label">Net Earnings (per sale):</span>
                  <span className="revenue-value">LKR {Math.round(sessionPrice * 0.9)}</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <h4>Session Information</h4>
              <div className="feedback-list">
                <div className="feedback-item">
                  <p><strong>Payment Type:</strong> {selectedSession.payment_type}</p>
                  <p><strong>Difficulty:</strong> {selectedSession.difficulty_level}</p>
                  <p><strong>Type:</strong> {selectedSession.session_type}</p>
                  {selectedSession.session_notes && (
                    <p><strong>Notes:</strong> {selectedSession.session_notes}</p>
                  )}
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

      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification({ ...notification, show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



export default Sessions

