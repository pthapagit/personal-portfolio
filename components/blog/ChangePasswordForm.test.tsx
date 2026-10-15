import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangePasswordForm } from "@/components/blog/ChangePasswordForm";
import type { PasswordState } from "@/app/studio/types";

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/current password/i), "old-password-123");
  await user.type(screen.getByLabelText(/^new password/i), "a-brand-new-passphrase");
  await user.type(screen.getByLabelText(/confirm new password/i), "a-brand-new-passphrase");
}

describe("ChangePasswordForm", () => {
  it("submits the three fields to the action", async () => {
    const user = userEvent.setup();
    const action = vi.fn<(prev: PasswordState, fd: FormData) => Promise<PasswordState>>(
      async () => ({ success: true }),
    );
    render(<ChangePasswordForm action={action} />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /change password/i }));

    expect(action).toHaveBeenCalledTimes(1);
    const fd = action.mock.calls[0][1] as FormData;
    expect(fd.get("current")).toBe("old-password-123");
    expect(fd.get("next")).toBe("a-brand-new-passphrase");
    expect(fd.get("confirm")).toBe("a-brand-new-passphrase");
  });

  it("shows the error returned by the action", async () => {
    const user = userEvent.setup();
    render(
      <ChangePasswordForm action={async () => ({ error: "Current password is incorrect." })} />,
    );
    await fill(user);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect/i);
  });

  it("confirms success", async () => {
    const user = userEvent.setup();
    render(<ChangePasswordForm action={async () => ({ success: true })} />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /change password/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/password updated/i);
  });

  it("uses password inputs with browser password-manager hints", () => {
    render(<ChangePasswordForm action={async () => ({})} />);
    const current = screen.getByLabelText(/current password/i);
    const next = screen.getByLabelText(/^new password/i);
    expect(current).toHaveAttribute("type", "password");
    expect(current).toHaveAttribute("autocomplete", "current-password");
    expect(next).toHaveAttribute("autocomplete", "new-password");
  });
});
