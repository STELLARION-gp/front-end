import React, { useEffect } from 'react';
import Button from './Button';
import '../styles/components/_successMessage.scss';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ErrorCircleIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

interface SuccessMessageProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
  buttonText?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  isOpen,
  title,
  message,
  type = 'success',
  buttonText = 'OK',
  autoClose = false,
  autoCloseDelay = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="message-icon success" />;
      case 'error':
        return <ErrorCircleIcon className="message-icon error" />;
      case 'warning':
        return <WarningIcon className="message-icon warning" />;
      default:
        return <CheckCircleIcon className="message-icon success" />;
    }
  };

  return (
    <div className="success-message-overlay" onClick={onClose}>
      <div className={`success-message ${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="success-message-icon">
          {getIcon()}
        </div>
        
        <div className="success-message-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        
        <div className="success-message-footer">
          <Button
            variant="primary"
            size="medium"
            onClick={onClose}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
