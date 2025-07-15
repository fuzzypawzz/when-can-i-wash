import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  expect: {
    timeout: 10000
  },
  testDir: './src',
  testMatch: /.*.spec.ts/,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5183',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    testIdAttribute: 'data-test'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev:offline:e2e',
      url: 'http://localhost:5183/',
      reuseExistingServer: !process.env.CI
    },
  ]
})
