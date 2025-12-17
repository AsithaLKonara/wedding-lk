import { test, expect } from '@playwright/test';

const TEST_ADMIN = {
  email: 'admin@test.local',
  password: 'Test123!',
  role: 'admin'
};

test.describe('Admin Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // 90 seconds for admin tests (they can be slower)
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_ADMIN.email);
    await page.fill('input[name="password"]', TEST_ADMIN.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i, { timeout: 30000 });
  });

  test('Admin views dashboard statistics', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for stats cards
    await expect(page.locator('text=/total.*users|users.*total/i')).toBeVisible();
    await expect(page.locator('text=/total.*vendors|vendors.*total/i')).toBeVisible();
    await expect(page.locator('text=/total.*bookings|bookings.*total/i')).toBeVisible();
    await expect(page.locator('text=/revenue|income/i')).toBeVisible();
  });

  test('Admin manages users', async ({ page }) => {
    await page.goto('/dashboard/admin/users');
    
    // Search for user
    await page.fill('input[placeholder*="search" i]', 'test@example.com');
    await page.waitForTimeout(500);
    
    // View user details
    await page.click('tr:has-text("test@example.com")');
    await expect(page.locator('text=/user.*details|profile/i')).toBeVisible();
    
    // Edit user
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text=/updated|saved/i')).toBeVisible();
  });

  test('Admin manages vendors', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');
    
    // Filter by status
    await page.click('button:has-text("Pending")');
    await expect(page.locator('tr')).toContainText('pending', { ignoreCase: true });
    
    // Approve vendor
    const pendingVendor = page.locator('tr').filter({ hasText: 'pending' }).first();
    await pendingVendor.locator('button:has-text("Approve")').click();
    await page.click('button:has-text("Confirm")');
    
    await expect(page.locator('text=/approved|verified/i')).toBeVisible();
  });

  test('Admin views platform analytics', async ({ page }) => {
    await page.goto('/dashboard/admin/analytics');
    
    // Check for analytics charts
    await expect(page.locator('canvas, svg, [role="img"]')).toBeVisible();
    
    // Check for date range selector
    await expect(page.locator('input[type="date"]')).toBeVisible();
  });

  test('Admin handles disputes', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Navigate to disputes (if exists)
    const disputesLink = page.locator('a:has-text("Disputes"), button:has-text("Disputes")');
    if (await disputesLink.isVisible()) {
      await disputesLink.click();
      
      // View dispute
      await page.click('tr').first();
      
      // Resolve dispute
      await page.click('button:has-text("Resolve")');
      await page.fill('textarea[name="resolution"]', 'Dispute resolved in favor of customer');
      await page.click('button:has-text("Submit Resolution")');
      
      await expect(page.locator('text=/resolved|closed/i')).toBeVisible();
    }
  });

  test('Admin manages platform settings', async ({ page }) => {
    await page.goto('/dashboard/admin/settings');
    
    // Update settings
    await page.fill('input[name="platformName"]', 'WeddingLK Pro');
    await page.fill('input[name="supportEmail"]', 'support@weddinglk.com');
    await page.click('button:has-text("Save Settings")');
    
    await expect(page.locator('text=/settings.*saved|updated/i')).toBeVisible();
  });

  test('Admin generates reports', async ({ page }) => {
    await page.goto('/dashboard/admin/reports');
    
    // Select report type
    await page.selectOption('select[name="reportType"]', 'revenue');
    
    // Select date range
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    await page.fill('input[name="startDate"]', startDate.toISOString().split('T')[0]);
    await page.fill('input[name="endDate"]', new Date().toISOString().split('T')[0]);
    
    // Generate report
    await page.click('button:has-text("Generate Report")');
    
    await expect(page.locator('text=/report|download/i')).toBeVisible({ timeout: 10000 });
  });
});

