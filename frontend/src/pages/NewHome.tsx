import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/HomeComponents/Stats';
import FullScreenLoader from '../components/FullScreenLoader';
import { useLoading } from '../hooks/useLoading';
import { preloadHomeAssets } from '../utils/assetPreloader';
import './../styles/pages/Hero.scss';

const NewHome = () => {
  const { isLoading, withLoading } = useLoading(true); // Start with loading true
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  // Option 1: Single smooth message (recommended for simplicity)
  const singleMessage = "Welcome to STELLARION";

  // Option 2: Multiple messages for engaging experience (uncomment to use)
  // const loadingMessages = [
  //   "Welcome to STELLARION",
  //   "Initializing cosmic interface...",
  //   "Loading stellar data...",
  //   "Preparing your journey..."
  // ];

  useEffect(() => {
    // Load homepage with asset preloading
    const loadHomepage = async () => {
      await withLoading(async () => {
        // Preload critical assets
        await preloadHomeAssets();

        // Adjust timing based on message type:
        // - Single message: shorter delay (2-3 seconds)
        // - Multiple messages: longer delay to show transitions (8 seconds)
        const delay = Array.isArray(singleMessage) ? 8000 : 2500;
        await new Promise(resolve => setTimeout(resolve, delay));

        setComponentsLoaded(true);
      });
    };

    loadHomepage();
  }, [withLoading]);

  return (
    <>
      {/* Full screen loader with single smooth message */}
      <FullScreenLoader
        isVisible={isLoading}
        message={singleMessage} // Change to `loadingMessages` for cycling messages
        opacity={0.9}
        messageDuration={2000}
        smoothTransitions={true}
      />

      {/* Main content - only render when loaded */}
      {componentsLoaded && (
        <div className="new-home">
          <Hero />
          <div className="stats-section">
            <Stats />
          </div>
        </div>
      )}
    </>
  );
};

export default NewHome;