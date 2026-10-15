export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Allow-listed image MIME types mapped to the extension we store them under.
 * The extension is chosen here — never from the uploaded filename — and SVG is
 * deliberately excluded because it can carry scripts (stored XSS).
 */
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

export type ImageUploadCheck =
  | { ok: true; ext: string }
  | { ok: false; error: string };

export function checkImageUpload(type: string, size: number): ImageUploadCheck {
  const ext = ALLOWED_TYPES[type];
  if (!ext) {
    return { ok: false, error: "Only PNG, JPEG, GIF, WebP, or AVIF images are allowed." };
  }
  if (size <= 0) return { ok: false, error: "No file selected." };
  if (size > MAX_IMAGE_BYTES) return { ok: false, error: "Image must be 10 MB or smaller." };
  return { ok: true, ext };
}
