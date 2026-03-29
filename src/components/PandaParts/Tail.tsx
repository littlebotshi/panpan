import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';

const tailMat = new THREE.MeshToonMaterial({ color: '#ffffff' });

export function Tail() {
  const tailRef = useRef<THREE.Mesh>(null);
  const animationState = useAppStore((s) => s.animationState);

  useFrame(({ clock }) => {
    if (!tailRef.current) return;
    const t = clock.getElapsedTime();

    // Tail wagging — speed depends on emotion
    let speed = 1.5;
    let amplitude = 0.15;

    if (animationState === 'happy' || animationState === 'celebrating') {
      speed = 6;
      amplitude = 0.4;
    } else if (animationState === 'talking') {
      speed = 2.5;
      amplitude = 0.2;
    } else if (animationState === 'dancing') {
      speed = 4;
      amplitude = 0.5;
    } else if (animationState === 'listening') {
      speed = 3;
      amplitude = 0.1;
    }

    tailRef.current.rotation.x = Math.sin(t * speed) * amplitude;
    tailRef.current.rotation.z = Math.cos(t * speed * 0.7) * amplitude * 0.5;
  });

  return (
    <mesh ref={tailRef} position={[0, -0.3, -0.85]} material={tailMat}>
      <sphereGeometry args={[0.12, 12, 12]} />
    </mesh>
  );
}
