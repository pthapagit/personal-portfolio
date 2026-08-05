"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { C } from "./palette";
import { CORRIDOR, ROOM } from "@/lib/sceneConfig";
import Hotspot from "./Hotspot";

const { width: RW, depth: RD, height: RH } = ROOM;
const { width: CW, height: CH, zStart: CZ0, zEnd: CZ1 } = CORRIDOR;
const CLEN = CZ1 - CZ0;
const CMID = (CZ0 + CZ1) / 2;

export default function Room() {
  return (
    <group>
      <Office />
      <Corridor />
      <WallClock />
      <BlogWindow />
      <Poster />
    </group>
  );
}

function Office() {
  return (
    <group>
      {/* Carpet */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[RW, RD]} />
        <meshStandardMaterial color={C.carpet} roughness={1} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, RH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[RW, RD]} />
        <meshStandardMaterial color={C.ceiling} roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, RH / 2, -RD / 2]}>
        <boxGeometry args={[RW, RH, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-RW / 2, RH / 2, 0]}>
        <boxGeometry args={[0.12, RH, RD]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.9} />
      </mesh>
      <mesh position={[RW / 2, RH / 2, 0]}>
        <boxGeometry args={[0.12, RH, RD]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.9} />
      </mesh>
      {/* Front wall with doorway to the corridor */}
      <FrontWall />
      {/* Baseboard along back wall */}
      <mesh position={[0, 0.06, -RD / 2 + 0.075]}>
        <boxGeometry args={[RW, 0.12, 0.03]} />
        <meshStandardMaterial color={C.trim} roughness={0.8} />
      </mesh>
      {/* Ceiling light fixtures (visual panels; actual lights in Lighting) */}
      <LightFixture position={[0, RH - 0.011, -1.8]} size={[2.4, 1.1]} />
      <LightFixture position={[0, RH - 0.011, 1.6]} size={[2.4, 1.1]} />
      <Plant />
    </group>
  );
}

function FrontWall() {
  const doorW = CW;
  const doorH = 2.25;
  const sideW = (RW - doorW) / 2;
  return (
    <group>
      <mesh position={[-(doorW / 2 + sideW / 2), RH / 2, RD / 2]}>
        <boxGeometry args={[sideW, RH, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      <mesh position={[doorW / 2 + sideW / 2, RH / 2, RD / 2]}>
        <boxGeometry args={[sideW, RH, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      {/* Header above the doorway */}
      <mesh position={[0, doorH + (RH - doorH) / 2, RD / 2]}>
        <boxGeometry args={[doorW, RH - doorH, 0.12]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      {/* Door frame trim */}
      <mesh position={[-doorW / 2, doorH / 2, RD / 2]}>
        <boxGeometry args={[0.08, doorH, 0.2]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} />
      </mesh>
      <mesh position={[doorW / 2, doorH / 2, RD / 2]}>
        <boxGeometry args={[0.08, doorH, 0.2]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} />
      </mesh>
      <mesh position={[0, doorH, RD / 2]}>
        <boxGeometry args={[doorW + 0.08, 0.08, 0.2]} />
        <meshStandardMaterial color={C.trim} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Corridor() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0, CMID]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CW, CLEN]} />
        <meshStandardMaterial color={C.carpet} roughness={1} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, CH, CMID]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CW, CLEN]} />
        <meshStandardMaterial color={C.ceiling} roughness={0.95} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-CW / 2, CH / 2, CMID]}>
        <boxGeometry args={[0.12, CH, CLEN]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      <mesh position={[CW / 2, CH / 2, CMID]}>
        <boxGeometry args={[0.12, CH, CLEN]} />
        <meshStandardMaterial color={C.wall} roughness={0.9} />
      </mesh>
      {/* Baseboards */}
      <mesh position={[-CW / 2 + 0.075, 0.06, CMID]}>
        <boxGeometry args={[0.03, 0.12, CLEN]} />
        <meshStandardMaterial color={C.trim} roughness={0.8} />
      </mesh>
      <mesh position={[CW / 2 - 0.075, 0.06, CMID]}>
        <boxGeometry args={[0.03, 0.12, CLEN]} />
        <meshStandardMaterial color={C.trim} roughness={0.8} />
      </mesh>
      {/* Far end cap (fog swallows it) */}
      <mesh position={[0, CH / 2, CZ1]}>
        <boxGeometry args={[CW, CH, 0.12]} />
        <meshStandardMaterial color={C.wallDark} roughness={0.9} />
      </mesh>
      {/* Symmetric doors along the corridor */}
      {[7, 10.5, 14].map((z) => (
        <group key={z}>
          <CorridorDoor x={-CW / 2 + 0.07} z={z} side={1} />
          <CorridorDoor x={CW / 2 - 0.07} z={z} side={-1} />
        </group>
      ))}
      {/* Ceiling light fixtures */}
      {[5.6, 8.8, 12, 15.2].map((z) => (
        <LightFixture key={z} position={[0, CH - 0.011, z]} size={[0.8, 1.7]} />
      ))}
    </group>
  );
}

