import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './src/ct',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    viewport: { width: 800, height: 600 },
    ctViteConfig: {}, // use Vite defaults; customize later if needed
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: process.env.CI ? [['html'], ['list']] : [['html'], ['list']],
});
