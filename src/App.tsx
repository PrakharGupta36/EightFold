import RAPIER from "@dimforge/rapier3d-compat";
import { a, useSpring } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, Suspense, useEffect, useState } from "react";
import * as THREE from "three";

import Table from "./components/models/Table";
import Ambience from "./components/scene/Ambience";
import LoadingScreen from "./components/scene/Loading-Screen";
import TitleScene from "./components/scene/Title-Scene";
import CanvasGrid from "./components/scene/helpers/canvas-grid";
import GameMenu from "./components/scene/helpers/game-menu";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const [rapierReady, setRapierReady] = useState(false);

  // ✅ PRELOAD RAPiER WASM
  useEffect(() => {
    RAPIER.init().then(() => {
      console.log("✅ Rapier initialized successfully");
      setRapierReady(true);
    });
  }, []);

  const bgVariants = {
    dark: { backgroundColor: "#0e0e0e", transition: { duration: 1.2 } },
    light: { backgroundColor: "#f1f1f1", transition: { duration: 1.2 } },
  };

  const tableSpring = useSpring({
    scale: isLoading ? 0 : 1,
    rotationX: isLoading ? Math.PI * 0.3 : 0,
    config: { mass: 1, tension: 90, friction: 18 },
  });

  const handleClick = () => {
    if (!hasClicked) {
      setHasClicked(true);
      setTimeout(() => setIsLoading(false), 1300);
    }
  };

  // ✅ Wait until Rapier is initialized before rendering Canvas
  if (!rapierReady) {
    return (
      <div className="grid place-items-center h-screen text-gray-200 bg-[#0e0e0e] font-sans">
        <p>Loading physics engine...</p>
      </div>
    );
  }

  return (
    <motion.main
      className="grid place-items-center h-screen text-[#121212] font-sans"
      variants={bgVariants}
      animate={isLoading ? "dark" : "light"}
      initial="dark"
    >
      <Canvas
        className="z-10"
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
        <Suspense fallback={<LoadingScreen />}>
          <Ambience />

          {/* ✅ Keep Physics always mounted (no AnimatePresence switching) */}
          <Physics gravity={[0, -9.81, 0]}>
            {!isLoading && (
              <a.group
                scale={tableSpring.scale}
                rotation-x={tableSpring.rotationX}
              >
                <Table position={[-0.35, 0, 0]} />
              </a.group>
            )}
          </Physics>

          {/* Keep title outside of physics world */}
          <AnimatePresence mode="wait">
            {isLoading && <TitleScene key="title" hasClicked={hasClicked} />}
          </AnimatePresence>

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={1.5}
            maxDistance={5}
            enableZoom={!isLoading}
            enablePan={!isLoading}
            enabled={!isLoading}
          />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {!hasClicked && (
          <Fragment>
            <CanvasGrid key="grid" isVisible={!hasClicked} />
            <GameMenu onClick={handleClick} />
          </Fragment>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
