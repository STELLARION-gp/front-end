import React from "react";
import "../../styles/components/learner/SessionIdeasPolls.scss";
import { sessionIdeasPolls } from "./sessionIdeasPollsData";

// Updated PollOption type for multiple options
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  trending: boolean;
  author: string;
  createdAt: string;
  comments: number;
}

// Progress bar component
const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="poll-progress-bar">
    <div className="poll-progress-bar-fill" style={{ width: `${percent}%` }} />
  </div>
);

const PollItem: React.FC<Poll> = ({
  title,
  description,
  options,
  trending,
  author,
  createdAt,
  comments,
}) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
  return (
    <div className={`poll-item blogcard${trending ? " poll-item-trending" : ""}`}>
      <div className="poll-title blogcard-title">{title}</div>
      <div className="poll-desc blogcard-desc">{description}</div>
      <div className="poll-options">
        {options.map((option) => {
          const percent = Math.round((option.votes / totalVotes) * 100);
          return (
            <div className="poll-option-row" key={option.id}>
              <button className="poll-option-btn">{option.text}</button>
              <span className="poll-option-votes">{option.votes} votes</span>
              <ProgressBar percent={percent} />
            </div>
          );
        })}
      </div>
      {/* Author info below options */}
      <div className="poll-author-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img
            className="poll-author-avatar"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=3b82f6&color=fff&size=48`}
            alt={author}
            />
            <span className="poll-author-name">{author}</span>
        </div>
        <span className="poll-date">Created at: {new Date(createdAt).toLocaleDateString()}</span>
      </div>
      {trending && (
        <div className="poll-trending-bottom">
          <span className="poll-trending">Trending</span>
        </div>
      )}
    </div>
  );
};

const SessionIdeasPolls: React.FC = () => {
  return (
    <div className="session-ideas-polls">
      <h3>Session Ideas & Polls</h3>
      <div className="poll-list">
        {sessionIdeasPolls.map((poll) => (
          <PollItem key={poll.id} {...poll} />
        ))}
      </div>
      {/* Submission form can go here */}
    </div>
  );
};

export default SessionIdeasPolls;
