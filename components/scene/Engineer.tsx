"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { C } from "./palette";
import { usePortfolioStore } from "@/lib/store";

/**
 * A low-poly software engineer at their chair, quietly typing.
 * Group origin sits on the floor at the chair position, facing -Z (the desk).
 */
export default function Engineer() {
  const root = useRef<Group>(null);
  const leftForearm = useRef<Group>(null);
  const rightForearm = useRef<Group>(null);
  const head = useRef<Group>(null);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    // Chair sway
    if (root.current) root.current.rotation.y = Math.sin(t * 0.35) * 0.045;
    // Typing — alternating forearms
    if (leftForearm.current) leftForearm.current.rotation.x = Math.sin(t * 9) * 0.05 - 0.04;
    if (rightForearm.current) rightForearm.current.rotation.x = Math.sin(t * 9 + Math.PI) * 0.05 - 0.04;
    // Breathing / focus bob
    if (head.current) head.current.position.y = 1.19 + Math.sin(t * 1.3) * 0.006;
  });

  return (
    <group ref={root} position={[0, 0, -0.5]}>
      <Chair />
      {/* Torso */}
      <mesh position={[0, 0.76, 0.02]}>
        <boxGeometry args={[0.38, 0.52, 0.24]} />
        <meshStandardMaterial color={C.shirt} roughness={0.9} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 1.0, 0.02]}>
        <boxGeometry args={[0.16, 0.06, 0.16]} />
        <meshStandardMaterial color={C.skin} roughness={0.9} />
      </mesh>
      {/* Head */}
      <group ref={head} position={[0, 1.19, 0]}>
        <mesh>
          <sphereGeometry args={[0.11, 18, 16]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.035, 0.025]}>
          <sphereGeometry args={[0.112, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={C.hair} roughness={0.95} />
        </mesh>
      </group>
      {/* Upper arms angled toward the desk */}
      <mesh position={[-0.24, 0.84, -0.1]} rotation={[-0.7, 0, 0.12]}>
        <boxGeometry args={[0.085, 0.3, 0.09]} />
        <meshStandardMaterial color={C.shirt} roughness={0.9} />
      </mesh>
      <mesh position={[0.24, 0.84, -0.1]} rotation={[-0.7, 0, -0.12]}>
        <boxGeometry args={[0.085, 0.3, 0.09]} />
        <meshStandardMaterial color={C.shirt} roughness={0.9} />
      </mesh>
      {/* Forearms reaching to the keyboard (pivot at elbow) */}
      <group ref={leftForearm} position={[-0.21, 0.75, -0.2]}>
        <mesh position={[0.02, 0, -0.14]}>
          <boxGeometry args={[0.07, 0.07, 0.3]} />
          <meshStandardMaterial color={C.shirt} roughness={0.9} />
        </mesh>
        <mesh position={[0.02, 0, -0.31]}>
          <boxGeometry args={[0.07, 0.05, 0.08]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>
      </group>
      <group ref={rightForearm} position={[0.21, 0.75, -0.2]}>
        <mesh position={[-0.02, 0, -0.14]}>
          <boxGeometry args={[0.07, 0.07, 0.3]} />
          <meshStandardMaterial color={C.shirt} roughness={0.9} />
        </mesh>
        <mesh position={[-0.02, 0, -0.31]}>
          <boxGeometry args={[0.07, 0.05, 0.08]} />
          <meshStandardMaterial color={C.skin} roughness={0.85} />
        </mesh>
      </group>
      {/* Thighs + shins */}
      <mesh position={[-0.11, 0.48, -0.16]}>
        <boxGeometry args={[0.14, 0.11, 0.42]} />
        <meshStandardMaterial color={C.trousers} roughness={0.95} />
      </mesh>
      <mesh position={[0.11, 0.48, -0.16]}>
        <boxGeometry args={[0.14, 0.11, 0.42]} />
        <meshStandardMaterial color={C.trousers} roughness={0.95} />
      </mesh>
      <mesh position={[-0.11, 0.22, -0.34]}>
        <boxGeometry args={[0.12, 0.42, 0.11]} />
        <meshStandardMaterial color={C.trousers} roughness={0.95} />
      </mesh>
      <mesh position={[0.11, 0.22, -0.34]}>
        <boxGeometry args={[0.12, 0.42, 0.11]} />
        <meshStandardMaterial color={C.trousers} roughness={0.95} />
      </mesh>
      <mesh position={[-0.11, 0.03, -0.41]}>
        <boxGeometry args={[0.11, 0.06, 0.22]} />
        <meshStandardMaterial color="#26221c" roughness={0.9} />
      </mesh>
      <mesh position={[0.11, 0.03, -0.41]}>
        <boxGeometry args={[0.11, 0.06, 0.22]} />
        <meshStandardMaterial color="#26221c" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group>
      {/* Star base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.18, 0.03, Math.cos(a) * 0.18]} rotation={[0, a, 0]}>
            <boxGeometry args={[0.06, 0.04, 0.34]} />
            <meshStandardMaterial color="#33352f" roughness={0.7} />
          </mesh>
        );
      })}
      {/* Post */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.4, 10]} />
        <meshStandardMaterial color={C.metal} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.46, 0.02]}>
        <boxGeometry args={[0.48, 0.07, 0.46]} />
        <meshStandardMaterial color={C.chair} roughness={0.95} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.86, 0.24]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.46, 0.6, 0.07]} />
        <meshStandardMaterial color={C.chair} roughness={0.95} />
      </mesh>
    </group>
  );
}
