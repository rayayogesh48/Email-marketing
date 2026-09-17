import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1440, height: 1024 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
