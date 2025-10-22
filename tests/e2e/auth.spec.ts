import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Authentication Flows', () => {
  test('User registration -> email verification -> login -> logout', async ({ page }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'TestPass123!',
    };

    // Go to signup
    await page.goto('/auth/signup');
    await page.fill('input[name="name"]', user.name);
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');

    // Expect redirect/confirmation
    await expect(page.locator('.toast-success, .signup-success, [data-testid="success-message"]')).toBeVisible();

    // Simulate email verification by calling a test helper API endpoint
    // (Your app should expose a test-only endpoint to complete verification in e2e)
    const verificationResponse = await page.request.post('/api/test/complete-verification', { 
      data: { email: user.email } 
    });
    expect(verificationResponse.ok()).toBeTruthy();

    // Go to login
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.click('button[type="submit"]');

    // Should land on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Welcome, text=Dashboard')).toBeVisible();

    // Logout
    await page.click('button[aria-label="Logout"], [data-testid="logout-button"]');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('Login with invalid credentials should show error', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error, .toast-error, [data-testid="error-message"]')).toBeVisible();
  });

  test('Forgot password flow', async ({ page }) => {
    const email = faker.internet.email();
    
    await page.goto('/auth/forgot-password');
    await page.fill('input[name="email"]', email);
    await page.click('button[type="submit"]');

    await expect(page.locator('.success, .toast-success, [data-testid="success-message"]')).toBeVisible();
    
    // Simulate password reset
    const resetResponse = await page.request.post('/api/test/reset-password', { 
      data: { email, newPassword: 'NewPass123!' } 
    });
    expect(resetResponse.ok()).toBeTruthy();
  });

  test('Social login with Google', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Mock Google OAuth
    await page.route('**/api/auth/oauth/google', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          user: { 
            id: 'google_123', 
            email: 'test@gmail.com', 
            name: 'Test User' 
          } 
        })
      });
    });

    await page.click('button[data-testid="google-login"], .google-login-button');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Two-factor authentication setup', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to 2FA setup
    await page.goto('/dashboard/settings');
    await page.click('text=Two-Factor Authentication, [data-testid="2fa-setup"]');
    
    // Mock QR code generation
    await page.route('**/api/auth/2fa/setup', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          qrCode: 'data:image/png;base64,mock-qr-code',
          secret: 'mock-secret-key'
        })
      });
    });

    await expect(page.locator('text=Scan QR Code, [data-testid="qr-code"]')).toBeVisible();
  });
});
