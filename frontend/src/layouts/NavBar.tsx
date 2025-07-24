import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo-dark.webp';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { supportedLanguages } from '../i18n';

import './../styles/components/navbarMobile.scss';

const MobileNavBar = () => {
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, userProfile, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const lastScroll = useRef(window.scrollY);
    const mobileMenuRef = useRef(null);

    // Get current language from i18n
    const currentLanguage = useMemo(() => {
        const currentLang = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
        return currentLang;
    }, [i18n.language]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                // Check if click is not on hamburger button
                if (!event.target.closest('.mobile-hamburger')) {
                    setMobileMenuOpen(false);
                }
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [mobileMenuOpen]);

    // Handle scroll to hide/show navbar
    useEffect(() => {
        const handleScroll = () => {
            // Don't hide navbar when mobile menu is open
            if (mobileMenuOpen) return;
            
            const current = window.scrollY;
            if (current > lastScroll.current && current > 80) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScroll.current = current;
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mobileMenuOpen]);

    const handleLogoClick = () => {
        setMobileMenuOpen(false);
        window.location.href = '/';
    };

    const handleLanguageToggle = () => {
        const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage.code);
        const nextIndex = (currentIndex + 1) % supportedLanguages.length;
        const nextLanguage = supportedLanguages[nextIndex];

        i18n.changeLanguage(nextLanguage.code);
    };

    const getLanguageIcon = () => {
        switch (currentLanguage.code) {
            case 'sin':
                return 'සි';
            case 'ta':
                return 'த';
            case 'en':
                return 'En';
            default:
                return 'En';
        }
    };

    const handleLogout = async () => {
        try {
            setMobileMenuOpen(false);
            await logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const toggleMobileMenu = (e) => {
        e.stopPropagation();
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleSectionLink = (e, sectionId) => {
        e.preventDefault();
        setMobileMenuOpen(false);

        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If section not found on current page, navigate to home with hash
            window.location.href = `/#${sectionId}`;
        }
    };

    const handleMobileNavClick = () => {
        setMobileMenuOpen(false);
    };

    const renderAuthContent = () => {
        if (user) {
            const avatarUrl = user.photoURL || userProfile?.profileData?.avatar;
            const displayName = user.displayName || userProfile?.displayName || user.email || 'User';

            return (
                <div className="mobile-auth-content">
                    <div className="mobile-profile-info">
                        <div className="mobile-profile-avatar-wrapper">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="mobile-profile-avatar"
                                    onError={(e) => {
                                        const target = e.target;
                                        target.style.display = 'none';
                                        const placeholder = target.nextElementSibling;
                                        if (placeholder) {
                                            placeholder.classList.remove('mobile-hidden');
                                        }
                                    }}
                                />
                            ) : null}
                            <div className={`mobile-profile-placeholder${avatarUrl ? ' mobile-hidden' : ''}`}>
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="mobile-profile-details">
                            <p className="mobile-profile-name">{displayName}</p>
                            <p className="mobile-profile-role">{userProfile?.role || 'User'}</p>
                        </div>
                    </div>
                    <div className="mobile-profile-links">
                        <Link 
                            to="/dashboard/overview" 
                            className="mobile-nav-link"
                            onClick={handleMobileNavClick}
                        >
                            {t('navbar.dashboard')}
                        </Link>
                        <Link 
                            to="/dashboard/profile" 
                            className="mobile-nav-link"
                            onClick={handleMobileNavClick}
                        >
                            {t('navbar.profileNav')}
                        </Link>
                        <Link 
                            to="/subscription/plans" 
                            className="mobile-nav-link"
                            onClick={handleMobileNavClick}
                        >
                            {t('navbar.subscription')}
                        </Link>
                        <button onClick={handleLogout} className="mobile-nav-link mobile-logout-btn">
                            {t('auth.signOut')}
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="mobile-auth-buttons">
                    <Button
                        variant="primary"
                        size="small"
                        href="/login"
                        enableNavigationLoading={false}
                        onClick={handleMobileNavClick}
                    >
                        {t('auth.signIn')}
                    </Button>
                    <Button
                        variant="primary"
                        size="small"
                        href="/signup"
                        enableNavigationLoading={false}
                        onClick={handleMobileNavClick}
                    >
                        {t('auth.signUp')}
                    </Button>
                </div>
            );
        }
    };

    return (
        <>
            <nav className={`mobile-navbar-blur${hidden ? ' mobile-navbar-hidden' : ''}${mobileMenuOpen ? ' mobile-menu-open' : ''}`}>
                <div className="mobile-navbar-inner">
                    {/* Mobile Hamburger Menu - Left */}
                    <div className="mobile-menu-toggle">
                        <button
                            className={`mobile-hamburger${mobileMenuOpen ? ' mobile-active' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                            aria-expanded={mobileMenuOpen}
                            type="button"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    {/* Logo - Center */}
                    <div className="mobile-navbar-logo">
                        <img
                            src={logo}
                            alt="logo"
                            className="mobile-nav-logo"
                            onClick={handleLogoClick}
                            title={t('navbar.goToHome')}
                        />
                    </div>

                    {/* Language Toggle - Right */}
                    <div className="mobile-language-toggle">
                        <button
                            className="mobile-language-btn"
                            onClick={handleLanguageToggle}
                            aria-label={`Switch language to ${currentLanguage.name}`}
                            type="button"
                        >
                            <span className="mobile-language-letter">{getLanguageIcon()}</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay${mobileMenuOpen ? ' mobile-active' : ''}`}>
                <div className="mobile-menu-content" ref={mobileMenuRef}>
                    {/* Navigation Links */}
                    <div className="mobile-nav-links">
                        <a
                            href="#features"
                            className="mobile-nav-link"
                            onClick={e => handleSectionLink(e, 'features')}
                        >
                            {t('navbar.features')}
                        </a>
                        <a
                            href="#about"
                            className="mobile-nav-link"
                            onClick={e => handleSectionLink(e, 'about')}
                        >
                            {t('navbar.about')}
                        </a>
                        <a
                            href="#contact"
                            className="mobile-nav-link"
                            onClick={e => handleSectionLink(e, 'contact')}
                        >
                            {t('navbar.contact')}
                        </a>
                    </div>

                    {/* Auth Content */}
                    {renderAuthContent()}
                </div>
            </div>

            {/* Background overlay to close menu */}
            {mobileMenuOpen && (
                <div 
                    className="mobile-menu-backdrop" 
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default memo(MobileNavBar);