import { slugify, uniqueSlug } from "./slug";
import { readingMinutes } from "./reading-time";
import { makeExcerpt } from "./excerpt";
import type { PostDraftParsed } from "./schema";

export interface BuiltPost {
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  reading_minutes: number;
  published_at: string | null;
}

/**
 * Turn a validated editor draft into the full database record, computing slug
 * (unique, stable across edits), reading time, excerpt, and publish timestamp.
 * Pure so the save Server Action stays a thin, well-tested wrapper.
 */
export function buildPostRecord(opts: {
  draft: PostDraftParsed;
  takenSlugs?: string[];
  currentSlug?: string | null;
  currentPublishedAt?: string | null;
  now?: Date;
}): BuiltPost {
  const {
    draft,
    takenSlugs = [],
    currentSlug = null,
    currentPublishedAt = null,
    now = new Date(),
  } = opts;

  const base =
    draft.slug && draft.slug.trim().length > 0
      ? slugify(draft.slug)
      : slugify(draft.title);

  let slug: string;
  if (currentSlug && currentSlug === base) {
    // Editing without changing the slug — keep it stable.
    slug = currentSlug;
  } else {
    // Exclude the post's own current slug from the taken set.
    slug = uniqueSlug(
      base,
      takenSlugs.filter((s) => s !== currentSlug),
    );
  }

  const excerpt =
    draft.excerpt && draft.excerpt.trim().length > 0
      ? draft.excerpt.trim()
      : makeExcerpt(draft.content_md);

  const published_at =
    draft.status === "published"
      ? currentPublishedAt ?? now.toISOString()
      : null;

  return {
    slug,
    title: draft.title.trim(),
    excerpt,
    content_md: draft.content_md,
    cover_image_url: draft.cover_image_url ?? null,
    tags: draft.tags,
    status: draft.status,
    reading_minutes: readingMinutes(draft.content_md),
    published_at,
  };
}
