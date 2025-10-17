import React, { useState } from 'react';
import Button from './Button';
import '../styles/components/RefundDialog.scss';

interface RefundDialogProps {
  isOpen: boolean;
  bookingDetails: {
    orderId: string;
    customerName: string;
    amount: number;
    serviceTitle: string;
  } | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const RefundDialog: React.FC<RefundDialogProps> = ({
  isOpen,
  bookingDetails,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !bookingDetails) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for the refund');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    onConfirm(reason.trim());
    setReason('');
    setError('');
  };

  const handleCancel = () => {
    setReason('');
    setError('');
    onCancel();
  };

  return (
    <div className="refund-dialog-overlay" onClick={handleCancel}>
      <div className="refund-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="refund-dialog-header">
          <div className="refund-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Process Refund</h2>
          <p className="refund-subtitle">This action will refund the payment to the customer</p>
        </div>

        {/* Content */}
        <div className="refund-dialog-content">
          {/* Booking Information */}
          <div className="refund-info-section">
            <h3>Booking Information</h3>
            <div className="refund-info-grid">
              <div className="refund-info-item">
                <span className="label">Order ID:</span>
                <span className="value">{bookingDetails.orderId}</span>
              </div>
              <div className="refund-info-item">
                <span className="label">Customer:</span>
                <span className="value">{bookingDetails.customerName}</span>
              </div>
              <div className="refund-info-item">
                <span className="label">Service:</span>
                <span className="value">{bookingDetails.serviceTitle}</span>
              </div>
              <div className="refund-info-item highlight">
                <span className="label">Refund Amount:</span>
                <span className="value amount">{formatCurrency(bookingDetails.amount)}</span>
              </div>
            </div>
          </div>

          {/* Refund Reason */}
          <div className="refund-reason-section">
            <label htmlFor="refund-reason">
              Refund Reason <span className="required">*</span>
            </label>
            <textarea
              id="refund-reason"
              className="refund-reason-input"
              placeholder="Please provide a detailed reason for this refund (minimum 10 characters)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              rows={4}
              maxLength={500}
            />
            <div className="input-footer">
              {error && <span className="error-message">{error}</span>}
              <span className="char-count">{reason.length}/500</span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="refund-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
            </svg>
            <div>
              <strong>Important:</strong> This action cannot be undone. The customer will be notified immediately about the refund.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="refund-dialog-footer">
          <Button 
            variant="secondary" 
            size="medium" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            size="medium" 
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Process Refund
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefundDialog;
