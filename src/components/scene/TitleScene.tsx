import { a, useSpring } from "@react-spring/three";
import { Center, Environment, Text, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function TitleScene({
  onClick,
  hasClicked,
}: {
  onClick: () => void;
  hasClicked: boolean;
}) {
  const textRef = useRef<THREE.Mesh>(null!);

  // ✨ Floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(t / 2) * 0.015;
      textRef.current.position.y = Math.sin(t * 1.2) * 0.003;
    }
  });

  // 🎬 Transition on click
  const { scale, opacity } = useSpring({
    scale: hasClicked ? 0.7 : 1,
    opacity: hasClicked ? 0 : 1,
    config: { mass: 1, tension: 80, friction: 15 },
  });

  // 🌐 Global click handler
  useEffect(() => {
    const handleFullClick = () => {
      if (!hasClicked) onClick();
    };
    window.addEventListener("click", handleFullClick);
    return () => window.removeEventListener("click", handleFullClick);
  }, [hasClicked, onClick]);

  return (
    <a.group scale={scale}>
      {/* 🎯 Centered Title + Subtitle Group */}
      <group position={[0, 0, 0]}>
        {/* 🩶 3D Title */}
        <Center>
          <a.mesh ref={textRef} position={[0, -.1, 0]}>
            <Text3D
              font="/Poppins.json"
              size={0.5}
              height={0.06}
              bevelEnabled
              bevelThickness={0.04}
              bevelSize={0.015}
              bevelSegments={10}
              curveSegments={20}
            >
              EIGHTFOLD
              <a.meshStandardMaterial
                color="#e5e5e5"
                metalness={0.95}
                roughness={0.15}
                opacity={opacity}
                transparent
                envMapIntensity={2}
              />
            </Text3D>
          </a.mesh>
        </Center>

        {/* 🖋 Subtitle (positioned manually below title) */}
        <Text
          position={[0, -0.5, 0]}
          color={"#b6ff7f"}
          fontSize={0.12}
          letterSpacing={0.03}
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {hasClicked ? "Starting..." : "(click anywhere to start)"}
        </Text>
      </group>

      {/* 🎥 Lights */}
      <spotLight
        position={[0, 3, 3]}
        intensity={120}
        angle={0.4}
        penumbra={1}
        color={"#b6ff7f"}
      />
      <directionalLight position={[0, 0, 5]} intensity={1.2} color="#ffffff" />
      <Environment preset="studio" />
    </a.group>
  );
}
