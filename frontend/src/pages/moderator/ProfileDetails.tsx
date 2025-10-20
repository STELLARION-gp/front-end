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
  user_id?: number;
  
  // Optional users table join
  users?: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firebase_uid: string;
  };
  
  // Direct user fields (when users table not joined)
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  
  // Guide/Influencer common fields
  expertise_areas?: string[];
  experience_years?: number;
  bio?: string;
  
  // Influencer specific
  social_media_links?: Record<string, string>;
  followers_count?: number;
  
  // Guide specific - comprehensive fields
  date_of_birth?: string;
  address?: string;
  city?: string;
  current_occupation?: string;
  education_level?: string;
  astronomy_education?: string;
  guiding_experience?: string;
  certifications?: string[];
  languages_spoken?: string[];
  available_weekdays?: boolean;
  available_weekends?: boolean;
  preferred_camp_types?: string[];
  preferred_group_sizes?: string[];
  equipment_proficiency?: string[];
  camping_experience?: string;
  special_accommodations?: string[];
  preferred_locations?: string[];
  accommodation_needs?: string;
  transportation_needs?: string;
  additional_skills?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  uploaded_documents?: {
    resume?: string;
    portfolio?: string;
    references?: string;
    certifications?: string;
  };
  custom_availability?: unknown[];
  verification_status?: string;
  background_check_completed?: boolean;
  terms_accepted?: boolean;
  data_consent?: boolean;
  
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
                <h3>
                  {application.users?.first_name || application.first_name || 'Unknown'} {' '}
                  {application.users?.last_name || application.last_name || ''}
                </h3>
                <div className="user-meta">
                  <span className="email">
                    <FaEnvelope /> {application.users?.email || application.email || 'No email'}
                  </span>
                  <span className="user-id">
                    <FaIdCard /> ID: {application.users?.user_id || application.user_id || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Current Role:</span>
                <span className="value">{application.users?.role || 'User'}</span>
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
            {isGuide ? (
              <>
                {/* Personal Information */}
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{application.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Date of Birth:</span>
                      <span className="value">
                        {application.date_of_birth 
                          ? new Date(application.date_of_birth).toLocaleDateString() 
                          : 'Not provided'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">{application.address || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">City:</span>
                      <span className="value">{application.city || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Background */}
                <div className="detail-section">
                  <h3>Professional Background</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Current Occupation:</span>
                      <span className="value">{application.current_occupation || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Education Level:</span>
                      <span className="value">{application.education_level || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Astronomy Education:</span>
                      <span className="value">{application.astronomy_education || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Guiding Experience:</span>
                      <span className="value">{application.guiding_experience || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Experience & Expertise */}
                <div className="detail-section">
                  <h3>Areas of Expertise</h3>
                  {application.expertise_areas && application.expertise_areas.length > 0 ? (
                    <div className="tags-container">
                      {application.expertise_areas.map((area, index) => (
                        <span key={index} className="tag expertise-tag">{area}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No expertise areas provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Years of Experience</h3>
                  {application.experience_years !== undefined ? (
                    <p className="experience-value">{application.experience_years} years</p>
                  ) : (
                    <p className="no-data">No experience information provided</p>
                  )}
                </div>

                {/* Certifications */}
                <div className="detail-section">
                  <h3>Certifications</h3>
                  {application.certifications && application.certifications.length > 0 ? (
                    <div className="tags-container">
                      {application.certifications.map((cert, index) => (
                        <span key={index} className="tag certification-tag">{cert}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No certifications provided</p>
                  )}
                </div>

                {/* Languages */}
                <div className="detail-section">
                  <h3>Languages Spoken</h3>
                  {application.languages_spoken && application.languages_spoken.length > 0 ? (
                    <div className="tags-container">
                      {application.languages_spoken.map((lang, index) => (
                        <span key={index} className="tag language-tag">{lang}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No languages provided</p>
                  )}
                </div>

                {/* Availability */}
                <div className="detail-section">
                  <h3>Availability</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Weekdays Available:</span>
                      <span className="value">{application.available_weekdays ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Weekends Available:</span>
                      <span className="value">{application.available_weekends ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="detail-section">
                  <h3>Preferred Camp Types</h3>
                  {application.preferred_camp_types && application.preferred_camp_types.length > 0 ? (
                    <div className="tags-container">
                      {application.preferred_camp_types.map((type, index) => (
                        <span key={index} className="tag preference-tag">{type}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No camp type preferences provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Preferred Group Sizes</h3>
                  {application.preferred_group_sizes && application.preferred_group_sizes.length > 0 ? (
                    <div className="tags-container">
                      {application.preferred_group_sizes.map((size, index) => (
                        <span key={index} className="tag preference-tag">{size}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No group size preferences provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Equipment Proficiency</h3>
                  {application.equipment_proficiency && application.equipment_proficiency.length > 0 ? (
                    <div className="tags-container">
                      {application.equipment_proficiency.map((equip, index) => (
                        <span key={index} className="tag skill-tag">{equip}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No equipment proficiency provided</p>
                  )}
                </div>

                {/* Logistics */}
                <div className="detail-section">
                  <h3>Logistics & Experience</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Camping Experience:</span>
                      <span className="value">{application.camping_experience || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Accommodation Needs:</span>
                      <span className="value">{application.accommodation_needs || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Transportation Needs:</span>
                      <span className="value">{application.transportation_needs || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Preferred Locations</h3>
                  {application.preferred_locations && application.preferred_locations.length > 0 ? (
                    <div className="tags-container">
                      {application.preferred_locations.map((loc, index) => (
                        <span key={index} className="tag location-tag">{loc}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No location preferences provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Special Accommodations</h3>
                  {application.special_accommodations && application.special_accommodations.length > 0 ? (
                    <div className="tags-container">
                      {application.special_accommodations.map((acc, index) => (
                        <span key={index} className="tag accommodation-tag">{acc}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No special accommodations needed</p>
                  )}
                </div>

                {/* Bio & Skills */}
                <div className="detail-section">
                  <h3>Motivation / Bio</h3>
                  {application.bio ? (
                    <p className="bio-text">{application.bio}</p>
                  ) : (
                    <p className="no-data">No bio provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Additional Skills</h3>
                  {application.additional_skills ? (
                    <p className="bio-text">{application.additional_skills}</p>
                  ) : (
                    <p className="no-data">No additional skills provided</p>
                  )}
                </div>

                {/* Emergency Contact */}
                {application.emergency_contact && (
                  <div className="detail-section">
                    <h3>Emergency Contact</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Name:</span>
                        <span className="value">{application.emergency_contact.name || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Phone:</span>
                        <span className="value">{application.emergency_contact.phone || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Relationship:</span>
                        <span className="value">{application.emergency_contact.relationship || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status & Verification */}
                <div className="detail-section">
                  <h3>Verification Status</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Verification Status:</span>
                      <span className="value">{application.verification_status || 'Pending'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Background Check:</span>
                      <span className="value">
                        {application.background_check_completed ? 'Completed' : 'Not completed'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Terms Accepted:</span>
                      <span className="value">{application.terms_accepted ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Data Consent:</span>
                      <span className="value">{application.data_consent ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="detail-section">
                  <h3>Total Followers</h3>
                  {application.followers_count !== undefined ? (
                    <p className="followers-value">{application.followers_count.toLocaleString()}</p>
                  ) : (
                    <p className="no-data">No follower count provided</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Social Media Profiles</h3>
                  {application.social_media_links && Object.keys(application.social_media_links).length > 0 ? (
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
                  ) : (
                    <p className="no-data">No social media links provided</p>
                  )}
                </div>
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
