import React, { useState } from 'react';
import ModeratorFormStepper from '../../components/admin/ModeratorFormStepper';
import '../../styles/pages/admin/AdminModeratorsPage.scss';
import Button from '../../components/Button';
import ModeratorAnalyticsModal from '../../components/admin/ModeratorAnalyticsModal';

interface ModeratorAnalytics {
  totalCamps: number;
  totalEvents: number;
  totalModerations: number;
  avgRating: number;
  campTrend: number;
  eventTrend: number;
  moderationTrend: number;
  recentCamps: Array<{ name: string; date: string; participants: number; rating: number }>;
  recentEvents: Array<{ name: string; date: string; attendees: number; rating: number }>;
}

interface Moderator {
  name: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
  contact?: string;
  image?: string;
  analytics: ModeratorAnalytics;
}

const mockAnalytics: ModeratorAnalytics = {
  totalCamps: 12,
  totalEvents: 8,
  totalModerations: 34,
  avgRating: 4.82,
  campTrend: 18,
  eventTrend: 12,
  moderationTrend: 5,
  recentCamps: [
    { name: 'Stellar Night', date: '2025-07-10', participants: 45, rating: 4.9 },
    { name: 'Cosmic Camp', date: '2025-06-22', participants: 38, rating: 4.8 },
    { name: 'Galaxy Watch', date: '2025-06-05', participants: 42, rating: 4.7 },
  ],
  recentEvents: [
    { name: 'Tech Expo', date: '2025-07-15', attendees: 120, rating: 4.8 },
    { name: 'Astronomy Day', date: '2025-06-30', attendees: 95, rating: 4.7 },
    { name: 'Physics Fest', date: '2025-06-12', attendees: 80, rating: 4.6 },
  ],
};

const mockModerators: Moderator[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@stellarion.com',
    section: 'Astronomy',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    analytics: mockAnalytics
  },
  {
    name: 'Bob Smith',
    email: 'bob@stellarion.com',
    section: 'Physics',
    status: 'Inactive',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    analytics: mockAnalytics
  },
  {
    name: 'Carol Lee',
    email: 'carol@stellarion.com',
    section: 'Events',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    analytics: mockAnalytics
  },
  {
    name: 'David Kim',
    email: 'david@stellarion.com',
    section: 'Technology',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    analytics: mockAnalytics
  },
];

const AdminModeratorsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>(mockModerators);
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleAddModerator = (newModerator: Omit<Moderator, 'analytics'>) => {
    setModerators([
      ...moderators,
      {
        ...newModerator,
        analytics: mockAnalytics
      }
    ]);
  };

  const handleCardClick = (mod: Moderator) => {
    setSelectedModerator(mod);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (email: string, newStatus: 'Active' | 'Inactive') => {
    setModerators(prev => prev.map(m => m.email === email ? { ...m, status: newStatus } : m));
    if (selectedModerator) setSelectedModerator({ ...selectedModerator, status: newStatus });
  };

  return (
    <div className="admin-moderators-page">
      <div className="admin-header-row">
        <h1 className="admin-title">Moderators</h1>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Create Moderator
        </Button>
      </div>
      <div className="moderators-list">
        {moderators.map((mod, idx) => (
          <div className="moderator-card moderator-card--modern" key={idx} onClick={() => handleCardClick(mod)} style={{cursor:'pointer'}}>
            <div className="moderator-card__avatar-bg">
              <img
                src={mod.image}
                alt={mod.name}
                className="moderator-card__image"
              />
            </div>
            <div className="moderator-card__info">
              <div className="moderator-card__name">{mod.name}</div>
              <div className="moderator-card__email">{mod.email}</div>
              <div className="moderator-card__section">Section: <b>{mod.section}</b></div>
              <div className={`moderator-card__status ${mod.status.toLowerCase()}`}>{mod.status}</div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ModeratorFormStepper
              onClose={() => setShowModal(false)}
              onSubmit={handleAddModerator}
            />
          </div>
        </div>
      )}
      {showDetailsModal && selectedModerator && (
        <div className="moderator-analytics-modal-overlay">
          <ModeratorAnalyticsModal
            moderator={selectedModerator}
            onClose={() => setShowDetailsModal(false)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminModeratorsPage;
