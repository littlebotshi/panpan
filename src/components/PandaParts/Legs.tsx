import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';

const legMat = new THREE.MeshToonMaterial({ color: '#1a1a1a' });
const padMat = new THREE.MeshToonMaterial({ color: '#e8d5c4' });

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
      {/* Leg */}
      <mesh material={legMat}>
        <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
      </mesh>

      {/* Foot */}
      <mesh position={[0, -0.3, 0.08]} scale={[1, 0.7, 1.2]} material={legMat}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>

      {/* Foot pad */}
      <mesh position={[0, -0.32, 0.18]} material={padMat}>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
    </group>
  );
}
