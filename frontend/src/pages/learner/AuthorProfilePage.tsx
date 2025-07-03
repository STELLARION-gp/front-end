import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/learner/AuthorProfilePage.scss";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { GlobeAltIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "lucide-react";
import Button from "../../components/Button";

interface Blog {
  id: number;
  image: string;
  title: string;
  author: string;
  createdAt: string;
  rating: number;
  content: string;
}

interface Session {
  id: number;
  title: string;
  type: string;
  schedule: string;
}

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
}

interface AuthorProfile {
  name: string;
  bio: string;
  profilePic: string;
  blogs: Blog[];
  sessions: Session[];
  reviews: Review[];
  social?: { platform: string; url: string; icon?: React.ReactNode }[];
}

const AuthorProfilePage: React.FC<{ author: AuthorProfile }> = ({ author }) => {
  const [tab, setTab] = useState("blogs");
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(author.reviews);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        reviewer: "You (Learner)",
        rating,
        comment,
      },
    ]);
    setComment("");
    setRating(0);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="author-profile-page">
      <div className="author-info-card">
        <img src={author.profilePic} alt={author.name} className="author-profile-pic" />
        <div className="author-info-details">
          <h2 className="author-name">{author.name}</h2>
          <p className="author-bio">{author.bio}</p>
          {author.social && (
            <div className="author-socials">
              {author.social.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="author-social-icon">
                  {s.icon || <GlobeAltIcon />}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="author-tabs">
        <button className={tab === "blogs" ? "active" : ""} onClick={() => setTab("blogs")}>Blogs</button>
        <button className={tab === "sessions" ? "active" : ""} onClick={() => setTab("sessions")}>Sessions</button>
        <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>Reviews</button>
      </div>
      <div className="author-tab-content">
        {tab === "blogs" && (
          <div className="author-blogs-list">
            {author.blogs.map(blog => (
              <AstronomyBlogCard
                key={blog.id}
                image={blog.image}
                title={blog.title}
                author={blog.author}
                createdAt={blog.createdAt}
                rating={blog.rating}
                content={blog.content}
                onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
              />
            ))}
          </div>
        )}
        {tab === "sessions" && (
          <div className="author-sessions-list">
            {author.sessions.map(session => (
              <div className="author-session-card" key={session.id}>
                <VideoCameraIcon className="icon session" />
                <div>
                  <h4 className="author-session-title">{session.title}</h4>
                  <div className="author-session-meta">
                    <span className="author-session-type">{session.type}</span>
                    <span className="author-session-schedule">{session.schedule}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "reviews" && (
          <div className="author-reviews-list">
            {reviews.map(review => (
              <div className="author-review-card" key={review.id}>
                <div className="author-review-rating">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={i < review.rating ? "icon author-review-star filled" : "icon author-review-star"} />
                  ))}
                  <span className="author-reviewer">{review.reviewer}</span>
                </div>
                <div className="author-review-comment">{review.comment}</div>
              </div>
            ))}
            <form className="author-review-form" onSubmit={handleReviewSubmit} style={{marginTop: '1.5rem', background: '#232b3b', borderRadius: 10, padding: '1rem 1.2rem', boxShadow: '0 1px 4px rgba(37,99,235,0.06)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 8}}>
                <span style={{fontWeight: 600, color: '#60a5fa'}}>Your Rating:</span>
                {[1,2,3,4,5].map(i => (
                  <StarIcon
                    key={i}
                    className={i <= rating ? "icon author-review-star filled" : "icon author-review-star"}
                    style={{cursor: 'pointer', color: i <= rating ? '#fbbf24' : '#a1a1aa'}}
                    onClick={() => setRating(i)}
                  />
                ))}
              </div>
              <textarea
                className="author-review-input"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={3}
                style={{width: '100%', borderRadius: 6, border: '1px solid #334155', padding: 8, color: '#e5e7eb', background: '#1e293b', resize: 'vertical', marginBottom: 8}}
              />
              <Button
                type="submit"
                variant="primary"
                size="medium"
                className="author-review-submit-btn"
                disabled={rating === 0 || !comment.trim()}
              >
                Submit
              </Button>
              {success && <span style={{marginLeft: 16, color: '#22c55e', fontWeight: 500}}>Comment submitted!</span>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfilePage;
