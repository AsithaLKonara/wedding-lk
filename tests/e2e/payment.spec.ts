import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Payment System', () => {
  test.skip('DISABLED: Stripe payment integration with mock', async ({ page }) => {
    const customer = { 
      name: faker.person.fullName(), 
      email: faker.internet.email(),
      phone: faker.phone.number()
    };

    await page.goto('/checkout');
    
    // Fill checkout form
    await page.fill('input[name="customerName"]', customer.name);
    await page.fill('input[name="customerEmail"]', customer.email);
    await page.fill('input[name="customerPhone"]', customer.phone);
    await page.fill('input[name="billingAddress"]', faker.location.streetAddress());
    await page.fill('input[name="city"]', 'Colombo');
    await page.fill('input[name="postalCode"]', '10000');
    
    // Select payment method
    await page.click('input[name="paymentMethod"][value="card"]');
    
    // Mock Stripe payment intent creation
    await page.route('**/api/payments/create-intent', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          clientSecret: 'pi_test_secret_123',
          paymentIntentId: 'pi_123456789'
        })
      });
    });

    // Mock Stripe payment confirmation
    await page.route('**/api/payments/confirm', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'succeeded',
          transactionId: 'tx_123456789',
          paymentIntentId: 'pi_123456789'
        })
      });
    });

    // Fill card details (mocked)
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    await page.fill('input[name="cardholderName"]', customer.name);
    
    await page.click('button:has-text("Pay Now")');
    
    await expect(page.locator('text=Payment successful')).toBeVisible();
    await expect(page).toHaveURL(/\/payments\/success/);
  });

  test.skip('DISABLED: PayHere payment integration', async ({ page }) => {
    await page.goto('/checkout');
    
    // Select PayHere payment method
    await page.click('input[name="paymentMethod"][value="payhere"]');
    
    // Mock PayHere payment
    await page.route('**/api/payments/payhere/create', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paymentUrl: 'https://sandbox.payhere.lk/pay/checkout',
          merchantId: 'test_merchant_123',
          orderId: 'order_123456'
        })
      });
    });

    await page.route('**/api/payments/payhere/callback', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          transactionId: 'payhere_tx_123',
          orderId: 'order_123456'
        })
      });
    });

    await page.click('button:has-text("Pay with PayHere")');
    
    // Simulate PayHere redirect
    await page.goto('/payments/payhere/callback?status=success&order_id=order_123456');
    
    await expect(page.locator('text=Payment successful')).toBeVisible();
  });

  test.skip('DISABLED: Payment failure handling', async ({ page }) => {
    await page.goto('/checkout');
    
    // Mock payment failure
    await page.route('**/api/payments/create-intent', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Payment method declined',
          code: 'card_declined'
        })
      });
    });

    await page.fill('input[name="cardNumber"]', '4000000000000002'); // Declined card
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    
    await page.click('button:has-text("Pay Now")');
    
    await expect(page.locator('text=Payment failed')).toBeVisible();
    await expect(page.locator('text=Your card was declined')).toBeVisible();
  });

  test.skip('DISABLED: Payment refund processing', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_ADMIN_EMAIL || 'admin@test.local');
    await page.fill('input[name="password"]', process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to payment management
    await page.goto('/dashboard/admin/payments');
    await expect(page.locator('text=Payment Management')).toBeVisible();
    
    // Create test payment first
    const paymentResponse = await page.request.post('/api/test/create-payment', {
      data: {
        amount: 50000,
        currency: 'LKR',
        customer: 'test@example.com',
        status: 'completed',
        transactionId: 'tx_test_123'
      }
    });
    expect(paymentResponse.ok()).toBeTruthy();

    // Process refund
    await page.reload();
    await page.click('button:has-text("Refund"), [data-testid="refund-button"]');
    await page.fill('input[name="refundAmount"]', '50000');
    await page.fill('textarea[name="refundReason"]', 'Customer requested refund');
    
    // Mock refund API
    await page.route('**/api/payments/refund', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'refunded',
          refundId: 'rf_123456789',
          amount: 50000
        })
      });
    });
    
    await page.click('button:has-text("Process Refund")');
    await expect(page.locator('text=Refund processed successfully')).toBeVisible();
  });

  test.skip('DISABLED: Payment history and analytics', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local');
    await page.fill('input[name="password"]', process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to payment history
    await page.goto('/dashboard/payments/history');
    await expect(page.locator('text=Payment History')).toBeVisible();
    
    // Check payment records
    await expect(page.locator('.payment-item, [data-testid="payment-item"]')).toHaveCount.greaterThan(0);
    
    // Filter payments
    await page.selectOption('select[name="status"]', 'completed');
    await page.click('button:has-text("Filter")');
    
    await expect(page.locator('.payment-item, [data-testid="payment-item"]')).toHaveCount.greaterThan(0);
  });

  test.skip('DISABLED: Subscription payment management', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to subscription management
    await page.goto('/dashboard/vendor/subscription');
    await expect(page.locator('text=Subscription Management')).toBeVisible();
    
    // Select premium plan
    await page.click('button:has-text("Upgrade to Premium"), [data-testid="upgrade-button"]');
    
    // Mock subscription payment
    await page.route('**/api/payments/subscription', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          subscriptionId: 'sub_123456789',
          status: 'active',
          currentPeriodEnd: '2024-12-31'
        })
      });
    });
    
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    
    await page.click('button:has-text("Subscribe")');
    await expect(page.locator('text=Subscription activated')).toBeVisible();
  });

  test.skip('DISABLED: Payment webhook handling', async ({ page }) => {
    // Test webhook endpoint
    const webhookResponse = await page.request.post('/api/webhooks/stripe', {
      data: {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123456789',
            status: 'succeeded',
            amount: 50000,
            currency: 'lkr'
          }
        }
      }
    });
    
    expect(webhookResponse.ok()).toBeTruthy();
  });
});
