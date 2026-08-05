"use client";

import { motion } from "framer-motion";
import { profile } from "@/content";

/**
 * Pre-office cover screen. The 3D scene (and its WebGL cost) only loads after
 * this deliberate gesture — keeps initial page load feather-light.
 */
export default function EntryGate({ onEnter, onSwitchTo2D }: { onEnter: () => void; onSwitchTo2D: () => void }) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-paper px-6 text-center"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 rounded-full border-[3px] border-office-green" aria-hidden="true" />
        <h1 className="text-lg font-semibold uppercase tracking-[0.35em] text-ink">{profile.name}</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">{profile.title}</p>
      </div>

      <p className="max-w-sm font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-ink-soft">
        The office is quiet. The fluorescents hum. Your visitor badge is ready.
      </p>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onEnter}
          className="rounded-sm border-2 border-office-green bg-office-green px-6 py-2.5 font-mono text-sm uppercase tracking-[0.25em] text-paper shadow-md transition-colors hover:bg-paper hover:text-office-green focus:outline-2 focus:outline-offset-2 focus:outline-office-green"
        >
          Report to your desk
        </button>
        <button
          onClick={onSwitchTo2D}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          Prefer the plain-paper version?
        </button>
      </div>
    </motion.div>
  );
}
