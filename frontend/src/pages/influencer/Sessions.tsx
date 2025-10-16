
import { useState, useEffect } from 'react'
import type React from 'react'
import '../../styles/pages/influencer/Sessions.scss';
import '../../styles/pages/influencer/SessionsNotification.scss';
import Button from '../../components/Button';
import { sessionsService } from '../../services/sessionsService'
import pollService, { type Poll } from '../../services/pollService'
import { auth } from '../../firebase'
import ParticipantsIcon from '../../assets/svg/ParticipantsIcon'
import PriceIcon from '../../assets/svg/PriceIcon'
import DurationIcon from '../../assets/svg/DurationIcon'
import DifficultyIcon from '../../assets/svg/DifficultyIcon'
import DateIcon from '../../assets/svg/DateIcon'
import TimeIcon from '../../assets/svg/TimeIcon'
import StarIcon from '../../assets/svg/StarIcon'
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
    session_date: string
    session_time: string
  }>({
    title: '',
    price: 0,
    description: '',
    difficulty_level: 'Beginner',
    session_date: '',
    session_time: ''
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
  const [analyticsData, setAnalyticsData] = useState<{
    overview: {
      totalRevenue: number
      totalSessions: number
      totalStudents: number
      completionRate: number
      liveSessions: number
      recordedSessions: number
    }
    liveSessionsAnalytics: {
      count: number
      totalStudents: number
      totalRevenue: number
      averageDuration: number
      difficultyDistribution: {
        beginner: number
        intermediate: number
        advanced: number
      }
    }
    recordedSessionsAnalytics: {
      count: number
      totalStudents: number
      totalRevenue: number
      averageDuration: number
      difficultyDistribution: {
        beginner: number
        intermediate: number
        advanced: number
      }
    }
    sessions: Array<{
      id: number
      title: string
      session_type: string
      payment_type: string
      price: number
      duration: number
      difficulty_level: string
      is_enabled: boolean
      studentCount: number
    }>
  } | null>(null)

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

  // Poll state
  const [polls, setPolls] = useState<Poll[]>([])
  const [pollsLoading, setPollsLoading] = useState(false)
  const [pollsError, setPollsError] = useState<string | null>(null)
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    useCustomOptions: false,
    customOptions: ['', ''] // Start with 2 empty options
  })
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [pollStats, setPollStats] = useState<{
    totalVotes: number
    choices: Array<{
      choice: string
      count: number
      percentage: number
    }>
    commentCount: number
  } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; pollId: number | null }>({
    show: false,
    pollId: null
  })
  const [pollComments, setPollComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [postingComment, setPostingComment] = useState(false)

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
        console.log('User authenticated:', user.email)
      } else {
        setIsAuthenticated(false)
        setUserEmail(null)
        console.warn(' User not authenticated')
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

  // Load polls when polls tab is active
  useEffect(() => {
    if (activeTab === 'polls' && isAuthenticated) {
      console.log('Polls tab activated, loading polls...')
      loadPolls()
    } else if (activeTab === 'polls' && !isAuthenticated) {
      console.warn('Cannot load polls: user not authenticated')
    }
  }, [activeTab, isAuthenticated])

  // Load analytics when analytics tab is active
  useEffect(() => {
    if (activeTab === 'analytics' && isAuthenticated) {
      console.log('Analytics tab activated, loading analytics...')
      loadAnalytics()
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
      console.log(' Loading sessions for user:', userEmail)
      const response = await sessionsService.getMySessions({
        page: currentPage,
        limit: 10,
        sort_by: 'session_date',
        sort_order: 'desc',
        ...filters
      })
      setMySessions(response.data || [])
      console.log('Loaded', response.data?.length || 0, 'sessions')
    } catch (err) {
      console.error(' Error loading sessions:', err)
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

  // Load analytics data
  const loadAnalytics = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view analytics')
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('📊 Loading analytics for user:', userEmail)
      const response = await sessionsService.getMySessionsAnalytics()
      setAnalyticsData(response.data || null)
      console.log('✅ Analytics loaded successfully')
    } catch (err) {
      console.error('❌ Error loading analytics:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics'
      setError(errorMessage)
      
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
      showNotification('error', ' Please log in to create a session.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log(' Creating session for user:', userEmail)
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
        difficulty_level: newSession.difficulty.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
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
    
    // Extract date without timezone conversion
    const sessionDateStr = typeof session.session_date === 'string'
      ? session.session_date.split('T')[0]
      : new Date(session.session_date).toISOString().split('T')[0]
    
    // Extract time without timezone conversion
    let sessionTimeStr = '00:00'
    if (typeof session.session_time === 'string') {
      // If it's already a string, just extract HH:MM
      sessionTimeStr = session.session_time.substring(0, 5)
    } else if (session.session_time) {
      // If it's a Date/timestamp, try to extract time
      try {
        const timeDate = new Date(session.session_time)
        // Check if it's a valid date
        if (!isNaN(timeDate.getTime())) {
          const hours = timeDate.getUTCHours().toString().padStart(2, '0')
          const minutes = timeDate.getUTCMinutes().toString().padStart(2, '0')
          sessionTimeStr = `${hours}:${minutes}`
        }
      } catch (e) {
        console.error('Error parsing time:', e)
      }
    }
    
    // Initialize edit form with session data
    setEditForm({
      title: session.title,
      price: session.price || 0,
      description: session.description,
      difficulty_level: session.difficulty_level,
      session_date: sessionDateStr,
      session_time: sessionTimeStr
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
              
              // Keep date as string (YYYY-MM-DD) to avoid timezone conversion
              const sessionDateStr = typeof session.session_date === 'string'
                ? session.session_date.split('T')[0] // Extract date part if datetime
                : new Date(session.session_date).toISOString().split('T')[0]
              
              // Format date for display (DD/MM/YYYY or MM/DD/YYYY based on locale)
              const [year, month, day] = sessionDateStr.split('-')
              const formattedDate = `${day}/${month}/${year}`
              
              // Keep time as string (HH:MM) to avoid timezone conversion
              let sessionTimeStr = '00:00'
              if (typeof session.session_time === 'string') {
                // If it's already a string, just extract HH:MM
                sessionTimeStr = session.session_time.substring(0, 5)
              } else if (session.session_time) {
                // If it's a Date/timestamp, try to extract time
                try {
                  const timeDate = new Date(session.session_time)
                  // Check if it's a valid date
                  if (!isNaN(timeDate.getTime())) {
                    const hours = timeDate.getUTCHours().toString().padStart(2, '0')
                    const minutes = timeDate.getUTCMinutes().toString().padStart(2, '0')
                    sessionTimeStr = `${hours}:${minutes}`
                  }
                } catch (e) {
                  console.error('Error parsing time:', e)
                }
              }
              
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
                  <p><span className="icon">📅</span> {formattedDate}</p>
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
               
                
                <div className="session-actions">
                  <Button onClick={() => handleStartSession(session)} variant="primary">Start Session</Button>
                  <Button onClick={() => handleEditSession(session)}>Edit Session</Button>
                  <Button onClick={() => handleViewAnalytics(session)}>Analytics</Button>
                  <Button onClick={() => handleDeleteSession(session.id)} variant="secondary">Delete</Button>
                </div>
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
                  <Button onClick={() => handleViewAnalytics(session)}>Analytics</Button>
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

  // Poll Functions
  const loadPolls = async () => {
    setPollsLoading(true)
    setPollsError(null)
    try {
      const response = await pollService.getPolls()
      setPolls(response.data || [])
      console.log('Loaded', response.data?.length || 0, 'polls')
    } catch (err) {
      console.error('Error loading polls:', err)
      setPollsError(err instanceof Error ? err.message : 'Failed to load polls')
    } finally {
      setPollsLoading(false)
    }
  }

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPoll.title.trim()) {
      showNotification('error', 'Please enter a poll title')
      return
    }

    // Validate custom options if enabled
    if (newPoll.useCustomOptions) {
      const validOptions = newPoll.customOptions
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0);
      
      if (validOptions.length < 2) {
        showNotification('error', 'Please provide at least 2 valid options')
        return
      }
      
      // Check for duplicates
      const uniqueOptions = [...new Set(validOptions)];
      if (uniqueOptions.length !== validOptions.length) {
        showNotification('error', 'Duplicate options are not allowed')
        return
      }
    }

    setPollsLoading(true)
    try {
      const pollData: any = {
        title: newPoll.title,
        description: newPoll.description || undefined
      };
      
      // Add custom options if enabled
      if (newPoll.useCustomOptions) {
        const validOptions = newPoll.customOptions
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
        pollData.options = validOptions;
      }
      
      await pollService.createPoll(pollData)
      
      showNotification('success', '✅ Poll created successfully!')
      setNewPoll({ 
        title: '', 
        description: '',
        useCustomOptions: false,
        customOptions: ['', '']
      })
      loadPolls() // Reload polls
    } catch (err) {
      console.error('❌ Error creating poll:', err)
      showNotification('error', 'Failed to create poll: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setPollsLoading(false)
    }
  }

  const handleViewPollDetails = async (poll: Poll) => {
    setSelectedPoll(poll)
    try {
      const stats = await pollService.getPollStats(poll.id)
      setPollStats(stats)
      // Fetch comments when viewing poll details
      fetchPollComments(poll.id)
    } catch (err) {
      console.error('Error loading poll stats:', err)
      showNotification('error', 'Failed to load poll statistics')
    }
  }

  const fetchPollComments = async (pollId: number) => {
    try {
      setLoadingComments(true)
      const response = await pollService.getPollComments(pollId, {
        page: 1,
        limit: 50,
        sort_order: 'desc'
      })
      setPollComments(response.data)
    } catch (err) {
      console.error('Error loading comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPoll || !newComment.trim()) {
      return
    }

    try {
      setPostingComment(true)
      await pollService.addComment(selectedPoll.id, newComment.trim())
      setNewComment('')
      showNotification('success', ' Comment posted successfully!')
      
      // Refresh comments
      fetchPollComments(selectedPoll.id)
    } catch (err: any) {
      console.error('Error posting comment:', err)
      showNotification('error', err.message || 'Failed to post comment')
    } finally {
      setPostingComment(false)
    }
  }

  const handleClosePoll = async (pollId: number) => {
    try {
      await pollService.closePoll(pollId)
      showNotification('success', ' Poll closed successfully!')
      loadPolls()
      if (selectedPoll?.id === pollId) {
        setSelectedPoll(prev => prev ? { ...prev, is_active: false } : null)
      }
    } catch (err) {
      console.error('Error closing poll:', err)
      showNotification('error', 'Failed to close poll')
    }
  }

  const handleReopenPoll = async (pollId: number) => {
    try {
      await pollService.reopenPoll(pollId)
      showNotification('success', ' Poll reopened successfully!')
      loadPolls()
      if (selectedPoll?.id === pollId) {
        setSelectedPoll(prev => prev ? { ...prev, is_active: true } : null)
      }
    } catch (err) {
      console.error('Error reopening poll:', err)
      showNotification('error', 'Failed to reopen poll')
    }
  }

  const handleDeletePoll = async (pollId: number) => {
    setConfirmDelete({ show: true, pollId })
  }

  const confirmDeletePoll = async () => {
    if (!confirmDelete.pollId) return
    
    try {
      await pollService.deletePoll(confirmDelete.pollId)
      showNotification('success', '🗑️ Poll deleted successfully!')
      loadPolls()
      if (selectedPoll?.id === confirmDelete.pollId) {
        setSelectedPoll(null)
        setPollStats(null)
      }
      setConfirmDelete({ show: false, pollId: null })
    } catch (err) {
      console.error('Error deleting poll:', err)
      showNotification('error', 'Failed to delete poll')
      setConfirmDelete({ show: false, pollId: null })
    }
  }

  // Helper functions for custom poll options
  const addPollOption = () => {
    if (newPoll.customOptions.length < 10) {
      setNewPoll({
        ...newPoll,
        customOptions: [...newPoll.customOptions, '']
      })
    } else {
      showNotification('error', 'Maximum 10 options allowed')
    }
  }

  const removePollOption = (index: number) => {
    if (newPoll.customOptions.length > 2) {
      const updatedOptions = newPoll.customOptions.filter((_, i) => i !== index)
      setNewPoll({
        ...newPoll,
        customOptions: updatedOptions
      })
    } else {
      showNotification('error', 'At least 2 options are required')
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.customOptions]
    updatedOptions[index] = value
    setNewPoll({
      ...newPoll,
      customOptions: updatedOptions
    })
  }

  const renderAnalytics = () => {
    // Show loading state
    if (loading && !analyticsData) {
      return (
        <div className="analytics-dashboard">
          <div className="loading-state">Loading analytics...</div>
        </div>
      );
    }

    // Show error state
    if (error && !analyticsData) {
      return (
        <div className="analytics-dashboard">
          <div className="error-state">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <Button onClick={() => loadAnalytics()}>Retry</Button>
          </div>
        </div>
      );
    }

    // Show empty state
    if (!analyticsData) {
      return (
        <div className="analytics-dashboard">
          <div className="empty-state">
            <h3>No analytics data available</h3>
            <p>Create some sessions to see analytics</p>
          </div>
        </div>
      );
    }

    const { overview, liveSessionsAnalytics, recordedSessionsAnalytics, sessions } = analyticsData;
    
    // Export function
    const handleExportReport = (type: 'all' | 'live' | 'recorded') => {
      let dataToExport: any[] = [];
      let filename = '';
      
      switch(type) {
        case 'live':
          dataToExport = sessions.filter(s => s.session_type === 'live');
          filename = 'live-sessions-report.csv';
          break;
        case 'recorded':
          dataToExport = sessions.filter(s => s.session_type === 'recorded');
          filename = 'recorded-sessions-report.csv';
          break;
        default:
          dataToExport = sessions;
          filename = 'all-sessions-report.csv';
      }
      
      // Create CSV content
      const headers = ['ID', 'Title', 'Type', 'Payment Type', 'Price (LKR)', 'Duration (mins)', 'Difficulty', 'Students Enrolled', 'Status'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(session => [
          session.id,
          `"${session.title.replace(/"/g, '""')}"`,
          session.session_type,
          session.payment_type,
          session.price || 0,
          session.duration,
          session.difficulty_level,
          session.studentCount || 0,
          session.is_enabled ? 'Enabled' : 'Disabled'
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', ` ${type.charAt(0).toUpperCase() + type.slice(1)} sessions report exported successfully!`);
    };
    
    return (
      <div className="analytics-dashboard">
        <div className="analytics-header">
          <h2>My Sessions Analytics</h2>
          <div className="analytics-actions">
            <Button onClick={() => handleExportReport('all')} variant="secondary">
              Export All Reports
            </Button>
          </div>
        </div>

        <div className="analytics-summary">
          <div className="summary-card total-revenue">
            <div className="card-icon">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="card-content">
              <h4>Total Revenue</h4>
              <p className="amount">LKR {overview.totalRevenue.toLocaleString()}</p>
              <span className="trend">From enrolled students</span>
            </div>
          </div>
          <div className="summary-card total-sessions">
            <div className="card-icon">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="card-content">
              <h4>Total Sessions</h4>
              <p className="amount">{overview.totalSessions}</p>
              <span className="trend">Live: {overview.liveSessions} | Recorded: {overview.recordedSessions}</span>
            </div>
          </div>
          <div className="summary-card total-students">
            <div className="card-icon">
              <ParticipantsIcon size={32} />
            </div>
            <div className="card-content">
              <h4>Total Students</h4>
              <p className="amount">{overview.totalStudents}</p>
              <span className="trend">Enrolled & paid students</span>
            </div>
          </div>
          <div className="summary-card completion-rate">
            <div className="card-icon">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="card-content">
              <h4>Completion Rate</h4>
              <p className="amount">{overview.completionRate}%</p>
              <span className="trend">Of enrolled students</span>
            </div>
          </div>
        </div>

        <div className="analytics-sections">
          <div className="live-sessions-analytics">
            <div className="section-header">
              <h3>Live Sessions Performance ({liveSessionsAnalytics.count})</h3>
              <div className="section-actions">
                <button className="action-btn" onClick={() => handleExportReport('live')}>
                  Export Live Sessions Report
                </button>
              </div>
            </div>
            
            {liveSessionsAnalytics.count > 0 ? (
              <div className="analytics-grid">
                <div className="chart-container">
                  <h4>Top Live Sessions by Student Engagement</h4>
                  <div className="pie-chart-container">
                    <svg viewBox="0 0 200 200" className="pie-chart">
                      {(() => {
                        const topSessions = sessions
                          .filter(s => s.session_type === 'live')
                          .sort((a, b) => b.studentCount - a.studentCount)
                          .slice(0, 5);
                        
                        const total = topSessions.reduce((sum, s) => sum + s.studentCount, 0);
                        let currentAngle = 0;
                        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                        
                        return topSessions.map((session, index) => {
                          const percentage = (session.studentCount / total) * 100;
                          const angle = (percentage / 100) * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          // Calculate path for pie slice
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          currentAngle = endAngle;
                          
                          return (
                            <g key={session.id}>
                              <path
                                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                fill={colors[index % colors.length]}
                                stroke="rgba(0,0,0,0.1)"
                                strokeWidth="1"
                                className="pie-slice"
                              >
                                <title>{session.title}: {session.studentCount} students ({percentage.toFixed(1)}%)</title>
                              </path>
                            </g>
                          );
                        });
                      })()}
                    </svg>
                    <div className="pie-chart-legend">
                      {sessions
                        .filter(s => s.session_type === 'live')
                        .sort((a, b) => b.studentCount - a.studentCount)
                        .slice(0, 5)
                        .map((session, index) => {
                          const topSessions = sessions
                            .filter(s => s.session_type === 'live')
                            .sort((a, b) => b.studentCount - a.studentCount)
                            .slice(0, 5);
                          const total = topSessions.reduce((sum, s) => sum + s.studentCount, 0);
                          const percentage = ((session.studentCount / total) * 100).toFixed(1);
                          const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                          
                          return (
                            <div key={session.id} className="legend-item">
                              <span 
                                className="legend-color" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                              ></span>
                              <span className="legend-text" title={session.title}>
                                {session.title.length > 25 
                                  ? session.title.substring(0, 22) + '...' 
                                  : session.title}
                              </span>
                              <span className="legend-value">
                                {session.studentCount} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="metrics-container">
                  <div className="metric-card">
                    <h5>Total Students</h5>
                    <p className="metric-value">{liveSessionsAnalytics.totalStudents}</p>
                    <span className="metric-label">enrolled students</span>
                  </div>
                  <div className="metric-card">
                    <h5>Average Duration</h5>
                    <p className="metric-value">{liveSessionsAnalytics.averageDuration} mins</p>
                    <span className="metric-label">per session</span>
                  </div>
                  <div className="metric-card">
                    <h5>Total Revenue</h5>
                    <p className="metric-value">
                      LKR {liveSessionsAnalytics.totalRevenue.toLocaleString()}
                    </p>
                    <span className="metric-label">from live sessions</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No live sessions created yet</p>
              </div>
            )}
          </div>

          <div className="recorded-sessions-analytics">
            <div className="section-header">
              <h3>Recorded Sessions Performance ({recordedSessionsAnalytics.count})</h3>
              <div className="section-actions">
                <button className="action-btn" onClick={() => handleExportReport('recorded')}>
                  📥 Export Recorded Sessions Report
                </button>
              </div>
            </div>
            
            {recordedSessionsAnalytics.count > 0 ? (
              <div className="analytics-grid">
                <div className="chart-container">
                  <h4>Top Recorded Sessions by Student Engagement</h4>
                  <div className="pie-chart-container">
                    <svg viewBox="0 0 200 200" className="pie-chart">
                      {(() => {
                        const topSessions = sessions
                          .filter(s => s.session_type === 'recorded')
                          .sort((a, b) => b.studentCount - a.studentCount)
                          .slice(0, 5);
                        
                        const total = topSessions.reduce((sum, s) => sum + s.studentCount, 0);
                        let currentAngle = 0;
                        const colors = ['#ec4899', '#f97316', '#eab308', '#84cc16', '#14b8a6'];
                        
                        return topSessions.map((session, index) => {
                          const percentage = (session.studentCount / total) * 100;
                          const angle = (percentage / 100) * 360;
                          const startAngle = currentAngle;
                          const endAngle = currentAngle + angle;
                          
                          // Calculate path for pie slice
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);
                          const x1 = 100 + 80 * Math.cos(startRad);
                          const y1 = 100 + 80 * Math.sin(startRad);
                          const x2 = 100 + 80 * Math.cos(endRad);
                          const y2 = 100 + 80 * Math.sin(endRad);
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          currentAngle = endAngle;
                          
                          return (
                            <g key={session.id}>
                              <path
                                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                fill={colors[index % colors.length]}
                                stroke="rgba(0,0,0,0.1)"
                                strokeWidth="1"
                                className="pie-slice"
                              >
                                <title>{session.title}: {session.studentCount} students ({percentage.toFixed(1)}%)</title>
                              </path>
                            </g>
                          );
                        });
                      })()}
                    </svg>
                    <div className="pie-chart-legend">
                      {sessions
                        .filter(s => s.session_type === 'recorded')
                        .sort((a, b) => b.studentCount - a.studentCount)
                        .slice(0, 5)
                        .map((session, index) => {
                          const topSessions = sessions
                            .filter(s => s.session_type === 'recorded')
                            .sort((a, b) => b.studentCount - a.studentCount)
                            .slice(0, 5);
                          const total = topSessions.reduce((sum, s) => sum + s.studentCount, 0);
                          const percentage = ((session.studentCount / total) * 100).toFixed(1);
                          const colors = ['#ec4899', '#f97316', '#eab308', '#84cc16', '#14b8a6'];
                          
                          return (
                            <div key={session.id} className="legend-item">
                              <span 
                                className="legend-color" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                              ></span>
                              <span className="legend-text" title={session.title}>
                                {session.title.length > 25 
                                  ? session.title.substring(0, 22) + '...' 
                                  : session.title}
                              </span>
                              <span className="legend-value">
                                {session.studentCount} ({percentage}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="metrics-container">
                  <div className="metric-card">
                    <h5>Total Students</h5>
                    <p className="metric-value">{recordedSessionsAnalytics.totalStudents}</p>
                    <span className="metric-label">enrolled students</span>
                  </div>
                  <div className="metric-card">
                    <h5>Average Duration</h5>
                    <p className="metric-value">{recordedSessionsAnalytics.averageDuration} mins</p>
                    <span className="metric-label">per session</span>
                  </div>
                  <div className="metric-card">
                    <h5>Total Revenue</h5>
                    <p className="metric-value">
                      LKR {recordedSessionsAnalytics.totalRevenue.toLocaleString()}
                    </p>
                    <span className="metric-label">from recorded sessions</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>No recorded sessions created yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPolls = () => {
    console.log('📊 Rendering polls tab, polls count:', polls.length, 'loading:', pollsLoading, 'error:', pollsError)
    
    return (
      <div className="polls-section">
        {/* Create Poll Form */}
        <div className="create-poll-card">
          <h3>Create New Poll</h3>
          <p className="section-description">Create a poll to gather feedback from your audience about session ideas</p>
          
          <form onSubmit={handleCreatePoll}>
            <div className="form-group">
              <label htmlFor="poll-title">
                Poll Question <span className="required">*</span>
              </label>
              <input
                type="text"
                id="poll-title"
                placeholder="e.g., What session topic would you like next?"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="poll-description">
                Additional Details (Optional)
              </label>
              <textarea
                id="poll-description"
                placeholder="Add more context or details about this poll..."
                value={newPoll.description}
                onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Poll Options Type Selector */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newPoll.useCustomOptions}
                  onChange={(e) => setNewPoll({ 
                    ...newPoll, 
                    useCustomOptions: e.target.checked,
                    customOptions: e.target.checked ? ['', ''] : newPoll.customOptions
                  })}
                />
                <span>Use custom poll options (default: Yes/Maybe/No)</span>
              </label>
            </div>

            {/* Custom Options Input */}
            {newPoll.useCustomOptions && (
              <div className="form-group custom-options-group">
                <label>
                  Poll Options <span className="required">*</span>
                  <small> (Minimum 2, Maximum 10)</small>
                </label>
                
                <div className="options-list">
                  {newPoll.customOptions.map((option, index) => (
                    <div key={index} className="option-input-row">
                      
                      <input
                        type="text"
                        placeholder={`Enter option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        className="option-input"
                      />
                      {newPoll.customOptions.length > 2 && (
                        <button
                          type="button"
                          className="remove-option-btn"
                          onClick={() => removePollOption(index)}
                          title="Remove this option"
                        >
                          <span>🗑️</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {newPoll.customOptions.length < 10 && (
                  <button
                    type="button"
                    className="add-option-btn"
                    onClick={addPollOption}
                  >
                    <span>➕</span> Add Another Option
                  </button>
                )}
              </div>
            )}

            <div className="form-actions">
              <Button type="submit" disabled={pollsLoading}>
                {pollsLoading ? 'Creating...' : ' Create Poll'}
              </Button>
            </div>
          </form>
        </div>

        {/* Polls List */}
        <div className="polls-list-section">
          <h3>Your Polls ({polls.length})</h3>
          
          {pollsLoading && !polls.length && (
            <div className="loading-state">Loading polls...</div>
          )}

          {pollsError && (
            <div className="error-state">
              <p>⚠️ {pollsError}</p>
              <Button onClick={loadPolls}>Retry</Button>
            </div>
          )}

          {!pollsLoading && !pollsError && polls.length === 0 && (
            <div className="empty-state">
              <p>No polls created yet. Create your first poll above!</p>
            </div>
          )}

          {polls.length > 0 && (
            <div className="polls-grid">
              {polls.map((poll) => (
                <div key={poll.id} className={`poll-card ${!poll.is_active ? 'closed' : ''}`}>
                  <div className="poll-header">
                    <h4>{poll.title}</h4>
                    <span className={`poll-status ${poll.is_active ? 'active' : 'closed'}`}>
                      {poll.is_active ? '🟢 Active' : '🔴 Closed'}
                    </span>
                  </div>

                  {poll.description && (
                    <p className="poll-description">{poll.description}</p>
                  )}

                  <div className="poll-meta">
                    <span>📅 {new Date(poll.created_at).toLocaleDateString()}</span>
                    <span>💬 {poll.comment_count || 0} comments</span>
                  </div>

                  <div className="poll-actions">
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleViewPollDetails(poll)}
                    >
                      View Results
                    </Button>
                    
                    {poll.is_active ? (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleClosePoll(poll.id)}
                      >
                         Close Poll
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleReopenPoll(poll.id)}
                      >
                         Reopen
                      </Button>
                    )}
                    
                    <Button 
                      variant="danger" 
                      size="small"
                      onClick={() => handleDeletePoll(poll.id)}
                    >
                       Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Poll Details Modal */}
        {selectedPoll && (
          <div className="modal-overlay" onClick={() => setSelectedPoll(null)}>
            <div className="modal-content poll-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Poll Results</h3>
                <button className="close-btn" onClick={() => setSelectedPoll(null)}>×</button>
              </div>

              <div className="modal-body">
                <h4>{selectedPoll.title}</h4>
                {selectedPoll.description && (
                  <p className="poll-description">{selectedPoll.description}</p>
                )}

                {selectedPoll.choices && selectedPoll.choices.length > 0 && (
                  <div className="poll-results">
                    <div className="total-votes">
                      <strong>Total Votes: {selectedPoll.total_votes || 0}</strong>
                    </div>

                    <div className="vote-breakdown">
                      {selectedPoll.choices.map((choice, index) => {
                        const percentage = selectedPoll.total_votes > 0 
                          ? (choice.vote_count / selectedPoll.total_votes * 100) 
                          : 0;
                        
                        // Assign different colors for each option
                        const colorClass = [
                          'yes-fill',
                          'maybe-fill',
                          'no-fill',
                          'custom-fill-1',
                          'custom-fill-2',
                          'custom-fill-3',
                          'custom-fill-4',
                          'custom-fill-5',
                          'custom-fill-6',
                          'custom-fill-7'
                        ][index] || 'custom-fill-default';
                        
                        return (
                          <div key={choice.choice} className={`vote-option option-${index}`}>
                            <div className="vote-label">
                              <span className="option-text">{choice.choice}</span>
                              <span className="vote-count">
                                {choice.vote_count} {choice.vote_count === 1 ? 'vote' : 'votes'}
                              </span>
                            </div>
                            <div className="vote-bar">
                              <div 
                                className={`vote-fill ${colorClass}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="vote-percentage">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="poll-info">
                      <p>💬 {selectedPoll.comment_count || 0} comments</p>
                      <p>📅 Created: {new Date(selectedPoll.created_at).toLocaleString()}</p>
                    </div>

                    {/* Comments Section */}
                    <div className="poll-comments-section">
                      <h4>💬 Comments</h4>
                      
                      {loadingComments ? (
                        <div className="loading-comments">Loading comments...</div>
                      ) : pollComments.length > 0 ? (
                        <div className="comments-list">
                          {pollComments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-header">
                                <span className="commenter-name">
                                  {comment.commenter?.display_name || comment.commenter?.full_name || 'Anonymous'}
                                </span>
                                <span className="comment-date">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="comment-text">{comment.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-comments">No comments yet. Be the first to comment!</p>
                      )}

                      {/* Add Comment Form */}
                      <form onSubmit={handlePostComment} className="add-comment-form">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          rows={3}
                          disabled={postingComment}
                        />
                        <Button
                          type="submit"
                          disabled={!newComment.trim() || postingComment}
                          variant="primary"
                        >
                          {postingComment ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}

                {!selectedPoll.choices && pollsLoading && (
                  <div className="loading-state">Loading statistics...</div>
                )}
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setSelectedPoll(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete.show && (
          <div className="modal-overlay" onClick={() => setConfirmDelete({ show: false, pollId: null })}>
            <div className="modal-content confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>⚠️ Confirm Delete</h3>
                <button className="close-btn" onClick={() => setConfirmDelete({ show: false, pollId: null })}>×</button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete this poll?</p>
                <p className="warning-text">This action cannot be undone. All votes and comments will be permanently lost.</p>
              </div>

              <div className="modal-footer">
                <Button 
                  variant="secondary" 
                  onClick={() => setConfirmDelete({ show: false, pollId: null })}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={confirmDeletePoll}
                >
                  🗑️ Delete Poll
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

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
      difficulty_level: editForm.difficulty_level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
      session_date: editForm.session_date,
      session_time: editForm.session_time
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
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={editForm.session_date}
                    onChange={(e) => setEditForm({...editForm, session_date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    value={editForm.session_time}
                    onChange={(e) => setEditForm({...editForm, session_time: e.target.value})}
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
    const sessionDate = new Date(selectedSession.session_date)
    const daysUntilSession = Math.ceil((sessionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    return (
      <div className="modal-overlay" onClick={() => setShowAnalyticsModal(false)}>
        <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <StarIcon size={24} />
              <span style={{ marginLeft: '8px' }}>Session Info: {selectedSession.title}</span>
            </h3>
            <button className="close-btn" onClick={() => setShowAnalyticsModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            {/* Basic Session Details */}
            <div className="analytics-overview">
              <h4>Session Details</h4>
              <div className="session-details-grid">
                <div className="detail-item">
                  <span className="detail-icon">
                    {isLiveSession ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="8" fill="#ef4444"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                        <line x1="7" y1="2" x2="7" y2="22"/>
                        <line x1="17" y1="2" x2="17" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                      </svg>
                    )}
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Session Type</span>
                    <span className="detail-value">{isLiveSession ? 'Live Session' : 'Recorded Session'}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">
                    <PriceIcon size={20} />
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Payment Type</span>
                    <span className="detail-value">
                      {selectedSession.payment_type === 'paid' ? `Paid - LKR ${sessionPrice}` : 'Free'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">
                    <DurationIcon size={20} />
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{selectedSession.duration} minutes</span>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">
                    <DifficultyIcon size={20} />
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Difficulty Level</span>
                    <span className="detail-value">
                      {selectedSession.difficulty_level.charAt(0).toUpperCase() + selectedSession.difficulty_level.slice(1)}
                    </span>
                  </div>
                </div>

                {isLiveSession && (
                  <div className="detail-item">
                    <span className="detail-icon">
                      <ParticipantsIcon size={20} />
                    </span>
                    <div className="detail-content">
                      <span className="detail-label">Max Participants</span>
                      <span className="detail-value">{selectedSession.max_participants || 'Unlimited'}</span>
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-icon">
                    <DateIcon size={20} />
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Session Date</span>
                    <span className="detail-value">
                      {sessionDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {isLiveSession && daysUntilSession >= 0 && (
                  <div className="detail-item">
                    <span className="detail-icon">
                      <TimeIcon size={20} />
                    </span>
                    <div className="detail-content">
                      <span className="detail-label">Days Until Session</span>
                      <span className="detail-value">{daysUntilSession} days</span>
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-icon">
                    {selectedSession.is_enabled ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    )}
                  </span>
                  <div className="detail-content">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{selectedSession.is_enabled ? 'Active' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Link */}
            {selectedSession.session_link && (
              <div className="session-link-section">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Session Link
                </h4>
                <div className="link-container">
                  <a 
                    href={selectedSession.session_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="session-link-button"
                  >
                    Open Session Link
                  </a>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="session-description-section">
              <h4>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Description
              </h4>
              <p className="description-text">{selectedSession.description}</p>
            </div>

            {/* Materials */}
            {selectedSession.materials && selectedSession.materials.length > 0 && (
              <div className="session-materials-section">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  Materials
                </h4>
                <ul className="materials-list">
                  {selectedSession.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Session Notes */}
            {selectedSession.session_notes && (
              <div className="session-notes-section">
                <h4>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Additional Notes
                </h4>
                <p className="notes-text">{selectedSession.session_notes}</p>
              </div>
            )}

            {/* Revenue Information */}
            {selectedSession.payment_type === 'paid' && (
              <div className="revenue-info-section">
                <h4>
                  <span style={{ verticalAlign: 'middle', marginRight: '8px', display: 'inline-block' }}>
                    <PriceIcon size={18} />
                  </span>
                  Revenue Information
                </h4>
                <div className="revenue-info-grid">
                  <div className="revenue-info-item">
                    <span className="revenue-label">Price per Enrollment</span>
                    <span className="revenue-value">LKR {sessionPrice.toLocaleString()}</span>
                  </div>
                  <div className="revenue-info-item">
                    <span className="revenue-label">Platform Fee (10%)</span>
                    <span className="revenue-value">- LKR {Math.round(sessionPrice * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="revenue-info-item highlight">
                    <span className="revenue-label">Your Earnings per Sale</span>
                    <span className="revenue-value">LKR {Math.round(sessionPrice * 0.9).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShowAnalyticsModal(false)}>
              Close
            </Button>
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
          variant={activeTab === 'polls' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('polls')}
        >
          Polls
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
        {activeTab === 'polls' && renderPolls()}
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

