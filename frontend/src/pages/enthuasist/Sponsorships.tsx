import React, { useState } from 'react';
import { CalendarDaysIcon, MapPinIcon, CurrencyDollarIcon, UserGroupIcon, EnvelopeIcon, XMarkIcon, InformationCircleIcon, CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import Card from '../../components/Card';
import '../../styles/pages/enthusiast/Sponsorships.scss';

interface SponsorshipEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  contact: string;
  fundraisingGoal: number;
  amountRaised: number;
  category: string;
  organizer: string;
  attendees: number;
}

interface SponsorshipHistory {
  id: string;
  eventName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const Sponsorships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seeking' | 'history'>('seeking');
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SponsorshipEvent | null>(null);
  const [sponsorAmount, setSponsorAmount] = useState<string>('');
  const [sponsorMessage, setSponsorMessage] = useState<string>('');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [sponsorEmail, setSponsorEmail] = useState<string>('');
  
  // Payment Gateway States
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');

  const handleSponsorClick = (event: SponsorshipEvent) => {
    setSelectedEvent(event);
    setShowSponsorForm(true);
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!sponsorName || !sponsorEmail || !sponsorAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    const amount = parseFloat(sponsorAmount);
    if (amount < 100) {
      alert('Minimum sponsorship amount is LKR 100.');
      return;
    }

    // Show payment form
    setShowPaymentForm(true);
    setPaymentError('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      // Validate payment details
      if (paymentMethod === 'card') {
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          throw new Error('Please fill in all card details.');
        }
        
        if (cardNumber.replace(/\s/g, '').length < 16) {
          throw new Error('Please enter a valid card number.');
        }
        
        if (cvv.length < 3) {
          throw new Error('Please enter a valid CVV.');
        }
      }

      // Process payment
      await processPayment({
        amount: parseFloat(sponsorAmount),
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv,
          cardholderName
        } : null,
        sponsorDetails: {
          name: sponsorName,
          email: sponsorEmail,
          message: sponsorMessage
        },
        eventId: selectedEvent?.id
      });

