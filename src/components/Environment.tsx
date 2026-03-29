import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const groundMat = new THREE.MeshToonMaterial({ color: '#7ec850' });
const bambooMat = new THREE.MeshToonMaterial({ color: '#4a8c3f' });
const bambooSegmentMat = new THREE.MeshToonMaterial({ color: '#3d7535' });
const leafMat = new THREE.MeshToonMaterial({ color: '#5ca84a' });
const cloudMat = new THREE.MeshToonMaterial({ color: '#ffffff', transparent: true, opacity: 0.9 });

export function Environment() {
  return (
    <>
      {/* Sky dome */}
      <Sky />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow material={groundMat}>
        <circleGeometry args={[12, 64]} />
      </mesh>

      {/* Bamboo stalks */}
      <Bamboo position={[-3, -1.2, -2]} height={5} />
      <Bamboo position={[-2.2, -1.2, -3]} height={6} />
      <Bamboo position={[-1.5, -1.2, -2.5]} height={4.5} />
      <Bamboo position={[2.5, -1.2, -2.5]} height={5.5} />
      <Bamboo position={[3.2, -1.2, -2]} height={4} />
      <Bamboo position={[1.8, -1.2, -3.5]} height={6.5} />

      {/* Clouds */}
      <Cloud position={[-4, 4, -3]} scale={1.2} speed={0.15} />
      <Cloud position={[3, 4.5, -4]} scale={0.8} speed={0.1} />
      <Cloud position={[0, 5, -5]} scale={1} speed={0.12} />

      {/* Sparkle particles */}
      <Sparkles
        count={40}
        scale={8}
        size={3}
        speed={0.5}
        color="#ffe4a0"
        position={[0, 2, -1]}
      />

      {/* Small flowers/grass tufts on the ground */}
      <GrassTufts />
    </>
  );
}

function Sky() {
  const skyMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {},
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          vec3 skyBlue = vec3(0.53, 0.81, 0.98);
          vec3 white = vec3(1.0, 1.0, 0.98);
          vec3 color = mix(white, skyBlue, max(h, 0.0));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh material={skyMat}>
      <sphereGeometry args={[30, 32, 32]} />
    </mesh>
  );
}

function Bamboo({ position, height }: { position: [number, number, number]; height: number }) {
  const segments = Math.floor(height / 0.8);

  return (
    <group position={position}>
      {/* Main stalk */}
      <mesh position={[0, height / 2, 0]} material={bambooMat} castShadow>
        <cylinderGeometry args={[0.06, 0.08, height, 8]} />
      </mesh>

      {/* Segment rings */}
      {Array.from({ length: segments }, (_, i) => (
        <mesh key={i} position={[0, i * 0.8 + 0.4, 0]} material={bambooSegmentMat}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 8]} />
        </mesh>
      ))}

      {/* Leaves at top */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        <group position={[0, height, 0]}>
          <mesh rotation={[0.3, 0, 0.5]} material={leafMat}>
            <planeGeometry args={[0.4, 0.15]} />
          </mesh>
          <mesh rotation={[-0.2, 0.5, -0.3]} material={leafMat}>
            <planeGeometry args={[0.35, 0.12]} />
          </mesh>
          <mesh rotation={[0.1, -0.4, 0.2]} material={leafMat}>
            <planeGeometry args={[0.3, 0.13]} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Cloud({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cloudRef.current) return;
    const t = clock.getElapsedTime();
    cloudRef.current.position.x = position[0] + Math.sin(t * speed) * 2;
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      <mesh material={cloudMat}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>
      <mesh position={[0.4, 0.1, 0]} material={cloudMat}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
      <mesh position={[-0.4, 0, 0.1]} material={cloudMat}>
        <sphereGeometry args={[0.35, 16, 16]} />
      </mesh>
      <mesh position={[0.1, 0.2, -0.1]} material={cloudMat}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>
    </group>
  );
}

function GrassTufts() {
  const grassMat = new THREE.MeshToonMaterial({ color: '#5daa3c' });
  const flowerColors = ['#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff'];

  const tufts = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 4;
      positions.push([
        Math.cos(angle) * radius,
        -1.15,
        Math.sin(angle) * radius - 1,
      ]);
    }
    return positions;
  }, []);

  return (
    <>
      {tufts.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh material={grassMat} scale={[0.3, 0.5 + Math.random() * 0.3, 0.3]}>
            <coneGeometry args={[0.1, 0.3, 4]} />
          </mesh>
          {i % 3 === 0 && (
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshToonMaterial color={flowerColors[i % flowerColors.length]} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}
