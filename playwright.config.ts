import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const shouldStartWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: shouldStartWebServer
    ? {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        env: {
          MOCK_APP_DATA: "1",
          NEXT_PUBLIC_CHAIN_ID: "42161",
          NEXT_PUBLIC_NFT_ADDRESS: "0x895a6F444BE4ba9d124F61DF736605792B35D66b",
          NEXT_PUBLIC_MARKET_ADDRESS:
            "0x47eF85Dfb775aCE0934fBa9EEd09D22e6eC0Cc08",
          NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
            "00000000000000000000000000000000",
          RPC_URL: "https://arb1.arbitrum.io/rpc",
          MEDIA_BASE_URL: "https://randomwalknft.s3.us-east-2.amazonaws.com",
          NFT_API_BASE_URL: "https://randomwalknft-api.com",
        },
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      testIgnore: "**/wallet-mobile.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile-chromium",
      testMatch: "**/wallet-mobile.spec.ts",
      use: {
        ...devices["Pixel 7"],
      },
    },
    {
      name: "mobile-webkit",
      testMatch: "**/wallet-mobile.spec.ts",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  outputDir: path.join(process.cwd(), "test-results"),
});
