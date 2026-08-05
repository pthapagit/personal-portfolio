"use client";

import { create } from "zustand";
import type { SectionId } from "@/content/types";

type ScenePhase = "loading" | "intro" | "explore" | "focus";

interface PortfolioState {
  phase: ScenePhase;
  activeSection: SectionId | null;
  hoveredSection: SectionId | null;
  reducedMotion: boolean;
  sceneReady: boolean;
  /** True once the visitor has opened any section. */
  hasExplored: boolean;

  setSceneReady: () => void;
  startIntro: () => void;
  finishIntro: () => void;
  focusSection: (id: SectionId) => void;
  closeSection: () => void;
  setHovered: (id: SectionId | null) => void;
  setReducedMotion: (v: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  phase: "loading",
  activeSection: null,
  hoveredSection: null,
  reducedMotion: false,
  sceneReady: false,
  hasExplored: false,

  setSceneReady: () => set({ sceneReady: true }),
  startIntro: () => set({ phase: "intro" }),
  finishIntro: () => set({ phase: "explore" }),
  focusSection: (id) => set({ phase: "focus", activeSection: id, hoveredSection: null, hasExplored: true }),
  closeSection: () => set({ phase: "explore", activeSection: null }),
  setHovered: (id) => set({ hoveredSection: id }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
