// Accessibility Testing Suite
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Home page should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Login page should not have accessibility violations', async ({ page }) => {
    await page.goto('/auth/signin');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Register page should not have accessibility violations', async ({ page }) => {
    await page.goto('/register');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Vendors page should not have accessibility violations', async ({ page }) => {
    await page.goto('/vendors');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Venues page should not have accessibility violations', async ({ page }) => {
    await page.goto('/venues');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Search page should not have accessibility violations', async ({ page }) => {
    await page.goto('/search');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Feed page should not have accessibility violations', async ({ page }) => {
    await page.goto('/feed');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Dashboard should not have accessibility violations', async ({ page }) => {
    // Mock authentication for dashboard access
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Forms should have proper labels and ARIA attributes', async ({ page }) => {
    await page.goto('/register');
    
    // Check form labels
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('aria-label');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Check required field indicators
    const requiredFields = page.locator('[required]');
    const count = await requiredFields.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test skip links
    const skipLink = page.locator('a[href="#main-content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Focus indicators should be visible', async ({ page }) => {
    await page.goto('/');
    
    // Focus on first interactive element
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check if focus indicator is visible
    const focusStyles = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineColor: styles.outlineColor,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
      };
    });
    
    expect(focusStyles.outline).not.toBe('none');
  });

  test('Page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Check heading order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    
    let currentLevel = 0;
    for (let i = 0; i < count; i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
      const level = parseInt(tagName.substring(1));
      
      expect(level).toBeGreaterThanOrEqual(currentLevel - 1);
      currentLevel = level;
    }
  });

  test('Interactive elements should be large enough', async ({ page }) => {
    await page.goto('/');
    
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = interactiveElements.nth(i);
      const box = await element.boundingBox();
      
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44); // Minimum 44px width
        expect(box.height).toBeGreaterThanOrEqual(44); // Minimum 44px height
      }
    }
  });

  test('Page should be readable at 200% zoom', async ({ page }) => {
    await page.goto('/');
    
    // Set zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Screen reader should announce page title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Form validation should be accessible', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit form without filling required fields
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for error messages
    const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
    
    // Check if error messages are associated with form fields
    for (let i = 0; i < count; i++) {
      const error = errorMessages.nth(i);
      const ariaDescribedBy = await error.getAttribute('aria-describedby');
      const id = await error.getAttribute('id');
      
      expect(ariaDescribedBy || id).toBeTruthy();
    }
  });
});


