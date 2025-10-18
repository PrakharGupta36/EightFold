/*
  Source: https://sketchfab.com/3d-models/pool-table-with-ball-730584373e5f4f26a64b9b27f71b58bf
  Title: Pool table with ball
*/

import { a, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type JSX } from "react";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";
import type { Material, Mesh } from "three";

interface GLTFResult extends GLTF {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
}

export default function Table(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Table.glb"
  ) as unknown as GLTFResult;

  // ⚙️ State
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);

  const triMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // 🌀 Triangle animation
  const { opacity, scale } = useSpring({
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.6,
    config: { tension: 110, friction: 30 },
    onRest: () => !visible && setRemoved(true),
  });

  // 🔄 Animate opacity every frame
  useFrame(() => {
    if (triMatRef.current) triMatRef.current.opacity = opacity.get();
  });

  // ⏱ Fade triangle
  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(fadeTimer);
  }, []);

  // 🧪 Clone triangle material
  const triMaterial = useMemo(() => {
    const mat = (materials.plastic as THREE.MeshStandardMaterial).clone();
    mat.transparent = true;
    mat.metalness = 0.2;
    mat.roughness = 0.3;
    triMatRef.current = mat;
    return mat;
  }, [materials.plastic]);

  // 🕒 Delay collider creation until model and transforms fully load
  useEffect(() => {
    if (nodes.Object_36?.geometry) {
      // Give R3F + Rapier enough time to settle transforms
      const timeout = setTimeout(() => {
        setReady(true);
        console.log("✅ Table collider initialized after delay");
      }, 600); // 0.6 seconds delay (tweak as needed)
      return () => clearTimeout(timeout);
    }
  }, [nodes]);

  // 🧱 Table meshes (no balls or sticks)
  const TableGeometry = (
    <>
      <mesh
        geometry={nodes.Object_36.geometry}
        material={materials.Oak_Wood}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.Object_37.geometry}
        material={materials.Green_Fabric}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.Object_38.geometry}
        material={materials["plastic.001"]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.Object_39.geometry}
        material={materials["Material.002"]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.Object_40.geometry}
        material={materials.metal}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.Object_41.geometry}
        material={materials.Oak_Wood}
        castShadow
        receiveShadow
      />
    </>
  );

  return (
    <group {...props} dispose={null}>
      {/* 🪵 TABLE (physics-accurate after short delay) */}
      <group position={[0.274, 0, -0.057]} rotation={[0, 0.547, 0]}>
        {ready ? (
          <RigidBody type="fixed" colliders="trimesh">
            {TableGeometry}
          </RigidBody>
        ) : (
          TableGeometry
        )}
      </group>

      {/* 🔺 TRIANGLE (Animated → disappears) */}
      {!removed && (
        <a.mesh
          geometry={nodes.Object_6.geometry}
          material={triMaterial}
          castShadow
          receiveShadow
          position={[-0.089, 0.791, -0.619]}
          rotation={[-Math.PI, -0.547, -Math.PI]}
          scale={scale.to((s) => 0.239 * s)}
        />
      )}
    </group>
  );
}

useGLTF.preload("/models/Table.glb");
