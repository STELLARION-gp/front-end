import React from 'react';
import Button from '../../components/Button';

interface Moderator {
  name: string;
  email: string;
  section: string;
  status: 'Active' | 'Inactive';
  contact?: string;
  image?: string;
}

interface Props {
  moderator: Moderator;
  onClose: () => void;
  onStatusChange: (email: string, newStatus: 'Active' | 'Inactive') => void;
}


import '../../styles/components/admin/ModeratorDetailsModal.scss';

const ModeratorDetailsModal: React.FC<Props> = ({ moderator, onClose, onStatusChange }) => {
  return (
    <div className="moderator-details-modal">
      <div className="modal-header">
        <h2>Moderator Details</h2>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
      </div>
      <img src={moderator.image} alt={moderator.name} className="avatar" />
      <div className="details">
        <div className="name">{moderator.name}</div>
        <div className="email">{moderator.email}</div>
        <div className="section">Section: <b>{moderator.section}</b></div>
        <div className="contact">Contact: {moderator.contact || '-'}</div>
        <div className={`status ${moderator.status.toLowerCase()}`}>Status: <span>{moderator.status}</span></div>
      </div>
      <div className="actions">
        {moderator.status === 'Active' ? (
          <Button className="modal-btn" variant="secondary" onClick={() => onStatusChange(moderator.email, 'Inactive')}>Set Inactive</Button>
        ) : (
          <Button className="modal-btn" variant="primary" onClick={() => onStatusChange(moderator.email, 'Active')}>Set Active</Button>
        )}
        <Button className="modal-btn" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default ModeratorDetailsModal;
