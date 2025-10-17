import React from 'react';
import Button from './Button';
import '../styles/components/PaymentDetailsModal.scss';
import type { BookingPaymentDetails } from '../services/paymentService';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  details: BookingPaymentDetails | null;
  onClose: () => void;
  onRefund?: () => void;
  showRefundButton?: boolean;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  details,
  onClose,
  onRefund,
  showRefundButton = false,
}) => {
  if (!isOpen || !details) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // If it's a full ISO timestamp, extract just the time
    if (timeString.includes('T') || timeString.includes('Z')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    // If it's already in HH:MM or HH:MM:SS format
    if (timeString.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    }
    
    // Return as-is if format is unknown
    return timeString;
  };

  return (
    <div className="payment-details-modal-overlay" onClick={onClose}>
      <div className="payment-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="payment-modal-header">
          <div>
            <h2>Payment Details</h2>
            <p className="order-id">Order #{details.orderId}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="payment-modal-content">
          {/* Payment Information */}
          <section className="modal-section">
            <h3 className="section-title">Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Amount</span>
                <span className="info-value amount">{formatCurrency(details.amount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">
                  {details.paymentStatus}
                </span>
              </div>
              {details.paymentMethod && (
                <div className="info-item">
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{details.paymentMethod}</span>
                </div>
              )}
              {details.transactionId && (
                <div className="info-item">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value transaction-id">{details.transactionId}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Created Date</span>
                <span className="info-value">{formatDate(details.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section className="modal-section">
            <h3 className="section-title">Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{details.customer.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{details.customer.email}</span>
              </div>
              {details.customer.phone && (
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{details.customer.phone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Service Information */}
          <section className="modal-section">
            <h3 className="section-title">Service Information</h3>
            <div className="info-grid">
              <div className="info-item full-width">
                <span className="info-label">Service</span>
                <span className="info-value">{details.service.title}</span>
              </div>
              
            </div>
          </section>

          {/* Booking Details */}
          <section className="modal-section">
            <h3 className="section-title">Booking Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Date</span>
                <span className="info-value">{formatDate(details.bookingDetails.date)}</span>
              </div>
              {details.bookingDetails.time && (
                <div className="info-item">
                  <span className="info-label">Time</span>
                  <span className="info-value">{formatTime(details.bookingDetails.time)}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Participants</span>
                <span className="info-value">{details.bookingDetails.participants}</span>
              </div>
              {details.bookingDetails.specialRequests && (
                <div className="info-item full-width">
                  <span className="info-label">Special Requests</span>
                  <span className="info-value description">{details.bookingDetails.specialRequests}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="payment-modal-footer">
          <Button variant="secondary" size="medium" onClick={onClose}>
            Close
          </Button>
          {showRefundButton && onRefund && details.paymentStatus.toLowerCase() === 'completed' && (
            <Button variant="danger" size="medium" onClick={onRefund}>
              Process Refund
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
