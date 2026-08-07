import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/lib/testing/setup-tests.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: [
        "src/app/api/gallery/route.ts",
        "src/app/api/tokens/route.ts",
        "src/features/faq/faq-list.tsx",
        "src/features/gallery/queries.ts",
        "src/features/tokens/token-card.tsx",
        "src/features/wallet/wallet-guard.tsx",
        "src/features/wallet/use-wallet-transactions.ts",
        "src/lib/env.ts",
        "src/lib/format.ts",
        "src/lib/media.ts",
        "src/lib/wallet/errors.ts",
        "src/lib/wallet/options.ts",
      ],
      exclude: ["src/lib/testing/**/*.{ts,tsx}"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 60,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
