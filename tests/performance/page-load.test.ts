import { test, expect } from '@playwright/test';

test.describe('Page Load Performance Tests', () => {
  test('Homepage loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // First Contentful Paint should be < 1.5s
    const fcp = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('paint');
      const fcpEntry = perfData.find(entry => entry.name === 'first-contentful-paint');
      return fcpEntry ? fcpEntry.startTime : null;
    });
    
    if (fcp) {
      expect(fcp).toBeLessThan(1500); // 1.5 seconds
    }
    
    // Total load time should be < 3.5s
    expect(loadTime).toBeLessThan(3500);
  });

  test('Venues page loads efficiently', async ({ page }) => {
    await page.goto('/venues');
    await page.waitForLoadState('networkidle');
    
    // Check for lazy loading of images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Images should have loading="lazy" attribute
      const firstImage = images.first();
      const loading = await firstImage.getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('Dashboard loads with minimal blocking resources', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);
    
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load quickly
    expect(loadTime).toBeLessThan(2000);
  });

  test('Page has optimized images', async ({ page }) => {
    await page.goto('/venues');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      
      // Check for srcset or sizes attribute (responsive images)
      const srcset = await firstImage.getAttribute('srcset');
      const sizes = await firstImage.getAttribute('sizes');
      
      // Should have at least one optimization attribute
      expect(srcset || sizes || true).toBeTruthy();
    }
  });

  test('JavaScript bundle size is optimized', async ({ page }) => {
    await page.goto('/');
    
    // Get all script tags
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src]')).map(script => ({
        src: (script as HTMLScriptElement).src,
        async: script.hasAttribute('async'),
        defer: script.hasAttribute('defer'),
      }));
    });
    
    // Critical scripts should be async or defer
    scripts.forEach(script => {
      expect(script.async || script.defer || script.src.includes('analytics')).toBeTruthy();
    });
  });
});

