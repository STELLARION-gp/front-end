import { FaArrowLeft, FaCheck, FaTimes, FaCalendar, FaUser, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/pages/moderator/ContentDetailPage.scss';
import Button from '../../components/Button';
import { blogService } from '../../services/blogService';
import type { Blog } from '../../services/blogService';

interface BlogPost extends Blog {
  author_display_name?: string;
  author_email?: string;
}

export default function ContentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await blogService.getBlogById(parseInt(id));
        const blogData: BlogPost = {
          ...response.data,
          author_display_name: response.data.author_display_name || 
                              response.data.author_name || 
                              response.data.author_email || 
                              'Unknown Author'
        };
        setBlog(blogData);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog details');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!blog) return;
    
    try {
      setActionLoading(true);
      await blogService.updateBlog(blog.id, { status: 'published' });
      navigate('/dashboard/moderation/content', { replace: true });
    } catch (err) {
      console.error('Error approving blog:', err);
      setError('Failed to approve blog');
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!blog) return;
    
    try {
      setActionLoading(true);
      await blogService.updateBlog(blog.id, { status: 'rejected' });
      navigate('/dashboard/moderation/content', { replace: true });
    } catch (err) {
      console.error('Error rejecting blog:', err);
      setError('Failed to reject blog');
      setActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="content-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading blog details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="content-detail-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error || 'Blog not found'}</p>
          <Button onClick={() => navigate('/dashboard/moderation/content')}>
            Back to Moderation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-detail-page">
      <header className="detail-header">
        <div className="header-content">
          <Button
            variant="ghost"
            size="medium"
            icon={<FaArrowLeft />}
            iconPosition="left"
            onClick={() => navigate('/dashboard/moderation/content')}
          >
            Back to moderation
          </Button>
          <div className="title-section">
            <h1>Blog Review</h1>
            <p>Review and moderate blog post</p>
          </div>
        </div>
      </header>

      <div className="detail-container">
        <div className="blog-detail-card">
          <div className="card-header">
            <div className="header-left">
              <span className="type-icon">📝</span>
              <span className="type-label">Blog Post</span>
            </div>
            <span className={`status-badge status-${blog.status}`}>
              {blog.status === 'published' ? 'Published' : blog.status}
            </span>
          </div>

          {blog.featured_image && (
            <div className="blog-featured-image">
              <img src={blog.featured_image} alt={blog.title} />
            </div>
          )}

          <div className="card-content">
            <div className="blog-title-section">
              <h1>{blog.title}</h1>
            </div>

            <div className="blog-meta">
              <div className="meta-item">
                <FaUser />
                <div>
                  <label>Author</label>
                  <span>{blog.author_display_name}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaCalendar />
                <div>
                  <label>Created</label>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaEye />
                <div>
                  <label>Views</label>
                  <span>{blog.view_count || 0}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaHeart />
                <div>
                  <label>Likes</label>
                  <span>{blog.like_count || 0}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaComment />
                <div>
                  <label>Comments</label>
                  <span>{blog.comment_count || 0}</span>
                </div>
              </div>
            </div>

            {blog.excerpt && (
              <div className="blog-excerpt-section">
                <h3>Excerpt</h3>
                <p>{blog.excerpt}</p>
              </div>
            )}

            <div className="blog-content-section">
              <h3>Full Content</h3>
              <div className="blog-content">
                {blog.content}
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-tags-section">
                <h3>Tags</h3>
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {blog.status === 'pending' && (
            <div className="card-actions">
              <Button
                variant="success"
                size="large"
                icon={<FaCheck />}
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Approve Blog'}
              </Button>
              <Button
                variant="danger"
                size="large"
                icon={<FaTimes />}
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Reject Blog'}
              </Button>
            </div>
          )}

          {blog.status === 'published' && (
            <div className="status-message approved">
              ✓ This blog has been published and is visible to the public
            </div>
          )}

          {blog.status === 'rejected' && (
            <div className="status-message rejected">
              ✕ This blog has been rejected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}