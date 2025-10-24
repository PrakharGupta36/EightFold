import { useFrame } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface CueBallProps {
  position?: [number, number, number];
  radius?: number;
  delay?: number;
}

export const CueBall = forwardRef<RapierRigidBody, CueBallProps>(
  ({ radius = 0.032, delay = 900 }, ref) => {
    const [ready, setReady] = useState(false);
    const rigidBodyRef = useRef<RapierRigidBody>(null);

    useImperativeHandle(ref, () => rigidBodyRef.current!);

    useEffect(() => {
      const timeout = setTimeout(() => setReady(true), delay);
      return () => clearTimeout(timeout);
    }, [delay]);

    useFrame(() => {
      if (rigidBodyRef.current) {
        rigidBodyRef.current.translation();
      }
    });

    if (!ready) return null;

    return (
      <RigidBody
        ref={rigidBodyRef}
        type="dynamic"
        colliders="ball"
        restitution={0.6}
        friction={0.3}
        linearDamping={0.2}
        angularDamping={0.2}
        mass={0.17}
        position={[0.6, 1, 0.5]}
        userData={{ isCueBall: true }}
      >
        <BallCollider args={[radius]} />
        <mesh castShadow receiveShadow scale={0.7}>
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
);

CueBall.displayName = "CueBall";
