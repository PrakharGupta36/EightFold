import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";
import { motion, AnimatePresence } from "framer-motion";
import Table from "./components/models/Table";
import Ambience from "./components/scene/Ambience";
import TitleScene from "./components/scene/TitleScene";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);

  // 🎨 Framer Motion for DOM background fade
  const bgVariants = {
    dark: { backgroundColor: "#0e0e0e", transition: { duration: 1.2 } },
    light: { backgroundColor: "#f1f1f1", transition: { duration: 1.2 } },
  };

  // 🎥 React Spring for Table 3D animation
  const tableSpring = useSpring({
    scale: isLoading ? 0 : 1,
    positionY: isLoading ? -1.5 : 0,
    rotationX: isLoading ? Math.PI * 0.3 : 0,
    opacity: isLoading ? 0 : 1,
    config: { mass: 1, tension: 90, friction: 18 },
  });

  const handleClick = () => {
    if (!hasClicked) {
      setHasClicked(true);
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
              <a.group
                key="table"
                scale={tableSpring.scale}
                position-y={tableSpring.positionY}
                rotation-x={tableSpring.rotationX}
              >
                <Table position={[-0.35, 0, 0]} />
              </a.group>
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
            enabled={!isLoading} // 🔒 locks orbit controls when loading
          />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{
          backgroundColor: "#0e0e0e",
          color: "#dfdfdf",
          fontFamily: "monospace",
        }}
        innerStyles={{
          background: "#b6ff7f",
        }}
        barStyles={{
          background: "#b6ff7f",
        }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
    </motion.main>
  );
}
