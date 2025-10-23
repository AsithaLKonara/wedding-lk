import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { loginTestUser, createTestUser, seedTestData } from '../helpers/auth-helper';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await seedTestData(page);
  });

  test('User registration -> email verification -> login -> logout', async ({ page }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'TestPass123!',
    };

    // Go to signup
    await page.goto('/register');
    await page.fill('input[name="name"]', user.name);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');

    // Expect redirect to login page with success message
    await expect(page).toHaveURL(/\/login\?message=Registration successful/);

    // Simulate email verification by calling a test helper API endpoint
    // (Your app should expose a test-only endpoint to complete verification in e2e)
    const verificationResponse = await page.request.post('/api/test/complete-verification', { 
      data: { email: user.email } 
    });
    expect(verificationResponse.ok()).toBeTruthy();

    // Go to login
    await page.goto('/login');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Should land on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome, text=Dashboard')).toBeVisible();

    // Logout
    await page.click('[data-testid="logout-button"], button:has-text("Logout"), a:has-text("Logout")');
    await expect(page).toHaveURL('/login');
  });

  test('Login with invalid credentials should show error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-red-600, .error, [data-testid="error-message"]')).toBeVisible();
  });

  test.skip('Forgot password flow - DISABLED (Feature removed)', async ({ page }) => {
    // Forgot password functionality has been removed from the application
    // This test is disabled as the feature no longer exists
  });

  test.skip('Social login with Google - DISABLED (Social login removed)', async ({ page }) => {
    // Social login has been completely removed from the application
    // This test is disabled as the feature no longer exists
  });

  test.skip('Two-factor authentication setup - DISABLED (Feature removed)', async ({ page }) => {
    // Two-factor authentication has been removed from the application
    // This test is disabled as the feature no longer exists
  });

  test('Login with test user credentials', async ({ page }) => {
    // Test login with pre-seeded test user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Login with test vendor credentials', async ({ page }) => {
    // Test login with pre-seeded test vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Login with test admin credentials', async ({ page }) => {
    // Test login with pre-seeded test admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
