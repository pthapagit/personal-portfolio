import { describe, it, expect } from "vitest";
import { checkImageUpload, MAX_IMAGE_BYTES } from "@/lib/blog/image-upload";

describe("checkImageUpload", () => {
  it("accepts the allow-listed image types and picks the extension server-side", () => {
    expect(checkImageUpload("image/png", 100)).toEqual({ ok: true, ext: "png" });
    expect(checkImageUpload("image/jpeg", 100)).toEqual({ ok: true, ext: "jpg" });
    expect(checkImageUpload("image/webp", 100)).toEqual({ ok: true, ext: "webp" });
    expect(checkImageUpload("image/gif", 100)).toEqual({ ok: true, ext: "gif" });
    expect(checkImageUpload("image/avif", 100)).toEqual({ ok: true, ext: "avif" });
  });

  it("rejects SVG (scriptable) even though it is an image type", () => {
    const r = checkImageUpload("image/svg+xml", 100);
    expect(r.ok).toBe(false);
  });

  it("rejects non-image and empty types", () => {
    expect(checkImageUpload("text/html", 100).ok).toBe(false);
    expect(checkImageUpload("application/octet-stream", 100).ok).toBe(false);
    expect(checkImageUpload("", 100).ok).toBe(false);
  });

  it("rejects empty and oversized files", () => {
    expect(checkImageUpload("image/png", 0).ok).toBe(false);
    expect(checkImageUpload("image/png", MAX_IMAGE_BYTES + 1).ok).toBe(false);
    expect(checkImageUpload("image/png", MAX_IMAGE_BYTES).ok).toBe(true);
  });
});
