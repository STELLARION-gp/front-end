import { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaEye, FaCheck, FaTimes, FaSearch, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/ContentModeration.scss';
import Button from '../../components/Button';
import { blogService } from '../../services/blogService';
import type { Blog } from '../../services/blogService';
import { useToast } from '../../contexts/ToastContext';

type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

interface BlogPost extends Blog {
  priority?: PriorityLevel;
  reportedBy?: string[];
  reportReason?: string[];
}

export default function ContentModeration() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate priority based on blog metrics
  const calculatePriority = (blog: Blog): PriorityLevel => {
    const age = Date.now() - new Date(blog.created_at).getTime();
    const hoursSinceCreation = age / (1000 * 60 * 60);
    
    // High priority if pending for more than 24 hours
    if (blog.status === 'pending' && hoursSinceCreation > 24) return 'high';
    // Medium priority if pending for more than 12 hours
    if (blog.status === 'pending' && hoursSinceCreation > 12) return 'medium';
    // Low priority otherwise
    return 'low';
  };

  const loadBlogPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = statusFilter === 'all' ? {} : { status: statusFilter };
      const response = await blogService.getBlogs(filters);
      
      if (response.success && response.data.blogs) {
        // Convert API blogs to BlogPost with priority calculation
        const posts: BlogPost[] = response.data.blogs.map((blog: Blog): BlogPost => ({
          ...blog,
          priority: calculatePriority(blog),
          reportedBy: [], // Will be populated when we add reporting feature
          reportReason: []
        }));
        setBlogPosts(posts);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (err) {
      console.error('Error loading blog posts:', err);
      setError('Failed to load blog posts. Please try again.');
      // Fallback to empty array
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Load blog posts from API
  useEffect(() => {
    loadBlogPosts();
  }, [loadBlogPosts]);

  const handleApprove = async (blogId: number) => {
    try {
      await blogService.updateBlog(blogId, { status: 'approved' });
      setBlogPosts(prev =>
        prev.map(post =>
          post.id === blogId ? { ...post, status: 'approved' } : post
        )
      );
    } catch (err) {
      console.error('Error approving blog:', err);
      showError('Failed to approve blog. Please try again.');
    }
  };

  const handleReject = async (blogId: number) => {
    try {
      await blogService.updateBlog(blogId, { status: 'rejected' });
      setBlogPosts(prev =>
        prev.map(post =>
          post.id === blogId ? { ...post, status: 'rejected' } : post
        )
      );
    } catch (err) {
      console.error('Error rejecting blog:', err);
      showError('Failed to reject blog. Please try again.');
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author_display_name || post.author_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="content-moderation">
      {/* Header */}
      <header className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation')}
            >
              Go back
            </Button>
            <div className="title-section">
              <h1>Blog Post Moderation</h1>
              <p>Review and moderate blog submissions</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{filteredPosts.filter(p => p.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredPosts.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="controls-section1">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs1">
          <div className="filter-group1">
            <h4>Status:</h4>
            {(['all', 'pending', 'published', 'rejected'] as const).map(status => (
              <Button
                variant='primary'
                size='large'
                key={status}
                className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="moderation-content">
        <div className="content-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              <FaFileAlt className="empty-icon" />
              <h3>No blog posts found</h3>
              <p>No blog posts matching your filters.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div
                key={post.id}
                className={`content-item_1 priority-${post.priority} status-${post.status}`}
              >
                <div className="item-header">
                  <div className="header-left">
                    <div className="item-type">
                      <span className="type-icon"><FaFileAlt /></span>
                      <span className="type-label">Blog Post</span>
                    </div>
                    {post.priority && (
                      <div className={`priority-badge priority-${post.priority}`}>
                        {post.priority}
                      </div>
                    )}
                  </div>
                  <div className={`status-indicator1 status-${post.status}`}>
                    {post.status}
                  </div>
                </div>

                <div className="item-content"
                  onClick={() => navigate(`/dashboard/moderation/content/details/${post.id}`)}
                >
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="content-text">
                    {post.excerpt || post.content.substring(0, 200)}
                    {post.content.length > 200 ? '...' : ''}
                  </p>
                  <div className="item-meta">
                    <span className="author">
                      by {post.author_display_name || post.author_name || 'Unknown Author'}
                    </span>
                    <span className="created">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span className="stats">
                      {post.view_count} views · {post.like_count} likes · {post.comment_count} comments
                    </span>
                  </div>
                  {post.featured_image && (
                    <div className="blog-image-preview">
                      <img src={post.featured_image} alt={post.title} />
                    </div>
                  )}
                </div>

                <div className="item-actions">
                  <button
                    className="action-btn view-btn1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/moderation/content/details/${post.id}`);
                    }}
                    title="View blog details"
                  >
                    <FaEye />
                    <span>View</span>
                  </button>
                  {post.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        title="Approve blog post"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(post.id);
                        }}
                      >
                        <FaCheck />
                        <span>Approve</span>
                      </button>
                      <button
                        className="action-btn reject-btn"
                        title="Reject blog post"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(post.id);
                        }}
                      >
                        <FaTimes />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}