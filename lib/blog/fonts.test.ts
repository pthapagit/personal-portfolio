import { describe, it, expect } from "vitest";
import { POST_FONTS, FONT_LABELS, fontClass } from "@/lib/blog/fonts";

describe("post fonts", () => {
  it("offers serif, sans and mono with labels", () => {
    expect(POST_FONTS).toEqual(["sans", "serif", "mono"]);
    for (const f of POST_FONTS) expect(FONT_LABELS[f]).toBeTruthy();
  });

  it("maps each font to a Tailwind class", () => {
    expect(fontClass("serif")).toBe("font-serif");
    expect(fontClass("sans")).toBe("font-sans");
    expect(fontClass("mono")).toBe("font-mono");
  });

  it("falls back to sans for unknown or missing values", () => {
    expect(fontClass(null)).toBe("font-sans");
    expect(fontClass("comic")).toBe("font-sans");
  });
});
