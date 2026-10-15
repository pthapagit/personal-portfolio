import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmojiPicker } from "@/components/blog/EmojiPicker";

describe("EmojiPicker", () => {
  it("is closed until the trigger is pressed", async () => {
    const user = userEvent.setup();
    render(<EmojiPicker onSelect={() => {}} />);
    expect(screen.queryByRole("dialog", { name: /emoji/i })).toBeNull();
    await user.click(screen.getByRole("button", { name: /insert emoji/i }));
    expect(screen.getByRole("dialog", { name: /emoji/i })).toBeInTheDocument();
  });

  it("calls onSelect with the chosen emoji and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<EmojiPicker onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: /insert emoji/i }));
    await user.click(screen.getByRole("button", { name: "😀" }));
    expect(onSelect).toHaveBeenCalledWith("😀");
    expect(screen.queryByRole("dialog", { name: /emoji/i })).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<EmojiPicker onSelect={() => {}} />);
    await user.click(screen.getByRole("button", { name: /insert emoji/i }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: /emoji/i })).toBeNull();
  });
});
