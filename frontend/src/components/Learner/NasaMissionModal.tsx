import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import Button from "../Button";
import "../../styles/pages/learner/NasaImageModal.scss";

interface Comment {
  id: number;
  user: string;
  rating: number;
  text: string;
}

interface NasaMissionModalProps {
  open: boolean;
  onClose: () => void;
  mission: { name: string; image: string; description: string; years: string };
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "user">) => void;
}

const NasaMissionModal: React.FC<NasaMissionModalProps> = ({ open, onClose, mission, comments, onAddComment }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) {
      setError("Please provide a comment and rating.");
      return;
    }
    onAddComment({ rating, text: comment });
    setComment("");
    setRating(0);
    setError("");
  };

  return (
    <div className="nasa-image-modal-overlay">
      <div className="nasa-image-modal nasa-mission-modal-vertical">
        <button className="nasa-image-modal__close" onClick={onClose}>&times;</button>
        <div className="nasa-mission-modal__img-section">
          <img src={mission.image} alt={mission.name} className="nasa-image-modal__img" />
        </div>
        <div className="nasa-mission-modal__info">
          <h2 className="nasa-image-modal__title">{mission.name}</h2>
          <div className="nasa-image-modal__desc">{mission.description}</div>
          <div className="nasa-image-modal__desc" style={{ color: '#fbbf24', marginBottom: 8 }}>{mission.years}</div>
          <div className="nasa-image-modal__comments-section">
            <h3>Comments & Ratings</h3>
            <form className="nasa-image-modal__comment-form" onSubmit={handleSubmit}>
              <div className="nasa-image-modal__rating-input">
                {[1,2,3,4,5].map(i => (
                  <StarIcon key={i} className={i <= rating ? "comment-star filled" : "comment-star"} style={{cursor: 'pointer', color: i <= rating ? '#fbbf24' : '#a1a1aa'}} onClick={() => setRating(i)} />
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={2}
                className="nasa-image-modal__comment-input"
              />
              <Button type="submit" className="nasa-image-modal__submit-btn" variant="primary" size="small">
                Submit
              </Button>
              {error && <div className="nasa-image-modal__error">{error}</div>}
            </form>
            <div className="nasa-image-modal__comments-list">
              {comments.length === 0 && <div className="nasa-image-modal__no-comments">No comments yet.</div>}
              {comments.map(c => (
                <div key={c.id} className="nasa-image-modal__comment-item">
                  <div className="nasa-image-modal__comment-header">
                    <span className="nasa-image-modal__comment-user">{c.user}</span>
                    <span className="nasa-image-modal__comment-rating">
                      {[1,2,3,4,5].map(i => (
                        <StarIcon key={i} className={i <= c.rating ? "comment-star filled" : "comment-star"} style={{color: i <= c.rating ? '#fbbf24' : '#a1a1aa'}} />
                      ))}
                    </span>
                  </div>
                  <div className="nasa-image-modal__comment-text">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NasaMissionModal;
