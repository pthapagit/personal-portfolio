import { z } from "zod";
import { POST_FONTS } from "./fonts";

/** Normalize a comma-separated tag string into clean, de-duped, lowercase tags. */
export function parseTagsInput(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const tag = raw.trim().toLowerCase();
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

// Upper bounds to keep stored records sane (the editor is admin-only, so these
// are robustness guards rather than a security boundary).
export const MAX_TITLE_LENGTH = 200;
export const MAX_SLUG_LENGTH = 200;
export const MAX_EXCERPT_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 100_000;
export const MAX_TAG_LENGTH = 50;

/** Validation schema for the post editor payload. */
export const postDraftSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`),
    slug: z.string().trim().max(MAX_SLUG_LENGTH).optional(),
    excerpt: z.string().trim().max(MAX_EXCERPT_LENGTH).optional(),
    content_md: z.string().max(MAX_CONTENT_LENGTH).default(""),
    cover_image_url: z
      .union([z.string(), z.null()])
      .optional()
      .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
    tags: z.array(z.string().max(MAX_TAG_LENGTH)).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
    font: z.enum(POST_FONTS).default("sans"),
  })
  .refine(
    (data) => data.status !== "published" || data.content_md.trim().length > 0,
    { message: "Published posts need body content", path: ["content_md"] },
  );

export type PostDraftInput = z.input<typeof postDraftSchema>;
export type PostDraftParsed = z.output<typeof postDraftSchema>;
