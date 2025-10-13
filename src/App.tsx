import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Ambience from "./components/scene/Ambience";
import Table from "./components/models/Table";

function App() {
  return (
    <main className="grid place-items-center h-screen bg-base text-text font-sans">
      <Canvas
        shadows
        frameloop="demand" // 🔥 only re-renders when scene updates
        dpr={[1, 1.5]} // 🔥 limits device pixel ratio for performance
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
        {/* 🌤 Lighting + Environment */}
        <Ambience />

        {/* 🎱 Pool Table Model */}
        <Table position={[-0.35, 0, 0]} />

        {/* 🎥 Orbit controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={1.5}
          maxDistance={5}
          enableZoom={false}
        />
      </Canvas>
    </main>
  );
}

export default App;
