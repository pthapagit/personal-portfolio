"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PointLight } from "three";
import { C } from "./palette";
import { usePortfolioStore } from "@/lib/store";

/**
 * Warm fluorescent office lighting. One of the office lights flickers very
 * slightly at random intervals (disabled for reduced motion).
 */
export default function Lighting() {
  const flickerLight = useRef<PointLight>(null);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const state = useRef({ nextAt: 3, until: 0 });

  useFrame(({ clock }) => {
    if (!flickerLight.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;
    if (reducedMotion) {
      flickerLight.current.intensity = 0.85;
      return;
    }
    if (t > s.nextAt) {
      s.until = t + 0.25 + Math.random() * 0.3;
      s.nextAt = t + 4 + Math.random() * 7;
    }
    if (t < s.until) {
      // Rapid subtle dip — a tired fluorescent tube, not a horror movie.
      flickerLight.current.intensity = 0.62 + Math.abs(Math.sin(t * 34)) * 0.25;
    } else {
      flickerLight.current.intensity = 0.85;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} color="#fff0da" />
      <hemisphereLight intensity={0.45} color="#fff4e0" groundColor="#5f7060" />
      {/* Key light over the office */}
      <directionalLight position={[2.5, 4, 3]} intensity={0.85} color="#fff0d0" />
      {/* Warm pool over the desk — this one flickers */}
      <pointLight
        ref={flickerLight}
        position={[0, 2.6, -1.4]}
        intensity={0.85}
        distance={8}
        decay={0}
        color={C.warmLight}
      />
      {/* Corridor pools */}
      <pointLight position={[0, 2.35, 8]} intensity={0.55} distance={6} decay={0} color={C.warmLight} />
      <pointLight position={[0, 2.35, 13]} intensity={0.55} distance={6} decay={0} color={C.warmLight} />
      {/* Faint cool spill from the window */}
      <pointLight position={[-2.4, 1.8, -3.4]} intensity={0.3} distance={4} decay={0} color="#dfe8e6" />
    </group>
  );
}
