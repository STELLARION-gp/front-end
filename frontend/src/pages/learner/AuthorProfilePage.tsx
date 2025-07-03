import React, { useState } from "react";
import "../../styles/pages/learner/AuthorProfilePage.scss";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { GlobeAltIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "lucide-react";

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
                onClick={() => {}}
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
            {author.reviews.map(review => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfilePage;
