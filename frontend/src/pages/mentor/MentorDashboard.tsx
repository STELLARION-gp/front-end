import React, { useState } from 'react';
import Button from '../../components/Button';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import avatarImg from '../../assets/Mentee.png';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

// Import new components
import MenteeOfMonth from '../../components/mentor/MenteeOfMonth';
import AvailabilityToggle from '../../components/mentor/AvailabilityToggle';
import MenteeCounter from '../../components/mentor/MenteeCounter';
import DashboardStats from '../../components/mentor/DashboardStats';

// Import styles
import '../../styles/pages/mentor/mentorprofile.scss';
import '../../styles/pages/Dashboard.scss';
import '../../styles/components/_buttons.scss';
import '../../styles/pages/mentor/mentorDashboard.scss';

// Import contexts
import { useMentorPause } from '../../contexts/mentor/MentorPauseContext';
import { useMentee } from '../../contexts/mentor/MenteeContext';

const mentees = [
  { id: 1, name: 'Alice', img: avatarImg },
  { id: 2, name: 'Bob', img: avatarImg },
  { id: 3, name: 'Charlie', img: avatarImg },
];

const MentorDashboard = () => {
  const { isPaused, setIsPaused } = useMentorPause();
  const { 
    menteeCount, 
    maxMentees, 
    setMaxMentees, 
    isAccepting, 
    setIsAccepting 
  } = useMentee();
  
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarMonth, setCalendarMonth] = useState(dayjs().month());
  const [calendarYear, setCalendarYear] = useState(dayjs().year());
  const navigate = useNavigate();

  // Dashboard stats
  const stats = {
    sessionsHeld: 7,
    menteeRequests: 5,
    activeMembers: menteeCount,
    avgRating: 4.9,
    hoursMentored: 156
  };

  // Calendar logic
  const daysInMonth = dayjs().year(calendarYear).month(calendarMonth).daysInMonth();
  const firstDayOfMonth = dayjs().year(calendarYear).month(calendarMonth).date(1).day();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) weeks.push(calendarDays.slice(i, i + 7));

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalendarYear(Number(e.target.value));
  };

  const handleIncreaseMaxMentees = () => {
    setMaxMentees(maxMentees + 1);
  };

  const handleDecreaseMaxMentees = () => {
    setMaxMentees(Math.max(1, maxMentees - 1));
  };

  const handleGoToToday = () => {
    const today = dayjs();
    setCalendarMonth(today.month());
    setCalendarYear(today.year());
    setSelectedDate(today);
  };

  return (
    <div className="mentor-dashboard-full">
      {/* Header Section */}
      <div className="dashboard-header-section">
        <div className="greeting-section">
          <h1 className="dashboard-title">Hi Mentor</h1>
          <p className="dashboard-subtitle">Let's inspire another thousand minds!!</p>
        </div>
        <div className="header-actions">
          <Button 
            className="activity-log-btn" 
            onClick={() => navigate('/dashboard/mentornotification')}
          >
            🔔 Notifications 
          </Button>
          <Button 
            className="activity-log-btn" 
            onClick={() => navigate('/dashboard/mentoractivelog')}
          >
            📊 Activity Log
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Stats Row (hero + quick stats) */}
        <div className="stats-section">
          <MenteeOfMonth mentees={mentees} />
          <DashboardStats
            sessionsHeld={stats.sessionsHeld}
            menteeRequests={stats.menteeRequests}
            activeMembers={stats.activeMembers}
            avgRating={stats.avgRating}
            hoursMentored={stats.hoursMentored}
            onRequestsClick={() => navigate('/dashboard/mentorshiprequest')}
            onMembersClick={() => navigate('/dashboard/mentees')}
          />
        </div>

        {/* Main Content Row */}
        <div className="main-content-row">
          {/* Left Column - Controls */}
          <div className="controls-column">
            <div className="controls-section_1">
              <h3 className="section-title">Mentorship Controls</h3>
              <AvailabilityToggle
                isAccepting={isAccepting}
                onToggle={setIsAccepting}
                isPaused={isPaused}
                onPauseToggle={setIsPaused}
              />
              <MenteeCounter
                maxMentees={maxMentees}
                onIncrease={handleIncreaseMaxMentees}
                onDecrease={handleDecreaseMaxMentees}
              />
            </div>
          </div>

          {/* Center Column - Calendar */}
          <div className="calendar-column">
            <div className="calendar-section">
              <h3 className="section-title">Calendar</h3>
              <div className="calendar-widget">
                <div className="calendar-header">
                <div className="calendar-nav-row">
                  <Button 
                    className="nav-btn" 
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeftIcon className="icon" />
                  </Button>

                  <div className="calendar-title">
                    <div className="month-row">{dayjs().month(calendarMonth).format('MMMM')}</div>
                    <select 
                      value={calendarYear} 
                      onChange={handleYearChange}
                      className="year-select"
                    >
                      {Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <Button className="today-btn" onClick={handleGoToToday}>
                    Today
                  </Button>

                  <Button 
                    className="nav-btn" 
                    onClick={handleNextMonth}
                  >
                    <ChevronRightIcon className="icon" />
                  </Button>
                </div>
                </div>

                <div className="calendar-days-header">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="day-label">{d}</div>
                  ))}
                </div>

                <div className="calendar-grid">
                  {weeks.map((week, wi) => week.map((d, di) => (
                    <div
                      key={wi + '-' + di}
                      onClick={() => d && setSelectedDate(dayjs().year(calendarYear).month(calendarMonth).date(d))}
                      className={`calendar-day ${
                        d && selectedDate.date() === d && 
                        selectedDate.month() === calendarMonth && 
                        selectedDate.year() === calendarYear ? 'selected' : ''
                      } ${d ? 'clickable' : 'empty'}`}
                    >
                      {d || ''}
                    </div>
                  )))}
                </div>
              </div>

              {/* Events Section */}
              <div className="events-section">
                <div className="events-header">
                  <h4>{dayjs(selectedDate).format('MMMM D, YYYY')}</h4>
                  <PlusIcon className="add-event-icon" />
                </div>
                <div className="events-content">
                  <p>No events scheduled for this date.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions moved below main content */}
        </div>
        {/* Centered Quick Actions Row */}
        <div className="quick-actions-row">
          <div className="action-buttons horizontal">
            <Button 
              className="action-btn primary"
              onClick={() => navigate('/dashboard/mentees')}
            >
              View All Mentees
            </Button>
            <Button 
              className="action-btn secondary"
              onClick={() => navigate('/dashboard/mentorshiprequest')}
            >
              Review Requests
            </Button>
            <Button 
              className="action-btn tertiary"
              onClick={() => navigate('/dashboard/groupchat')}
            >
              Group Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;