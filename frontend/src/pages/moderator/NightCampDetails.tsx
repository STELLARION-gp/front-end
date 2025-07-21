import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaStar, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/NightCampDetails.scss';

interface NightCamp {
  id: string;
  title: string;
  description: string;
  organizer: {
    name: string;
    avatar: string;
    userId: string;
    rating: number;
    totalEvents: number;
    email: string;
    phone: string;
  };
  location: {
    name: string;
    coordinates: [number, number];
    accessibility: string;
    lightPollution: string;
    address: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    duration: string;
    weatherDependent: boolean;
  };
  capacity: {
    max: number;
    current: number;
    waitlist: number;
  };
  equipment: {
    provided: string[];
    required: string[];
    optional: string[];
  };
  safety: {
    emergencyContact: string;
    firstAidCertified: boolean;
    insuranceCoverage: boolean;
    riskAssessment: boolean;
  };
  costs: {
    participation: number;
    equipment: number;
    food: number;
    total: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  priority: 'critical' | 'high' | 'medium' | 'low';
  reportCount: number;
  submittedAt: string;
  approvalDeadline: string;
  verificationChecks: {
    locationVerified: boolean;
    organizerVerified: boolean;
    safetyChecked: boolean;
    equipmentVerified: boolean;
    insuranceValidated: boolean;
  };
  images: string[];
  activities: string[];
  reports?: Array<{
    id: string;
    reason: string;
    description: string;
    submittedBy: string;
    submittedAt: string;
  }>;
}

const NightCampDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [camp, setCamp] = useState<NightCamp | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock data fetch
    const mockCamp: NightCamp = {
      id: id || 'camp-001',
      title: 'Perseid Meteor Shower Night Camp',
      description: 'Join us for an unforgettable night under the stars during the peak of the Perseid meteor shower. We\'ll set up camp at a dark sky location with professional telescopes and experienced guides. This event includes guided observations, astrophotography sessions, and educational presentations about meteor showers and deep-sky objects.',
      organizer: {
        name: 'Dr. Sarah Chen',
        avatar: 'SC',
        userId: 'user_456',
        rating: 4.8,
        totalEvents: 23,
        email: 'sarah.chen@stargazing.com',
        phone: '+1-555-0123'
      },
      location: {
        name: 'Dark Sky Reserve, Nevada',
        coordinates: [39.3210, -114.8853],
        accessibility: 'Moderate hiking required',
        lightPollution: 'Bortle 1',
        address: '1234 Desert Sky Road, Nevada, USA 89001'
      },
      schedule: {
        startDate: '2024-08-12T20:00:00Z',
        endDate: '2024-08-13T06:00:00Z',
        duration: '10 hours',
        weatherDependent: true
      },
      capacity: {
        max: 25,
        current: 18,
        waitlist: 5
      },
      equipment: {
        provided: ['Professional telescopes', 'Red flashlights', 'Star charts', 'Camping chairs', 'Observation tables'],
        required: ['Sleeping bag', 'Warm clothing', 'Personal water bottle', 'Personal flashlight'],
        optional: ['Personal telescope', 'Camera equipment', 'Snacks', 'Portable chair']
      },
      safety: {
        emergencyContact: '+1-555-0123',
        firstAidCertified: true,
        insuranceCoverage: true,
        riskAssessment: true
      },
      costs: {
        participation: 45,
        equipment: 15,
        food: 20,
        total: 80
      },
      status: 'pending',
      priority: 'high',
      reportCount: 0,
      submittedAt: '2024-01-15T10:30:00Z',
      approvalDeadline: '2024-01-25T23:59:59Z',
      verificationChecks: {
        locationVerified: true,
        organizerVerified: true,
        safetyChecked: false,
        equipmentVerified: true,
        insuranceValidated: false
      },
      images: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ],
      activities: [
        'Guided telescope observations',
        'Meteor shower viewing',
        'Astrophotography workshop',
        'Deep-sky object identification',
        'Constellation tour',
        'Light pollution education'
      ]
    };

    setTimeout(() => {
      setCamp(mockCamp);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApprove = () => {
    if (camp) {
      setCamp(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleReject = () => {
    if (camp) {
      setCamp(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const handleRequestChanges = () => {
    if (camp) {
      setCamp(prev => prev ? { ...prev, status: 'needs-review' } : null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletionPercentage = (checks: NightCamp['verificationChecks']) => {
    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="nightcamp-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/night-camps')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Loading Night Camp Details...</h1>
                <p>Please wait while we fetch the camp information</p>
              </div>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!camp) {
    return (
      <div className="nightcamp-details">
        <div className="details-header">
          <div className="header-content">
            <div className="header-left">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/dashboard/moderation/night-camps')}
              >
                ← Back
              </Button>
              <div className="title-section">
                <h1>Night Camp Not Found</h1>
                <p>The requested night camp could not be found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nightcamp-details">
      {/* Header */}
      <div className="details-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation/night-camps')}
            >
              ← Back
            </Button>
            <div className="title-section">
              <h1>{camp.title}</h1>
              <p>Night Camp Event Details & Moderation</p>
            </div>
          </div>
          <div className="header-badges">
            <div className={`priority-badge priority-${camp.priority}`}>
              {camp.priority}
            </div>
            <div className={`status-badge status-${camp.status.replace('-', '')}`}>
              {camp.status.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="details-nav">
        <div className="nav-tabs">
          {['overview', 'organizer', 'safety', 'verification'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'border'}
              size="small"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="details-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="content-grid">
              <div className="main-section">
                <div className="info-card">
                  <h3>Event Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <strong>Start Date:</strong>
                        <span>{formatDate(camp.schedule.startDate)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaCalendarAlt />
                      <div>
                        <strong>End Date:</strong>
                        <span>{formatDate(camp.schedule.endDate)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <div>
                        <strong>Location:</strong>
                        <span>{camp.location.name}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaUsers />
                      <div>
                        <strong>Capacity:</strong>
                        <span>{camp.capacity.current}/{camp.capacity.max} participants</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Description</h3>
                  <p>{camp.description}</p>
                </div>

                <div className="info-card">
                  <h3>Activities</h3>
                  <div className="activities-list">
                    {camp.activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <FaCheck className="check-icon" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-card">
                  <h3>Equipment</h3>
                  <div className="equipment-sections">
                    <div className="equipment-section">
                      <h4>Provided</h4>
                      <ul>
                        {camp.equipment.provided.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="equipment-section">
                      <h4>Required</h4>
                      <ul>
                        {camp.equipment.required.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="equipment-section">
                      <h4>Optional</h4>
                      <ul>
                        {camp.equipment.optional.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{camp.capacity.current}</span>
                      <span className="stat-label">Registered</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{camp.capacity.waitlist}</span>
                      <span className="stat-label">Waitlist</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">${camp.costs.total}</span>
                      <span className="stat-label">Total Cost</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{getCompletionPercentage(camp.verificationChecks)}%</span>
                      <span className="stat-label">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Cost Breakdown</h3>
                  <div className="cost-breakdown">
                    <div className="cost-item">
                      <span>Participation Fee:</span>
                      <span>${camp.costs.participation}</span>
                    </div>
                    <div className="cost-item">
                      <span>Equipment Rental:</span>
                      <span>${camp.costs.equipment}</span>
                    </div>
                    <div className="cost-item">
                      <span>Food & Beverages:</span>
                      <span>${camp.costs.food}</span>
                    </div>
                    <div className="cost-item total">
                      <span>Total Cost:</span>
                      <span>${camp.costs.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organizer' && (
          <div className="organizer-tab">
            <div className="info-card">
              <h3>Organizer Information</h3>
              <div className="organizer-profile">
                <div className="organizer-avatar-large">
                  {camp.organizer.avatar}
                </div>
                <div className="organizer-details">
                  <h4>{camp.organizer.name}</h4>
                  <div className="organizer-rating">
                    <FaStar className="star-icon" />
                    <span>{camp.organizer.rating}</span>
                    <span>({camp.organizer.totalEvents} events)</span>
                  </div>
                  <div className="contact-info">
                    <div className="contact-item">
                      <strong>Email:</strong>
                      <span>{camp.organizer.email}</span>
                    </div>
                    <div className="contact-item">
                      <strong>Phone:</strong>
                      <span>{camp.organizer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="safety-tab">
            <div className="info-card">
              <h3>Safety Information</h3>
              <div className="safety-checks">
                <div className={`safety-item ${camp.safety.firstAidCertified ? 'verified' : 'pending'}`}>
                  <div className="safety-icon">
                    {camp.safety.firstAidCertified ? <FaCheck /> : <FaTimes />}
                  </div>
                  <span>First Aid Certified</span>
                </div>
                <div className={`safety-item ${camp.safety.insuranceCoverage ? 'verified' : 'pending'}`}>
                  <div className="safety-icon">
                    {camp.safety.insuranceCoverage ? <FaCheck /> : <FaTimes />}
                  </div>
                  <span>Insurance Coverage</span>
                </div>
                <div className={`safety-item ${camp.safety.riskAssessment ? 'verified' : 'pending'}`}>
                  <div className="safety-icon">
                    {camp.safety.riskAssessment ? <FaCheck /> : <FaTimes />}
                  </div>
                  <span>Risk Assessment Complete</span>
                </div>
              </div>
              <div className="emergency-contact">
                <strong>Emergency Contact:</strong>
                <span>{camp.safety.emergencyContact}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="verification-tab">
            <div className="info-card">
              <h3>Verification Status</h3>
              <div className="verification-progress">
                <div className="progress-header">
                  <span>Overall Progress: {getCompletionPercentage(camp.verificationChecks)}%</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      data-progress={getCompletionPercentage(camp.verificationChecks)}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="verification-checklist">
                {Object.entries(camp.verificationChecks).map(([key, checked]) => (
                  <div key={key} className={`verification-item ${checked ? 'verified' : 'pending'}`}>
                    <div className="verification-icon">
                      {checked ? <FaCheck /> : <FaClock />}
                    </div>
                    <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="details-actions">
        <Button
          variant="success"
          size="medium"
          onClick={handleApprove}
          disabled={camp.status === 'approved'}
        >
          <FaCheck /> Approve Event
        </Button>
        <Button
          variant="warning"
          size="medium"
          onClick={handleRequestChanges}
          disabled={camp.status === 'needs-review'}
        >
          <FaClock /> Request Changes
        </Button>
        <Button
          variant="danger"
          size="medium"
          onClick={handleReject}
          disabled={camp.status === 'rejected'}
        >
          <FaTimes /> Reject Event
        </Button>
      </div>
    </div>
  );
};

export default NightCampDetails;
