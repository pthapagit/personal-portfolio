import { test, expect } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync } from "node:fs";

const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

// A 1x1 transparent PNG, used to exercise the image-upload path.
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

test.describe("blog end-to-end", () => {
  test.skip(
    !email || !password,
    "Set PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD to run this test.",
  );

  test("write, upload, publish, read, and share a post", async ({
    page,
    context,
  }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const title = `E2E Test Post ${unique}`;
    const headingText = `Hello from E2E ${unique}`;
    const body = `# ${headingText}\n\nThis is an automated end-to-end test post.`;

    // 1. Log in
    await page.goto("/studio/login");
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/studio\/?$/);

    // 2. Start a new post
    await page.getByRole("link", { name: /new post/i }).first().click();
    await expect(page).toHaveURL(/\/studio\/new/);
    await page.getByLabel(/title/i).fill(title);
    await page.getByLabel(/^tags/i).fill("e2e, travel");
    await page.getByLabel(/post body/i).fill(body);

    // 3. Upload a cover image
    const pngPath = join(tmpdir(), `e2e-cover-${unique}.png`);
    writeFileSync(pngPath, Buffer.from(PNG_BASE64, "base64"));
    await page.getByLabel(/upload cover image/i).setInputFiles(pngPath);
    await expect(page.getByAltText(/cover preview/i)).toBeVisible({
      timeout: 15_000,
    });

    // 4. Format with the toolbar, then publish from the full preview
    await page.getByLabel(/post body/i).press("End");
    await page.getByRole("button", { name: /insert emoji/i }).click();
    await page.getByRole("button", { name: "✈️" }).click();
    await page.getByRole("button", { name: /full preview/i }).click();
    const preview = page.getByRole("dialog", { name: /full preview/i });
    await expect(preview.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(preview.getByText("✈️")).toBeVisible();
    await preview.getByRole("button", { name: /^publish$/i }).click();
    await expect(page).toHaveURL(/\/studio\/?$/);
    await expect(page.getByText(title)).toBeVisible();

    // 5. Read it on the public blog
    await page.goto("/blog");
    await page.getByRole("link", { name: title }).click();
    await expect(
      page.getByRole("heading", { name: headingText }),
    ).toBeVisible();

    // 6. Share: copy link
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: /copy link/i }).click();
    await expect(page.getByText(/copied/i)).toBeVisible();

    // 7. Clean up: delete the post
    await page.goto("/studio");
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("link", { name: title }).click();
    await expect(page).toHaveURL(/\/studio\/.+\/edit/);
    await page.getByRole("button", { name: /delete post/i }).click();
    await expect(page).toHaveURL(/\/studio\/?$/);
    await expect(page.getByText(title)).toHaveCount(0);
  });

  test("refuses a password change when the current password is wrong", async ({ page }) => {
    await page.goto("/studio/login");
    await page.getByLabel(/email/i).fill(email!);
    await page.getByLabel(/password/i).fill(password!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/studio\/?$/);

    await page.getByRole("link", { name: /^password$/i }).click();
    await expect(page).toHaveURL(/\/studio\/password/);
    await page.getByLabel(/current password/i).fill("definitely-not-the-password");
    await page.getByLabel(/^new password/i).fill("an-unused-new-passphrase");
    await page.getByLabel(/confirm new password/i).fill("an-unused-new-passphrase");
    await page.getByRole("button", { name: /change password/i }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: /current password is incorrect/i }),
    ).toBeVisible();
  });
});
