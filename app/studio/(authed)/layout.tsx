import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/blog/auth";
import { logoutAction } from "@/app/studio/actions";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function StudioAuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/15 bg-paper-dark">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="font-mono text-sm font-semibold uppercase tracking-[0.2em]"
            >
              Studio
            </Link>
            <Link
              href="/studio/new"
              className="rounded-md bg-office-green px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-paper"
            >
              New post
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
            >
              View blog
            </Link>
            <span className="hidden font-mono text-xs text-ink-soft sm:inline">
              {user.email}
            </span>
            <Link
              href="/studio/password"
              className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
            >
              Password
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
