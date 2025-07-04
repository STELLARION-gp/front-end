import React, { useState } from "react";
import { StarIcon, Heart } from "lucide-react";
import Button from "../Button";
import "../../styles/pages/learner/NasaImageModal.scss";

interface Comment {
  id: number;
  user: string;
  rating: number;
  text: string;
}

interface CelestialEventModalProps {
  open: boolean;
  onClose: () => void;
  event: {
    title: string;
    date: string;
    category: string;
    description: string;
    locations: string[];
  };
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "user">) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  // Optional className props for styling
  modalClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  closeClassName?: string;
  infoClassName?: string;
  detailsClassName?: string;
}

const CelestialEventModal: React.FC<CelestialEventModalProps> = ({ open, onClose, event, comments, onAddComment, isFavorite, onToggleFavorite, modalClassName = "nasa-image-modal-overlay", contentClassName = "nasa-image-modal", headerClassName = "", titleClassName = "nasa-image-modal__title", closeClassName = "nasa-image-modal__close", infoClassName = "nasa-image-modal__info", detailsClassName = "" }) => {
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
    <div className={modalClassName}>
      <div className={contentClassName}>
        <div className={headerClassName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, position: 'relative' }}>
          <h2 className={titleClassName} style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {event.title}
            <button
              className={`nasa-image-modal__icon-btn${isFavorite ? " fav" : ""}`}
              onClick={onToggleFavorite}
              title="Favorite"
              style={{ marginLeft: 12 }}
            >
              <Heart className="nasa-image-modal__icon" fill={isFavorite ? "#f43f5e" : "none"} />
            </button>
          </h2>
          <button className={closeClassName} onClick={onClose} style={{ marginLeft: 8 }}>&times;</button>
        </div>
        <div className={infoClassName}>
          <div className={detailsClassName}>
            <div className="nasa-image-modal__desc">{event.description}</div>
            <div className="nasa-image-modal__desc" style={{ color: '#fbbf24', marginBottom: 8 }}>{new Date(event.date).toLocaleString()}</div>
            <div className="nasa-image-modal__desc"><b>Category:</b> {event.category}</div>
            <div className="nasa-image-modal__desc"><b>Locations:</b> {event.locations.join(", ")}</div>
          </div>
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

export default CelestialEventModal;
