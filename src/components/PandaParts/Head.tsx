import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { STATE_POSES } from '../../animation/bodyAnimations';
import { SPRING_CONFIGS } from '../../animation/springConfigs';
import { lerp } from '../../animation/disneyUtils';

// Proper panda colors: pure black and pure white
const blackFur = new THREE.MeshToonMaterial({ color: '#0a0a0a' });
const whiteFur = new THREE.MeshToonMaterial({ color: '#ffffff' });
const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const pupilMat = new THREE.MeshBasicMaterial({ color: '#0a0a0a' });
const highlightMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const noseMat = new THREE.MeshToonMaterial({ color: '#0a0a0a' });
const mouthMat = new THREE.MeshToonMaterial({ color: '#cc3333', side: THREE.DoubleSide });
const cheekMat = new THREE.MeshToonMaterial({ color: '#ff9999', transparent: true, opacity: 0.45 });
const innerEarMat = new THREE.MeshToonMaterial({ color: '#444444' });

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
      mouthRef.current.scale.y = lerp(currentScale, 0.04 + targetOpen, 0.4);
    }

    if (headRef.current && animationState === 'talking') {
      headRef.current.rotation.x = pose.headRotation[0] + Math.sin(t * 3) * 0.05;
      headRef.current.rotation.z = pose.headRotation[2] + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <animated.group
      ref={headRef}
      position={[0, 1.45, 0]}
      rotation={spring.rotation as any}
    >
      {/* Head — bigger and rounder like Po, slightly wider */}
      <mesh material={whiteFur} scale={[1.05, 1, 1]}>
        <sphereGeometry args={[0.82, 32, 32]} />
      </mesh>

      {/* Black top of head — cap that wraps around */}
      <mesh position={[0, 0.2, -0.1]} material={blackFur} scale={[1.08, 0.85, 1.05]}>
        <sphereGeometry args={[0.72, 32, 32]} />
      </mesh>

      {/* Left eye patch — iconic panda teardrop, pure black */}
      <mesh position={[-0.25, 0.02, 0.6]} rotation={[0, 0.1, 0.45]} scale={[1.15, 1.5, 0.35]} material={blackFur}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>

      {/* Right eye patch */}
      <mesh position={[0.25, 0.02, 0.6]} rotation={[0, -0.1, -0.45]} scale={[1.15, 1.5, 0.35]} material={blackFur}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>

      {/* Left eye — BIG, round, expressive like Po */}
      <group ref={leftEyeRef} position={[-0.23, 0.04, 0.72]}>
        {/* Eye white */}
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.15, 20, 20]} />
        </mesh>
        {/* Large pupil with slight inward gaze */}
        <mesh position={[0.02, 0, 0.09]} material={pupilMat}>
          <sphereGeometry args={[0.1, 20, 20]} />
        </mesh>
        {/* Big sparkle — top right of pupil */}
        <mesh position={[0.06, 0.06, 0.13]} material={highlightMat}>
          <sphereGeometry args={[0.04, 10, 10]} />
        </mesh>
        {/* Small sparkle */}
        <mesh position={[0.0, 0.02, 0.14]} material={highlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>

      {/* Right eye */}
      <group ref={rightEyeRef} position={[0.23, 0.04, 0.72]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.15, 20, 20]} />
        </mesh>
        <mesh position={[-0.02, 0, 0.09]} material={pupilMat}>
          <sphereGeometry args={[0.1, 20, 20]} />
        </mesh>
        <mesh position={[-0.03, 0.06, 0.13]} material={highlightMat}>
          <sphereGeometry args={[0.04, 10, 10]} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.14]} material={highlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>

      {/* Nose — round black button nose */}
      <mesh position={[0, -0.12, 0.78]} material={noseMat} scale={[1.3, 1, 0.9]}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>

      {/* Mouth — friendly smile */}
      <mesh ref={mouthRef} position={[0, -0.22, 0.72]} scale={[0.2, 0.04, 0.08]} material={mouthMat}>
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>

      {/* Rosy blush cheeks — cute! */}
      <mesh position={[-0.38, -0.12, 0.55]} material={cheekMat}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>
      <mesh position={[0.38, -0.12, 0.55]} material={cheekMat}>
        <sphereGeometry args={[0.1, 12, 12]} />
      </mesh>

      {/* Left ear — round, black */}
      <Ear position={[-0.52, 0.6, -0.1]} />
      {/* Right ear */}
      <Ear position={[0.52, 0.6, -0.1]} />
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
      <mesh material={blackFur}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>
      <mesh position={[0, 0, 0.06]} material={innerEarMat} scale={[0.55, 0.55, 0.4]}>
        <sphereGeometry args={[0.22, 12, 12]} />
      </mesh>
    </group>
  );
}
