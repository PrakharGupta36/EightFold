/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export function CueStick({ nodes, materials }: { nodes: any; materials: any }) {
  const stickRef = useRef<any>(null);
  const target = new THREE.Vector3();

  useFrame(({ pointer, viewport }) => {
    if (!stickRef.current) return;

    // Map mouse movement to 3D space
    const x = pointer.x * viewport.width * 0.5;
    const z = -pointer.y * viewport.height * 0.5;

    // Smooth motion
    target.set(x, 0.85, z + 1);
    stickRef.current.setNextKinematicTranslation(target);
  });

  return (
    <RigidBody
      ref={stickRef}
      type="kinematicPosition"
      colliders="trimesh"
      friction={0.6}
      restitution={0.3}
    >
      <group position={[0, 0.05, 0]} rotation={[0, Math.PI / 2 + 0.8, 0]}>
        <mesh
          geometry={nodes.Object_50.geometry}
          material={materials.Maple_wood_texture}
        />
        <mesh
          geometry={nodes.Object_51.geometry}
          material={materials.Leather_Brown}
        />
        <mesh geometry={nodes.Object_52.geometry} material={materials.Handle} />
        <mesh geometry={nodes.Object_53.geometry} material={materials.Cover} />
        <mesh
          geometry={nodes.Object_54.geometry}
          material={materials.Car_rubber_wheel}
        />
        <mesh geometry={nodes.Object_55.geometry} material={materials.Linen} />
      </group>
    </RigidBody>
  );
}
