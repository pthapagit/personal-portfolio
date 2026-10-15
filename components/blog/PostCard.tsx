import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog/types";

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group border-b border-ink/10 py-6 last:border-0">
      {post.cover_image_url ? (
        <Link href={href} className="mb-3 block overflow-hidden rounded-lg">
          <div className="relative aspect-video w-full">
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
        {post.published_at ? (
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        ) : null}
        <span aria-hidden>·</span>
        <span>{post.reading_minutes} min read</span>
      </div>

      <h2 className="mt-1 text-xl font-semibold">
        <Link href={href} className="underline-offset-4 hover:underline">
          {post.title}
        </Link>
      </h2>

      {post.excerpt ? <p className="mt-2 text-ink-soft">{post.excerpt}</p> : null}

      {post.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft hover:text-ink"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
