"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/lib/store";
import EntryGate from "@/components/ui/EntryGate";
import Hud from "@/components/ui/Hud";
import IntroOverlay from "@/components/ui/IntroOverlay";
import SectionPanel from "@/components/ui/SectionPanel";
import Terminal from "@/components/ui/Terminal";

const OfficeScene = dynamic(() => import("@/components/scene/OfficeScene"), { ssr: false });

type Mode = "undecided" | "2d" | "3d";
const MODE_KEY = "portfolio-mode";

/** If the 3D scene throws (driver quirks, context loss), fall back to 2D. */
class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("3D scene failed:", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Orchestrates the whole experience. Receives the server-rendered 2D
 * directory as children (kept in the DOM for SEO), and mounts the 3D office
 * on capable devices.
 */
export default function Experience({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("undecided");
  const [entered, setEntered] = useState(false);
  const phase = usePortfolioStore((s) => s.phase);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const sceneReady = usePortfolioStore((s) => s.sceneReady);
  const startIntro = usePortfolioStore((s) => s.startIntro);
  const closeSection = usePortfolioStore((s) => s.closeSection);
  const setReducedMotion = usePortfolioStore((s) => s.setReducedMotion);

  // Decide the initial mode on the client (deferred a tick so hydration
  // completes with the server-rendered 2D markup before any switch).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => setReducedMotion(mq.matches);
    applyReduced();
    mq.addEventListener("change", applyReduced);

    const t = setTimeout(() => {
      const stored = localStorage.getItem(MODE_KEY);
      if (stored === "2d" || stored === "3d") {
        setMode(stored);
        return;
      }
      // Cheap checks only — the WebGL probe is deferred to the gate click.
      const capable = window.innerWidth >= 768 && !mq.matches;
      setMode(capable ? "3d" : "2d");
    }, 0);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", applyReduced);
    };
  }, [setReducedMotion]);

  // Kick off the intro once the canvas is live.
  useEffect(() => {
    if (mode === "3d" && sceneReady && phase === "loading") {
      const t = setTimeout(startIntro, 500);
      return () => clearTimeout(t);
    }
  }, [mode, sceneReady, phase, startIntro]);

  const choose = (m: Mode) => {
    localStorage.setItem(MODE_KEY, m);
    if (m === "2d") {
      closeSection();
      setEntered(false);
    }
    setMode(m);
  };

  const enter3D = () => {
    if (!webglAvailable()) {
      choose("2d");
      return;
    }
    choose("3d");
  };

  const in3D = mode === "3d";

  return (
    <>
      {/* Accessible escape hatch, first focusable element on the page */}
      <button
        onClick={() => (in3D ? choose("2d") : enter3D())}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:border focus:border-ink focus:bg-paper focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        {in3D ? "Switch to text version" : "Switch to 3D office"}
      </button>

      {/* Server-rendered 2D directory: visible in 2d/undecided, kept for crawlers otherwise */}
      <div hidden={in3D} aria-hidden={in3D}>
        {children}
        {mode === "2d" && (
          <div className="fixed bottom-5 right-5 z-20">
            <button
              onClick={enter3D}
              className="rounded-sm border border-ink/30 bg-paper px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink shadow-md hover:bg-ink hover:text-paper"
            >
              Enter the 3D office
            </button>
          </div>
        )}
      </div>

      {in3D && (
        <AnimatePresence>
          {!entered && (
            <EntryGate
              key="gate"
              onEnter={() => (webglAvailable() ? setEntered(true) : choose("2d"))}
              onSwitchTo2D={() => choose("2d")}
            />
          )}
        </AnimatePresence>
      )}

      {in3D && entered && (
        <>
          <SceneErrorBoundary onError={() => choose("2d")}>
            <OfficeScene />
          </SceneErrorBoundary>
          <IntroOverlay />
          <Hud onSwitchTo2D={() => choose("2d")} />
          <AnimatePresence>
            {activeSection === "about" && <Terminal key="terminal" />}
            {activeSection && activeSection !== "about" && <SectionPanel key={activeSection} section={activeSection} />}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
