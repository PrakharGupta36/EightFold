import { OrbitControls, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Ambience from "./components/scene/Ambience";
import Table from "./components/models/Table";

function App() {
  return (
    <main className="grid place-items-center h-screen bg-base text-text font-sans">
      {/* 🖼 3D Canvas */}
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [3, 2, 3], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          shadowMapEnabled: true,
          shadowMapType: THREE.PCFSoftShadowMap,
        }}
      >
        {/* 💤 Suspense fallback while assets load */}
        <Suspense fallback={null}>
          {/* 🌤 Lighting + Environment */}
          <Ambience />

          {/* 🎱 Pool Table Model */}
          <Table position={[-0.35, 0, 0]} />

          {/* 🎥 Camera controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={1.5}
            maxDistance={5}
            enableZoom={false}
          />
        </Suspense>
      </Canvas>

      {/* 🔄 Global loading indicator (shows progress %) */}
      <Loader
        containerStyles={{
          backgroundColor: "#0e0e0e",
          color: "#dfdfdf",
        }}
        innerStyles={{
          background: "#b6ff7f",
        }}
        barStyles={{
          background: "#b6ff7f",
        }}
        dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
      />
    </main>
  );
}

export default App;
