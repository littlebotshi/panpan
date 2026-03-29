import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PandaModel } from './PandaModel';
import { Environment } from './Environment';

export function Scene() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 1.5, 5],
        fov: 40,
        near: 0.1,
        far: 100,
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffeedd" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Environment */}
      <Environment />

      {/* Panpan */}
      <PandaModel />

      {/* Camera controls - limited for child-friendly interaction */}
      <OrbitControls
        target={[0, 0.5, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
    </Canvas>
  );
}
