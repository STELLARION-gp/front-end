import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ Use Link for SPA navigation
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
} from '@heroicons/react/24/outline';
import ButtonGradient from '../assets/svg/ButtonGradient';

const Sidebar: React.FC = () => {
  const location = useLocation(); // ✅ Get current URL path
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]); // For styling on hover

  const handleMouseEnter = (index: number) => {
    if (itemsRef.current[index - 1]) itemsRef.current[index - 1]?.classList.add('bottom-rounded');
    if (itemsRef.current[index + 1]) itemsRef.current[index + 1]?.classList.add('top-rounded');
  };

  const handleMouseLeave = () => {
    itemsRef.current.forEach((el) => el?.classList.remove('top-rounded', 'bottom-rounded'));
  };

  const menuItems = [
    { label: 'Overview', icon: <HomeIcon className="icon" />, href: '/dashboard/overview' },
    { label: 'Settings', icon: <Cog6ToothIcon className="icon" />, href: '/dashboard/settings' },
    { label: 'Blogs', icon: <BookOpenIcon className="icon" />, href: '/dashboard/blogs' },
    { label: 'Mentor', icon: <AcademicCapIcon className="icon" />, href: '/dashboard/mentor' },
    { label: 'Events', icon: <CalendarDaysIcon className="icon" />, href: '/dashboard/events' },
    { label: 'Chat', icon: <ChatBubbleLeftRightIcon className="icon" />, href: '/dashboard/chat' },
    { label: 'Sessions', icon: <UsersIcon className="icon" />, href: '/dashboard/sessions' },
  ];

  const LinkItems = [
    { label: 'Help', icon: <QuestionMarkCircleIcon className="icon" />, href: '/help' },
  ];

  const isActive = (path: string): boolean => location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/"> {/* ✅ Use Link instead of <a> */}
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className="center">
        <ul className="sidebar-menu">
          {menuItems.map((item, i) => (
            <li
              key={i}
              ref={(el) => (itemsRef.current[i] = el)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link to={item.href}> {/* ✅ SPA routing */}
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
              ref={(el) => (itemsRef.current[i + menuItems.length] = el)}
              onMouseEnter={() => handleMouseEnter(i + menuItems.length)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link to={item.href}> {/* ✅ SPA routing */}
                {item.icon}
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ButtonGradient />
      </div>
    </div>
  );
};

export default Sidebar;
