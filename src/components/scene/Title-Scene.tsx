"use client";

import { a, useSpring } from "@react-spring/three";
import { Center, Environment, Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function TitleScene({
  
  hasClicked,
}: {
  // onClick: () => void;
  hasClicked: boolean;
}) {
  const textRef = useRef<THREE.Mesh>(null!);
  const movingLight = useRef<THREE.SpotLight>(null!);
  const ballGroup = useRef<THREE.Group>(null!);
  const { mouse, viewport } = useThree();

  // ♻️ One vector reused per frame (no GC)
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // ⚡ Spring for title fade
  const { scale, opacity } = useSpring({
    scale: hasClicked ? 1.2 : 1,
    opacity: hasClicked ? 0 : 1,
    config: { mass: 1, tension: 90, friction: 20 },
  });

  // 🖱️ Smooth mouse-driven spotlight + ball animation
  useFrame((_, delta) => {
    const light = movingLight.current;
    const group = ballGroup.current;

    if (light) {
      tempVec.set(mouse.x * viewport.width, mouse.y * viewport.height - 0, 6);
      light.position.lerp(tempVec, 0.15);
    }

    if (!group) return;
    const time = performance.now() * 0.0004;

    for (let i = 0; i < group.children.length; i++) {
      const mesh = group.children[i] as THREE.Mesh;

      if (!hasClicked) {
        mesh.position.x = Math.sin(time + i) * 1.5;
        mesh.position.z = Math.cos(time + i) * 1.5;
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.03;
      } else {
        mesh.rotation.x += 0.15;
        mesh.rotation.y += 0.18;
        mesh.rotation.z += 0.18;

        mesh.position.x *= 1 + 0.015 * delta * 60;
        mesh.position.z *= 1 + 0.015 * delta * 60;
      }
    }
  });

  return (
    <a.group scale={scale} position={[0, -0.2, 0]}>
      <group>
        <Center position={[0, 0.5, 0]}>
          <a.mesh ref={textRef}>
            <Text3D
              font="/font.json"
              size={0.3}
              height={0.06}
              bevelEnabled
              bevelThickness={0.025}
              bevelSize={0.012}
              bevelSegments={6}
              curveSegments={12}
            >
              EIGHTFOLD
              <a.meshStandardMaterial
                color="#59ca6e"
                metalness={1}
                roughness={0.1}
                opacity={opacity}
                transparent
                envMapIntensity={2}
              />
            </Text3D>
          </a.mesh>
        </Center>
      </group>

      {/* 💡 Simplified Lighting */}
      <spotLight
        ref={movingLight}
        position={[0, 2, 4]}
        intensity={15}
        angle={0.45}
        penumbra={0.8}
        color="#ffcc88"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="warehouse" />

      {/* 🎬 Lightweight Postprocessing */}
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.4} luminanceThreshold={0.25} radius={0.15} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
        <Noise opacity={0.1} />
      </EffectComposer>
    </a.group>
  );
}
