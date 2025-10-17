import React, { useState } from "react";
import "../../styles/pages/learner/AstronomySessionsPage.scss";
import SessionIdeasPolls from "../../components/Learner/SessionIdeasPolls";
import UpcomingSessions from "../../components/Learner/UpcomingSessions";
import RecordedSessions from "../../components/Learner/RecordedSessions";
import MySessions from "../../components/Learner/MySessions";

const AstronomySessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ideas' | 'upcoming' | 'recorded' | 'my-sessions'>('ideas');

  return (
    <div className="astronomy-sessions-page">
      <h2>Astronomy Sessions</h2>
      
      {/* Tabs Navigation */}
      <div className="astronomy-sessions-tabs">
        <button
          className={`tab-button ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          Session Ideas & Polls
        </button>
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Live
        </button>
        <button
          className={`tab-button ${activeTab === 'recorded' ? 'active' : ''}`}
          onClick={() => setActiveTab('recorded')}
        >
          Recorded
        </button>
        <button
          className={`tab-button ${activeTab === 'my-sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-sessions')}
        >
          My Sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="astronomy-sessions-content">
        {activeTab === 'ideas' && (
          <section className="astronomy-sessions-ideas">
            <SessionIdeasPolls />
          </section>
        )}
        {activeTab === 'upcoming' && (
          <section className="astronomy-sessions-upcoming">
            <UpcomingSessions />
          </section>
        )}
        {activeTab === 'recorded' && (
          <section className="astronomy-sessions-recorded">
            <RecordedSessions />
          </section>
        )}
        {activeTab === 'my-sessions' && (
          <section className="astronomy-sessions-my">
            <MySessions />
          </section>
        )}
      </div>
    </div>
  );
};

export default AstronomySessionsPage;
