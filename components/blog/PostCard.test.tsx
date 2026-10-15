import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/lib/blog/types";

const post: Post = {
  id: "1",
  slug: "my-trip",
  title: "My Trip",
  excerpt: "A short summary of the trip.",
  content_md: "body",
  cover_image_url: null,
  tags: ["travel", "reading"],
  status: "published",
  reading_minutes: 4,
  published_at: "2026-01-02T00:00:00.000Z",
  created_at: "2026-01-02T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

describe("PostCard", () => {
  it("links to the post and shows title + excerpt", () => {
    render(<PostCard post={post} />);
    const link = screen.getByRole("link", { name: /my trip/i });
    expect(link).toHaveAttribute("href", "/blog/my-trip");
    expect(screen.getByText("A short summary of the trip.")).toBeInTheDocument();
  });

  it("shows reading time and tags", () => {
    render(<PostCard post={post} />);
    expect(screen.getByText(/4 min read/i)).toBeInTheDocument();
    expect(screen.getByText("travel")).toBeInTheDocument();
    expect(screen.getByText("reading")).toBeInTheDocument();
  });
});
