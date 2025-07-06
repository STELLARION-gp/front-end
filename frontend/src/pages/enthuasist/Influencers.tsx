import React, { useState } from 'react'
import '../../styles/pages/enthusiast/Influencers.scss'
import Button from '../../components//Button'

interface Influencer {
  id: number
  name: string
  profilePicture: string
  description: string
  specializations: string[]
  followersCount: number
  sessionsCount: number
  isFollowing: boolean
  // Extended profile data
  bio?: string
  location?: string
  website?: string
  joinedDate?: string
  totalViews?: number
  rating?: number
  recentSessions?: {
    id: number
    title: string
    date: string
    duration: string
    attendees: number
  }[]
  achievements?: string[]
}

const Influencers = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'followings' | 'events'>('discover')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      profilePicture: "",
      description: "Astrophysicist specializing in exoplanet research with 15+ years of experience in space exploration.",
      specializations: ["Exoplanets", "Space Exploration", "Astrophysics"],
      followersCount: 12500,
      sessionsCount: 45,
      isFollowing: false,
      bio: "Dr. Sarah Chen is a renowned astrophysicist with over 15 years of experience in exoplanet research. She has contributed to major discoveries in the field and is passionate about making space science accessible to everyone.",
      location: "California, USA",
      website: "www.sarahchen-astro.com",
      joinedDate: "January 2020",
      totalViews: 250000,
      rating: 4.9,
      recentSessions: [
        { id: 1, title: "Discovering New Worlds: Latest Exoplanet Findings", date: "June 28, 2025", duration: "1h 30m", attendees: 342 },
        { id: 2, title: "The James Webb Telescope Revolution", date: "June 15, 2025", duration: "2h", attendees: 567 },
        { id: 3, title: "Life Beyond Earth: What We Know So Far", date: "May 30, 2025", duration: "1h 45m", attendees: 489 }
      ],
      achievements: ["NASA Research Award 2023", "Best Science Communicator 2022", "Top Astronomy Educator 2021"]
    },
    {
      id: 2,
      name: "Mark Johnson",
      profilePicture: "",
      description: "Professional astronomer and educator passionate about making astronomy accessible to everyone.",
      specializations: ["Deep Sky Objects", "Telescope Reviews", "Beginner Astronomy"],
      followersCount: 8900,
      sessionsCount: 32,
      isFollowing: true,
      bio: "Mark Johnson is a professional astronomer and educator who has dedicated his career to making astronomy accessible to beginners. He specializes in deep sky observations and telescope guidance.",
      location: "Colorado, USA",
      website: "www.stargazerwithmark.com",
      joinedDate: "March 2020",
      totalViews: 180000,
      rating: 4.7,
      recentSessions: [
        { id: 1, title: "Choosing Your First Telescope", date: "June 25, 2025", duration: "1h 15m", attendees: 234 },
        { id: 2, title: "Deep Sky Photography for Beginners", date: "June 10, 2025", duration: "2h 30m", attendees: 189 },
      ],
      achievements: ["Astronomy Educator of the Year 2023", "Community Choice Award 2022"]
    },
    {
      id: 3,
      name: "Luna Rodriguez",
      profilePicture: "",
      description: "Planetary scientist and science communicator focusing on Mars exploration and planetary geology.",
      specializations: ["Mars Research", "Planetary Geology", "Space Missions"],
      followersCount: 15200,
      sessionsCount: 38,
      isFollowing: false,
      bio: "Luna Rodriguez is a planetary scientist specializing in Mars exploration and planetary geology. She works closely with NASA mission teams and brings the latest Mars discoveries to the public.",
      location: "Texas, USA",
      website: "www.marswithluna.org",
      joinedDate: "August 2019",
      totalViews: 320000,
      rating: 4.8,
      recentSessions: [
        { id: 1, title: "Latest Mars Rover Discoveries", date: "June 30, 2025", duration: "1h 45m", attendees: 445 },
        { id: 2, title: "Geological Wonders of Mars", date: "June 18, 2025", duration: "2h", attendees: 367 },
        { id: 3, title: "Future Mars Missions: What's Coming Next", date: "June 5, 2025", duration: "1h 30m", attendees: 512 }
      ],
      achievements: ["Mars Research Excellence Award 2024", "Science Communication Champion 2023"]
    },
    {
      id: 4,
      name: "Prof. James Wright",
      profilePicture: "",
      description: "Cosmologist researching dark matter and the early universe with groundbreaking discoveries.",
      specializations: ["Cosmology", "Dark Matter", "Big Bang Theory"],
      followersCount: 22100,
      sessionsCount: 67,
      isFollowing: true,
      bio: "Professor James Wright is a leading cosmologist whose research focuses on dark matter and the early universe. His groundbreaking work has contributed to our understanding of cosmic evolution.",
      location: "Massachusetts, USA",
      website: "www.cosmicjameswright.edu",
      joinedDate: "November 2018",
      totalViews: 450000,
      rating: 4.9,
      recentSessions: [
        { id: 1, title: "The Mystery of Dark Matter", date: "July 2, 2025", duration: "2h 15m", attendees: 678 },
        { id: 2, title: "Understanding the Big Bang", date: "June 20, 2025", duration: "2h", attendees: 734 },
        { id: 3, title: "Cosmic Microwave Background Explained", date: "June 8, 2025", duration: "1h 50m", attendees: 598 }
      ],
      achievements: ["Breakthrough Physics Prize 2024", "Distinguished Professor Award 2023", "Cosmology Research Medal 2022"]
    }
  ])

  const handleFollowToggle = (id: number) => {
    setInfluencers(prev => 
      prev.map(influencer => 
        influencer.id === id 
          ? { ...influencer, isFollowing: !influencer.isFollowing }
          : influencer
      )
    )
  }

  const handleViewProfile = (influencer: Influencer) => {
    setSelectedInfluencer(influencer)
    setShowProfileModal(true)
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
    setSelectedInfluencer(null)
  }

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const filterInfluencersBySearch = (influencers: Influencer[]) => {
    if (!searchQuery.trim()) return influencers

    const query = searchQuery.toLowerCase()
    return influencers.filter(influencer => 
      influencer.name.toLowerCase().includes(query) ||
      influencer.description.toLowerCase().includes(query) ||
      influencer.specializations.some(spec => spec.toLowerCase().includes(query))
    )
  }

  const getFilteredInfluencers = () => {
    let filtered: Influencer[]
    
    switch (activeTab) {
      case 'followings':
        filtered = influencers.filter(influencer => influencer.isFollowing)
        break
      case 'discover':
      default:
        filtered = influencers
        break
    }
    
    return filterInfluencersBySearch(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const renderInfluencerCards = () => {
    const filteredInfluencers = getFilteredInfluencers()
    
    if (filteredInfluencers.length === 0 && searchQuery.trim()) {
      return (
        <div className="no-results">
          <h3>No influencers found</h3>
          <p>Try adjusting your search terms or browse all influencers.</p>
          <Button 
            variant="secondary"
            size="medium"
            onClick={clearSearch}
            className="clear-search-btn"
          >
            Clear Search
          </Button>
        </div>
      )
    }

    return (
      <div className="influencers-grid">
        {filteredInfluencers.map(influencer => (
          <div key={influencer.id} className="influencer-card">
            <div className="card-header">
              <div className="profile-picture-placeholder">
                {getInitials(influencer.name)}
              </div>
              <div className="influencer-info">
                <h3 className="influencer-name">{influencer.name}</h3>
                <div className="stats">
                  <span className="stat">
                    <strong>{formatCount(influencer.followersCount)}</strong> followers
                  </span>
                  <span className="stat">
                    <strong>{influencer.sessionsCount}</strong> sessions
                  </span>
                </div>
              </div>
            </div>
            
            <p className="description">{influencer.description}</p>
            
            <div className="specializations">
              {influencer.specializations.map((spec, index) => (
                <span key={index} className="specialization-tag">
                  {spec}
                </span>
              ))}
            </div>
            
            <div className="card-actions">
              <Button 
                variant={influencer.isFollowing ? "secondary" : "primary"}
                size="small"
                onClick={() => handleFollowToggle(influencer.id)}
                className="follow-btn"
              >
                {influencer.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button 
                variant="secondary"
                size="small"
                onClick={() => handleViewProfile(influencer)}
                className="view-profile-btn"
              >
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderEventsContent = () => (
    <div className="events-content">
      <div className="events-placeholder">
        <h3>Upcoming Events</h3>
        <p>Live sessions and events from your favorite astronomy influencers will appear here.</p>
        <div className="event-card">
          <h4>Mars Exploration Deep Dive</h4>
          <p>Join Dr. Sarah Chen for an exclusive session on the latest Mars discoveries</p>
          <div className="event-details">
            <span>📅 July 15, 2025</span>
            <span>🕒 7:00 PM EST</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileModal = () => {
    if (!selectedInfluencer) return null

    return (
      <div className="profile-modal-backdrop" onClick={closeProfileModal}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
          <div className="profile-modal__header">
            <h2>Influencer Profile</h2>
            <button 
              className="profile-modal__close"
              onClick={closeProfileModal}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="profile-modal__content">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(selectedInfluencer.name)}
              </div>
              <div className="profile-info">
                <h3>{selectedInfluencer.name}</h3>
                <p className="profile-location">📍 {selectedInfluencer.location}</p>
                <p className="profile-joined">Joined {selectedInfluencer.joinedDate}</p>
                <div className="profile-rating">
                  <span className="rating-stars">⭐ {selectedInfluencer.rating}</span>
                  <span className="rating-text">({selectedInfluencer.followersCount} reviews)</span>
                </div>
              </div>
              <div className="profile-actions">
                <Button 
                  variant={selectedInfluencer.isFollowing ? "secondary" : "primary"}
                  size="medium"
                  onClick={() => handleFollowToggle(selectedInfluencer.id)}
                >
                  {selectedInfluencer.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{formatCount(selectedInfluencer.followersCount)}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{selectedInfluencer.sessionsCount}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{formatCount(selectedInfluencer.totalViews || 0)}</span>
                <span className="stat-label">Total Views</span>
              </div>
            </div>

            <div className="profile-section">
              <h4>About</h4>
              <p>{selectedInfluencer.bio}</p>
            </div>

            <div className="profile-section">
              <h4>Specializations</h4>
              <div className="specializations">
                {selectedInfluencer.specializations.map((spec, index) => (
                  <span key={index} className="specialization-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {selectedInfluencer.achievements && selectedInfluencer.achievements.length > 0 && (
              <div className="profile-section">
                <h4>Achievements</h4>
                <ul className="achievements-list">
                  {selectedInfluencer.achievements.map((achievement, index) => (
                    <li key={index} className="achievement-item">
                      🏆 {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedInfluencer.recentSessions && selectedInfluencer.recentSessions.length > 0 && (
              <div className="profile-section">
                <h4>Recent Sessions</h4>
                <div className="recent-sessions">
                  {selectedInfluencer.recentSessions.map((session) => (
                    <div key={session.id} className="session-item">
                      <h5>{session.title}</h5>
                      <div className="session-meta">
                        <span>📅 {session.date}</span>
                        <span>⏱️ {session.duration}</span>
                        <span>👥 {session.attendees} attendees</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="profile-section">
              <h4>Contact & Links</h4>
              <div className="contact-info">
                {selectedInfluencer.website && (
                  <a 
                    href={`https://${selectedInfluencer.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    🌐 {selectedInfluencer.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="influencers-page">
      <div className="page-header">
        <h1>Astronomy Influencers</h1>
        <p>Connect with experts and enthusiasts in the astronomy community</p>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <Button 
            variant={activeTab === 'discover' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab('discover')}
            className="tab"
          >
            Discover
          </Button>
          <Button 
            variant={activeTab === 'followings' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab('followings')}
            className="tab"
          >
            Following ({influencers.filter(i => i.isFollowing).length})
          </Button>
          <Button 
            variant={activeTab === 'events' ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab('events')}
            className="tab"
          >
            Events
          </Button>
        </div>
      </div>

      {/* Search Bar - Only show for discover and followings tabs */}
      {activeTab !== 'events' && (
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search influencers by name, expertise, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="search-icon">
              🔍
            </div>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="clear-search"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="search-results-info">
              Showing {getFilteredInfluencers().length} results for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      <div className="tab-content">
        {activeTab === 'events' ? renderEventsContent() : renderInfluencerCards()}
        
        {activeTab === 'followings' && getFilteredInfluencers().length === 0 && !searchQuery.trim() && (
          <div className="empty-state">
            <h3>No influencers followed yet</h3>
            <p>Discover and follow astronomy influencers to see them here.</p>
            <Button 
              variant="primary"
              size="large"
              onClick={() => setActiveTab('discover')}
              className="discover-btn"
            >
              Discover Influencers
            </Button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && renderProfileModal()}
    </div>
  )
}

export default Influencers
