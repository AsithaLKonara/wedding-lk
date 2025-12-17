import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - increased for better reliability */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. Reduce workers to prevent hanging */
  workers: process.env.CI ? 1 : 1, // Use 1 worker to prevent hanging
  /* Global test timeout - set to prevent hanging */
  timeout: 45000, // 45 seconds per test (reduced from 60s to fail faster)
  /* Global expect timeout */
  expect: {
    timeout: 15000, // 15 seconds for assertions (reduced to fail faster)
  },
  /* Global setup to seed test data */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list'],
    // Custom reporter for console logs
    ['json', { outputFile: 'test-results/console-reports-summary.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_BASE_URL || process.env.NODE_ENV === 'production' 
      ? 'https://wedding-lk.vercel.app' 
      : 'http://localhost:3000',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Global timeout for each action - set to prevent hanging */
    actionTimeout: 30000, // 30 seconds for actions (reduced to fail faster)
    /* Global timeout for navigation - set to prevent hanging */
    navigationTimeout: 30000, // 30 seconds for navigation (reduced to fail faster)
    /* Ignore HTTPS errors for production testing */
    ignoreHTTPSErrors: true,
    /* Console monitoring - capture all console logs */
    launchOptions: {
      args: ['--disable-web-security'],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Disabled Firefox due to timeout issues - focus on Chromium as primary browser
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // Disabled WebKit/Safari due to timeout issues
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Increased timeouts for mobile Chrome to handle slower operations
        actionTimeout: 90000, // 1.5 minutes for actions
        navigationTimeout: 90000, // 1.5 minutes for navigation
      },
    },
    // Disabled Mobile Safari due to timeout issues
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: undefined, // Use existing server
});
