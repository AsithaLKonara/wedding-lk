import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display registration page correctly', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page).toHaveTitle(/Register/);
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register');
    
    // Fill invalid data
    await page.fill('input[name="name"]', 'A');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123');
    
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    
    // Mock successful login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-id',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          }
        })
      });
    });

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle login errors gracefully', async ({ page }) => {
    await page.goto('/login');
    
    // Mock failed login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      });
    });

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');
    
    // Click on register link
    await page.click('text=Don\'t have an account? Register');
    await expect(page).toHaveURL('/register');
    
    // Click on login link
    await page.click('text=Already have an account? Login');
    await expect(page).toHaveURL('/login');
  });
});


