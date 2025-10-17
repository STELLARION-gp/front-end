import { useEffect, useRef, useState, memo, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo-dark.webp";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { supportedLanguages } from "../i18n";
import { NotificationBell } from "../components/NotificationBell";

import "./../styles/components/navbarMobile.scss";

const MobileNavBar = () => {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const lastScroll = useRef(window.scrollY);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get current language from i18n
  const currentLanguage = useMemo(() => {
    const currentLang =
      supportedLanguages.find((lang) => lang.code === i18n.language) ||
      supportedLanguages[0];
    return currentLang;
  }, [i18n.language]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsLanguageDropdownOpen(false);
  }, [location.pathname]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        // Check if click is not on hamburger button
        if (
          !(event.target instanceof Element) ||
          !event.target.closest(".mobile-hamburger")
        ) {
          setMobileMenuOpen(false);
        }
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  const handleLanguageToggle = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const getLanguageIcon = () => {
    switch (currentLanguage.code) {
      case "sin":
        return "සි";
      case "ta":
        return "த";
      case "en":
        return "En";
      default:
        return "En";
    }
  };

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleMobileMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSectionLink = (
    e: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
      const displayName =
        user.displayName || userProfile?.displayName || user.email || "User";

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
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const placeholder =
                      target.nextElementSibling as HTMLElement | null;
                    if (placeholder) {
                      placeholder.classList.remove("mobile-hidden");
                    }
                  }}
                />
              ) : null}
              <div
                className={`mobile-profile-placeholder${
                  avatarUrl ? " mobile-hidden" : ""
                }`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="mobile-profile-details">
              <p className="mobile-profile-name">{displayName}</p>
              <p className="mobile-profile-role">
                {userProfile?.role || "User"}
              </p>
            </div>
          </div>
          <div className="mobile-profile-links">
            <Link
              to="/dashboard/overview"
              className="mobile-nav-link"
              onClick={handleMobileNavClick}
            >
              {t("navbar.dashboard")}
            </Link>
            <Link
              to="/dashboard/profile"
              className="mobile-nav-link"
              onClick={handleMobileNavClick}
            >
              {t("navbar.profileNav")}
            </Link>
            <Link
              to="/subscription/plans"
              className="mobile-nav-link"
              onClick={handleMobileNavClick}
            >
              {t("navbar.subscription")}
            </Link>
            <button
              onClick={handleLogout}
              className="mobile-nav-link mobile-logout-btn"
              type="button"
            >
              {t("auth.signOut")}
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
            enableNavigationLoading={false}
            onClick={() => navigate("/login")}
          >
            {t("auth.signIn")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => navigate("/signup")}
            enableNavigationLoading={false}
          >
            {t("auth.signUp")}
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      <nav
        className={`mobile-navbar-blur${hidden ? " mobile-navbar-hidden" : ""}${
          mobileMenuOpen ? " mobile-menu-open" : ""
        }`}
      >
        <div className="mobile-navbar-inner">
          {/* Mobile Hamburger Menu - Left */}
          <div className="mobile-menu-toggle">
            <button
              className={`mobile-hamburger${
                mobileMenuOpen ? " mobile-active" : ""
              }`}
              onClick={toggleMobileMenu}
              aria-label={
                mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
              }
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
              title={t("navbar.goToHome")}
            />
          </div>

          {/* Language Dropdown - Right */}
          <div className="mobile-language-toggle">
            {/* Notification Bell for mobile */}
            {user && <NotificationBell />}

            <div
              className="mobile-language-dropdown-container"
              ref={languageDropdownRef}
            >
              <button
                className={`mobile-language-btn ${
                  isLanguageDropdownOpen ? "active" : ""
                }`}
                onClick={handleLanguageToggle}
                aria-label="Select language"
                aria-expanded={isLanguageDropdownOpen}
                type="button"
              >
                <span className="mobile-language-letter">
                  {getLanguageIcon()}
                </span>
              </button>

              {isLanguageDropdownOpen && (
                <div className="mobile-language-dropdown">
                  <div className="mobile-language-dropdown-header">
                    <h3>Select Language</h3>
                  </div>
                  <div className="mobile-language-list">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`mobile-language-item ${
                          currentLanguage.code === lang.code ? "active" : ""
                        }`}
                        onClick={() => handleLanguageSelect(lang.code)}
                        type="button"
                      >
                        <span className="mobile-language-icon">
                          {lang.flag}
                        </span>
                        <div className="mobile-language-info">
                          <span className="mobile-language-name">
                            {lang.name}
                          </span>
                          <span className="mobile-language-code">
                            {lang.code.toUpperCase()}
                          </span>
                        </div>
                        {currentLanguage.code === lang.code && (
                          <svg
                            className="mobile-check-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M13.3334 4L6.00002 11.3333L2.66669 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay${
          mobileMenuOpen ? " mobile-active" : ""
        }`}
      >
        <div className="mobile-menu-content" ref={mobileMenuRef}>
          {/* Navigation Links */}
          <div className="mobile-nav-links">
            <button
              className="mobile-nav-link"
              onClick={(e) => handleSectionLink(e, "features")}
              type="button"
            >
              {t("navbar.features")}
            </button>
            <button
              className="mobile-nav-link"
              onClick={(e) => handleSectionLink(e, "about")}
              type="button"
            >
              {t("navbar.about")}
            </button>
            <button
              className="mobile-nav-link"
              onClick={(e) => handleSectionLink(e, "contact")}
              type="button"
            >
              {t("navbar.contact")}
            </button>
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
          role="button"
          tabIndex={0}
          aria-label="Close mobile menu"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setMobileMenuOpen(false);
            }
          }}
        />
      )}
    </>
  );
};

export default memo(MobileNavBar);