function CorridorDoor({ x, z, side }: { x: number; z: number; side: 1 | -1 }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[side * 0.015, 1.05, 0]}>
        <boxGeometry args={[0.04, 2.1, 0.95]} />
        <meshStandardMaterial color={C.door} roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[side * 0.05, 1.02, 0.32]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function LightFixture({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[size[0] + 0.12, size[1] + 0.12]} />
        <meshStandardMaterial color={C.metal} roughness={0.8} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color={C.fixture} emissive={C.fixture} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    </group>
  );
}

function WallClock() {
  const minuteRef = useRef<Group>(null);
  const secondRef = useRef<Group>(null);
  useFrame(() => {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes() + sec / 60;
    // Second hand ticks in discrete steps.
    if (secondRef.current) secondRef.current.rotation.z = -(sec / 60) * Math.PI * 2;
    if (minuteRef.current) minuteRef.current.rotation.z = -(min / 60) * Math.PI * 2;
  });
  const hour = new Date().getHours() % 12;
  return (
    <group position={[2.4, 2.3, -RD / 2 + 0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.035, 24]} />
        <meshStandardMaterial color={C.trim} roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.019]}>
        <cylinderGeometry args={[0.155, 0.155, 0.004, 24]} />
        <meshStandardMaterial color={C.paper} roughness={0.9} />
      </mesh>
      {/* Hour hand (static-ish) */}
      <group rotation={[0, 0, -(hour / 12) * Math.PI * 2]} position={[0, 0, 0.025]}>
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.012, 0.09, 0.004]} />
          <meshStandardMaterial color="#333127" />
        </mesh>
      </group>
      <group ref={minuteRef} position={[0, 0, 0.028]}>
        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[0.009, 0.13, 0.003]} />
          <meshStandardMaterial color="#333127" />
        </mesh>
      </group>
      <group ref={secondRef} position={[0, 0, 0.031]}>
        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[0.004, 0.13, 0.002]} />
          <meshStandardMaterial color={C.accent} />
        </mesh>
      </group>
    </group>
  );
}

/** The window opens the Blog section. */
function BlogWindow() {
  return (
    <Hotspot section="blog">
      {(hovered) => (
        <group position={[-2.4, 1.75, -RD / 2 + 0.07]}>
          <mesh>
            <boxGeometry args={[1.35, 1.55, 0.06]} />
            <meshStandardMaterial color={C.trim} roughness={0.6} />
          </mesh>
          {/* Pale glow of an outside that may or may not exist */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.2, 1.4]} />
            <meshStandardMaterial
              color="#e9f0ea"
              emissive="#e9f0ea"
              emissiveIntensity={hovered ? 1.15 : 0.85}
              toneMapped={false}
            />
          </mesh>
          {/* Blind slats */}
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0, 0.58 - i * 0.09, 0.05]}>
              <boxGeometry args={[1.22, 0.035, 0.008]} />
              <meshStandardMaterial
                color={C.furniture}
                emissive={hovered ? C.highlight : "#000000"}
                emissiveIntensity={hovered ? 0.25 : 0}
                roughness={0.85}
              />
            </mesh>
          ))}
          {/* Mullions */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.045, 1.4, 0.02]} />
            <meshStandardMaterial color={C.trim} roughness={0.6} />
          </mesh>
        </group>
      )}
    </Hotspot>
  );
}

function Poster() {
  return (
    <group position={[RW / 2 - 0.09, 1.8, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.85, 1.1, 0.03]} />
        <meshStandardMaterial color={C.trim} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.75, 1.0]} />
        <meshStandardMaterial color={C.paper} roughness={0.9} />
      </mesh>
      {/* Abstract "sunrise over fields" print: circle + bands */}
      <mesh position={[0, 0.22, 0.025]}>
        <circleGeometry args={[0.16, 24]} />
        <meshStandardMaterial color="#d9a441" roughness={0.9} />
      </mesh>
      {[-0.08, -0.16, -0.24].map((y, i) => (
        <mesh key={y} position={[0, y, 0.025]}>
          <planeGeometry args={[0.62, 0.05]} />
          <meshStandardMaterial color={i % 2 ? C.carpet : "#5d7a5f"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Plant() {
  return (
    <group position={[3.6, 0, -3.1]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.16, 0.13, 0.36, 14]} />
        <meshStandardMaterial color="#9c5f3f" roughness={0.9} />
      </mesh>
      {[0, 0.8, 1.6, 2.4, 3.2].map((a) => (
        <mesh
          key={a}
          position={[Math.sin(a) * 0.08, 0.62, Math.cos(a) * 0.08]}
          rotation={[Math.sin(a) * 0.35, a, Math.cos(a) * 0.35]}
        >
          <coneGeometry args={[0.09, 0.55, 6]} />
          <meshStandardMaterial color="#39543c" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
