import { useNavigate } from "react-router-dom";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import "../../styles/pages/learner/blog_explore.scss"
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { blogService, type Blog } from "../../services/blogService";

const BlogExplore: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    author: '',
    minRating: '',
    search: ''
  });

  useEffect(() => {
    const loadPublishedBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await blogService.getBlogs({ 
          status: 'published', 
          limit: 50,
          sort_by: 'published_at',
          sort_order: 'desc'
        });
        
        if (response && response.success && response.data && response.data.blogs) {
          setBlogs(response.data.blogs as Blog[]);
        } else if (response && response.blogs) {
          setBlogs(response.blogs as Blog[]);
        } else {
          setBlogs([]);
        }
      } catch (err: any) {
        console.error('Failed to load published blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    loadPublishedBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const authorName = blog.author_display_name || blog.author_name || '';
    const content = blog.excerpt || (blog.content as unknown as string) || '';
    
    if (filter.author && authorName !== filter.author) return false;
    if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !content.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
  
  const uniqueAuthors = Array.from(new Set(blogs.map(b => b.author_display_name || b.author_name || 'Unknown')));
  
  // Calculate stats from loaded blogs
  const totalBlogs = blogs.length;
  const avgLikes = blogs.length > 0 ? (blogs.reduce((sum, b) => sum + b.like_count, 0) / blogs.length).toFixed(1) : '0';
  const latestDate = blogs.length > 0 && blogs[0].published_at 
    ? new Date(blogs[0].published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'N/A';

  if (loading) {
    return (
      <div className="blog-explore-page">
        <div className="loader" style={{ textAlign: 'center', padding: '2rem' }}>
          Loading published blogs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-explore-page">
        <div className="error" style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-explore-page">
      <h2>Explore Astronomy Blogs</h2>
      <p>Discover the latest insights and discoveries in the field of astronomy.</p>
      <div className="blog-explore-head-cards">
        <div className="blog-stat-card">
          <BookOpenIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{totalBlogs}</div>
            <div className="blog-stat-label">Published Blogs</div>
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
            <div className="blog-stat-value">{avgLikes}</div>
            <div className="blog-stat-label">Avg Likes</div>
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
      </div>
      
      {filteredBlogs.length === 0 ? (
        <div className="no-results" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
          No published blogs found.
        </div>
      ) : (
        <div className="astronomy-card-container">
          {filteredBlogs.map(blog => (
            <AstronomyBlogCard
              key={blog.id}
              image={blog.featured_image || blog.image_url || ''}
              title={blog.title}
              author={blog.author_display_name || blog.author_name || 'Unknown'}
              createdAt={blog.published_at || blog.created_at}
              rating={0}
              content={blog.excerpt || (typeof blog.content === 'string' ? blog.content : '')}
              onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogExplore;