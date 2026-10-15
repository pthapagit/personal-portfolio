import { stripMarkdown } from "./markdown";

/**
 * Build a plain-text excerpt from Markdown, truncated on a word boundary and
 * suffixed with an ellipsis when shortened.
 */
export function makeExcerpt(markdown: string, maxLength = 160): string {
  const text = stripMarkdown(markdown);
  if (text.length <= maxLength) return text;

  let out = "";
  for (const word of text.split(" ")) {
    const candidate = out ? `${out} ${word}` : word;
    if (candidate.length > maxLength) break;
    out = candidate;
  }
  // Degenerate case: a single word longer than maxLength.
  if (!out) out = text.slice(0, maxLength);
  return `${out}\u2026`;
}
