import { z } from "zod";

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

/** Validation schema for the post editor payload. */
export const postDraftSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    slug: z.string().trim().optional(),
    excerpt: z.string().trim().optional(),
    content_md: z.string().default(""),
    cover_image_url: z
      .union([z.string(), z.null()])
      .optional()
      .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .refine(
    (data) => data.status !== "published" || data.content_md.trim().length > 0,
    { message: "Published posts need body content", path: ["content_md"] },
  );

export type PostDraftInput = z.input<typeof postDraftSchema>;
export type PostDraftParsed = z.output<typeof postDraftSchema>;
