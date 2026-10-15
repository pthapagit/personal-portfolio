import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownView } from "@/components/blog/MarkdownView";

describe("MarkdownView", () => {
  it("renders headings and emphasis", () => {
    render(<MarkdownView>{"# Trip notes\n\nI loved **Paris**."}</MarkdownView>);
    expect(
      screen.getByRole("heading", { level: 1, name: "Trip notes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Paris").tagName).toBe("STRONG");
  });

  it("does not render embedded <script> tags", () => {
    const { container } = render(
      <MarkdownView>{"Hello <script>alert('xss')</script> world"}</MarkdownView>,
    );
    expect(container.querySelector("script")).toBeNull();
  });

  it("neutralizes javascript: links", () => {
    const { container } = render(
      <MarkdownView>{"[click me](javascript:alert('xss'))"}</MarkdownView>,
    );
    const anchor = container.querySelector("a");
    // rehype-sanitize strips the dangerous href entirely.
    expect(anchor?.getAttribute("href") ?? "").not.toContain("javascript:");
  });
});
