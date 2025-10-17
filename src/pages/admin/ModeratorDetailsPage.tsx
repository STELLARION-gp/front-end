import React from 'react';
import Button from '../../components/Button';
import '../../styles/components/admin/ModeratorAnalyticsModal.scss';

const sampleModerator = {
  name: 'Alice Johnson',
  email: 'alice@stellarion.com',
  section: 'Astronomy',
  status: 'Active',
  contact: '+94 77 123 4567',
  image: 'https://randomuser.me/api/portraits/women/44.jpg',
  analytics: {
    totalCamps: 12,
    totalEvents: 8,
    totalModerations: 34,
    avgRating: 4.82,
    campTrend: 18,
    eventTrend: 12,
    moderationTrend: 5,
    recentCamps: [
      { name: 'Stellar Night', date: '2025-07-10', participants: 45, rating: 4.9 },
      { name: 'Cosmic Camp', date: '2025-06-22', participants: 38, rating: 4.8 },
      { name: 'Galaxy Watch', date: '2025-06-05', participants: 42, rating: 4.7 },
    ],
    recentEvents: [
      { name: 'Tech Expo', date: '2025-07-15', attendees: 120, rating: 4.8 },
      { name: 'Astronomy Day', date: '2025-06-30', attendees: 95, rating: 4.7 },
      { name: 'Physics Fest', date: '2025-06-12', attendees: 80, rating: 4.6 },
    ],
  },
  bio: 'Alice is a senior astronomy moderator with 5+ years of experience organizing night camps and platform events. She is known for her leadership, attention to detail, and passion for science education.',
  joined: '2021-03-15',
  roles: ['Moderator', 'Event Organizer', 'Camp Leader'],
  awards: [
    { title: 'Best Moderator 2024', desc: 'Awarded for outstanding moderation and event management.' },
    { title: 'Stellar Camp Innovator', desc: 'Recognized for creating new camp formats.' }
  ],
  social: {
    facebook: 'https://facebook.com/alice.johnson',
    linkedin: 'https://linkedin.com/in/alicejohnson',
    twitter: 'https://twitter.com/aliceastro'
  }
};

const ModeratorDetailsPage: React.FC = () => {
  const m = sampleModerator;
  return (
    <div className="moderator-analytics-modal-overlay">
      <div className="moderator-analytics-modal">
        <div className="moderator-analytics-header">
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <img src={m.image} alt={m.name} style={{width:96,height:96,borderRadius:'50%',objectFit:'cover',border:'4px solid #3b82f6',background:'#232b3b'}} />
            <div>
              <h2 style={{marginBottom:8}}>{m.name}</h2>
              <div style={{color:'#60a5fa',fontSize:'1.1rem',marginBottom:4}}>{m.email}</div>
              <div style={{color:'#3b82f6',fontWeight:500}}>Section: <b>{m.section}</b></div>
              <div style={{color:'#e2e8f0'}}>Contact: {m.contact}</div>
              <div style={{marginTop:8,fontWeight:600}}>Status: <span style={{color:m.status==='Active'?'#22c55e':'#ef4444'}}>{m.status}</span></div>
            </div>
          </div>
        </div>
        <div className="moderator-analytics-body">
          <div style={{marginBottom:'2rem'}}>
            <div style={{fontSize:'1.15rem',fontWeight:600,color:'#60a5fa',marginBottom:8}}>Bio</div>
            <div style={{color:'#e2e8f0',fontSize:'1rem'}}>{m.bio}</div>
            <div style={{marginTop:12,color:'#94a3b8'}}>Joined: {m.joined}</div>
            <div style={{marginTop:8,color:'#94a3b8'}}>Roles: {m.roles.join(', ')}</div>
          </div>
          <div className="analytics-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌙</div>
              <div className="stat-label">Night Camps Created</div>
              <div className="stat-value">{m.analytics.totalCamps}</div>
              <div className={`stat-trend ${m.analytics.campTrend < 0 ? 'negative' : ''}`}>{m.analytics.campTrend > 0 ? `+${m.analytics.campTrend}%` : `${m.analytics.campTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎉</div>
              <div className="stat-label">Events Organized</div>
              <div className="stat-value">{m.analytics.totalEvents}</div>
              <div className={`stat-trend ${m.analytics.eventTrend < 0 ? 'negative' : ''}`}>{m.analytics.eventTrend > 0 ? `+${m.analytics.eventTrend}%` : `${m.analytics.eventTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-label">Moderations</div>
              <div className="stat-value">{m.analytics.totalModerations}</div>
              <div className={`stat-trend ${m.analytics.moderationTrend < 0 ? 'negative' : ''}`}>{m.analytics.moderationTrend > 0 ? `+${m.analytics.moderationTrend}%` : `${m.analytics.moderationTrend}%`} this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-label">Avg. Rating</div>
              <div className="stat-value">{m.analytics.avgRating.toFixed(2)}</div>
            </div>
          </div>
          <div className="performance-section">
            <h4>Recent Night Camps</h4>
            <div className="performance-grid">
              {m.analytics.recentCamps.map((camp, idx) => (
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
              {m.analytics.recentEvents.map((event, idx) => (
                <div className="performance-item" key={idx}>
                  <div className="perf-label">{event.name}</div>
                  <div className="perf-value">{event.attendees} attendees</div>
                  <div className="perf-trend">{event.rating} ★</div>
                  <div className="perf-label">{event.date}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginBottom:'2rem'}}>
            <div style={{fontSize:'1.15rem',fontWeight:600,color:'#60a5fa',marginBottom:8}}>Awards</div>
            <ul style={{color:'#e2e8f0',fontSize:'1rem',paddingLeft:18}}>
              {m.awards.map((a, idx) => (
                <li key={idx} style={{marginBottom:6}}><b>{a.title}</b>: {a.desc}</li>
              ))}
            </ul>
          </div>
          <div style={{marginBottom:'2rem'}}>
            <div style={{fontSize:'1.15rem',fontWeight:600,color:'#60a5fa',marginBottom:8}}>Social Links</div>
            <div style={{display:'flex',gap:18}}>
              <a href={m.social.facebook} target="_blank" rel="noopener noreferrer" style={{color:'#3b82f6'}}>Facebook</a>
              <a href={m.social.linkedin} target="_blank" rel="noopener noreferrer" style={{color:'#3b82f6'}}>LinkedIn</a>
              <a href={m.social.twitter} target="_blank" rel="noopener noreferrer" style={{color:'#3b82f6'}}>Twitter</a>
            </div>
          </div>
          <div className="actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Button className="modal-btn" variant="secondary">Set Inactive</Button>
            <Button className="modal-btn" variant="primary">Edit Details</Button>
            <Button className="modal-btn">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDetailsPage;
