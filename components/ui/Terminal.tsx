"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BOOT_LINES, runCommand } from "@/lib/terminal";
import { usePortfolioStore } from "@/lib/store";
import { useFocusTrap } from "@/lib/useFocusTrap";

/**
 * Green-phosphor CRT terminal shown when the monitor is focused.
 * Commands: HELP, ABOUT, PROJECTS, SKILLS, RESUME, CONTACT, CLEAR, ASK, EXIT…
 */
export default function Terminal() {
  const closeSection = usePortfolioStore((s) => s.closeSection);
  const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

  const [lines, setLines] = useState<string[]>(() => (reducedMotion ? BOOT_LINES : []));
  const [pending, setPending] = useState<string[]>(() => (reducedMotion ? [] : BOOT_LINES));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [busy, setBusy] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useFocusTrap(dialogRef, inputRef);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  // Line-by-line typewriter reveal of pending output.
  useEffect(() => {
    if (pending.length === 0) return;
    const t = setTimeout(
      () => {
        if (reducedMotion) {
          setLines((l) => [...l, ...pending]);
          setPending([]);
        } else {
          setLines((l) => [...l, pending[0]]);
          setPending((p) => p.slice(1));
        }
      },
      reducedMotion ? 0 : 45
    );
    return () => clearTimeout(t);
  }, [pending, reducedMotion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, pending.length]);

  // Keep the (hidden) input focused whenever the terminal is idle so typing
  // always registers, including right after the boot text finishes.
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy, pending.length]);

  const submit = useCallback(async () => {
    if (busy || pending.length > 0) return;
    const cmd = input;
    setInput("");
    setHistoryIdx(-1);
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 30));
    setLines((l) => [...l, `PT> ${cmd}`]);
    setBusy(true);
    try {
      const result = await runCommand(cmd);
      if (!mountedRef.current) return;
      if (result.action === "clear") {
        setLines([]);
        setPending([]);
        return;
      }
      setPending((p) => [...p, ...result.lines, ""]);
      if (result.action === "exit") {
        exitTimerRef.current = setTimeout(closeSection, reducedMotion ? 100 : 700);
      }
    } catch {
      if (!mountedRef.current) return;
      setPending((p) => [...p, "COMMAND FAILED.", ""]);
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, [busy, pending.length, input, closeSection, reducedMotion]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      void submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIdx - 1;
      setHistoryIdx(next < 0 ? -1 : next);
      setInput(next < 0 ? "" : history[next]);
    }
  };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Personnel terminal"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
      transition={{ duration: reducedMotion ? 0.1 : 0.4 }}
      className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center p-4"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="crt relative flex h-[min(34rem,86vh)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border-[10px] border-[#494538] bg-[#03130a] shadow-[0_0_80px_rgba(99,232,150,0.15),0_25px_60px_rgba(0,0,0,0.5)]">
        {/* Screen curvature vignette + scanlines via CSS */}
        <div className="crt-overlay pointer-events-none absolute inset-0 z-10" aria-hidden="true" />

        <div className="flex items-center justify-between border-b border-[#63e89633] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-terminal/70">
          <span>PT-OS · Personnel Terminal</span>
          <button
            onClick={closeSection}
            className="pointer-events-auto relative z-20 border border-terminal/40 px-2 py-0.5 tracking-widest text-terminal hover:bg-terminal hover:text-black focus:outline-2 focus:outline-terminal"
          >
            EXIT
          </button>
        </div>

        <div
          ref={scrollRef}
          className="relative z-20 flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-terminal"
          style={{ textShadow: "0 0 6px rgba(99,232,150,0.55)" }}
        >
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {l || "\u00A0"}
            </div>
          ))}
          {pending.length === 0 && !busy && (
            <div className="flex items-center whitespace-pre">
              <span>PT&gt; </span>
              <span>{input}</span>
              <span className="terminal-caret" aria-hidden="true" />
            </div>
          )}
          {busy && <div className="animate-pulse">…</div>}
          {/* Always mounted so keystrokes register even during output */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="absolute h-0 w-0 opacity-0"
            aria-label="Terminal command input"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="border-t border-[#63e89633] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-terminal/50">
          Type HELP for commands · ESC to exit
        </div>
      </div>
    </motion.div>
  );
}
