export const POST_FONTS = ["sans", "serif", "mono"] as const;
export type PostFont = (typeof POST_FONTS)[number];

export const FONT_LABELS: Record<PostFont, string> = {
  sans: "Sans (clean)",
  serif: "Serif (bookish)",
  mono: "Mono (typewriter)",
};

const FONT_CLASSES: Record<PostFont, string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

export function isPostFont(value: unknown): value is PostFont {
  return typeof value === "string" && (POST_FONTS as readonly string[]).includes(value);
}

export function fontClass(font: string | null | undefined): string {
  return FONT_CLASSES[isPostFont(font) ? font : "sans"];
}
