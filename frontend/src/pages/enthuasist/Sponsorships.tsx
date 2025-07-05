import React, { useState } from 'react';
import { CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';
import '../../styles/pages/enthusiast/Sponsorships.scss';

interface SponsorshipEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  contact: string;
  fundraisingGoal: number;
  amountRaised: number;
  category: string;
  organizer: string;
  attendees: number;
}

interface SponsorshipHistory {
  id: string;
  eventName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const Sponsorships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seeking' | 'history'>('seeking');

  // Mock data for events seeking sponsorship
  const eventsSeekingSponsorship: SponsorshipEvent[] = [
    {
      id: '1',
      name: 'Stargazing Night 2025',
      date: '2025-08-15',
      description: 'Join us for an enchanting evening under the stars with guided telescope observations and expert astronomy talks.',
      location: 'Dark Sky Preserve, California',
      contact: 'astronomy@stellarion.com',
      fundraisingGoal: 15000,
      amountRaised: 8500,
      category: 'Community Event',
      organizer: 'Stellarion Astronomy Club',
      attendees: 200
    },
    {
      id: '2',
      name: 'Youth Space Camp',
      date: '2025-07-20',
      description: 'A week-long intensive space education program for students aged 12-18, featuring hands-on experiments and space simulations.',
      location: 'Space Education Center, Texas',
      contact: 'spacecamp@stellarion.com',
      fundraisingGoal: 25000,
      amountRaised: 12000,
      category: 'Educational Program',
      organizer: 'Stellarion Education Foundation',
      attendees: 50
    },
    {
      id: '3',
      name: 'Mars Rover Challenge',
      date: '2025-09-10',
      description: 'Engineering competition where teams design and build Mars rovers to complete challenging terrain courses.',
      location: 'Tech Innovation Hub, Seattle',
      contact: 'rovers@stellarion.com',
      fundraisingGoal: 20000,
      amountRaised: 18500,
      category: 'Competition',
      organizer: 'Stellarion Robotics',
      attendees: 300
    },
    {
      id: '4',
      name: 'Astronomy Photography Workshop',
      date: '2025-10-05',
      description: 'Learn advanced astrophotography techniques from professional photographers and astronomers.',
      location: 'Mountain Observatory, Colorado',
      contact: 'photo@stellarion.com',
      fundraisingGoal: 8000,
      amountRaised: 3200,
      category: 'Workshop',
      organizer: 'Stellarion Photo Society',
      attendees: 75
    }
  ];

  // Mock data for sponsorship history
  const sponsorshipHistory: SponsorshipHistory[] = [
    {
      id: '1',
      eventName: 'Solar Eclipse Expedition 2024',
      amount: 2500,
      date: '2024-04-08',
      status: 'completed'
    },
    {
      id: '2',
      eventName: 'International Space Day',
      amount: 1800,
      date: '2024-05-04',
      status: 'completed'
    },
    {
      id: '3',
      eventName: 'Meteorite Hunting Adventure',
      amount: 3000,
      date: '2024-06-15',
      status: 'completed'
    },
    {
      id: '4',
      eventName: 'Space Technology Symposium',
      amount: 5000,
      date: '2024-11-20',
      status: 'pending'
    }
  ];

  // Calculate totals
  const totalContributions = sponsorshipHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const eventsSponsored = sponsorshipHistory.filter(item => item.status === 'completed').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="sponsorships-page">
      {/* Header Section */}
      <div className="sponsorships-header">
        <h1 className="page-title">Sponsorships</h1>
        <p className="page-subtitle">Support amazing astronomy events and track your contributions to the space community</p>
        
        {/* Statistics Cards */}
        <div className="stats-grid">
          <Card variant="elevated" className="stats-card">
            <div className="stat-content">
              <div className="stat-icon">
                <CurrencyDollarIcon className="icon" />
              </div>
              <div className="stat-details">
                <h3 className="stat-label">Total Contributions</h3>
                <p className="stat-value">{formatCurrency(totalContributions)}</p>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="stats-card">
            <div className="stat-content">
              <div className="stat-icon">
                <UserGroupIcon className="icon" />
              </div>
              <div className="stat-details">
                <h3 className="stat-label">Events Sponsored</h3>
                <p className="stat-value">{eventsSponsored}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sponsorships-tabs">
        <Button
          className={`tab-button ${activeTab === 'seeking' ? 'active' : ''}`}
          onClick={() => setActiveTab('seeking')}
        >
          Events Seeking Sponsorship
        </Button>
        <Button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          My Sponsorship History
        </Button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'seeking' && (
          <div className="events-grid">
            {eventsSeekingSponsorship.map((event) => (
              <Card key={event.id} variant="outlined" className="event-card">
                <div className="event-header">
                  <h3 className="event-title">{event.name}</h3>
                  <span className="event-category">{event.category}</span>
                </div>
                
                <div className="event-details">
                  <div className="detail-item">
                    <CalendarDaysIcon className="detail-icon" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <MapPinIcon className="detail-icon" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <EnvelopeIcon className="detail-icon" />
                    <span>{event.contact}</span>
                  </div>
                  
                  <div className="detail-item">
                    <UserGroupIcon className="detail-icon" />
                    <span>{event.attendees} expected attendees</span>
                  </div>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="funding-section">
                  <div className="funding-header">
                    <span className="funding-label">Fundraising Progress</span>
                    <span className="funding-amount">
                      {formatCurrency(event.amountRaised)} / {formatCurrency(event.fundraisingGoal)}
                    </span>
                  </div>
                  
                  <ProgressBar
                    current={event.amountRaised}
                    max={event.fundraisingGoal}
                    showNumbers={false}
                    className="funding-progress"
                  />
                  
                  <div className="progress-percentage">
                    {getProgressPercentage(event.amountRaised, event.fundraisingGoal).toFixed(1)}% funded
                  </div>
                </div>
                
                <div className="event-actions">
                  <Button variant="primary" size="medium">
                    Sponsor Now
                  </Button>
                  <Button variant="border" size="medium">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-grid">
              {sponsorshipHistory.map((item) => (
                <Card key={item.id} variant="outlined" className="history-card">
                  <div className="history-content">
                    <div className="history-main">
                      <h3 className="history-event-name">{item.eventName}</h3>
                      <p className="history-date">{formatDate(item.date)}</p>
                    </div>
                    
                    <div className="history-details">
                      <div className="history-amount">{formatCurrency(item.amount)}</div>
                      <div className={`history-status ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {sponsorshipHistory.length === 0 && (
              <div className="empty-state">
                <CurrencyDollarIcon className="empty-icon" />
                <h3>No sponsorship history yet</h3>
                <p>Start sponsoring events to see your contribution history here.</p>
                <Button variant="primary" onClick={() => setActiveTab('seeking')}>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsorships;
