import { defineConfig, devices } from '@playwright/test';

/**
 * Fast Playwright configuration for quick testing
 * Optimized for speed and reliability
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Run fewer workers for stability */
  workers: 2,
  /* Global test timeout - optimized for speed */
  timeout: 60000, // 1 minute per test
  /* Global expect timeout */
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_BASE_URL || 'https://wedding-ikuzlo997-asithalkonaras-projects.vercel.app',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Global timeout for each action - optimized for speed */
    actionTimeout: 30000, // 30 seconds for actions
    /* Global timeout for navigation - optimized for speed */
    navigationTimeout: 30000, // 30 seconds for navigation
    /* Wait for network to be idle */
    waitForLoadState: 'domcontentloaded', // Faster than networkidle
    /* Ignore HTTPS errors for production testing */
    ignoreHTTPSErrors: true,
    /* Disable animations for faster testing */
    reducedMotion: 'reduce',
  },

  /* Configure projects for major browsers - only essential ones */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Optimize Chrome for testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-extensions',
            '--no-sandbox',
            '--disable-dev-shm-usage'
          ]
        }
      },
    },
    // Remove WebKit for now due to compatibility issues
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     // Disable problematic WebKit settings
    //     launchOptions: {
    //       args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    //     }
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: undefined, // Use existing server
});
