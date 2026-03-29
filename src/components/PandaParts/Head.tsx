import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { STATE_POSES } from '../../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../../animation/springConfigs';
import { lerp } from '../../animation/disneyUtils';

const blackMat = new THREE.MeshToonMaterial({ color: '#1a1a1a' });
const whiteMat = new THREE.MeshToonMaterial({ color: '#f5f5f0' });
const eyeWhiteMat = new THREE.MeshToonMaterial({ color: '#ffffff' });
const pupilMat = new THREE.MeshToonMaterial({ color: '#111111' });
const highlightMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const noseMat = new THREE.MeshToonMaterial({ color: '#2a2a2a' });
const mouthMat = new THREE.MeshToonMaterial({ color: '#cc4444', side: THREE.DoubleSide });
const patchMat = new THREE.MeshToonMaterial({ color: '#222222' });
const cheekMat = new THREE.MeshToonMaterial({ color: '#ffb5b5', transparent: true, opacity: 0.5 });
const innerEarMat = new THREE.MeshToonMaterial({ color: '#333333' });

export function Head() {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const blinkRef = useRef(0);
  const nextBlinkRef = useRef(3 + Math.random() * 2);

  const animationState = useAppStore((s) => s.animationState);
  const mouthAmplitude = useAppStore((s) => s.mouthAmplitude);
  const pose = STATE_POSES[animationState];

  const spring = useSpring({
    rotation: pose.headRotation,
    eyeScale: pose.eyeScale,
    config: SPRING_CONFIGS.head,
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Blinking
    blinkRef.current += clock.getDelta();
    let blinkScale = 1;
    if (blinkRef.current > nextBlinkRef.current) {
      const blinkPhase = (blinkRef.current - nextBlinkRef.current) * 8;
      if (blinkPhase < 1) {
        blinkScale = 1 - Math.sin(blinkPhase * Math.PI) * 0.9;
      } else {
        blinkRef.current = 0;
        nextBlinkRef.current = 3 + Math.random() * 3;
      }
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const targetEyeScale = pose.eyeScale * blinkScale;
      leftEyeRef.current.scale.y = lerp(leftEyeRef.current.scale.y, targetEyeScale, 0.3);
      rightEyeRef.current.scale.y = lerp(rightEyeRef.current.scale.y, targetEyeScale, 0.3);
    }

    if (mouthRef.current) {
      const targetOpen = animationState === 'talking' ? mouthAmplitude * 0.15 : pose.mouthOpen * 0.1;
      const currentScale = mouthRef.current.scale.y;
      mouthRef.current.scale.y = lerp(currentScale, 0.03 + targetOpen, 0.4);
    }

    if (headRef.current && animationState === 'talking') {
      headRef.current.rotation.x = pose.headRotation[0] + Math.sin(t * 3) * 0.05;
      headRef.current.rotation.z = pose.headRotation[2] + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <animated.group
      ref={headRef}
      position={[0, 1.35, 0]}
      rotation={spring.rotation as any}
    >
      {/* Head sphere */}
      <mesh material={blackMat}>
        <sphereGeometry args={[0.75, 32, 32]} />
      </mesh>

      {/* White face patch — flattened so features sit on top */}
      <mesh position={[0, -0.08, 0.55]} scale={[1, 1, 0.4]} material={whiteMat}>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>

      {/* Left eye patch — teardrop shape, tilted inward */}
      <mesh position={[-0.22, 0.06, 0.64]} rotation={[0, 0.15, 0.4]} scale={[1.1, 1.4, 0.3]} material={patchMat}>
        <sphereGeometry args={[0.17, 16, 16]} />
      </mesh>

      {/* Right eye patch */}
      <mesh position={[0.22, 0.06, 0.64]} rotation={[0, -0.15, -0.4]} scale={[1.1, 1.4, 0.3]} material={patchMat}>
        <sphereGeometry args={[0.17, 16, 16]} />
      </mesh>

      {/* Left eye — BIG for cuteness */}
      <group ref={leftEyeRef} position={[-0.2, 0.08, 0.73]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>
        {/* Pupil — large, slightly inward for cute look */}
        <mesh position={[0.02, 0, 0.08]} material={pupilMat}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        {/* Big sparkle highlight — Disney magic */}
        <mesh position={[0.05, 0.05, 0.12]} material={highlightMat}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
        {/* Small secondary sparkle */}
        <mesh position={[0.0, 0.02, 0.13]} material={highlightMat}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>
      </group>

      {/* Right eye */}
      <group ref={rightEyeRef} position={[0.2, 0.08, 0.73]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>
        <mesh position={[-0.02, 0, 0.08]} material={pupilMat}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <mesh position={[-0.02, 0.05, 0.12]} material={highlightMat}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.13]} material={highlightMat}>
          <sphereGeometry args={[0.018, 8, 8]} />
        </mesh>
      </group>

      {/* Nose — cute oval */}
      <mesh position={[0, -0.06, 0.78]} scale={[1.3, 0.9, 0.8]} material={noseMat}>
        <sphereGeometry args={[0.055, 12, 12]} />
      </mesh>

      {/* Mouth — wider smile */}
      <mesh ref={mouthRef} position={[0, -0.16, 0.74]} scale={[0.2, 0.03, 0.08]} material={mouthMat}>
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>

      {/* Blush cheeks — pink circles */}
      <mesh position={[-0.35, -0.08, 0.6]} material={cheekMat}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>
      <mesh position={[0.35, -0.08, 0.6]} material={cheekMat}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>

      {/* Left ear */}
      <Ear position={[-0.48, 0.55, -0.05]} />
      {/* Right ear */}
      <Ear position={[0.48, 0.55, -0.05]} />
    </animated.group>
  );
}

function Ear({ position }: { position: [number, number, number] }) {
  const earRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!earRef.current) return;
    const t = clock.getElapsedTime();
    earRef.current.rotation.z = Math.sin(t * 1.2 + position[0] * 2) * 0.08;
    earRef.current.rotation.x = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <group ref={earRef} position={position}>
      <mesh material={blackMat}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>
      <mesh position={[0, 0, 0.05]} material={innerEarMat} scale={[0.6, 0.6, 0.5]}>
        <sphereGeometry args={[0.22, 12, 12]} />
      </mesh>
    </group>
  );
}
