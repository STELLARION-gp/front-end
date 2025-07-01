import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo-dark.png';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from '../components/RoleGuard';
import { supportedLanguages } from '../i18n';
import {
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import {
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid
} from '@heroicons/react/24/solid';
import './../styles/components/navbar.scss';

const NavBarComponent = () => {
  const [hidden, setHidden] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('system');
  const [currentLangCode, setCurrentLangCode] = useState('en');
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const lastScroll = useRef(window.scrollY);

  // Get current language from i18n with logging
  const getCurrentLanguage = () => {
    const currentLang = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
    console.log('Current language detected:', currentLang);
    return currentLang;
  };

  const currentLanguage = getCurrentLanguage();

  // Track language changes and update local state to trigger re-renders
  useEffect(() => {
    console.log('NavBar re-rendered with language:', i18n.language);
    setCurrentLangCode(i18n.language);

    // Add a listener for language change events
    const handleLanguageChange = (lng: string) => {
      console.log('Language changed event received:', lng);
      setCurrentLangCode(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Determine if we should show compact mode based on current route
  const isCompactMode = location.pathname !== '/';

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

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'system';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    // Debug: Log when language changes
    console.log('🌐 Current language in navbar:', i18n.language, currentLanguage);
  }, [i18n.language, currentLanguage]);

  const handleLogoClick = () => {
    if (isCompactMode) {
      // Navigate to home page when in compact mode
      window.location.href = '/';
    } else {
      // Already on home page, just navigate to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    // Handle auth navigation here
  };

  const handleLanguageToggle = () => {
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage.code);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const nextLanguage = supportedLanguages[nextIndex];

    // Use i18n.changeLanguage directly
    i18n.changeLanguage(nextLanguage.code);

    console.log(`Language switched to: ${nextLanguage.name} (${nextLanguage.code})`);
  };

  const handleThemeToggle = () => {
    const themes = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setCurrentTheme(nextTheme);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    console.log(`Theme switched to: ${nextTheme}`);
  };

  const getThemeIcon = () => {
    console.log('Getting theme icon for theme:', currentTheme);
    switch (currentTheme) {
      case 'light':
        // Sun emoji for light theme
        return <span className="theme-text">☀️</span>;
      case 'dark':
        // Moon emoji for dark theme
        return <span className="theme-text">🌙</span>;
      default:
        // Computer emoji for system theme
        return <span className="theme-text">💻</span>;
    }
  };

  const getLanguageIcon = () => {
    console.log('Getting language icon for language:', currentLanguage.code);
    // Use first letter of language as icon content
    switch (currentLanguage.code) {
      case 'sin':
        return 'සි'; // First letter of Sinhala
      case 'ta':
        return 'த'; // First letter of Tamil
      case 'en':
      default:
        return 'E'; // First letter of English
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderAuthContent = (forCompactMode = false) => {
    if (user && userProfile) {
      // Authenticated user - show profile or logout
      return (
        <div className="profile-section" onClick={handleAuthClick}>
          {userProfile.profileData?.avatar ? (
            <img
              src={userProfile.profileData.avatar}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-placeholder">
              {userProfile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {!forCompactMode && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <p className="profile-name">{userProfile.displayName}</p>
                <p className="profile-role">{userProfile.role}</p>
              </div>
              <div className="profile-actions">
                <a href="/profile" className="dropdown-link">{t('navbar.profile')}</a>
                <a href="/settings" className="dropdown-link">{t('navbar.settings')}</a>
                <RoleGuard minimumRole="moderator">
                  <a href="/admin" className="dropdown-link">{t('navbar.adminPanel')}</a>
                </RoleGuard>
                <button onClick={handleLogout} className="dropdown-link logout">
                  {t('auth.signOut')}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Not authenticated - show only sign in button
      if (forCompactMode) return null;
      return (
        <div className="auth-buttons">
          <Button
            variant="secondary"
            size="medium"
            href="/login"
          >
            {t('auth.signIn')}
          </Button>
        </div>
      );
    }
  };

  const renderUtilityButtons = (forCompactMode = false) => {
    return (
      <div className={`utility-buttons ${forCompactMode ? 'compact' : ''}`}>
        {/* Language Toggle Button */}
        <button
          className="utility-btn language-btn"
          onClick={handleLanguageToggle}
          title={t('navbar.currentLanguage') + `: ${currentLanguage.name}`}
        >
          <span className="language-letter">{getLanguageIcon()}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          className="utility-btn theme-btn"
          onClick={handleThemeToggle}
          title={t('navbar.currentTheme') + `: ${currentTheme}`}
        >
          <div className="theme-icon-wrapper">
            {getThemeIcon()}
          </div>
        </button>
      </div>
    );
  };

  return (
    <nav key={currentLangCode} className={`navbar-blur${hidden ? ' navbar-hidden' : ''}${isCompactMode ? ' navbar-compact' : ''}`}>
      <div className="navbar-inner">
        {/* Left Nav - Hidden in compact mode */}
        {!isCompactMode && (
          <div className="navbar-section left-section">
            <a href="#" className="nav-link">{t('navbar.features')}</a>
            <a href="/about" className="nav-link">{t('navbar.about')}</a>
            <a href="#" className="nav-link">{t('navbar.contact')}</a>
          </div>
        )}

        {/* Logo */}
        <div className={`navbar-logo${isCompactMode ? ' logo-left' : ''}`}>
          <img
            src={logo}
            alt="logo"
            className="nav-logo"
            onClick={handleLogoClick}
            title={isCompactMode ? t('navbar.goToHome') : t('navbar.scrollToTop')}
          />
        </div>

        {/* Right Nav - Only auth content in compact mode */}
        {!isCompactMode && (
          <div className="navbar-section right-section">
            <a href="#" className="nav-link">{t('navbar.team')}</a>
            <RoleGuard>
              <a href="#" className="nav-link">{t('navbar.explore')}</a>
            </RoleGuard>
            {renderUtilityButtons()}
            {renderAuthContent()}
          </div>
        )}

        {/* Auth Section - Shown in compact mode only if user has profile */}
        {isCompactMode && (
          <div className="auth-section-compact">
            {renderUtilityButtons(true)}
            {user && userProfile && renderAuthContent(true)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarComponent;