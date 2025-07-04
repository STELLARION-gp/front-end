import React, { useState } from 'react';
import Button from '../../components/Button';
import '../../styles/pages/enthusiast/AstroHub.scss';

interface AstronomicalEvent {
  id: number;
  name: string;
  description: string;
  visibility: string;
  bestTime: string;
  image: string;
  date: string;
  duration: string;
}

interface SpaceNews {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  source: string;
  readTime: string;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
  isSticky?: boolean;
}

interface GroupChat {
  id: number;
  name: string;
  description: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  isActive: boolean;
}

const astronomicalEvents: AstronomicalEvent[] = [
  {
    id: 1,
    name: "Perseid Meteor Shower",
    description: "One of the most spectacular meteor showers of the year, with up to 60 meteors per hour at peak. The Perseids are known for their bright, fast meteors and occasional fireballs.",
    visibility: "Northern Hemisphere",
    bestTime: "2:00 AM - 5:00 AM",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=250&fit=crop",
    date: "July 17 - August 24, 2025",
    duration: "5 weeks"
  },
  {
    id: 2,
    name: "Total Lunar Eclipse",
    description: "A complete lunar eclipse where the Moon passes through Earth's shadow, creating a stunning red 'Blood Moon' effect visible to the naked eye.",
    visibility: "Asia, Australia, Pacific",
    bestTime: "10:30 PM - 2:30 AM",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    date: "September 7, 2025",
    duration: "4 hours"
  },
  {
    id: 3,
    name: "Jupiter Opposition",
    description: "Jupiter reaches its closest approach to Earth, appearing brightest and largest in the night sky. Perfect time for telescope observations of the Great Red Spot and moons.",
    visibility: "Worldwide",
    bestTime: "9:00 PM - 6:00 AM",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
    date: "November 3, 2025",
    duration: "1 night"
  },
  {
    id: 4,
    name: "Geminids Meteor Shower",
    description: "The year's most reliable meteor shower, producing bright, colorful meteors. Unlike most meteor showers, the Geminids originate from an asteroid rather than a comet.",
    visibility: "Worldwide",
    bestTime: "10:00 PM - 4:00 AM",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=250&fit=crop",
    date: "December 4 - 20, 2025",
    duration: "2 weeks"
  }
];

const spaceNews: SpaceNews[] = [
  {
    id: 1,
    title: "James Webb Telescope Discovers Ancient Galaxies",
    summary: "New observations reveal galaxies that formed just 400 million years after the Big Bang, pushing back the timeline of cosmic evolution.",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=200&fit=crop",
    date: "June 28, 2025",
    source: "NASA",
    readTime: "3 min"
  },
  {
    id: 2,
    title: "Mars Sample Return Mission Update",
    summary: "ESA and NASA provide latest updates on the ambitious mission to bring Martian soil samples back to Earth for detailed analysis.",
    image: "https://images.unsplash.com/photo-1607354534084-6413e9efcd1b?w=400&h=200&fit=crop",
    date: "June 25, 2025",
    source: "ESA",
    readTime: "5 min"
  },
  {
    id: 3,
    title: "Breakthrough in Exoplanet Atmosphere Analysis",
    summary: "Scientists detect water vapor and clouds in the atmosphere of a potentially habitable exoplanet 100 light-years away.",
    image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=400&h=200&fit=crop",
    date: "June 22, 2025",
    source: "ESO",
    readTime: "4 min"
  }
];

const discussions: Discussion[] = [
  {
    id: 1,
    title: "Best Telescopes for Beginners in 2025",
    author: "SkyWatcher_LK",
    replies: 23,
    lastActivity: "2 hours ago",
    category: "Equipment",
    isSticky: true
  },
  {
    id: 2,
    title: "Astrophotography Settings for Sri Lankan Skies",
    author: "AstroPhotoColombo",
    replies: 45,
    lastActivity: "5 hours ago",
    category: "Photography"
  },
  {
    id: 3,
    title: "Light Pollution Map of Colombo Metro Area",
    author: "DarkSkyAdvocate",
    replies: 18,
    lastActivity: "1 day ago",
    category: "Observation"
  },
  {
    id: 4,
    title: "Planning a Stargazing Trip to Horton Plains",
    author: "MountainStargazer",
    replies: 31,
    lastActivity: "2 days ago",
    category: "Travel"
  }
];

const groupChats: GroupChat[] = [
  {
    id: 1,
    name: "Sri Lanka Astronomers",
    description: "Main discussion group for astronomy enthusiasts in Sri Lanka",
    members: 1247,
    lastMessage: "Anyone observing the ISS pass tonight?",
    lastMessageTime: "15 min ago",
    isActive: true
  },
  {
    id: 2,
    name: "Astrophotography Sri Lanka",
    description: "Share your astrophotography work and techniques",
    members: 432,
    lastMessage: "Amazing Milky Way shot from Ella!",
    lastMessageTime: "1 hour ago",
    isActive: true
  },
  {
    id: 3,
    name: "Telescope Buyers & Sellers",
    description: "Buy, sell, and trade astronomical equipment",
    members: 289,
    lastMessage: "Selling Celestron NexStar 6SE in excellent condition",
    lastMessageTime: "3 hours ago",
    isActive: false
  },
  {
    id: 4,
    name: "Meteor Shower Alerts",
    description: "Real-time alerts and observations for meteor showers",
    members: 156,
    lastMessage: "Perseids peak activity confirmed for tonight!",
    lastMessageTime: "45 min ago",
    isActive: true
  }
];

const AstroHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'news' | 'discussions' | 'chats'>('events');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="events-section">
            <div className="section-header">
              <h2>Upcoming Astronomical Events</h2>
            </div>
            <div className="events-grid">
              {astronomicalEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card__image">
                    <img src={event.image} alt={event.name} />
                    <div className="event-card__date-badge">
                      {event.date}
                    </div>
                  </div>
                  <div className="event-card__content">
                    <h3 className="event-card__title">{event.name}</h3>
                    <p className="event-card__description">{event.description}</p>
                    <div className="event-card__details">
                      <div className="event-detail">
                        <span className="event-detail__label">Visibility:</span>
                        <span className="event-detail__value">{event.visibility}</span>
                      </div>
                      <div className="event-detail">
                        <span className="event-detail__label">Best Time:</span>
                        <span className="event-detail__value">{event.bestTime}</span>
                      </div>
                      <div className="event-detail">
                        <span className="event-detail__label">Duration:</span>
                        <span className="event-detail__value">{event.duration}</span>
                      </div>
                    </div>
                    <div className="event-card__actions">
                      <Button variant="primary" size="small">
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="news-section">
            <div className="section-header">
              <h2>Latest Space News</h2>
            </div>
            <div className="news-grid">
              {spaceNews.map((article) => (
                <div key={article.id} className="news-card">
                  <div className="news-card__image">
                    <img src={article.image} alt={article.title} />
                    <div className="news-card__source">{article.source}</div>
                  </div>
                  <div className="news-card__content">
                    <div className="news-card__meta">
                      <span className="news-card__date">{article.date}</span>
                      <span className="news-card__read-time">{article.readTime} read</span>
                    </div>
                    <h3 className="news-card__title">{article.title}</h3>
                    <p className="news-card__summary">{article.summary}</p>
                    <Button variant="secondary" size="small" className="news-card__read-more">
                      Read Full Article
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'discussions':
        return (
          <div className="discussions-section">
            <div className="section-header">
              <h2>Community Discussions</h2>
              <Button variant="primary" className="start-discussion-btn">
                Start New Discussion
              </Button>
            </div>
            <div className="discussions-list">
              {discussions.map((discussion) => (
                <div key={discussion.id} className={`discussion-item ${discussion.isSticky ? 'sticky' : ''}`}>
                  <div className="discussion-item__main">
                    <div className="discussion-item__header">
                      {discussion.isSticky && <span className="sticky-badge">📌 Pinned</span>}
                      <span className="category-badge">{discussion.category}</span>
                    </div>
                    <h3 className="discussion-item__title">{discussion.title}</h3>
                    <div className="discussion-item__meta">
                      <span className="discussion-item__author">by {discussion.author}</span>
                      <span className="discussion-item__replies">{discussion.replies} replies</span>
                      <span className="discussion-item__activity">Last activity: {discussion.lastActivity}</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="small">
                    Join Discussion
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chats':
        return (
          <div className="chats-section">
            <div className="section-header">
              <h2>Group Chats</h2>
              <Button variant="primary" className="create-chat-btn">
                Create New Group
              </Button>
            </div>
            <div className="chats-grid">
              {groupChats.map((chat) => (
                <div key={chat.id} className={`chat-card ${chat.isActive ? 'active' : ''}`}>
                  <div className="chat-card__header">
                    <div className="chat-card__title-section">
                      <h3 className="chat-card__title">{chat.name}</h3>
                      <div className="chat-card__status">
                        <span className={`status-indicator ${chat.isActive ? 'online' : 'offline'}`}></span>
                        <span className="member-count">{chat.members} members</span>
                      </div>
                    </div>
                  </div>
                  <p className="chat-card__description">{chat.description}</p>
                  <div className="chat-card__last-message">
                    <div className="last-message-content">
                      <span className="last-message-text">"{chat.lastMessage}"</span>
                      <span className="last-message-time">{chat.lastMessageTime}</span>
                    </div>
                  </div>
                  <div className="chat-card__actions">
                    <Button variant="primary" size="small">
                      Join Chat
                    </Button>
                    <Button variant="secondary" size="small">
                      View Info
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="astro-hub">
      <div className="astro-hub__header">
        <div className="astro-hub__header-content">
          <h1 className="astro-hub__title">Astro Hub</h1>
          <p className="astro-hub__subtitle">
            Your central hub for astronomical events, space news, and community discussions
          </p>
        </div>
      </div>

      <div className="astro-hub__navigation">
        <div className="tab-buttons">
          <Button 
            variant={activeTab === 'events' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('events')}
          >
            Astronomical Events
          </Button>
          <Button 
            variant={activeTab === 'news' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('news')}
          >
            Space News
          </Button>
          <Button 
            variant={activeTab === 'discussions' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('discussions')}
          >
            Discussions
          </Button>
          <Button 
            variant={activeTab === 'chats' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('chats')}
          >
            Group Chats
          </Button>
        </div>
      </div>

      <div className="astro-hub__content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AstroHub;
