import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Galaxy3D: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Generate galaxy points
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);

    const colorPalette = [
      new THREE.Color('#8B5CF6'), // Purple
      new THREE.Color('#3B82F6'), // Blue
      new THREE.Color('#06B6D4'), // Cyan
      new THREE.Color('#FFFFFF'), // White
      new THREE.Color('#F59E0B'), // Amber
      new THREE.Color('#EC4899'), // Pink
    ];

    for (let i = 0; i < 5000; i++) {
      const i3 = i * 3;

      // Create spiral galaxy shape
      const radius = Math.random() * 25;
      const spinAngle = radius * 0.3;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.5;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color based on distance from center
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      const mixedColor = color.clone();
      mixedColor.lerp(new THREE.Color('#FFFFFF'), Math.random() * 0.3);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return [positions, colors];
  }, []);

  // Animation loop
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x = mouse.y * 0.05;
      ref.current.rotation.z = mouse.x * 0.05;
    }
  });

  return (
    <Points ref={ref} frustumCulled={false}>
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
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default Galaxy3D;