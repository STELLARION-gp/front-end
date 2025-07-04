import React from "react";
import RecordedSessionCard from "./RecordedSessionCard";
import { recordedSessions } from "./recordedSessionsData";
import "../../styles/pages/learner/RecordedSessionCard.scss";

const RecordedSessions: React.FC = () => {
  return (
    <div className="recorded-sessions">
      <h3>Recorded Sessions</h3>
      <div className="recorded-sessions-list">
        {recordedSessions.map((session) => (
          <RecordedSessionCard key={session.id} {...session} />
        ))}
      </div>
    </div>
  );
};

export default RecordedSessions;
