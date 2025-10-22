import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Tests', () => {
  test('should register new user successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.fill('input[name="phone"]', '+94771234567');
    
    // Select role
    await page.check('input[value="user"]');
    
    // Accept terms
    await page.check('input[name="agreeToTerms"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or show success message
    await expect(page).toHaveURL(/dashboard|success/);
  });

  test('should register vendor successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill basic info
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Vendor');
    await page.fill('input[name="email"]', `vendor${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
    await page.fill('input[name="phone"]', '+94771234567');
    
    // Select vendor role
    await page.check('input[value="vendor"]');
    
    // Accept terms
    await page.check('input[name="agreeToTerms"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to vendor registration or dashboard
    await expect(page).toHaveURL(/vendor|dashboard/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[role="alert"], .error, .alert')).toBeVisible();
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Fill email
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=reset link|email sent|check your email')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page).toHaveURL(/dashboard/);
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout"), a[href*="logout"], button[aria-label*="logout"]');
    await logoutButton.click();
    
    // Should redirect to login or homepage
    await expect(page).toHaveURL(/login|home|$/);
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should handle role-based redirects', async ({ page }) => {
    // Test different user roles
    const roles = ['user', 'vendor', 'admin', 'wedding_planner'];
    
    for (const role of roles) {
      await page.goto(`/login?role=${role}`);
      
      // Should show appropriate login form or redirect
      await expect(page).toHaveURL(/login|dashboard/);
    }
  });
});








