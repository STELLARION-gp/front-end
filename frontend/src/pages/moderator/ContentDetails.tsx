import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFlag, FaCheck, FaTimes, FaUser, FaClock, FaExclamationTriangle, FaImage, FaVideo, FaCommentAlt, FaFileAlt, FaLink, FaMusic } from 'react-icons/fa';
import '../../styles/pages/moderator/ContentDetails.scss';
import Button from '../../components/Button';

type ContentType = 'post' | 'comment' | 'image' | 'video' | 'link' | 'audio';
type ContentStatus = 'pending' | 'approved' | 'rejected';
type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

interface ContentItem {
  id: string;
  type: ContentType;
  content: string;
  author: string;
  reportedBy: string[];
  reportReason: string[];
  status: ContentStatus;
  createdAt: Date;
  priority: PriorityLevel;
  details?: string;
  community?: string;
  metadata?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

// Mock data - in real app this would come from API
const mockContentItems: ContentItem[] = [
  {
    id: '1',
    type: 'post',
    content: 'Check out this amazing view of the Milky Way from last night!',
    details: 'Check out this amazing view of the Milky Way from last night! I spent about 3 hours in the desert with my telescope and managed to capture this incredible shot. The conditions were perfect - no clouds, minimal light pollution, and very stable atmosphere. I used a Canon EOS R6 with a 24-70mm lens, ISO 3200, 30-second exposure. What do you think? Any tips for improving my astrophotography technique?',
    author: 'StarGazer42',
    reportedBy: ['User123', 'Mod456'],
    reportReason: ['Inappropriate content', 'Spam'],
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    priority: 'high',
    community: 'Astronomy Lovers',
    metadata: {
      likes: 45,
      comments: 12,
      shares: 8,
      views: 234
    }
  },
  {
    id: '2',
    type: 'comment',
    content: 'හොඳින් මතක තබා ගතයුතුයි.. මෙවැනි පෝසට් දාන්න එපා',
    author: 'හිත් පහේ දත්ත',
    reportedBy: ['PhotoPro789'],
    reportReason: ['Harassment'],
    status: 'pending',
    createdAt: new Date('2025-01-15T09:15:00'),
    priority: 'medium',
    details: 'Comment appears to be attacking the original poster without constructive criticism.'
  },
  {
    id: '8',
    type: 'comment',
    content: 'This is definitely fake, no way you captured this with a phone camera!',
    details: 'This is definitely fake, no way you captured this with a phone camera! Stop trying to fool people with your edited photos. Real astronomers know this is impossible.',
    author: 'SkepticalViewer',
    reportedBy: ['PhotoPro789'],
    reportReason: ['Harassment'],
    status: 'pending',
    createdAt: new Date('2024-01-15T09:15:00'),
    priority: 'medium',
    metadata: {
      likes: 2,
      comments: 0,
      shares: 0,
      views: 89
    }
  },
  {
    id: '3',
    type: 'image',
    content: '[Image: Saturn through telescope]',
    details: '[High-resolution image of Saturn with clearly visible rings, captured through a 8-inch Schmidt-Cassegrain telescope]',
    author: 'PlanetHunter',
    reportedBy: ['User999'],
    reportReason: ['Copyright violation'],
    status: 'pending',
    createdAt: new Date('2024-01-15T08:00:00'),
    priority: 'low',
    metadata: {
      likes: 78,
      comments: 23,
      shares: 15,
      views: 456
    }
  },
  {
    id: '4',
    type: 'video',
    content: '[Video: Solar eclipse time-lapse]',
    details: '[Video contains potentially misleading information about solar eclipse effects]',
    author: 'CosmicVoyager',
    reportedBy: ['User456', 'User789'],
    reportReason: ['Graphic content', 'Misinformation'],
    status: 'pending',
    createdAt: new Date('2024-01-14T18:45:00'),
    priority: 'critical',
    metadata: {
      likes: 120,
      comments: 45,
      shares: 32,
      views: 890
    }
  },
  {
    id: '5',
    type: 'link',
    content: 'Interesting article about black holes: https://example.com/black-holes',
    details: 'Link appears to be to a legitimate astronomy article but was flagged as spam.',
    author: 'SpaceExplorer',
    reportedBy: ['User101'],
    reportReason: ['Spam'],
    status: 'pending',
    createdAt: new Date('2024-01-14T15:20:00'),
    priority: 'medium',
    metadata: {
      likes: 15,
      comments: 8,
      shares: 3,
      views: 150
    }
  },
  {
    id: '6',
    type: 'audio',
    content: '[Audio: Recording of meteor shower sounds]',
    details: 'Audio verified as authentic recording after review.',
    author: 'SoundCollector',
    reportedBy: ['User303'],
    reportReason: ['Fake content'],
    status: 'approved',
    createdAt: new Date('2024-01-12T20:30:00'),
    priority: 'low',
    metadata: {
      likes: 34,
      comments: 12,
      shares: 5,
      views: 210
    }
  }
];

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundContent = mockContentItems.find(item => item.id === id);
      setContent(foundContent || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApprove = () => {
    if (content) {
      setContent({ ...content, status: 'approved' });
      // In real app, would make API call here
    }
  };

  const handleReject = () => {
    if (content) {
      setContent({ ...content, status: 'rejected' });
      // In real app, would make API call here
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'post': return <FaFileAlt />;
      case 'comment': return <FaCommentAlt />;
      case 'image': return <FaImage />;
      case 'video': return <FaVideo />;
      case 'link': return <FaLink />;
      case 'audio': return <FaMusic />;
      default: return '📄';
    }
  };

  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case 'post': return '#667eea';
      case 'comment': return '#764ba2';
      case 'image': return '#2ed573';
      case 'video': return '#ff4757';
      case 'link': return '#ffa502';
      case 'audio': return '#f39c12';
      default: return '#ffffff';
    }
  };

  if (loading) {
    return (
      <div className="content-details">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading content details...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-details">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h2>Content Not Found</h2>
          <p>The requested content could not be found.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/moderation/content')}
          >
            Back to Content Moderation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-details">
      {/* Header */}
      <header className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation/content')}
            >
              Back to Content List
            </Button>
            <div className="title-section">
              <h1>Content Details</h1>
              <p>Review and moderate this content item</p>
            </div>
          </div>
          
          <div className="header-actions">
            {content.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="medium"
                  icon={<FaCheck />}
                  iconPosition="left"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="medium"
                  icon={<FaTimes />}
                  iconPosition="left"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="details-content">
        <div className="content-card">
          {/* Content Header */}
          <div className="content-header">
            <div className="content-type" style={{ color: getTypeColor(content.type) }}>
              <span className="type-icon">{getTypeIcon(content.type)}</span>
              <span className="type-label">{content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
            </div>
            <div className="content-status">
              <div className={`priority-badge priority-${content.priority}`}>
                {content.priority}
              </div>
              <div className={`status-badge status-${content.status}`}>
                {content.status}
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="author-section">
            <div className="author-info">
              <FaUser className="author-icon" />
              <div className="author-details">
                <span className="author-name">{content.author}</span>
                <span className="post-date">
                  <FaClock className="clock-icon" />
                  {content.createdAt.toLocaleString()}
                </span>
                {content.community && (
                  <span className="community">Posted in: {content.community}</span>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="content-body">
            <h3>Content Preview</h3>
            <div className="content-preview">
              {content.content}
            </div>
            
            {content.details && (
              <>
                <h3>Full Content</h3>
                <div className="content-text">
                  {content.details}
                </div>
              </>
            )}
          </div>

          {/* Metadata */}
          {content.metadata && (
            <div className="content-metadata">
              <h3>Engagement Metrics</h3>
              <div className="metrics-grid">
                <div className="metric">
                  <span className="metric-value">{content.metadata.views}</span>
                  <span className="metric-label">Views</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{content.metadata.likes}</span>
                  <span className="metric-label">Likes</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{content.metadata.comments}</span>
                  <span className="metric-label">Comments</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{content.metadata.shares}</span>
                  <span className="metric-label">Shares</span>
                </div>
              </div>
            </div>
          )}

          {/* Reports Section */}
          <div className="reports-section">
            <h3>
              <FaFlag className="flag-icon" />
              Reports ({content.reportedBy.length})
            </h3>
            
            <div className="report-details">
              <div className="reporters">
                <h4>Reported by:</h4>
                <ul>
                  {content.reportedBy.map((reporter, index) => (
                    <li key={index}>{reporter}</li>
                  ))}
                </ul>
              </div>

              <div className="reasons">
                <h4>Report reasons:</h4>
                <div className="reason-tags">
                  {content.reportReason.map((reason, index) => (
                    <span key={index} className="reason-tag">{reason}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {content.status === 'pending' && (
            <div className="action-section">
              <Button
                variant="success"
                size="large"
                icon={<FaCheck />}
                iconPosition="left"
                onClick={handleApprove}
              >
                Approve Content
              </Button>
              <Button
                variant="danger"
                size="large"
                icon={<FaTimes />}
                iconPosition="left"
                onClick={handleReject}
              >
                Reject Content
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}