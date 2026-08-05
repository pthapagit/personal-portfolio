"use client";

import { C } from "./palette";
import Hotspot from "./Hotspot";
import Engineer from "./Engineer";
import {
  Badge,
  CalendarSheet,
  DeskPhone,
  FilingCabinet,
  Keyboard,
  Monitor,
  Mug,
  Notebook,
} from "./DeskObjects";

export default function Cubicle() {
  return (
    <group>
      <Partitions />
      <Desk />
      <Engineer />

      <Hotspot section="about">{(h) => <Monitor hovered={h} />}</Hotspot>
      <Hotspot section="skills">{(h) => <Keyboard hovered={h} />}</Hotspot>
      <Hotspot section="resume">{(h) => <Notebook hovered={h} />}</Hotspot>
      <Hotspot section="projects">{(h) => <Mug hovered={h} />}</Hotspot>
      <Hotspot section="contact">{(h) => <DeskPhone hovered={h} />}</Hotspot>
      <Hotspot section="certifications">{(h) => <Badge hovered={h} />}</Hotspot>
      <Hotspot section="timeline">{(h) => <CalendarSheet hovered={h} />}</Hotspot>
      <Hotspot section="experience">{(h) => <FilingCabinet hovered={h} />}</Hotspot>
    </group>
  );
}

function Desk() {
  return (
    <group>
      {/* Desktop */}
      <mesh position={[0, 0.745, -1.2]}>
        <boxGeometry args={[1.9, 0.05, 0.85]} />
        <meshStandardMaterial color={C.wood} roughness={0.6} />
      </mesh>
      {/* Side panels (mid-century style) */}
      <mesh position={[-0.9, 0.36, -1.2]}>
        <boxGeometry args={[0.05, 0.72, 0.75]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 0.36, -1.2]}>
        <boxGeometry args={[0.05, 0.72, 0.75]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      {/* Modesty panel */}
      <mesh position={[0, 0.45, -1.52]}>
        <boxGeometry args={[1.8, 0.55, 0.03]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.7} />
      </mesh>
      {/* Small drawer unit under right side */}
      <mesh position={[0.6, 0.55, -1.25]}>
        <boxGeometry args={[0.45, 0.32, 0.6]} />
        <meshStandardMaterial color={C.wood} roughness={0.65} />
      </mesh>
      <mesh position={[0.6, 0.55, -0.945]}>
        <boxGeometry args={[0.38, 0.24, 0.015]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.65} />
      </mesh>
      <mesh position={[0.6, 0.6, -0.93]}>
        <boxGeometry args={[0.1, 0.02, 0.02]} />
        <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Partitions() {
  const h = 1.42;
  return (
    <group>
      {/* Back panel */}
      <PartitionPanel position={[0, h / 2, -1.95]} size={[3.4, h, 0.06]} />
      {/* Side panels */}
      <PartitionPanel position={[-1.68, h / 2, -0.85]} size={[0.06, h, 2.26]} />
      <PartitionPanel position={[1.68, h / 2, -0.85]} size={[0.06, h, 2.26]} />
    </group>
  );
}

function PartitionPanel({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  const [w, h, d] = size;
  const capSize: [number, number, number] = [w + 0.06, 0.05, d + 0.06];
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={C.partition} roughness={0.95} />
      </mesh>
      {/* Fabric inset */}
      <mesh scale={[w > d ? 0.96 : 1.05, 0.88, w > d ? 1.05 : 0.96]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#c9bfa4" roughness={1} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, h / 2 + 0.025, 0]}>
        <boxGeometry args={capSize} />
        <meshStandardMaterial color={C.partitionTrim} roughness={0.7} />
      </mesh>
    </group>
  );
}
