import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-dark.png';
import './../styles/components/navbar.scss';

const NavBarComponent = () => {
  const [hidden, setHidden] = useState(false);
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

  return (
    <nav className={`navbar-blur${hidden ? ' navbar-hidden' : ''}`}>
      <div className="navbar-inner">
        {/* Left Nav */}
        <div className="navbar-section">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Features</a>
          <a href="#" className="nav-link">Pricing</a>
        </div>
        {/* Logo Centered */}
        <div className="navbar-logo">
          <img src={logo} alt="logo" className="nav-logo" />
        </div>
        {/* Right Nav */}
        <div className="navbar-section">
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBarComponent;