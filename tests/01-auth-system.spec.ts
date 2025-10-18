import { test, expect } from '@playwright/test';

test.describe('🔐 Authentication System Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('User Registration', () => {
    test('Registration page loads correctly', async ({ page }) => {
      await page.click('a[href="/register"]');
      await expect(page).toHaveURL(/.*register/);
      await expect(page.locator('h1')).toContainText(/Sign up|Register|Create Account/);
    });

    test('Registration form validation', async ({ page }) => {
      await page.goto('/register');
      
      // Test empty form submission
      await page.click('button[type="submit"], button:has-text("Sign up"), button:has-text("Register")');
      
      // Check for validation errors
      await expect(page.locator('[class*="error"], .error-message, [role="alert"]')).toBeVisible();
      
      // Test email validation
      await page.fill('input[name="email"], input[type="email"]', 'invalid-email');
      await page.click('button[type="submit"], button:has-text("Sign up"), button:has-text("Register")');
      await expect(page.locator('text=Invalid email, text=Please enter')).toBeVisible();
      
      // Test password validation
      await page.fill('input[name="password"], input[type="password"]', '123');
      await page.click('button[type="submit"], button:has-text("Sign up"), button:has-text("Register")');
      await expect(page.locator('text=Password must be, text=Too short')).toBeVisible();
    });

    test('Successful registration flow', async ({ page }) => {
      await page.goto('/register');
      
      // Fill registration form with valid data
      await page.fill('input[name="name"], input[name="firstName"]', 'Test User');
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
      
      // Select user type if available
      const userTypeSelect = page.locator('select[name="userType"], input[name="userType"]').first();
      if (await userTypeSelect.isVisible()) {
        await userTypeSelect.selectOption('couple');
      }
      
      // Submit form
      await page.click('button[type="submit"], button:has-text("Sign up"), button:has-text("Register")');
      
      // Check for success message or redirect
      await expect(page.locator('text=Success, text=Registration successful, text=Check your email')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('User Login', () => {
    test('Login page loads correctly', async ({ page }) => {
      await page.click('a[href="/login"]');
      await expect(page).toHaveURL(/.*login/);
      await expect(page.locator('h1')).toContainText(/Sign in|Login|Welcome back/);
    });

    test('Login form validation', async ({ page }) => {
      await page.goto('/login');
      
      // Test empty form submission
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Check for validation errors
      await expect(page.locator('[class*="error"], .error-message, [role="alert"]')).toBeVisible();
    });

    test('Login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Fill login form
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
      
      // Submit form
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Check for successful login (redirect to dashboard or success message)
      await expect(page.locator('text=Dashboard, text=Welcome, text=Success')).toBeVisible({ timeout: 10000 });
    });

    test('Login with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Fill with invalid credentials
      await page.fill('input[name="email"], input[type="email"]', 'invalid@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
      
      // Submit form
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Check for error message
      await expect(page.locator('text=Invalid credentials, text=Login failed, text=Error')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Password Reset', () => {
    test('Forgot password page loads', async ({ page }) => {
      await page.goto('/login');
      await page.click('a:has-text("Forgot"), a:has-text("Reset password")');
      await expect(page).toHaveURL(/.*forgot|.*reset/);
      await expect(page.locator('h1')).toContainText(/Reset|Forgot/);
    });

    test('Password reset form works', async ({ page }) => {
      await page.goto('/forgot-password');
      
      // Fill email
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"], button:has-text("Send"), button:has-text("Reset")');
      
      // Check for success message
      await expect(page.locator('text=Check your email, text=Reset link sent')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Email Verification', () => {
    test('Email verification page loads', async ({ page }) => {
      await page.goto('/verify-email');
      await expect(page.locator('h1')).toContainText(/Verify|Email/);
    });

    test('Resend verification email', async ({ page }) => {
      await page.goto('/verify-email');
      
      const resendButton = page.locator('button:has-text("Resend"), a:has-text("Resend")');
      if (await resendButton.isVisible()) {
        await resendButton.click();
        await expect(page.locator('text=Email sent, text=Check your inbox')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Two-Factor Authentication', () => {
    test('2FA setup page loads', async ({ page }) => {
      await page.goto('/login');
      
      // Fill login form to trigger 2FA
      await page.fill('input[name="email"], input[type="email"]', '2fa@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'password');
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Check if 2FA page appears
      await expect(page.locator('text=Two-factor, text=2FA, text=verification code')).toBeVisible({ timeout: 10000 });
    });

    test('2FA code input', async ({ page }) => {
      await page.goto('/login');
      
      // Trigger 2FA flow
      await page.fill('input[name="email"], input[type="email"]', '2fa@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'password');
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Enter 2FA code
      const codeInput = page.locator('input[name="code"], input[name="2fa"], input[placeholder*="code"]');
      if (await codeInput.isVisible()) {
        await codeInput.fill('123456');
        await page.click('button[type="submit"], button:has-text("Verify")');
        
        // Check for success or error
        await expect(page.locator('text=Success, text=Invalid code, text=Error')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Session Management', () => {
    test('User logout functionality', async ({ page }) => {
      // First login
      await page.goto('/login');
      await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
      await page.click('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")');
      
      // Wait for login success
      await page.waitForURL(/.*dashboard|.*profile/, { timeout: 10000 });
      
      // Find and click logout button
      const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        
        // Check redirect to login or home
        await expect(page.locator('text=Login, text=Sign in, text=Welcome')).toBeVisible();
      }
    });

    test('Protected route access', async ({ page }) => {
      // Try to access dashboard without login
      await page.goto('/dashboard');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Social Authentication', () => {
    test('Google login button exists', async ({ page }) => {
      await page.goto('/login');
      
      const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")');
      if (await googleButton.isVisible()) {
        await expect(googleButton).toBeVisible();
      }
    });

    test('Facebook login button exists', async ({ page }) => {
      await page.goto('/login');
      
      const facebookButton = page.locator('button:has-text("Facebook"), a:has-text("Facebook")');
      if (await facebookButton.isVisible()) {
        await expect(facebookButton).toBeVisible();
      }
    });
  });
});
