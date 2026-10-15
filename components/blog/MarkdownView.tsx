import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * Safe Markdown renderer shared by the reader and the editor preview.
 * react-markdown escapes raw HTML by default; rehype-sanitize adds
 * defense-in-depth (strips dangerous attributes/URLs). remark-gfm enables
 * tables, task lists, strikethrough, and autolinks.
 */
export function MarkdownView({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
    >
      {children}
    </ReactMarkdown>
  );
}
