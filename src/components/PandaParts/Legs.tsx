import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';

const legMat = new THREE.MeshToonMaterial({ color: '#0a0a0a' });
const padMat = new THREE.MeshToonMaterial({ color: '#f0e0d0' });

export function Legs() {
  return (
    <>
      <Leg position={[-0.4, -0.9, 0.1]} side="left" />
      <Leg position={[0.4, -0.9, 0.1]} side="right" />
    </>
  );
}

function Leg({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const legRef = useRef<THREE.Group>(null);
  const animationState = useAppStore((s) => s.animationState);

  useFrame(({ clock }) => {
    if (!legRef.current) return;
    const t = clock.getElapsedTime();

    if (animationState === 'dancing') {
      const offset = side === 'left' ? 0 : Math.PI;
      legRef.current.rotation.x = Math.sin(t * 4 + offset) * 0.2;
      legRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4 + offset)) * 0.1;
    } else if (animationState === 'happy' || animationState === 'celebrating') {
      legRef.current.rotation.x = Math.sin(t * 6) * 0.1;
    } else {
      legRef.current.rotation.x = 0;
      legRef.current.position.y = position[1];
    }
  });

  return (
    <group ref={legRef} position={position}>
      {/* Stubby chubby leg */}
      <mesh material={legMat}>
        <capsuleGeometry args={[0.22, 0.3, 8, 16]} />
      </mesh>

      {/* Round foot */}
      <mesh position={[0, -0.28, 0.1]} scale={[1.1, 0.7, 1.3]} material={legMat}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>

      {/* Foot pad — pink */}
      <mesh position={[0, -0.3, 0.2]} material={padMat}>
        <sphereGeometry args={[0.11, 8, 8]} />
      </mesh>
    </group>
  );
}
