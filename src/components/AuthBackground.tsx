import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// Import Galaxy3D with the correct path
import Galaxy3D from '../components/HeroComponents/Galaxy3D';

const AuthBackground: React.FC = () => {
    return (
        <div className="auth-galaxy-background">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1 // Below content but above base background
                }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />

                {/* Scale up the Galaxy3D component and position it properly */}
                <group scale={[1.5, 1.5, 1.5]} position={[0, 0, 0]}>
                    <Galaxy3D />
                </group>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.1} // Slower rotation
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.5} // Reduced rotation speed
                />
            </Canvas>

            {/* Additional dark overlay with stars effect */}
            <div className="auth-galaxy-overlay"></div>
        </div>
    );
};

export default AuthBackground;
