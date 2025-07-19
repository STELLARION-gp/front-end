import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, MapPin, Users, Star, CheckCircle, XCircle, AlertTriangle, Clock, Moon } from 'lucide-react';
import './NightCampModeration.scss';

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
  const [camps, setCamps] = useState<NightCamp[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<NightCamp | null>(null);
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
    if (selectedCamp?.id === campId) {
      setSelectedCamp(prev => prev ? { ...prev, status: 'approved' } : null);
    }
  };

  const handleReject = (campId: string) => {
    setCamps(prev => prev.map(camp =>
      camp.id === campId ? { ...camp, status: 'rejected' as const } : camp
    ));
    if (selectedCamp?.id === campId) {
      setSelectedCamp(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const handleRequestChanges = (campId: string) => {
    setCamps(prev => prev.map(camp =>
      camp.id === campId ? { ...camp, status: 'needs-review' as const } : camp
    ));
    if (selectedCamp?.id === campId) {
      setSelectedCamp(prev => prev ? { ...prev, status: 'needs-review' } : null);
    }
  };

  const getCompletionPercentage = (checks: NightCamp['verificationChecks']) => {
    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="night-camp-moderation">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Night Camp Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="night-camp-moderation">
      <div className="moderation-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" title="Back to Moderation Dashboard">
              <ArrowLeft size={20} />
            </button>
            <div className="title-section">
              <h1>Night Camp Moderation</h1>
              <p>Review and approve overnight stargazing events</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{camps.filter(c => c.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{camps.filter(c => c.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{camps.filter(c => c.reportCount > 0).length}</span>
              <span className="stat-label">Reported</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{camps.reduce((sum, c) => sum + c.capacity.current, 0)}</span>
              <span className="stat-label">Total Participants</span>
            </div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search camps, organizers, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-tabs">
          {['all', 'pending', 'approved', 'needs-review', 'rejected'].map(status => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="moderation-content">
        <div className="camps-list">
          {filteredCamps.map(camp => (
            <div
              key={camp.id}
              className={`camp-item ${selectedCamp?.id === camp.id ? 'selected' : ''}`}
              onClick={() => setSelectedCamp(camp)}
            >
              <div className="camp-header">
                <div className="camp-info">
                  <div className="camp-details">
                    <h3 className="camp-title">{camp.title}</h3>
                    <div className="organizer-info">
                      <div className="organizer-avatar">{camp.organizer.avatar}</div>
                      <div>
                        <p className="organizer-name">{camp.organizer.name}</p>
                        <div className="organizer-stats">
                          <Star size={12} />
                          <span>{camp.organizer.rating}</span>
                          <span>•</span>
                          <span>{camp.organizer.totalEvents} events</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="status-badges">
                  <span className={`priority-badge priority-${camp.priority}`}>
                    {camp.priority}
                  </span>
                  <span className={`status-badge status-${camp.status}`}>
                    {camp.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="camp-content">
                <div className="camp-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(camp.schedule.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{camp.location.name}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={14} />
                    <span>{camp.capacity.current}/{camp.capacity.max} participants</span>
                  </div>
                  <div className="meta-item">
                    <Moon size={14} />
                    <span>{camp.schedule.duration}</span>
                  </div>
                </div>

                <div className="verification-progress">
                  <div className="progress-info">
                    <span>Verification: {getCompletionPercentage(camp.verificationChecks)}%</span>
                    <div className="progress-bar" data-progress={getCompletionPercentage(camp.verificationChecks)} />
                  </div>
                </div>

                {camp.reportCount > 0 && (
                  <div className="report-warning">
                    <AlertTriangle size={14} />
                    <span>{camp.reportCount} report{camp.reportCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              <div className="camp-actions">
                <button
                  className="action-btn approve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(camp.id);
                  }}
                  title="Approve Camp"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className="action-btn review-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestChanges(camp.id);
                  }}
                  title="Request Changes"
                >
                  <Clock size={16} />
                </button>
                <button
                  className="action-btn reject-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(camp.id);
                  }}
                  title="Reject Camp"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedCamp && (
          <div className="detail-panel">
            <div className="panel-header">
              <h3>Camp Details</h3>
              <button className="close-panel" onClick={() => setSelectedCamp(null)}>
                ×
              </button>
            </div>
            
            <div className="panel-content">
              <div className="detail-section">
                <h4>Camp Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Title:</label>
                    <span>{selectedCamp.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Description:</label>
                    <div className="description-text">{selectedCamp.description}</div>
                  </div>
                  <div className="detail-item">
                    <label>Start Date:</label>
                    <span>{new Date(selectedCamp.schedule.startDate).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>End Date:</label>
                    <span>{new Date(selectedCamp.schedule.endDate).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{selectedCamp.schedule.duration}</span>
                  </div>
                  <div className="detail-item">
                    <label>Weather Dependent:</label>
                    <span>{selectedCamp.schedule.weatherDependent ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Location & Accessibility</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedCamp.location.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Light Pollution:</label>
                    <span className="bortle-scale">{selectedCamp.location.lightPollution}</span>
                  </div>
                  <div className="detail-item">
                    <label>Accessibility:</label>
                    <span>{selectedCamp.location.accessibility}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Capacity & Participants</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Maximum Capacity:</label>
                    <span>{selectedCamp.capacity.max} people</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Registrations:</label>
                    <span>{selectedCamp.capacity.current} people</span>
                  </div>
                  <div className="detail-item">
                    <label>Waitlist:</label>
                    <span>{selectedCamp.capacity.waitlist} people</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Equipment</h4>
                <div className="equipment-lists">
                  <div className="equipment-category">
                    <label>Provided:</label>
                    <ul>
                      {selectedCamp.equipment.provided.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="equipment-category">
                    <label>Required:</label>
                    <ul>
                      {selectedCamp.equipment.required.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="equipment-category">
                    <label>Optional:</label>
                    <ul>
                      {selectedCamp.equipment.optional.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Safety & Insurance</h4>
                <div className="safety-checks">
                  <div className={`safety-item ${selectedCamp.safety.firstAidCertified ? 'verified' : 'pending'}`}>
                    <div className="safety-icon">
                      {selectedCamp.safety.firstAidCertified ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <span>First Aid Certified</span>
                  </div>
                  <div className={`safety-item ${selectedCamp.safety.insuranceCoverage ? 'verified' : 'pending'}`}>
                    <div className="safety-icon">
                      {selectedCamp.safety.insuranceCoverage ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <span>Insurance Coverage</span>
                  </div>
                  <div className={`safety-item ${selectedCamp.safety.riskAssessment ? 'verified' : 'pending'}`}>
                    <div className="safety-icon">
                      {selectedCamp.safety.riskAssessment ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <span>Risk Assessment Complete</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Emergency Contact:</label>
                  <span>{selectedCamp.safety.emergencyContact}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Costs</h4>
                <div className="cost-breakdown">
                  <div className="cost-item">
                    <label>Participation Fee:</label>
                    <span>${selectedCamp.costs.participation}</span>
                  </div>
                  <div className="cost-item">
                    <label>Equipment Rental:</label>
                    <span>${selectedCamp.costs.equipment}</span>
                  </div>
                  <div className="cost-item">
                    <label>Food & Beverages:</label>
                    <span>${selectedCamp.costs.food}</span>
                  </div>
                  <div className="cost-item total">
                    <label>Total Cost:</label>
                    <span>${selectedCamp.costs.total}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Verification Status</h4>
                <div className="verification-checklist">
                  {Object.entries(selectedCamp.verificationChecks).map(([key, checked]) => (
                    <div key={key} className={`verification-item ${checked ? 'verified' : 'pending'}`}>
                      <div className="verification-icon">
                        {checked ? <CheckCircle size={16} /> : <Clock size={16} />}
                      </div>
                      <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-actions">
              <button className="panel-btn approve" onClick={() => handleApprove(selectedCamp.id)}>
                <CheckCircle size={16} />
                Approve
              </button>
              <button className="panel-btn review" onClick={() => handleRequestChanges(selectedCamp.id)}>
                <Clock size={16} />
                Request Changes
              </button>
              <button className="panel-btn reject" onClick={() => handleReject(selectedCamp.id)}>
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NightCampModeration;
