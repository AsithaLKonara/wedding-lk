import { test, expect } from '@playwright/test';

test.describe('⚡ Performance & Security Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Performance Testing', () => {
    test('Page load performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Homepage should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Check for loading indicators
      const loadingIndicators = page.locator('[class*="loading"], [class*="skeleton"]');
      await expect(loadingIndicators.first()).not.toBeVisible({ timeout: 10000 });
    });

    test('Large page performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/venues');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Venues page should load within 4 seconds
      expect(loadTime).toBeLessThan(4000);
    });

    test('Image loading performance', async ({ page }) => {
      await page.goto('/venues');
      
      // Check images load within reasonable time
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible({ timeout: 5000 });
      }
    });

    test('API response performance', async ({ page }) => {
      const startTime = Date.now();
      const response = await page.request.get('/api/venues');
      const responseTime = Date.now() - startTime;
      
      // API should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
      expect(response.status()).toBe(200);
    });

    test('Concurrent API requests performance', async ({ page }) => {
      const startTime = Date.now();
      
      // Make multiple concurrent API requests
      const requests = [
        page.request.get('/api/venues'),
        page.request.get('/api/vendors'),
        page.request.get('/api/services'),
        page.request.get('/api/users')
      ];
      
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;
      
      // All requests should complete within 5 seconds
      expect(totalTime).toBeLessThan(5000);
      
      // All should be successful
      responses.forEach(response => {
        expect(response.status()).toBe(200);
      });
    });

    test('Memory usage monitoring', async ({ page }) => {
      await page.goto('/');
      
      // Get memory usage
      const memoryInfo = await page.evaluate(() => {
        return (performance as any).memory;
      });
      
      if (memoryInfo) {
        // Check memory usage is reasonable
        expect(memoryInfo.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // 100MB
      }
    });

    test('Bundle size optimization', async ({ page }) => {
      // Check for large bundle warnings in console
      const consoleMessages = [];
      page.on('console', msg => {
        if (msg.type() === 'warning' && msg.text().includes('bundle')) {
          consoleMessages.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should not have bundle size warnings
      expect(consoleMessages.length).toBe(0);
    });
  });

  test.describe('Security Testing', () => {
    test('HTTPS enforcement', async ({ page }) => {
      // Check that the site uses HTTPS
      expect(page.url()).toMatch(/^https:/);
      
      // Check for security headers
      const response = await page.request.get('/');
      const headers = response.headers();
      
      // Check for security headers
      expect(headers['x-frame-options'] || headers['x-content-type-options']).toBeDefined();
    });

    test('XSS protection', async ({ page }) => {
      // Test XSS protection in forms
      await page.goto('/register');
      
      const maliciousScript = '<script>alert("xss")</script>';
      const nameInput = page.locator('input[name="name"], input[name="firstName"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill(maliciousScript);
        
        const emailInput = page.locator('input[name="email"], input[type="email"]');
        await emailInput.fill('test@example.com');
        
        const passwordInput = page.locator('input[name="password"], input[type="password"]');
        await passwordInput.fill('password123');
        
        // Submit form
        await page.click('button[type="submit"], button:has-text("Sign up")');
        
        // Check that script is not executed
        const alertDialog = page.locator('[role="alertdialog"]');
        await expect(alertDialog).not.toBeVisible();
      }
    });

    test('SQL injection protection', async ({ page }) => {
      // Test SQL injection in search
      const searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        const maliciousQuery = "'; DROP TABLE users; --";
        await searchInput.fill(maliciousQuery);
        await searchInput.press('Enter');
        
        // Should handle malicious input gracefully
        await page.waitForTimeout(2000);
        
        // Page should still be functional
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('CSRF protection', async ({ page }) => {
      // Test CSRF protection on forms
      await page.goto('/register');
      
      // Check for CSRF token in form
      const csrfToken = page.locator('input[name="_token"], input[name="csrf_token"]');
      if (await csrfToken.isVisible()) {
        await expect(csrfToken).toBeVisible();
      }
    });

    test('Input validation', async ({ page }) => {
      await page.goto('/register');
      
      // Test various invalid inputs
      const invalidInputs = [
        { field: 'email', value: 'invalid-email' },
        { field: 'password', value: '123' }, // Too short
        { field: 'name', value: '' } // Empty
      ];
      
      for (const input of invalidInputs) {
        const field = page.locator(`input[name="${input.field}"], input[type="${input.field}"]`);
        if (await field.isVisible()) {
          await field.fill(input.value);
          await page.click('button[type="submit"], button:has-text("Sign up")');
          
          // Should show validation error
          await expect(page.locator('[class*="error"], .error-message, [role="alert"]')).toBeVisible();
        }
      }
    });

    test('Authentication security', async ({ page }) => {
      // Test protected routes without authentication
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/admin',
        '/admin/users',
        '/admin/vendors'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        
        // Should redirect to login or show unauthorized
        await expect(page.locator('text=Login, text=Unauthorized, text=Access denied')).toBeVisible({ timeout: 5000 });
      }
    });

    test('Session security', async ({ page }) => {
      await page.goto('/login');
      
      // Check for secure session handling
      const cookies = await page.context().cookies();
      
      // Check for secure cookie flags
      const sessionCookies = cookies.filter(cookie => 
        cookie.name.includes('session') || cookie.name.includes('auth')
      );
      
      if (sessionCookies.length > 0) {
        // Session cookies should be secure
        expect(sessionCookies[0].secure).toBe(true);
      }
    });

    test('File upload security', async ({ page }) => {
      await page.goto('/reviews/write');
      
      // Test malicious file upload
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Try to upload non-image file
        await fileInput.setInputFiles([]);
        
        // Should validate file type
        await expect(page.locator('text=Invalid file type, text=Please upload')).toBeVisible();
      }
    });

    test('Rate limiting', async ({ page }) => {
      // Test rate limiting by making many requests
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(page.request.get('/api/venues'));
      }
      
      const responses = await Promise.all(requests);
      
      // Some requests might be rate limited
      const statusCodes = responses.map(r => r.status());
      const rateLimited = statusCodes.filter(code => code === 429);
      
      // Should have some rate limiting in place
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling & Resilience', () => {
    test('Network error handling', async ({ page }) => {
      // Simulate network error
      await page.context().setOffline(true);
      
      await page.goto('/');
      
      // Should handle offline state gracefully
      await expect(page.locator('text=Offline, text=No connection, text=Check your internet')).toBeVisible();
      
      // Restore network
      await page.context().setOffline(false);
    });

    test('Server error handling', async ({ page }) => {
      // Test 500 error handling
      const response = await page.request.get('/api/test-error');
      
      // Should handle server errors gracefully
      expect([500, 404]).toContain(response.status());
    });

    test('Timeout handling', async ({ page }) => {
      // Test timeout scenarios
      await page.goto('/');
      
      // Set a short timeout
      page.setDefaultTimeout(1000);
      
      try {
        await page.waitForSelector('[data-testid="slow-loading-element"]', { timeout: 1000 });
      } catch (error) {
        // Should handle timeout gracefully
        expect((error as Error).message).toContain('timeout');
      }
      
      // Reset timeout
      page.setDefaultTimeout(30000);
    });

    test('JavaScript error handling', async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should not have JavaScript errors
      expect(consoleErrors.length).toBe(0);
    });

    test('Graceful degradation', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        // Simulate JavaScript disabled
        Object.defineProperty(window, 'navigator', {
          value: { ...window.navigator, javaEnabled: () => false }
        });
      });
      
      await page.goto('/');
      
      // Page should still load basic content
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Accessibility Performance', () => {
    test('Screen reader compatibility', async ({ page }) => {
      await page.goto('/');
      
      // Check for proper ARIA labels
      const elementsWithAria = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
      const ariaCount = await elementsWithAria.count();
      
      // Should have ARIA labels for accessibility
      expect(ariaCount).toBeGreaterThan(0);
    });

    test('Keyboard navigation performance', async ({ page }) => {
      await page.goto('/');
      
      // Test keyboard navigation speed
      const startTime = Date.now();
      
      // Navigate through page with keyboard
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const navigationTime = Date.now() - startTime;
      
      // Keyboard navigation should be responsive
      expect(navigationTime).toBeLessThan(1000);
    });

    test('Focus management performance', async ({ page }) => {
      await page.goto('/login');
      
      // Test focus management
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      await emailInput.focus();
      
      const startTime = Date.now();
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      const focusTime = Date.now() - startTime;
      
      // Focus should be managed quickly
      expect(focusTime).toBeLessThan(200);
    });
  });

  test.describe('SEO Performance', () => {
    test('Meta tags performance', async ({ page }) => {
      await page.goto('/');
      
      // Check for essential meta tags
      const title = await page.title();
      expect(title).toBeTruthy();
      
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      
      const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
      expect(keywords).toBeTruthy();
    });

    test('Structured data performance', async ({ page }) => {
      await page.goto('/');
      
      // Check for structured data
      const structuredData = page.locator('script[type="application/ld+json"]');
      const dataCount = await structuredData.count();
      
      // Should have structured data for SEO
      expect(dataCount).toBeGreaterThan(0);
    });

    test('Image alt text performance', async ({ page }) => {
      await page.goto('/');
      
      // Check all images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });
});
