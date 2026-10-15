import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { listAllPosts } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function StudioHomePage() {
  const supabase = await createSupabaseServerClient();
  const posts = await listAllPosts(supabase);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold uppercase tracking-[0.15em]">
        Your posts
      </h1>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 p-10 text-center">
          <p className="text-ink-soft">No posts yet.</p>
          <Link
            href="/studio/new"
            className="mt-3 inline-block rounded-md bg-office-green px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-ink/10 rounded-lg border border-ink/10">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/studio/${post.id}/edit`}
                className="flex flex-col gap-1 px-4 py-4 transition hover:bg-paper-dark/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
                      post.status === "published"
                        ? "bg-office-green/15 text-office-green"
                        : "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="font-medium">{post.title}</span>
                </span>
                <span className="font-mono text-xs text-ink-soft">
                  {post.published_at
                    ? formatDate(post.published_at)
                    : `edited ${formatDate(post.updated_at)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
