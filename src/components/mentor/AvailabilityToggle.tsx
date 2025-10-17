import React from 'react';
import '../../styles/components/mentor/AvailabilityToggle.scss';

interface AvailabilityToggleProps {
  isAccepting: boolean;
  onToggle: (accepting: boolean) => void;
  isPaused: boolean;
  onPauseToggle: (paused: boolean) => void;
}

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  isAccepting,
  onToggle,
  isPaused,
  onPauseToggle
}) => {
  return (
    <div className="availability-controls">
      {/* Availability Toggle */}
      <div className="availability-item">
        <div className="availability-item__content">
          <h4 className="availability-item__title">Availability</h4>
          <p className="availability-item__description">
            {isAccepting ? 'Accepting new mentees' : 'Not accepting mentees'}
          </p>
        </div>
        <div className="availability-item__toggle">
          <div
            className={`toggle-switch ${isAccepting ? 'active' : ''}`}
            onClick={() => onToggle(!isAccepting)}
          >
            <div className="toggle-switch__slider"></div>
          </div>
          <span className={`toggle-label ${isAccepting ? 'accepting' : 'not-accepting'}`}>
            {isAccepting ? 'Accepting' : 'Not Accepting'}
          </span>
        </div>
      </div>

      {/* Temporary Pause Toggle */}
      <div className="availability-item">
        <div className="availability-item__content">
          <h4 className="availability-item__title">Temporary Pause</h4>
          <p className={`availability-item__description ${isPaused ? 'paused' : 'active'}`}>
            {isPaused ? 'Mentor is temporarily paused' : 'Mentor is active'}
          </p>
        </div>
        <div className="availability-item__toggle">
          <div
            className={`toggle-switch ${isPaused ? 'active paused' : ''}`}
            onClick={() => onPauseToggle(!isPaused)}
          >
            <div className="toggle-switch__slider"></div>
          </div>
          <span className={`toggle-label ${isPaused ? 'paused' : 'active'}`}>
            {isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityToggle;