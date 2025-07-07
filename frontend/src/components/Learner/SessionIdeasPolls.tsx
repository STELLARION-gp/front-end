import React, { useState } from "react";
import "../../styles/components/learner/SessionIdeasPolls.scss";
import PollDetailsPopup from "./PollDetailsPopup";
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
  authorPic: string; // Added authorPic for displaying author's avatar
  createdAt: string;
  comments: number;
}

// Progress bar component
const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="poll-progress-bar">
    <div className="poll-progress-bar-fill" style={{ width: `${percent}%` }} />
  </div>
);

const PollItem: React.FC<Omit<Poll, 'comments'> & { onClick: () => void }> = ({
  title,
  description,
  options,
  trending,
  author,
  authorPic,
  createdAt,
  onClick,
}) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
  return (
    <div className={`poll-item blogcard${trending ? " poll-item-trending" : ""}`} onClick={onClick} style={{ cursor: "pointer" }}>
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
            src={authorPic}
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
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Dummy conductor and comments for demo
  const getConductor = (poll: Poll) => ({
    name: poll.author,
    pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(poll.author)}&background=fbbf24&color=232b3b&size=64`,
  });
  const sampleComments = [
    {
      id: "c1",
      author: "Alice Johnson",
      text: "Great idea! Would love to join this session.",
      date: new Date().toISOString(),
    },
    {
      id: "c2",
      author: "Bob Lee",
      text: "Can we also discuss exoplanet detection methods?",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "c3",
      author: "Priya Sen",
      text: "Looking forward to this. Please share the slides after!",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ];
  const getComments = (poll: Poll) => (poll as { commentsList?: typeof sampleComments }).commentsList || sampleComments;

  return (
    <div className="session-ideas-polls">
      <h3>Session Ideas & Polls</h3>
      <div className="poll-list">
        {sessionIdeasPolls.map((poll) => (
          <PollItem
            key={poll.id}
            {...poll}
            onClick={() => {
              setSelectedPoll(poll);
              setPopupOpen(true);
            }}
          />
        ))}
      </div>
      {selectedPoll && (
        <PollDetailsPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          title={selectedPoll.title}
          description={selectedPoll.description}
          options={selectedPoll.options}
          author={selectedPoll.author}
          authorPic={selectedPoll.authorPic}
          createdAt={selectedPoll.createdAt}
          conductor={getConductor(selectedPoll).name}
          conductorPic={getConductor(selectedPoll).pic}
          comments={getComments(selectedPoll)}
        />
      )}
      {/* Submission form can go here */}
    </div>
  );
};

export default SessionIdeasPolls;
