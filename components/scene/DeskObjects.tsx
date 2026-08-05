"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, PointLight } from "three";
import { C } from "./palette";
import { usePortfolioStore } from "@/lib/store";

const hl = (hovered: boolean) =>
  ({ emissive: hovered ? C.highlight : "#000000", emissiveIntensity: hovered ? 0.35 : 0 }) as const;

/** CRT monitor with an idle terminal screen, blinking cursor and glow. */
export function Monitor({ hovered }: { hovered: boolean }) {
  const cursor = useRef<Mesh>(null);
  const glow = useRef<PointLight>(null);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cursor.current) cursor.current.visible = reducedMotion ? true : Math.floor(t / 0.53) % 2 === 0;
    if (glow.current) glow.current.intensity = 0.28 + (reducedMotion ? 0 : Math.sin(t * 2.1) * 0.05);
  });

  return (
    <group position={[0, 0.77, -1.42]}>
      {/* Stand */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.3]} />
        <meshStandardMaterial color={C.furniture} roughness={0.8} {...hl(hovered)} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.14, 0.06, 0.14]} />
        <meshStandardMaterial color={C.furniture} roughness={0.8} {...hl(hovered)} />
      </mesh>
      {/* CRT body */}
      <mesh position={[0, 0.3, -0.02]}>
        <boxGeometry args={[0.46, 0.38, 0.42]} />
        <meshStandardMaterial color={C.furniture} roughness={0.75} {...hl(hovered)} />
      </mesh>
      {/* Screen bezel */}
      <mesh position={[0, 0.3, 0.192]}>
        <planeGeometry args={[0.4, 0.32]} />
        <meshStandardMaterial color="#494538" roughness={0.6} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.3, 0.196]}>
        <planeGeometry args={[0.36, 0.28]} />
        <meshStandardMaterial
          color={C.screen}
          emissive="#0c2f1a"
          emissiveIntensity={hovered ? 1.6 : 1.1}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>
      {/* Idle text lines */}
      {[
        [0.2, 0.1],
        [0.14, 0.06],
        [0.24, 0.02],
      ].map(([w, y], i) => (
        <mesh key={i} position={[-0.17 + w / 2, 0.3 + y, 0.198]}>
          <planeGeometry args={[w, 0.008]} />
          <meshStandardMaterial color={C.screenGlow} emissive={C.screenGlow} emissiveIntensity={0.7} toneMapped={false} transparent opacity={0.65} />
        </mesh>
      ))}
      {/* Blinking cursor */}
      <mesh ref={cursor} position={[-0.16, 0.28 - 0.02, 0.198]}>
        <planeGeometry args={[0.014, 0.018]} />
        <meshStandardMaterial color={C.screenGlow} emissive={C.screenGlow} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Soft phosphor glow onto the desk */}
      <pointLight ref={glow} position={[0, 0.3, 0.45]} intensity={0.3} distance={1.4} decay={0} color={C.screenGlow} />
    </group>
  );
}

export function Keyboard({ hovered }: { hovered: boolean }) {
  return (
    <group position={[0, 0.775, -0.98]} rotation={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.44, 0.03, 0.17]} />
        <meshStandardMaterial color={C.furniture} roughness={0.8} {...hl(hovered)} />
      </mesh>
      {[-0.05, -0.015, 0.02, 0.055].map((z, i) => (
        <mesh key={i} position={[0, 0.019, z]}>
          <boxGeometry args={[0.4 - i * 0.01, 0.012, 0.026]} />
          <meshStandardMaterial color="#b5ac93" roughness={0.85} {...hl(hovered)} />
        </mesh>
      ))}
      {/* Spacebar */}
      <mesh position={[0, 0.019, 0.078]}>
        <boxGeometry args={[0.2, 0.012, 0.02]} />
        <meshStandardMaterial color="#b5ac93" roughness={0.85} {...hl(hovered)} />
      </mesh>
    </group>
  );
}

export function Notebook({ hovered }: { hovered: boolean }) {
  return (
    <group position={[0.58, 0.77, -1.02]} rotation={[0, -0.28, 0]}>
      {/* Pages */}
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.165, 0.022, 0.225]} />
        <meshStandardMaterial color={C.paper} roughness={0.95} {...hl(hovered)} />
      </mesh>
      {/* Cover */}
      <mesh position={[0, 0.027, 0]}>
        <boxGeometry args={[0.172, 0.008, 0.232]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} {...hl(hovered)} />
      </mesh>
      {/* Elastic band */}
      <mesh position={[0.055, 0.02, 0]}>
        <boxGeometry args={[0.008, 0.026, 0.232]} />
        <meshStandardMaterial color="#1c2b21" roughness={0.8} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.13, 0.008, 0.06]} rotation={[Math.PI / 2, 0, 0.5]}>
        <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
        <meshStandardMaterial color="#23303f" roughness={0.5} {...hl(hovered)} />
      </mesh>
    </group>
  );
}

