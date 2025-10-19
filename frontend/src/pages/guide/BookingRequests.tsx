import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import '../../styles/pages/guide/_bookingRequests.scss';
import { getGuideBookings, confirmBooking, rejectBooking, type Booking } from '../../services/bookingService';

interface BookingRequest {
  id: string;
  userName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  totalAmount: number;
}

const BookingRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

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
        
        setRequests(pendingBookings);
        setAcceptedCount(confirmedCount);
        setRejectedCount(cancelledCount);
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

  const handleAccept = async (id: string) => {
    try {
      await confirmBooking(parseInt(id));
      setAcceptedCount(prev => prev + 1);
      setRequests(prev => prev.filter(req => req.id !== id));
      // Show success message
      alert('Booking confirmed successfully! The learner has been notified.');
    } catch (err) {
      console.error('Error accepting booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept booking');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      await rejectBooking(parseInt(id), reason || undefined);
      setRejectedCount(prev => prev + 1);
      setRequests(prev => prev.filter(req => req.id !== id));
      // Show success message
      alert('Booking rejected successfully. The learner has been notified.');
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject booking');
    }
  };

  const pendingCount = requests.length;
  const totalCount = acceptedCount + rejectedCount + pendingCount;

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
                  <Button variant="success" size="small" onClick={() => handleAccept(req.id)}>Accept</Button>
                  <Button variant="danger" size="small" onClick={() => handleReject(req.id)}>Reject</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingRequests;
