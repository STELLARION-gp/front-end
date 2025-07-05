import React from "react";
import "../../styles/pages/learner/AstronomySessionsPage.scss";
import SessionIdeasPolls from "../../components/Learner/SessionIdeasPolls";
import UpcomingSessions from "../../components/Learner/UpcomingSessions";
import RecordedSessions from "../../components/Learner/RecordedSessions";

const AstronomySessionsPage: React.FC = () => {
  return (
    <div className="astronomy-sessions-page">
      <h2>Astronomy Sessions</h2>
      <div className="astronomy-sessions-sections">
        <section className="astronomy-sessions-ideas">
          <SessionIdeasPolls />
        </section>
        <section className="astronomy-sessions-upcoming">
          <UpcomingSessions />
        </section>
        <section className="astronomy-sessions-recorded">
          <RecordedSessions />
        </section>
      </div>
    </div>
  );
};

export default AstronomySessionsPage;
