import React, { Suspense, useState } from 'react';
import Scene3D from './Scene3D';
import './../../styles/pages/Hero.scss';


const GalaxyHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <div className="hero-canvas">
      <Suspense fallback={null}>
        <Scene3D currentSlide={currentSlide} isTransitioning={isTransitioning} />
      </Suspense>
    </div>
  );
};

export default GalaxyHero;