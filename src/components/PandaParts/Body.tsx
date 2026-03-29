import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { STATE_POSES } from '../../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../../animation/springConfigs';

const toonMaterial = new THREE.MeshToonMaterial({ color: '#1a1a1a' });
const bellyMaterial = new THREE.MeshToonMaterial({ color: '#f5f5f0' });

export function Body() {
  const bodyRef = useRef<THREE.Group>(null);
  const animationState = useAppStore((s) => s.animationState);
  const pose = STATE_POSES[animationState];

  // Spring-driven position and scale
  const spring = useSpring({
    position: pose.bodyPosition,
    scale: pose.bodyScale,
    rotation: pose.bodyRotation,
    config: SPRING_CONFIGS.body,
  });

  // Procedural breathing animation
  useFrame(({ clock }) => {
    if (!bodyRef.current) return;
    const t = clock.getElapsedTime();

    // Idle breathing: gentle Y scale oscillation
    const breathe = Math.sin(t * 2) * 0.015;
    bodyRef.current.scale.y = (pose.bodyScale[1] || 1) + breathe;

    // Subtle weight shift
    const sway = Math.sin(t * 0.8) * 0.02;
    bodyRef.current.position.x = (pose.bodyPosition[0] || 0) + sway;
  });

  return (
    <animated.group
      ref={bodyRef}
      position={spring.position as any}
      scale={spring.scale as any}
      rotation={spring.rotation as any}
    >
      {/* Main body (torso) */}
      <mesh material={toonMaterial}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Belly patch */}
      <mesh position={[0, -0.05, 0.4]} material={bellyMaterial}>
        <sphereGeometry args={[0.65, 32, 32]} />
      </mesh>
    </animated.group>
  );
}
