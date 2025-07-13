import React, { useState, useEffect } from "react";
import "../../styles/pages/influencer/Polls.scss";
import { sessionIdeasPolls } from "../../components/Learner/sessionIdeasPollsData";
import { FaPlus, FaChartBar, FaCheck, FaTrash, FaEdit } from "react-icons/fa";

// Types
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
  authorPic: string;
  createdAt: string;
  comments: number;
  feedbacks?: Feedback[];
}

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userPic: string;
  text: string;
  createdAt: string;
}

// Tab component
const Tab: React.FC<{
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ label, icon, active, onClick }) => (
  <div
    className={`polls-tab ${active ? "active" : ""}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </div>
);

// Progress bar component
const ProgressBar: React.FC<{ percent: number; color?: string }> = ({
  percent,
  color = "#4F46E5",
}) => (
  <div className="poll-progress-container">
    <div className="poll-progress-bar">
      <div
        className="poll-progress-fill"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
    <span className="poll-progress-percent">{percent}%</span>
  </div>
);

// Create Poll Tab Content
const CreatePollTab: React.FC<{ onPollCreated: (poll: Poll) => void }> = ({ onPollCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, { id: `${options.length + 1}`, text: "" }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError("Please enter a poll title");
      return;
    }
    
    if (!description.trim()) {
      setError("Please enter a poll description");
      return;
    }
    
    const validOptions = options.filter(opt => opt.text.trim() !== "");
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options");
      return;
    }

    // Create new poll
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      title,
      description,
      options: validOptions.map(opt => ({ ...opt, votes: 0 })),
      trending: false,
      author: "You", // In a real app, get from user context
      authorPic: "https://ui-avatars.com/api/?name=You&background=4F46E5&color=fff",
      createdAt: new Date().toISOString(),
      comments: 0,
      feedbacks: []
    };

    onPollCreated(newPoll);
    
    // Reset form
    setTitle("");
    setDescription("");
    setOptions([
      { id: "1", text: "" },
      { id: "2", text: "" },
    ]);
    setError("");
  };

  return (
    <div className="create-poll-container">
      <div className="poll-form-header">
        <h2>Create a New Poll</h2>
        <p>Get feedback and ideas for your next session</p>
      </div>
      
      {error && <div className="poll-error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-group">
          <label htmlFor="poll-title">Poll Title</label>
          <input
            id="poll-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to know?"
            maxLength={100}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="poll-description">Description</label>
          <textarea
            id="poll-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more context about your poll..."
            rows={3}
            maxLength={300}
          />
        </div>
        
        <div className="form-group">
          <label>Poll Options</label>
          <div className="poll-options-list">
            {options.map((option) => (
              <div key={option.id} className="poll-option-input">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${option.id}`}
                  maxLength={100}
                />
                <button
                  type="button"
                  className="remove-option-btn"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="add-option-btn"
              onClick={addOption}
              disabled={options.length >= 10}
            >
              <FaPlus /> Add Option
            </button>
          </div>
        </div>
        
        <button type="submit" className="create-poll-btn">
          <FaCheck /> Create Poll
        </button>
      </form>
    </div>
  );
};

// Results Tab Content
const ResultsTab: React.FC<{ polls: Poll[] }> = ({ polls }) => {
  const [expandedPoll, setExpandedPoll] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  
  const filteredPolls = 
    filter === "all" ? polls : 
    filter === "trending" ? polls.filter(poll => poll.trending) : 
    polls.filter(poll => !poll.trending);

  const togglePollExpansion = (pollId: string) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  if (polls.length === 0) {
    return (
      <div className="no-polls-message">
        <h3>No polls available</h3>
        <p>Create your first poll to start gathering feedback</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="polls-filter">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All Polls
        </button>
        <button 
          className={filter === "trending" ? "active" : ""} 
          onClick={() => setFilter("trending")}
        >
          Trending
        </button>
        <button 
          className={filter === "regular" ? "active" : ""} 
          onClick={() => setFilter("regular")}
        >
          Regular
        </button>
      </div>

      <div className="polls-results-list">
        {filteredPolls.map(poll => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
          const isExpanded = expandedPoll === poll.id;
          return (
            <div 
              key={poll.id} 
              className={`poll-result-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div className="poll-result-header" onClick={() => togglePollExpansion(poll.id)}>
                <div>
                  <h3>{poll.title}</h3>
                  <p className="poll-date">Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="poll-stats">
                  <span className="total-votes">{totalVotes} votes</span>
                  {poll.trending && <span className="trending-badge">Trending</span>}
                </div>
              </div>
              
              {isExpanded && (
                <div className="poll-result-details">
                  <p className="poll-description">{poll.description}</p>
                  
                  <div className="poll-options-results">
                    {poll.options.map(option => {
                      const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={option.id} className="poll-option-result">
                          <div className="option-info">
                            <span className="option-text">{option.text}</span>
                            <span className="option-votes">{option.votes} votes</span>
                          </div>
                          <ProgressBar percent={percent} />
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="poll-feedback-section">
                    <h4>Feedback & Suggestions</h4>
                    {poll.feedbacks && poll.feedbacks.length > 0 ? (
                      <div className="feedback-list">
                        {poll.feedbacks.map(feedback => (
                          <div key={feedback.id} className="feedback-item">
                            <div className="feedback-header">
                              <img src={feedback.userPic} alt={feedback.userName} />
                              <span>{feedback.userName}</span>
                              <span className="feedback-date">
                                {new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p>{feedback.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-feedback">No feedback yet.</p>
                    )}
                  </div>
                  
                  <div className="poll-actions">
                    <button className="edit-poll-btn">
                      <FaEdit /> Edit Poll
                    </button>
                    <button className="close-poll-btn">
                      Close Poll
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Polls Page Component
const Polls: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "results">("create");
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    // In a real app, fetch polls from API
    // For now, use sample data
    setPolls(sessionIdeasPolls);
  }, []);

  const handlePollCreated = (newPoll: Poll) => {
    setPolls([newPoll, ...polls]);
    setActiveTab("results"); // Switch to results tab after creating
  };

  return (
    <div className="polls-page">
      <div className="polls-header">
        <h1>Session Polls</h1>
        <p>Create polls and get feedback for your upcoming sessions</p>
      </div>

      <div className="polls-tabs">
        <Tab
          label="Create Poll"
          icon={<FaPlus />}
          active={activeTab === "create"}
          onClick={() => setActiveTab("create")}
        />
        <Tab
          label="View Results"
          icon={<FaChartBar />}
          active={activeTab === "results"}
          onClick={() => setActiveTab("results")}
        />
      </div>

      <div className="polls-content">
        {activeTab === "create" ? (
          <CreatePollTab onPollCreated={handlePollCreated} />
        ) : (
          <ResultsTab polls={polls} />
        )}
      </div>
    </div>
  );
};

export default Polls;
