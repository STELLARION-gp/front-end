import React, { useState } from "react";
import "../../styles/pages/learner/BlogPage.scss";

interface Blog {
  title: string;
  author: string;
  createdAt: string;
  image: string;
  content: string;
}

interface BlogDetailedPageProps {
  blog: Blog;
}

const BlogDetailedPage: React.FC<BlogDetailedPageProps> = ({ blog }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment/rating submission logic here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setComment("");
    setRating(0);
    setHovered(0);
  };

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1 className="blog-title">{blog.title}</h1>
        <div className="blog-meta">
          <span className="blog-author">{blog.author}</span>
          <span className="blog-date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>
      <img src={blog.image} alt={blog.title} className="blog-image" />
      <article className="blog-content">{blog.content}</article>
      <section className="blog-comments-section">
        <h3>Leave a Comment</h3>
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            className="comment-textarea"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`rating-star ${
                  (hovered || rating) >= star ? "selected" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                role="button"
                aria-label={`Rate ${star} star${
                  star > 1 ? "s" : ""
                }`}
                tabIndex={0}
              >
                &#9733;
              </span>
            ))}
            <span
              style={{
                marginLeft: 8,
                color: "#fbbf24",
                fontWeight: 600,
              }}
            >
              {rating > 0 ? rating : null}
            </span>
          </div>
          <button className="submit-btn" type="submit">
            {submitted ? "Submitted!" : "Submit"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default BlogDetailedPage;
