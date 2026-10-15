import { describe, it, expect } from "vitest";
import { applyFormat, insertAt } from "@/lib/blog/editor-format";

describe("applyFormat — inline styles", () => {
  it("wraps the selection in ** for bold and keeps it selected", () => {
    const r = applyFormat("say hello now", 4, 9, "bold");
    expect(r.text).toBe("say **hello** now");
    expect(r.text.slice(r.selectionStart, r.selectionEnd)).toBe("hello");
  });

  it("removes bold when the selection is already wrapped", () => {
    const r = applyFormat("say **hello** now", 6, 11, "bold");
    expect(r.text).toBe("say hello now");
    expect(r.text.slice(r.selectionStart, r.selectionEnd)).toBe("hello");
  });

  it("inserts a selected placeholder when nothing is selected", () => {
    const r = applyFormat("ab", 1, 1, "italic");
    expect(r.text).toBe("a_italic text_b");
    expect(r.text.slice(r.selectionStart, r.selectionEnd)).toBe("italic text");
  });

  it("supports strikethrough", () => {
    expect(applyFormat("x", 0, 1, "strike").text).toBe("~~x~~");
  });

  it("builds a link and selects the URL for editing", () => {
    const r = applyFormat("see docs", 4, 8, "link");
    expect(r.text).toBe("see [docs](https://)");
    expect(r.text.slice(r.selectionStart, r.selectionEnd)).toBe("https://");
  });
});

describe("applyFormat — line styles", () => {
  it("turns the current line into a heading", () => {
    const r = applyFormat("one\ntwo\nthree", 5, 5, "h2");
    expect(r.text).toBe("one\n## two\nthree");
  });

  it("replaces an existing heading level", () => {
    expect(applyFormat("## two", 3, 3, "h3").text).toBe("### two");
  });

  it("toggles a heading off when applied twice", () => {
    expect(applyFormat("## two", 3, 3, "h2").text).toBe("two");
  });

  it("prefixes every selected line for lists and quotes", () => {
    expect(applyFormat("a\nb", 0, 3, "bullet").text).toBe("- a\n- b");
    expect(applyFormat("a\nb", 0, 3, "numbered").text).toBe("1. a\n2. b");
    expect(applyFormat("a\nb", 0, 3, "quote").text).toBe("> a\n> b");
  });
});

describe("insertAt", () => {
  it("inserts text at the cursor and places the cursor after it", () => {
    const r = insertAt("hi there", 2, 2, " 👋");
    expect(r.text).toBe("hi 👋 there");
    expect(r.selectionStart).toBe(2 + " 👋".length);
    expect(r.selectionEnd).toBe(r.selectionStart);
  });

  it("replaces the current selection", () => {
    expect(insertAt("hi there", 3, 8, "🌍").text).toBe("hi 🌍");
  });
});
