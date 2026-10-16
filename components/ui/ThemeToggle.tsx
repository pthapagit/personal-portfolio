"use client";

import { setTheme, useTheme } from "@/lib/useTheme";

/**
 * Day shift / Night shift toggle. Reads + writes the theme via the shared
 * useTheme store, which keeps every mounted toggle (and the 3D scene) in sync.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useTheme() === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to day shift (light theme)" : "Switch to night shift (dark theme)"}
      className={className}
    >
      <span suppressHydrationWarning>{isDark ? "Day shift" : "Night shift"}</span>
    </button>
  );
}
