import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/pages/learner/BlogPage.scss";
import Button from "../../components/Button";
import { ArrowDownTrayIcon, HeartIcon } from "@heroicons/react/24/outline";

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

const sampleComments = [
  {
    id: 1,
    author: "Stella Observer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "2025-06-21",
    rating: 5,
    text: "Amazing article! The Orion Nebula is truly fascinating.",
  },
  {
    id: 2,
    author: "Cosmo Reader",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "2025-06-21",
    rating: 4,
    text: "Great insights, thanks for sharing!",
  },
];

const BlogDetailedPage: React.FC<BlogDetailedPageProps> = ({ blog }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState(sampleComments);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDownload = () => {
    // Logic for downloading the blog post
    console.log("Download blog post");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        author: "You",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        date: new Date().toISOString().slice(0, 10),
        rating,
        text: comment,
      },
    ]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setComment("");
    setRating(0);
    setHovered(0);
  };

  return (
    <div className="blog-page">
      <header className="blog-header">
        <Button onClick={() => navigate(-1)}>
          &#8592; Back
        </Button>
        <h1  style={{ marginTop: "1rem" }} className="blog-title">{blog.title}</h1>
        <div className="blog-header-row">
          <div className="blog-meta">
            <span className="blog-author">
              <img
                src="https://www.shutterstock.com/image-vector/vector-colorful-gray-scientist-professor-260nw-279473522.jpg"
                alt="Author profile"
                className="blog-author-avatar"
              />
              <Link
                to={`/dashboard/author/${encodeURIComponent(blog.author)}`}
                className="blog-author-link"
              >
                {blog.author}
              </Link>
            </span>
            <span className="blog-date">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="blog-header-actions">
            <button
              className="blog-header-icon"
              onClick={handleDownload}
              title="Download blog"
            >
              <ArrowDownTrayIcon className="icon-svg" />
            </button>
            <button
              className={`blog-header-icon${
                isFavorite ? " favourite" : ""
              }`}
              onClick={() => setIsFavorite((fav) => !fav)}
              title="Add to favourites"
            >
              <HeartIcon className="icon-svg" />
            </button>
          </div>
        </div>
      </header>
      <img src={blog.image} alt={blog.title} className="blog-image" />
      <article className="blog-content">{blog.content}</article>
      <section className="blog-comments-section">
        <h3>Comments</h3>
        <div className="blog-comments-list">
          {comments.map((c) => (
            <div className="blog-comment" key={c.id}>
              <img
                src={c.avatar}
                alt={c.author}
                className="blog-comment-avatar"
              />
              <div className="blog-comment-body">
                <div className="blog-comment-meta">
                  <span className="blog-comment-author">{c.author}</span>
                  <span className="blog-comment-date">
                    {new Date(c.date).toLocaleDateString()}
                  </span>
                  <span className="blog-comment-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < c.rating ? "blogstar" : "blogstar empty"
                        }>&#9733;</span>
                    ))}
                  </span>
                </div>
                <div className="blog-comment-text">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
        <h3 style={{ marginTop: "2rem" }}>Leave a Comment</h3>
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
                className={`blograting-star ${
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
          <Button type="submit">
            {submitted ? "Submitted!" : "Submit"}
          </Button>
        </form>
      </section>
    </div>
  );
};

export default BlogDetailedPage;
