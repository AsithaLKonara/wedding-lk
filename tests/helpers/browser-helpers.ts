import { Page, Locator, expect } from '@playwright/test';

export type Environment = 'production' | 'local';
export type UserRole = 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Get base URL based on environment
 */
export function getBaseUrl(environment: Environment): string {
  return environment === 'production' 
    ? 'https://wedding-lk.vercel.app'
    : 'http://localhost:3000';
}

/**
 * Authenticate as a specific role
 */
export async function authenticateAsRole(
  page: Page,
  role: UserRole,
  environment: Environment = 'local',
  testUsers: Record<UserRole, TestUser>
): Promise<void> {
  const baseUrl = getBaseUrl(environment);
  const user = testUsers[role];

  if (!user) {
    throw new Error(`Test user for role ${role} not found`);
  }

  // Navigate to login page
  await page.goto(`${baseUrl}/login`);
  
  // Wait for login form to be visible
  await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
  
  // Fill in credentials
  const emailInput = page.locator('input[name="email"], input[type="email"]').first();
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  
  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);
  
  // Submit form
  const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
  await submitButton.click();
  
  // Wait for navigation to dashboard or verify login success
  await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 });
  
  // Verify we're logged in (not on login page)
  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    // Check for error messages
    const errorText = await page.locator('body').textContent();
    throw new Error(`Login failed for ${role}. Page content: ${errorText?.substring(0, 200)}`);
  }
  
  // Wait for dashboard to load
  await waitForPageLoad(page);
}

/**
 * Collect all buttons on the page
 */
export async function collectAllButtons(page: Page): Promise<Locator[]> {
  const buttons = await page.locator('button, [role="button"], input[type="button"], input[type="submit"]').all();
  return buttons;
}

/**
 * Collect all links on the page
 */
export async function collectAllLinks(page: Page): Promise<Locator[]> {
  const links = await page.locator('a[href], [role="link"]').all();
  return links;
}

/**
 * Collect all form elements on the page
 */
export async function collectAllForms(page: Page): Promise<Locator[]> {
  const forms = await page.locator('form').all();
  return forms;
}

/**
 * Collect all interactive elements
 */
export async function collectAllInteractiveElements(page: Page): Promise<{
  buttons: Locator[];
  links: Locator[];
  inputs: Locator[];
  selects: Locator[];
  textareas: Locator[];
  checkboxes: Locator[];
  radios: Locator[];
  forms: Locator[];
}> {
  return {
    buttons: await collectAllButtons(page),
    links: await collectAllLinks(page),
    inputs: await page.locator('input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="search"]').all(),
    selects: await page.locator('select').all(),
    textareas: await page.locator('textarea').all(),
    checkboxes: await page.locator('input[type="checkbox"]').all(),
    radios: await page.locator('input[type="radio"]').all(),
    forms: await collectAllForms(page),
  };
}

/**
 * Wait for complete page load
 */
export async function waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
  await page.waitForLoadState('domcontentloaded', { timeout });
  
  // Wait for any loading indicators to disappear
  try {
    await page.waitForSelector('[data-loading="true"]', { state: 'hidden', timeout: 5000 });
  } catch {
    // Loading indicator might not exist, that's okay
  }
}

/**
 * Take screenshot on error
 */
export async function takeScreenshotOnError(page: Page, testName: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `error-${testName}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/${filename}`, fullPage: true });
}

/**
 * Check basic page accessibility
 */
export async function checkPageAccessibility(page: Page): Promise<{
  hasTitle: boolean;
  hasMainContent: boolean;
  hasHeadings: boolean;
  hasNavigation: boolean;
}> {
  const title = await page.title();
  const mainContent = await page.locator('main, [role="main"], [id="main-content"]').count();
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
  const navigation = await page.locator('nav, [role="navigation"]').count();

  return {
    hasTitle: !!title && title.length > 0,
    hasMainContent: mainContent > 0,
    hasHeadings: headings > 0,
    hasNavigation: navigation > 0,
  };
}

