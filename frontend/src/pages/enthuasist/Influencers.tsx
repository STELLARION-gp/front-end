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
}

const Influencers = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'followings' | 'events'>('discover')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      profilePicture: "",
      description: "Astrophysicist specializing in exoplanet research with 15+ years of experience in space exploration.",
      specializations: ["Exoplanets", "Space Exploration", "Astrophysics"],
      followersCount: 12500,
      sessionsCount: 45,
      isFollowing: false
    },
    {
      id: 2,
      name: "Mark Johnson",
      profilePicture: "",
      description: "Professional astronomer and educator passionate about making astronomy accessible to everyone.",
      specializations: ["Deep Sky Objects", "Telescope Reviews", "Beginner Astronomy"],
      followersCount: 8900,
      sessionsCount: 32,
      isFollowing: true
    },
    {
      id: 3,
      name: "Luna Rodriguez",
      profilePicture: "",
      description: "Planetary scientist and science communicator focusing on Mars exploration and planetary geology.",
      specializations: ["Mars Research", "Planetary Geology", "Space Missions"],
      followersCount: 15200,
      sessionsCount: 38,
      isFollowing: false
    },
    {
      id: 4,
      name: "Prof. James Wright",
      profilePicture: "",
      description: "Cosmologist researching dark matter and the early universe with groundbreaking discoveries.",
      specializations: ["Cosmology", "Dark Matter", "Big Bang Theory"],
      followersCount: 22100,
      sessionsCount: 67,
      isFollowing: true
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
    </div>
  )
}

export default Influencers
