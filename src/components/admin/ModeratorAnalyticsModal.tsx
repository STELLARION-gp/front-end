import React from 'react';
import Button from '../../components/Button';
import '../../styles/components/admin/ModeratorAnalyticsModal.scss';

// Example analytics data structure
interface ModeratorAnalytics {
  totalCamps: number;
  totalEvents: number;
  totalModerations: number;
  avgRating: number;
  campTrend: number;
  eventTrend: number;
  moderationTrend: number;
  recentCamps: Array<{ name: string; date: string; participants: number; rating: number }>;
  recentEvents: Array<{ name: string; date: string; attendees: number; rating: number }>;
}

interface Moderator {
  name: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
  contact?: string;
  image?: string;
  analytics: ModeratorAnalytics;
}

interface Props {
  moderator: Moderator;
  onClose: () => void;
  onStatusChange: (email: string, newStatus: 'Active' | 'Inactive') => void;
}

const ModeratorAnalyticsModal: React.FC<Props> = ({ moderator, onClose, onStatusChange }) => {
  const { analytics } = moderator;
  return (
    <div className="moderator-analytics-modal-overlay">
      <div className="moderator-analytics-modal">
        <div className="moderator-analytics-header">
          <h2>{moderator.name} - Analytics</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="moderator-analytics-body">
          {/* Stats Grid */}
          <div className="analytics-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌙</div>
              <div className="stat-label">Night Camps Created</div>
              <div className="stat-value">{analytics.totalCamps}</div>
              <div className={`stat-trend ${analytics.campTrend < 0 ? 'negative' : ''}`}>{analytics.campTrend > 0 ? `+${analytics.campTrend}%` : `${analytics.campTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-label">Events Organized</div>
              <div className="stat-value">{analytics.totalEvents}</div>
              <div className={`stat-trend ${analytics.eventTrend < 0 ? 'negative' : ''}`}>{analytics.eventTrend > 0 ? `+${analytics.eventTrend}%` : `${analytics.eventTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-label">Moderations</div>
              <div className="stat-value">{analytics.totalModerations}</div>
              <div className={`stat-trend ${analytics.moderationTrend < 0 ? 'negative' : ''}`}>{analytics.moderationTrend > 0 ? `+${analytics.moderationTrend}%` : `${analytics.moderationTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-label">Avg. Rating</div>
              <div className="stat-value">{analytics.avgRating.toFixed(2)}</div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="performance-section">
            <h4>Recent Night Camps</h4>
            <div className="performance-grid">
              {analytics.recentCamps.map((camp, idx) => (
                <div className="performance-item" key={idx}>
                  <div className="perf-label">{camp.name}</div>
                  <div className="perf-value">{camp.participants} participants</div>
                  <div className="perf-trend">{camp.rating} ★</div>
                  <div className="perf-label">{camp.date}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="performance-section">
            <h4>Recent Events</h4>
            <div className="performance-grid">
              {analytics.recentEvents.map((event, idx) => (
                <div className="performance-item" key={idx}>
                  <div className="perf-label">{event.name}</div>
                  <div className="perf-value">{event.attendees} attendees</div>
                  <div className="perf-trend">{event.rating} ★</div>
                  <div className="perf-label">{event.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Actions */}
          <div className="actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            {moderator.status === 'Active' ? (
              <Button className="modal-btn" variant="secondary" onClick={() => onStatusChange(moderator.email, 'Inactive')}>Set Inactive</Button>
            ) : (
              <Button className="modal-btn" variant="primary" onClick={() => onStatusChange(moderator.email, 'Active')}>Set Active</Button>
            )}
            <Button className="modal-btn" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorAnalyticsModal;
