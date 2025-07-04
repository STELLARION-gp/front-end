import React from "react";
import SessionCard from "./SessionCard";
import { upcomingSessions } from "./upcomingSessionsData";
import "../../styles/pages/learner/AstronomySessionsPage.scss";

const UpcomingSessions: React.FC = () => {
  return (
    <div className="upcoming-sessions">
      <h3>Upcoming Live Sessions</h3>
      <div className="upcoming-sessions-list">
        {upcomingSessions.map((session) => (
          <SessionCard key={session.id} {...session} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;
