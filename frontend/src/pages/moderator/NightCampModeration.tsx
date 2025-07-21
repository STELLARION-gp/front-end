import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaStar, FaPlus, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/moderator/NightCampModeration.scss';

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
  };
  location: {
    name: string;
    coordinates: [number, number];
    accessibility: string;
    lightPollution: string;
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
}

const NightCampModeration: React.FC = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState<NightCamp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockCamps: NightCamp[] = [
      {
        id: 'camp-001',
        title: 'Perseid Meteor Shower Night Camp',
        description: 'Join us for an unforgettable night under the stars during the peak of the Perseid meteor shower. We\'ll set up camp at a dark sky location with professional telescopes and experienced guides.',
        organizer: {
          name: 'Dr. Sarah Chen',
          avatar: 'SC',
          userId: 'user_456',
          rating: 4.8,
          totalEvents: 23
        },
        location: {
          name: 'Dark Sky Reserve, Nevada',
          coordinates: [39.3210, -114.8853],
          accessibility: 'Moderate hiking required',
          lightPollution: 'Bortle 1'
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
          provided: ['Telescopes', 'Red flashlights', 'Star charts', 'Camping chairs'],
          required: ['Sleeping bag', 'Warm clothing', 'Personal water'],
          optional: ['Personal telescope', 'Camera equipment', 'Snacks']
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
        }
      },
      {
        id: 'camp-002',
        title: 'Winter Solstice Astronomical Photography Camp',
        description: 'A specialized night camp for astrophotography enthusiasts. Learn deep-sky imaging techniques while capturing the winter constellations.',
        organizer: {
          name: 'Marcus Rodriguez',
          avatar: 'MR',
          userId: 'user_789',
          rating: 4.6,
          totalEvents: 15
        },
        location: {
          name: 'Joshua Tree National Park',
          coordinates: [33.8734, -115.9010],
          accessibility: 'Easy vehicle access',
          lightPollution: 'Bortle 2'
        },
        schedule: {
          startDate: '2024-12-21T18:00:00Z',
          endDate: '2024-12-22T08:00:00Z',
          duration: '14 hours',
          weatherDependent: true
        },
        capacity: {
          max: 15,
          current: 12,
          waitlist: 8
        },
        equipment: {
          provided: ['Mounting equipment', 'Power supplies', 'Laptops with software'],
          required: ['DSLR/Mirrorless camera', 'Tripod', 'Warm clothes'],
          optional: ['Telephoto lens', 'Star tracker', 'Personal laptop']
        },
        safety: {
          emergencyContact: '+1-555-0456',
          firstAidCertified: true,
          insuranceCoverage: true,
          riskAssessment: true
        },
        costs: {
          participation: 85,
          equipment: 25,
          food: 30,
          total: 140
        },
        status: 'needs-review',
        priority: 'medium',
        reportCount: 2,
        submittedAt: '2024-01-10T14:20:00Z',
        approvalDeadline: '2024-01-30T23:59:59Z',
        verificationChecks: {
          locationVerified: true,
          organizerVerified: true,
          safetyChecked: true,
          equipmentVerified: false,
          insuranceValidated: true
        }
      }
    ];

    setTimeout(() => {
      setCamps(mockCamps);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || camp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (campId: string) => {
    setCamps(prev => prev.map(camp =>
      camp.id === campId ? { ...camp, status: 'approved' as const } : camp
    ));
  };

  const handleReject = (campId: string) => {
    setCamps(prev => prev.map(camp =>
      camp.id === campId ? { ...camp, status: 'rejected' as const } : camp
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="nightcamp-moderation">
        <div className="nightcamp-header1">
          <div className="nightcamp-header-content1">
            <div className="nightcamp-header-left1">
              <Button
                variant="ghost"
                size="medium"
                onClick={() => navigate('/moderation')}
              >
                ← Back
              </Button>
              <div className="nightcamp-title-section1">
                <h1>Loading Night Camps...</h1>
                <p>Please wait while we fetch the events</p>
              </div>
            </div>
          </div>
        </div>
        <div className="nightcamp-loading-container">
          <div className="nightcamp-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="nightcamp-moderation">
      {/* Header */}
      <div className="nightcamp-header">
        <div className="nightcamp-header-content">
          <div className="nightcamp-header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/moderation')}
            >
              ← Back
            </Button>
            <div className="nightcamp-title-section">
              <h1>Night Camp Moderation</h1>
              <p>Review and approve overnight stargazing events</p>
            </div>
          </div>
          <div className="nightcamp-header-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate('/moderation/night-camps/create')}
            >
              <FaPlus /> Create Night Camp
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="nightcamp-controls">
        <div className="nightcamp-search-box">
          <FaSearch className="nightcamp-search-icon" />
          <input
            type="text"
            placeholder="Search camps, organizers, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="nightcamp-filter-tabs">
          {['all', 'pending', 'approved', 'needs-review', 'rejected'].map(filter => (
            <Button
              key={filter}
              variant={filterStatus === filter ? 'primary' : 'border'}
              size="small"
              onClick={() => setFilterStatus(filter)}
            >
              {filter === 'all' ? 'ALL' : filter.replace('-', ' ').toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="nightcamp-content">
        <div className="nightcamp-list">
          {filteredCamps.map(camp => (
            <div key={camp.id} className="nightcamp-item">
              <div className="nightcamp-item-header">
                <div className="nightcamp-item-info">
                  <div className="nightcamp-icon">
                    🏕️
                  </div>
                  <div className="nightcamp-item-details">
                    <h3 className="nightcamp-title">{camp.title}</h3>
                    <p className="nightcamp-organizer">by {camp.organizer.name}</p>
                    <div className="nightcamp-meta">
                      <span className="nightcamp-meta-item">
                        <FaCalendarAlt />
                        {formatDate(camp.schedule.startDate)}
                      </span>
                      <span className="nightcamp-meta-item">
                        <FaMapMarkerAlt />
                        {camp.location.name}
                      </span>
                      <span className="nightcamp-meta-item">
                        <FaUsers />
                        {camp.capacity.current}/{camp.capacity.max} participants
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nightcamp-status-badges">
                  <div className={`nightcamp-priority-badge priority-${camp.priority}`}>
                    {camp.priority}
                  </div>
                  <div className={`nightcamp-status-badge status-${camp.status.replace('-', '')}`}>
                    {camp.status.replace('-', ' ')}
                  </div>
                </div>
              </div>

              <div className="nightcamp-item-content">
                <div className="nightcamp-description">
                  <p>{camp.description.substring(0, 150)}...</p>
                </div>

                <div className="nightcamp-stats">
                  <div className="nightcamp-stat-item">
                    <span className="nightcamp-label">Duration:</span>
                    <span className="nightcamp-value">{camp.schedule.duration}</span>
                  </div>
                  <div className="nightcamp-stat-item">
                    <span className="nightcamp-label">Total Cost:</span>
                    <span className="nightcamp-value">${camp.costs.total}</span>
                  </div>
                  <div className="nightcamp-stat-item">
                    <span className="nightcamp-label">Rating:</span>
                    <span className="nightcamp-value">
                      <FaStar className="nightcamp-star-icon" />
                      {camp.organizer.rating}
                    </span>
                  </div>
                  {camp.reportCount > 0 && (
                    <div className="nightcamp-stat-item">
                      <span className="nightcamp-label">Reports:</span>
                      <span className="nightcamp-value warning">{camp.reportCount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="nightcamp-item-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate(`/moderation/night-camps/details/${camp.id}`)}
                >
                  <FaEye /> View Details
                </Button>
                <Button
                  variant="success"
                  size="small"
                  onClick={() => handleApprove(camp.id)}
                  disabled={camp.status === 'approved'}
                >
                  ✓ Approve
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleReject(camp.id)}
                  disabled={camp.status === 'rejected'}
                >
                  ✗ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NightCampModeration;
