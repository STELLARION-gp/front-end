import '../../styles/pages/learner/MentorMenteeConnectionPage.scss';

import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getConnectionDetails, 
  getNotes,
  updateNote,
  deleteNote,
  getGoals,
  getSessions,
  updateGoal,
  type Note,
  type Goal
} from '../../services/mentorMenteeConnectionApi';
import { type MenteeApplication } from '../../services/menteeApplicationApi';
import {
  mentorMenteeChatService,
  type MentorMenteeMessage
} from '../../services/mentorMenteeChatApi';

const MentorMenteeConnectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [application, setApplication] = useState<MenteeApplication | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [copiedSessionId, setCopiedSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [shortNotes, setShortNotes] = useState<any[]>([]);
  const [shortNoteText, setShortNoteText] = useState('');
  const [shortNoteEmoji, setShortNoteEmoji] = useState('👍');
  const [editingShortNoteId, setEditingShortNoteId] = useState<number | null>(null);
  const [editingShortNoteText, setEditingShortNoteText] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<MentorMenteeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Note form states
  // Learner view: note creation is managed by the mentor; learners can view/pin/delete notes

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
        
        // Set connection ID if available (for chat functionality)
        const connId = connectionData?.connection?.connection_id || connectionData?.connection?.id;
        if (connId) {
          console.log('✅ Connection found:', connId);
          setConnectionId(connId);
        } else {
          console.warn('❌ No connection available for application:', id, 'Response:', connectionData);
          setConnectionId(null);
        }
        
        setNotes(notesData);
        setGoals(goalsData);
    // fetch sessions separately
    fetchSessions(parseInt(id));
    // load local resources
    setResources(loadResources(parseInt(id)));
    // load short notes
    setShortNotes(loadShortNotes(parseInt(id)));
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

  const fetchSessions = async (applicationId: number) => {
    try {
      const data = await getSessions(applicationId);
      setSessions(data || []);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
    }
  };

  // LocalStorage-based resource helpers (per application)
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
    if (!id || !files || files.length === 0) return;
    const applicationId = parseInt(id);
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
    if (!id) return;
    const applicationId = parseInt(id);
    const current = loadResources(applicationId).filter((r: any) => r.id !== resourceId);
    saveResources(applicationId, current);
    setResources(current);
  };

  const handleResourceOpen = (dataUrl: string, name?: string) => {
    // open data url in new tab; for large files browser will handle
    const win = window.open();
    if (!win) return;
    win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;"></iframe>`);
    win.document.title = name || 'Resource';
  };

  // Short-notes localStorage helpers (per application)
  const shortNotesKey = (applicationId: number) => `mm_shortnotes:${applicationId}`;

  const loadShortNotes = (applicationId: number) => {
    try {
      const raw = localStorage.getItem(shortNotesKey(applicationId));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load short notes', e);
      return [];
    }
  };

  const saveShortNotes = (applicationId: number, items: any[]) => {
    try {
      localStorage.setItem(shortNotesKey(applicationId), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save short notes', e);
    }
  };

  const handleAddShortNote = () => {
    if (!id || !shortNoteText.trim()) return;
    const applicationId = parseInt(id);
    const item = {
      id: Date.now(),
      text: shortNoteText.trim(),
      emoji: shortNoteEmoji,
      pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updated = [item, ...loadShortNotes(applicationId)];
    saveShortNotes(applicationId, updated);
    setShortNotes(updated);
    setShortNoteText('');
  };

  const handleStartEditShortNote = (note: any) => {
    setEditingShortNoteId(note.id);
    setEditingShortNoteText(note.text);
  };

  const handleSaveEditShortNote = () => {
    if (!id || editingShortNoteId === null) return;
    const applicationId = parseInt(id);
    const items = loadShortNotes(applicationId).map((n: any) => n.id === editingShortNoteId ? { ...n, text: editingShortNoteText, updated_at: new Date().toISOString() } : n);
    saveShortNotes(applicationId, items);
    setShortNotes(items);
    setEditingShortNoteId(null);
    setEditingShortNoteText('');
  };

  const handleDeleteShortNote = (noteId: number) => {
    if (!id) return;
    const applicationId = parseInt(id);
    const items = loadShortNotes(applicationId).filter((n: any) => n.id !== noteId);
    saveShortNotes(applicationId, items);
    setShortNotes(items);
  };

  const togglePinShortNote = (noteId: number) => {
    if (!id) return;
    const applicationId = parseInt(id);
    const items = loadShortNotes(applicationId).map((n: any) => n.id === noteId ? { ...n, pinned: !n.pinned } : n);
    saveShortNotes(applicationId, items);
    setShortNotes(items);
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
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    return urlMatch ? urlMatch[0] : null;
  };

  // Note handlers (view/pin/delete handled below)

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
      // No connection yet - wait for connection data to load
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
                        isOwn ? '🧑‍💻' : '🧑‍🚀'
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
            <input className="shortnote-input" placeholder="Add a short note..." value={shortNoteText} onChange={(e) => setShortNoteText(e.target.value)} />
            <select className="shortnote-emoji" value={shortNoteEmoji} onChange={(e) => setShortNoteEmoji(e.target.value)}>
              <option>👍</option>
              <option>😃</option>
              <option>🔥</option>
              <option>🚀</option>
              <option>🎯</option>
            </select>
            <button className="shortnote-save-btn" onClick={handleAddShortNote}>Save</button>
          </div>
          {shortNotes.length === 0 ? (
            <div style={{ padding: '1rem', color: '#8b93ab' }}>No short notes yet.</div>
          ) : (
            shortNotes.map((n) => (
              <div key={n.id} className={`shortnote-card ${n.pinned ? 'pinned': ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="shortnote-pin" style={{ marginRight: '0.5rem' }} onClick={() => togglePinShortNote(n.id)}>{n.pinned ? '📌' : '📍'}</span>
                    <span className="shortnote-content">{n.text}</span>
                  </div>
                  <div>
                    <button className="shortnote-save-btn" onClick={() => handleStartEditShortNote(n)}>Edit</button>
                    <button className="shortnote-save-btn" onClick={() => handleDeleteShortNote(n.id)} style={{ marginLeft: '0.5rem', color: '#ef4444' }}>Delete</button>
                  </div>
                </div>
                {editingShortNoteId === n.id && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input value={editingShortNoteText} onChange={(e) => setEditingShortNoteText(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button onClick={handleSaveEditShortNote}>Save</button>
                      <button onClick={() => setEditingShortNoteId(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Resources Section */}
      <section className="mentor-section mentor-resources-section">
        <h2>Resources</h2>
        <div className="resources-ui">
          <div className="resource-list">
            {resources.length === 0 ? (
              <div style={{ padding: '1rem', color: '#8b93ab' }}>No resources uploaded for this connection yet.</div>
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
        <h2>Session</h2>
        <div className="history-ui">
          <table className="history-table enhanced">
            <thead>
              <tr>
                <th>Date</th>
                <th>Duration</th>
                <th>Title/Goal</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#8b93ab' }}>
                    No sessions scheduled yet.
                  </td>
                </tr>
              ) : (
                // Split upcoming and past: upcoming first (ascending), past below (descending)
                (() => {
                  const now = new Date();
                  const upcoming = sessions.filter(s => new Date(s.session_date) >= now).sort((a,b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
                  const past = sessions.filter(s => new Date(s.session_date) < now).sort((a,b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());
                  const rows: any[] = [];

                  if (upcoming.length > 0) {
                    rows.push(
                      <tr key="upcoming-header"><td colSpan={5} style={{ padding: '0.5rem 1rem', background: '#071025', color: '#9fb0ff', fontWeight: 600 }}>Upcoming Sessions</td></tr>
                    );

                    upcoming.forEach((s: any) => {
                      const link = extractMeetingLink(s.notes || s.description || '');
                      rows.push(
                        <tr key={s.session_id}>
                          <td>{new Date(s.session_date).toLocaleString()}</td>
                          <td>{s.duration ? `${s.duration} mins` : '-'}</td>
                          <td>{s.title || '-'}</td>
                          <td style={{ whiteSpace: 'pre-wrap' }}>{s.notes || s.description || '-'}</td>
                          <td>
                            {link ? (
                              <>
                                <Button variant="ghost" size="small" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopiedSessionId(s.session_id); setTimeout(() => setCopiedSessionId(null), 2000); } catch { alert('Failed to copy link'); } }}>
                                  {copiedSessionId === s.session_id ? 'Copied!' : 'Copy Link'}
                                </Button>
                                <Button variant="primary" size="small" onClick={() => window.open(link, '_blank')}>Open</Button>
                              </>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    });
                  }

                  if (past.length > 0) {
                    rows.push(
                      <tr key="past-header"><td colSpan={5} style={{ padding: '0.5rem 1rem', background: '#071025', color: '#9fb0ff', fontWeight: 600 }}>Past Sessions</td></tr>
                    );

                    past.forEach((s: any) => {
                      const link = extractMeetingLink(s.notes || s.description || '');
                      rows.push(
                        <tr key={s.session_id}>
                          <td>{new Date(s.session_date).toLocaleString()}</td>
                          <td>{s.duration ? `${s.duration} mins` : '-'}</td>
                          <td>{s.title || '-'}</td>
                          <td style={{ whiteSpace: 'pre-wrap' }}>{s.notes || s.description || '-'}</td>
                          <td>
                            {link ? (
                              <>
                                <Button variant="ghost" size="small" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopiedSessionId(s.session_id); setTimeout(() => setCopiedSessionId(null), 2000); } catch { alert('Failed to copy link'); } }}>
                                  {copiedSessionId === s.session_id ? 'Copied!' : 'Copy Link'}
                                </Button>
                                <Button variant="primary" size="small" onClick={() => window.open(link, '_blank')}>Open</Button>
                              </>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    });
                  }

                  return rows;
                })()
              )}
            </tbody>
          </table>
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

      {/* Mentor Profile Section
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
      </section> */}

      
    </div>
  );
};

export default MentorMenteeConnectionPage;
