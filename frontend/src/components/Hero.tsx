import GalaxyHero from './HeroComponents/GalaxyHero';
import './../styles/pages/Hero.scss';
import NavBarComponent from '../layouts/NavBarComponent';

const Hero = () => {
    return (
        <div className='relative w-full h-screen overflow-hidden'>
            <NavBarComponent />

            {/* GalaxyHero in background */}
            <div className='absolute top-0 left-0 w-full h-full z-10 pointer-events-none'>
                <GalaxyHero />
            </div>

            {/* Content above GalaxyHero */}
            <div className='hero-content z-30'>
                <h1>Stellarion: Explore the Universe</h1>
                <p className='mt-4'>Discover, learn, and interact with the cosmos in a visually stunning 3D environment. Start your journey now.</p>
                <a href="#features" className="signup-btn mt-8" style={{ pointerEvents: 'auto', marginTop: '2rem', display: 'inline-block' }}>
                  Get Started
                </a>
            </div>
        </div>
    );
};

export default Hero;