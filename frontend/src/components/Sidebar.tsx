import React, { useRef, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMenuItemsForRole } from '../utils/rolePermissions';
import '../styles/components/_sidebar.scss';
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
} from '@heroicons/react/24/outline';

// Define interfaces for menu items
interface MenuItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
}

interface ProcessedMenuItem extends MenuItem {
  icon: React.ReactNode;
}

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
};

// Memoize the icon components to prevent re-renders
const MemoizedIcon = memo(({ icon }: { icon: React.ReactNode }) => <>{icon}</>);

// Memoized sidebar menu item to prevent re-renders
const SidebarMenuItem = memo(({
  item,
  index,
  isActive,
  handleNavigation,
  handleMouseEnter,
  handleMouseLeave,
  setRef
}: {
  item: ProcessedMenuItem;
  index: number;
  isActive: (path: string) => boolean;
  handleNavigation: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  setRef: (el: HTMLLIElement | null) => void;
}) => (
  <li
    ref={setRef}
    onMouseEnter={() => handleMouseEnter(index)}
    onMouseLeave={handleMouseLeave}
    className={isActive(item.href) ? 'active' : ''}
  >
    <Link
      to={item.href}
      onClick={(e) => handleNavigation(e, item.href)}
    >
      <MemoizedIcon icon={item.icon} />
      <span className="label">{item.label}</span>
    </Link>
  </li>
));

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout } = useAuth();
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Determine if a menu item is active
  const isActive = useCallback((path: string): boolean => location.pathname.startsWith(path), [location.pathname]);

  const handleMouseEnter = useCallback((index: number) => {
    if (itemsRef.current[index - 1]) itemsRef.current[index - 1]?.classList.add('bottom-rounded');
    if (itemsRef.current[index + 1]) itemsRef.current[index + 1]?.classList.add('top-rounded');
  }, []);

  const handleMouseLeave = useCallback(() => {
    itemsRef.current.forEach((el) => el?.classList.remove('top-rounded', 'bottom-rounded'));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }, [logout, navigate]);

  // Handle navigation without page reload
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();

    // Only trigger navigation if we're not already on that path
    if (!isActive(path)) {
      console.log("Navigating to", path);

      // Use navigate instead of directly setting window.location to prevent full page reload
      navigate(path);
    } else {
      console.log("Already on path:", path, "- skipping navigation");
    }
  }, [navigate, isActive]);

  // Get menu items based on user role
  const menuItems: ProcessedMenuItem[] = userProfile
    ? getMenuItemsForRole(userProfile.role).map((item: MenuItem) => ({
      ...item,
      icon: typeof item.icon === 'string'
        ? React.createElement(iconMap[item.icon as keyof typeof iconMap], { className: "icon" })
        : item.icon
    }))
    : [];

  const LinkItems: ProcessedMenuItem[] = [
    { label: 'Help', icon: <QuestionMarkCircleIcon className="icon" />, href: '/help' },
  ];

  if (!userProfile) {
    return null; // Don't show sidebar if user is not authenticated
  }

  return (
    <div className="sidebar">
      <div className="center sidebar-main">
        <ul className="sidebar-menu">
          {menuItems.map((item: ProcessedMenuItem, i: number) => (
            <li
              key={i}
              ref={(el) => { itemsRef.current[i] = el; }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link
                to={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
              >
                <MemoizedIcon icon={item.icon} />
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bottom">
        <ul className="sidebar-menu">
          {LinkItems.map((item: ProcessedMenuItem, i: number) => (
            <li
              key={i + menuItems.length}
              ref={(el) => { itemsRef.current[i + menuItems.length] = el; }}
              onMouseEnter={() => handleMouseEnter(i + menuItems.length)}
              onMouseLeave={handleMouseLeave}
              className={isActive(item.href) ? 'active' : ''}
            >
              <Link
                to={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
              >
                <MemoizedIcon icon={item.icon} />
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Logout Button */}
          <li
            ref={(el) => { itemsRef.current[menuItems.length + LinkItems.length] = el; }}
            onMouseEnter={() => handleMouseEnter(menuItems.length + LinkItems.length)}
            onMouseLeave={handleMouseLeave}
            className="logout-item"
            onClick={handleLogout}
          >
            <div className="logout-link">
              <span className="label">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default memo(Sidebar, () => true);
