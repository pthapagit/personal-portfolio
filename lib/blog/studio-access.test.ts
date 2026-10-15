import { describe, it, expect } from "vitest";
import { studioRedirect } from "@/lib/blog/studio-access";

describe("studioRedirect", () => {
  it("ignores non-studio routes", () => {
    expect(studioRedirect({ path: "/blog", isAdmin: false })).toBeNull();
    expect(studioRedirect({ path: "/", isAdmin: true })).toBeNull();
  });

  it("sends an unauthenticated visitor on a studio route to login", () => {
    expect(studioRedirect({ path: "/studio", isAdmin: false })).toBe("login");
    expect(studioRedirect({ path: "/studio/new", isAdmin: false })).toBe("login");
    expect(studioRedirect({ path: "/studio/abc/edit", isAdmin: false })).toBe(
      "login",
    );
  });

  it("lets an unauthenticated visitor reach the login page", () => {
    expect(studioRedirect({ path: "/studio/login", isAdmin: false })).toBeNull();
  });

  it("sends an authenticated admin away from the login page to the studio", () => {
    expect(studioRedirect({ path: "/studio/login", isAdmin: true })).toBe(
      "studio",
    );
  });

  it("lets an authenticated admin use studio routes", () => {
    expect(studioRedirect({ path: "/studio", isAdmin: true })).toBeNull();
    expect(studioRedirect({ path: "/studio/new", isAdmin: true })).toBeNull();
  });
});
