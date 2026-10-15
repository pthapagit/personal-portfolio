import { describe, it, expect } from "vitest";
import { stripMarkdown } from "@/lib/blog/markdown";

describe("stripMarkdown", () => {
  it("removes heading markers", () => {
    expect(stripMarkdown("# Heading")).toBe("Heading");
    expect(stripMarkdown("### Deep heading")).toBe("Deep heading");
  });

  it("removes emphasis markers but keeps the text", () => {
    expect(stripMarkdown("**bold** and _italic_")).toBe("bold and italic");
  });

  it("keeps link text and drops the URL", () => {
    expect(stripMarkdown("see [my site](https://example.com) now")).toBe(
      "see my site now",
    );
  });

  it("drops images entirely", () => {
    expect(stripMarkdown("![alt text](https://example.com/a.png)")).toBe("");
  });

  it("removes inline and fenced code fences", () => {
    expect(stripMarkdown("use `npm test` here")).toBe("use npm test here");
  });

  it("collapses whitespace", () => {
    expect(stripMarkdown("line one\n\n\nline two")).toBe("line one line two");
  });
});
