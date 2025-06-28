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
  const [isAuthenticated] = useState(false); // This would come from auth context
  const [userProfile] = useState<UserProfile | null>(null); // This would come from auth context
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

  const renderAuthContent = () => {
    if (userProfile) {
      return (
        <div className="profile-section" onClick={handleAuthClick}>
          <img
            src={userProfile.avatar || '/default-avatar.png'}
            alt="Profile"
            className="profile-avatar"
          />
        </div>
      );
    } else if (isAuthenticated) {
      return (
        <Button
          variant="secondary"
          size="medium"
          onClick={handleAuthClick}
        >
          Sign In
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          size="medium"
          onClick={handleAuthClick}
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

        {/* Auth Section - Shown in compact mode */}
        {isCompactMode && (
          <div className="auth-section-compact">
            {renderAuthContent()}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarComponent;