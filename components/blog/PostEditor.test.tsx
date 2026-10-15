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
        }}
      />,
    );
    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe(
      "Trip",
    );
    expect((screen.getByLabelText(/tags/i) as HTMLInputElement).value).toContain(
      "travel",
    );
  });
});
