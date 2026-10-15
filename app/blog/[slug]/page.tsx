import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/blog/supabase/server";
import { getPublishedPostBySlug } from "@/lib/blog/posts";
import { MarkdownView } from "@/components/blog/MarkdownView";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const post = await getPublishedPostBySlug(supabase, slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const post = await getPublishedPostBySlug(supabase, slug);
  if (!post) notFound();

  const shareUrl = `${getSiteUrl()}/blog/${post.slug}`;

  return (
    <main>
      <Link
        href="/blog"
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
      >
        &larr; All posts
      </Link>

      <article className="mt-5">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
            {post.published_at ? (
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            ) : null}
            <span aria-hidden>·</span>
            <span>{post.reading_minutes} min read</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            {post.title}
          </h1>
        </header>

        {post.cover_image_url ? (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.cover_image_url}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-a:text-office-green prose-img:rounded-lg">
          <MarkdownView>{post.content_md}</MarkdownView>
        </div>

        {post.tags.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
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

        <div className="mt-8 border-t border-ink/10 pt-6">
          <ShareButtons url={shareUrl} title={post.title} />
        </div>
      </article>
    </main>
  );
}
