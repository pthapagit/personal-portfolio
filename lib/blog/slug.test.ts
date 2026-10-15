import { describe, it, expect } from "vitest";
import { slugify, uniqueSlug } from "@/lib/blog/slug";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("collapses repeated separators and trims them", () => {
    expect(slugify("  Multiple   Spaces -- here ")).toBe("multiple-spaces-here");
  });

  it("strips accents/diacritics", () => {
    expect(slugify("Café déjà vu")).toBe("cafe-deja-vu");
  });

  it("falls back to 'post' when nothing usable remains", () => {
    expect(slugify("---")).toBe("post");
    expect(slugify("")).toBe("post");
  });

  it("leaves an already-clean slug intact", () => {
    expect(slugify("already-slugged")).toBe("already-slugged");
  });
});

describe("uniqueSlug", () => {
  it("returns the base when it is free", () => {
    expect(uniqueSlug("hello", [])).toBe("hello");
  });

  it("appends an incrementing suffix when taken", () => {
    expect(uniqueSlug("hello", ["hello"])).toBe("hello-2");
    expect(uniqueSlug("hello", ["hello", "hello-2"])).toBe("hello-3");
  });
});
