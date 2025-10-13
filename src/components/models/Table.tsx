/*
  Source: https://sketchfab.com/3d-models/pool-table-with-ball-730584373e5f4f26a64b9b27f71b58bf
  Title: Pool table with ball
*/

import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Material, Mesh } from "three";
import type { GLTF } from "three-stdlib";

interface GLTFResult extends GLTF {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
}

export default function Table(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Table.glb"
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <group position={[0.274, 0, -0.057]} rotation={[0, 0.547, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_36.geometry}
          material={materials.Oak_Wood}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_37.geometry}
          material={materials.Green_Fabric}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_38.geometry}
          material={materials["plastic.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_39.geometry}
          material={materials["Material.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_40.geometry}
          material={materials.metal}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_41.geometry}
          material={materials.Oak_Wood}
        />
      </group>

      <group position={[0.338, 0.791, 0.049]} rotation={[0, 1.543, -0.002]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_43.geometry}
          material={materials.Maple_wood_texture}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_44.geometry}
          material={materials.Leather_Brown}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_45.geometry}
          material={materials.Handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_46.geometry}
          material={materials.Cover}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_47.geometry}
          material={materials.Car_rubber_wheel}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_48.geometry}
          material={materials.Linen}
        />
      </group>

      <group position={[1.284, 0.599, 0.043]} rotation={[0, 0.547, -1.263]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_50.geometry}
          material={materials.Maple_wood_texture}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_51.geometry}
          material={materials.Leather_Brown}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_52.geometry}
          material={materials.Handle}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_53.geometry}
          material={materials.Cover}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_54.geometry}
          material={materials.Car_rubber_wheel}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_55.geometry}
          material={materials.Linen}
        />
      </group>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials.balls}
        position={[-0.031, 0.818, -0.523]}
        rotation={[-Math.PI, -0.547, -1.895]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_6.geometry}
        material={materials.plastic}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_8.geometry}
        material={materials.balls}
        position={[-0.084, 0.818, -0.666]}
        rotation={[2.799, 0.497, -2.044]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_10.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_12.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_14.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_16.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_18.geometry}
        material={materials.balls}
        position={[-0.082, 0.818, -0.551]}
        rotation={[1.404, -0.364, 0.259]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_20.geometry}
        material={materials.balls}
        position={[-0.034, 0.818, -0.639]}
        rotation={[1.444, -0.008, -0.048]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_22.geometry}
        material={materials.balls}
        position={[-0.083, 0.818, -0.608]}
        rotation={[1.454, 0.027, -0.079]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_24.geometry}
        material={materials.balls}
        position={[-0.134, 0.818, -0.636]}
        rotation={[2.949, -0.866, 2.708]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_26.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_28.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_30.geometry}
        material={materials.balls}
        position={[-0.035, 0.818, -0.697]}
        rotation={[1.408, -0.207, 0.124]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_32.geometry}
        material={materials.balls}
        position={[-0.032, 0.818, -0.581]}
        rotation={[1.732, -0.941, 1.037]}
        scale={0.239}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_34.geometry}
        material={materials.balls}
        position={[-0.089, 0.791, -0.619]}
        rotation={[-Math.PI, -0.547, -Math.PI]}
        scale={0.239}
      />
    </group>
  );
}

useGLTF.preload("/models/Table.glb");

