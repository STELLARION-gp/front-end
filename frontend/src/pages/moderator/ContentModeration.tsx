import { useState } from 'react';
import { FaArrowLeft, FaFlag, FaEye, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/moderator/ContentModeration.scss';
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
  {
    id: '1',
    type: 'post',
    content: 'Check out this amazing view of the Milky Way from last night!',
    author: 'StarGazer42',
    reportedBy: ['User123', 'Mod456'],
    reportReason: ['Inappropriate content', 'Spam'],
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00'),
    priority: 'high'
  },
  {
    id: '2',
    type: 'comment',
    content: 'This is definitely fake, no way you captured this with a phone camera!',
    author: 'SkepticalViewer',
    reportedBy: ['PhotoPro789'],
    reportReason: ['Harassment'],
    status: 'pending',
    createdAt: new Date('2024-01-15T09:15:00'),
    priority: 'medium'
  },
  {
    id: '3',
    type: 'image',
    content: '[Image: Saturn through telescope]',
    author: 'PlanetHunter',
    reportedBy: ['User999'],
    reportReason: ['Copyright violation'],
    status: 'pending',
    createdAt: new Date('2024-01-15T08:00:00'),
    priority: 'low'
  }
];

export default function ContentModeration() {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (itemId: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'approved' as const } : item
      )
    );
  };

  const handleReject = (itemId: string) => {
    setContentItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'rejected' as const } : item
      )
    );
  };

  const filteredItems = contentItems.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            {/* <Button 
              variant='secondary'
              className="back-button"
              onClick={() => navigate('/dashboard/moderation')}
            >
              <FaArrowLeft />
            </Button> */}
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
              <span className="stat-label">Total</span>
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
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <Button
              variant='primary'
              size='large'
              key={status}
              className={`filter-tab ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status as typeof filter)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="moderation-content">
        <div className="content-list">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`content-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-header">
                <div className="item-type">
                  <span className="type-icon">{getTypeIcon(item.type)}</span>
                  <span className="type-label">{item.type}</span>
                </div>
                <div 
                  className={`priority-badge priority-${item.priority}`}
                >
                  {item.priority}
                </div>
              </div>

              <div className="item-content">
                <p className="content-text">{item.content}</p>
                <div className="item-meta">
                  <span>by {item.author}</span>
                  <span>{item.createdAt.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="item-reports">
                <div className="report-info">
                  <FaFlag className="flag-icon" />
                  <span>{item.reportedBy.length} report(s)</span>
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
                    setSelectedItem(item);
                  }}
                    title="view content details"
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

              <div className={`status-indicator ${item.status}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>Content Details</h3>
              <button 
                className="close-panel"
                title="Close panel"
                onClick={() => setSelectedItem(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="panel-content">
              <div className="detail-section">
                <h4>Content Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedItem.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Author:</label>
                    <span>{selectedItem.author}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>{selectedItem.createdAt.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Priority:</label>
                    <span 
                      className={`priority-text priority-${selectedItem.priority}`}
                    >
                      {selectedItem.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Content</h4>
                <div className="content-preview">
                  {selectedItem.content}
                </div>
              </div>

              <div className="detail-section">
                <h4>Reports</h4>
                <div className="reports-list">
                  <div className="report-summary">
                    <strong>{selectedItem.reportedBy.length} user(s) reported this content</strong>
                  </div>
                  <div className="report-reasons-list">
                    {selectedItem.reportReason.map((reason, index) => (
                      <div key={index} className="reason-item">
                        <FaFlag className="reason-icon" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedItem.status === 'pending' && (
                <div className="panel-actions">
                  <button
                    className="panel-btn approve"
                    onClick={() => handleApprove(selectedItem.id)}
                  >
                    <FaCheck />
                    Approve Content
                  </button>
                  <button
                    className="panel-btn reject"
                    onClick={() => handleReject(selectedItem.id)}
                  >
                    <FaTimes />
                    Reject Content
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
