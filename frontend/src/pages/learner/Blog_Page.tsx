import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/pages/learner/BlogPage.scss";
import Button from "../../components/Button";
import { ArrowDownTrayIcon, HeartIcon } from "@heroicons/react/24/outline";
import { blogService, type BlogComment } from "../../services/blogService";

interface Blog {
  id?: number;
  title: string;
  author?: string;
  createdAt?: string;
  image?: string;
  content?: string;
}

interface BlogDetailedPageProps {
  blog: Blog;
  comments?: BlogComment[];
}

const BlogDetailedPage: React.FC<BlogDetailedPageProps> = ({ blog, comments: initialComments = [] }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleDownload = () => {
    console.log("Download blog post");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog?.id) return;

    try {
      const createReq = { content: comment } as any;
      const resp: any = await blogService.addBlogComment(blog.id, createReq);
      // Try to extract created comment
      const created = resp?.data || resp?.comment || resp;
      setComments(prev => [...prev, created]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setComment("");
      setRating(0);
      setHovered(0);
    } catch (err) {
      console.error('Failed to submit comment', err);
      // fallback: append locally
      setComments(prev => [...prev, {
        id: prev.length + 1,
        blog_id: blog.id as number,
        user_id: 0,
        content: comment,
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_display_name: 'You'
      } as BlogComment]);
      setComment("");
    }
  };

  // compute author avatar with sensible fallbacks
  const authorName = String((blog as any).author || (blog as any).author_display_name || '');
  const authorAvatar =
    (blog as any).author_avatar ||
    (blog as any).author_image ||
    (blog as any).author_profile_image ||
    (blog as any).metadata?.author_avatar ||
    // fallback to ui-avatars service which generates an initials avatar
    (authorName && `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=333&color=fff&rounded=true&size=128`) ||
    'https://www.gravatar.com/avatar/?d=mp';

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
                src={authorAvatar}
                alt="Author profile"
                className="blog-author-avatar"
              />
              <Link
                to={`/dashboard/author/${encodeURIComponent(String(blog.author || ''))}`}
                className="blog-author-link"
              >
                {blog.author || 'Unknown'}
              </Link>
            </span>
            <span className="blog-date">
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
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
      {blog.image && <img src={blog.image} alt={blog.title} className="blog-image" />}
      <article className="blog-content">{blog.content}</article>
      <section className="blog-comments-section">
        <h3>Comments</h3>
        <div className="blog-comments-list">
          {comments.map((c) => (
            <div className="blog-comment" key={c.id}>
              <img
                src={(c as any).avatar || 'https://www.gravatar.com/avatar/?d=mp'}
                alt={(c as any).user_display_name || (c as any).user_name || 'Commenter'}
                className="blog-comment-avatar"
              />
              <div className="blog-comment-body">
                <div className="blog-comment-meta">
                  <span className="blog-comment-author">{(c as any).user_display_name || (c as any).user_name || 'Anonymous'}</span>
                  <span className="blog-comment-date">
                    {new Date((c as any).created_at || (c as any).createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="blog-comment-text">{(c as any).content || (c as any).text}</div>
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
