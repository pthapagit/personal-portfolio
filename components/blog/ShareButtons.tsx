"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); ignore.
    }
  }

  const base =
    "rounded-md border border-ink/20 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft transition hover:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
        Share
      </span>
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on LinkedIn`}
        className={base}
      >
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={base}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
