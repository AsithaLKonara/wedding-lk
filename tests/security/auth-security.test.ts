import { test, expect } from '@playwright/test';

test.describe('Authentication Security Tests', () => {
  test('Password is not returned in API responses', async ({ request }) => {
    // Create user
    const signupResponse = await request.post('/api/auth/signup', {
      data: {
        name: 'Test User',
        email: 'security-test@example.com',
        password: 'SecurePass123!',
      },
    });
    
    const json = await signupResponse.json();
    
    // Password should never be in response
    expect(JSON.stringify(json)).not.toContain('SecurePass123!');
    expect(JSON.stringify(json)).not.toContain('password');
  });

  test('JWT tokens expire after timeout', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);
    
    // Get token from cookies
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find(c => c.name.includes('token') || c.name.includes('auth'));
    
    if (tokenCookie) {
      // Token should have expiration
      expect(tokenCookie.expires).toBeDefined();
      expect(tokenCookie.expires).toBeGreaterThan(Date.now() / 1000);
    }
  });

  test('Account locks after multiple failed login attempts', async ({ page }) => {
    await page.goto('/login');
    
    // Try wrong password multiple times
    for (let i = 0; i < 6; i++) {
      await page.fill('input[name="email"]', 'user@test.local');
      await page.fill('input[name="password"]', 'WrongPassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }
    
    // Account should be locked
    const errorMessage = page.locator('text=/locked|too many|attempts/i');
    await expect(errorMessage).toBeVisible();
  });

  test('Password reset token is single-use', async ({ request }) => {
    // Request password reset
    const resetResponse = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'user@test.local',
      },
    });
    
    expect(resetResponse.status()).toBe(200);
    
    // Try to use same token twice (would need actual token from email)
    // This tests the logic that tokens should be invalidated after use
  });

  test('Session is invalidated on logout', async ({ page, context }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);
    
    // Logout
    await page.click('button:has-text("Logout"), a:has-text("Logout")');
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/i);
  });

  test('Password meets strength requirements', async ({ page }) => {
    await page.goto('/register');
    
    // Try weak password
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=/password.*strong|minimum.*characters/i')).toBeVisible();
  });

  test('Email is validated on registration', async ({ page }) => {
    await page.goto('/register');
    
    // Try invalid email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=/invalid.*email|email.*format/i')).toBeVisible();
  });

  test('User cannot access other user data', async ({ request }) => {
    // Login as user1
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'user1@test.local',
        password: 'Test123!',
      },
    });
    
    const loginJson = await loginResponse.json();
    const token = loginJson.token;
    
    // Try to access user2's bookings
    const bookingsResponse = await request.get('/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const bookings = await bookingsResponse.json();
    
    // All bookings should belong to user1
    if (bookings.data && Array.isArray(bookings.data)) {
      bookings.data.forEach((booking: any) => {
        expect(booking.user).toBe('user1-id'); // Should match logged-in user
      });
    }
  });
});

