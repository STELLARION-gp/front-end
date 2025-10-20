import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import SuccessMessage from '../../components/SuccessMessage';
import '../../styles/pages/guide/_bookingRequests.scss';
import { getGuideBookings, confirmBooking, rejectBooking, type Booking } from '../../services/bookingService';
import PaymentDetailsModal from '../../components/PaymentDetailsModal';
import { getBookingPaymentDetails, processBookingRefund } from '../../services/paymentService';

interface BookingRequest {
  id: string;
  userName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  totalAmount: number;
  paymentStatus?: string;
}

const BookingRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Local toasts
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all bookings for guide
        const response = await getGuideBookings({ limit: 100 });
        
        // Transform bookings to BookingRequest format
        const pendingBookings = response.bookings
          .filter(b => b.booking_status === 'pending')
          .map(transformBooking);
        
  const confirmedCount = response.bookings.filter(b => b.booking_status === 'confirmed').length;
  const cancelledCount = response.bookings.filter(b => b.booking_status === 'cancelled').length;
  const compCount = response.bookings.filter(b => b.booking_status === 'completed').length;
        
        setRequests(pendingBookings);
        setAcceptedCount(confirmedCount);
        setRejectedCount(cancelledCount);
        setCompletedCount(compCount);
        // Debug logs to help confirm values during development
        try {
          console.debug('Bookings counts:', { pending: pendingBookings.length, confirmedCount, cancelledCount, completed: compCount });
        } catch (e) {}
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const transformBooking = (booking: Booking): BookingRequest => {
    // Support backend shapes: booking.user or booking.users, booking.service or booking.services
    const userObj = (booking as any).user || (booking as any).users || null;
    const userName = userObj
      ? `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() || userObj.email || 'Unknown User'
      : 'Unknown User';

    const serviceObj = (booking as any).service || (booking as any).services || null;
    const serviceName = serviceObj?.title || 'Unknown Service';

    // booking_date is Date or string
    const dateObj = typeof booking.booking_date === 'string'
      ? new Date(booking.booking_date)
      : booking.booking_date;
    const date = dateObj.toISOString().split('T')[0];

    // booking_time is Date or string or undefined
    let startTime = '00:00';
    if (booking.booking_time) {
      let timeObj: Date | null = null;
      if (typeof booking.booking_time === 'string') {
        // Try to parse as ISO or time string
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(booking.booking_time)) {
          timeObj = new Date(booking.booking_time);
        } else if (/^\d{2}:\d{2}/.test(booking.booking_time)) {
          timeObj = new Date(`1970-01-01T${booking.booking_time}`);
        }
      } else if (
        typeof booking.booking_time === 'object' &&
        booking.booking_time !== null &&
        'getTime' in booking.booking_time
      ) {
        timeObj = booking.booking_time as Date;
      }
      if (timeObj && !isNaN(timeObj.getTime())) {
        startTime = timeObj.toISOString().substring(11, 16);
      }
    }

    const endTime = serviceObj?.duration
      ? calculateEndTime(startTime, serviceObj.duration)
      : '00:00';

    return {
      id: booking.id.toString(),
      userName,
      serviceName,
      date,
      startTime,
      endTime,
      participants: booking.participants_count,
      totalAmount: booking.total_amount,
      paymentStatus: (booking as any).payment_status || (booking as any).paymentStatus || 'not_paid',
    };
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    // Parse duration (e.g., "3 hours", "2 days")
    const match = duration.match(/(\d+)\s*(hour|day)/i);
    if (!match) return startTime;
    
    const [, amount, unit] = match;
    const hours = unit.toLowerCase() === 'day' ? parseInt(amount) * 24 : parseInt(amount);
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const endHour = (startHour + hours) % 24;
    
    return `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
  };

  // modal state handlers below

  const handleViewBooking = async (id: string) => {
    setSelectedDetails(null);
    setModalOpen(true);
    try {
      const details = await getBookingPaymentDetails(parseInt(id));
      setSelectedDetails(details);
    } catch (err) {
      console.error('Failed to load booking details:', err);
      const message = err instanceof Error ? err.message : String(err);
      // If payment not found for the booking, show a fallback details object built from the booking row
      if (message.includes('Payment for booking not found') || message.includes('404')) {
        const row = requests.find(r => r.id === id);
        if (row) {
          const fallback = {
            bookingId: parseInt(id),
            orderId: `BOOKING-${id}`,
            amount: row.totalAmount,
            currency: 'LKR',
              paymentStatus: row.paymentStatus || 'not_paid',
            paymentMethod: '',
            transactionId: null,
            customer: {
              id: 0,
              name: row.userName,
              email: '',
            },
            service: {
              id: 0,
              title: row.serviceName,
              description: '',
            },
            bookingDetails: {
              date: row.date,
              time: row.startTime,
              participants: row.participants,
              specialRequests: null,
            },
            canRefund: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any;

          setSelectedDetails(fallback);
          return;
        }
      }

      // If we couldn't find a specific payment or booking row, keep the modal open and show an error state
      const errorDetail = {
        bookingId: parseInt(id),
        orderId: `BOOKING-${id}`,
        amount: 0,
        currency: 'LKR',
        paymentStatus: 'not_found',
        paymentMethod: '',
        transactionId: null,
        customer: { id: 0, name: 'Unknown', email: '' },
        service: { id: 0, title: 'Unknown Service', description: '' },
        bookingDetails: { date: '', time: '', participants: 0, specialRequests: null },
        canRefund: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _errorMessage: message || 'Failed to load booking details',
      } as any;

      setSelectedDetails(errorDetail);
      // keep modalOpen true so the modal loads and shows the error
    }
  };

  const handleModalAccept = async () => {
    if (!selectedDetails) return;
    try {
      await confirmBooking(selectedDetails.bookingId);
      setAcceptedCount(prev => prev + 1);
  setRequests(prev => prev.filter(req => req.id !== String(selectedDetails.bookingId)));
  // When a booking is confirmed it moves from pending -> confirmed; completed remains backend-driven
  setSuccessMessageText('Booking confirmed successfully!');
  setShowSuccessMessage(true);
  setModalOpen(false);
        // Notify other pages (e.g., PaymentProcessing) to refresh
        try { window.dispatchEvent(new Event('payments-updated')); } catch(e) {}
        // Refresh services listing to update participant counts (if ServiceListing is mounted)
        try {
          const refreshFn = (window as any).__refreshGuideServices;
          if (typeof refreshFn === 'function') await refreshFn();
        } catch (refreshErr) {
          console.warn('Failed to refresh services after confirm:', refreshErr);
        }
    } catch (err) {
      console.error('Error confirming booking:', err);
      setErrorMessageText(err instanceof Error ? err.message : 'Failed to confirm booking');
      setShowErrorMessage(true);
    }
  };

  const handleModalReject = async () => {
    if (!selectedDetails) return;
    const reason = prompt('Please provide a reason for rejection (optional):');
    try {
      // If payment completed, attempt refund through payment API first
      if (selectedDetails.paymentStatus && selectedDetails.paymentStatus.toLowerCase() === 'completed') {
        try {
          await processBookingRefund(selectedDetails.bookingId, { reason: reason || undefined, refundType: 'full' });
        } catch (refundErr) {
          console.error('Refund failed during reject flow:', refundErr);
          const refundMsg = refundErr instanceof Error ? refundErr.message : String(refundErr);
          if (refundMsg.includes('Payment for booking not found') || refundMsg.includes('404')) {
            alert('No payment record found to refund for this booking. Proceeding to reject the booking.');
          } else if (refundMsg.includes('Only completed')) {
            alert('Refund cannot be processed because the payment is not completed. Proceeding to reject the booking.');
          } else {
            alert(refundMsg || 'Refund failed during rejection.');
          }
        }
      }

      // Then mark booking as rejected in booking service
      await rejectBooking(selectedDetails.bookingId, reason || undefined);
      setRejectedCount(prev => prev + 1);
      setRequests(prev => prev.filter(req => req.id !== String(selectedDetails.bookingId)));
  setSuccessMessageText('Booking rejected and (if applicable) refunded successfully.');
  setShowSuccessMessage(true);
  setModalOpen(false);
      // Notify other pages (e.g., PaymentProcessing) to refresh
      try { window.dispatchEvent(new Event('payments-updated')); } catch(e) {}
    } catch (err) {
      console.error('Error rejecting booking:', err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Payment for booking not found') || message.includes('404')) {
        setErrorMessageText('No payment record found for this booking.');
      } else {
        setErrorMessageText(message || 'Failed to reject booking');
      }
      setShowErrorMessage(true);
    }
  };

  const pendingCount = requests.length;
  // User asked: total count should be completed count
  const totalCount = completedCount + acceptedCount + rejectedCount + pendingCount;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Booking Requests</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h2>Booking Requests</h2>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Booking Requests</h2>
        <div className="header-actions">
          <Button 
            variant="secondary" 
            size="medium"
            onClick={() => navigate('/dashboard/previous-tours')}
          >
            Previous Tours
          </Button>
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => navigate('/dashboard/confirmed-bookings')}
          >
            View Confirmed Bookings
          </Button>
        </div>
        
      </div>
      {/* Statistics */}
      <div className="stats-grid">
        <Card className="stat-card total" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon1">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total</span>
              <strong className="stat-value">{totalCount}</strong>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card pending" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon1">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pending</span>
              <strong className="stat-value">{pendingCount}</strong>
            </div>
          </div>
        </Card>
        
        <Card className="stat-card accepted" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon1">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Accepted</span>
              <strong className="stat-value">{acceptedCount}</strong>
            </div>
          </div>
        </Card>
        
        {/* <Card className="stat-card completed" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon1">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <strong className="stat-value">{completedCount}</strong>
            </div>
          </div>
        </Card> */}

        <Card className="stat-card rejected" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon1">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Rejected</span>
              <strong className="stat-value">{rejectedCount}</strong>
            </div>
          </div>
        </Card>
      </div>
      {/* Requests Table */}
      {pendingCount === 0 ? (
        <p>No pending booking requests.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.userName}</td>
                <td>
                  <div>{req.serviceName}</div>
                  <div className="text-sm text-gray-400">{req.participants} participants • Rs. {req.totalAmount.toLocaleString()}</div>
                </td>
                <td>{new Date(req.date).toLocaleDateString()}</td>
                <td>{req.startTime} - {req.endTime}</td>
                <td className="actions-cell">
                  <Button variant="primary" size="small" onClick={() => handleViewBooking(req.id)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Payment details modal */}
      <PaymentDetailsModal
        isOpen={modalOpen}
        details={selectedDetails}
        onClose={() => { setModalOpen(false); setSelectedDetails(null); }}
        onAccept={handleModalAccept}
        onReject={handleModalReject}
        onRefund={async () => {
          if (!selectedDetails) return;
          // Only allow refund if payment is completed or backend marked canRefund
          const paymentStatus = (selectedDetails.paymentStatus || '').toString().toLowerCase();
          const canRefund = !!selectedDetails.canRefund;
          if (paymentStatus !== 'completed' && !canRefund) {
            // Friendly message — prevent calling refund endpoint which would return 404
            alert('No completed payment found for this booking to refund.');
            return;
          }

          try {
            await processBookingRefund(selectedDetails.bookingId, { refundType: 'full' });
            alert('Refund processed');
            // Notify other pages to refresh
            try { window.dispatchEvent(new Event('payments-updated')); } catch(e) {}
          } catch (err) {
            console.error('Refund failed:', err);
            alert(err instanceof Error ? err.message : 'Refund failed');
          }
        }}
        showRefundButton={true}
      />
        {/* Success Message Toast */}
        <SuccessMessage
          isOpen={showSuccessMessage}
          title="Success!"
          message={successMessageText}
          type="success"
          onClose={() => setShowSuccessMessage(false)}
        />

        {/* Error Message Toast (used for future error flows) */}
        <SuccessMessage
          isOpen={showErrorMessage}
          title="Error"
          message={errorMessageText}
          type="error"
          onClose={() => setShowErrorMessage(false)}
        />
    </div>
  );
};

export default BookingRequests;