/**
 * Get button information
 */
export async function getButtonInfo(button: Locator): Promise<{
  text: string;
  type: string;
  disabled: boolean;
  visible: boolean;
  ariaLabel: string | null;
}> {
  const text = await button.textContent() || '';
  const type = await button.getAttribute('type') || 'button';
  const disabled = await button.isDisabled();
  const visible = await button.isVisible();
  const ariaLabel = await button.getAttribute('aria-label');

  return {
    text: text.trim(),
    type,
    disabled,
    visible,
    ariaLabel,
  };
}

/**
 * Get link information
 */
export async function getLinkInfo(link: Locator): Promise<{
  text: string;
  href: string | null;
  visible: boolean;
  ariaLabel: string | null;
}> {
  const text = await link.textContent() || '';
  const href = await link.getAttribute('href');
  const visible = await link.isVisible();
  const ariaLabel = await link.getAttribute('aria-label');

  return {
    text: text.trim(),
    href,
    visible,
    ariaLabel,
  };
}

/**
 * Click button safely with error handling
 */
export async function clickButtonSafely(
  page: Page,
  button: Locator,
  buttonInfo: { text: string; type: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (await button.isDisabled()) {
      return { success: false, error: 'Button is disabled' };
    }

    if (!(await button.isVisible())) {
      return { success: false, error: 'Button is not visible' };
    }

    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 5000 });
    
    // Wait a bit for any navigation or state changes
    await page.waitForTimeout(500);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Navigate to page and wait for load
 */
export async function navigateToPage(
  page: Page,
  path: string,
  environment: Environment = 'local',
  waitForSelector?: string
): Promise<void> {
  const baseUrl = getBaseUrl(environment);
  const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;
  
  await page.goto(fullUrl, { waitUntil: 'networkidle' });
  await waitForPageLoad(page);
  
  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout: 10000 });
  }
}

/**
 * Check if page is accessible (not 404, 403, etc.)
 */
export async function checkPageAccess(page: Page): Promise<{
  accessible: boolean;
  status: number;
  error?: string;
}> {
  const response = page.context().pages().find(p => p.url() === page.url());
  const status = response ? 200 : await page.evaluate(() => {
    // Try to detect error pages
    const bodyText = document.body.textContent || '';
    if (bodyText.includes('404') || bodyText.includes('Not Found')) return 404;
    if (bodyText.includes('403') || bodyText.includes('Forbidden') || bodyText.includes('Access Denied')) return 403;
    if (bodyText.includes('401') || bodyText.includes('Unauthorized')) return 401;
    return 200;
  });

  const bodyText = await page.locator('body').textContent() || '';
  const hasError = bodyText.includes('Access Denied') || 
                   bodyText.includes('403') || 
                   bodyText.includes('Unauthorized') ||
                   bodyText.includes('404') ||
                   bodyText.includes('Not Found');

  return {
    accessible: !hasError && status === 200,
    status,
    error: hasError ? 'Page shows error message' : undefined,
  };
}

/**
 * Logout from the application
 */
export async function logout(page: Page, environment: Environment = 'local'): Promise<void> {
  const baseUrl = getBaseUrl(environment);
  
  // Try to find logout button
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), [data-testid="dashboard-logout-button"]').first();
  
  if (await logoutButton.isVisible({ timeout: 5000 })) {
    await logoutButton.click();
    await page.waitForURL(/\/login|\//, { timeout: 10000 });
  } else {
    // Try direct logout API call
    await page.goto(`${baseUrl}/api/auth/signout`, { method: 'POST' });
    await page.goto(`${baseUrl}/login`);
  }
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout waiting for API response: ${urlPattern}`));
    }, timeout);

    page.on('response', (response) => {
      const url = response.url();
      const matches = typeof urlPattern === 'string' 
        ? url.includes(urlPattern)
        : urlPattern.test(url);
      
      if (matches && response.status() === 200) {
        clearTimeout(timeoutId);
        response.json().then(resolve).catch(reject);
      }
    });
  });
}

