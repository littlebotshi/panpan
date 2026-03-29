import { useRef } from 'react';
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
const noseMat = new THREE.MeshToonMaterial({ color: '#333333' });
const mouthMat = new THREE.MeshToonMaterial({ color: '#cc4444', side: THREE.DoubleSide });
const patchMat = new THREE.MeshToonMaterial({ color: '#1a1a1a' });

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

  // Procedural blink & mouth animation
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

    // Mouth opens/closes based on audio amplitude during talking
    if (mouthRef.current) {
      const targetOpen = animationState === 'talking' ? mouthAmplitude * 0.12 : pose.mouthOpen * 0.08;
      const currentScale = mouthRef.current.scale.y;
      mouthRef.current.scale.y = lerp(currentScale, 0.02 + targetOpen, 0.4);
    }

    // Head nodding during talking
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

      {/* White face patch */}
      <mesh position={[0, -0.05, 0.32]} material={whiteMat}>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>

      {/* Left eye patch (dark circle) */}
      <mesh position={[-0.22, 0.08, 0.45]} rotation={[0, 0, 0.3]} scale={[1, 1.2, 0.5]} material={patchMat}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>

      {/* Right eye patch (dark circle) */}
      <mesh position={[0.22, 0.08, 0.45]} rotation={[0, 0, -0.3]} scale={[1, 1.2, 0.5]} material={patchMat}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>

      {/* Left eye */}
      <group ref={leftEyeRef} position={[-0.2, 0.1, 0.55]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
        <mesh position={[0.02, 0, 0.05]} material={pupilMat}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
        <mesh position={[0.04, 0.03, 0.08]} material={highlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>

      {/* Right eye */}
      <group ref={rightEyeRef} position={[0.2, 0.1, 0.55]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
        <mesh position={[-0.02, 0, 0.05]} material={pupilMat}>
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
        <mesh position={[0.0, 0.03, 0.08]} material={highlightMat}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      </group>

      {/* Nose */}
      <mesh position={[0, -0.05, 0.68]} material={noseMat}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.15, 0.63]} scale={[0.15, 0.02, 0.08]} material={mouthMat}>
        <sphereGeometry args={[1, 16, 8]} />
      </mesh>

      {/* Left ear */}
      <Ear position={[-0.45, 0.55, 0]} />

      {/* Right ear */}
      <Ear position={[0.45, 0.55, 0]} />
    </animated.group>
  );
}

function Ear({ position }: { position: [number, number, number] }) {
  const earRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!earRef.current) return;
    const t = clock.getElapsedTime();
    // Ears have secondary motion: slight delayed flop
    earRef.current.rotation.z = Math.sin(t * 1.2 + position[0] * 2) * 0.08;
    earRef.current.rotation.x = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <mesh ref={earRef} position={position} material={blackMat}>
      <sphereGeometry args={[0.2, 16, 16]} />
    </mesh>
  );
}
