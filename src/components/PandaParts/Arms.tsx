import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { STATE_POSES } from '../../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../../animation/springConfigs';

const armMat = new THREE.MeshToonMaterial({ color: '#0a0a0a' });
const pawMat = new THREE.MeshToonMaterial({ color: '#f0e0d0' });

export function Arms() {
  const animationState = useAppStore((s) => s.animationState);
  const pose = STATE_POSES[animationState];

  return (
    <>
      <Arm
        side="left"
        basePosition={[-0.85, 0.2, 0]}
        targetRotation={pose.leftArmRotation}
      />
      <Arm
        side="right"
        basePosition={[0.85, 0.2, 0]}
        targetRotation={pose.rightArmRotation}
      />
    </>
  );
}

function Arm({
  side,
  basePosition,
  targetRotation,
}: {
  side: 'left' | 'right';
  basePosition: [number, number, number];
  targetRotation: [number, number, number];
}) {
  const armRef = useRef<THREE.Group>(null);
  const animationState = useAppStore((s) => s.animationState);

  const spring = useSpring({
    rotation: targetRotation,
    config: SPRING_CONFIGS.arms,
  });

  // Waving animation for right arm
  useFrame(({ clock }) => {
    if (!armRef.current) return;
    const t = clock.getElapsedTime();

    if (animationState === 'waving' && side === 'right') {
      // Waving oscillation
      armRef.current.rotation.z = targetRotation[2] + Math.sin(t * 6) * 0.4;
    }

    if (animationState === 'talking') {
      // Gentle gesture during speech
      const gesture = Math.sin(t * 2 + (side === 'left' ? 0 : Math.PI)) * 0.15;
      armRef.current.rotation.x = targetRotation[0] + gesture;
    }

    if (animationState === 'dancing') {
      const offset = side === 'left' ? 0 : Math.PI;
      armRef.current.rotation.z = targetRotation[2] + Math.sin(t * 4 + offset) * 0.5;
      armRef.current.rotation.x = targetRotation[0] + Math.sin(t * 2 + offset) * 0.3;
    }
  });

  return (
    <animated.group
      ref={armRef}
      position={basePosition}
      rotation={spring.rotation as any}
    >
      {/* Chubby arm */}
      <mesh material={armMat}>
        <capsuleGeometry args={[0.18, 0.45, 8, 16]} />
      </mesh>

      {/* Round paw */}
      <mesh position={[0, -0.38, 0]} material={armMat}>
        <sphereGeometry args={[0.19, 16, 16]} />
      </mesh>

      {/* Paw pad — pink */}
      <mesh position={[0, -0.38, 0.12]} material={pawMat}>
        <sphereGeometry args={[0.09, 8, 8]} />
      </mesh>
    </animated.group>
  );
}
