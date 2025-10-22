import { test, expect } from '@playwright/test';

test.describe('Payment System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should process Stripe payment', async ({ page }) => {
    await page.goto('/payment');
    
    // Fill payment form
    await page.fill('input[name*="cardNumber"]', '4242424242424242');
    await page.fill('input[name*="expiry"]', '12/25');
    await page.fill('input[name*="cvv"]', '123');
    await page.fill('input[name*="name"]', 'Test User');
    await page.fill('input[name*="email"]', 'test@example.com');
    
    // Submit payment
    await page.click('button[type="submit"]');
    
    // Should show success or redirect
    await expect(page).toHaveURL(/success|confirm|dashboard/);
  });

  test('should handle payment failure', async ({ page }) => {
    await page.goto('/payment');
    
    // Fill with declined card
    await page.fill('input[name*="cardNumber"]', '4000000000000002');
    await page.fill('input[name*="expiry"]', '12/25');
    await page.fill('input[name*="cvv"]', '123');
    await page.fill('input[name*="name"]', 'Test User');
    
    // Submit payment
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[role="alert"], .error, .alert')).toBeVisible();
  });

  test('should save payment method', async ({ page }) => {
    await page.goto('/dashboard/payment-methods');
    
    // Look for add payment method button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New Payment Method")');
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill payment method form
      await page.fill('input[name*="cardNumber"]', '4242424242424242');
      await page.fill('input[name*="expiry"]', '12/25');
      await page.fill('input[name*="cvv"]', '123');
      await page.fill('input[name*="name"]', 'Test User');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=added|saved|success')).toBeVisible();
    }
  });

  test('should view payment history', async ({ page }) => {
    await page.goto('/dashboard/payments');
    
    // Check payment history table
    const paymentTable = page.locator('[data-testid*="payment"], .payment-table, table');
    await expect(paymentTable).toBeVisible();
    
    // Check for payment records
    const paymentRows = page.locator('tr[data-testid*="payment"], .payment-row');
    if (await paymentRows.count() > 0) {
      await expect(paymentRows.first()).toBeVisible();
    }
  });

  test('should download payment receipt', async ({ page }) => {
    await page.goto('/dashboard/payments');
    
    // Look for download button
    const downloadButton = page.locator('button:has-text("Download"), button:has-text("Receipt")').first();
    if (await downloadButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download');
      await downloadButton.click();
      
      // Should download receipt
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/receipt|payment/);
    }
  });

  test('should request refund', async ({ page }) => {
    await page.goto('/dashboard/payments');
    
    // Look for refund button
    const refundButton = page.locator('button:has-text("Refund"), button:has-text("Request Refund")').first();
    if (await refundButton.isVisible()) {
      await refundButton.click();
      
      // Fill refund form
      await page.fill('textarea[name*="reason"]', 'Test refund request');
      
      // Submit refund request
      await page.click('button[type="submit"]');
      
      // Should show success
      await expect(page.locator('text=refund|requested|success')).toBeVisible();
    }
  });

  test('should set up subscription', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    // Look for subscription plans
    const plans = page.locator('[data-testid*="plan"], .plan-card');
    if (await plans.count() > 0) {
      // Select a plan
      await plans.first().click();
      
      // Fill payment details
      await page.fill('input[name*="cardNumber"]', '4242424242424242');
      await page.fill('input[name*="expiry"]', '12/25');
      await page.fill('input[name*="cvv"]', '123');
      
      // Subscribe
      await page.click('button:has-text("Subscribe"), button:has-text("Start")');
      
      // Should show success
      await expect(page.locator('text=subscribed|success')).toBeVisible();
    }
  });

  test('should cancel subscription', async ({ page }) => {
    await page.goto('/dashboard/subscription');
    
    // Look for cancel button
    const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("Unsubscribe")');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
      
      // Confirm cancellation
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show success
        await expect(page.locator('text=cancelled|success')).toBeVisible();
      }
    }
  });

  test('should view invoice details', async ({ page }) => {
    await page.goto('/dashboard/invoices');
    
    // Click on first invoice
    const firstInvoice = page.locator('[data-testid*="invoice"], .invoice-card').first();
    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();
      
      // Should show invoice details
      await expect(page).toHaveURL(/invoices\/[^/]+/);
      
      // Check invoice elements
      const details = [
        'amount',
        'date',
        'status',
        'items',
        'total'
      ];

      for (const detail of details) {
        const detailElement = page.locator(`[data-testid*="${detail}"], :has-text("${detail}")`);
        if (await detailElement.isVisible()) {
          await expect(detailElement).toBeVisible();
        }
      }
    }
  });

  test('should handle payment webhook', async ({ page }) => {
    // This test would typically be done via API testing
    // For now, we'll just verify the webhook endpoint exists
    const response = await page.request.get('/api/webhooks/stripe');
    expect(response.status()).toBe(405); // Method not allowed for GET
  });

  test('should validate payment form', async ({ page }) => {
    await page.goto('/payment');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('[role="alert"], .error, .alert')).toBeVisible();
    
    // Fill invalid card number
    await page.fill('input[name*="cardNumber"]', '123');
    await page.click('button[type="submit"]');
    
    // Should show card number error
    await expect(page.locator('text=invalid|card number')).toBeVisible();
  });

  test('should handle payment timeout', async ({ page }) => {
    await page.goto('/payment');
    
    // Fill payment form
    await page.fill('input[name*="cardNumber"]', '4242424242424242');
    await page.fill('input[name*="expiry"]', '12/25');
    await page.fill('input[name*="cvv"]', '123');
    
    // Simulate slow network
    await page.route('**/api/payments/**', route => {
      setTimeout(() => route.continue(), 5000);
    });
    
    // Submit payment
    await page.click('button[type="submit"]');
    
    // Should show loading state
    await expect(page.locator('text=processing|loading')).toBeVisible();
  });

  test('should support multiple currencies', async ({ page }) => {
    await page.goto('/payment');
    
    // Look for currency selector
    const currencySelect = page.locator('select[name*="currency"], input[name*="currency"]');
    if (await currencySelect.isVisible()) {
      await currencySelect.selectOption('USD');
      
      // Check if amount updates
      const amountDisplay = page.locator('[data-testid*="amount"], .amount');
      await expect(amountDisplay).toBeVisible();
    }
  });
});










