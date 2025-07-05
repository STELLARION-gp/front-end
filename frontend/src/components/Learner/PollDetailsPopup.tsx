import React from "react";
import "../../styles/components/learner/PollDetailsPopup.scss";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  options: PollOption[];
  author: string;
  createdAt: string;
  conductor: string;
  conductorPic: string;
  comments: { id: string; author: string; text: string; date: string; }[];
}

const PollDetailsPopup: React.FC<PollDetailsPopupProps> = ({
  open,
  onClose,
  title,
  description,
  options,
  author,
  createdAt,
  conductor,
  conductorPic,
  comments,
}) => {
  if (!open) return null;
  return (
    <div className="poll-details-popup-backdrop" onClick={onClose}>
      <div className="poll-details-popup" onClick={e => e.stopPropagation()}>
        <button className="poll-details-close" onClick={onClose}>&times;</button>
        <h2 className="poll-details-title">{title}</h2>
        <div className="poll-details-meta">
          <span>Created by <b>{author}</b> on {new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <div className="poll-details-description">{description}</div>
        <div className="poll-details-options">
          {options.map(opt => (
            <div className="poll-details-option" key={opt.id}>
              <span className="poll-details-option-text">{opt.text}</span>
              <span className="poll-details-option-votes">{opt.votes} votes</span>
            </div>
          ))}
        </div>
        <div className="poll-details-organizer">
          <img className="poll-details-conductor-pic" src={conductorPic} alt={conductor} />
          <span className="poll-details-conductor-name">Organizer: {conductor}</span>
        </div>
        <div className="poll-details-comments-section">
          <h4>Comments</h4>
          <div className="poll-details-comments-list">
            {comments.length === 0 ? (
              <div className="poll-details-no-comments">No comments yet.</div>
            ) : (
              comments.map(comment => (
                <div className="poll-details-comment" key={comment.id}>
                  <span className="poll-details-comment-author">{comment.author}</span>
                  <span className="poll-details-comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                  <div className="poll-details-comment-text">{comment.text}</div>
                </div>
              ))
            )}
          </div>
          <form className="poll-details-comment-form">
            <input type="text" placeholder="Add a comment..." className="poll-details-comment-input" />
            <button type="submit" className="poll-details-comment-submit">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PollDetailsPopup;
