import '../../styles/pages/learner/MentorMenteeConnectionPage.scss';

import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';


const MentorMenteeConnectionPage: React.FC = () => {
  const navigate = useNavigate();
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
        <img className="mentor-header-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Mentor" />
        <div className="mentor-header-info">
          <span className="mentor-header-name">Dr. Stella Orion</span>
          <span className="mentor-header-expertise">Astrophysics & Space Science</span>
          <span className="mentor-header-status connected">Connected</span>
          <span className="mentor-header-last-active">Last active: 2 hours ago</span>
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
          <div className="notes-toolbar">
            <button className="notes-btn">Bold</button>
            <button className="notes-btn">Italic</button>
            <button className="notes-btn">#goal</button>
            <input className="notes-search" placeholder="Search notes..." />
          </div>
          <div className="notes-create">
            <textarea className="notes-input" placeholder="Write a new note..."></textarea>
            <button className="notes-save-btn">Save Note</button>
          </div>
          <div className="notes-list">
            <div className="note-card">
              <div className="note-tags">#goal #session1</div>
              <div className="note-content">Finish reading chapter 3 and summarize key points.</div>
              <div className="note-actions">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
            <div className="note-card">
              <div className="note-tags">#question</div>
              <div className="note-content">Ask about black hole formation next session.</div>
              <div className="note-actions">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
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
          <div className="goal-card">
            <div className="goal-title">Complete Chapter 4</div>
            <div className="goal-status">In Progress</div>
            <div className="goal-deadline">Deadline: 2025-07-25</div>
            <div className="goal-progress-bar">
              <div className="goal-progress" style={{width: '60%'}}></div>
            </div>
            <div className="goal-notes">Review notes and ask questions next session.</div>
            <div className="goal-actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
          <div className="goal-card">
            <div className="goal-title">Submit Assignment</div>
            <div className="goal-status">Not Started</div>
            <div className="goal-deadline">Deadline: 2025-07-30</div>
            <div className="goal-progress-bar">
              <div className="goal-progress" style={{width: '0%'}}></div>
            </div>
            <div className="goal-notes">Draft assignment and upload for review.</div>
            <div className="goal-actions">
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
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
