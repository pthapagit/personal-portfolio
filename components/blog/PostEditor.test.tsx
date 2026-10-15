import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostEditor } from "@/components/blog/PostEditor";
import type { SaveState, UploadResult } from "@/app/studio/types";

const noopSave = async (): Promise<SaveState> => ({});
const noopUpload = async (): Promise<UploadResult> => ({});

describe("PostEditor", () => {
  it("auto-derives the slug from the title until the slug is edited", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);

    await user.type(screen.getByLabelText(/title/i), "Hello World");
    const slug = screen.getByLabelText(/slug/i) as HTMLInputElement;
    expect(slug.value).toBe("hello-world");
  });

  it("stops auto-deriving once the slug is manually changed", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);

    const slug = screen.getByLabelText(/slug/i) as HTMLInputElement;
    await user.clear(slug);
    await user.type(slug, "custom-slug");
    await user.type(screen.getByLabelText(/title/i), "Anything");
    expect(slug.value).toBe("custom-slug");
  });

  it("renders a live markdown preview of the body", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);

    await user.type(screen.getByLabelText(/post body/i), "# Hi there");
    expect(
      screen.getByRole("heading", { name: "Hi there" }),
    ).toBeInTheDocument();
  });

  it("prefills fields when editing an existing post", () => {
    render(
      <PostEditor
        saveAction={noopSave}
        uploadAction={noopUpload}
        post={{
          id: "1",
          slug: "trip",
          title: "Trip",
          excerpt: "x",
          content_md: "body",
          cover_image_url: null,
          tags: ["travel", "reading"],
          status: "published",
          reading_minutes: 1,
          published_at: null,
          created_at: "",
          updated_at: "",
          font: "serif",
        }}
      />,
    );
    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe(
      "Trip",
    );
    expect((screen.getByLabelText(/tags/i) as HTMLInputElement).value).toContain(
      "travel",
    );
    expect((screen.getByLabelText(/^font/i) as HTMLSelectElement).value).toBe(
      "serif",
    );
  });

  it("explains the slug by showing the post's web address", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);
    await user.type(screen.getByLabelText(/title/i), "Kyoto Diary");
    expect(screen.getByText("/blog/kyoto-diary")).toBeInTheDocument();
  });

  it("bolds the selected text from the toolbar", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);
    const body = screen.getByLabelText(/post body/i) as HTMLTextAreaElement;
    await user.type(body, "make me bold");
    body.setSelectionRange(8, 12);
    await user.click(screen.getByRole("button", { name: /^bold$/i }));
    expect(body.value).toBe("make me **bold**");
  });

  it("adds a heading from the toolbar", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);
    const body = screen.getByLabelText(/post body/i) as HTMLTextAreaElement;
    await user.type(body, "Chapter one");
    await user.click(screen.getByRole("button", { name: /^heading$/i }));
    expect(body.value).toBe("## Chapter one");
  });

  it("inserts an emoji at the cursor", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);
    const body = screen.getByLabelText(/post body/i) as HTMLTextAreaElement;
    await user.type(body, "Hello ");
    await user.click(screen.getByRole("button", { name: /insert emoji/i }));
    await user.click(screen.getByRole("button", { name: "😀" }));
    expect(body.value).toBe("Hello 😀");
  });

  it("opens a full-page preview showing the post as readers will see it", async () => {
    const user = userEvent.setup();
    render(<PostEditor saveAction={noopSave} uploadAction={noopUpload} />);
    await user.type(screen.getByLabelText(/title/i), "Kyoto Diary");
    await user.type(screen.getByLabelText(/post body/i), "Temples and tea.");
    await user.selectOptions(screen.getByLabelText(/^font/i), "serif");

    await user.click(screen.getByRole("button", { name: /full preview/i }));
    const dialog = screen.getByRole("dialog", { name: /preview/i });
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Kyoto Diary" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("font-serif");
    expect(
      screen.getAllByRole("button", { name: /^publish$/i }).length,
    ).toBeGreaterThan(1);

    await user.click(screen.getByRole("button", { name: /back to editing/i }));
    expect(screen.queryByRole("dialog", { name: /preview/i })).toBeNull();
  });
});
