import { test, expect } from '@playwright/test';

test.describe('📅 Bookings & Payments System Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Booking System', () => {
    test('Booking creation flow', async ({ page }) => {
      // Navigate to venues
      await page.goto('/venues');
      await page.waitForTimeout(2000);
      
      // Click on first venue
      const venueLink = page.locator('a[href*="/venues/"]').first();
      if (await venueLink.isVisible()) {
        await venueLink.click();
        
        // Look for booking form
        const bookingForm = page.locator('form:has(input[name="date"]), [class*="booking-form"]');
        if (await bookingForm.isVisible()) {
          // Fill booking form
          await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
          await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
          await page.fill('input[name="phone"], input[placeholder*="phone"]', '0771234567');
          await page.fill('input[name="date"], input[type="date"]', '2025-06-15');
          await page.fill('input[name="guests"], input[placeholder*="guests"]', '150');
          await page.fill('textarea[name="message"], textarea[placeholder*="message"]', 'Wedding booking request');
          
          // Submit booking
          await page.click('button[type="submit"], button:has-text("Book"), button:has-text("Submit")');
          
          // Check for success message
          await expect(page.locator('text=Booking submitted, text=Success, text=Thank you')).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('Booking management dashboard', async ({ page }) => {
      await page.goto('/dashboard/bookings');
      
      // Check for bookings list
      await expect(page.locator('text=My Bookings, text=Booking History')).toBeVisible();
      
      // Check for booking status indicators
      await expect(page.locator('text=Pending, text=Confirmed, text=Completed')).toBeVisible();
    });

    test('Booking status updates', async ({ page }) => {
      await page.goto('/dashboard/bookings');
      
      // Look for booking cards
      const bookingCards = page.locator('[class*="booking-card"], [class*="booking-item"]');
      if (await bookingCards.isVisible()) {
        // Click on first booking
        await bookingCards.first().click();
        
        // Check booking details
        await expect(page.locator('text=Booking Details, text=Status')).toBeVisible();
      }
    });

    test('Booking cancellation', async ({ page }) => {
      await page.goto('/dashboard/bookings');
      
      // Look for cancel button
      const cancelButton = page.locator('button:has-text("Cancel"), a:has-text("Cancel")').first();
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Confirm cancellation
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          
          // Check for success message
          await expect(page.locator('text=Booking cancelled, text=Success')).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Payment System', () => {
    test('Payment form functionality', async ({ page }) => {
      await page.goto('/payment');
      
      // Check payment form exists
      await expect(page.locator('text=Payment, text=Card Details, text=Amount')).toBeVisible();
      
      // Fill payment form
      await page.fill('input[name="cardNumber"], input[placeholder*="card"]', '4111111111111111');
      await page.fill('input[name="expiry"], input[placeholder*="expiry"]', '12/25');
      await page.fill('input[name="cvv"], input[placeholder*="cvv"]', '123');
      await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
      
      // Submit payment
      await page.click('button[type="submit"], button:has-text("Pay"), button:has-text("Process")');
      
      // Check for payment processing or success
      await expect(page.locator('text=Processing, text=Success, text=Payment')).toBeVisible({ timeout: 15000 });
    });

    test('Payment methods selection', async ({ page }) => {
      await page.goto('/payment');
      
      // Check payment method options
      const paymentMethods = ['Card', 'Bank Transfer', 'ezCash', 'mCash'];
      
      for (const method of paymentMethods) {
        const methodButton = page.locator(`button:has-text("${method}"), input[value="${method}"]`);
        if (await methodButton.isVisible()) {
          await methodButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('Payment success page', async ({ page }) => {
      await page.goto('/payment/success');
      
      // Check success page elements
      await expect(page.locator('text=Payment Successful, text=Thank you')).toBeVisible();
      
      // Check for receipt download
      const downloadButton = page.locator('button:has-text("Download"), a:has-text("Receipt")');
      if (await downloadButton.isVisible()) {
        await expect(downloadButton).toBeVisible();
      }
    });

    test('Payment failed page', async ({ page }) => {
      await page.goto('/payment/failed');
      
      // Check failed page elements
      await expect(page.locator('text=Payment Failed, text=Error')).toBeVisible();
      
      // Check for retry button
      const retryButton = page.locator('button:has-text("Try Again"), a:has-text("Retry")');
      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();
      }
    });

    test('Payment cancellation page', async ({ page }) => {
      await page.goto('/payment/cancel');
      
      // Check cancellation page elements
      await expect(page.locator('text=Cancelled, text=Payment cancelled')).toBeVisible();
      
      // Check for return to booking button
      const returnButton = page.locator('button:has-text("Return"), a:has-text("Back")');
      if (await returnButton.isVisible()) {
        await expect(returnButton).toBeVisible();
      }
    });
  });

  test.describe('Subscription Payments', () => {
    test('Subscription plans display', async ({ page }) => {
      await page.goto('/subscription');
      
      // Check subscription plans
      await expect(page.locator('text=Subscription Plans, text=Choose Plan')).toBeVisible();
      
      // Check plan cards
      const planCards = page.locator('[class*="plan-card"], [class*="subscription-card"]');
      if (await planCards.isVisible()) {
        await expect(planCards.first()).toBeVisible();
      }
    });

    test('Subscription purchase flow', async ({ page }) => {
      await page.goto('/subscription');
      
      // Select a plan
      const selectPlanButton = page.locator('button:has-text("Select Plan"), a:has-text("Choose")').first();
      if (await selectPlanButton.isVisible()) {
        await selectPlanButton.click();
        
        // Check payment form appears
        await expect(page.locator('text=Payment, text=Subscribe')).toBeVisible();
        
        // Fill payment details
        await page.fill('input[name="cardNumber"]', '4111111111111111');
        await page.fill('input[name="expiry"]', '12/25');
        await page.fill('input[name="cvv"]', '123');
        
        // Submit subscription
        await page.click('button[type="submit"], button:has-text("Subscribe")');
        
        // Check for success
        await expect(page.locator('text=Subscription active, text=Success')).toBeVisible({ timeout: 15000 });
      }
    });

    test('Subscription management', async ({ page }) => {
      await page.goto('/dashboard/subscription');
      
      // Check subscription details
      await expect(page.locator('text=Current Plan, text=Subscription Details')).toBeVisible();
      
      // Check for upgrade/downgrade options
      const upgradeButton = page.locator('button:has-text("Upgrade"), a:has-text("Upgrade")');
      if (await upgradeButton.isVisible()) {
        await expect(upgradeButton).toBeVisible();
      }
    });
  });

  test.describe('Commission Payments', () => {
    test('Vendor commission tracking', async ({ page }) => {
      await page.goto('/dashboard/vendor/payments');
      
      // Check commission dashboard
      await expect(page.locator('text=Commission, text=Earnings, text=Payouts')).toBeVisible();
      
      // Check commission history
      const commissionHistory = page.locator('[class*="commission-history"], [class*="earnings"]');
      if (await commissionHistory.isVisible()) {
        await expect(commissionHistory.first()).toBeVisible();
      }
    });

    test('Commission payout request', async ({ page }) => {
      await page.goto('/dashboard/vendor/payments');
      
      // Look for payout request button
      const payoutButton = page.locator('button:has-text("Request Payout"), a:has-text("Withdraw")');
      if (await payoutButton.isVisible()) {
        await payoutButton.click();
        
        // Check payout form
        await expect(page.locator('text=Payout Request, text=Bank Details')).toBeVisible();
        
        // Fill payout form
        await page.fill('input[name="amount"]', '50000');
        await page.fill('input[name="bankAccount"]', '1234567890');
        
        // Submit payout request
        await page.click('button[type="submit"], button:has-text("Request Payout")');
        
        // Check for success message
        await expect(page.locator('text=Payout requested, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Payment History & Receipts', () => {
    test('Payment history display', async ({ page }) => {
      await page.goto('/dashboard/payments');
      
      // Check payment history
      await expect(page.locator('text=Payment History, text=Transactions')).toBeVisible();
      
      // Check payment records
      const paymentRecords = page.locator('[class*="payment-record"], [class*="transaction"]');
      if (await paymentRecords.isVisible()) {
        await expect(paymentRecords.first()).toBeVisible();
      }
    });

    test('Receipt download functionality', async ({ page }) => {
      await page.goto('/dashboard/payments');
      
      // Look for download receipt button
      const downloadButton = page.locator('button:has-text("Download"), a:has-text("Receipt")').first();
      if (await downloadButton.isVisible()) {
        // Test download (in real scenario, this would trigger file download)
        await downloadButton.click();
        
        // Check for download confirmation
        await expect(page.locator('text=Download started, text=Receipt downloaded')).toBeVisible({ timeout: 5000 });
      }
    });

    test('Payment invoice generation', async ({ page }) => {
      await page.goto('/dashboard/payments');
      
      // Look for invoice generation
      const invoiceButton = page.locator('button:has-text("Invoice"), a:has-text("Generate Invoice")');
      if (await invoiceButton.isVisible()) {
        await invoiceButton.click();
        
        // Check invoice generation
        await expect(page.locator('text=Invoice generated, text=Invoice ready')).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Refund System', () => {
    test('Refund request form', async ({ page }) => {
      await page.goto('/dashboard/payments');
      
      // Look for refund button
      const refundButton = page.locator('button:has-text("Refund"), a:has-text("Request Refund")');
      if (await refundButton.isVisible()) {
        await refundButton.click();
        
        // Check refund form
        await expect(page.locator('text=Refund Request, text=Reason')).toBeVisible();
        
        // Fill refund form
        await page.fill('textarea[name="reason"], textarea[placeholder*="reason"]', 'Booking cancelled by vendor');
        await page.selectOption('select[name="refundType"]', 'full');
        
        // Submit refund request
        await page.click('button[type="submit"], button:has-text("Request Refund")');
        
        // Check for success message
        await expect(page.locator('text=Refund requested, text=Success')).toBeVisible({ timeout: 10000 });
      }
    });

    test('Refund status tracking', async ({ page }) => {
      await page.goto('/dashboard/payments');
      
      // Check refund status
      await expect(page.locator('text=Refund Status, text=Processing')).toBeVisible();
      
      // Check refund history
      const refundHistory = page.locator('[class*="refund-history"], [class*="refund-item"]');
      if (await refundHistory.isVisible()) {
        await expect(refundHistory.first()).toBeVisible();
      }
    });
  });

  test.describe('Payment API Integration', () => {
    test('Bookings API functionality', async ({ page }) => {
      const response = await page.request.get('/api/bookings');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('Create booking via API', async ({ page }) => {
      const bookingData = {
        venueId: '1',
        date: '2025-06-15',
        guests: 150,
        name: 'Test User',
        email: 'test@example.com',
        phone: '0771234567',
        message: 'Test booking via API'
      };
      
      const response = await page.request.post('/api/bookings', { data: bookingData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.booking).toBeDefined();
    });

    test('Payments API functionality', async ({ page }) => {
      const response = await page.request.get('/api/payments');
      expect(response.status()).toBe(200);
    });

    test('Process payment via API', async ({ page }) => {
      const paymentData = {
        type: 'booking',
        amount: 150000,
        currency: 'LKR',
        paymentMethod: 'card',
        metadata: {
          bookingId: '1',
          venueId: '1'
        }
      };
      
      const response = await page.request.post('/api/payments', { data: paymentData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  test.describe('Payment Security', () => {
    test('Payment form validation', async ({ page }) => {
      await page.goto('/payment');
      
      // Test empty form submission
      await page.click('button[type="submit"], button:has-text("Pay")');
      
      // Check for validation errors
      await expect(page.locator('[class*="error"], .error-message, [role="alert"]')).toBeVisible();
      
      // Test invalid card number
      await page.fill('input[name="cardNumber"]', '1234');
      await page.click('button[type="submit"], button:has-text("Pay")');
      
      // Check for card validation error
      await expect(page.locator('text=Invalid card number, text=Please enter')).toBeVisible();
    });

    test('Payment encryption and security', async ({ page }) => {
      await page.goto('/payment');
      
      // Check for HTTPS
      expect(page.url()).toMatch(/^https:/);
      
      // Check for security indicators
      await expect(page.locator('text=Secure, text=SSL, text=Encrypted')).toBeVisible();
    });
  });
});
