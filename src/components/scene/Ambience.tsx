import { ContactShadows, Environment } from "@react-three/drei";
import { Fragment, useMemo } from "react";
import * as THREE from "three";

/**
 * Ambience component
 * Handles global lighting, environment reflections, and soft shadows.
 * Enhanced for better shadow sharpness and contrast.
 */
export default function Ambience() {
  const lights = useMemo(() => {
    const group = new THREE.Group();

    /** 🎯 Main overhead spotlight (acts like a ceiling lamp) */
    const mainLight = new THREE.SpotLight(
      "#f5eacb",
      1.4,
      25,
      Math.PI / 4.2,
      0.85
    );
    mainLight.position.set(0, 5, 0);
    mainLight.castShadow = true;

    // 🧠 Higher-quality shadows with stable precision
    mainLight.shadow.mapSize.set(2048, 2048); // 2x sharper
    mainLight.shadow.bias = -0.00005; // reduces acne
    mainLight.shadow.radius = 4; // smooth edges
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.camera.fov = 45;
    group.add(mainLight);

    /** 🌊 Side fill light (adds gentle reflections) */
    const fillLight = new THREE.DirectionalLight("#9de2ff", 0.45);
    fillLight.position.set(3, 2, 2);
    fillLight.castShadow = true;
    fillLight.shadow.mapSize.set(1024, 1024);
    fillLight.shadow.bias = -0.0001;
    group.add(fillLight);

    /** 🍀 Bounce light (green felt reflection) */
    const bounceLight = new THREE.DirectionalLight("#6de46d", 0.25);
    bounceLight.position.set(-2, 1, 3);
    group.add(bounceLight);

    /** 🌤 Ambient fallback (cheap global illumination) */
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    group.add(ambient);

    return group;
  }, []);

  return (
    <Fragment>
      {/* Attach precomputed light group */}
      <primitive object={lights} />

      {/* 🔆 Realistic reflections via HDRI environment */}
      <Environment preset="warehouse" background={false} />

      {/* 🪞 Ground contact shadows (soft pooled effect under the table) */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={1} // slightly stronger for more presence
        scale={12}
        blur={2}
        far={3}
        resolution={2048} // sharper definition
      />
    </Fragment>
  );
}
