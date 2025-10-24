/*
  Source: https://sketchfab.com/3d-models/pool-table-with-ball-730584373e5f4f26a64b9b27f71b58bf
  Title: Pool table with ball
*/

import { a, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import type { Material, Mesh } from "three";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { CueBall } from "./Cue-Ball";
import { CueStick } from "./Cue-Stick";

interface GLTFResult extends GLTF {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
}

export default function Table(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Table.glb"
  ) as unknown as GLTFResult;

  const [readyTable, setReadyTable] = useState(false);
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);
  const triMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const { opacity, scale } = useSpring({
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.6,
    config: { tension: 110, friction: 30 },
    onRest: () => !visible && setRemoved(true),
  });

  useFrame(() => {
    if (triMatRef.current) triMatRef.current.opacity = opacity.get();
  });

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(fadeTimer);
  }, []);

  const triMaterial = useMemo(() => {
    const mat = (materials.plastic as THREE.MeshStandardMaterial).clone();
    mat.transparent = true;
    mat.metalness = 0.2;
    mat.roughness = 0.3;
    triMatRef.current = mat;
    return mat;
  }, [materials.plastic]);

  useEffect(() => {
    if (nodes.Object_36?.geometry) {
      const timeout = setTimeout(() => {
        setReadyTable(true);
        console.log("✅ Table collider initialized after delay");
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [nodes]);

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

  const Balls = (
    <>
      <mesh
        geometry={nodes.Object_4.geometry}
        material={materials.balls}
        position={[-0.031, 0.818, -0.523]}
        rotation={[-Math.PI, -0.547, -1.895]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_6.geometry}
        material={materials.plastic}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_8.geometry}
        material={materials.balls}
        position={[-0.084, 0.818, -0.666]}
        rotation={[2.799, 0.497, -2.044]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_10.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_12.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_14.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_16.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_18.geometry}
        material={materials.balls}
        position={[-0.082, 0.818, -0.551]}
        rotation={[1.404, -0.364, 0.259]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_20.geometry}
        material={materials.balls}
        position={[-0.034, 0.818, -0.639]}
        rotation={[1.444, -0.008, -0.048]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_22.geometry}
        material={materials.balls}
        position={[-0.083, 0.818, -0.608]}
        rotation={[1.454, 0.027, -0.079]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_24.geometry}
        material={materials.balls}
        position={[-0.134, 0.818, -0.636]}
        rotation={[2.949, -0.866, 2.708]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_26.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_28.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_30.geometry}
        material={materials.balls}
        position={[-0.035, 0.818, -0.697]}
        rotation={[1.408, -0.207, 0.124]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_32.geometry}
        material={materials.balls}
        position={[-0.032, 0.818, -0.581]}
        rotation={[1.732, -0.941, 1.037]}
        scale={0.239}
      />
      <mesh
        geometry={nodes.Object_34.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
    </>
  );

  return (
    <group {...props} dispose={null}>
      <group position={[0.274, 0, -0.057]} rotation={[0, 0.547, 0]} scale={1.1}>
        {readyTable ? (
          <RigidBody type="fixed" colliders="trimesh">
            {TableGeometry}
          </RigidBody>
        ) : (
          TableGeometry
        )}
      </group>

      <group position={[0, 0.1, 0]}>{Balls}</group>

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

      {readyTable && (
        <Fragment>
          <CueStick nodes={nodes} materials={materials} />
          <CueBall position={[0, 0.82, 1.2]} delay={1200} />
        </Fragment>
      )}
    </group>
  );
}

useGLTF.preload("/models/Table.glb");
