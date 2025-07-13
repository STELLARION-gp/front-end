import React, { useState } from 'react';
import Button from '../../components/Button';
import { BellIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, UserGroupIcon, CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import avatarImg from '../../assets/world.png';
import '../../styles/pages/mentor/mentorprofile.scss';
import '../../styles/pages/Dashboard.scss';
import '../../styles/components/_buttons.scss';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/mentor/mentorDashboard.scss';

const mentees = [
  { id: 1, name: 'Alice', img: avatarImg },
  { id: 2, name: 'Bob', img: avatarImg },
  { id: 3, name: 'Charlie', img: avatarImg },
];

const MentorDashboard = () => {
  const [accepting, setAccepting] = useState(true);
  const [maxMentees, setMaxMentees] = useState(10);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [calendarMonth, setCalendarMonth] = useState(dayjs().month());
  const [calendarYear, setCalendarYear] = useState(dayjs().year());
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  // Dummy stats
  const stats = [
    { label: 'sessions held', value: 7 },
    { label: 'mentee request', value: 5 },
    { label: 'Active members', value: 6 },
  ];

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

  return (
    <div
      className="dashboard-page mentor-dashboard mentor-dashboard-large"
      style={{
        minHeight: '120vh',
        width: '100%',
        background: 'rgba(59,130,246,0.07)',
        borderRadius: 16,
        padding: '2.5rem 4vw',
        boxSizing: 'border-box',
        maxWidth: '1800px',   // <--- THIS CONTROLS THE MAX WIDTH
        margin: '0 auto'      // <--- THIS CENTERS THE CONTAINER
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: 0 }}>Hi Mentor</h2>
          <div style={{ color: '#60a5fa', fontWeight: 500, fontSize: '1.1rem' }}>Let&apos;s inspire another thousand minds!!</div>
        </div>
        <span style={{ marginLeft: 16 }}>
          <Button className="session-bookmark-btn" onClick={() => navigate('/dashboard/mentornotification')}>
            🔔 Notifications
          </Button>
        </span>
      </div>
      <div className="mentor-dashboard-layout" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Left Column */}
        <div style={{ minWidth: 540, maxWidth: 900, flex: '1 1 700px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Mentee of the Month */}
          <div className="advanced-features mentor-profile-field-box poll-item" style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.2rem 2rem', transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.2s', cursor: 'pointer' }}>
            <label style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Mentee of the month</label>
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', width: '100%' }}>
              {mentees.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="mentor-avatar-hover mentee-gold-hover" style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', background: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '3px solid #334155', transition: 'border-color 0.2s' }}>
                    <img src={m.img} alt={m.name} style={{ width: 120, height: 120, borderRadius: '50%' }} />
                  </div>
                  <div style={{ marginTop: 6, color: '#a0aec0', fontWeight: 500, fontSize: '1rem' }}>{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Availability */}
          <div className="advanced-features mentor-profile-field-box" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '1.1rem' }}>Availability</label>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: '1.08rem' }}>Accepting members / not</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{ width: 36, height: 20, borderRadius: 12, background: accepting ? '#22c55e' : '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2, transition: 'background 0.2s' }}
                onClick={() => setAccepting(a => !a)}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', marginLeft: accepting ? 16 : 2, transition: 'margin 0.2s' }}></div>
              </div>
              <span style={{ color: accepting ? '#22c55e' : '#ef4444', fontWeight: 600, marginLeft: 8, fontSize: '1rem' }}>{accepting ? 'Accepting' : 'Not Accepting'}</span>
            </div>
          </div>
          {/* Temporary Pause Toggle */}
          {/* <div className="advanced-features mentor-profile-field-box" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '1.1rem' }}>Temporary Pause</label>
              <div style={{ color: paused ? '#ef4444' : '#22c55e', fontWeight: 500, fontSize: '1.08rem' }}>
                {paused ? 'Mentor is temporarily paused' : 'Mentor is active'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                className={`mentor-dashboard-toggle${paused ? ' paused' : ''}`}
                style={{ width: 36, height: 20, borderRadius: 12, background: paused ? '#ef4444' : '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2, transition: 'background 0.2s' }}
                onClick={() => setPaused(p => !p)}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', marginLeft: paused ? 16 : 2, transition: 'margin 0.2s' }}></div>
              </div>
              <span style={{ color: paused ? '#ef4444' : '#22c55e', fontWeight: 600, marginLeft: 8, fontSize: '1rem' }}>{paused ? 'Paused' : 'Active'}</span>
            </div>
          </div> */}
          {/* Maximum Mentees */}
          {/* <div className="advanced-features mentor-profile-field-box" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '1.5rem' }}>
            <label style={{ marginRight: 16, fontSize: '1.1rem' }}>Maximum Mentees</label>
            <Button className="mentor-btn-round mentor-btn-blue" onClick={() => setMaxMentees(m => Math.max(1, m - 1))}>-</Button>
            <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#fff', minWidth: 32, textAlign: 'center' }}>{maxMentees}</span>
            <Button className="mentor-btn-round mentor-btn-blue" onClick={() => setMaxMentees(m => m + 1)}>+</Button>
          </div> */}
          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            {stats.map((s, i) => {
              if (s.label === 'mentee request') {
                return (
                  <div
                    key={i}
                    className="poll-item mentor-request-card"
                    style={{ cursor: 'pointer', minWidth: 120, maxWidth: 220, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    onClick={() => navigate('/dashboard/mentorshiprequest')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <UserGroupIcon style={{ width: 22, height: 22, color: '#60a5fa' }} />
                      <span className="poll-title blogcard-title" style={{ fontWeight: 700, fontSize: '1.08rem', color: '#60a5fa' }}>Mentor Requests</span>
                    </div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 2 }}>{s.value}</div>
                  </div>
                );
              } else if (s.label === 'sessions held') {
                return (
                  <div
                    key={i}
                    className="poll-item mentor-request-card"
                    style={{ minWidth: 120, maxWidth: 220, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <CalendarDaysIcon style={{ width: 22, height: 22, color: '#60a5fa' }} />
                      <span className="poll-title blogcard-title" style={{ fontWeight: 700, fontSize: '1.08rem', color: '#60a5fa' }}>Sessions Held</span>
                    </div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 2 }}>{s.value}</div>
                  </div>
                );
              } else if (s.label === 'Active members') {
                return (
                  <div
                    key={i}
                    className="poll-item mentor-request-card"
                    style={{ minWidth: 120, maxWidth: 220, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    onClick={() => navigate('/dashboard/mentees')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <UsersIcon style={{ width: 22, height: 22, color: '#60a5fa' }} />
                      <span className="poll-title blogcard-title" style={{ fontWeight: 700, fontSize: '1.08rem', color: '#60a5fa' }}>Active Members</span>
                    </div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: 2 }}>{s.value}</div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        {/* Right Column (Calendar) */}
        <div style={{ flex: '1 1 700px', minWidth: 420, maxWidth: 900, display: 'flex', flexDirection: 'column', gap: '2rem', marginLeft: '2.5rem' }}>
          {/* Calendar Widget */}
          <div className="advanced-features mentor-profile-field-box" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Button className="mentor-btn-round mentor-btn-blue" onClick={handlePrevMonth}><ChevronLeftIcon style={{ width: 20, height: 20 }} /></Button>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 8 }}>
                {dayjs().month(calendarMonth).format('MMMM')} {calendarYear}
                <select value={calendarYear} onChange={handleYearChange} style={{ fontSize: '1rem', marginLeft: 8, borderRadius: 6, padding: '2px 8px' }}>
                  {Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </span>
              <Button className="mentor-btn-round mentor-btn-blue" onClick={handleNextMonth}><ChevronRightIcon style={{ width: 20, height: 20 }} /></Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8, fontWeight: 700, fontSize: '1rem', color: '#a0aec0', textAlign: 'center' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
              {weeks.map((week, wi) => week.map((d, di) => (
                <div
                  key={wi + '-' + di}
                  onClick={() => d && setSelectedDate(dayjs().year(calendarYear).month(calendarMonth).date(d))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: d && selectedDate.date() === d && selectedDate.month() === calendarMonth && selectedDate.year() === calendarYear ? '#60a5fa' : 'transparent',
                    color: d && selectedDate.date() === d && selectedDate.month() === calendarMonth && selectedDate.year() === calendarYear ? '#fff' : '#a0aec0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: d ? 'pointer' : 'default',
                    border: d && selectedDate.date() === d && selectedDate.month() === calendarMonth && selectedDate.year() === calendarYear ? '2px solid #2563eb' : '1px solid #3b82f6',
                    transition: 'all 0.2s',
                    opacity: d ? 1 : 0,
                  }}
                >
                  {d || ''}
                </div>
              )))}
            </div>
          </div>
          {/* Events List */}
          <div className="advanced-features mentor-profile-field-box" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#60a5fa' }}>{dayjs(selectedDate).format('MMMM D')}</span>
              <PlusIcon style={{ width: 24, height: 24, color: '#22c55e', cursor: 'pointer' }} />
            </div>
            <div style={{ color: '#a0aec0', fontWeight: 500, fontSize: '1rem' }}>
              No events.
            </div>
          </div>
          {/* Activity Log Button */}
          <Button className="w-full mentor-btn-large mentor-btn-blue mentor-btn-activity-log" onClick={() => navigate('/dashboard/mentoractivelog')}>
            Activity Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 