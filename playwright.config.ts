import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env["CI"]),
  retries: process.env["CI"] ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Serve the production build of apps/demo-app so local and CI test the compiled bundle.
  webServer: {
    command: "pnpm --filter demo-app exec next start -H 127.0.0.1 -p 3000",
    url: "http://127.0.0.1:3000/novice",
    reuseExistingServer: !process.env["CI"],
    timeout: 60_000,
  },
});
