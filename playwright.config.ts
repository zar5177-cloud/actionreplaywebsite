import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const protectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const forceVercelDns = process.env.SMOKE_FORCE_VERCEL_DNS === "1";

export default defineConfig({
  testDir: "./tests/smoke",
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    extraHTTPHeaders: protectionBypass
      ? {
          "x-vercel-protection-bypass": protectionBypass,
        }
      : undefined,
    trace: "on-first-retry",
  },
  webServer: process.env.SMOKE_BASE_URL
    ? undefined
    : {
        command: "npm run start -- --hostname 127.0.0.1 --port 3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        url: baseURL,
      },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: forceVercelDns
          ? {
              args: [
                "--host-resolver-rules=MAP shopactionreplay.com 76.76.21.21,MAP www.shopactionreplay.com 76.76.21.21",
              ],
            }
          : undefined,
      },
    },
  ],
});
