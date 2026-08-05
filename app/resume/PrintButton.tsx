"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-ink/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper"
    >
      Print / Save PDF
    </button>
  );
}
