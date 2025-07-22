import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo-dark.png';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from '../components/RoleGuard';
import { supportedLanguages } from '../i18n';

import './../styles/components/navbar.scss';

const NavBarComponent = () => {
  const [hidden, setHidden] = useState(false);
  //const [currentTheme, setCurrentTheme] = useState('system');
  // Removed language state variable - using i18n directly
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const lastScroll = useRef(window.scrollY);

  // Get current language from i18n with logging
  const currentLanguage = useMemo(() => {
    const currentLang = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
    console.log('Current language detected:', currentLang);
    return currentLang;
  }, [i18n.language]);

  // Track language changes and force re-render
  useEffect(() => {
    console.log('NavBar re-rendered with language:', i18n.language);
    // Language is tracked directly via i18n
  }, [i18n.language]);

  // Determine if we should show compact mode based on current route
  const isHomePage = location.pathname === '/';
  const isCompactMode = !isHomePage && !location.pathname.includes('/404');

  // Save route path in ref to avoid re-renders on route changes
  const routeRef = useRef(location.pathname);

  // Only update compact mode when truly needed (home vs other pages)
  const shouldUpdateCompactMode =
    (routeRef.current === '/' && location.pathname !== '/') ||
    (routeRef.current !== '/' && location.pathname === '/');

  // Update ref only when needed for comparison
  if (shouldUpdateCompactMode) {
    routeRef.current = location.pathname;
  }

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
    //setCurrentTheme(savedTheme);
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

  const handleLanguageToggle = () => {
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage.code);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const nextLanguage = supportedLanguages[nextIndex];

    // Use i18n.changeLanguage directly
    i18n.changeLanguage(nextLanguage.code);

    console.log(`Language switched to: ${nextLanguage.name} (${nextLanguage.code})`);
  };

  // const handleThemeToggle = () => {
  //   const themes = ['system', 'light', 'dark'];
  //   const currentIndex = themes.indexOf(currentTheme);
  //   const nextIndex = (currentIndex + 1) % themes.length;
  //   const nextTheme = themes[nextIndex];
  //   setCurrentTheme(nextTheme);

  //   // Apply theme to document
  //   document.documentElement.setAttribute('data-theme', nextTheme);
  //   localStorage.setItem('theme', nextTheme);
  //   console.log(`Theme switched to: ${nextTheme}`);
  // };

  // const getThemeIcon = () => {
  //   console.log('Getting theme icon for theme:', currentTheme);
  //   switch (currentTheme) {
  //     case 'light':
  //       // Sun emoji for light theme
  //       return <span className="theme-text">☀️</span>;
  //     case 'dark':
  //       // Moon emoji for dark theme
  //       return <span className="theme-text">🌙</span>;
  //     default:
  //       // Computer emoji for system theme
  //       return <span className="theme-text">💻</span>;
  //   }
  // };

  const getLanguageIcon = () => {
    console.log('Getting language icon for language:', currentLanguage.code);
    // Use appropriate letters for each language
    switch (currentLanguage.code) {
      case 'sin':
        return 'සි'; // Sinhala letters
      case 'ta':
        return 'த'; // Tamil letter
      case 'en':
        return 'En'; // English
      default:
        return 'En'; // Default to English
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Use window.location.href to force a full page reload after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderAuthContent = (forCompactMode = false) => {
    if (user) {
      // User is logged in - show profile picture or placeholder
      const avatarUrl = user.photoURL || userProfile?.profileData?.avatar;
      const displayName = user.displayName || userProfile?.displayName || user.email || 'User';

      return (
        <div className="profile-section">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="profile-avatar"
              onError={(e) => {
                // Hide the image and show placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.classList.remove('hidden');
                }
              }}
            />
          ) : null}
          <div className={`profile-placeholder ${avatarUrl ? 'hidden' : ''}`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          {!forCompactMode && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <p className="profile-name">{displayName}</p>
                <p className="profile-role">{userProfile?.role || 'User'}</p>
              </div>
              <div className="profile-actions">
                <Link to="/dashboard/overview" className="dropdown-link">{t('navbar.dashboard')}</Link>
                <Link to="/dashboard/profile" className="dropdown-link">{t('navbar.profileNav')}</Link>
                <Link to="/subscription/plans" className="dropdown-link">{t('navbar.subscription')}</Link>
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
            variant="primary"
            size="small"
            href="/login"
            enableNavigationLoading={false}
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
        {/* <button
          className="utility-btn theme-btn"
          onClick={handleThemeToggle}
          title={t('navbar.currentTheme') + `: ${currentTheme}`}
        >
          <div className="theme-icon-wrapper">
            {getThemeIcon()}
          </div>
        </button> */}
      </div>
    );
  };

  // Smooth scroll to section if on home page, otherwise navigate to home and then scroll
  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (isHomePage) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className={`navbar-blur${hidden ? ' navbar-hidden' : ''}${isCompactMode ? ' navbar-compact' : ''}`}>
      <div className="navbar-inner">
        {/* Left Nav - Hidden in compact mode */}
        {!isCompactMode && (
          <div className="navbar-section left-section">
            <a href="#features" className="nav-link" onClick={e => handleSectionLink(e, 'features')}>{t('navbar.features')}</a>
            <a href="#about" className="nav-link" onClick={e => handleSectionLink(e, 'about')}>{t('navbar.about')}</a>
            <Link to="/subscription/plans" className="nav-link">{t('navbar.plans')}</Link>
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
            {/* <a href="#" className="nav-link">{t('navbar.team')}</a> */}
            <RoleGuard>
              <a href="#" className="nav-link">{t('navbar.explore')}</a>
            </RoleGuard>
            {renderUtilityButtons()}
            {renderAuthContent()}
          </div>
        )}

        {/* Auth Section - Shown in compact mode only if user is logged in */}
        {isCompactMode && (
          <div className="auth-section-compact">
            {renderUtilityButtons(true)}
            {user && renderAuthContent(true)}
          </div>
        )}
      </div>
    </nav>
  );
};

// Export memoized component to prevent unnecessary re-renders, but allow language changes
export default memo(NavBarComponent, () => {
  // Since this component has no props, we should re-render when language changes
  // Return false to allow re-render (memo prevents re-render when true is returned)
  return false;
});