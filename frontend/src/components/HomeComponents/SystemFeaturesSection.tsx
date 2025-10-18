import React from 'react';
import { FaMapMarkerAlt, FaBlog, FaCalendarAlt } from 'react-icons/fa';
import '../../styles/components/SystemFeaturesSection.scss';

const SystemFeaturesSection: React.FC = () => {
  return (
    <section className="system-features-section">
      <div className="system-features-container">
        {/* Section Header */}
        <div className="system-features-header">
          <h2 className="system-features-title">Explore Our Platform</h2>
          <p className="system-features-subtitle">
            Discover stargazing spots, read astronomy blogs, and join exciting events
          </p>
        </div>

        {/* Three Feature Cards */}
        <div className="system-features-grid">
          {/* Stargazing Spots Card */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaMapMarkerAlt className="feature-icon" />
              <div className="feature-icon-glow"></div>
            </div>
            <h3 className="feature-title">Stargazing Spots</h3>
            <p className="feature-description">
              Discover the best locations around the world for observing celestial wonders
            </p>
            <div className="feature-stats">
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Locations</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">4.8★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
            <button className="feature-cta-btn">
              Explore Spots
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Blogs Card */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaBlog className="feature-icon" />
              <div className="feature-icon-glow"></div>
            </div>
            <h3 className="feature-title">Astronomy Blogs</h3>
            <p className="feature-description">
              Read fascinating articles about space, astronomy, and the mysteries of the universe
            </p>
            <div className="feature-stats">
              <div className="stat-item">
                <span className="stat-value">1000+</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">50K</span>
                <span className="stat-label">Readers</span>
              </div>
            </div>
            <button className="feature-cta-btn">
              Read Blogs
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Events Card */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaCalendarAlt className="feature-icon" />
              <div className="feature-icon-glow"></div>
            </div>
            <h3 className="feature-title">Astronomy Events</h3>
            <p className="feature-description">
              Join stargazing events, meteor showers viewing, and astronomy workshops
            </p>
            <div className="feature-stats">
              <div className="stat-item">
                <span className="stat-value">150+</span>
                <span className="stat-label">Events/Year</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10K</span>
                <span className="stat-label">Participants</span>
              </div>
            </div>
            <button className="feature-cta-btn">
              View Events
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemFeaturesSection;
