import { stripMarkdown } from "./markdown";

/** Estimate reading time in whole minutes (minimum 1) at the given words/min. */
export function readingMinutes(markdown: string, wpm = 200): number {
  const text = stripMarkdown(markdown);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / wpm));
}
