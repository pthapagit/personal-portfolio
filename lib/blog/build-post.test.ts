import { describe, it, expect } from "vitest";
import { buildPostRecord } from "@/lib/blog/build-post";
import type { PostDraftParsed } from "@/lib/blog/schema";

const draft = (over: Partial<PostDraftParsed> = {}): PostDraftParsed => ({
  title: "My Trip to Paris",
  slug: undefined,
  excerpt: undefined,
  content_md: "I went to Paris and it was wonderful.",
  cover_image_url: null,
  tags: ["travel"],
  status: "draft",
  font: "sans",
  ...over,
});

const NOW = new Date("2026-01-02T03:04:05.000Z");

describe("buildPostRecord", () => {
  it("derives a slug from the title when none is given", () => {
    const record = buildPostRecord({ draft: draft(), now: NOW });
    expect(record.slug).toBe("my-trip-to-paris");
  });

  it("uses an explicitly provided slug (slugified)", () => {
    const record = buildPostRecord({ draft: draft({ slug: "Paris 2026!" }), now: NOW });
    expect(record.slug).toBe("paris-2026");
  });

  it("ensures the slug is unique against existing slugs", () => {
    const record = buildPostRecord({
      draft: draft(),
      takenSlugs: ["my-trip-to-paris"],
      now: NOW,
    });
    expect(record.slug).toBe("my-trip-to-paris-2");
  });

  it("keeps the current slug unchanged when editing the same post", () => {
    const record = buildPostRecord({
      draft: draft(),
      takenSlugs: ["my-trip-to-paris"],
      currentSlug: "my-trip-to-paris",
      now: NOW,
    });
    expect(record.slug).toBe("my-trip-to-paris");
  });

  it("sets published_at when publishing", () => {
    const record = buildPostRecord({ draft: draft({ status: "published" }), now: NOW });
    expect(record.status).toBe("published");
    expect(record.published_at).toBe(NOW.toISOString());
  });

  it("preserves the original published_at when re-publishing", () => {
    const record = buildPostRecord({
      draft: draft({ status: "published" }),
      currentPublishedAt: "2025-05-05T00:00:00.000Z",
      now: NOW,
    });
    expect(record.published_at).toBe("2025-05-05T00:00:00.000Z");
  });

  it("leaves published_at null for drafts", () => {
    const record = buildPostRecord({ draft: draft({ status: "draft" }), now: NOW });
    expect(record.published_at).toBeNull();
  });

  it("computes reading time and auto-excerpt from content", () => {
    const record = buildPostRecord({ draft: draft(), now: NOW });
    expect(record.reading_minutes).toBeGreaterThanOrEqual(1);
    expect(record.excerpt).toBe("I went to Paris and it was wonderful.");
  });

  it("carries the chosen font through to the record", () => {
    const record = buildPostRecord({ draft: draft({ font: "serif" }), now: NOW });
    expect(record.font).toBe("serif");
  });

  it("prefers an explicit excerpt over the auto one", () => {
    const record = buildPostRecord({
      draft: draft({ excerpt: "Short custom summary." }),
      now: NOW,
    });
    expect(record.excerpt).toBe("Short custom summary.");
  });
});
