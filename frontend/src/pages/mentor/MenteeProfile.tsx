// pages/mentor/MenteeProfile.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReceivedApplications, type MenteeApplication } from '../../services/menteeApplicationApi';
import {
  getConnectionDetails,
  getNotes,
  saveNote,
  updateNote,
  deleteNote,
  getGoals,
  createGoal,
  updateGoal,
  endConnection,
  getSessions,
  createSession,
  type Note,
  type Goal
} from '../../services/mentorMenteeConnectionApi';
import {
  mentorMenteeChatService,
  type MentorMenteeMessage
} from '../../services/mentorMenteeChatApi';
import Button from '../../components/Button';
import '../../styles/pages/mentor/MenteeProfileModern.scss';


const MenteeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentee, setMentee] = useState<MenteeApplication | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [savingGoal, setSavingGoal] = useState(false);
  
  const [endingConnection, setEndingConnection] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [copiedSessionId, setCopiedSessionId] = useState<number | null>(null);
  const [resources, setResources] = useState<any[]>([]);

  // Chat state
  const [messages, setMessages] = useState<MentorMenteeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMenteeProfile();
  }, [id]);

  const fetchMenteeProfile = async () => {
    try {
      setLoading(true);
      const applications = await getReceivedApplications();
      const foundMentee = applications.find(
        app => app.application_id === parseInt(id || '0') && app.application_status === 'accepted'
      );
      
      if (foundMentee) {
        setMentee(foundMentee);
        // Fetch connection details, notes, and goals
        await Promise.all([
          fetchConnectionDetails(foundMentee.application_id),
          fetchNotes(foundMentee.application_id),
          fetchGoals(foundMentee.application_id)
          // sessions
        ]);
        // fetch sessions separately so we can handle errors without blocking other loads
        fetchSessions(foundMentee.application_id);
        // load resources from localStorage
        setResources(loadResources(foundMentee.application_id));
      } else {
        setError('Mentee not found or not connected.');
      }
    } catch (err: any) {
      console.error('Error fetching mentee:', err);
      setError(err.response?.data?.error || 'Failed to load mentee profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (applicationId: number) => {
    try {
      const data = await getSessions(applicationId);
      setSessions(data || []);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
    }
  };

  // resources localStorage helpers (per application)
  const resourcesKey = (applicationId: number) => `mm_resources:${applicationId}`;
  const loadResources = (applicationId: number) => {
    try {
      const raw = localStorage.getItem(resourcesKey(applicationId));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load resources from localStorage', e);
      return [];
    }
  };

  const saveResources = (applicationId: number, items: any[]) => {
    try {
      localStorage.setItem(resourcesKey(applicationId), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save resources to localStorage', e);
    }
  };

  const handleResourceUpload = async (files: FileList | null) => {
    if (!mentee || !files || files.length === 0) return;
    const applicationId = mentee.application_id;
    const newItems: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });

      newItems.push({
        id: Date.now() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl,
        uploaded_at: new Date().toISOString()
      });
    }

    const current = loadResources(applicationId);
    const updated = [...newItems, ...current];
    saveResources(applicationId, updated);
    setResources(updated);
  };

  const handleResourceDelete = (resourceId: number) => {
    if (!mentee) return;
    const applicationId = mentee.application_id;
    const current = loadResources(applicationId).filter((r: any) => r.id !== resourceId);
    saveResources(applicationId, current);
    setResources(current);
  };

  const handleResourceOpen = (dataUrl: string, name?: string) => {
    const win = window.open();
    if (!win) return;
    win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;"></iframe>`);
    win.document.title = name || 'Resource';
  };

  const extractMeetingLink = (text?: string | null) => {
    if (!text) return null;
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('meeting_link:')) {
        return trimmed.substring('meeting_link:'.length).trim();
      }
    }
    // fallback: find first http(s) URL
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    return urlMatch ? urlMatch[0] : null;
  };

  const fetchConnectionDetails = async (applicationId: number) => {
    try {
      const data = await getConnectionDetails(applicationId);
      // Connection details fetched successfully (auto-creates if needed for accepted applications)
      const connId = data?.connection?.connection_id || data?.connection?.id;
      if (connId) {
        console.log('✅ Connection found:', connId);
        setConnectionId(connId);
      } else {
        console.warn('❌ No connection created for application:', applicationId, 'Response:', data);
        setConnectionId(null);
      }
    } catch (err: any) {
      console.error('Error fetching connection:', err);
      setConnectionId(null);
    }
  };

  const fetchNotes = async (applicationId: number) => {
    try {
      const notesData = await getNotes(applicationId);
      setNotes(notesData);
    } catch (err: any) {
      console.error('Error fetching notes:', err);
    }
  };

  const fetchGoals = async (applicationId: number) => {
    try {
      const goalsData = await getGoals(applicationId);
      setGoals(goalsData);
    } catch (err: any) {
      console.error('Error fetching goals:', err);
    }
  };

  const handleSaveNote = async () => {
    if (!newNoteContent.trim() || !mentee) return;
    
    setSavingNote(true);
    try {
      const tags = newNoteTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await saveNote(mentee.application_id, {
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
      await fetchNotes(mentee.application_id);
    } catch (err: any) {
      console.error('Error saving note:', err);
      alert(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleUpdateNote = async (noteId: number, isPinned: boolean) => {
    if (!mentee) return;
    
    try {
      await updateNote(noteId, { isPinned: !isPinned });
      await fetchNotes(mentee.application_id);
    } catch (err: any) {
      console.error('Error updating note:', err);
      alert(err.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    if (!mentee) return;
    
    try {
      await deleteNote(noteId);
      await fetchNotes(mentee.application_id);
    } catch (err: any) {
      console.error('Error deleting note:', err);
      alert(err.message || 'Failed to delete note');
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim() || !mentee) return;
    
    setSavingGoal(true);
    try {
      await createGoal(mentee.application_id, {
        title: newGoalTitle,
        description: newGoalDescription,
        deadline: newGoalDeadline || undefined
      });
      
      // Clear form
      setNewGoalTitle('');
      setNewGoalDescription('');
      setNewGoalDeadline('');
      
      // Refresh goals
      await fetchGoals(mentee.application_id);
    } catch (err: any) {
      console.error('Error creating goal:', err);
      alert(err.message || 'Failed to create goal');
    } finally {
      setSavingGoal(false);
    }
  };

  const handleUpdateGoalProgress = async (goalId: number, newProgress: number) => {
    if (!mentee) return;
    
    try {
      const status = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in_progress' : 'not_started';
      await updateGoal(goalId, { 
        progress: newProgress,
        status
      });
      await fetchGoals(mentee.application_id);
    } catch (err: any) {
      console.error('Error updating goal:', err);
      alert(err.message || 'Failed to update goal');
    }
  };

  const handleEndConnection = async () => {
    if (!confirm('Are you sure you want to end this mentorship connection? This cannot be undone.')) return;
    if (!mentee) return;
    
    const reason = prompt('Please provide a reason for ending this connection (optional):');
    
    setEndingConnection(true);
    try {
      await endConnection(mentee.application_id, reason || undefined);
      alert('Mentorship connection ended successfully.');
      navigate('/dashboard/mentees');
    } catch (err: any) {
      console.error('Error ending connection:', err);
      alert(err.message || 'Failed to end connection');
    } finally {
      setEndingConnection(false);
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages function
  const loadMessages = useCallback(async (connId: number, isInitialLoad = false) => {
    try {
      // Only show loading state on initial load, not on polling refreshes
      if (isInitialLoad) {
        setLoadingMessages(true);
      }
      
      const result = await mentorMenteeChatService.getMessages(connId, { limit: 50 });
      setMessages(result.messages || []);
      
      // Mark messages as read
      await mentorMenteeChatService.markAsRead(connId);
      
      // Only scroll to bottom on initial load
      if (isInitialLoad) {
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      if (isInitialLoad) {
        setLoadingMessages(false);
      }
    }
  }, [scrollToBottom]);

  // Chat functionality - setup polling when connectionId is available
  useEffect(() => {
    if (!connectionId) {
      // No connection yet - wait for fetchConnectionDetails to complete
      return;
    }

    // Load initial messages (with loading state)
    loadMessages(connectionId, true);

    // Setup polling for new messages (every 5 seconds, without loading state)
    pollIntervalRef.current = setInterval(() => {
      loadMessages(connectionId, false);
    }, 5000);

    return () => {
      // Clear polling interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [connectionId, loadMessages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

    if (!connectionId) {
      // No connection available yet — inform the user
      alert('Cannot send message: no active mentorship connection was found.');
      return;
    }

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      await mentorMenteeChatService.sendMessage(connectionId, {
        content: messageContent,
        type: 'text'
      });

      // Reload messages immediately (without loading state to avoid flicker)
      await loadMessages(connectionId, false);
      
      // Scroll to bottom after sending message
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
      setNewMessage(messageContent); // Restore message
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="mentor-connection-page">
        <div style={{ textAlign: 'center', padding: '3rem', color: '#c7d0e6' }}>
          Loading mentee profile...
        </div>
      </div>
    );
  }

  if (error || !mentee) {
    return (
      <div className="mentor-connection-page">
        <Button
          variant="secondary"
          icon={<span style={{ fontSize: '1.2rem' }}>&larr;</span>}
          iconPosition="left"
          onClick={() => navigate('/dashboard/mentees')}
          size="medium"
        >
          Back to Mentees
        </Button>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#ef4444',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          ⚠️ {error || 'Mentee not found'}
        </div>
      </div>
    );
  }

  const learner = mentee.learner;
  const displayName = learner?.display_name || 
                     `${learner?.first_name || ''} ${learner?.last_name || ''}`.trim() || 
                     'Anonymous';

  return (
    <div className="mentor-connection-page">
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Button
          variant="secondary"
          icon={<span style={{ fontSize: '1.2rem' }}>&larr;</span>}
          iconPosition="left"
          onClick={() => navigate('/dashboard/mentees')}
          size="medium"
        >
          Back to Mentees
        </Button>
      </div>

      {/* Mentee Header */}
      <div className="mentor-header">
        <div className="mentor-header-avatar" style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4f8cff 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#fff',
          border: '3px solid #2e3a5e'
        }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="mentor-header-info">
          <span className="mentor-header-name">{displayName}</span>
          <span className="mentor-header-expertise">{learner?.email}</span>
          <span className="mentor-header-status connected">Connected</span>
          <span className="mentor-header-last-active">
            Connected: {new Date(mentee.reviewed_at || mentee.submitted_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Interest Statement Section */}
      {mentee.interest_statement && (
        <section className="mentor-section mentor-profile-section">
          <h2>Interest Statement</h2>
          <div className="profile-ui">
            <div className="profile-bio">
              {mentee.interest_statement}
            </div>
          </div>
        </section>
      )}

      {/* Documents Section */}
      {mentee.documents && Array.isArray(mentee.documents) && mentee.documents.length > 0 && (
        <section className="mentor-section mentor-resources-section">
          <h2>Submitted Documents</h2>
          <div className="resources-ui">
            <div className="resource-list">
              {mentee.documents.map((doc: any, idx) => (
                <div key={idx} className="resource-item">
                  <span className="resource-filename">📄 {doc.originalName || doc.fileName}</span>
                  {doc.webViewLink && (
                    <>
                      <a 
                        href={doc.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-download"
                      >
                        View
                      </a>
                      <a 
                        href={doc.webContentLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-download"
                      >
                        Download
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chat Section */}
      <section className="mentor-section mentor-chat-section">
        <h2>Chat with {displayName}</h2>
        <div className="chat-ui">
          <div className="chat-messages">
            {loadingMessages ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.is_own_message;
                const messageDate = new Date(msg.created_at);
                const timeString = messageDate.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: true 
                });

                return (
                  <div key={msg.message_id} className={`chat-message ${isOwn ? 'own-message right' : 'other-message left'}`}>
                    <span className="chat-avatar">
                      {msg.sender.avatarUrl ? (
                        <img src={msg.sender.avatarUrl} alt={msg.sender.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        isOwn ? '🧑‍🚀' : '🧑‍💻'
                      )}
                    </span>
                    <div className="chat-bubble">
                      {msg.message_text}
                      {msg.is_edited && <span style={{ fontSize: '0.7rem', color: '#8b93ab', marginLeft: '0.5rem' }}>(edited)</span>}
                      <span className="chat-read-receipt">{msg.is_read ? '✓✓' : '✓'}</span>
                    </div>
                    <span className="chat-time">{timeString}</span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-row">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
              disabled={sendingMessage}
            />
            <button 
              className="chat-send-btn" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
            >
              {sendingMessage ? 'Sending...' : 'Send'}
            </button>
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
              placeholder="Write a note about this mentee..."
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
            <Button 
              onClick={handleSaveNote}
              disabled={savingNote || !newNoteContent.trim()}
            >
              {savingNote ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
          <div className="notes-list">
            {notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                No notes yet. Start by creating one above.
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
                        {note.is_pinned ? '�' : '📍'}
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

      {/* Goal Tracker Section */}
      <section className="mentor-section mentor-goals-section">
        <h2>Goal Tracker</h2>
        <div className="goals-ui">
          {/* Create Goal Form */}
          <div style={{ 
            background: '#1a2333', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            border: '1px solid #2e3a5e'
          }}>
            <h3 style={{ color: '#c7d0e6', marginBottom: '1rem' }}>Add New Goal</h3>
            <input 
              placeholder="Goal title..."
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                marginBottom: '0.75rem',
                background: '#0d1321',
                border: '1px solid #2e3a5e',
                borderRadius: '6px',
                color: '#c7d0e6'
              }}
            />
            <textarea 
              placeholder="Goal description..."
              value={newGoalDescription}
              onChange={(e) => setNewGoalDescription(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                marginBottom: '0.75rem',
                background: '#0d1321',
                border: '1px solid #2e3a5e',
                borderRadius: '6px',
                color: '#c7d0e6',
                minHeight: '80px'
              }}
            />
            <div style={{ marginBottom: '0.75rem' }}>
              <input 
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                placeholder="Optional deadline"
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  background: '#0d1321',
                  border: '1px solid #2e3a5e',
                  borderRadius: '6px',
                  color: '#c7d0e6'
                }}
              />
            </div>
            <Button 
              variant="primary" 
              size="small"
              onClick={handleCreateGoal}
              disabled={savingGoal || !newGoalTitle.trim()}
            >
              {savingGoal ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>

          {/* Goals List */}
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
              No goals yet. Create one above to start tracking!
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
                      <span style={{ color: '#8b93ab', fontSize: '0.875rem' }}>Progress</span>
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
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    marginTop: '1rem',
                    alignItems: 'center'
                  }}>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => handleUpdateGoalProgress(goal.goal_id, parseInt(e.target.value))}
                      style={{ flex: 1 }}
                    />
                  </div>

                  {/* Deadline and Priority Info */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {goal.deadline && (
                      <span>
                        Deadline: <strong>{new Date(goal.deadline).toLocaleDateString()}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resources Section */}
      <section className="mentor-section mentor-resources-section">
        <h2>Resources</h2>
        <div className="resources-ui">
          <div className="resource-list">
            {resources.length === 0 ? (
              <div style={{ padding: '1rem', color: '#8b93ab' }}>No resources uploaded for this mentee yet.</div>
            ) : (
              resources.map((r) => (
                <div key={r.id} className="resource-item">
                  <span className="resource-filename">{r.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="resource-download" onClick={() => handleResourceOpen(r.dataUrl, r.name)}>Open</button>
                    <a href={r.dataUrl} download={r.name} className="resource-download">Download</a>
                    <button onClick={() => handleResourceDelete(r.id)} style={{ color: '#ef4444' }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="resource-upload">
            <input type="file" multiple onChange={(e) => handleResourceUpload(e.target.files)} />
            <button onClick={(e) => { const input = (e.currentTarget.previousElementSibling as HTMLInputElement); input && input.click(); }}>Upload</button>
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
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                    No sessions yet. Schedule your first session below!
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.session_id}>
                    <td>{new Date(s.session_date).toLocaleString()}</td>
                    <td>{s.duration} mins</td>
                    <td>{s.title}</td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{s.notes || s.description || '-'}</td>
                    <td>
                      {(() => {
                        const link = extractMeetingLink(s.notes || s.description || '');
                        if (!link) return '-';
                        return (
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(link);
                                setCopiedSessionId(s.session_id);
                                setTimeout(() => setCopiedSessionId(null), 2000);
                              } catch (err) {
                                console.error('Copy failed', err);
                                alert('Failed to copy link to clipboard');
                              }
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: copiedSessionId === s.session_id ? '#10b981' : '#2563eb',
                              color: '#fff',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedSessionId === s.session_id ? 'Copied!' : 'Copy Link'}
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="mentor-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  <Button variant="secondary" onClick={() => setShowScheduleModal(true)}>Schedule Session</Button>
        <Button 
          // className="mentor-action-btn"
          onClick={handleEndConnection}
          disabled={endingConnection}
          // style={{ 
          //   background: endingConnection ? '#6b7280' : '#ef4444',
          //   cursor: endingConnection ? 'not-allowed' : 'pointer'
          // }}
        >
          {endingConnection ? 'Ending...' : 'End Mentorship'}
        </Button>
        {/* <button className="mentor-action-btn">Send Message</button>
        <button className="mentor-action-btn">View Full Profile</button> */}
      </div>

      {/* Schedule Session Modal (simple inline modal) */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '520px', background: '#0b1320', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1f2a44' }}>
            <h3 style={{ marginTop: 0 }}>Schedule Session</h3>
            <input placeholder="Title" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
            <textarea placeholder="Description" value={sessionDescription} onChange={(e) => setSessionDescription(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', minHeight: '80px' }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="datetime-local" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} style={{ flex: 1, padding: '0.5rem' }} />
              <input type="number" value={sessionDuration} onChange={(e) => setSessionDuration(Number(e.target.value))} style={{ width: '120px', padding: '0.5rem' }} />
            </div>
            <input placeholder="Meeting link (optional)" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ padding: '0.5rem 0.75rem', background: '#1f2a44', borderRadius: '6px' }}>Cancel</button>
              <button onClick={async () => {
                if (!mentee) return;
                setScheduling(true);
                try {
                  await createSession(mentee.application_id, {
                    title: sessionTitle || 'Session',
                    description: sessionDescription || undefined,
                    session_date: new Date(sessionDate).toISOString(),
                    duration: sessionDuration,
                    meeting_link: meetingLink || undefined,
                    notes: sessionDescription || undefined
                  });
                  await fetchSessions(mentee.application_id);
                  setShowScheduleModal(false);
                  // clear fields
                  setSessionTitle(''); setSessionDescription(''); setSessionDate(''); setSessionDuration(60); setMeetingLink('');
                } catch (err: any) {
                  console.error('Error scheduling session:', err);
                  alert(err?.response?.data?.error || err.message || 'Failed to schedule session');
                } finally {
                  setScheduling(false);
                }
              }} style={{ padding: '0.5rem 0.75rem', background: '#2563eb', color: '#fff', borderRadius: '6px' }} disabled={scheduling || !sessionDate}>
                {scheduling ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeProfile;
