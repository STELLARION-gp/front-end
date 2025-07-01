import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAllGalaxyColors } from '../../utils/galaxyColors';

const ParticleField: React.FC = () => {
  const mesh = useRef<THREE.Points>(null);
  const PARTICLE_COUNT = 1500; // Increased particle count for more density

  // Create circular texture for particles
  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;

    // Create circular gradient with improved glow
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, colors, sizes] = useMemo(() => {
    // Use our consistent galaxy color palette
    const colorPalette = getAllGalaxyColors();

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    // Create spiral galaxy structure
    const armCount = 3; // Number of spiral arms
    const spiralFactor = 0.3; // Controls how tight the spiral is

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Determine if this is a core star or arm star
      const isCoreParticle = Math.random() < 0.2;

      if (isCoreParticle) {
        // Core particles - clustered in center
        const r = Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;

        positions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3; // Flattened in y-axis
        positions[i3 + 2] = r * Math.cos(phi);
      } else {
        // Spiral arm particles
        const armIndex = Math.floor(Math.random() * armCount);
        const armAngle = (armIndex / armCount) * Math.PI * 2;

        // Distance from center (more particles farther out)
        const distance = 5 + Math.pow(Math.random(), 0.5) * 40;

        // Angle based on distance (creates the spiral)
        const angle = armAngle + distance * spiralFactor;

        // Add some randomness to create thickness in the arms
        const deviation = (Math.random() - 0.5) * (distance * 0.05 + 2);
        const heightDeviation = (Math.random() - 0.5) * 5; // Galaxy thickness

        positions[i3 + 0] = Math.cos(angle) * distance + deviation;
        positions[i3 + 1] = heightDeviation;
        positions[i3 + 2] = Math.sin(angle) * distance + deviation;
      }

      // Color selection based on position
      let colorIndex;
      const distFromCenter = Math.sqrt(
        positions[i3] * positions[i3] +
        positions[i3 + 2] * positions[i3 + 2]
      );

      if (distFromCenter < 10) {
        // Core uses brighter colors
        colorIndex = Math.floor(Math.random() * 4); // First 4 colors (bright cyan, pink, etc.)
      } else {
        // Arms use the full palette
        colorIndex = Math.floor(Math.random() * colorPalette.length);
      }

      const color = colorPalette[colorIndex];
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Size based on position and random variation
      const baseSizeByPosition = isCoreParticle ? 1.0 : 0.6;
      sizes[i] = (Math.random() * 0.5 + baseSizeByPosition);
    }

    return [positions, colors, sizes];
  }, []);

  const sizesRef = useRef<Float32Array>(sizes.slice());

  // Animate glowing effect
  useFrame((state) => {
    if (mesh.current) {
      // Slow rotation
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.01;

      const time = state.clock.elapsedTime;

      // Animate size for glowing effect - different frequencies for variation
      const newSizes = sizesRef.current;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Different particles pulse at different rates
        const pulseSpeed = 0.5 + (i % 5) * 0.1;
        const pulseAmount = 0.2 + (i % 3) * 0.1;
        newSizes[i] = sizes[i] * (1 + Math.sin(time * pulseSpeed + i) * pulseAmount);
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
          args={[positions, 3]}
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          args={[colors, 3]}
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          args={[sizesRef.current, 1]}
          attach="attributes-size"
          array={sizesRef.current}
          count={sizesRef.current.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.9}
        vertexColors
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={circleTexture}
        alphaTest={0.001}
      />
    </points>
  );
};

export default ParticleField;
