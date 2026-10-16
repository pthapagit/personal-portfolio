import type { ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/content";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15 bg-paper-dark">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-5">
          <Link
            href="/blog"
            className="font-mono text-sm font-semibold uppercase tracking-[0.25em]"
          >
            {profile.name.split(" ")[0]}&rsquo;s Blog
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline" />
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 pb-24 pt-8">{children}</div>

      <footer className="border-t border-ink/15 bg-paper-dark py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        &copy; {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  );
}
