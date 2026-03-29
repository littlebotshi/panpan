import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { Body } from './PandaParts/Body';
import { Head } from './PandaParts/Head';
import { Arms } from './PandaParts/Arms';
import { Legs } from './PandaParts/Legs';
import { Tail } from './PandaParts/Tail';
import { useAppStore } from '../stores/appStore';
import { STATE_POSES } from '../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../animation/springConfigs';

export function PandaModel() {
  const groupRef = useRef<THREE.Group>(null);
  const animationState = useAppStore((s) => s.animationState);
  const pose = STATE_POSES[animationState];

  // Main body spring for position (jumping, bouncing)
  const spring = useSpring({
    position: pose.bodyPosition,
    config: SPRING_CONFIGS.bounce,
  });

  // Global procedural animations
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (animationState === 'happy') {
      // Bounce up and down with squash/stretch
      const bounce = Math.abs(Math.sin(t * 5)) * 0.2;
      groupRef.current.position.y = pose.bodyPosition[1] + bounce;
      // Squash at bottom, stretch at top
      const squash = Math.sin(t * 5);
      groupRef.current.scale.y = 1 + squash * 0.05;
      groupRef.current.scale.x = 1 - squash * 0.03;
      groupRef.current.scale.z = 1 - squash * 0.03;
    } else if (animationState === 'celebrating') {
      // Big jump + spin
      const jump = Math.abs(Math.sin(t * 3)) * 0.4;
      groupRef.current.position.y = pose.bodyPosition[1] + jump;
      groupRef.current.rotation.y = t * 2;
      // Stretch during jump
      const stretch = Math.sin(t * 3);
      groupRef.current.scale.y = 1 + stretch * 0.1;
      groupRef.current.scale.x = 1 - stretch * 0.05;
    } else if (animationState === 'dancing') {
      // Rhythmic bounce + hip sway
      const bounce = Math.abs(Math.sin(t * 4)) * 0.15;
      groupRef.current.position.y = bounce;
      groupRef.current.rotation.y = Math.sin(t * 2) * 0.15;
      groupRef.current.rotation.z = Math.sin(t * 4) * 0.05;
    } else if (animationState === 'talking') {
      // Subtle bounce synced to speech rhythm
      const bounce = Math.sin(t * 3) * 0.03;
      groupRef.current.position.y = bounce;
    } else {
      // Return to neutral
      groupRef.current.position.y = pose.bodyPosition[1];
      groupRef.current.rotation.y = 0;
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <animated.group ref={groupRef} position={spring.position as any}>
      <Body />
      <Head />
      <Arms />
      <Legs />
      <Tail />
    </animated.group>
  );
}
