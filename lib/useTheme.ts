"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_EVENT = "themechange";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

// Read the live theme straight from the DOM — the inline script in
// app/layout.tsx has already resolved the OS preference into data-theme.
function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

/** The current theme, reactive to the toggle and OS-preference changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Set + persist the theme and notify every mounted consumer. */
export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Private mode / blocked storage — the in-memory switch still works.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
