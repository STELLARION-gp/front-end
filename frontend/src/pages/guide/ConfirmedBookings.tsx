import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { Calendar, Clock, Users, Star, TrendingUp, Activity, ArrowLeft } from 'lucide-react';
import '../../styles/pages/guide/_confirmedBookings.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

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
}

const ConfirmedBookings: React.FC = () => {
  console.log('ConfirmedBookings component mounting...');
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [animatedCounters, setAnimatedCounters] = useState({
    total: 0,
    upcoming: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    // Simulate fetching confirmed bookings
    const dummyBookings: ConfirmedBooking[] = [
      {
        id: '1',
        userName: 'Emily Chen',
        serviceName: 'Deep Space Observation',
        date: '2025-07-05',
        startTime: '20:00',
        endTime: '23:00',
        duration: 3,
        status: 'upcoming',
        participantCount: 4,
        notes: 'Requested focus on Saturn and Jupiter'
      },
      {
        id: '2',
        userName: 'Marcus Rodriguez',
        serviceName: 'Astrophotography Masterclass',
        date: '2025-07-06',
        startTime: '18:00',
        endTime: '22:00',
        duration: 4,
        status: 'upcoming',
        participantCount: 8,
      },
      {
        id: '3',
        userName: 'Sarah Thompson',
        serviceName: 'Telescope Building Workshop',
        date: '2025-07-04',
        startTime: '09:00',
        endTime: '17:00',
        duration: 8,
        status: 'in-progress',
        participantCount: 12,
      },
      {
        id: '4',
        userName: 'Alex Kim',
        serviceName: 'Planetary Observation Session',
        date: '2025-07-03',
        startTime: '21:00',
        endTime: '23:00',
        duration: 2,
        status: 'completed',
        rating: 5,
        participantCount: 6,
      },
      {
        id: '5',
        userName: 'Lisa Wong',
        serviceName: 'Nebula Photography Tour',
        date: '2025-07-02',
        startTime: '22:00',
        endTime: '02:00',
        duration: 4,
        status: 'completed',
        rating: 4,
        participantCount: 5,
      },
      {
        id: '6',
        userName: 'David Johnson',
        serviceName: 'Meteor Shower Viewing',
        date: '2025-07-07',
        startTime: '23:00',
        endTime: '03:00',
        duration: 4,
        status: 'upcoming',
        participantCount: 15,
      },
    ];
    setBookings(dummyBookings);
  }, []);

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

  // Chart data
  const bookingTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings This Week',
        data: [12, 8, 15, 10, 18, 25, 20],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const statusDistributionData = {
    labels: ['Upcoming', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          bookings.filter(b => b.status === 'upcoming').length,
          bookings.filter(b => b.status === 'in-progress').length,
          bookings.filter(b => b.status === 'completed').length,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const servicePopularityData = {
    labels: ['Deep Space', 'Astrophotography', 'Telescope Building', 'Planetary Obs.', 'Nebula Tours'],
    datasets: [
      {
        label: 'Participant Count',
        data: [15, 22, 18, 12, 8],
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
      },
    },
  };

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
            size="small"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
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

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="charts-grid"
      >
        <Card className="chart-card" variant="outlined">
          <h3>Booking Trends</h3>
          <div className="chart-container">
            <Line data={bookingTrendsData} options={chartOptions} />
          </div>
        </Card>

        <Card className="chart-card" variant="outlined">
          <h3>Status Distribution</h3>
          <div className="chart-container">
            <Doughnut data={statusDistributionData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="chart-card wide" variant="outlined">
          <h3>Service Popularity</h3>
          <div className="chart-container">
            <Bar data={servicePopularityData} options={chartOptions} />
          </div>
        </Card>
      </motion.div>

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
                <TrendingUp className="w-6 h-6 text-orange-400" />
                <div>
                  <h4>Upcoming Sessions Alert!</h4>
                  <p>You have {bookings.filter(isUpcoming).length} sessions starting within the next 3 days.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bookings-section"
      >
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
                  <th>Duration</th>
                  <th>Participants</th>
                  <th>Rating</th>
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
                          <span className="date">{new Date(booking.date).toLocaleDateString()}</span>
                          <span className="time">{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </td>
                      <td className="duration-cell">{booking.duration}h</td>
                      <td className="participants-cell">
                        <div className="participants-badge">
                          <Users className="w-4 h-4" />
                          {booking.participantCount}
                        </div>
                      </td>
                      <td className="rating-cell">
                        {booking.rating ? (
                          <div className="rating">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="no-rating">-</span>
                        )}
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
