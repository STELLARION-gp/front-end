import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Calendar, Clock, Users, Star, TrendingUp, Activity, ArrowLeft } from 'lucide-react';
import '../../styles/pages/guide/_confirmedBookings.scss';
import { getGuideBookings, type Booking } from '../../services/bookingService';

interface ConfirmedBooking {
  id: string;
  userName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  status: 'upcoming' | 'in-progress' | 'completed';
  rating?: number;
  notes?: string;
  participantCount: number;
  totalAmount: number;
  paymentStatus?: string;
}

const ConfirmedBookings: React.FC = () => {
  console.log('ConfirmedBookings component mounting...');
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [animatedCounters, setAnimatedCounters] = useState({
    total: 0,
    upcoming: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchConfirmedBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch confirmed bookings from API
        const response = await getGuideBookings({ status: 'confirmed', limit: 100 });
        
        // Transform API bookings to component format
        const transformedBookings: ConfirmedBooking[] = response.bookings.map(transformBooking);
        
        setBookings(transformedBookings);
      } catch (err) {
        console.error('Error fetching confirmed bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedBookings();
  }, []);

  const transformBooking = (booking: Booking): ConfirmedBooking => {
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
    // Normalize to YYYY-MM-DD for storage, we'll format for display later
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

    const duration = serviceObj?.duration
      ? parseDuration(serviceObj.duration)
      : 0;
    const endTime = calculateEndTime(startTime, duration);

    // Determine status based on date
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    let status: 'upcoming' | 'in-progress' | 'completed' = 'upcoming';
    if (bookingDate < today) {
      status = booking.booking_status === 'completed' ? 'completed' : 'completed';
    } else if (bookingDate.getTime() === today.getTime()) {
      status = 'in-progress';
    }

    return {
      id: booking.id.toString(),
      userName,
      serviceName,
      date,
      startTime,
      endTime,
      duration,
      status,
      participantCount: booking.participants_count,
      totalAmount: booking.total_amount,
      notes: booking.special_requests,
      paymentStatus: (booking as any).payment_status || (booking as any).paymentStatus || 'not_paid',
    };
  };

  // Format helpers for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      // Ensure the string is parsed as local date by providing explicit time
      const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (time24: string) => {
    if (!time24) return '-';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    if (isNaN(hh) || isNaN(mm)) return time24;
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*(hour|day)/i);
    if (!match) return 0;
    
    const [, amount, unit] = match;
    return unit.toLowerCase() === 'day' ? parseInt(amount) * 24 : parseInt(amount);
  };

  const calculateEndTime = (startTime: string, durationHours: number): string => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const endHour = (startHour + durationHours) % 24;
    
    return `${String(endHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
  };

  // Animate counters
  useEffect(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'upcoming').length;
    const inProgress = bookings.filter(b => b.status === 'in-progress').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 50);
    };

    animateCounter(total, (value) => setAnimatedCounters(prev => ({ ...prev, total: value })));
    animateCounter(upcoming, (value) => setAnimatedCounters(prev => ({ ...prev, upcoming: value })));
    animateCounter(inProgress, (value) => setAnimatedCounters(prev => ({ ...prev, inProgress: value })));
    animateCounter(completed, (value) => setAnimatedCounters(prev => ({ ...prev, completed: value })));
  }, [bookings]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'in-progress':
        return <Activity className="w-4 h-4 text-yellow-400" />;
      case 'completed':
        return <Star className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'border-l-blue-500 bg-blue-500/10';
      case 'in-progress':
        return 'border-l-yellow-500 bg-yellow-500/10';
      case 'completed':
        return 'border-l-green-500 bg-green-500/10';
      default:
        return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const isUpcoming = (booking: ConfirmedBooking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && booking.status === 'upcoming';
  };

  if (loading) {
    return (
      <div className="confirmed-bookings-page">
        <div className="page-header">
          <h2>Confirmed Bookings</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading confirmed bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmed-bookings-page">
        <div className="page-header">
          <h2>Confirmed Bookings</h2>
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
    <div className="confirmed-bookings-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="page-header"
      >
        <div className="header-top">
              <Button
                variant="secondary"
                size="medium"
                icon={<ArrowLeft className="w-4 h-4" />}
                iconPosition="left"
                onClick={() => navigate(-1)}
              >
                Back to Services
              </Button>
        </div>
        <h2>Confirmed Bookings</h2>
        <p>Manage and track all your confirmed astronomy sessions</p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="stats-grid"
      >
        <Card className="stat-card total" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Bookings</span>
              <motion.strong
                className="stat-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              >
                {animatedCounters.total}
              </motion.strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card upcoming" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Upcoming</span>
              <motion.strong
                className="stat-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
              >
                {animatedCounters.upcoming}
              </motion.strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card in-progress" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Activity className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <motion.strong
                className="stat-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
              >
                {animatedCounters.inProgress}
              </motion.strong>
            </div>
          </div>
        </Card>

        <Card className="stat-card completed" variant="outlined">
          <div className="stat-content">
            <div className="stat-icon">
              <Star className="w-6 h-6" />
            </div>
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <motion.strong
                className="stat-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
              >
                {animatedCounters.completed}
              </motion.strong>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Sessions Alert + Bookings Table in Single Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bookings-section"
      >
        {/* Upcoming Sessions Alert */}
        <AnimatePresence>
          {bookings.some(isUpcoming) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="upcoming-alert"
            >
              <Card className="alert-card" variant="outlined">
                <div className="alert-content">
                  <TrendingUp className="alert-icon" />
                  <div className="alert-text">
                    <h4>Upcoming Sessions Alert!</h4>
                    <p>You have {bookings.filter(isUpcoming).length} sessions starting within the next 3 days.</p>
                  </div>
                  <div className="alert-pulse"></div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="table-card" variant="outlined">
          <div className="table-header">
            <h3>All Confirmed Bookings</h3>
            <div className="timeframe-selector">
              {(['week', 'month', 'year'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Participant</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  {/* <th>Duration</th> */}
                  <th>Participants</th>
                  <th>Amount</th>
          
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`booking-row ${getStatusColor(booking.status)} ${isUpcoming(booking) ? 'upcoming-pulse' : ''}`}
                    >
                      <td className="status-cell">
                        <div className="status-badge">
                          {getStatusIcon(booking.status)}
                          <span className={`status-text ${booking.status}`}>
                            {booking.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="participant-cell">
                        <div className="participant-info">
                          <strong>{booking.userName}</strong>
                          {booking.notes && (
                            <span className="notes">{booking.notes}</span>
                          )}
                        </div>
                      </td>
                      <td className="service-cell">{booking.serviceName}</td>
                      <td className="datetime-cell">
                        <div className="datetime-info">
                          <span className="date">{formatDate(booking.date)}</span>
                          <span className="time">
                            {booking.startTime && booking.endTime && booking.startTime !== booking.endTime
                              ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
                              : formatTime(booking.startTime)}
                          </span>
                        </div>
                      </td>
                      {/* <td className="duration-cell">{booking.duration}h</td> */}
                      <td className="participants-cell">
                        <div className="participants-badge">
                          <Users className="w-4 h-4" />
                          {booking.participantCount}
                        </div>
                      </td>
                      <td className="amount-cell">
                        <strong>Rs. {booking.totalAmount.toLocaleString()}</strong>
                      </td>
                      
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmedBookings;
