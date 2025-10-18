import '../../styles/pages/learner/MentorMenteeConnectionPage.scss';

import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  getConnectionDetails, 
  getNotes,
  saveNote,
  updateNote,
  deleteNote,
  getGoals,
  updateGoal,
  type Note,
  type Goal
} from '../../services/mentorMenteeConnectionApi';
import { type MenteeApplication } from '../../services/menteeApplicationApi';

const MentorMenteeConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [application, setApplication] = useState<MenteeApplication | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note form states
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const fetchConnectionData = async () => {
      if (!id) {
        setError('No connection ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch connection details, notes, and goals in parallel
        const [connectionData, notesData, goalsData] = await Promise.all([
          getConnectionDetails(parseInt(id)),
          getNotes(parseInt(id)),
          getGoals(parseInt(id))
        ]);

        setApplication(connectionData.application);
        setNotes(notesData);
        setGoals(goalsData);
        setError('');
      } catch (err: any) {
        console.error('Error fetching connection data:', err);
        setError(err.response?.data?.error || 'Failed to load connection data');
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionData();
  }, [id]);

  // Note handlers
  const handleSaveNote = async () => {
    if (!id || !newNoteContent.trim()) return;
    
    setSavingNote(true);
    try {
      const tags = newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await saveNote(parseInt(id), {
        title: newNoteTitle,
        content: newNoteContent,
        tags,
        isPinned: false
      });
      
      // Clear form
      setNewNoteTitle('');
      setNewNoteContent('');
      setNewNoteTags('');
      
      // Refresh notes
      const notesData = await getNotes(parseInt(id));
      setNotes(notesData);
    } catch (err: any) {
      console.error('Error saving note:', err);
      alert(err.response?.data?.error || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: number, isPinned: boolean) => {
    if (!id) return;
    
    try {
      await updateNote(noteId, { isPinned: !isPinned });
      const notesData = await getNotes(parseInt(id));
      setNotes(notesData);
    } catch (err: any) {
      console.error('Error updating note:', err);
      alert(err.response?.data?.error || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    if (!id) return;
    
    try {
      await deleteNote(noteId);
      const notesData = await getNotes(parseInt(id));
      setNotes(notesData);
    } catch (err: any) {
      console.error('Error deleting note:', err);
      alert(err.response?.data?.error || 'Failed to delete note');
    }
  };

  // Goal handlers
  const handleUpdateGoalProgress = async (goalId: number, newProgress: number) => {
    if (!id) return;
    
    try {
      const status = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started';
      await updateGoal(goalId, { 
        progress: newProgress,
        status
      });
      const goalsData = await getGoals(parseInt(id));
      setGoals(goalsData);
    } catch (err: any) {
      console.error('Error updating goal:', err);
      alert(err.response?.data?.error || 'Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="mentor-connection-page">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#c7d0e6' }}>
          Loading connection details...
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="mentor-connection-page">
        <Button
          variant="secondary"
          icon={<span style={{fontSize:'1.2rem'}}>&larr;</span>}
          iconPosition="left"
          onClick={() => navigate(-1)}
          size="medium"
        >Back</Button>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#ef4444',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          ⚠️ {error || 'Connection not found'}
        </div>
      </div>
    );
  }

  const mentor = application.mentor;
  const displayName = mentor?.display_name || 
                     `${mentor?.first_name || ''} ${mentor?.last_name || ''}`.trim() || 
                     'Mentor';
  
  // Get profile picture from mentor's profile_data or use default
  const profileData = mentor?.profile_data as any;
  const profilePicture = profileData?.avatarUrl || 
                        profileData?.profilePicture || 
                        profileData?.avatar || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4f8cff&color=fff&size=200`;
  
  return (
    <div className="mentor-connection-page">
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Button
          variant="secondary"
          icon={<span style={{fontSize:'1.2rem'}}>&larr;</span>}
          iconPosition="left"
          onClick={() => navigate(-1)}
          size="medium"
        >Back</Button>
      </div>
      {/* Mentor header */}
      <div className="mentor-header">
        <img 
          className="mentor-header-avatar" 
          src={profilePicture} 
          alt={displayName} 
        />
        <div className="mentor-header-info">
          <span className="mentor-header-name">{displayName}</span>
          <span className="mentor-header-expertise">{mentor?.email || 'Mentor'}</span>
          <span className="mentor-header-status connected">Connected</span>
          <span className="mentor-header-last-active">
            Connected: {new Date(application.reviewed_at || application.submitted_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Modern stacked sections */}

      {/* Chat Section */}
      <section className="mentor-section mentor-chat-section">
        <h2>Chat Section</h2>
        <div className="chat-ui">
          <div className="chat-messages">
            <div className="chat-date-separator">July 18, 2025</div>
            {/* Mentor message left */}
            <div className="chat-message mentor left">
              <span className="chat-avatar">🧑‍🚀</span>
              <div className="chat-bubble">Welcome to our session! <span className="chat-read-receipt">✓✓</span></div>
              <span className="chat-time">10:00</span>
            </div>
            {/* Mentee message right */}
            <div className="chat-message mentee right">
              <span className="chat-avatar">🧑‍💻</span>
              <div className="chat-bubble">Thank you, mentor! <span className="chat-read-receipt">✓✓</span></div>
              <span className="chat-time">10:01</span>
            </div>
            <div className="chat-typing-indicator">Mentor is typing...</div>
          </div>
          <div className="chat-input-row">
            <input type="text" className="chat-input" placeholder="Type your message..." />
            <input type="file" className="chat-file-input" title="Attach file" />
            <button className="chat-send-btn">Send</button>
          </div>
        </div>
      </section>

      {/* Saved Notes Section */}
      <section className="mentor-section mentor-notes-section">
        <h2>Saved Notes</h2>
        <div className="notes-ui">
          <div className="notes-create">
            <input 
              className="notes-input" 
              placeholder="Note title (optional)..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
            />
            <textarea 
              className="notes-input" 
              placeholder="Write a note about your learning..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            ></textarea>
            <input 
              className="notes-input" 
              placeholder="Tags (comma-separated)..."
              value={newNoteTags}
              onChange={(e) => setNewNoteTags(e.target.value)}
              style={{ marginTop: '0.5rem', padding: '0.5rem', width: '100%' }}
            />
            <button 
              className="notes-save-btn"
              onClick={handleSaveNote}
              disabled={savingNote || !newNoteContent.trim()}
            >
              {savingNote ? 'Saving...' : 'Save Note'}
            </button>
          </div>
          <div className="notes-list">
            {notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                No notes yet. Create your first note above!
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.note_id} className="note-item" style={{
                  background: '#1a2333',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: note.is_pinned ? '2px solid #4f8cff' : '1px solid #2e3a5e'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    {note.title && (
                      <h4 style={{ color: '#c7d0e6', margin: 0 }}>{note.title}</h4>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleUpdateNote(note.note_id, note.is_pinned)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                        title={note.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        {note.is_pinned ? '📌' : '📍'}
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.note_id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          color: '#ef4444'
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p style={{ color: '#8b93ab', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {note.tags.map((tag, idx) => (
                        <span key={idx} style={{
                          background: '#2e3a5e',
                          color: '#4f8cff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Short Notes Section */}
      <section className="mentor-section mentor-shortnotes-section">
        <h2>Short Notes</h2>
        <div className="shortnotes-ui">
          <div className="shortnotes-create">
            <input className="shortnote-input" placeholder="Add a short note..." />
            <select className="shortnote-emoji">
              <option>👍</option>
              <option>😃</option>
              <option>🔥</option>
              <option>🚀</option>
              <option>🎯</option>
            </select>
            <button className="shortnote-save-btn">Save</button>
          </div>
          <div className="shortnote-card pinned">
            <span className="shortnote-pin">📌</span>
            <span className="shortnote-content">Remember to check assignment feedback!</span>
            <span className="shortnote-reactions">👍 😃</span>
          </div>
          <div className="shortnote-card">
            <span className="shortnote-content">Book next session for Friday.</span>
            <span className="shortnote-reactions">🔥</span>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="mentor-section mentor-resources-section">
        <h2>Resources</h2>
        <div className="resources-ui">
          <div className="resource-list">
            <div className="resource-item">
              <span className="resource-filename">Session1-Notes.pdf</span>
              <button className="resource-download">Download</button>
              <span className="resource-category">#session1</span>
            </div>
            <div className="resource-item">
              <span className="resource-filename">BlackHole-Research.png</span>
              <button className="resource-download">Download</button>
              <span className="resource-category">#topic</span>
            </div>
          </div>
          <div className="resource-upload">
            <input type="file" />
            <button>Upload</button>
          </div>
        </div>
      </section>

      {/* Session History Section */}
      <section className="mentor-section mentor-history-section">
        <h2>Session History</h2>
        <div className="history-ui">
          <table className="history-table enhanced">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Title/Goal</th>
                <th>Notes</th>
                <th>Export</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-07-10</td>
                <td>1h</td>
                <td>Black Holes</td>
                <td><Button variant="ghost" size="small">View</Button></td>
                <td><Button variant="primary" size="small" icon={<span>📄</span>} iconPosition="left">PDF</Button></td>
              </tr>
              <tr>
                <td>2025-07-03</td>
                <td>45m</td>
                <td>Stellar Evolution</td>
                <td><Button variant="ghost" size="small">View</Button></td>
                <td><Button variant="primary" size="small" icon={<span>📄</span>} iconPosition="left">PDF</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="mentor-section mentor-feedback-section">
        <h2>Feedback</h2>
        <div className="feedback-ui">
          <div className="feedback-rating">
            <span>Rate this session:</span>
            {[1,2,3,4,5].map(star => (
              <span key={star} className="star">★</span>
            ))}
          </div>
          <textarea className="feedback-comment" placeholder="Leave a comment..." />
          <div className="feedback-options">
            <label><input type="checkbox" /> Anonymous</label>
            <span className="overall-rating">Overall Mentor Rating: 4.8 ★</span>
          </div>
        </div>
      </section>

      {/* Goal Tracker Section */}
      <section className="mentor-section mentor-goals-section">
        <h2>Goal Tracker</h2>
        <div className="goals-ui">
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
              No goals yet. Your mentor will create learning goals for you!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {goals.map((goal) => (
                <div key={goal.goal_id} style={{
                  background: '#1a2333',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '2px solid #4f8cff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#c7d0e6', margin: 0, marginBottom: '0.5rem' }}>
                        {goal.title}
                      </h4>
                      {goal.description && (
                        <p style={{ color: '#8b93ab', margin: 0, fontSize: '0.9rem' }}>
                          {goal.description}
                        </p>
                      )}
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: goal.status === 'completed' ? '#10b981' :
                                 goal.status === 'in_progress' ? '#f59e0b' :
                                 '#6b7280',
                      color: '#fff'
                    }}>
                      {goal.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#8b93ab', fontSize: '0.875rem' }}>Your Progress</span>
                      <span style={{ color: '#4f8cff', fontSize: '0.875rem', fontWeight: '600' }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#0d1321',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${goal.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #4f8cff 0%, #2563eb 100%)',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Progress Controls */}
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ color: '#8b93ab', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                      Update your progress:
                    </label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleUpdateGoalProgress(goal.goal_id, parseInt(e.target.value))}
                        style={{ 
                          flex: 1,
                          height: '6px',
                          accentColor: '#4f8cff'
                        }}
                      />
                      <span style={{ 
                        color: '#c7d0e6', 
                        fontSize: '0.875rem',
                        minWidth: '40px',
                        textAlign: 'right'
                      }}>
                        {goal.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div style={{ 
                      marginTop: '1rem',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Deadline: <strong>{new Date(goal.deadline).toLocaleDateString()}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mentor Profile Section */}
      <section className="mentor-section mentor-profile-section">
        <h2>Mentor Profile Preview</h2>
        <div className="profile-ui">
          <div className="profile-bio">
            <strong>Bio:</strong> Dr. Stella Orion is an expert in astrophysics, black holes, and cosmic phenomena. She has 15+ years of research and teaching experience.
          </div>
          <div className="profile-skills">
            <strong>Skills:</strong> Stellar Evolution, Black Holes, Exoplanets, Cosmology
          </div>
          <div className="profile-experience">
            <strong>Experience:</strong> Professor at Space Science Institute, Lead Researcher at Cosmic Lab
          </div>
          <div className="profile-education">
            <strong>Education:</strong> PhD in Astrophysics, MIT
          </div>
          <div className="profile-links">
            <strong>Links:</strong> <a href="https://linkedin.com/in/stellaorion" target="_blank" rel="noopener noreferrer">LinkedIn</a> | <a href="https://github.com/stellaorion" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className="profile-calendar">
            <strong>Upcoming Sessions:</strong>
            <ul>
              <li><a href="#" className="session-link">July 20, 2025 - 10:00 AM</a></li>
              <li><a href="#" className="session-link">July 22, 2025 - 2:00 PM</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="mentor-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="mentor-action-btn">Schedule Session</button>
        <button className="mentor-action-btn">End Mentorship</button>
        <button className="mentor-action-btn">Request Resume Review</button>
        <button className="mentor-action-btn">Upload Assignment for Feedback</button>
      </div>
    </div>
  );
};

export default MentorMenteeConnectionPage;
