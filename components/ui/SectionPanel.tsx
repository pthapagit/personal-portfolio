"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sections } from "@/content";
import type { SectionId } from "@/content/types";
import { usePortfolioStore } from "@/lib/store";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { getSectionContent } from "./sectionContent";

/** Manila-folder styled document panel for a focused section. */
export default function SectionPanel({ section }: { section: SectionId }) {
  const closeSection = usePortfolioStore((s) => s.closeSection);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = sections.find((s) => s.id === section)!;

  useFocusTrap(dialogRef, closeRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSection]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={meta.label}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 26, rotate: -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto fixed inset-x-4 bottom-6 top-auto z-40 mx-auto max-h-[72vh] w-auto max-w-xl overflow-hidden rounded-sm border border-ink/25 bg-paper text-ink shadow-2xl md:right-10 md:left-auto md:top-1/2 md:bottom-auto md:w-[30rem] md:-translate-y-1/2"
    >
      {/* Folder tab header */}
      <div className="flex items-center justify-between border-b border-ink/20 bg-paper-dark px-5 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
            File · {meta.object}
          </p>
          <h2 className="font-semibold uppercase tracking-widest">{meta.label}</h2>
        </div>
        <button
          ref={closeRef}
          onClick={closeSection}
          className="rounded-sm border border-ink/30 px-2.5 py-1 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper focus:outline-2 focus:outline-office-green"
          aria-label={`Close ${meta.label}`}
        >
          Close
        </button>
      </div>
      <div className="max-h-[58vh] overflow-y-auto px-5 py-4 text-[15px] leading-relaxed">
        {getSectionContent(section)}
      </div>
      <div className="border-t border-ink/15 bg-paper-dark px-5 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
        Personnel file · read only
      </div>
    </motion.div>
  );
}
