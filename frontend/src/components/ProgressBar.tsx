import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
  label?: string;
  showNumbers?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  className = '',
  label,
  showNumbers = true,
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className={`progress-bar ${className}`}>
      {label && (
        <div className="progress-bar__label">
          {label}
        </div>
      )}
      <div className="progress-bar__container">
        <div className="progress-bar__track">
          <div 
            className="progress-bar__fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showNumbers && (
          <div className="progress-bar__numbers">
            {current}/{max}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
