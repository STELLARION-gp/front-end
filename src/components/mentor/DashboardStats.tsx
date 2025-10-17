import React from 'react';
import { UserGroupIcon, CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import '../../styles/components/mentor/DashboardStats.scss';

interface Stat {
  label: string;
  value: number;
  icon: React.ElementType;
  onClick?: () => void;
  clickable?: boolean;
}

interface DashboardStatsProps {
  sessionsHeld: number;
  menteeRequests: number;
  activeMembers: number;
  avgRating?: number;
  hoursMentored?: number;
  onRequestsClick: () => void;
  onMembersClick: () => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  sessionsHeld,
  menteeRequests,
  activeMembers,
  avgRating,
  hoursMentored,
  onRequestsClick,
  onMembersClick
}) => {
  const stats: Stat[] = [
    {
      label: 'Sessions Held',
      value: sessionsHeld,
      icon: CalendarDaysIcon,
      clickable: false
    },
    {
      label: 'Mentor Requests',
      value: menteeRequests,
      icon: UserGroupIcon,
      onClick: onRequestsClick,
      clickable: true
    },
    {
      label: 'Active Members',
      value: activeMembers,
      icon: UsersIcon,
      onClick: onMembersClick,
      clickable: true
    }
    ,{
      label: 'Avg. Rating',
      value: Math.round((avgRating || 0) * 10) / 10,
      icon: UsersIcon,
      clickable: false
    },
    {
      label: 'Hours Mentored',
      value: hoursMentored || 0,
      icon: CalendarDaysIcon,
      clickable: false
    }
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`dashboard-stats__card ${stat.clickable ? 'clickable' : ''}`}
          onClick={stat.onClick}
        >
          <div className="dashboard-stats__header">
            {React.createElement(stat.icon, { className: "dashboard-stats__icon" })}
            <h4 className="dashboard-stats__title">{stat.label}</h4>
          </div>
          <div className="dashboard-stats__value">{stat.value}</div>
          {stat.clickable && (
            <div className="dashboard-stats__action">
              <span>View Details →</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;