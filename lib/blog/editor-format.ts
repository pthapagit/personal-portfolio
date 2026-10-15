export type FormatAction =
  | "bold"
  | "italic"
  | "strike"
  | "link"
  | "h2"
  | "h3"
  | "quote"
  | "bullet"
  | "numbered";

export interface EditResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

const INLINE: Record<"bold" | "italic" | "strike", { mark: string; placeholder: string }> = {
  bold: { mark: "**", placeholder: "bold text" },
  italic: { mark: "_", placeholder: "italic text" },
  strike: { mark: "~~", placeholder: "struck text" },
};

const HEADING_PREFIX: Record<"h2" | "h3", string> = { h2: "## ", h3: "### " };

export function insertAt(text: string, start: number, end: number, insert: string): EditResult {
  const next = text.slice(0, start) + insert + text.slice(end);
  const cursor = start + insert.length;
  return { text: next, selectionStart: cursor, selectionEnd: cursor };
}

function toggleInline(text: string, start: number, end: number, mark: string, placeholder: string): EditResult {
  const before = text.slice(start - mark.length, start);
  const after = text.slice(end, end + mark.length);
  if (start !== end && before === mark && after === mark) {
    const next = text.slice(0, start - mark.length) + text.slice(start, end) + text.slice(end + mark.length);
    return { text: next, selectionStart: start - mark.length, selectionEnd: end - mark.length };
  }
  const inner = start === end ? placeholder : text.slice(start, end);
  const next = text.slice(0, start) + mark + inner + mark + text.slice(end);
  const selStart = start + mark.length;
  return { text: next, selectionStart: selStart, selectionEnd: selStart + inner.length };
}

function link(text: string, start: number, end: number): EditResult {
  const label = start === end ? "link text" : text.slice(start, end);
  const url = "https://";
  const insert = `[${label}](${url})`;
  const next = text.slice(0, start) + insert + text.slice(end);
  const urlStart = start + label.length + 3;
  return { text: next, selectionStart: urlStart, selectionEnd: urlStart + url.length };
}

/** Apply a prefix transform to every line touched by the selection. */
function transformLines(
  text: string,
  start: number,
  end: number,
  transform: (line: string, index: number) => string,
): EditResult {
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const nl = text.indexOf("\n", end);
  const lineEnd = nl === -1 ? text.length : nl;
  const block = text.slice(lineStart, lineEnd).split("\n").map(transform).join("\n");
  const next = text.slice(0, lineStart) + block + text.slice(lineEnd);
  return { text: next, selectionStart: lineStart, selectionEnd: lineStart + block.length };
}

const HEADING_RE = /^#{1,6}\s+/;

export function applyFormat(text: string, start: number, end: number, action: FormatAction): EditResult {
  switch (action) {
    case "bold":
    case "italic":
    case "strike": {
      const { mark, placeholder } = INLINE[action];
      return toggleInline(text, start, end, mark, placeholder);
    }
    case "link":
      return link(text, start, end);
    case "h2":
    case "h3": {
      const prefix = HEADING_PREFIX[action];
      return transformLines(text, start, end, (line) => {
        if (line.startsWith(prefix)) return line.slice(prefix.length);
        return prefix + line.replace(HEADING_RE, "");
      });
    }
    case "quote":
      return transformLines(text, start, end, (line) => `> ${line}`);
    case "bullet":
      return transformLines(text, start, end, (line) => `- ${line}`);
    case "numbered":
      return transformLines(text, start, end, (line, i) => `${i + 1}. ${line}`);
  }
}
