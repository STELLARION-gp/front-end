import React, { useState } from 'react';
import '../../styles/pages/mentor/menteeProfile.scss';
import signupImg from '../../assets/signup.jpg';
import groupChatIcon from '../../assets/groupchat.png';
import { StarIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const sharedDocs = [
  { id: 1, name: 'Astronomy Notes.pdf', url: '#' },
  { id: 2, name: 'Session Slides.pptx', url: '#' },
  { id: 3, name: 'Quiz Results.xlsx', url: '#' },
];

const initialRating = 4;

const MenteeProfile: React.FC = () => {
  const [showRateModal, setShowRateModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [savedReview, setSavedReview] = useState<{ rating: number; review: string } | null>(null);
  const navigate = useNavigate();

  const handleSaveReview = () => {
    setSavedReview({ rating, review });
    setShowRateModal(false);
  };

  const handleRemove = () => {
    setShowRemoveModal(false);
    navigate('/dashboard/mentees');
  };

  return (
    <>
      <div className="dashboard-page mentor-dashboard mentor-dashboard-large mentee-profile-page">
        <div className="mentee-profile-layout">
          {/* Left: Profile Info */}
          <div className="mentee-profile-left">
            <div className="mentee-profile-avatar">
              <img src={signupImg} alt="Mentee Avatar" />
            </div>
            <div className="mentee-profile-info-list">
              <div className="mentee-profile-info-item">
                <label>Full Name</label>
                <div className="value">Luna Skywatchet</div>
              </div>
              <div className="mentee-profile-info-item">
                <label>College</label>
                <div className="value">Stellarion University</div>
              </div>
              <div className="mentee-profile-info-item">
                <label>Email</label>
                <div className="value">luna@stellarion.edu</div>
              </div>
              <div className="mentee-profile-info-item rating">
                <label>Rating</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {[1,2,3,4,5].map((i) => (
                    <StarIcon key={i} style={{ width: 20, color: i <= (savedReview ? savedReview.rating : initialRating) ? '#fbbf24' : '#cbd5e1' }} />
                  ))}
                  <span className="rating-number" style={{ color: '#a0aec0', fontWeight: 500, marginLeft: 8 }}>{`Rated ${(savedReview ? savedReview.rating : initialRating)}.0/5.0`}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Documents & Stats */}
          <div className="mentee-profile-right">
            <div className="mentee-profile-docs-box">
              <div className="mentee-profile-docs-title">Shared documents</div>
              <div className="mentee-profile-docs-list">
                {sharedDocs.map(doc => (
                  <a className="mentee-profile-doc-link" key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer">
                    <DocumentTextIcon className="mentee-profile-doc-icon" />
                    <span className="mentee-profile-doc-title">{doc.name}</span>
                  </a>
                ))}
              </div>
              <button className="mentee-profile-docs-seemore mentor-btn-blue mentor-btn-small">See More</button>
            </div>
            <div className="mentee-profile-stats-box">
              <div className="mentee-profile-stats-title">Personal stats</div>
              <div className="mentee-profile-stats-grid">
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Night camps participated</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Sessions participated</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">05</div>
                  <div className="stat-desc">Quiz completed</div>
                </div>
                <div className="mentee-profile-stat-card poll-item mentor-request-card">
                  <div className="stat-label">60/100</div>
                  <div className="stat-desc">Quiz average</div>
                </div>
              </div>
              <div className="mentee-profile-stats-actions" style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 18 }}>
                <button className="mentor-btn-blue mentor-btn-small" onClick={() => setShowRateModal(true)}>Rate</button>
                <button className="mentor-btn-red mentor-btn-small" onClick={() => setShowRemoveModal(true)}>Remove</button>
              </div>
            </div>
            {/* Show review if exists */}
            {savedReview && (
              <div className="mentee-profile-review-box">
                <div className="mentee-profile-review-title">Your Review</div>
                <div className="mentee-profile-review-stars">
                  {[1,2,3,4,5].map(i => (
                    <StarIcon key={i} style={{ width: 20, color: i <= savedReview.rating ? '#fbbf24' : '#cbd5e1' }} />
                  ))}
                </div>
                <div className="mentee-profile-review-text">{savedReview.review}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Rate and Review Modal */}
      {showRateModal && (
        <div className="mentee-modal-overlay">
          <div className="mentee-modal mentee-modal-rate">
            <div className="mentee-modal-title">Rate and Review</div>
            <div className="mentee-modal-stars">
              {[1,2,3,4,5].map(i => (
                <StarIcon
                  key={i}
                  style={{ width: 32, height: 32, cursor: 'pointer', color: (hoverRating ?? rating) >= i ? '#fbbf24' : '#cbd5e1' }}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(i)}
                />
              ))}
            </div>
            <textarea
              className="mentee-modal-textarea"
              placeholder="Write your review..."
              value={review}
              onChange={e => setReview(e.target.value)}
              rows={4}
            />
            <div className="mentee-modal-actions">
              <button className="mentor-btn-blue mentor-btn-small" onClick={handleSaveReview}>Save</button>
              <button className="mentor-btn-red mentor-btn-small" onClick={() => setShowRateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="mentee-modal-overlay">
          <div className="mentee-modal mentee-modal-remove">
            <div className="mentee-modal-title">Are you sure to remove this mentee from your group?</div>
            <div className="mentee-modal-actions">
              <button className="mentor-btn-red mentor-btn-small" onClick={handleRemove}>Yes</button>
              <button className="mentor-btn-blue mentor-btn-small" onClick={() => setShowRemoveModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      <div className="mentee-profile-privatechat-icon" onClick={() => navigate('/dashboard/privatechat')} style={{ cursor: 'pointer' }}>
        <img src={groupChatIcon} alt="Private Chat" style={{ width: 38, height: 38 }}/>
      </div>
    </>
  );
};

export default MenteeProfile; 

