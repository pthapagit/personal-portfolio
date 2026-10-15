import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShareButtons } from "@/components/blog/ShareButtons";

const url = "https://example.com/blog/my-trip";

describe("ShareButtons", () => {
  it("renders a LinkedIn share link pointing at the post URL", () => {
    render(<ShareButtons url={url} title="My Trip" />);
    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link.getAttribute("href")).toContain(encodeURIComponent(url));
  });

  it("copies the URL to the clipboard and confirms", async () => {
    // userEvent.setup() installs a clipboard stub on navigator; spy on it.
    const user = userEvent.setup();
    const writeSpy = vi.spyOn(navigator.clipboard, "writeText");
    render(<ShareButtons url={url} title="My Trip" />);
    await user.click(screen.getByRole("button", { name: /copy link/i }));
    expect(writeSpy).toHaveBeenCalledWith(url);
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
