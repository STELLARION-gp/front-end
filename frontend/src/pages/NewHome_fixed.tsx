import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import GalaxyHero from '../components/HeroComponents/GalaxyHero';
import './../styles/pages/Hero.scss';
import Team from '../components/HomeComponents/Team';
import Footer from '../components/Footer';

const NewHome = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simple loading timeout
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Shorter loading time

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Dark loading spinner */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
                    <LoadingSpinner
                        size="large"
                        variant="white"
                        useLottie={false}
                        centered={true}
                    />
                </div>
            )}

            {/* Main content */}
            {!isLoading && (
                <div className="animate-fadeIn">
                    {/* Fixed 3D Galaxy Background for entire homepage - Interactive */}
                    <div className='fixed top-0 left-0 w-full h-full z-0 pointer-events-auto'>
                        <GalaxyHero />
                    </div>

                    {/* Scrollable content on top of galaxy background */}
                    <div className="new-home">
                        <Hero />
                        <Team />
                    </div>

                    {/* Footer */}
                    <Footer />
                </div>
            )}
        </>
    );
};

export default NewHome;
