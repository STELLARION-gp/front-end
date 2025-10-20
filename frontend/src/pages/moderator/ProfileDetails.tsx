import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBan, FaCheck, FaExclamationTriangle, FaClock, FaEnvelope, FaIdCard, FaUserGraduate, FaUserTie, FaGlobe } from 'react-icons/fa';
import '../../styles/pages/moderator/ProfileDetails.scss';
import Button from '../../components/Button';
import applicationModerationService from '../../services/applicationModerationService';

interface ApplicationData {
  application_id: number;
  type: 'guide' | 'influencer';
  approve_application_status: 'pending' | 'accepted' | 'rejected';
  users: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firebase_uid: string;
  };
  expertise_areas?: string[];
  experience_years?: number;
  bio?: string;
  social_media_links?: Record<string, string>;
  followers_count?: number;
  submitted_at: string;
}

export default function ProfileDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        setError('No application ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [type, idStr] = id.split('-');
        const applicationId = parseInt(idStr);

        if (!type || !applicationId || (type !== 'guide' && type !== 'influencer')) {
          setError('Invalid application ID format');
          setLoading(false);
          return;
        }

        const app = await applicationModerationService.getApplicationById(
          applicationId,
          type as 'guide' | 'influencer'
        );

        setApplication(app as unknown as ApplicationData);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError((err as Error).message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleApprove = async () => {
    if (!application) return;

    const confirmMessage = `Are you sure you want to approve this ${application.type} application?\n\nThis will upgrade the user's role to ${application.type === 'guide' ? 'Guide' : 'Influencer'}.`;
    
    if (!confirm(confirmMessage)) return;

    try {
      if (application.type === 'guide') {
        await applicationModerationService.approveGuideApplication(application.application_id);
      } else {
        await applicationModerationService.approveInfluencerApplication(application.application_id);
      }

      navigate('/dashboard/moderation/profile', {
        state: {
          message: `${application.type === 'guide' ? 'Guide' : 'Influencer'} application approved successfully! User role has been updated.`,
          type: 'success'
        }
      });
    } catch (err) {
      alert((err as Error).message || 'Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!application) return;

    const reason = prompt(`Enter rejection reason (optional):\n\nThis message will be sent to the user.`);
    if (reason === null) return;

    try {
      if (application.type === 'guide') {
        await applicationModerationService.rejectGuideApplication(
          application.application_id,
          reason || undefined
        );
      } else {
        await applicationModerationService.rejectInfluencerApplication(
          application.application_id,
          reason || undefined
        );
      }

      const message = reason 
        ? `Application rejected: ${reason}`
        : `${application.type === 'guide' ? 'Guide' : 'Influencer'} application rejected`;

      navigate('/dashboard/moderation/profile', {
        state: {
          message,
          type: 'success'
        }
      });
    } catch (err) {
      alert((err as Error).message || 'Failed to reject application');
    }
  };

  const getRequestTypeLabel = (type: 'guide' | 'influencer') => {
    return type === 'guide' ? 'Guide Application' : 'Influencer Application';
  };

  const getPriorityFromDate = (submittedAt: string) => {
    const daysSinceSubmission = Math.floor(
      (Date.now() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceSubmission > 14) return 'critical';
    if (daysSinceSubmission > 7) return 'high';
    if (daysSinceSubmission > 3) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="profile-details">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="profile-details">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h2>Application Not Found</h2>
          <p>{error || 'The requested application could not be found.'}</p>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/moderation/profile')}
          >
            Back to Application List
          </Button>
        </div>
      </div>
    );
  }

  const isPending = application.approve_application_status === 'pending';
  const isGuide = application.type === 'guide';
  const priority = getPriorityFromDate(application.submitted_at);

  return (
    <div className="profile-details">
      <header className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              icon={<FaArrowLeft />}
              iconPosition="left"
              onClick={() => navigate('/dashboard/moderation/profile')}
            >
              Back to Application List
            </Button>
            <div className="title-section">
              <h1>{getRequestTypeLabel(application.type)}</h1>
              <p>Review and process this application</p>
            </div>
          </div>
          
          <div className="header-actions">
            {isPending && (
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
                  icon={<FaBan />}
                  iconPosition="left"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
            {!isPending && (
              <div className={`status-badge status-${application.approve_application_status}`}>
                {application.approve_application_status === 'accepted' ? 'Approved' : 'Rejected'}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="details-content">
        <div className="info-card user-info-card">
          <div className="card-header">
            <div className="header-icon">
              {isGuide ? <FaUserGraduate /> : <FaUserTie />}
            </div>
            <h2>User Information</h2>
          </div>
          <div className="card-content">
            <div className="user-header">
              <div className={`avatar ${application.type}`}>
                {isGuide ? <FaUserGraduate /> : <FaUserTie />}
              </div>
              <div className="user-details">
                <h3>{application.users.first_name} {application.users.last_name}</h3>
                <div className="user-meta">
                  <span className="email">
                    <FaEnvelope /> {application.users.email}
                  </span>
                  <span className="user-id">
                    <FaIdCard /> ID: {application.users.user_id}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Current Role:</span>
                <span className="value">{application.users.role || 'User'}</span>
              </div>
              <div className="info-item">
                <span className="label">Requested Role:</span>
                <span className="value requested-role">{application.type === 'guide' ? 'Guide' : 'Influencer'}</span>
              </div>
              <div className="info-item">
                <span className="label">Submitted:</span>
                <span className="value">
                  <FaClock /> {new Date(application.submitted_at).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Priority:</span>
                <span className={`priority-badge priority-${priority}`}>
                  {priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card application-details-card">
          <div className="card-header">
            <h2>{isGuide ? 'Guide' : 'Influencer'} Application Details</h2>
          </div>
          <div className="card-content">
            {isGuide && (
              <>
                {application.expertise_areas && application.expertise_areas.length > 0 && (
                  <div className="detail-section">
                    <h3>Areas of Expertise</h3>
                    <div className="tags-container">
                      {application.expertise_areas.map((area, index) => (
                        <span key={index} className="tag expertise-tag">{area}</span>
                      ))}
                    </div>
                  </div>
                )}

                {application.experience_years !== undefined && (
                  <div className="detail-section">
                    <h3>Years of Experience</h3>
                    <p className="experience-value">{application.experience_years} years</p>
                  </div>
                )}

                {application.bio && (
                  <div className="detail-section">
                    <h3>Bio</h3>
                    <p className="bio-text">{application.bio}</p>
                  </div>
                )}
              </>
            )}

            {!isGuide && (
              <>
                {application.followers_count !== undefined && (
                  <div className="detail-section">
                    <h3>Total Followers</h3>
                    <p className="followers-value">{application.followers_count.toLocaleString()}</p>
                  </div>
                )}

                {application.social_media_links && Object.keys(application.social_media_links).length > 0 && (
                  <div className="detail-section">
                    <h3>Social Media Profiles</h3>
                    <div className="social-links">
                      {Object.entries(application.social_media_links).map(([platform, link]) => (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          <FaGlobe />
                          <span className="platform-name">{platform}:</span>
                          <span className="platform-link">{link}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="info-card status-card">
          <div className="card-header">
            <h2>Application Status</h2>
          </div>
          <div className="card-content">
            <div className="status-info">
              <div className="status-item">
                <span className="label">Current Status:</span>
                <span className={`status-badge status-${application.approve_application_status}`}>
                  {application.approve_application_status === 'pending' && 'Pending Review'}
                  {application.approve_application_status === 'accepted' && 'Approved'}
                  {application.approve_application_status === 'rejected' && 'Rejected'}
                </span>
              </div>
              <div className="status-item">
                <span className="label">Application Type:</span>
                <span className="value">{getRequestTypeLabel(application.type)}</span>
              </div>
              <div className="status-item">
                <span className="label">Submission Date:</span>
                <span className="value">{new Date(application.submitted_at).toLocaleString()}</span>
              </div>
            </div>

            {isPending && (
              <div className="action-reminder">
                <FaExclamationTriangle className="reminder-icon" />
                <p>This application requires your review. Please approve or reject.</p>
              </div>
            )}
          </div>
        </div>

        {isPending && (
          <div className="details-actions">
            <Button
              variant="success"
              size="large"
              icon={<FaCheck />}
              iconPosition="left"
              onClick={handleApprove}
            >
              Approve Application
            </Button>
            <Button
              variant="danger"
              size="large"
              icon={<FaBan />}
              iconPosition="left"
              onClick={handleReject}
            >
              Reject Application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
