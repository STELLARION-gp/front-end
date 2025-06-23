import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField: React.FC = () => {
  const mesh = useRef<THREE.Points>(null);

  const colorPalette = [
    new THREE.Color('#8B5CF6'), // Purple
    new THREE.Color('#3B82F6'), // Blue
    new THREE.Color('#06B6D4'), // Cyan
    new THREE.Color('#FFFFFF'), // White
    new THREE.Color('#F59E0B'), // Amber
    new THREE.Color('#EC4899'), // Pink
  ];

  const PARTICLE_COUNT = 1000;

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Position
      positions[i3 + 0] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random initial size
      sizes[i] = Math.random() * 0.5 + 0.5;
    }

    return [positions, colors, sizes];
  }, []);

  const sizesRef = useRef<Float32Array>(sizes.slice());

  // Animate glowing effect
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;

      const time = state.clock.elapsedTime;

      // Animate size for glowing effect
      const newSizes = sizesRef.current;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        newSizes[i] = 0.5 + Math.sin(time * 2 + i) * 0.3;
      }

      const sizeAttribute = mesh.current.geometry.getAttribute('size') as THREE.BufferAttribute;
      sizeAttribute.array = newSizes;
      sizeAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
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
        <bufferAttribute
          attach="attributes-size"
          array={sizesRef.current}
          count={sizesRef.current.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
