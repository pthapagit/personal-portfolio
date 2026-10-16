"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PointLight } from "three";
import { C } from "./palette";
import { usePortfolioStore } from "@/lib/store";
import { useTheme } from "@/lib/useTheme";

/**
 * Office lighting. By day: warm fluorescents fill the room. By night ("night
 * shift"): the ambient/key fill drops to a dim cool moonlight so the warm desk
 * lamp, corridor pools and the green monitor glow carry a working-late mood.
 * One tube flickers at random intervals (disabled for reduced motion).
 */
export default function Lighting() {
  const flickerLight = useRef<PointLight>(null);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const dark = useTheme() === "dark";
  const state = useRef({ nextAt: 3, until: 0 });

  // The flickering desk lamp stays warm in both themes; at night it sits a
  // touch brighter so it reads as the main pool of light in a dim room.
  const deskBase = dark ? 1.0 : 0.85;

  useFrame(({ clock }) => {
    if (!flickerLight.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;
    if (reducedMotion) {
      flickerLight.current.intensity = deskBase;
      return;
    }
    if (t > s.nextAt) {
      s.until = t + 0.25 + Math.random() * 0.3;
      s.nextAt = t + 4 + Math.random() * 7;
    }
    if (t < s.until) {
      // Rapid subtle dip — a tired fluorescent tube, not a horror movie.
      flickerLight.current.intensity = deskBase - 0.23 + Math.abs(Math.sin(t * 34)) * 0.25;
    } else {
      flickerLight.current.intensity = deskBase;
    }
  });

  return (
    <group>
      <ambientLight intensity={dark ? 0.2 : 0.5} color={dark ? "#3b4454" : "#fff0da"} />
      <hemisphereLight
        intensity={dark ? 0.22 : 0.45}
        color={dark ? "#4a5567" : "#fff4e0"}
        groundColor={dark ? "#1a1912" : "#5f7060"}
      />
      {/* Key light over the office — warm daylight, or cool moonlight at night */}
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={dark ? 0.3 : 0.85}
        color={dark ? "#aebfe0" : "#fff0d0"}
      />
      {/* Warm pool over the desk — this one flickers */}
      <pointLight
        ref={flickerLight}
        position={[0, 2.6, -1.4]}
        intensity={deskBase}
        distance={8}
        decay={0}
        color={C.warmLight}
      />
      {/* Corridor pools */}
      <pointLight position={[0, 2.35, 8]} intensity={0.55} distance={6} decay={0} color={C.warmLight} />
      <pointLight position={[0, 2.35, 13]} intensity={0.55} distance={6} decay={0} color={C.warmLight} />
      {/* Window spill — a faint cool daytime glow, stronger moonlight at night */}
      <pointLight
        position={[-2.4, 1.8, -3.4]}
        intensity={dark ? 0.5 : 0.3}
        distance={dark ? 5 : 4}
        decay={0}
        color={dark ? "#9ab4dc" : "#dfe8e6"}
      />
    </group>
  );
}
