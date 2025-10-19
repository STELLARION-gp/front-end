import React from 'react';
import '../styles/components/StatusBadge.scss';

export type SessionStatus = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: SessionStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    pending: {
      icon: '⏳',
      label: 'Pending Review',
      color: '#FEF3C7',
      textColor: '#92400E',
    },
    approved: {
      icon: '✅',
      label: 'Approved',
      color: '#D1FAE5',
      textColor: '#065F46',
    },
    rejected: {
      icon: '❌',
      label: 'Rejected',
      color: '#FEE2E2',
      textColor: '#991B1B',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`status-badge status-${status} ${className}`}
      style={{
        backgroundColor: config.color,
        color: config.textColor,
      }}
    >
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
