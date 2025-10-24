import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Booking System', () => {
  test.skip('DISABLED: booking flow with payment mock', async ({ page }) => {
    const customer = { 
      name: faker.person.fullName(), 
      email: faker.internet.email(),
      phone: faker.phone.number()
    };
    
    await page.goto('/');

    // Search for vendors/venues
    await page.fill('input[placeholder*="Search"], input[name="search"]', 'photography');
    await page.click('button:has-text("Search"), button[type="submit"]');

    // Select a vendor
    await page.click('.vendor-card:first-child, [data-testid="vendor-card"]:first-child');
    await expect(page.locator('text=Book Now, [data-testid="book-button"]')).toBeVisible();
    await page.click('text=Book Now, [data-testid="book-button"]');

    // Fill booking form
    await page.fill('input[name="customerName"]', customer.name);
    await page.fill('input[name="customerEmail"]', customer.email);
    await page.fill('input[name="customerPhone"]', customer.phone);
    await page.fill('input[name="eventDate"]', '2026-02-12');
    await page.fill('input[name="eventTime"]', '10:00');
    await page.fill('input[name="guestCount"]', '120');
    await page.fill('textarea[name="specialRequests"]', 'Outdoor ceremony and indoor reception');
    
    // Select package
    await page.click('input[name="package"][value="premium"]');
    
    await page.click('button:has-text("Continue to Payment")');

    // Mock payment endpoints
    await page.route('**/api/payments/create-intent', route =>
      route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ clientSecret: 'pi_test_secret_123' }) 
      })
    );
    
    await page.route('**/api/payments/confirm', route =>
      route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ 
          status: 'succeeded', 
          transactionId: 'tx_123456789',
          paymentIntentId: 'pi_123456789'
        }) 
      })
    );

    // Complete payment
    await page.click('button:has-text("Confirm & Pay")');
    await expect(page.locator('text=Payment successful, text=Booking confirmed')).toBeVisible();
    await expect(page).toHaveURL(/\/booking\/confirmation/);
  });

  test('Booking modification and cancellation', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local');
    await page.fill('input[name="password"]', process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to bookings
    await page.goto('/dashboard/bookings');
    await expect(page.locator('text=My Bookings')).toBeVisible();
    
    // Create test booking first
    const bookingResponse = await page.request.post('/api/test/create-booking', {
      data: {
        vendorId: 'test-vendor-id',
        date: '2026-04-15',
        time: '14:00',
        package: 'Wedding Photography Premium',
        customer: {
          name: 'Test Customer',
          email: 'customer@test.local'
        },
        guestCount: 100
      }
    });
    expect(bookingResponse.ok()).toBeTruthy();

    // Modify booking
    await page.reload();
    await page.click('button:has-text("Modify"), [data-testid="modify-booking"]');
    
    await page.fill('input[name="eventDate"]', '2026-04-20');
    await page.fill('input[name="guestCount"]', '120');
    await page.fill('textarea[name="specialRequests"]', 'Updated requirements');
    
    await page.click('button:has-text("Update Booking")');
    await expect(page.locator('text=Booking updated successfully')).toBeVisible();

    // Cancel booking
    await page.click('button:has-text("Cancel"), [data-testid="cancel-booking"]');
    await page.fill('textarea[name="cancellationReason"]', 'Change of plans');
    await page.click('button:has-text("Confirm Cancellation")');
    await expect(page.locator('text=Booking cancelled')).toBeVisible();
  });

  test('Booking status tracking', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local');
    await page.fill('input[name="password"]', process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to booking details
    await page.goto('/dashboard/bookings');
    await page.click('.booking-item:first-child, [data-testid="booking-item"]:first-child');
    
    // Check booking status
    await expect(page.locator('text=Booking Status')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    
    // Check timeline
    await expect(page.locator('text=Timeline')).toBeVisible();
    await expect(page.locator('.timeline-item, [data-testid="timeline-item"]')).toHaveCount.greaterThan(0);
  });

  test('Vendor booking acceptance workflow', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to vendor bookings
    await page.goto('/dashboard/vendor/bookings');
    await expect(page.locator('text=Vendor Bookings')).toBeVisible();
    
    // Create test booking request
    const bookingRequestResponse = await page.request.post('/api/test/create-booking-request', {
      data: {
        vendorEmail: process.env.TEST_VENDOR_EMAIL || 'vendor@test.local',
        date: '2026-05-10',
        time: '16:00',
        package: 'Wedding Photography Basic',
        customer: {
          name: 'Test Couple',
          email: 'couple@test.local',
          phone: '+94771234567'
        },
        guestCount: 80,
        venue: 'Test Venue, Colombo'
      }
    });
    expect(bookingRequestResponse.ok()).toBeTruthy();

    // Accept booking request
    await page.reload();
    await page.click('button:has-text("Accept"), [data-testid="accept-booking"]');
    await page.fill('textarea[name="vendorNotes"]', 'Looking forward to capturing your special day!');
    await page.click('button:has-text("Confirm Acceptance")');
    
    await expect(page.locator('text=Booking accepted successfully')).toBeVisible();
  });

  test('Booking communication and messaging', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local');
    await page.fill('input[name="password"]', process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to booking messages
    await page.goto('/dashboard/bookings');
    await page.click('.booking-item:first-child, [data-testid="booking-item"]:first-child');
    await page.click('text=Messages, [data-testid="messages-tab"]');
    
    // Send message
    await page.fill('textarea[name="message"]', 'Hi, I have some questions about the photography package.');
    await page.click('button:has-text("Send"), [data-testid="send-message"]');
    
    await expect(page.locator('text=Message sent')).toBeVisible();
    await expect(page.locator('.message-item, [data-testid="message-item"]')).toHaveCount.greaterThan(0);
  });

  test('Booking payment and refund processing', async ({ page }) => {
    // Login as customer
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local');
    await page.fill('input[name="password"]', process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Go to booking payments
    await page.goto('/dashboard/bookings');
    await page.click('.booking-item:first-child, [data-testid="booking-item"]:first-child');
    await page.click('text=Payment, [data-testid="payment-tab"]');
    
    // Check payment status
    await expect(page.locator('text=Payment Status')).toBeVisible();
    await expect(page.locator('text=Paid')).toBeVisible();
    
    // Request refund
    await page.click('button:has-text("Request Refund"), [data-testid="refund-button"]');
    await page.fill('textarea[name="refundReason"]', 'Service not as expected');
    await page.click('button:has-text("Submit Refund Request")');
    
    await expect(page.locator('text=Refund request submitted')).toBeVisible();
  });
});
