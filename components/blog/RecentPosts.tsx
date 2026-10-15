import Link from "next/link";
import { createSupabasePublicClient } from "@/lib/blog/supabase/public";
import { listPublishedPosts } from "@/lib/blog/posts";
import type { Post } from "@/lib/blog/types";

/**
 * Reusable "latest writing" widget. Drop it anywhere (portfolio home, a desk
 * panel, etc.). Reads published posts anonymously and fails soft (renders a
 * simple link) if the blog isn't configured yet.
 */
export async function RecentPosts({
  limit = 3,
  heading = "Latest writing",
}: {
  limit?: number;
  heading?: string;
}) {
  let recent: Post[] = [];
  try {
    const supabase = createSupabasePublicClient();
    const posts = await listPublishedPosts(supabase);
    recent = posts.slice(0, limit);
  } catch {
    recent = [];
  }

  return (
    <div>
      {heading ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          {heading}
        </p>
      ) : null}

      {recent.length === 0 ? (
        <p className="mt-2 text-ink-soft">
          No posts yet.{" "}
          <Link href="/blog" className="underline underline-offset-4">
            Visit the blog
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-2 flex flex-col gap-3">
          {recent.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-0.5"
              >
                <span className="font-medium underline-offset-4 group-hover:underline">
                  {post.title}
                </span>
                {post.excerpt ? (
                  <span className="text-sm text-ink-soft">{post.excerpt}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/blog"
        className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-office-green underline-offset-4 hover:underline"
      >
        Read the blog &rarr;
      </Link>
    </div>
  );
}
