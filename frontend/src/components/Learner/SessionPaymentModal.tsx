import React, { useState } from "react";
import Button from "../Button";
import "../../styles/components/learner/SessionPaymentModal.scss";

interface SessionPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPayment: (cardDetails: CardDetails) => void;
  sessionTitle: string;
  amount: number;
  loading?: boolean;
}

export interface CardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

const SessionPaymentModal: React.FC<SessionPaymentModalProps> = ({
  open,
  onClose,
  onPayment,
  sessionTitle,
  amount,
  loading = false
}) => {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Partial<CardDetails>>({});

  if (!open) return null;

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Validate card details
  const validateForm = (): boolean => {
    const newErrors: Partial<CardDetails> = {};

    // Card number validation (16 digits)
    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length !== 16 || !/^\d+$/.test(cardNumberDigits)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Card holder name validation
    if (!cardDetails.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required';
    } else if (cardDetails.cardHolderName.trim().length < 3) {
      newErrors.cardHolderName = 'Name must be at least 3 characters';
    }

    // Expiry date validation (MM/YY)
    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation (3-4 digits)
    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPayment(cardDetails);
    }
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: formatCardNumber(cleaned)
      }));
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: undefined }));
      }
    }
  };

  const handleExpiryDateChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 4) {
      setCardDetails(prev => ({
        ...prev,
        expiryDate: formatExpiryDate(cleaned)
      }));
      if (errors.expiryDate) {
        setErrors(prev => ({ ...prev, expiryDate: undefined }));
      }
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCardDetails(prev => ({
        ...prev,
        cvv: value
      }));
      if (errors.cvv) {
        setErrors(prev => ({ ...prev, cvv: undefined }));
      }
    }
  };

  const handleCardHolderNameChange = (value: string) => {
    // Allow only letters and spaces
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setCardDetails(prev => ({
        ...prev,
        cardHolderName: value
      }));
      if (errors.cardHolderName) {
        setErrors(prev => ({ ...prev, cardHolderName: undefined }));
      }
    }
  };

  return (
    <div className="session-payment-modal-backdrop" onClick={onClose}>
      <div className="session-payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="payment-modal-close" onClick={onClose} disabled={loading}>
          ×
        </button>

        <div className="payment-modal-header">
          <h2>💳 Payment Details</h2>
          <p className="session-info">Session: {sessionTitle}</p>
          <div className="payment-amount">
            <span className="amount-label">Total Amount:</span>
            <span className="amount-value">Rs {amount?.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="cardNumber">
              Card Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              className={errors.cardNumber ? 'error' : ''}
              disabled={loading}
              autoComplete="cc-number"
            />
            {errors.cardNumber && (
              <span className="error-message">{errors.cardNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cardHolderName">
              Card Holder Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="cardHolderName"
              placeholder="Saman Perera"
              value={cardDetails.cardHolderName}
              onChange={(e) => handleCardHolderNameChange(e.target.value.toUpperCase())}
              className={errors.cardHolderName ? 'error' : ''}
              disabled={loading}
              autoComplete="cc-name"
            />
            {errors.cardHolderName && (
              <span className="error-message">{errors.cardHolderName}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">
                Expiry Date <span className="required">*</span>
              </label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                className={errors.expiryDate ? 'error' : ''}
                disabled={loading}
                autoComplete="cc-exp"
              />
              {errors.expiryDate && (
                <span className="error-message">{errors.expiryDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cvv">
                CVV <span className="required">*</span>
              </label>
              <input
                type="password"
                id="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => handleCvvChange(e.target.value)}
                className={errors.cvv ? 'error' : ''}
                disabled={loading}
                autoComplete="cc-csc"
                maxLength={4}
              />
              {errors.cvv && (
                <span className="error-message">{errors.cvv}</span>
              )}
            </div>
          </div>

          <div className="security-info">
            <span className="security-icon">🔒</span>
            <span className="security-text">
              Your payment information is encrypted and secure
            </span>
          </div>

          <div className="payment-modal-footer">
            <Button 
              type="button"
              variant="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : `Pay Rs ${amount?.toLocaleString()}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionPaymentModal;
