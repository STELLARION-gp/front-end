import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';
import GalaxyHero from '../components/HeroComponents/GalaxyHero';
import { useLoading } from '../hooks/useLoading';
import { preloadHomeAssets } from '../utils/assetPreloader';
import './../styles/pages/Hero.scss';
import Team from '../components/HomeComponents/Team';
import Footer from '../components/Footer';

const NewHome = () => {
  const { isLoading, withLoading } = useLoading(true); // Start with loading true
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    // Load homepage with asset preloading
    const loadHomepage = async () => {
      await withLoading(async () => {
        // Preload critical assets
        await preloadHomeAssets();

        // Shorter delay for better UX - just enough to load assets
        await new Promise(resolve => setTimeout(resolve, 1000));

        setComponentsLoaded(true);
      });
    };

    loadHomepage();
  }, [withLoading]);

  return (
    <>
      {/* Simple loading spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <LoadingSpinner
            size="large"
            variant="white"
            useLottie={true}
            centered={true}
          />
        </div>
      )}

      {/* Main content - only render when loaded */}
      {componentsLoaded && (
        <>
          {/* Fixed 3D Galaxy Background for entire homepage - Interactive */}
          <div className='fixed top-0 left-0 w-full h-full z-0 pointer-events-auto'>
            <GalaxyHero />
          </div>

          {/* Scrollable content on top of galaxy background */}
          <div className="new-home">
            <Hero />
            <Team />
          </div>
        </>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};

export default NewHome;