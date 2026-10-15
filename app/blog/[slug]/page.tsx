import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabasePublicClient } from "@/lib/blog/supabase/public";
import { getPublishedPostBySlug, listPublishedPosts } from "@/lib/blog/posts";
import { PostArticle } from "@/components/blog/PostArticle";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { getSiteUrl } from "@/lib/site";

// Public, cacheable reads (anon client, no cookies). Refresh every 5 min.
export const revalidate = 300;

// Prerender published posts at build; new slugs render on demand, then cache.
export async function generateStaticParams() {
  const posts = await listPublishedPosts(createSupabasePublicClient());
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createSupabasePublicClient();
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
  const supabase = createSupabasePublicClient();
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

      <PostArticle
        title={post.title}
        publishedAt={post.published_at}
        readingMinutes={post.reading_minutes}
        coverImageUrl={post.cover_image_url}
        contentMd={post.content_md}
        tags={post.tags}
        font={post.font}
        footer={
          <div className="mt-8 border-t border-ink/10 pt-6">
            <ShareButtons url={shareUrl} title={post.title} />
          </div>
        }
      />
    </main>
  );
}
