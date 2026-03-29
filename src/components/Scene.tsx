import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PandaModel } from './PandaModel';
import { Environment } from './Environment';

export function Scene() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    <Canvas
      shadows
      camera={{
        position: [0, 1.5, 8],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      gl={{ alpha: false }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.8} color="#ffeedd" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Fill light from front to illuminate face */}
      <directionalLight position={[0, 3, 8]} intensity={0.5} color="#ffffff" />
      {/* Rim light from behind for depth */}
      <directionalLight position={[-3, 4, -5]} intensity={0.3} color="#aad4ff" />

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
    </div>
  );
}
