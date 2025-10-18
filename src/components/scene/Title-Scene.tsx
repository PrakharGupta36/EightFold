import { a, useSpring } from "@react-spring/three";
import { Center, Environment, Text, Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function TitleScene({
  onClick,
  hasClicked,
}: {
  onClick: () => void;
  hasClicked: boolean;
}) {
  const textRef = useRef<THREE.Mesh>(null!);
  const movingLight = useRef<THREE.SpotLight>(null!);
  const ballGroup = useRef<THREE.Group>(null!);
  const { mouse, viewport, gl } = useThree();

  // ♻️ One vector reused per frame (no GC)
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // 🎯 Precomputed fall targets
  const fallTargets = useMemo(
    () => Array.from({ length: 6 }, () => -6 - Math.random() * 4),
    []
  );

  // ⚡ Spring for title fade
  const { scale, opacity } = useSpring({
    scale: hasClicked ? 0.7 : 1,
    opacity: hasClicked ? 0 : 1,
    config: { mass: 1, tension: 90, friction: 20 },
  });

  // 🖱️ Smooth mouse-driven spotlight + ball animation
  useFrame((_, delta) => {
    const light = movingLight.current;
    const group = ballGroup.current;
    if (light) {
      tempVec.set(mouse.x * viewport.width, mouse.y * viewport.height - 0.5, 6);
      light.position.lerp(tempVec, 0.15);
    }

    if (!group) return;
    const time = performance.now() * 0.0004;
    const lerpFactor = hasClicked ? 0.05 : 0.1;

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

        const targetY = fallTargets[i];
        mesh.position.y = THREE.MathUtils.lerp(
          mesh.position.y,
          targetY,
          lerpFactor
        );

        mesh.position.x *= 1 + 0.015 * delta * 60;
        mesh.position.z *= 1 + 0.015 * delta * 60;
      }
    }
  });

  // 🌐 Global click handler (only once)
  useEffect(() => {
    const handleClick = () => !hasClicked && onClick();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [hasClicked, onClick]);

  // 🎱 Pre-painted textures (memoized)
  const ballData = useMemo(
    () => [
      { color: "#ff0000", number: 1 },
      { color: "#ffcc00", number: 2 },
      { color: "#00ff00", number: 3 },
      { color: "#0000ff", number: 4 },
      { color: "#ff66cc", number: 5 },
      { color: "#000000", number: 8 },
    ],
    []
  );

  const paintedTextures = useMemo(() => {
    return ballData.map(({ color, number }) => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);

      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(size / 2, size / 2, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color === "#000000" ? "white" : "black";
      ctx.font = `${size * 0.2}px Arial Black`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(number.toString(), size / 2, size / 2 + size * 0.05);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      return texture;
    });
  }, [ballData, gl]);

  return (
    <a.group scale={scale} position={[0, 0.2, 0]}>
      <group>
        <Center position={[0, 0.5, 0]}>
          <a.mesh ref={textRef}>
            <Text3D
              font="/font.json"
              size={0.5}
              height={0.06}
              bevelEnabled
              bevelThickness={0.025}
              bevelSize={0.012}
              bevelSegments={6} // halved
              curveSegments={12} // halved
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

        <a.group position={[0, -0.1, 0]}>
          <Text
            color="#5aff6a"
            fontSize={0.14}
            letterSpacing={0.01}
            anchorX="center"
            anchorY="middle"
            fontStyle="italic"
            outlineWidth={0.004}
            outlineColor="#003300"
          >
            {hasClicked ? "Racking up..." : "Click anywhere to break"}
          </Text>
        </a.group>

        {/* 🎱 Billiard balls */}
        <group ref={ballGroup} position={[0, -0.6, 0]}>
          {paintedTextures.map((texture, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(i * 1.8) * 5.5,
                -0.65,
                Math.cos(i * 1.8) * 5.5,
              ]}
              castShadow
            >
              <sphereGeometry args={[0.18, 32, 32]} /> {/* halved segments */}
              <meshStandardMaterial
                map={texture}
                metalness={0.1}
                roughness={0.25}
                envMapIntensity={1.2}
              />
            </mesh>
          ))}
        </group>
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
