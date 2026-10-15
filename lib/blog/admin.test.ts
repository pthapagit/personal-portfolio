import { describe, it, expect, afterEach } from "vitest";
import { isAdminEmail } from "@/lib/blog/admin";

const original = process.env.ADMIN_EMAIL;

afterEach(() => {
  if (original === undefined) delete process.env.ADMIN_EMAIL;
  else process.env.ADMIN_EMAIL = original;
});

describe("isAdminEmail", () => {
  it("matches the configured admin email case-insensitively and trims", () => {
    process.env.ADMIN_EMAIL = "Me@Example.com";
    expect(isAdminEmail("me@example.com")).toBe(true);
    expect(isAdminEmail("  ME@EXAMPLE.COM ")).toBe(true);
  });

  it("rejects a different email", () => {
    process.env.ADMIN_EMAIL = "me@example.com";
    expect(isAdminEmail("someone@else.com")).toBe(false);
  });

  it("rejects when the email is missing", () => {
    process.env.ADMIN_EMAIL = "me@example.com";
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
  });

  it("rejects everything when no allowlist is configured", () => {
    delete process.env.ADMIN_EMAIL;
    expect(isAdminEmail("me@example.com")).toBe(false);
  });
});
