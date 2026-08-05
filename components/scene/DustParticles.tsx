"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { BufferAttribute, Points } from "three";
import { usePortfolioStore } from "@/lib/store";

const COUNT = 220;

/** Deterministic PRNG (mulberry32) so render stays pure. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Slow floating dust motes in the office air. */
export default function DustParticles() {
  const points = useRef<Points>(null);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  const { positions, speeds } = useMemo(() => {
    const rand = mulberry32(1984);
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 7; // x
      positions[i * 3 + 1] = 0.2 + rand() * 2.4; // y
      positions[i * 3 + 2] = -3.5 + rand() * 7; // z
      speeds[i * 2] = 0.008 + rand() * 0.02; // rise speed
      speeds[i * 2 + 1] = rand() * Math.PI * 2; // phase
    }
    return { positions, speeds };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!points.current || reducedMotion) return;
    const attr = points.current.geometry.getAttribute("position") as BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speeds[i * 2] * delta * 6;
      arr[i * 3] += Math.sin(t * 0.3 + speeds[i * 2 + 1]) * delta * 0.02;
      if (arr[i * 3 + 1] > 2.7) arr[i * 3 + 1] = 0.15;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.014} color="#fff7dd" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}
