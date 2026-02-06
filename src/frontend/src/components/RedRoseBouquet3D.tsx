import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface RoseProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

function Rose({ position, rotation = [0, 0, 0] }: RoseProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle idle animation: gentle bob and rotation
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.05;
      groupRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Rose bud - deep red */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#8B0000" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Petals - layered spheres for rose effect */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.12,
            0.45,
            Math.sin((i * Math.PI * 2) / 5) * 0.12
          ]}
          rotation={[0, (i * Math.PI * 2) / 5, Math.PI / 6]}
        >
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#DC143C" roughness={0.3} metalness={0.05} />
        </mesh>
      ))}
      
      {/* Outer petals */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={`outer-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 0.18,
            0.4,
            Math.sin((i * Math.PI * 2) / 8) * 0.18
          ]}
          rotation={[0, (i * Math.PI * 2) / 8, Math.PI / 4]}
        >
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#FF0000" roughness={0.4} metalness={0.05} />
        </mesh>
      ))}
      
      {/* Stem - green */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 1.4, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.6} />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[0.08, -0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.5} />
      </mesh>
      <mesh position={[-0.08, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.5} />
      </mesh>
    </group>
  );
}

function BouquetScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of entire bouquet
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  // Create a bouquet arrangement of roses
  const roses: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = [
    // Center roses
    { position: [0, 0, 0], rotation: [0, 0, 0] },
    { position: [0.3, 0.1, 0.2], rotation: [0, Math.PI / 4, 0] },
    { position: [-0.3, 0.1, 0.2], rotation: [0, -Math.PI / 4, 0] },
    // Back roses
    { position: [0.15, -0.1, -0.2], rotation: [0, Math.PI / 6, 0] },
    { position: [-0.15, -0.1, -0.2], rotation: [0, -Math.PI / 6, 0] },
    // Front roses
    { position: [0.4, 0.2, 0.4], rotation: [0, Math.PI / 3, 0] },
    { position: [-0.4, 0.2, 0.4], rotation: [0, -Math.PI / 3, 0] },
  ];

  return (
    <group ref={groupRef}>
      {roses.map((rose, index) => (
        <Rose key={index} position={rose.position} rotation={rose.rotation} />
      ))}
      
      {/* Bouquet wrapper - ribbon/paper */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.5, 0.6, 8, 1, true]} />
        <meshStandardMaterial color="#FFB6C1" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      
      {/* Ribbon accent */}
      <mesh position={[0, -0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.03, 8, 16]} />
        <meshStandardMaterial color="#FF69B4" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

interface RedRoseBouquet3DProps {
  className?: string;
}

export default function RedRoseBouquet3D({ className = '' }: RedRoseBouquet3DProps) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  // Fallback to static image if WebGL is not supported or error occurs
  if (!hasWebGL || error) {
    return (
      <img
        src="/assets/generated/cartoon-red-flower-bouquet.dim_512x512.png"
        alt="Red Rose Bouquet"
        className={`pulse-heart ${className}`}
      />
    );
  }

  return (
    <div className={className} style={{ width: '224px', height: '224px' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#00000000', 0);
        }}
        onError={() => setError(true)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#FFB6C1" />
        
        <BouquetScene />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
