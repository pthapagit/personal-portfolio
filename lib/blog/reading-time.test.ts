import { describe, it, expect } from "vitest";
import { readingMinutes } from "@/lib/blog/reading-time";

const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");

describe("readingMinutes", () => {
  it("returns at least 1 minute, even for empty content", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("just a few words")).toBe(1);
  });

  it("rounds up to the next minute at the default 200 wpm", () => {
    expect(readingMinutes(words(200))).toBe(1);
    expect(readingMinutes(words(201))).toBe(2);
    expect(readingMinutes(words(450))).toBe(3);
  });

  it("ignores markdown syntax when counting words", () => {
    // Only "Title" and "bold" are real words here.
    expect(readingMinutes("# Title\n\n**bold**")).toBe(1);
  });
});
