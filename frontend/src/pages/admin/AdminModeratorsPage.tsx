import React, { useState } from 'react';
import ModeratorFormStepper from '../../components/admin/ModeratorFormStepper';
import '../../styles/pages/admin/AdminModeratorsPage.scss';
import Button from '../../components/Button';

interface Moderator {
  name: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
  image?: string;
}

const mockModerators: Moderator[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@stellarion.com',
    section: 'Astronomy',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Bob Smith',
    email: 'bob@stellarion.com',
    section: 'Physics',
    status: 'Inactive',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Carol Lee',
    email: 'carol@stellarion.com',
    section: 'Events',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'David Kim',
    email: 'david@stellarion.com',
    section: 'Technology',
    status: 'Active',
    image: 'https://randomuser.me/api/portraits/men/65.jpg'
  },

];

const AdminModeratorsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>(mockModerators);

  const handleAddModerator = (newModerator: Moderator) => {
    setModerators([...moderators, newModerator]);
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
          <div className="moderator-card moderator-card--modern" key={idx}>
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
    </div>
  );
};

export default AdminModeratorsPage;
