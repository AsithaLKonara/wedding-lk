import { test, expect } from '@playwright/test';
import { createTestVendor, loginAsVendor } from '../helpers/test-helpers';

const TEST_VENDOR = {
  email: 'vendor@test.local',
  password: 'Test123!',
  role: 'vendor'
};

test.describe('Vendor Onboarding Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Complete vendor registration flow', async ({ page }) => {
    // Step 1: Navigate to vendor registration
    await page.click('text=Register as Vendor');
    await expect(page).toHaveURL(/.*vendor.*register|.*register.*vendor/i);

    // Step 2: Fill vendor registration form
    await page.fill('input[name="businessName"]', 'Wedding Photography Co');
    await page.fill('input[name="email"]', 'newvendor@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="phone"]', '+94771234567');
    await page.selectOption('select[name="category"]', 'photography');
    await page.fill('textarea[name="description"]', 'Professional wedding photography services with 10+ years of experience');
    await page.fill('input[name="location"]', 'Colombo');

    // Step 3: Submit registration
    await page.click('button[type="submit"]');
    
    // Step 4: Wait for success message
    await expect(page.locator('text=/success|registered|created/i')).toBeVisible({ timeout: 10000 });
  });

  test('Vendor completes profile after registration', async ({ page }) => {
    // Login as vendor
    await loginAsVendor(page);

    // Navigate to vendor dashboard
    await page.goto('/dashboard/vendor');
    await expect(page).toHaveURL(/.*dashboard.*vendor/i);

    // Complete profile
    await page.click('text=Complete Profile');
    
    // Add services
    await page.click('text=Add Service');
    await page.fill('input[name="serviceName"]', 'Wedding Photography Basic');
    await page.fill('input[name="servicePrice"]', '45000');
    await page.fill('textarea[name="serviceDescription"]', '6 hours coverage with 300+ edited photos');
    await page.click('button:has-text("Save Service")');

    // Add portfolio images
    await page.click('text=Add Portfolio');
    // Note: File upload would need actual file handling

    // Set availability
    await page.click('text=Set Availability');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await page.fill('input[type="date"]', futureDate.toISOString().split('T')[0]);
    await page.check('input[name="isAvailable"]');
    await page.click('button:has-text("Save Availability")');

    // Verify profile completion
    await expect(page.locator('text=/profile.*complete|onboarding.*complete/i')).toBeVisible();
  });

  test('Vendor adds services to profile', async ({ page }) => {
    await loginAsVendor(page);
    await page.goto('/dashboard/vendor/services');

    // Add first service
    await page.click('button:has-text("Add Service")');
    await page.fill('input[name="name"]', 'Wedding Photography Premium');
    await page.fill('input[name="price"]', '75000');
    await page.fill('textarea[name="description"]', '8 hours coverage with 500+ edited photos and online gallery');
    await page.fill('input[name="duration"]', '8 hours');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Wedding Photography Premium')).toBeVisible();
  });

  test('Vendor uploads portfolio images', async ({ page }) => {
    await loginAsVendor(page);
    await page.goto('/dashboard/vendor/portfolio');

    // Click upload button
    await page.click('button:has-text("Upload")');
    
    // Note: Actual file upload testing would require file fixtures
    // This tests the UI flow
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('Vendor sets availability calendar', async ({ page }) => {
    await loginAsVendor(page);
    await page.goto('/dashboard/vendor/availability');

    // Select dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
    await page.fill('input[name="endDate"]', endDate.toISOString().split('T')[0]);
    await page.check('input[name="isAvailable"]');
    await page.click('button:has-text("Save Availability")');

    await expect(page.locator('text=/availability.*saved|updated/i')).toBeVisible();
  });

  test('Admin approves vendor registration', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);

    // Navigate to vendor management
    await page.goto('/dashboard/admin/vendors');
    
    // Find pending vendor
    await page.click('text=Pending');
    
    // Approve vendor
    const vendorRow = page.locator('tr').filter({ hasText: 'Wedding Photography Co' });
    await vendorRow.locator('button:has-text("Approve")').click();
    
    // Confirm approval
    await page.click('button:has-text("Confirm")');
    
    await expect(page.locator('text=/approved|verified/i')).toBeVisible();
  });

  test('Vendor receives first booking notification', async ({ page }) => {
    await loginAsVendor(page);
    await page.goto('/dashboard/vendor');

    // Check for booking notification
    const notificationBell = page.locator('[data-testid="notification-bell"]');
    if (await notificationBell.isVisible()) {
      await notificationBell.click();
      await expect(page.locator('text=/new.*booking|booking.*request/i')).toBeVisible();
    }
  });
});

