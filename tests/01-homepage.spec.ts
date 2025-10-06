import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
         await expect(page).toHaveTitle(/Wedding Dreams Lanka/);
    
    // Check for key elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for navigation links
    await expect(page.locator('a[href="/venues"]')).toBeVisible();
    await expect(page.locator('a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('a[href="/packages"]')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to venues
    await page.click('a[href="/venues"]');
    await expect(page).toHaveURL(/.*\/venues/);
    
    await page.goBack();
    
    // Test navigation to vendors
    await page.click('a[href="/vendors"]');
    await expect(page).toHaveURL(/.*\/vendors/);
    
    await page.goBack();
    
    // Test navigation to packages
    await page.click('a[href="/packages"]');
    await expect(page).toHaveURL(/.*\/packages/);
  });

  test('should have login and register links', async ({ page }) => {
    await page.goto('/');
    
    // Check for auth links
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });
});



test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
         await expect(page).toHaveTitle(/Wedding Dreams Lanka/);
    
    // Check for key elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for navigation links
    await expect(page.locator('a[href="/venues"]')).toBeVisible();
    await expect(page.locator('a[href="/vendors"]')).toBeVisible();
    await expect(page.locator('a[href="/packages"]')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to venues
    await page.click('a[href="/venues"]');
    await expect(page).toHaveURL(/.*\/venues/);
    
    await page.goBack();
    
    // Test navigation to vendors
    await page.click('a[href="/vendors"]');
    await expect(page).toHaveURL(/.*\/vendors/);
    
    await page.goBack();
    
    // Test navigation to packages
    await page.click('a[href="/packages"]');
    await expect(page).toHaveURL(/.*\/packages/);
  });

  test('should have login and register links', async ({ page }) => {
    await page.goto('/');
    
    // Check for auth links
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });
});
