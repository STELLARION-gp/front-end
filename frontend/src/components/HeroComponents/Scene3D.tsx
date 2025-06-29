import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ParticleField from './ParticleField';
import LightSpeedStars from './LightSpeedStars';

interface Scene3DProps {
  currentSlide: number;
  isTransitioning: boolean;
}

const Scene3D: React.FC<Scene3DProps> = ({ currentSlide, isTransitioning }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 75 }}
      className="absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {currentSlide === 0 && <ParticleField />}

      {/* Custom light-speed stars effect */}
      <LightSpeedStars isTransitioning={isTransitioning} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={!isTransitioning}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};

export default Scene3D;