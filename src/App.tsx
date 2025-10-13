import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

function App() {
  return (
    <main className="grid place-items-center h-screen bg-base text-text font-sans">
      {/* 3D Canvas */}
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube />
        <OrbitControls />
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute bottom-10 text-center">
        <h1 className="font-inter text-4xl tracking-wide text-accent">
          EIGHTFOLD
        </h1>
        <p className="font-space-grotesk text-sm opacity-80">
          Multiplayer 8-Ball Physics Demo
        </p>
      </div>
    </main>
  );
}

export default App;
