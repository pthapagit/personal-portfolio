"use client";

import { useState, type ReactNode } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { usePortfolioStore } from "@/lib/store";
import type { SectionId } from "@/content/types";

interface HotspotProps {
  section: SectionId;
  children: (hovered: boolean) => ReactNode;
}

/**
 * Wraps a scene object and makes it clickable. Provides hover state to its
 * children (render prop) so each object can brighten itself, and reports the
 * hovered section to the HUD label.
 */
export default function Hotspot({ section, children }: HotspotProps) {
  const [hovered, setHovered] = useState(false);
  const phase = usePortfolioStore((s) => s.phase);
  const focusSection = usePortfolioStore((s) => s.focusSection);
  const setHoveredSection = usePortfolioStore((s) => s.setHovered);

  const interactive = phase === "explore";
  useCursor(hovered && interactive);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    setHovered(false);
    setHoveredSection(null);
    focusSection(section);
  };

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    setHovered(true);
    setHoveredSection(section);
  };

  const onOut = () => {
    setHovered(false);
    setHoveredSection(null);
  };

  return (
    <group onClick={onClick} onPointerOver={onOver} onPointerOut={onOut}>
      {children(hovered && interactive)}
    </group>
  );
}
