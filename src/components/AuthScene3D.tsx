import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import ParticleField from './HeroComponents/ParticleField';
import LightSpeedStars from './HeroComponents/LightSpeedStars';
import Galaxy3D from './HeroComponents/Galaxy3D';

const AuthScene3D: React.FC = () => {
    return (
        <div className="auth-galaxy-background">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 75 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]} // Better performance on high-DPI screens
            >
                <ambientLight intensity={0.8} /> {/* Increased light intensity */}
                <pointLight position={[10, 10, 10]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={0.8} />

                {/* Add stars for additional particle effect */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Add dedicated ParticleField first for more particles */}
                <ParticleField />

                {/* Add the Galaxy */}
                <group scale={[2, 2, 2]} position={[0, 0, -10]}>
                    <Galaxy3D />
                </group>

                {/* Light speed stars for dynamic effect */}
                <LightSpeedStars isTransitioning={false} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.2}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                />
            </Canvas>

            {/* Enhanced overlay with more cosmic effects */}
            <div className="auth-galaxy-overlay"></div>
        </div>
    );
};

export default AuthScene3D;
