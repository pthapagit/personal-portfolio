import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { MarkdownView } from "@/components/blog/MarkdownView";
import { fontClass } from "@/lib/blog/fonts";

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface PostArticleProps {
  title: string;
  publishedAt: string | null;
  readingMinutes: number;
  coverImageUrl: string | null;
  contentMd: string;
  tags: string[];
  font: string | null;
  linkTags?: boolean;
  footer?: ReactNode;
}

/** The reader's view of a post — shared by the public page and the studio preview. */
export function PostArticle({
  title,
  publishedAt,
  readingMinutes,
  coverImageUrl,
  contentMd,
  tags,
  font,
  linkTags = true,
  footer,
}: PostArticleProps) {
  const tagClass =
    "rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft";

  return (
    <article className={`mt-5 ${fontClass(font)}`}>
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          {publishedAt ? <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> : null}
          <span aria-hidden>·</span>
          <span>{readingMinutes} min read</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">{title}</h1>
      </header>

      {coverImageUrl ? (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={coverImageUrl}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-a:text-office-green prose-img:rounded-lg">
        <MarkdownView>{contentMd}</MarkdownView>
      </div>

      {tags.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              {linkTags ? (
                <Link
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={`${tagClass} hover:text-ink`}
                >
                  {tag}
                </Link>
              ) : (
                <span className={tagClass}>{tag}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {footer}
    </article>
  );
}
