import { useState } from 'react';
import { FaArrowLeft, FaFlag, FaEye, FaCheck, FaTimes, FaSearch, FaImage, FaVideo, FaCommentAlt, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/ContentModeration.scss';
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
}

const mockContentItems: ContentItem[] = [
  {
    id: '1',
    type: 'post',
    content: 'Check out this amazing view of the Milky Way from last night!',
    author: 'StarGazer42',
    reportedBy: ['User123', 'Mod456'],
    reportReason: ['Inappropriate content', 'Spam'],
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    priority: 'high',
    details: 'This post contains an image of the Milky Way with questionable authenticity.',
    community: 'Astronomy Lovers'
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
    author: 'SkepticalViewer',
    reportedBy: ['PhotoPro789'],
    reportReason: ['Harassment'],
    status: 'pending',
    createdAt: new Date('2024-01-15T09:15:00'),
    priority: 'medium',
    details: 'Comment appears to be attacking the original poster without constructive criticism.'
  },
  {
    id: '3',
    type: 'image',
    content: '[Image: Saturn through telescope]',
    author: 'PlanetHunter',
    reportedBy: ['User999'],
    reportReason: ['Copyright violation'],
    status: 'approved',
    createdAt: new Date('2024-01-15T08:00:00'),
    priority: 'low',
    details: 'Image appears to be original content after verification.'
  },
  {
    id: '4',
    type: 'video',
    content: '[Video: Solar eclipse time-lapse]',
    author: 'CosmicVoyager',
    reportedBy: ['User456', 'User789'],
    reportReason: ['Graphic content', 'Misinformation'],
    status: 'pending',
    createdAt: new Date('2024-01-14T18:45:00'),
    priority: 'critical',
    details: 'Video contains potentially misleading information about solar eclipse effects.'
  },
  {
    id: '5',
    type: 'link',
    content: 'Interesting article about black holes: https://example.com/black-holes',
    author: 'SpaceExplorer',
    reportedBy: ['User101'],
    reportReason: ['Spam'],
    status: 'pending',
    createdAt: new Date('2024-01-14T15:20:00'),
    priority: 'medium',
    details: 'Link appears to be to a legitimate astronomy article but was flagged as spam.'
  },
  {
    id: '6',
    type: 'link',
    content: 'Which planet is your favorite? (Vote in comments)',
    author: 'SpamCreator',
    reportedBy: ['User202'],
    reportReason: ['Low quality'],
    status: 'rejected',
    createdAt: new Date('2024-01-13T12:10:00'),
    priority: 'low',
    details: 'link was deemed too low effort for our community standards.'
  },
  {
    id: '7',
    type: 'audio',
    content: '[Audio: Recording of meteor shower sounds]',
    author: 'SoundCollector',
    reportedBy: ['User303'],
    reportReason: ['Fake content'],
    status: 'approved',
    createdAt: new Date('2024-01-12T20:30:00'),
    priority: 'low',
    details: 'Audio verified as authentic recording after review.'
  }
];

export default function ContentModeration() {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('pending');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (itemId: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (itemId: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'rejected' } : item
      )
    );
  };

  const filteredItems = contentItems.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'post': return <FaFileAlt />;
      case 'comment': return <FaCommentAlt />;
      case 'image': return <FaImage />;
      case 'video': return <FaVideo />;
      case 'link': return '🔗';
      // case 'poll': return '📊';
      case 'audio': return '🎵';
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
      // case 'poll': return '#3742fa';
      case 'audio': return '#f39c12';
      default: return '#ffffff';
    }
  };

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
              <h1>Content Moderation</h1>
              <p>Review and moderate user-generated content</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{filteredItems.filter(i => i.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredItems.length}</span>
              <span className="stat-label">Showing</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search content or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <div className="filter-group">
            <h4>Status:</h4>
            {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
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
          <div className="filter-group">
            <h4>Type:</h4>
            {(['all', 'post', 'comment', 'image', 'video', 'link', 'audio'] as const).map(type => (
              <Button
                variant='primary'
                size='medium'
                key={type}
                className={`filter-tab ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="content-list">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>No content items found matching your filters.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`content-item priority-${item.priority} status-${item.status}`}
                onClick={() => navigate(`/dashboard/moderation/content/details/${item.id}`)}
              >
                <div className="item-header">
                  <div className="item-type" style={{ color: getTypeColor(item.type) }}>
                    <span className="type-icon">{getTypeIcon(item.type)}</span>
                    <span className="type-label">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                  </div>
                  <div className={`priority-badge priority-${item.priority}`}>
                    {item.priority}
                  </div>
                  <div className={`status-indicator status-${item.status}`}>
                    {item.status}
                  </div>
                </div>

                <div className="item-content">
                  <p className="content-text">{item.content}</p>
                  <div className="item-meta">
                    <span className="author">by {item.author}</span>
                    <span className="created">{item.createdAt.toLocaleDateString()}</span>
                    {item.community && <span className="community">in {item.community}</span>}
                  </div>
                </div>

                <div className="item-reports">
                  <div className="report-info">
                    <FaFlag className="flag-icon" />
                    <span>{item.reportedBy.length} report{item.reportedBy.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="report-reasons">
                    {item.reportReason.map((reason, index) => (
                      <span key={index} className="reason-tag">{reason}</span>
                    ))}
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/moderation/content/details/${item.id}`);
                    }}
                    title="View content details"
                  >
                    <FaEye />
                  </button>
                  {item.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        title="Approve content"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(item.id);
                        }}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        title="Reject content"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(item.id);
                        }}
                      >
                        <FaTimes />
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