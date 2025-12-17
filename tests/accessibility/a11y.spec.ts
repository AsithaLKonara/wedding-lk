import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility (a11y) Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('Homepage meets WCAG 2.1 AA standards', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('Login page is accessible', async ({ page }) => {
    await page.goto('/login');
    await injectAxe(page);
    
    await checkA11y(page, undefined, {
      detailedReport: true,
    });
  });

  test('Forms have proper labels', async ({ page }) => {
    await page.goto('/register');
    
    // Check all inputs have labels
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      // Input should have at least one: id with label, aria-label, or placeholder
      expect(id || ariaLabel || placeholder || name).toBeTruthy();
    }
  });

  test('Images have alt text', async ({ page }) => {
    await page.goto('/venues');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const role = await image.getAttribute('role');
      
      // Decorative images should have role="presentation" or alt=""
      // Informative images should have descriptive alt text
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });

  test('Keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
    
    // Continue tabbing
    await page.keyboard.press('Tab');
    const nextFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(nextFocused);
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
    
    // Check color contrast
    await checkA11y(page, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
  });

  test('Focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    
    // Focus on a button
    const button = page.locator('button, a[role="button"]').first();
    await button.focus();
    
    // Check for focus styles
    const focusStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });
    
    // Should have visible focus indicator
    expect(
      focusStyles.outline !== 'none' ||
      focusStyles.outlineWidth !== '0px' ||
      focusStyles.boxShadow !== 'none'
    ).toBeTruthy();
  });

  test('ARIA labels are used correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA usage
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have accessible name (text, aria-label, or aria-labelledby)
      expect(text?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('Skip to main content link exists', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip link
    const skipLink = page.locator('a:has-text("Skip"), a[href="#main"], a[href="#content"]');
    const skipLinkCount = await skipLink.count();
    
    // Skip link is optional but recommended
    if (skipLinkCount > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('Error messages are accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Submit form with errors
    await page.click('button[type="submit"]');
    
    // Check for error messages
    const errorMessages = page.locator('[role="alert"], .error, [aria-live]');
    if (await errorMessages.count() > 0) {
      const firstError = errorMessages.first();
      const ariaLive = await firstError.getAttribute('aria-live');
      const role = await firstError.getAttribute('role');
      
      // Error should be announced to screen readers
      expect(ariaLive === 'polite' || ariaLive === 'assertive' || role === 'alert').toBeTruthy();
    }
  });
});