      // Payment successful
      alert('Payment successful! Thank you for your sponsorship. You will receive a confirmation email shortly.');
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      console.error('Payment error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const processPayment = async (paymentData: any): Promise<void> => {
    // Simulate API call to payment gateway (replace with actual implementation)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate payment validation
        if (paymentData.amount < 100) {
          reject(new Error('Amount too low'));
          return;
        }
        
        if (paymentData.paymentMethod === 'card' && 
            paymentData.cardDetails?.cardNumber === '4000000000000002') {
          reject(new Error('Card declined. Please use a different card.'));
          return;
        }
        
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve(paymentData);
        } else {
          reject(new Error('Payment processing failed. Please try again.'));
        }
      }, 2000);
    });
  };

  const resetForm = () => {
    setShowSponsorForm(false);
    setShowPaymentForm(false);
    setSponsorAmount('');
    setSponsorMessage('');
    setSponsorName('');
    setSponsorEmail('');
    setSelectedEvent(null);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setPaymentMethod('card');
    setPaymentError('');
  };

  const closeSponsorForm = () => {
    if (!showPaymentForm) {
      resetForm();
    }
  };

  const goBackToSponsorForm = () => {
    setShowPaymentForm(false);
    setPaymentError('');
  };

  // Card formatting functions
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };


  // Mock data for events seeking sponsorship - simplified
  const eventsSeekingSponsorship: SponsorshipEvent[] = [
    {
      id: '1',
      name: 'Stargazing Night 2025',
      date: '2025-08-15',
      description: 'Join us for an enchanting evening under the stars with guided telescope observations and expert astronomy talks.',
      location: 'Dark Sky Preserve, California',
      contact: 'astronomy@stellarion.com',
      fundraisingGoal: 15000,
      amountRaised: 8500,
      category: 'Community Event',
      organizer: 'Stellarion Astronomy Club',
      attendees: 200
    },
    {
      id: '2',
      name: 'Youth Space Camp',
      date: '2025-07-20',
      description: 'A week-long intensive space education program for students aged 12-18, featuring hands-on experiments and space simulations.',
      location: 'Space Education Center, Texas',
      contact: 'spacecamp@stellarion.com',
      fundraisingGoal: 25000,
      amountRaised: 12000,
      category: 'Educational Program',
      organizer: 'Stellarion Education Foundation',
      attendees: 50
    },
    {
      id: '3',
      name: 'Mars Rover Challenge',
      date: '2025-09-10',
      description: 'Engineering competition where teams design and build Mars rovers to complete challenging terrain courses.',
      location: 'Tech Innovation Hub, Seattle',
      contact: 'rovers@stellarion.com',
      fundraisingGoal: 20000,
      amountRaised: 18500,
      category: 'Competition',
      organizer: 'Stellarion Robotics',
      attendees: 300
    },
    {
      id: '4',
      name: 'Astronomy Photography Workshop',
      date: '2025-10-05',
      description: 'Learn advanced astrophotography techniques from professional photographers and astronomers.',
      location: 'Mountain Observatory, Colorado',
      contact: 'photo@stellarion.com',
      fundraisingGoal: 8000,
      amountRaised: 3200,
      category: 'Workshop',
      organizer: 'Stellarion Photo Society',
      attendees: 75
    }
  ];

  // Mock data for sponsorship history
  const sponsorshipHistory: SponsorshipHistory[] = [
    {
      id: '1',
      eventName: 'Solar Eclipse Expedition 2024',
      amount: 2500,
      date: '2024-04-08',
      status: 'completed'
    },
    {
      id: '2',
      eventName: 'International Space Day',
      amount: 1800,
      date: '2024-05-04',
      status: 'completed'
    },
    {
      id: '3',
      eventName: 'Meteorite Hunting Adventure',
      amount: 3000,
      date: '2024-06-15',
      status: 'completed'
    },
    {
      id: '4',
      eventName: 'Space Technology Symposium',
      amount: 5000,
      date: '2024-11-20',
      status: 'pending'
    }
  ];

  // Calculate totals
  const totalContributions = sponsorshipHistory
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const eventsSponsored = sponsorshipHistory.filter(item => item.status === 'completed').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };


  return (
    <div className="sponsorships-page">
      {/* Header Section */}
      <div className="sponsorships-header">
        <h1 className="page-title">Sponsorships</h1>
        <p className="page-subtitle">Support amazing astronomy events and track your contributions to the space community</p>
        
        {/* Statistics Cards */}
        <div className="stats-grid">
          <Card variant="elevated" className="stats-card">
            <div className="stat-content">
              <div className="stat-icon">
                <CurrencyDollarIcon className="icon" />
              </div>
              <div className="stat-details">
                <h3 className="stat-label">Total Contributions</h3>
                <p className="stat-value">{formatCurrency(totalContributions)}</p>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" className="stats-card">
            <div className="stat-content">
              <div className="stat-icon">
                <UserGroupIcon className="icon" />
              </div>
              <div className="stat-details">
                <h3 className="stat-label">Events Sponsored</h3>
                <p className="stat-value">{eventsSponsored}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sponsorships-tabs">
        <Button
          className={`tab-button ${activeTab === 'seeking' ? 'active' : ''}`}
          onClick={() => setActiveTab('seeking')}
        >
          Events Seeking Sponsorship
        </Button>
        <Button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          My Sponsorship History
        </Button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'seeking' && (
          <div className="events-grid">
            {eventsSeekingSponsorship.map((event) => (
              <Card key={event.id} variant="outlined" className="event-card">
                <div className="event-header">
                  <h3 className="event-title">{event.name}</h3>
                  <span className="event-category">{event.category}</span>
                </div>
                
                <div className="event-details">
                  <div className="detail-item">
                    <CalendarDaysIcon className="detail-icon" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <MapPinIcon className="detail-icon" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="detail-item">
                    <EnvelopeIcon className="detail-icon" />
                    <span>{event.contact}</span>
                  </div>
                  
                  <div className="detail-item">
                    <UserGroupIcon className="detail-icon" />
                    <span>{event.attendees} expected attendees</span>
                  </div>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="funding-section">
                  <div className="funding-header">
                    <span className="funding-label">Fundraising Progress</span>
                    <span className="funding-amount">
                      {formatCurrency(event.amountRaised)} / {formatCurrency(event.fundraisingGoal)}
                    </span>
                  </div>
                  
                  <ProgressBar
                    current={event.amountRaised}
                    max={event.fundraisingGoal}
                    showNumbers={false}
                    className="funding-progress"
                  />
                  
                  <div className="progress-percentage">
                    {getProgressPercentage(event.amountRaised, event.fundraisingGoal).toFixed(1)}% funded
                  </div>
                </div>
                
                <div className="event-actions">
                  <Button 
                    variant="primary" 
                    size="medium"
                    onClick={() => handleSponsorClick(event)}
                  >
                    Sponsor Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Contribution</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorshipHistory.map((item) => (
                    <tr key={item.id} className="history-row">
                      <td className="event-name-cell">
                        <span className="event-name">{item.eventName}</span>
                      </td>
                      <td className="contribution-cell">
                        <span className="contribution-amount">{formatCurrency(item.amount)}</span>
                      </td>
                      <td className="date-cell">
                        <span className="contribution-date">{formatDate(item.date)}</span>
                      </td>
                      <td className="status-cell">
                        <span className={`status-badge status-${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {sponsorshipHistory.length === 0 && (
              <div className="empty-state">
                <CurrencyDollarIcon className="empty-icon" />
                <h3>No sponsorship history yet</h3>
                <p>Start sponsoring events to see your contribution history here.</p>
                <Button variant="primary" onClick={() => setActiveTab('seeking')}>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sponsor Form Modal */}
      {showSponsorForm && selectedEvent && (
        <div className="sponsor-modal-overlay" onClick={closeSponsorForm}>
          <div className="sponsor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sponsor-modal-header">
              <h2>{showPaymentForm ? 'Payment Details' : `Sponsor: ${selectedEvent.name}`}</h2>
              <button className="close-button" onClick={resetForm}>
                ×
              </button>
            </div>
            
            <div className="sponsor-modal-body">
              {!showPaymentForm ? (
                <>
                  <div className="event-summary">
                    <p><strong>Event:</strong> {selectedEvent.name}</p>
                    <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
                    <p><strong>Goal:</strong> {formatCurrency(selectedEvent.fundraisingGoal)}</p>
                    <p><strong>Raised:</strong> {formatCurrency(selectedEvent.amountRaised)}</p>
                  </div>

                  <form onSubmit={handleSponsorSubmit} className="sponsor-form">
                    <div className="form-group">
                      <label htmlFor="sponsorName">Full Name *</label>
                      <input
                        type="text"
                        id="sponsorName"
                        value={sponsorName}
                        onChange={(e) => setSponsorName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="sponsorEmail">Email *</label>
                      <input
                        type="email"
                        id="sponsorEmail"
                        value={sponsorEmail}
                        onChange={(e) => setSponsorEmail(e.target.value)}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="sponsorAmount">Sponsorship Amount (LKR) *</label>
                      <input
                        type="number"
                        id="sponsorAmount"
                        value={sponsorAmount}
                        onChange={(e) => setSponsorAmount(e.target.value)}
                        required
                        min="100"
                        placeholder="Enter amount in LKR"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="sponsorMessage">Message (Optional)</label>
                      <textarea
                        id="sponsorMessage"
                        value={sponsorMessage}
                        onChange={(e) => setSponsorMessage(e.target.value)}
                        rows={4}
                        placeholder="Leave a message for the organizers..."
                      />
                    </div>

                    <div className="form-actions">
                      <Button 
                        type="button" 
                        variant="border" 
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="payment-section">
                  <div className="payment-summary">
                    <div className="summary-card">
                      <h3>Payment Summary</h3>
                      <div className="summary-item">
                        <span>Event:</span>
                        <span>{selectedEvent.name}</span>
                      </div>
                      <div className="summary-item">
                        <span>Sponsor:</span>
                        <span>{sponsorName}</span>
                      </div>
                      <div className="summary-item total">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(parseFloat(sponsorAmount))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="payment-methods">
                    <h3>Select Payment Method</h3>
                    <div className="payment-method-options">
                      <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                        />
                        <CreditCardIcon className="payment-icon" />
                        <span>Credit/Debit Card</span>
                      </label>
                      
                      <label className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                        />
                        <CreditCardIcon className="payment-icon" />
                        <span>Bank Transfer</span>
                      </label>
                      
                      <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                        />
                        <CreditCardIcon className="payment-icon" />
                        <span>PayPal</span>
                      </label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {paymentError && (
                    <div className="payment-error">
                      <XMarkIcon className="error-icon" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Payment Form */}
                  <form onSubmit={handlePaymentSubmit} className="payment-form">
                    {paymentMethod === 'card' && (
                      <div className="card-details">
                        <div className="form-group">
                          <label htmlFor="cardholderName">Cardholder Name *</label>
                          <input
                            type="text"
                            id="cardholderName"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            required
                            placeholder="Enter name on card"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="cardNumber">Card Number *</label>
                          <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            required
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date *</label>
                            <input
                              type="text"
                              id="expiryDate"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                              required
                              maxLength={5}
                              placeholder="MM/YY"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="cvv">CVV *</label>
                            <input
                              type="text"
                              id="cvv"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                              required
                              maxLength={4}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="bank-transfer-info">
                        <div className="info-card">
                          <InformationCircleIcon className="info-icon" />
                          <div>
                            <h4>Bank Transfer Instructions</h4>
                            <p>Transfer the amount to the following account:</p>
                            <div className="bank-details">
                              <p><strong>Bank:</strong> Stellarion Bank</p>
                              <p><strong>Account:</strong> 1234-5678-9012</p>
                              <p><strong>Reference:</strong> SPONSOR-{selectedEvent.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="paypal-info">
                        <div className="info-card">
                          <InformationCircleIcon className="info-icon" />
                          <div>
                            <h4>PayPal Payment</h4>
                            <p>You will be redirected to PayPal to complete your payment securely.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="security-info">
                      <LockClosedIcon className="security-icon" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    <div className="form-actions">
                      <Button 
                        type="button" 
                        variant="border" 
                        onClick={goBackToSponsorForm}
                        disabled={isProcessingPayment}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <span className="processing">
                            Processing... 
                            <div className="spinner"></div>
                          </span>
                        ) : (
                          `Pay ${formatCurrency(parseFloat(sponsorAmount))}`
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sponsorships;