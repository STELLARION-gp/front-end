import { useNavigate } from "react-router-dom";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import "../../styles/pages/learner/blog_explore.scss"
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { blogs, totalBlogs, avgRating, latestDate } from "./blogData";
import React from "react";

const BlogExplore: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState({
    author: '',
    minRating: '',
    search: ''
  });
  const filteredBlogs = blogs.filter(blog => {
    if (filter.author && blog.author !== filter.author) return false;
    if (filter.minRating && blog.rating < Number(filter.minRating)) return false;
    if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
  const uniqueAuthors = Array.from(new Set(blogs.map(b => b.author)));
  return (
    <div className="blog-explore-page">
      <div className="blog-explore-head-cards">
        <div className="blog-stat-card">
          <BookOpenIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{totalBlogs}</div>
            <div className="blog-stat-label">Total Blogs</div>
          </div>
        </div>
        <div className="blog-stat-card">
          <UserGroupIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{uniqueAuthors.length}</div>
            <div className="blog-stat-label">Unique Authors</div>
          </div>
        </div>
        <div className="blog-stat-card">
          <StarIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{avgRating}</div>
            <div className="blog-stat-label">Average Rating</div>
          </div>
          </div>
        <div className="blog-stat-card">
          <CalendarDaysIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{latestDate}</div>
            <div className="blog-stat-label">Latest Blog</div>
          </div>
        </div>
      </div>
      {/* Blog Filters */}
      <div className="blog-filters" style={{ display: 'flex', gap: 16, margin: '1.2rem 0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search title or content..."
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 180 }}
        />
        <select
          value={filter.author}
          onChange={e => setFilter(f => ({ ...f, author: e.target.value }))}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 140 }}
        >
          <option value="">All Authors</option>
          {uniqueAuthors.map(author => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
        <select
          value={filter.minRating}
          onChange={e => setFilter(f => ({ ...f, minRating: e.target.value }))}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 120 }}
        >
          <option value="">Any Rating</option>
          {[5,4,3,2,1].map(r => (
            <option key={r} value={r}>{r}+</option>
          ))}
        </select>
      </div>
      <h2>Explore Astronomy Blogs</h2>
      <p>Discover the latest insights and discoveries in the field of astronomy.</p>
      <div className="blog-list">
        {filteredBlogs.map(blog => (
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
    </div>
  );
}

export default BlogExplore;