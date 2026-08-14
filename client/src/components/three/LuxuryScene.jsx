import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { COLORS } from '@/constants/theme';

/**
 * Abstract luxury geometry: two interlocking rings referencing
 * Arabian geometric ornamentation, finished in gold/emerald.
 * Kept deliberately abstract — not a literal "fashion object" placeholder.
 */
function OrnamentRings() {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.6, 0.045, 32, 128]} />
          <meshStandardMaterial color={COLORS.gold} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 1.6, 0.4, 0]}>
          <torusGeometry args={[1.15, 0.03, 32, 128]} />
          <meshStandardMaterial color={COLORS.emerald} metalness={0.5} roughness={0.4} />
        </mesh>
      </Float>
      <Sparkles count={40} scale={4} size={2} speed={0.25} color={COLORS.goldLight} />
    </group>
  );
}

/**
 * Full luxury 3D scene. Rendered only by <Hero3D>, which handles
 * capability checks and lazy loading — never import this directly
 * on a page that must render without WebGL support.
 */
export default function LuxuryScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} color={COLORS.ivory} />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color={COLORS.gold} />
      <OrnamentRings />
    </Canvas>
  );
}
