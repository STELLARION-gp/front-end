import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Users,
  Telescope,
  Heart,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Download,
  Languages
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { GuideApplication } from '../../services/guideApplicationService';
import { API_CONFIG } from '../../config/api.config';
import '../../styles/pages/guide/_guideProfile.scss';

const GuideProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [guideData, setGuideData] = useState<GuideApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'experience' | 'documents'>('personal');

  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }

        if (!userProfile?.id) {
          setError('User profile not loaded. Please try refreshing the page.');
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch(`${API_CONFIG.API_BASE_URL}/guide-applications?user_id=${userProfile.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch guide application');
        }

        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setGuideData(result.data[0]);
        } else {
          setError('No guide application found. Please apply to become a guide first.');
        }
      } catch (err) {
        console.error('Error fetching guide profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideProfile();
  }, [navigate, user, userProfile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return 'status-accepted';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return <CheckCircle className="status-icon" />;
      case 'pending':
        return <Clock className="status-icon" />;
      case 'rejected':
        return <XCircle className="status-icon" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="guide-profile">
        <div className="guide-profile__loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !guideData) {
    return (
      <div className="guide-profile">
        <div className="guide-profile__error">
          <XCircle className="error-icon" />
          <h2>Unable to Load Profile</h2>
          <p>{error || 'No guide application found'}</p>
          <button className="btn-primary" onClick={() => navigate('/guide/apply')}>
            Apply to Become a Guide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-profile">
      <div className="guide-profile__container">
        {/* Header Section */}
        <motion.div
          className="guide-profile__header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-avatar">
            <div className="avatar-circle">
              <User className="avatar-icon" />
            </div>
          </div>

          <div className="header-info">
            <h1 className="header-name">{guideData.first_name} {guideData.last_name}</h1>
            <p className="header-email">{guideData.email}</p>
            
            <div className={`header-status ${getStatusColor(guideData.approve_application_status)}`}>
              {getStatusIcon(guideData.approve_application_status)}
              <span>
                {guideData.approve_application_status === 'accepted' && 'Verified Guide'}
                {guideData.approve_application_status === 'pending' && 'Application Pending'}
                {guideData.approve_application_status === 'rejected' && 'Application Rejected'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="guide-profile__stats">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Award className="stat-icon" />
            <div className="stat-content">
              <h3>{guideData.total_experience}</h3>
              <p>Years Experience</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Star className="stat-icon" />
            <div className="stat-content">
              <h3>{guideData.certifications?.length || 0}</h3>
              <p>Certifications</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Globe className="stat-icon" />
            <div className="stat-content">
              <h3>{guideData.languages?.length || 0}</h3>
              <p>Languages</p>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Telescope className="stat-icon" />
            <div className="stat-content">
              <h3>{guideData.astronomy_skills?.length || 0}</h3>
              <p>Skills</p>
            </div>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="guide-profile__tabs">
          <button
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={18} />
            Personal Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            <Briefcase size={18} />
            Professional
          </button>
          <button
            className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Award size={18} />
            Experience
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={18} />
            Documents
          </button>
        </div>

        {/* Tab Content */}
        <motion.div
          className="guide-profile__content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="content-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <label>Full Name</label>
                    <p>{guideData.first_name} {guideData.last_name}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" />
                  <div className="info-content">
                    <label>Email Address</label>
                    <p>{guideData.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Phone className="info-icon" />
                  <div className="info-content">
                    <label>Phone Number</label>
                    <p>{guideData.phone}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Calendar className="info-icon" />
                  <div className="info-content">
                    <label>Date of Birth</label>
                    <p>{guideData.date_of_birth ? new Date(guideData.date_of_birth).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>Address</label>
                    <p>{guideData.address || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>City</label>
                    <p>{guideData.city || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Emergency Contact</h3>
              <div className="info-grid">
                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <label>Contact Name</label>
                    <p>{guideData.emergency_contact?.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Phone className="info-icon" />
                  <div className="info-content">
                    <label>Contact Phone</label>
                    <p>{guideData.emergency_contact?.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Heart className="info-icon" />
                  <div className="info-content">
                    <label>Relationship</label>
                    <p>{guideData.emergency_contact?.relationship || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professional Information Tab */}
          {activeTab === 'professional' && (
            <div className="content-section">
              <h2 className="section-title">Professional Background</h2>
              
              <div className="info-grid">
                <div className="info-item full-width">
                  <Briefcase className="info-icon" />
                  <div className="info-content">
                    <label>Current Occupation</label>
                    <p>{guideData.current_occupation || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <GraduationCap className="info-icon" />
                  <div className="info-content">
                    <label>Education Level</label>
                    <p>{guideData.education_level || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <Telescope className="info-icon" />
                  <div className="info-content">
                    <label>Astronomy Education</label>
                    <p>{guideData.astronomy_education || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <Award className="info-icon" />
                  <div className="info-content">
                    <label>Guide Experience</label>
                    <p>{guideData.guide_experience || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Languages</h3>
              <div className="tags-container">
                {guideData.languages && guideData.languages.length > 0 ? (
                  guideData.languages.map((lang, index) => (
                    <span key={index} className="tag tag-language">
                      <Languages size={14} />
                      {lang}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No languages specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Certifications</h3>
              <div className="tags-container">
                {guideData.certifications && guideData.certifications.length > 0 ? (
                  guideData.certifications.map((cert, index) => (
                    <span key={index} className="tag tag-certification">
                      <Award size={14} />
                      {cert}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No certifications specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Astronomy Skills</h3>
              <div className="tags-container">
                {guideData.astronomy_skills && guideData.astronomy_skills.length > 0 ? (
                  guideData.astronomy_skills.map((skill, index) => (
                    <span key={index} className="tag tag-skill">
                      <Star size={14} />
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No skills specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Qualifications</h3>
              <div className="qualifications-grid">
                <div className="qualification-item">
                  <Shield className={guideData.first_aid ? 'icon-success' : 'icon-muted'} />
                  <span>First Aid Certified</span>
                  {guideData.first_aid ? (
                    <CheckCircle className="check-icon" size={16} />
                  ) : (
                    <XCircle className="x-icon" size={16} />
                  )}
                </div>

                <div className="qualification-item">
                  <Shield className={guideData.driving_license ? 'icon-success' : 'icon-muted'} />
                  <span>Driving License</span>
                  {guideData.driving_license ? (
                    <CheckCircle className="check-icon" size={16} />
                  ) : (
                    <XCircle className="x-icon" size={16} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="content-section">
              <h2 className="section-title">Experience & Expertise</h2>

              <div className="info-item full-width">
                <Award className="info-icon" />
                <div className="info-content">
                  <label>Total Experience</label>
                  <p>{guideData.total_experience} years</p>
                </div>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Camp Types</h3>
              <div className="tags-container">
                {guideData.camp_types && guideData.camp_types.length > 0 ? (
                  guideData.camp_types.map((type, index) => (
                    <span key={index} className="tag tag-camp">
                      <Telescope size={14} />
                      {type}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No camp types specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Group Sizes</h3>
              <div className="tags-container">
                {guideData.group_sizes && guideData.group_sizes.length > 0 ? (
                  guideData.group_sizes.map((size, index) => (
                    <span key={index} className="tag tag-group">
                      <Users size={14} />
                      {size}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No group sizes specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Equipment Familiarity</h3>
              <div className="tags-container">
                {guideData.equipment_familiarity && guideData.equipment_familiarity.length > 0 ? (
                  guideData.equipment_familiarity.map((equipment, index) => (
                    <span key={index} className="tag tag-equipment">
                      <Telescope size={14} />
                      {equipment}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No equipment specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Outdoor Experience</h3>
              <div className="text-content">
                <p>{guideData.outdoor_experience || 'Not provided'}</p>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Motivation</h3>
              <div className="text-content">
                <p>{guideData.motivation || 'Not provided'}</p>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Special Skills</h3>
              <div className="text-content">
                <p>{guideData.special_skills || 'Not provided'}</p>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Preferred Locations</h3>
              <div className="tags-container">
                {guideData.preferred_locations && guideData.preferred_locations.length > 0 ? (
                  guideData.preferred_locations.map((location, index) => (
                    <span key={index} className="tag tag-location">
                      <MapPin size={14} />
                      {location}
                    </span>
                  ))
                ) : (
                  <p className="no-data">No preferred locations specified</p>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Accommodation & Transportation</h3>
              <div className="info-grid">
                <div className="info-item full-width">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>Accommodation Needs</label>
                    <p>{guideData.accommodation_needs || 'Not provided'}</p>
                  </div>
                </div>

                <div className="info-item full-width">
                  <MapPin className="info-icon" />
                  <div className="info-content">
                    <label>Transportation Needs</label>
                    <p>{guideData.transportation_needs || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="content-section">
              <h2 className="section-title">Documents & Verification</h2>

              <div className="documents-grid">
                {guideData.documents?.resume && (
                  <div className="document-card">
                    <FileText className="document-icon" />
                    <div className="document-info">
                      <h4>Resume/CV</h4>
                      <p>Professional resume document</p>
                    </div>
                    <a
                      href={guideData.documents.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                )}

                {guideData.documents?.certifications && (
                  <div className="document-card">
                    <Award className="document-icon" />
                    <div className="document-info">
                      <h4>Certifications</h4>
                      <p>Professional certifications</p>
                    </div>
                    <a
                      href={guideData.documents.certifications}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                )}

                {guideData.documents?.portfolio && (
                  <div className="document-card">
                    <FileText className="document-icon" />
                    <div className="document-info">
                      <h4>Portfolio</h4>
                      <p>Work portfolio and samples</p>
                    </div>
                    <a
                      href={guideData.documents.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                )}

                {guideData.documents?.idCard && (
                  <div className="document-card">
                    <Shield className="document-icon" />
                    <div className="document-info">
                      <h4>ID Card</h4>
                      <p>Identification document</p>
                    </div>
                    <a
                      href={guideData.documents.idCard}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </div>
                )}

                {(!guideData.documents || Object.keys(guideData.documents).length === 0) && (
                  <div className="no-documents">
                    <FileText className="no-documents-icon" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Application Status</h3>
              <div className="status-details">
                <div className="status-item">
                  <label>Application Status</label>
                  <div className={`status-badge ${getStatusColor(guideData.application_status)}`}>
                    {getStatusIcon(guideData.application_status)}
                    <span>{guideData.application_status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="status-item">
                  <label>Approval Status</label>
                  <div className={`status-badge ${getStatusColor(guideData.approve_application_status)}`}>
                    {getStatusIcon(guideData.approve_application_status)}
                    <span>{guideData.approve_application_status.toUpperCase()}</span>
                  </div>
                </div>

                <div className="status-item">
                  <label>Submitted At</label>
                  <p>{guideData.submitted_at ? new Date(guideData.submitted_at).toLocaleString() : 'Not available'}</p>
                </div>

                <div className="status-item">
                  <label>Last Updated</label>
                  <p>{guideData.updated_at ? new Date(guideData.updated_at).toLocaleString() : 'Not available'}</p>
                </div>
              </div>

              <div className="section-divider"></div>

              <h3 className="subsection-title">Agreements</h3>
              <div className="agreements-list">
                <div className="agreement-item">
                  {guideData.terms_accepted ? (
                    <CheckCircle className="agreement-icon success" />
                  ) : (
                    <XCircle className="agreement-icon error" />
                  )}
                  <span>Terms and Conditions Accepted</span>
                </div>

                <div className="agreement-item">
                  {guideData.background_check_consent ? (
                    <CheckCircle className="agreement-icon success" />
                  ) : (
                    <XCircle className="agreement-icon error" />
                  )}
                  <span>Background Check Consent Given</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GuideProfile;
