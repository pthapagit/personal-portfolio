import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { listPublishedPosts } from "@/lib/blog/posts";
import { PostCard } from "@/components/blog/PostCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on what I read, where I go, and what I'm thinking about.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const all = await listPublishedPosts(supabase);
  const tags = Array.from(new Set(all.flatMap((p) => p.tags))).sort();
  const posts = tag ? all.filter((p) => p.tags.includes(tag)) : all;

  return (
    <main>
      <h1 className="text-3xl font-semibold uppercase tracking-[0.15em]">Blog</h1>
      <p className="mt-2 text-ink-soft">
        Notes on what I read, where I go, and what I&rsquo;m thinking about.
      </p>

      {tags.length > 0 ? (
        <nav aria-label="Filter by tag" className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] ${
              tag
                ? "bg-ink/5 text-ink-soft hover:text-ink"
                : "bg-office-green text-paper"
            }`}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] ${
                tag === t
                  ? "bg-office-green text-paper"
                  : "bg-ink/5 text-ink-soft hover:text-ink"
              }`}
            >
              {t}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="mt-6">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">
            {tag ? `No posts tagged "${tag}" yet.` : "No posts yet. Check back soon."}
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  );
}
