import { a, useSpring } from "@react-spring/three";
import { Center, Environment, Text, Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
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
  const { mouse, viewport } = useThree();

  // 🎯 Random fall targets (only computed once)
  const fallTargets = useRef<number[]>([]);

  useEffect(() => {
    fallTargets.current = Array.from({ length: 6 }).map(
      () => -6 - Math.random() * 4
    ); // random depth fall for each ball
  }, []);

  // 🖱️ Move spotlight + animate balls
  useFrame(() => {
    if (movingLight.current) {
      const x = mouse.x * viewport.width * 1.5;
      const y = mouse.y * viewport.height * 5.5 + 1.5;
      movingLight.current.position.lerp(new THREE.Vector3(x, y, 6), 0.1);
      movingLight.current.target.position.set(0, 0, 0);
      movingLight.current.target.updateMatrixWorld();
    }

    if (ballGroup.current) {
      ballGroup.current.children.forEach((ball, i) => {
        const mesh = ball as THREE.Mesh;

        // 🌀 Orbit animation (before click)
        if (!hasClicked) {
          mesh.position.x = Math.sin(Date.now() * 0.0004 + i) * 1.5;
          mesh.position.z = Math.cos(Date.now() * 0.0004 + i) * 1.5;
          mesh.rotation.x += 0.02;
          mesh.rotation.y += 0.03;
        }

        // 💥 Fall animation (after click)
        if (hasClicked) {
          // Spin faster as falling
          mesh.rotation.x += 0.15;
          mesh.rotation.y += 0.18;
          mesh.rotation.z += 0.18;

          // Smoothly lerp Y toward fall target
          const targetY = fallTargets.current[i];
          mesh.position.y = THREE.MathUtils.lerp(
            mesh.position.y,
            targetY,
            0.05
          );

          // Also drift slightly outward while falling
          mesh.position.x = THREE.MathUtils.lerp(
            mesh.position.x,
            mesh.position.x * 1.15,
            0.03
          );
          mesh.position.z = THREE.MathUtils.lerp(
            mesh.position.z,
            mesh.position.z * 1.15,
            0.03
          );
        }
      });
    }
  });

  // ⚡ Title animation
  const { scale, opacity } = useSpring({
    scale: hasClicked ? 0.7 : 1,
    opacity: hasClicked ? 0 : 1,
    config: { mass: 1, tension: 90, friction: 20 },
  });

  // 🌐 Click anywhere
  useEffect(() => {
    const handleFullClick = () => {
      if (!hasClicked) onClick();
    };
    window.addEventListener("click", handleFullClick);
    return () => window.removeEventListener("click", handleFullClick);
  }, [hasClicked, onClick]);

  // 🎨 Painted number textures (ball color + number)
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
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Base ball color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);

      // White circle
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(size / 2, size / 2, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Number
      ctx.fillStyle = color === "#000000" ? "white" : "black";
      ctx.font = `${size * 0.2}px Arial Black`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(number.toString(), size / 2, size / 2 + size * 0.05);

      // Texture
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      texture.needsUpdate = true;

      return texture;
    });
  }, [ballData]);

  return (
    <a.group scale={scale} position={[0, 0.2, 0]}>
      {/* 🎯 Title group */}
      <group position={[0, 0, 0]} receiveShadow castShadow>
        <Center position={[0, 0.5, 0]}>
          <a.mesh ref={textRef} castShadow receiveShadow>
            <Text3D
              font="/font.json"
              size={0.55}
              height={0.08}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.015}
              bevelSegments={12}
              curveSegments={24}
            >
              EIGHTFOLD
              <a.meshStandardMaterial
                color="#59ca6e"
                metalness={1}
                roughness={0.1}
                opacity={opacity}
                transparent
                envMapIntensity={3}
              />
            </Text3D>
          </a.mesh>
        </Center>

        {/* Subtitle */}
        <a.group position={[0, -0.1 , 0]}>
          <Text
            color={"#5aff6a"}
            fontSize={0.15}
            letterSpacing={0.01}
            anchorX="center"
            fontStyle="italic"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="#003300"
          >
            {hasClicked ? "Racking up..." : "Click anywhere to break"}
          </Text>
        </a.group>

        {/* 🎱 Painted numbered balls */}
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
              <sphereGeometry args={[0.18, 64, 64]} />
              <meshPhysicalMaterial
                map={texture}
                metalness={0.1}
                roughness={0.25}
                envMapIntensity={1.5}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* 💡 Warm cinematic lighting */}
      <spotLight
        ref={movingLight}
        position={[0, 2, 4]}
        intensity={45}
        angle={0.45}
        penumbra={1}
        color={"#ffcc88"}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.7}
        color="#aaffaa"
        castShadow
      />
      <ambientLight intensity={0.25} color="#222222" />
      <Environment preset="studio" />

      {/* 🌫️ Fog & Atmosphere */}
      <fog attach="fog" args={["#090707", 3, 10]} />

      {/* 🎬 Postprocessing */}
      <EffectComposer>
        <Bloom
          intensity={0.25}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          mipmapBlur
          radius={0.1}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.0012]}
        />
        <Vignette
          offset={0.4}
          darkness={0.9}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </a.group>
  );
}
