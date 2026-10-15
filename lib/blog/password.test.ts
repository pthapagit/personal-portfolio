import { describe, it, expect } from "vitest";
import { validatePasswordChange, MIN_PASSWORD_LENGTH } from "@/lib/blog/password";

const good = {
  current: "old-password-123",
  next: "a-brand-new-passphrase",
  confirm: "a-brand-new-passphrase",
};

describe("validatePasswordChange", () => {
  it("accepts a valid change", () => {
    expect(validatePasswordChange(good)).toBeNull();
  });

  it("requires the current password", () => {
    expect(validatePasswordChange({ ...good, current: "" })).toMatch(/current password/i);
  });

  it(`requires at least ${MIN_PASSWORD_LENGTH} characters`, () => {
    const short = "x".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validatePasswordChange({ ...good, next: short, confirm: short })).toMatch(
      /at least/i,
    );
  });

  it("rejects passwords over 72 bytes (bcrypt limit)", () => {
    const long = "x".repeat(73);
    expect(validatePasswordChange({ ...good, next: long, confirm: long })).toMatch(/72/);
  });

  it("requires the confirmation to match", () => {
    expect(validatePasswordChange({ ...good, confirm: "something-else-entirely" })).toMatch(
      /match/i,
    );
  });

  it("requires the new password to differ from the current one", () => {
    expect(
      validatePasswordChange({ current: good.next, next: good.next, confirm: good.next }),
    ).toMatch(/different/i);
  });
});
