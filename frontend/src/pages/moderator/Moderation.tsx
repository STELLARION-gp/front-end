import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaFileAlt, FaCalendarAlt, FaComments, FaMapMarkerAlt, FaCampground, FaCalendarCheck } from 'react-icons/fa';
import './Moderation.scss';

interface ModerationModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  stats: {
    pending: number;
    total: number;
    recent: number;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const moderationModules: ModerationModule[] = [
  {
    id: 'content',
    title: 'Content Moderation',
    description: 'Review posts, comments, and media content for compliance',
    icon: <FaFileAlt />,
    route: '/dashboard/moderation/content',
    stats: { pending: 23, total: 156, recent: 7 },
    priority: 'high'
  },
  {
    id: 'profile',
    title: 'Profile Moderation',
    description: 'Verify user profiles, handle reports, and manage bans',
    icon: <FaUsers />,
    route: '/dashboard/moderation/profile',
    stats: { pending: 12, total: 89, recent: 3 },
    priority: 'medium'
  },
  {
    id: 'session',
    title: 'Session Proposal Moderation',
    description: 'Review and approve stargazing session proposals',
    icon: <FaCalendarAlt />,
    route: '/dashboard/moderation/session',
    stats: { pending: 8, total: 45, recent: 2 },
    priority: 'medium'
  },
  {
    id: 'polls',
    title: 'Polls, Votes & Threads Moderation',
    description: 'Moderate community polls, voting, and discussion threads',
    icon: <FaComments />,
    route: '/dashboard/moderation/polls',
    stats: { pending: 15, total: 234, recent: 9 },
    priority: 'high'
  },
  {
    id: 'spots',
    title: 'Stargazing Spot Moderation',
    description: 'Review and verify submitted stargazing locations',
    icon: <FaMapMarkerAlt />,
    route: '/dashboard/moderation/spots',
    stats: { pending: 6, total: 78, recent: 1 },
    priority: 'low'
  },
  {
    id: 'camp',
    title: 'Night Camp Management',
    description: 'Oversee night camping events and registrations',
    icon: <FaCampground />,
    route: '/dashboard/moderation/camp',
    stats: { pending: 4, total: 32, recent: 2 },
    priority: 'medium'
  },
  {
    id: 'events',
    title: 'Event Moderation',
    description: 'Manage community events and astronomical observations',
    icon: <FaCalendarCheck />,
    route: '/dashboard/moderation/events',
    stats: { pending: 11, total: 67, recent: 4 },
    priority: 'high'
  }
];

export default function Moderation() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleModuleClick = (module: ModerationModule) => {
    setSelectedModule(module.id);
    // Add a small delay for animation before navigation
    setTimeout(() => {
      navigate(module.route);
    }, 200);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff4757';
      case 'high': return '#ffa502';
      case 'medium': return '#3742fa';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const totalPending = moderationModules.reduce((sum, module) => sum + module.stats.pending, 0);
  const totalItems = moderationModules.reduce((sum, module) => sum + module.stats.total, 0);
  const recentActivity = moderationModules.reduce((sum, module) => sum + module.stats.recent, 0);

  return (
    <div className="moderation-dashboard">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Header Section */}
      <header className="moderation-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="main-title">
              <span className="title-gradient">Moderation Center</span>
            </h1>
            <p className="subtitle">Stellar Community Management Hub</p>
          </div>
          
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-number">{totalPending}</span>
              <span className="stat-label">Pending Reviews</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{totalItems}</span>
              <span className="stat-label">Total Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{recentActivity}</span>
              <span className="stat-label">Recent Activity</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="moderation-content">
        <div className="modules-grid">
          {moderationModules.map((module) => (
            <div
              key={module.id}
              className={`module-card ${selectedModule === module.id ? 'selected' : ''}`}
              onClick={() => handleModuleClick(module)}
              style={{
                '--priority-color': getPriorityColor(module.priority)
              } as React.CSSProperties}
            >
              <div className="module-header">
                <div className="module-icon">
                  {module.icon}
                </div>
                <div className="priority-indicator" data-priority={module.priority}>
                  {module.priority}
                </div>
              </div>

              <div className="module-content">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>

                <div className="module-stats">
                  <div className="stat-row">
                    <span className="stat-label">Pending:</span>
                    <span className="stat-value pending">{module.stats.pending}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value total">{module.stats.total}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Recent:</span>
                    <span className="stat-value recent">{module.stats.recent}</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${(module.stats.pending / module.stats.total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="module-footer">
                <button className="access-button">
                  Access Module
                  <span className="button-arrow">→</span>
                </button>
              </div>

              {/* Hover effect elements */}
              <div className="hover-glow"></div>
              <div className="selection-ring"></div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="moderation-footer">
        <div className="footer-content">
          <p>Last system update: {new Date().toLocaleString()}</p>
          <div className="quick-actions">
            <button className="quick-action-btn">Generate Report</button>
            <button className="quick-action-btn">System Status</button>
            <button className="quick-action-btn">Emergency Protocol</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
