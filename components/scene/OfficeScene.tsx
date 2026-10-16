"use client";

import { Canvas } from "@react-three/fiber";
import { INTRO_START } from "@/lib/sceneConfig";
import { usePortfolioStore } from "@/lib/store";
import { useTheme } from "@/lib/useTheme";
import Room from "./Room";
import Cubicle from "./Cubicle";
import Lighting from "./Lighting";
import DustParticles from "./DustParticles";
import CameraRig from "./CameraRig";

/** The full 3D office. Loaded dynamically (client-only) from Experience. */
export default function OfficeScene() {
  const setSceneReady = usePortfolioStore((s) => s.setSceneReady);
  // Pale daylight haze by day; a cool, closer night haze after hours.
  const dark = useTheme() === "dark";
  const bg = dark ? "#13141a" : "#d8d0bd";
  const fogNear = dark ? 8 : 10;
  const fogFar = dark ? 22 : 26;

  return (
    <div className="fixed inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 55, near: 0.1, far: 60, position: INTRO_START.position }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => setSceneReady()}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[bg, fogNear, fogFar]} />
        <Lighting />
        <Room />
        <Cubicle />
        <DustParticles />
        <CameraRig />
      </Canvas>
    </div>
  );
}
