import { a, useSpring } from "@react-spring/three";
import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useState } from "react";
import * as THREE from "three";
import Table from "./components/models/Table";
import Ambience from "./components/scene/Ambience";
import TitleScene from "./components/scene/TitleScene";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);

  // 🌗 Background animation using Framer Motion
  const bgVariants = {
    dark: { backgroundColor: "#0e0e0e", transition: { duration: 1.2 } },
    light: { backgroundColor: "#f1f1f1", transition: { duration: 1.2 } },
  };

  // 🎞️ Table 3D entrance animation
  const tableSpring = useSpring({
    scale: isLoading ? 0 : 1,
    rotationX: isLoading ? Math.PI * 0.3 : 0,
    config: { mass: 1, tension: 90, friction: 18 },
  });

  const handleClick = () => {
    if (!hasClicked) {
      setHasClicked(true);
      // Smooth transition delay for title fade-out
      setTimeout(() => setIsLoading(false), 1300);
    }
  };

  return (
    <motion.main
      className="grid place-items-center h-screen text-[#121212] font-sans"
      variants={bgVariants}
      animate={isLoading ? "dark" : "light"}
      initial="dark"
    >
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <Ambience />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <TitleScene
                key="title"
                onClick={handleClick}
                hasClicked={hasClicked}
              />
            ) : (
              // ✅ Physics world wraps the table and related bodies
              <Physics key="table" gravity={[0, -9.81, 0]} debug>
                <a.group
                  scale={tableSpring.scale}
                  rotation-x={tableSpring.rotationX}
                >
                  <Table position={[-0.35, 0, 0]} />
                </a.group>
              </Physics>
            )}
          </AnimatePresence>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={1.5}
            maxDistance={5}
            enableZoom={!isLoading}
            enablePan={!isLoading}
            enabled={!isLoading} // disables orbit control when loading
          />
        </Suspense>
      </Canvas>

      {/* 🌀 Loading Bar (Drei Loader) */}
      <Loader
        containerStyles={{
          backgroundColor: "#0e0e0e",
          color: "#dfdfdf",
          fontFamily: "monospace",
        }}
        innerStyles={{ background: "#b6ff7f" }}
        barStyles={{ background: "#b6ff7f" }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
    </motion.main>
  );
}
