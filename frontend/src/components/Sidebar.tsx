import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMenuItemsForRole } from '../utils/rolePermissions';
import '../styles/components/_sidebar.scss';
import logo from '../assets/logo-light.png';
import {
  HomeIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  ArrowLeftOnRectangleIcon,
  MoonIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  HomeIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  MoonIcon,
  PhotoIcon,
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const handleMouseEnter = (index: number) => {
    if (itemsRef.current[index - 1]) itemsRef.current[index - 1]?.classList.add('bottom-rounded');
    if (itemsRef.current[index + 1]) itemsRef.current[index + 1]?.classList.add('top-rounded');
  };

  const handleMouseLeave = () => {
    itemsRef.current.forEach((el) => el?.classList.remove('top-rounded', 'bottom-rounded'));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get menu items based on user role
  const menuItems = userProfile
    ? getMenuItemsForRole(userProfile.role).map(item => ({
      ...item,
      icon: React.createElement(iconMap[item.icon as keyof typeof iconMap], { className: "icon" })
    }))
    : [];

  const LinkItems = [
    { label: 'Help', icon: <QuestionMarkCircleIcon className="icon" />, href: '/help' },
  ];

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  if (!userProfile) {
    return null; // Don't show sidebar if user is not authenticated
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      {/* User Info */}
      <div className="user-info">
        <div className="user-avatar">
          {userProfile.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="user-name">{userProfile.displayName}</span>
          <span className="user-role">{userProfile.role}</span>
        </div>
      </div>

      <div className="center">
        <ul className="sidebar-menu">
          {menuItems.map((item, i) => (
            <li
              key={i}
              ref={(el) => { itemsRef.current[i] = el; }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link to={item.href}>
                {item.icon}
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bottom">
        <ul className="sidebar-menu">
          {LinkItems.map((item, i) => (
            <li
              key={i + menuItems.length}
              ref={(el) => { itemsRef.current[i + menuItems.length] = el; }}
              onMouseEnter={() => handleMouseEnter(i + menuItems.length)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link to={item.href}>
                {item.icon}
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Logout Button */}
          <li
            ref={(el) => { itemsRef.current[menuItems.length + LinkItems.length] = el; }}
            onMouseEnter={() => handleMouseEnter(menuItems.length + LinkItems.length)}
            onMouseLeave={handleMouseLeave}
          >
            <button onClick={handleLogout} className="logout-button">
              <ArrowLeftOnRectangleIcon className="icon" />
              <span className="label">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
