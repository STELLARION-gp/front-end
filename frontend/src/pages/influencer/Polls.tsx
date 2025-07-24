import React, { useState, useEffect } from "react";
import "../../styles/pages/influencer/Polls.scss";
import { sessionIdeasPolls } from "../../components/Learner/sessionIdeasPollsData";
import Button from "../../components/Button";

// Define SVG icons as components
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
  >
    <path d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" />
  </svg>
);

const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
  >
    <path d="M3 13.2C3 12.5373 3.53726 12 4.2 12H6.8C7.46274 12 8 12.5373 8 13.2V20H3V13.2Z" />
    <path d="M10 9.2C10 8.53726 10.5373 8 11.2 8H13.8C14.4627 8 15 8.53726 15 9.2V20H10V9.2Z" />
    <path d="M17 5.2C17 4.53726 17.5373 4 18.2 4H20.8C21.4627 4 22 4.53726 22 5.2V20H17V5.2Z" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
  >
    <path d="M20.6644 5.2526C21.0772 5.61952 21.1143 6.25159 20.7474 6.66437L10.0808 18.6644C9.89099 18.8779 9.61898 19 9.33334 19C9.04771 19 8.7757 18.8779 8.58593 18.6644L3.2526 12.6644C2.88568 12.2516 2.92286 11.6195 3.33565 11.2526C3.74843 10.8857 4.3805 10.9229 4.74742 11.3356L9.33334 16.4948L19.2526 5.33565C19.6195 4.92286 20.2516 4.88568 20.6644 5.2526Z" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 6V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V6H4C3.44772 6 3 6.44772 3 7C3 7.55228 3.44772 8 4 8H5V19C5 20.6569 6.34315 22 8 22H16C17.6569 22 19 20.6569 19 19V8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H17ZM15 5H9V6H15V5ZM17 8H7V19C7 19.5523 7.44772 20 8 20H16C16.5523 20 17 19.5523 17 19V8Z"
    />
    <path d="M9 11C9.55228 11 10 11.4477 10 12V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V12C8 11.4477 8.44772 11 9 11Z" />
    <path d="M15 11C15.5523 11 16 11.4477 16 12V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V12C14 11.4477 14.4477 11 15 11Z" />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.8787 3.10659C17.0503 1.93496 18.9497 1.93496 20.1213 3.10659L20.8787 3.86406C22.0503 5.0357 22.0503 6.93496 20.8787 8.10659L18.5 10.4853L17.5 14.9999L13 13.9999L8.87868 18.1213C8.31607 18.6839 7.55301 19 6.75736 19H3V15.2427C3 14.447 3.31607 13.684 3.87868 13.1213L15.8787 3.10659ZM19.0251 4.20305C18.4538 3.63175 17.5462 3.63175 16.9749 4.20305L14.4645 6.71351L17.2929 9.54191L19.8033 7.03144C20.3746 6.46014 20.3746 5.55248 19.8033 4.98119L19.0251 4.20305ZM16.5858 11.1213L13.7574 8.29289L5 17.0502V17.9999H6.75736C7.02152 17.9999 7.27425 17.8946 7.46447 17.7044L12.5 12.6689L16.5858 11.1213Z"
    />
  </svg>
);

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
// const Tab: React.FC<{
//   label: string;
//   icon: React.ReactNode;
//   active: boolean;
//   onClick: () => void;
// }> = ({ label, icon, active, onClick }) => (
//   <div
//     className={`polls-tab ${active ? "active" : ""}`}
//     onClick={onClick}
//   >
//     {icon}
//     <span>{label}</span>
//   </div>
// );

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
                <Button
                  type="button"
                  className="remove-option-btn"
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                >
                  <TrashIcon width={16} height={16} />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              className="add-option-btn"
            onClick={addOption}
              disabled={options.length >= 10}
            >
              <PlusIcon width={16} height={16} /> Add Option
            </Button>
          </div>
        </div>
        
        <Button type="submit" className="create-poll-btn">
          <CheckIcon width={16} height={16} /> Create Poll
        </Button>
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
        <Button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All Polls
        </Button>
        <Button 
          className={filter === "trending" ? "active" : ""} 
          onClick={() => setFilter("trending")}
        >
          Trending
        </Button>
        <Button 
          className={filter === "regular" ? "active" : ""} 
          onClick={() => setFilter("regular")}
        >
          Regular
        </Button>
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
                    <Button className="edit-poll-btn">
                      <EditIcon width={16} height={16} /> Edit Poll
                    </Button>
                    <Button className="close-poll-btn">
                      Close Poll
                    </Button>
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
        <Button
          active={activeTab === "create"}
          onClick={() => setActiveTab("create")}
        >
          <PlusIcon width={20} height={20} /> Create Poll
        </Button>
        <Button
          active={activeTab === "results"}
          onClick={() => setActiveTab("results")}
        >
          <ChartBarIcon width={20} height={20} /> View Results
        </Button>
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
