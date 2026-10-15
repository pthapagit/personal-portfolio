import { describe, it, expect } from "vitest";
import { makeExcerpt } from "@/lib/blog/excerpt";

describe("makeExcerpt", () => {
  it("returns short plain text unchanged (no ellipsis)", () => {
    expect(makeExcerpt("A short note about my day.")).toBe(
      "A short note about my day.",
    );
  });

  it("strips markdown formatting", () => {
    expect(makeExcerpt("## Trip\n\nI visited **Paris** and loved it.")).toBe(
      "Trip I visited Paris and loved it.",
    );
  });

  it("truncates long text on a word boundary with an ellipsis", () => {
    const long = Array.from({ length: 80 }, (_, i) => `word${i}`).join(" ");
    const out = makeExcerpt(long, 40);
    expect(out.endsWith("\u2026")).toBe(true);
    const body = out.slice(0, -1).trimEnd();
    // The body (without the ellipsis) must not exceed the max length...
    expect(body.length).toBeLessThanOrEqual(40);
    // ...and every token must be a complete, un-truncated word.
    for (const token of body.split(/\s+/)) {
      expect(token).toMatch(/^word\d+$/);
    }
  });
});
