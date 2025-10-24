/* eslint-disable @typescript-eslint/no-explicit-any */

/*
  Source: https://sketchfab.com/3d-models/pool-table-with-ball-730584373e5f4f26a64b9b27f71b58bf
  Title: Pool table with ball
*/

interface BallDataItem {
  id: number;
  pos: number[];
  rot: number[];
  mat?: string;
}

interface DelayedBallsProps {
  ballData: BallDataItem[];
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
  cueBallRef: React.RefObject<any>;
}

import { a, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
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
  const cueBallRef = useRef<RapierRigidBody | null>(null);

  const { opacity } = useSpring({
    opacity: visible ? 1 : 0,
    config: { tension: 110, friction: 30 },
    onRest: () => !visible && setRemoved(true),
  });

  useFrame(() => {
    if (triMatRef.current) triMatRef.current.opacity = opacity.get();
  });

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 3000);
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

  // 🎱 All static table parts
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

  // 🎱 Positions & rotations of all pool balls
  const ballData = [
    { id: 4, pos: [-0.031, 0.818, -0.523], rot: [-Math.PI, -0.547, -1.895] },
    { id: 8, pos: [-0.084, 0.818, -0.666], rot: [2.799, 0.497, -2.044] },
    { id: 10, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 12, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 14, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 16, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 18, pos: [-0.082, 0.818, -0.551], rot: [1.404, -0.364, 0.259] },
    { id: 20, pos: [-0.034, 0.818, -0.639], rot: [1.444, -0.008, -0.048] },
    { id: 22, pos: [-0.083, 0.818, -0.608], rot: [1.454, 0.027, -0.079] },
    { id: 24, pos: [-0.134, 0.818, -0.636], rot: [2.949, -0.866, 2.708] },
    { id: 26, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 28, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
    { id: 30, pos: [-0.035, 0.818, -0.697], rot: [1.408, -0.207, 0.124] },
    { id: 32, pos: [-0.032, 0.818, -0.581], rot: [1.732, -0.941, 1.037] },
    { id: 34, pos: [-0.089, 0.791, -0.619], rot: [-Math.PI, -0.547, -Math.PI] },
  ];

  function Balls({
    ballData,
    nodes,
    materials,
    cueBallRef,
  }: DelayedBallsProps) {
    const [groupActive, setGroupActive] = useState(false);
    const ballRefs = useRef<(RapierRigidBody | null)[]>([]);

    // Handle collision with any ball in the rack
    const handleAnyBallCollision = () => {
      if (!groupActive) {
        setGroupActive(true);
        console.log("🎱 Ball rack activated by cue ball!");
      }
    };

    return (
      <group position={[0, 0.08, 0]}>
        {ballData.map((b, i) => {
          const geometry = nodes[`Object_${b.id}`]?.geometry;
          const material = materials[b.mat || "balls"] || materials.balls;
          if (!geometry || !material) return null;

          const jitter = () => (Math.random() - 0.5) * 0.0005;

          return (
            <RigidBody
              key={i}
              ref={(ref) => {
                ballRefs.current[i] = ref; // Fixed: just assign, don't return
              }}
              colliders="ball"
              restitution={0.5}
              friction={0.3}
              linearDamping={0.35}
              angularDamping={0.35}
              mass={0.16}
              type={groupActive ? "dynamic" : "fixed"}
              position={[
                b.pos[0] + jitter(),
                b.pos[1] - 0.001,
                b.pos[2] + jitter(),
              ]}
              rotation={b.rot as [number, number, number]}
              onCollisionEnter={(e) => {
                // If any ball in the rack is hit by the cue ball, activate the entire group
                if (e.other.rigidBody === cueBallRef.current && !groupActive) {
                  handleAnyBallCollision();
                }
              }}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={geometry}
                material={material}
                scale={0.239}
              />
            </RigidBody>
          );
        })}
      </group>
    );
  }

  return (
    <group {...props} dispose={null}>
      {/* 🪵 Table collider */}
      <group position={[0.274, 0, -0.057]} rotation={[0, 0.547, 0]} scale={1.1}>
        {readyTable ? (
          <RigidBody type="fixed" colliders="trimesh">
            {TableGeometry}
          </RigidBody>
        ) : (
          TableGeometry
        )}
      </group>

      {/* 🔺 Triangle Rack (load first, correct transform) */}
      {!removed && (
        <group position={[0, 0.08, 0]}>
          <RigidBody
            type="fixed"
            colliders="trimesh"
            restitution={0.2}
            friction={0.6}
            position={[-0.089, 0.791, -0.619]}
            rotation={[-Math.PI, -0.547, -Math.PI]}
          >
            <a.mesh
              geometry={nodes.Object_6.geometry}
              material={triMaterial}
              castShadow
              receiveShadow
              scale={0.239}
              material-opacity={opacity}
            />
          </RigidBody>
        </group>
      )}

      {/* 🎱 Balls with physics (spawn AFTER rack is ready) */}
      {readyTable && (
        <Balls
          ballData={ballData}
          nodes={nodes}
          materials={materials}
          cueBallRef={cueBallRef}
        />
      )}

      {/* 🎱 Cue and cue ball */}
      {readyTable && (
        <Fragment>
          <CueStick nodes={nodes} materials={materials} />
          <CueBall ref={cueBallRef} position={[0, 0.82, 1.2]} delay={1200} />
        </Fragment>
      )}
    </group>
  );
}

useGLTF.preload("/models/Table.glb");
