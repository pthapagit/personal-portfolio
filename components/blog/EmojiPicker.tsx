"use client";

import { useEffect, useRef, useState } from "react";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  { label: "Smileys", emojis: ["😀", "😄", "😊", "🙂", "😉", "😍", "🤩", "😎", "🤔", "😅", "😂", "🥲", "😢", "😮", "😴", "🙃"] },
  { label: "Gestures", emojis: ["👋", "👍", "👏", "🙌", "🙏", "💪", "✌️", "🤝", "👀", "❤️", "🔥", "✨", "🎉", "💯", "✅", "⭐"] },
  { label: "Travel", emojis: ["✈️", "🌍", "🗺️", "🧳", "🏔️", "🏖️", "🏕️", "🌅", "🚆", "🚗", "🗼", "🏛️", "⛩️", "🌸", "🌊", "☀️"] },
  { label: "Reading", emojis: ["📚", "📖", "🔖", "✍️", "📝", "💡", "🧠", "☕", "🍵", "🎧", "📌", "🗒️", "💭", "🖋️", "📷", "🎬"] },
];

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Insert emoji"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-base hover:bg-ink/10"
      >
        😊
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Emoji picker"
          className="absolute right-0 z-20 mt-1 max-h-72 w-[17rem] overflow-y-auto rounded-md border border-ink/15 bg-paper p-2 shadow-lg"
        >
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className="mb-2 last:mb-0">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {group.label}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={emoji}
                    onClick={() => {
                      onSelect(emoji);
                      setOpen(false);
                    }}
                    className="flex h-8 items-center justify-center rounded text-lg hover:bg-ink/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
