import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightSpeedStarsProps {
  isTransitioning: boolean;
}

const LightSpeedStars: React.FC<LightSpeedStarsProps> = ({ isTransitioning }) => {
  const starsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array>();
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    const velocities = new Float32Array(2000);
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3;
      
      // Distribute stars in a sphere around the camera
      const radius = Math.random() * 200 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random velocities for each star
      velocities[i] = Math.random() * 2 + 1;
      
      // White/blue-ish colors
      const intensity = Math.random() * 0.5 + 0.5;
      colors[i3] = intensity;
      colors[i3 + 1] = intensity;
      colors[i3 + 2] = intensity * (0.8 + Math.random() * 0.4);
    }
    
    velocitiesRef.current = velocities;
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (starsRef.current && velocitiesRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = velocitiesRef.current;
      
      for (let i = 0; i < positions.length; i += 3) {
        const starIndex = i / 3;
        
        if (isTransitioning) {
          // During transition: move stars towards camera at high speed
          const direction = new THREE.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          ).normalize();
          
          // Move stars towards camera (negative Z direction)
          positions[i] -= direction.x * velocities[starIndex] * 8;
          positions[i + 1] -= direction.y * velocities[starIndex] * 8;
          positions[i + 2] -= direction.z * velocities[starIndex] * 8;
          
          // Reset stars that have passed the camera
          const distance = Math.sqrt(
            positions[i] * positions[i] +
            positions[i + 1] * positions[i + 1] +
            positions[i + 2] * positions[i + 2]
          );
          
          if (distance < 10) {
            // Reset to far position
            const radius = Math.random() * 200 + 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
          }
        } else {
          // Normal state: gentle floating motion
          positions[i + 1] += Math.sin(state.clock.elapsedTime + starIndex) * 0.01;
        }
      }
      
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isTransitioning ? 0.8 : 0.3}
        transparent
        opacity={isTransitioning ? 1.0 : 0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default LightSpeedStars;