import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const AccretionDisk: React.FC = () => {
    const diskRef = useRef<THREE.Group>(null);
    const outerGlowRef = useRef<THREE.Group>(null);

    // Create the accretion disk material with realistic colors
    const diskMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorInner: { value: new THREE.Color(0xffffff) },
                colorMiddle: { value: new THREE.Color(0xff4000) },
                colorOuter: { value: new THREE.Color(0xff1020) },
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float radius = length(pos.xy);
                    float angle = atan(pos.y, pos.x);
                    
                    // Rotate based on distance from center
                    float rotationSpeed = 1.0 / (radius * 0.5 + 0.1);
                    angle += time * rotationSpeed * 0.5;
                    
                    pos.x = cos(angle) * radius;
                    pos.y = sin(angle) * radius;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform vec3 colorInner;
                uniform vec3 colorMiddle;
                uniform vec3 colorOuter;
                
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUv, center) * 2.0;
                    
                    // Create color gradient from center to edge
                    vec3 color;
                    if (dist < 0.3) {
                        color = mix(colorInner, colorMiddle, dist / 0.3);
                    } else if (dist < 0.7) {
                        color = mix(colorMiddle, colorOuter, (dist - 0.3) / 0.4);
                    } else {
                        color = colorOuter;
                    }
                    
                    // Add turbulence and noise
                    float noise = sin(dist * 50.0 + time * 5.0) * 0.1;
                    noise += sin(dist * 30.0 - time * 3.0) * 0.05;
                    
                    // Create spiral pattern
                    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                    float spiral = sin(angle * 3.0 + dist * 20.0 - time * 2.0) * 0.3;
                    
                    // Combine effects
                    float intensity = 1.0 + noise + spiral;
                    intensity *= (1.0 - smoothstep(0.0, 1.0, dist)); // Fade to edges
                    
                    // Add opacity falloff
                    float alpha = 1.0 - smoothstep(0.4, 1.0, dist);
                    alpha *= 0.8; // Overall transparency
                    
                    gl_FragColor = vec4(color * intensity, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, []);

    // Outer glow material
    const glowMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                glowColor: { value: new THREE.Color(0xff4400) },
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Gentle pulsing
                    float pulse = sin(time * 2.0) * 0.1 + 1.0;
                    pos *= pulse;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 vUv;
                uniform float time;
                uniform vec3 glowColor;
                
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUv, center) * 2.0;
                    
                    // Create outer glow effect
                    float glow = 1.0 - smoothstep(0.3, 1.2, dist);
                    glow = pow(glow, 2.0);
                    
                    // Add pulsing
                    float pulse = sin(time * 3.0) * 0.3 + 0.7;
                    glow *= pulse;
                    
                    float alpha = glow * 0.3;
                    
                    gl_FragColor = vec4(glowColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Update shader uniforms
        diskMaterial.uniforms.time.value = time;
        glowMaterial.uniforms.time.value = time;

        // Rotate the disk
        if (diskRef.current) {
            diskRef.current.rotation.z = time * 0.5;
        }

        // Pulse the outer glow
        if (outerGlowRef.current) {
            const pulse = Math.sin(time * 2) * 0.1 + 1.0;
            outerGlowRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <>
            {/* Main accretion disk */}
            <group ref={diskRef}>
                <Ring
                    args={[0.8, 4.5, 64, 1]}
                    material={diskMaterial}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </group>
        </>
    );
};

const BlackHoleCore: React.FC = () => {
    const sphereRef = useRef<THREE.Mesh>(null);

    // Event horizon material (pure black with subtle distortion)
    const eventHorizonMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    
                    // Subtle gravitational lensing effect
                    float distortion = sin(time * 2.0 + length(pos) * 10.0) * 0.02;
                    pos += normal * distortion;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    // Almost pure black with very subtle edge highlighting
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
                    
                    vec3 color = vec3(0.0, 0.0, 0.0);
                    color += fresnel * vec3(0.1, 0.05, 0.2) * 0.3; // Subtle purple edge
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        eventHorizonMaterial.uniforms.time.value = time;

        // Very subtle rotation
        if (sphereRef.current) {
            sphereRef.current.rotation.y = time * 0.1;
        }
    });

    return (
        <Sphere
            ref={sphereRef}
            args={[0.7, 64, 64]}
            material={eventHorizonMaterial}
        />
    );
};

const ParticleField: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);

    const particlesGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const count = 5000; // Significantly more particles
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Create particles in a sphere around the black hole
            const radius = 4 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Brighter colors for better visibility
            const normalizedRadius = (radius - 4) / 6;
            colors[i3] = 1.0; // Red
            colors[i3 + 1] = 0.5 - normalizedRadius * 0.3; // Green
            colors[i3 + 2] = 0.5; // More blue for better visibility

            sizes[i] = Math.random() * 3 + 1.0; // Larger particles
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        return geometry;
    }, []);

    const particlesMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    
                    // Orbital motion around black hole
                    float radius = length(pos);
                    float angle = atan(pos.z, pos.x);
                    angle += time * (1.0 / radius) * 2.0; // Faster orbit closer to center
                    
                    pos.x = cos(angle) * radius;
                    pos.z = sin(angle) * radius;
                    
                    // Add some randomness
                    pos += sin(time + radius) * 0.1;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha * 0.8); // Higher alpha for visibility
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        particlesMaterial.uniforms.time.value = time;
    });

    return (
        <points
            ref={particlesRef}
            geometry={particlesGeometry}
            material={particlesMaterial}
        />
    );
};

const BlackHole: React.FC = () => {
    // Debug log to confirm component mounting
    useEffect(() => {
        console.log('BlackHole component mounted');
        // Set body to full height for mobile browsers
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';

        return () => {
            console.log('BlackHole component unmounted');
            // Restore original values
            document.documentElement.style.height = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="blackhole-container">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                }}
                dpr={[1, 2]} // Optimized pixel ratio
                performance={{ min: 0.5 }} // Performance optimization
                gl={{ antialias: true, alpha: true }} // Better rendering quality
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.7} />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#5050ff" />

                {/* Black hole components */}
                <BlackHoleCore />
                <AccretionDisk />
                <ParticleField />

                {/* Controls for interaction */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI}
                    minPolarAngle={0}
                />
            </Canvas>
        </div>
    );
};

export default BlackHole;
