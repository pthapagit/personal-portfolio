/**
 * Convert Markdown source to a rough plain-text string.
 * Used for reading-time estimates and excerpt generation (not for rendering —
 * see components/blog/MarkdownView.tsx for safe rendering).
 */
export function stripMarkdown(md: string): string {
  return (
    md
      // images: ![alt](url) -> (dropped)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      // links: [text](url) -> text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // backticks (inline + fenced markers)
      .replace(/`+/g, "")
      // heading markers at line start
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      // blockquote markers
      .replace(/^\s*>\s?/gm, "")
      // horizontal rules
      .replace(/^\s*([-*_]\s*){3,}$/gm, "")
      // list markers (-, *, +, 1.)
      .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
      // emphasis / strikethrough markers
      .replace(/(\*\*|\*|__|_|~~)/g, "")
      // collapse all whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
