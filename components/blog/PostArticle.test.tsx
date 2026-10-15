import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostArticle } from "@/components/blog/PostArticle";

const props = {
  title: "Lisbon Notes",
  publishedAt: "2026-03-04T12:00:00.000Z",
  readingMinutes: 3,
  coverImageUrl: null,
  contentMd: "## Day one\n\nTrams **everywhere**.",
  tags: ["travel"],
  font: "serif",
};

describe("PostArticle", () => {
  it("renders the title, meta, body and tags", () => {
    render(<PostArticle {...props} />);
    expect(screen.getByRole("heading", { level: 1, name: "Lisbon Notes" })).toBeInTheDocument();
    expect(screen.getByText(/3 min read/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Day one" })).toBeInTheDocument();
    expect(screen.getByText("travel")).toBeInTheDocument();
  });

  it("applies the chosen font to the article", () => {
    render(<PostArticle {...props} />);
    expect(screen.getByRole("article")).toHaveClass("font-serif");
  });

  it("renders tags as plain text when links are disabled", () => {
    render(<PostArticle {...props} linkTags={false} />);
    expect(screen.queryByRole("link", { name: "travel" })).toBeNull();
  });
});
