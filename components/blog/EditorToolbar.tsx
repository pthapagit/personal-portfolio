"use client";

import { EmojiPicker } from "@/components/blog/EmojiPicker";
import type { FormatAction } from "@/lib/blog/editor-format";

const TOOLS: { action: FormatAction; label: string; icon: string; className?: string }[] = [
  { action: "h2", label: "Heading", icon: "H", className: "font-bold text-base" },
  { action: "h3", label: "Subheading", icon: "H", className: "font-semibold text-xs" },
  { action: "bold", label: "Bold", icon: "B", className: "font-bold" },
  { action: "italic", label: "Italic", icon: "I", className: "italic font-serif" },
  { action: "strike", label: "Strikethrough", icon: "S", className: "line-through" },
  { action: "quote", label: "Quote", icon: "\u201C" },
  { action: "bullet", label: "Bulleted list", icon: "\u2022" },
  { action: "numbered", label: "Numbered list", icon: "1." },
  { action: "link", label: "Link", icon: "\uD83D\uDD17" },
];

export function EditorToolbar({
  onFormat,
  onInsert,
}: {
  onFormat: (action: FormatAction) => void;
  onInsert: (text: string) => void;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-ink/20 bg-paper-dark/40 px-1 py-1"
    >
      {TOOLS.map((tool) => (
        <button
          key={tool.action}
          type="button"
          aria-label={tool.label}
          title={tool.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onFormat(tool.action)}
          className={`flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-sm text-ink hover:bg-ink/10 ${tool.className ?? ""}`}
        >
          {tool.icon}
        </button>
      ))}
      <span aria-hidden className="mx-1 h-5 w-px bg-ink/15" />
      <EmojiPicker onSelect={onInsert} />
    </div>
  );
}
