import { BallCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";

interface CueBallProps {
  position?: [number, number, number];
  radius?: number;
  delay?: number; // optional delay for physics initialization
}

/**
 * 🎱 Cue Ball Component
 * - Spawns after optional delay
 * - Dynamic (falls, rolls, collides)
 * - Can be hit by cue stick
 */
export function CueBall({ radius = 0.04, delay = 800 }: CueBallProps) {
  const [ready, setReady] = useState(false);

  // Delay spawn to wait for table collider readiness
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (!ready) return null;

  return (
    <RigidBody
      type="kinematicPosition"
      colliders="ball"
      restitution={0.6}
      friction={0.3}
      linearDamping={0.2}
      angularDamping={0.2}
      position={[0.6, .85, .5]}
    >
      <BallCollider args={[radius]} />
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>
    </RigidBody>
  );
}
