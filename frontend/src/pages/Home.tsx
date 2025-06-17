import React from 'react';
import Navbar from '../layouts/NavBar';
import logo from '../assets/logo-light.png'; // Adjust the path as necessary
import astro from '../assets/astro.png'; // Adjust the path as necessary
import '../styles/pages/home.scss';
import world from '../assets/world2.png'; // Adjust the path as necessary

const Home: React.FC = () => {
  return (
    <div className='home-page'>
      <div className='world-container'>
        <img src={world} alt="" className='world-image' />
      </div>
      <Navbar
        logo={logo}
        navItemsR={[
          { label: "navbar.home", href: "/" },
          { label: "navbar.about", href: "/about" },
          { label: "navbar.contact", href: "/contact" }
        ]}
        navItemsL={[
          { label: "navbar.profile", href: "/profile" },
          { label: "navbar.settings", href: "/settings" }
        ]}
      />
      <div className='home-container'>
        <img src={astro} alt="" className='astro-image' />
      </div>
    </div>
  );
};

export default Home;
