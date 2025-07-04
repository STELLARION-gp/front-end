import React, { useState } from "react";
import { StarIcon, Download, Heart } from "lucide-react";
import "../../styles/pages/learner/NasaImageModal.scss";
import Button from "../Button";

interface Comment {
  id: number;
  user: string;
  rating: number;
  text: string;
}

interface NasaImageModalProps {
  open: boolean;
  onClose: () => void;
  image: { title: string; url: string; description: string };
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "user">) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const NasaImageModal: React.FC<NasaImageModalProps> = ({ open, onClose, image, comments, onAddComment, isFavorite, onToggleFavorite }) => {
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
      <div className="nasa-image-modal">
        <button className="nasa-image-modal__close" onClick={onClose}>&times;</button>
        <div className="nasa-image-modal__img-section">
          <img src={image.url} alt={image.title} className="nasa-image-modal__img" />
          <div className="nasa-image-modal__img-actions">
            <a href={image.url} download target="_blank" rel="noopener noreferrer" title="Download">
              <Download className="nasa-image-modal__icon" />
            </a>
            <button className={`nasa-image-modal__icon-btn${isFavorite ? " fav" : ""}`} onClick={onToggleFavorite} title="Favorite">
              <Heart className="nasa-image-modal__icon" fill={isFavorite ? "#f43f5e" : "none"} />
            </button>
          </div>
        </div>
        <div className="nasa-image-modal__info">
          <h2 className="nasa-image-modal__title">{image.title}</h2>
          <p className="nasa-image-modal__desc">{image.description}</p>
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

export default NasaImageModal;
