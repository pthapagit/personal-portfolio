"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, sections } from "@/content";
import { usePortfolioStore } from "@/lib/store";

/** Persistent overlay chrome for the 3D mode: badge, hover label, directory. */
export default function Hud({ onSwitchTo2D }: { onSwitchTo2D: () => void }) {
  const phase = usePortfolioStore((s) => s.phase);
  const hovered = usePortfolioStore((s) => s.hoveredSection);
  const focusSection = usePortfolioStore((s) => s.focusSection);
  const closeSection = usePortfolioStore((s) => s.closeSection);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const hasExplored = usePortfolioStore((s) => s.hasExplored);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hoveredMeta = hovered ? sections.find((s) => s.id === hovered) : null;

  // Escape closes menu or an open section panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) setMenuOpen(false);
      else if (activeSection) closeSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeSection, activeSection]);

  if (phase === "loading" || phase === "intro") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Employee badge, top-left */}
      <div className="absolute left-5 top-5 flex items-center gap-3 rounded-sm border border-ink/25 bg-paper/95 px-3 py-2 shadow-md">
        <div className="h-8 w-8 rounded-full bg-office-green/80" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ink">{profile.name}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">{profile.title}</p>
        </div>
      </div>

      {/* Hover label, bottom-center */}
      <AnimatePresence>
        {hoveredMeta && phase === "explore" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-sm border border-ink/25 bg-paper/95 px-4 py-1.5 text-center shadow-md"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">{hoveredMeta.object}</p>
            <p className="text-sm font-semibold uppercase tracking-widest text-ink">{hoveredMeta.label}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-visit hint */}
      <AnimatePresence>
        {phase === "explore" && !hasExplored && !hoveredMeta && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-ink/70"
          >
            Click the objects on the desk to explore
          </motion.p>
        )}
      </AnimatePresence>

      {/* Controls, bottom-right */}
      <div className="pointer-events-auto absolute bottom-5 right-5 flex flex-col items-end gap-2">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              role="menu"
              aria-label="Section directory"
              className="w-64 rounded-sm border border-ink/25 bg-paper/95 p-2 shadow-xl"
            >
              <p className="px-2 pb-1 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
                Floor directory
              </p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    focusSection(s.id);
                  }}
                  className="flex w-full items-baseline justify-between rounded-sm px-2 py-1.5 text-left hover:bg-office-green/15 focus:bg-office-green/15 focus:outline-none"
                >
                  <span className="text-sm font-medium text-ink">{s.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{s.object}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="rounded-sm border border-ink/30 bg-paper/95 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink shadow-md hover:bg-ink hover:text-paper focus:outline-2 focus:outline-office-green"
          >
            Directory
          </button>
          <button
            onClick={onSwitchTo2D}
            className="rounded-sm border border-ink/30 bg-paper/95 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink shadow-md hover:bg-ink hover:text-paper focus:outline-2 focus:outline-office-green"
          >
            2D view
          </button>
        </div>
      </div>
    </div>
  );
}
