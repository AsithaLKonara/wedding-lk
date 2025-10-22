import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Vendor Management', () => {
  test('Vendor registration and onboarding', async ({ page }) => {
    const vendor = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      businessName: faker.company.name(),
      phone: faker.phone.number(),
      category: 'photographer',
    };

    // Register as vendor
    await page.goto('/vendor/register');
    await page.fill('input[name="name"]', vendor.name);
    await page.fill('input[name="email"]', vendor.email);
    await page.fill('input[name="businessName"]', vendor.businessName);
    await page.fill('input[name="phone"]', vendor.phone);
    await page.selectOption('select[name="category"]', vendor.category);
    await page.fill('input[name="password"]', 'VendorPass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.success, .toast-success')).toBeVisible();

    // Complete verification
    await page.request.post('/api/test/complete-verification', { 
      data: { email: vendor.email } 
    });

    // Login as vendor
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', vendor.email);
    await page.fill('input[name="password"]', 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Vendor service creation and portfolio upload', async ({ page }) => {
    // Login as vendor
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Create service
    await page.goto('/dashboard/vendor/services');
    await page.click('text=Create Service, [data-testid="create-service"]');
    
    await page.fill('input[name="title"]', 'Wedding Photography Premium');
    await page.fill('textarea[name="description"]', 'Premium wedding photography package with 8 hours coverage, 500+ edited photos, and online gallery');
    await page.fill('input[name="price"]', '75000');
    await page.fill('input[name="duration"]', '8 hours');
    
    // Upload portfolio images
    await page.setInputFiles('input[type="file"]', [
      'tests/fixtures/portfolio1.jpg',
      'tests/fixtures/portfolio2.jpg',
      'tests/fixtures/portfolio3.jpg'
    ]);
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Service created successfully')).toBeVisible();
  });

  test('Vendor booking management', async ({ page }) => {
    // Login as vendor
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Create a test booking via API
    const bookingResponse = await page.request.post('/api/test/create-booking', {
      data: {
        vendorEmail: process.env.TEST_VENDOR_EMAIL || 'vendor@test.local',
        date: '2026-01-15',
        time: '10:00',
        package: 'Wedding Photography Premium',
        customer: { 
          name: 'Test Couple', 
          email: 'couple@test.local',
          phone: '+94771234567'
        },
        guestCount: 150,
        venue: 'Test Venue, Colombo'
      }
    });
    expect(bookingResponse.ok()).toBeTruthy();

    // Go to bookings and manage
    await page.goto('/dashboard/vendor/bookings');
    await expect(page.locator('text=Pending Bookings')).toBeVisible();
    
    // Accept booking
    await page.click('button:has-text("Accept"), [data-testid="accept-booking"]');
    await expect(page.locator('text=Booking accepted')).toBeVisible();
    
    // Check booking status
    await page.goto('/dashboard/vendor/bookings');
    await expect(page.locator('text=Confirmed')).toBeVisible();
  });

  test('Vendor profile and portfolio management', async ({ page }) => {
    // Login as vendor
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Update profile
    await page.goto('/dashboard/vendor/profile');
    await page.fill('textarea[name="bio"]', 'Professional wedding photographer with 10+ years experience');
    await page.fill('input[name="website"]', 'https://myphotography.com');
    await page.fill('input[name="instagram"]', '@myphotography');
    
    // Upload profile image
    await page.setInputFiles('input[type="file"][name="avatar"]', 'tests/fixtures/vendor-avatar.jpg');
    
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('Vendor analytics and performance tracking', async ({ page }) => {
    // Login as vendor
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', process.env.TEST_VENDOR_EMAIL || 'vendor@test.local');
    await page.fill('input[name="password"]', process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Check analytics dashboard
    await page.goto('/dashboard/vendor/analytics');
    await expect(page.locator('text=Performance Overview')).toBeVisible();
    await expect(page.locator('text=Total Bookings')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Reviews')).toBeVisible();
  });
});
