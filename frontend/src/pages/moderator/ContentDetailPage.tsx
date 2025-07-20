import { FaArrowLeft, FaFlag, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/pages/moderator/ContentDetailPage.scss';
import Button from '../../components/Button';

interface ContentItem {
  id: string;
  type: 'post' | 'comment' | 'image' | 'video';
  content: string;
  author: string;
  reportedBy: string[];
  reportReason: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockContentItems: ContentItem[] = [
  // Same mock data as in ContentModeration.tsx
];

export default function ContentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const item = mockContentItems.find(item => item.id === id);

  const handleApprove = () => {
    // In a real app, you would update the status via API
    navigate('/dashboard/moderation/content', { replace: true });
  };

  const handleReject = () => {
    // In a real app, you would update the status via API
    navigate('/dashboard/moderation/content', { replace: true });
  };

  if (!item) {
    return <div>Content not found</div>;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'comment': return '💬';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      default: return '📄';
    }
  };

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
            <h1>Content Review</h1>
            <p>Detailed view of reported content</p>
          </div>
        </div>
      </header>

      <div className="detail-container">
        <div className="content-card">
          <div className="card-header">
            <div className="header-left">
              <span className="type-icon">{getTypeIcon(item.type)}</span>
              <span className="type-label">{item.type}</span>
              <span className={`priority-badge priority-${item.priority}`}>
                {item.priority}
              </span>
            </div>
            <span className={`status-indicator ${item.status}`}>
              {item.status}
            </span>
          </div>

          <div className="card-content">
            <div className="content-section">
              <h3>Content Preview</h3>
              <div className="content-preview">
                {item.content}
              </div>
            </div>

            <div className="meta-section">
              <div className="meta-item">
                <label>Author:</label>
                <span>{item.author}</span>
              </div>
              <div className="meta-item">
                <label>Created:</label>
                <span>{item.createdAt.toLocaleString()}</span>
              </div>
            </div>

            <div className="reports-section">
              <h3>
                <FaFlag /> {item.reportedBy.length} Report(s)
              </h3>
              <div className="reasons-list">
                {item.reportReason.map((reason, index) => (
                  <div key={index} className="reason-item">
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {item.status === 'pending' && (
            <div className="card-actions">
              <Button
                variant="success"
                size="large"
                icon={<FaCheck />}
                onClick={handleApprove}
              >
                Approve Content
              </Button>
              <Button
                variant="danger"
                size="large"
                icon={<FaTimes />}
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