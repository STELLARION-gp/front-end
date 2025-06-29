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
      style={{
        pointerEvents: 'auto',
        zIndex: 1
      }}
      onPointerMissed={(event) => {
        // Allow events to bubble up when not interacting with 3D objects
        event.stopPropagation = () => { }; // Prevent blocking of parent events
      }}
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
        enableRotate={true} // Enable rotation for interactivity
        autoRotate={!isTransitioning}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={1.0} // Increase responsiveness
        mouseButtons={{
          LEFT: 0, // Enable left mouse button for rotation
          MIDDLE: 1,
          RIGHT: 2
        }}
        touches={{
          ONE: 0, // Enable single touch for rotation on mobile
          TWO: 2
        }}
      />
    </Canvas>
  );
};

export default Scene3D;