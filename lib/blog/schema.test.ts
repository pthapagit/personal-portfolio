import { describe, it, expect } from "vitest";
import { postDraftSchema, parseTagsInput } from "@/lib/blog/schema";

const base = {
  title: "My first post",
  content_md: "Hello world, this is the body.",
  tags: ["travel"],
  status: "draft" as const,
};

describe("postDraftSchema", () => {
  it("accepts a valid draft", () => {
    const result = postDraftSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("requires a non-empty title", () => {
    const result = postDraftSchema.safeParse({ ...base, title: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = postDraftSchema.safeParse({ ...base, status: "archived" });
    expect(result.success).toBe(false);
  });

  it("requires body content when publishing", () => {
    const result = postDraftSchema.safeParse({
      ...base,
      status: "published",
      content_md: "   ",
    });
    expect(result.success).toBe(false);
  });

  it("defaults tags to an empty array", () => {
    const { tags, ...withoutTags } = base;
    void tags;
    const result = postDraftSchema.safeParse(withoutTags);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual([]);
  });

  it("treats empty-string cover image as null", () => {
    const result = postDraftSchema.safeParse({ ...base, cover_image_url: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.cover_image_url).toBeNull();
  });
});

describe("parseTagsInput", () => {
  it("splits a comma-separated string, trims, lowercases, and de-dupes", () => {
    expect(parseTagsInput("Travel, reading ,  Travel , ,thoughts")).toEqual([
      "travel",
      "reading",
      "thoughts",
    ]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseTagsInput("   ")).toEqual([]);
  });
});
