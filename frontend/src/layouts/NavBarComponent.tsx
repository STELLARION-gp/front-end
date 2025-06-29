import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-dark.png';
import Button from '../components/Button';
import './../styles/components/navbar.scss';

interface UserProfile {
  avatar?: string;
  name?: string;
}

const NavBarComponent = () => {
  const [hidden, setHidden] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isAuthenticated] = useState(true); // Mock: Set to true to show authenticated state
  const [userProfile] = useState<UserProfile | null>({ 
    // avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    // name: 'John Doe'
    
  }); // Mock: User profile with avatar
  const lastScroll = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll.current && current > 80) {
        setHidden(true); // scroll down, hide
      } else {
        setHidden(false); // scroll up, show
      }
      lastScroll.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (isCompactMode) {
      setIsCompactMode(!isCompactMode);
    } else {
      // Navigate to home page
      window.location.href = '/';
    }
  };

  const handleAuthClick = () => {
    setIsCompactMode(true);
    // Handle auth navigation here
  };

  const renderAuthContent = (forCompactMode = false) => {
    if (userProfile && userProfile.avatar) {
      return (
        <div className="profile-section" onClick={handleAuthClick}>
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="profile-avatar"
          />
        </div>
      );
    } else if (isAuthenticated) {
      // In compact mode, only show if there's a profile avatar
      if (forCompactMode) return null;
      return (
        <Button
          variant="primary"
          size="medium"
          onClick={handleAuthClick}
          href='/login'
        >
          Sign In
        </Button>
      );
    } else {
      // In compact mode, only show if there's a profile avatar
      if (forCompactMode) return null;
      return (
        <Button
          variant="primary"
          size="medium"
          onClick={handleAuthClick}
          href='/signup'
        >
          Sign Up
        </Button>
      );
    }
  };

  return (
    <nav className={`navbar-blur${hidden ? ' navbar-hidden' : ''}${isCompactMode ? ' navbar-compact' : ''}`}>
      <div className="navbar-inner">
        {/* Left Nav - Hidden in compact mode */}
        {!isCompactMode && (
          <div className="navbar-section left-section">
            <a href="#" className="nav-link">Features</a>
            <a href="/about" className="nav-link">About Us</a>
            <a href="#" className="nav-link">Contact</a>
          </div>
        )}

        {/* Logo */}
        <div className={`navbar-logo${isCompactMode ? ' logo-left' : ''}`}>
          <img
            src={logo}
            alt="logo"
            className="nav-logo"
            onClick={handleLogoClick}
            title={isCompactMode ? "Click to expand navbar" : "Go to Home"}
          />
        </div>

        {/* Right Nav - Only auth content in compact mode */}
        {!isCompactMode && (
          <div className="navbar-section right-section">
            <a href="#" className="nav-link">Team</a>
            <a href="#" className="nav-link">Explore</a>
            {renderAuthContent()}
          </div>
        )}

        {/* Auth Section - Shown in compact mode only if user has profile avatar */}
        {isCompactMode && renderAuthContent(true) && (
          <div className="auth-section-compact">
            {renderAuthContent(true)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarComponent;