import { FaArrowLeft, FaCheck, FaTimes, FaCalendar, FaUser, FaEye, FaHeart, FaComment, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/pages/moderator/ContentDetailPage.scss';
import Button from '../../components/Button';
import { blogService } from '../../services/blogService';
import type { Blog } from '../../services/blogService';
import { factCheckService } from '../../services/factCheckService';
import type { FactCheckReport } from '../../services/factCheckService';

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
  
  // Fact-checking state
  const [factCheckReport, setFactCheckReport] = useState<FactCheckReport | null>(null);
  const [factCheckLoading, setFactCheckLoading] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);

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

  const handleFactCheck = async () => {
    if (!blog) return;
    
    try {
      setFactCheckLoading(true);
      setShowFactCheck(true);
      
      const report = await factCheckService.checkBlogContent(
        blog.content,
        blog.title
      );
      
      setFactCheckReport(report);
    } catch (err) {
      console.error('Error fact-checking blog:', err);
      setError('Failed to perform fact check');
    } finally {
      setFactCheckLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'true': return 'rating-true';
      case 'false': return 'rating-false';
      case 'mixture': return 'rating-mixture';
      case 'disputed': return 'rating-disputed';
      case 'unverified': return 'rating-unverified';
      default: return 'rating-unknown';
    }
  };

  const getCredibilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'credibility-high';
      case 'medium': return 'credibility-medium';
      case 'low': return 'credibility-low';
      case 'very-low': return 'credibility-very-low';
      default: return 'credibility-medium';
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

          {/* Fact Check Section */}
          {blog.status === 'pending' && (
            <div className="fact-check-section">
              <div className="fact-check-header">
                <h3><FaShieldAlt /> Content Fact Check</h3>
                <p>Verify the credibility and accuracy of the blog content</p>
              </div>
              
              {!showFactCheck ? (
                <Button
                  variant="primary"
                  size="large"
                  icon={<FaShieldAlt />}
                  onClick={handleFactCheck}
                  disabled={factCheckLoading}
                >
                  {factCheckLoading ? 'Analyzing Content...' : 'Run Fact Check Analysis'}
                </Button>
              ) : (
                <div className="fact-check-results">
                  {factCheckLoading ? (
                    <div className="fact-check-loading">
                      <div className="spinner"></div>
                      <p>Analyzing content and verifying claims...</p>
                      <small>This may take a few moments</small>
                    </div>
                  ) : factCheckReport ? (
                    <>
                      {/* Overall Score */}
                      <div className={`fact-check-overall ${getCredibilityColor(factCheckReport.credibilityLevel)}`}>
                        <div className="score-section">
                          <div className="score-circle">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                              <path
                                className="circle-bg"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="circle"
                                strokeDasharray={`${factCheckReport.overallScore}, 100`}
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <text x="18" y="20.35" className="percentage">
                                {factCheckReport.overallScore}
                              </text>
                            </svg>
                          </div>
                          <div className="score-details">
                            <h4>Credibility Score</h4>
                            <p className="credibility-level">
                              {factCheckReport.credibilityLevel.replace('-', ' ').toUpperCase()}
                            </p>
                            <div className="claim-stats">
                              <span><FaCheckCircle /> {factCheckReport.verifiedClaims} Verified</span>
                              <span><FaTimes /> {factCheckReport.falseClaiims} False</span>
                              <span><FaInfoCircle /> {factCheckReport.unverifiedClaims} Unverified</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warnings */}
                      {factCheckReport.warnings.length > 0 && (
                        <div className="fact-check-warnings">
                          <h4><FaExclamationTriangle /> Warnings</h4>
                          <ul>
                            {factCheckReport.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {factCheckReport.recommendations.length > 0 && (
                        <div className="fact-check-recommendations">
                          <h4><FaInfoCircle /> Recommendations</h4>
                          <ul>
                            {factCheckReport.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Detailed Claims */}
                      {factCheckReport.claims.length > 0 && (
                        <div className="fact-check-claims">
                          <h4>Analyzed Claims ({factCheckReport.totalClaims})</h4>
                          <div className="claims-list">
                            {factCheckReport.claims.map((claim, index) => (
                              <div key={index} className="claim-item">
                                <div className="claim-header">
                                  <span className={`claim-rating ${getRatingColor(claim.rating)}`}>
                                    {claim.rating.toUpperCase()}
                                  </span>
                                  <span className="claim-confidence">
                                    {claim.confidence}% confidence
                                  </span>
                                </div>
                                <p className="claim-text">{claim.claim}</p>
                                {claim.explanation && (
                                  <p className="claim-explanation">
                                    <FaInfoCircle /> {claim.explanation}
                                  </p>
                                )}
                                {claim.sources.length > 0 && (
                                  <div className="claim-sources">
                                    <strong>Sources:</strong>
                                    <ul>
                                      {claim.sources.map((source, idx) => (
                                        <li key={idx}>
                                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                                            {source.name}
                                          </a>
                                          {source.excerpt && (
                                            <span className="source-excerpt"> - {source.excerpt}</span>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="fact-check-footer">
                        <small>
                          Analysis completed on {new Date(factCheckReport.analysisDate).toLocaleString()}
                        </small>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={handleFactCheck}
                        >
                          Re-run Analysis
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="fact-check-error">
                      <FaExclamationTriangle />
                      <p>Unable to complete fact check analysis</p>
                      <Button variant="primary" onClick={handleFactCheck}>
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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