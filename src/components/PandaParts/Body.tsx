import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { STATE_POSES } from '../../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../../animation/springConfigs';

// Po-style: pure white belly is the star, black body is the frame
const blackFur = new THREE.MeshToonMaterial({ color: '#0a0a0a' });
const whiteFur = new THREE.MeshToonMaterial({ color: '#ffffff' });

export function Body() {
  const bodyRef = useRef<THREE.Group>(null);
  const animationState = useAppStore((s) => s.animationState);
  const pose = STATE_POSES[animationState];

  const spring = useSpring({
    position: pose.bodyPosition,
    scale: pose.bodyScale,
    rotation: pose.bodyRotation,
    config: SPRING_CONFIGS.body,
  });

  useFrame(({ clock }) => {
    if (!bodyRef.current) return;
    const t = clock.getElapsedTime();

    const breathe = Math.sin(t * 2) * 0.015;
    bodyRef.current.scale.y = (pose.bodyScale[1] || 1) + breathe;

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
      {/* Main body — chubbier, rounder like Po */}
      <mesh material={blackFur} scale={[1, 1.05, 0.95]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Big round white belly — prominent like Po's */}
      <mesh position={[0, -0.1, 0.35]} material={whiteFur}>
        <sphereGeometry args={[0.72, 32, 32]} />
      </mesh>
    </animated.group>
  );
}
