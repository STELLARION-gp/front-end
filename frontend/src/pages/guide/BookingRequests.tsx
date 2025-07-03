import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
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
  const [requests, setRequests] = useState<BookingRequest[]>([]);

  useEffect(() => {
    // fetch booking requests or use dummy data
    const dummy: BookingRequest[] = [
      { id: '1', userName: 'Alice Johnson', serviceName: 'Deep Space Observation', date: '2025-07-10', startTime: '20:00', endTime: '23:00' },
      { id: '2', userName: 'Bob Smith', serviceName: 'Astrophotography Masterclass', date: '2025-07-08', startTime: '18:00', endTime: '00:00' },
    ];
    setRequests(dummy);
  }, []);

  const handleAccept = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    // TODO: call API to accept
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    // TODO: call API to reject
  };

  return (
    <div className="dashboard-page">
      <h2>Booking Requests</h2>
      {requests.length === 0 ? (
        <p>No pending booking requests.</p>
      ) : (
        <div className="booking-requests-list">
          {requests.map(req => (
            <Card key={req.id} className="booking-request-card" variant="outlined">
              <div className="request-info">
                <p><strong>User:</strong> {req.userName}</p>
                <p><strong>Service:</strong> {req.serviceName}</p>
                <p><strong>Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {req.startTime} - {req.endTime}</p>
              </div>
              <div className="request-actions">
                <Button variant="success" size="small" onClick={() => handleAccept(req.id)}>
                  Accept
                </Button>
                <Button variant="danger" size="small" onClick={() => handleReject(req.id)}>
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
