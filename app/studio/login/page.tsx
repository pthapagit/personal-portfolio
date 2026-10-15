import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Studio login",
  robots: { index: false, follow: false },
};

export default function StudioLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-16">
      <div className="w-full max-w-sm rounded-xl border border-ink/15 bg-paper-dark p-6 shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink-soft">
          Writing desk
        </p>
        <h1 className="mt-1 mb-6 text-2xl font-semibold uppercase tracking-[0.15em] text-ink">
          Studio login
        </h1>
        <LoginForm />
        <Link
          href="/blog"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Back to the blog
        </Link>
      </div>
    </main>
  );
}
