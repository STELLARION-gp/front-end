import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { recordedSessions } from "../../components/Learner/recordedSessionsData";
import "../../styles/pages/learner/RecordedSessionPage.scss";
import Button from "../../components/Button";

const sampleComments = [
  {
    id: "1",
    author: "Ayesha Perera",
    authorPic: "https://ui-avatars.com/api/?name=Ayesha+Perera&background=3b82f6&color=fff",
    date: "2024-06-01",
    text: "This session was super insightful and well explained!"
  },
  {
    id: "2",
    author: "Kasun Silva",
    authorPic: "https://ui-avatars.com/api/?name=Kasun+Silva&background=3b82f6&color=fff",
    date: "2024-06-02",
    text: "Loved the visuals and the instructor's teaching style."
  }
];

const RecordedSessionPage: React.FC = () => {
  const { id } = useParams();
  const session = recordedSessions.find(s => s.id === id);

  const [comments, setComments] = useState(sampleComments);
  const [commentInput, setCommentInput] = useState("");

  if (!session) {
    return <div style={{ color: "#f87171", padding: "2rem" }}>Session not found.</div>;
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          author: "You",
          authorPic: "https://ui-avatars.com/api/?name=You&background=3b82f6&color=fff",
          date: new Date().toISOString(),
          text: commentInput
        }
      ]);
      setCommentInput("");
    }
  };

  return (
    <div className="recorded-session-page">
      <div className="rsp-main">
        <div className="rsp-media">
          <img src={session.image} alt={session.title} className="rsp-image" />
        </div>
        <div className="rsp-details">
          <h1 className="rsp-title">{session.title}</h1>
          <div className="rsp-meta">
            <span className="rsp-instructor">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.instructor)}&background=3b82f6&color=fff`}
                alt={session.instructor}
                className="rsp-instructor-pic"
              />
              by {session.instructor}
            </span>
            <span className="rsp-category">{session.category}</span>
            <span className="rsp-difficulty">{session.difficulty}</span>
            <span className="rsp-date">{session.date}</span>
            <span className="rsp-duration">{session.duration}</span>
          </div>
          <div className="rsp-rating">
            <span className="rsp-rating-label">Rating:</span>
            <span className="rsp-rating-value">{session.rating.toFixed(1)} / 5</span>
            <span className="rsp-rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < Math.round(session.rating) ? "#fbbf24" : "#334155",
                    fontSize: "1.2rem",
                    marginRight: 2
                  }}
                >
                  ★
                </span>
              ))}
            </span>
          </div>
          <div className="rsp-description">{session.description}</div>
          <div className="rsp-price-row">
            <span className="rsp-price">{session.price}</span>
            <button className="rsp-pay-btn">Pay Now</button>
          </div>
        </div>
      </div>
      <div className="rsp-comments-section">
        <h2>Comments</h2>
        <div className="rsp-comments-list">
          {comments.length === 0 && (
            <div className="rsp-no-comments">No comments yet.</div>
          )}
          {comments.map(comment => (
            <div className="rsp-comment" key={comment.id}>
              <img
                src={comment.authorPic}
                alt={comment.author}
                className="rsp-comment-avatar"
              />
              <div>
                <div className="rsp-comment-author">{comment.author}</div>
                <div className="rsp-comment-date">
                  {new Date(comment.date).toLocaleDateString()}
                </div>
                <div className="rsp-comment-text">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form className="rsp-comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            className="rsp-comment-input"
          />
          <Button type="submit">
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RecordedSessionPage;