import React, { useState } from 'react'
import '../../styles/pages/enthusiast/Influencers.scss' 

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
  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      profilePicture: "https://via.placeholder.com/120x120",
      description: "Astrophysicist specializing in exoplanet research with 15+ years of experience in space exploration.",
      specializations: ["Exoplanets", "Space Exploration", "Astrophysics"],
      followersCount: 12500,
      sessionsCount: 45,
      isFollowing: false
    },
    {
      id: 2,
      name: "Mark Johnson",
      profilePicture: "https://via.placeholder.com/120x120",
      description: "Professional astronomer and educator passionate about making astronomy accessible to everyone.",
      specializations: ["Deep Sky Objects", "Telescope Reviews", "Beginner Astronomy"],
      followersCount: 8900,
      sessionsCount: 32,
      isFollowing: true
    },
    {
      id: 3,
      name: "Luna Rodriguez",
      profilePicture: "https://via.placeholder.com/120x120",
      description: "Planetary scientist and science communicator focusing on Mars exploration and planetary geology.",
      specializations: ["Mars Research", "Planetary Geology", "Space Missions"],
      followersCount: 15200,
      sessionsCount: 38,
      isFollowing: false
    },
    {
      id: 4,
      name: "Prof. James Wright",
      profilePicture: "https://via.placeholder.com/120x120",
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

  const getFilteredInfluencers = () => {
    switch (activeTab) {
      case 'followings':
        return influencers.filter(influencer => influencer.isFollowing)
      case 'discover':
      default:
        return influencers
    }
  }

  const renderInfluencerCards = () => (
    <div className="influencers-grid">
      {getFilteredInfluencers().map(influencer => (
        <div key={influencer.id} className="influencer-card">
          <div className="card-header">
            <img 
              src={influencer.profilePicture} 
              alt={influencer.name}
              className="profile-picture"
            />
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
            <button 
              className={`follow-btn ${influencer.isFollowing ? 'following' : ''}`}
              onClick={() => handleFollowToggle(influencer.id)}
            >
              {influencer.isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="view-profile-btn">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  )

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
          <button 
            className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
          <button 
            className={`tab ${activeTab === 'followings' ? 'active' : ''}`}
            onClick={() => setActiveTab('followings')}
          >
            Following ({influencers.filter(i => i.isFollowing).length})
          </button>
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'events' ? renderEventsContent() : renderInfluencerCards()}
        
        {activeTab === 'followings' && getFilteredInfluencers().length === 0 && (
          <div className="empty-state">
            <h3>No influencers followed yet</h3>
            <p>Discover and follow astronomy influencers to see them here.</p>
            <button 
              className="discover-btn"
              onClick={() => setActiveTab('discover')}
            >
              Discover Influencers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Influencers
