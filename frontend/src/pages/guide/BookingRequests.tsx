import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import '../../styles/pages/guide/_bookingRequests.scss'; // create styles if needed

interface BookingRequest {
  id: string;
  userName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
}

const BookingRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    // fetch booking requests or use dummy data
    const dummy: BookingRequest[] = [
      { id: '1', userName: 'Alice Johnson', serviceName: 'Deep Space Observation', date: '2025-07-10', startTime: '20:00', endTime: '23:00' },
      { id: '2', userName: 'Bob Smith', serviceName: 'Astrophotography Masterclass', date: '2025-07-08', startTime: '18:00', endTime: '00:00' },
      { id: '3', userName: 'Carol Lee', serviceName: 'Telescope Building Workshop', date: '2025-07-12', startTime: '09:00', endTime: '17:00' },
      { id: '4', userName: 'David Kim', serviceName: 'Planetary Observation Session', date: '2025-07-03', startTime: '21:00', endTime: '23:00' },
    ];
    setRequests(dummy);
    // dummy stats initial values
    setAcceptedCount(2);
    setRejectedCount(1);
  }, []);

  const handleAccept = (id: string) => {
    setAcceptedCount(prev => prev + 1);
    setRequests(prev => prev.filter(req => req.id !== id));
    // TODO: call API to accept
  };

  const handleReject = (id: string) => {
    setRejectedCount(prev => prev + 1);
    setRequests(prev => prev.filter(req => req.id !== id));
    // TODO: call API to reject
  };

  // derive stats
  const pendingCount = requests.length;
  const totalCount = acceptedCount + rejectedCount + pendingCount;
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Booking Requests</h2>
        <div className="header-actions">
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
                <td>{req.serviceName}</td>
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
