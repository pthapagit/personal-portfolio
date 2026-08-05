"use client";

import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/content";
import { usePortfolioStore } from "@/lib/store";

/** Loading card, cinematic letterbox bars and the skip control. */
export default function IntroOverlay() {
  const phase = usePortfolioStore((s) => s.phase);
  const sceneReady = usePortfolioStore((s) => s.sceneReady);
  const finishIntro = usePortfolioStore((s) => s.finishIntro);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loading"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-paper"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full border-[3px] border-office-green" aria-hidden="true" />
            <h1 className="text-lg font-semibold uppercase tracking-[0.35em] text-ink">{profile.name}</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-soft">{profile.title}</p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-soft" role="status">
            {sceneReady ? "Opening the floor…" : "Preparing your desk…"}
          </p>
        </motion.div>
      )}

      {phase === "intro" && (
        <motion.div key="intro" className="pointer-events-none fixed inset-0 z-40" exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          {/* Letterbox bars */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "9vh" }}
            transition={{ duration: 1.2 }}
            className="absolute inset-x-0 top-0 bg-black/90"
          />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "9vh" }}
            transition={{ duration: 1.2 }}
            className="absolute inset-x-0 bottom-0 bg-black/90"
          />
          {/* Title card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5, times: [0, 0.2, 0.75, 1] }}
            className="absolute inset-x-0 top-[16vh] text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-ink-soft">A portfolio by</p>
            <p className="mt-1 text-2xl font-semibold uppercase tracking-[0.3em] text-ink">{profile.name}</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={finishIntro}
            className="pointer-events-auto absolute bottom-[11vh] right-6 rounded-sm border border-paper/50 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-paper hover:text-ink focus:outline-2 focus:outline-office-green"
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
