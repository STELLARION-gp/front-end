import React, { useState, useEffect } from "react";
import "../../styles/components/learner/SessionIdeasPolls.scss";
import PollDetailsPopup from "./PollDetailsPopup";
import Button from "../Button";
import pollService, { type Poll } from '../../services/pollService';

// Progress bar component
const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="poll-progress-bar">
    <div className="poll-progress-bar-fill" style={{ width: `${percent}%` }} />
  </div>
);

// Helper function to get choice label with emoji for common choices
const getChoiceLabel = (choice: string): string => {
  const lowerChoice = choice.toLowerCase();
  if (lowerChoice === 'yes') return ' Yes';
  if (lowerChoice === 'maybe') return ' Maybe';
  if (lowerChoice === 'no') return ' No';
  return choice; // Return as-is for custom options
};

const PollItem: React.FC<{ poll: Poll; onSeeMore: () => void; onVote: (pollId: number, choice: string) => void; voting: boolean }> = ({
  poll,
  onSeeMore,
  onVote,
  voting
}) => {
  const authorName = poll.creator.display_name || `${poll.creator.first_name || ''} ${poll.creator.last_name || ''}`.trim() || 'Anonymous';
  const authorPic = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=fbbf24&color=232b3b&size=64`;

  return (
    <div className="poll-item blogcard" style={{ cursor: "pointer" }}>
      <div className="poll-title blogcard-title">{poll.title}</div>
      {poll.description && <div className="poll-desc blogcard-desc">{poll.description}</div>}
      
      <div className="poll-options">
        {poll.choices.map((choice) => {
          const percent = choice.percentage;
          const isUserVote = poll.user_vote === choice.choice;
          return (
            <div className="poll-option-row" key={choice.choice}>
              <button 
                className={`poll-option-btn ${isUserVote ? 'voted' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(poll.id, choice.choice);
                }}
                disabled={voting}
                title={isUserVote ? 'Your current vote (click to change)' : poll.user_vote ? 'Click to change your vote' : 'Click to vote'}
              >
                {getChoiceLabel(choice.choice)}
                {isUserVote && ' ✓'}
              </button>
              <span className="poll-option-votes">{choice.vote_count} votes</span>
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
            alt={authorName}
          />
          <span className="poll-author-name">{authorName}</span>
        </div>
        <span className="poll-date">Created: {new Date(poll.created_at).toLocaleDateString()}</span>
      </div>
      
      {poll.user_vote && (
        <div className="poll-voted-indicator">
          ✓ You voted: {getChoiceLabel(poll.user_vote)}
          <span className="change-vote-hint"> (Click any option to change)</span>
        </div>
      )}
      
      <Button onClick={onSeeMore}>See More</Button>
    </div>
  );
};

const SessionIdeasPolls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingPollId, setVotingPollId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'success' });

  // Fetch polls on component mount
  useEffect(() => {
    fetchPolls();
  }, []);

  // Auto-hide notification after 4 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ show: true, message, type });
  };

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pollService.getActivePolls({
        page: 1,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      });
      setPolls(response.data);
    } catch (err: any) {
      console.error('Error fetching polls:', err);
      setError(err.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: number, choice: string) => {
    try {
      setVotingPollId(pollId);
      
      // Find the poll to check if user already voted
      const poll = polls.find(p => p.id === pollId);
      const isChangingVote = poll?.user_vote && poll.user_vote !== choice;
      
      await pollService.voteOnPoll(pollId, choice);
      
      // Refresh polls to show updated results
      await fetchPolls();
      
      if (isChangingVote) {
        showNotification(`Vote changed successfully! Your new vote: ${getChoiceLabel(choice)}`, 'success');
      } else if (poll?.user_vote === choice) {
        showNotification(`You have already voted for this option: ${getChoiceLabel(choice)}`, 'info');
      } else {
        showNotification(`Vote recorded successfully! You voted: ${getChoiceLabel(choice)}`, 'success');
      }
    } catch (err: any) {
      console.error('Error voting:', err);
      showNotification(err.message || 'Failed to vote. Please try again.', 'error');
    } finally {
      setVotingPollId(null);
    }
  };

  if (loading) {
    return (
      <div className="session-ideas-polls">
        <h3>Session Ideas & Polls</h3>
        <div className="loading">Loading polls...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="session-ideas-polls">
        <h3>Session Ideas & Polls</h3>
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchPolls} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-ideas-polls">
      <h3>Session Ideas & Polls</h3>
      <div className="poll-list">
        {polls.length === 0 ? (
          <div className="no-polls">
            <p>No active polls at the moment.</p>
            <p>Be the first to suggest a session idea!</p>
          </div>
        ) : (
          polls.map((poll) => (
            <PollItem
              key={poll.id}
              poll={poll}
              onSeeMore={() => {
                setSelectedPoll(poll);
                setPopupOpen(true);
              }}
              onVote={handleVote}
              voting={votingPollId === poll.id}
            />
          ))
        )}
      </div>
      {selectedPoll && (
        <PollDetailsPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          pollId={selectedPoll.id}
          title={selectedPoll.title}
          description={selectedPoll.description || ''}
          options={selectedPoll.choices.map(choice => ({
            id: choice.choice,
            text: getChoiceLabel(choice.choice),
            votes: choice.vote_count
          }))}
          author={selectedPoll.creator.display_name || `${selectedPoll.creator.first_name || ''} ${selectedPoll.creator.last_name || ''}`.trim() || 'Anonymous'}
          authorPic={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPoll.creator.display_name || 'User')}&background=fbbf24&color=232b3b&size=64`}
          createdAt={new Date(selectedPoll.created_at).toISOString()}
          conductor={selectedPoll.creator.display_name || 'Conductor'}
          conductorPic={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPoll.creator.display_name || 'User')}&background=fbbf24&color=232b3b&size=64`}
        />
      )}

      {/* Notification Popup */}
      {notification.show && (
        <div className={`notification-popup ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✕'}
              {notification.type === 'info' && 'ℹ'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionIdeasPolls;
