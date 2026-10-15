import { defineConfig, type UserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit + component tests (Vitest + React Testing Library).
// Async Server Components are covered by Playwright (see playwright.config.ts),
// per node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md.
export default defineConfig({
  // Cast works around a vite-version type mismatch between @vitejs/plugin-react
  // and vitest's bundled (rolldown) vite. Runtime is unaffected.
  plugins: [tsconfigPaths(), react()] as UserConfig["plugins"],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: [
      "__tests__/**/*.{test,spec}.{ts,tsx}",
      "{app,components,lib}/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules", ".next", "e2e/**"],
  },
});