export function Mug({ hovered }: { hovered: boolean }) {
  return (
    <group position={[0.82, 0.795, -1.38]}>
      <mesh>
        <cylinderGeometry args={[0.042, 0.038, 0.1, 18]} />
        <meshStandardMaterial color={C.mug} roughness={0.6} {...hl(hovered)} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0, 0.046, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.036, 18]} />
        <meshStandardMaterial color="#3a2417" roughness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.048, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.026, 0.007, 8, 14, Math.PI]} />
        <meshStandardMaterial color={C.mug} roughness={0.6} {...hl(hovered)} />
      </mesh>
      {/* Green band */}
      <mesh position={[0, 0.028, 0]}>
        <cylinderGeometry args={[0.0425, 0.0425, 0.016, 18, 1, true]} />
        <meshStandardMaterial color={C.trim} roughness={0.6} {...hl(hovered)} />
      </mesh>
    </group>
  );
}

export function DeskPhone({ hovered }: { hovered: boolean }) {
  return (
    <group position={[-0.62, 0.77, -1.3]} rotation={[0, 0.18, 0]}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.23, 0.08, 0.18]} />
        <meshStandardMaterial color={C.phone} roughness={0.65} {...hl(hovered)} />
      </mesh>
      {/* Keypad */}
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <mesh key={i} position={[0.035 + col * 0.028, 0.082, -0.045 + row * 0.03]}>
            <boxGeometry args={[0.02, 0.008, 0.02]} />
            <meshStandardMaterial color={C.paper} roughness={0.8} />
          </mesh>
        );
      })}
      {/* Handset cradle + handset */}
      <group position={[-0.065, 0.1, 0]}>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.06, 0.025, 0.16]} />
          <meshStandardMaterial color={C.phone} roughness={0.65} {...hl(hovered)} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.05, 0.035, 0.2]} />
          <meshStandardMaterial color={C.phone} roughness={0.55} {...hl(hovered)} />
        </mesh>
        <mesh position={[0, 0.055, -0.09]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={C.phone} roughness={0.55} {...hl(hovered)} />
        </mesh>
        <mesh position={[0, 0.055, 0.09]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color={C.phone} roughness={0.55} {...hl(hovered)} />
        </mesh>
      </group>
    </group>
  );
}

export function Badge({ hovered }: { hovered: boolean }) {
  return (
    <group position={[-0.36, 0.772, -0.95]} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.004, 0]}>
        <boxGeometry args={[0.078, 0.006, 0.11]} />
        <meshStandardMaterial color={C.badge} roughness={0.5} {...hl(hovered)} />
      </mesh>
      {/* Photo */}
      <mesh position={[-0.015, 0.0085, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.032, 0.038]} />
        <meshStandardMaterial color={C.skin} roughness={0.8} />
      </mesh>
      {/* Green stripe */}
      <mesh position={[0, 0.0085, 0.042]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.078, 0.018]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} />
      </mesh>
      {/* Clip */}
      <mesh position={[0, 0.009, -0.052]}>
        <boxGeometry args={[0.024, 0.008, 0.012]} />
        <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Wall calendar pinned to the back partition. */
export function CalendarSheet({ hovered }: { hovered: boolean }) {
  return (
    <group position={[0.72, 1.26, -1.905]}>
      <mesh position={[0, 0, -0.004]}>
        <boxGeometry args={[0.31, 0.41, 0.012]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} {...hl(hovered)} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.28, 0.38]} />
        <meshStandardMaterial color={C.paper} roughness={0.95} {...hl(hovered)} />
      </mesh>
      {/* Month header */}
      <mesh position={[0, 0.155, 0.002]}>
        <planeGeometry args={[0.28, 0.07]} />
        <meshStandardMaterial color={C.carpet} roughness={0.9} />
      </mesh>
      {/* Grid lines */}
      {[0.06, 0.0, -0.06, -0.12].map((y) => (
        <mesh key={y} position={[0, y, 0.002]}>
          <planeGeometry args={[0.26, 0.003]} />
          <meshStandardMaterial color="#b9b09a" />
        </mesh>
      ))}
      {[-0.09, -0.045, 0, 0.045, 0.09].map((x) => (
        <mesh key={x} position={[x, -0.035, 0.0015]}>
          <planeGeometry args={[0.003, 0.2]} />
          <meshStandardMaterial color="#b9b09a" />
        </mesh>
      ))}
      {/* Circled date */}
      <mesh position={[0.045, -0.03, 0.003]}>
        <ringGeometry args={[0.014, 0.018, 16]} />
        <meshStandardMaterial color={C.accent} />
      </mesh>
    </group>
  );
}

export function FilingCabinet({ hovered }: { hovered: boolean }) {
  return (
    <group position={[-1.32, 0, -1.5]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.5, 1.1, 0.6]} />
        <meshStandardMaterial color="#aab29b" roughness={0.6} metalness={0.15} {...hl(hovered)} />
      </mesh>
      {[0.28, 0.62, 0.96].map((y) => (
        <group key={y} position={[0, y, 0.305]}>
          <mesh>
            <boxGeometry args={[0.44, 0.28, 0.015]} />
            <meshStandardMaterial color="#b7bfa8" roughness={0.55} metalness={0.15} {...hl(hovered)} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.06, 0.02]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color={C.metal} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Label holder */}
          <mesh position={[0, -0.02, 0.012]}>
            <planeGeometry args={[0.07, 0.03]} />
            <meshStandardMaterial color={C.paper} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
