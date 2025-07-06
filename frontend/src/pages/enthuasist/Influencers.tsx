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
      name: "Dr. Chandima Perera",
      profilePicture: "",
      description: "Leading astronomy researcher from University of Colombo, specializing in stellar physics and variable star analysis.",
      specializations: ["Stellar Physics", "Variable Stars", "Photometry"],
      followersCount: 3400,
      sessionsCount: 22,
      isFollowing: false,
      bio: "Dr. Chandima Perera is a distinguished astronomy researcher from the University of Colombo, Sri Lanka. He has made significant contributions to stellar physics research and is passionate about promoting astronomy education in South Asia.",
      location: "Colombo, Sri Lanka",
      website: "www.stellar-research-sl.edu.lk",
      joinedDate: "September 2021",
      totalViews: 85000,
      rating: 4.6,
      recentSessions: [
        { id: 1, title: "Variable Stars of the Southern Hemisphere", date: "June 22, 2025", duration: "1h 20m", attendees: 145 },
        { id: 2, title: "Stellar Evolution and Life Cycles", date: "June 8, 2025", duration: "1h 45m", attendees: 178 },
      ],
      achievements: ["Sri Lankan Science Award 2024", "SAARC Astronomy Excellence 2023"]
    },
    {
      id: 2,
      name: "Nadeeka Silva",
      profilePicture: "",
      description: "Amateur astronomer and astrophotographer capturing the beauty of Sri Lankan night skies.",
      specializations: ["Astrophotography", "Night Sky Navigation", "Beginner Guides"],
      followersCount: 5600,
      sessionsCount: 18,
      isFollowing: false,
      bio: "Nadeeka Silva is a passionate amateur astronomer and astrophotographer based in Kandy, Sri Lanka. She specializes in capturing stunning images of the night sky and teaches beginners about astronomy in tropical regions.",
      location: "Kandy, Sri Lanka",
      website: "www.srilankastars.com",
      joinedDate: "February 2022",
      totalViews: 95000,
      rating: 4.5,
      recentSessions: [
        { id: 1, title: "Astrophotography in Tropical Climates", date: "June 26, 2025", duration: "1h 30m", attendees: 198 },
        { id: 2, title: "Southern Sky Constellations Guide", date: "June 12, 2025", duration: "1h 15m", attendees: 167 },
        { id: 3, title: "Monsoon Season Astronomy Tips", date: "May 28, 2025", duration: "1h", attendees: 143 }
      ],
      achievements: ["Best Astrophotography Sri Lanka 2024", "Community Educator Award 2023"]
    },
    {
      id: 3,
      name: "Prof. Ranil Wickramasinghe",
      profilePicture: "",
      description: "Emeritus professor of astronomy and pioneer of space science education in Sri Lanka.",
      specializations: ["Space Science Education", "Radio Astronomy", "Cosmic Rays"],
      followersCount: 7800,
      sessionsCount: 45,
      isFollowing: true,
      bio: "Professor Ranil Wickramasinghe is an emeritus professor and pioneer of space science education in Sri Lanka. He has dedicated over 30 years to astronomical research and education, establishing several astronomy programs in the country.",
      location: "Peradeniya, Sri Lanka",
      website: "www.spaceedu-sl.org",
      joinedDate: "June 2020",
      totalViews: 145000,
      rating: 4.8,
      recentSessions: [
        { id: 1, title: "History of Astronomy in Sri Lanka", date: "July 1, 2025", duration: "2h", attendees: 234 },
        { id: 2, title: "Radio Astronomy Fundamentals", date: "June 18, 2025", duration: "1h 45m", attendees: 189 },
        { id: 3, title: "Cosmic Ray Detection Methods", date: "June 5, 2025", duration: "1h 30m", attendees: 156 }
      ],
      achievements: ["National Science Foundation Award 2023", "Lifetime Achievement in Astronomy 2022", "UNESCO Science Education Medal 2021"]
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

  const closeProfileModal = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
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

                {activeTab === 'followings' && influencer.isFollowing ? 'Unfollow' : (influencer.isFollowing ? 'Following' : 'Follow')}
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
        <div className="events-grid">
          <div className="event-card">
            <h4>Mars Exploration Deep Dive</h4>
            <p>Join Prof. Ranil Wickramasinghe for an exclusive session on the latest Mars discoveries and upcoming missions.</p>
            <div className="event-details">
              <span>📅 July 15, 2025</span>
              <span>🕒 7:00 PM IST</span>
              <span>👥 156 attendees</span>
            </div>
            <div className="event-actions">
              <Button
                variant="primary"
                size="small"
                className="join-event-btn"
              >
                Join Event
              </Button>
            </div>
          </div>
          <div className="event-card">
            <h4>Astrophotography Workshop</h4>
            <p>Learn tropical climate astrophotography techniques with Nadeeka Silva in this hands-on workshop.</p>
            <div className="event-details">
              <span>📅 July 20, 2025</span>
              <span>🕒 8:00 PM IST</span>
              <span>👥 89 attendees</span>
            </div>
            <div className="event-actions">
              <Button
                variant="primary"
                size="small"
                className="join-event-btn"
              >
                Join Event
              </Button>
            </div>
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
              onClick={(e) => closeProfileModal(e)}
              aria-label="Close modal"
              type="button"
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
        {/* <p>Connect with experts and enthusiasts in the astronomy community</p> */}
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
        {activeTab === 'events' ? renderEventsContent() : (
          <>
            {activeTab === 'followings' && (
              <div className="section-header">
                <h2>Your Following</h2>
                
              </div>
            )}
            {renderInfluencerCards()}
          </>
        )}
        
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
