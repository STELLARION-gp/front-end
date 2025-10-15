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
  if (lowerChoice === 'yes') return '✅ Yes';
  if (lowerChoice === 'maybe') return '🤔 Maybe';
  if (lowerChoice === 'no') return '❌ No';
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
          return (
            <div className="poll-option-row" key={choice.choice}>
              <button 
                className={`poll-option-btn ${poll.user_vote === choice.choice ? 'voted' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!poll.user_vote) {
                    onVote(poll.id, choice.choice);
                  }
                }}
                disabled={voting || !!poll.user_vote}
              >
                {getChoiceLabel(choice.choice)}
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

  // Fetch polls on component mount
  useEffect(() => {
    fetchPolls();
  }, []);

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
      await pollService.voteOnPoll(pollId, choice);
      
      // Refresh polls to show updated results
      await fetchPolls();
      
      alert(`Vote recorded successfully! You voted: ${getChoiceLabel(choice)}`);
    } catch (err: any) {
      console.error('Error voting:', err);
      alert(err.message || 'Failed to vote. You may have already voted on this poll.');
    } finally {
      setVotingPollId(null);
    }
  };

  // Dummy comments for now (can be integrated with real comments later)
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
          comments={sampleComments}
        />
      )}
    </div>
  );
};

export default SessionIdeasPolls;
