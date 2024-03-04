import { defineConfig, devices } from '@playwright/test';
import { loadConfig } from './config';

const config = loadConfig();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: config.backendUrl,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: `DATABASE_URL=${config.dbUrl} npm run server:start`,
    url: config.backendUrl,
    reuseExistingServer: !process.env.CI,
  },
});
