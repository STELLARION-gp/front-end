import React, { useState, useEffect } from "react";
import "../../styles/pages/influencer/Polls.scss";
import Button from "../../components/Button";
import pollService, { type Poll } from "../../services/pollService";

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
const CreatePollTab: React.FC<{ onPollCreated: () => void }> = ({ onPollCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    setError("");

    try {
      // Create poll via API
      console.log("📝 Creating poll with data:", {
        title: title.trim(),
        description: description.trim(),
        options: validOptions.map(opt => opt.text.trim())
      });
      
      const response = await pollService.createPoll({
        title: title.trim(),
        description: description.trim(),
        options: validOptions.map(opt => opt.text.trim())
      });
      
      console.log("✅ Poll created successfully:", response);

      // Reset form
      setTitle("");
      setDescription("");
      setOptions([
        { id: "1", text: "" },
        { id: "2", text: "" },
      ]);
      
      // Notify parent component
      onPollCreated();
    } catch (err: any) {
      console.error("❌ Error creating poll:", err);
      setError(err.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
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
        
        <Button type="submit" className="create-poll-btn" disabled={loading}>
          <CheckIcon width={16} height={16} /> {loading ? "Creating..." : "Create Poll"}
        </Button>
      </form>
    </div>
  );
};

// Results Tab Content
const ResultsTab: React.FC<{ 
  polls: Poll[]; 
  loading: boolean; 
  statusFilter: "all" | "pending" | "approved" | "rejected";
  onStatusFilterChange: (status: "all" | "pending" | "approved" | "rejected") => void;
}> = ({ polls, loading, statusFilter, onStatusFilterChange }) => {
  const [expandedPoll, setExpandedPoll] = useState<number | null>(null);
  const togglePollExpansion = (pollId: number) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  // Filter polls by status
  const filteredPolls = statusFilter === "all" 
    ? polls 
    : polls.filter(poll => poll.status === statusFilter);

  console.log("🔍 ResultsTab render:", {
    totalPolls: polls.length,
    statusFilter,
    filteredPollsCount: filteredPolls.length,
    pollStatuses: polls.map(p => ({ id: p.id, title: p.title, status: p.status }))
  });

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'pending': return 'status-badge status-pending';
      default: return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="polls-loading">
        <p>Loading your polls...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Status Filter Buttons */}
      <div className="status-filter-buttons">
        <button 
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('all')}
        >
          All ({polls.length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('pending')}
        >
          Pending ({polls.filter(p => p.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('approved')}
        >
          Approved ({polls.filter(p => p.status === 'approved').length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('rejected')}
        >
          Rejected ({polls.filter(p => p.status === 'rejected').length})
        </button>
      </div>

      {filteredPolls.length === 0 ? (
        <div className="no-polls-message">
          <h3>No polls found</h3>
          <p>{statusFilter === 'all' ? 'Create your first poll to start gathering feedback' : `No ${statusFilter} polls`}</p>
        </div>
      ) : null}

      <div className="polls-results-list">
        {filteredPolls.map(poll => {
          const isExpanded = expandedPoll === poll.id;
          const displayName = poll.creator?.display_name || 
                             `${poll.creator?.first_name || ''} ${poll.creator?.last_name || ''}`.trim() ||
                             'Unknown';
          
          return (
            <div 
              key={poll.id} 
              className={`poll-result-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div className="poll-result-header" onClick={() => togglePollExpansion(poll.id)}>
                <div>
                  <h3>
                    {poll.title}
                    {poll.status && <span className={getStatusBadgeClass(poll.status)}>{poll.status}</span>}
                  </h3>
                  <p className="poll-meta">
                    Created: {new Date(poll.created_at).toLocaleDateString()} by {displayName}
                  </p>
                  {poll.moderated_at && (
                    <p className="poll-moderation-info">
                      Moderated: {new Date(poll.moderated_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="poll-stats">
                  <span className="total-votes">{poll.total_votes} votes</span>
                  <span className="total-comments">{poll.comment_count} comments</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="poll-result-details">
                  {poll.description && <p className="poll-description">{poll.description}</p>}
                  
                  <div className="poll-options-results">
                    <h4>Results</h4>
                    {poll.choices.map((choice, index) => (
                      <div key={index} className="poll-option-result">
                        <div className="option-info">
                          <span className="option-text">{choice.choice}</span>
                          <span className="option-votes">{choice.vote_count} votes</span>
                        </div>
                        <ProgressBar percent={choice.percentage} />
                      </div>
                    ))}
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
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Load user's polls
  const loadMyPolls = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching my polls...");
      const response = await pollService.getMyPolls({ page: 1, limit: 100 });
      console.log("📦 Full API response:", response);
      console.log("📊 Response data:", response.data);
      console.log("📈 Number of polls:", response.data?.length || 0);
      
      // Debug each poll's status
      if (response.data && response.data.length > 0) {
        response.data.forEach((poll, index) => {
          console.log(`Poll ${index + 1}:`, {
            id: poll.id,
            title: poll.title,
            status: poll.status,
            moderated_at: poll.moderated_at,
            created_at: poll.created_at
          });
        });
      } else {
        console.warn("⚠️ No polls returned from API");
      }
      
      setPolls(response.data || []);
    } catch (error: any) {
      console.error("❌ Failed to load polls:", error);
      console.error("❌ Error details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyPolls();
  }, []);

  const handlePollCreated = () => {
    // Reload polls after creating a new one
    loadMyPolls();
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
          <ResultsTab 
            polls={polls} 
            loading={loading} 
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </div>
    </div>
  );
};

export default Polls;
