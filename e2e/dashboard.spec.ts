import { test, expect } from '@playwright/test';

test.describe('Dashboard Access Control', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL('/login');
    
    // Try to access vendor dashboard without authentication
    await page.goto('/dashboard/vendor');
    await expect(page).toHaveURL('/login');
    
    // Try to access user dashboard without authentication
    await page.goto('/dashboard/user');
    await expect(page).toHaveURL('/login');
  });

  test('should allow admin access to admin dashboard', async ({ page }) => {
    // Mock admin session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'admin-id',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }));
    });

    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL('/dashboard/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('should deny vendor access to admin dashboard', async ({ page }) => {
    // Mock vendor session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'vendor-id',
        name: 'Vendor User',
        email: 'vendor@example.com',
        role: 'vendor'
      }));
    });

    await page.goto('/dashboard/admin');
    // Should redirect to vendor dashboard or show access denied
    await expect(page).not.toHaveURL('/dashboard/admin');
  });

  test('should allow vendor access to vendor dashboard', async ({ page }) => {
    // Mock vendor session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'vendor-id',
        name: 'Vendor User',
        email: 'vendor@example.com',
        role: 'vendor'
      }));
    });

    await page.goto('/dashboard/vendor');
    await expect(page).toHaveURL('/dashboard/vendor');
    await expect(page.locator('text=Vendor Dashboard')).toBeVisible();
  });

  test('should allow user access to user dashboard', async ({ page }) => {
    // Mock user session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-id',
        name: 'User',
        email: 'user@example.com',
        role: 'user'
      }));
    });

    await page.goto('/dashboard/user');
    await expect(page).toHaveURL('/dashboard/user');
    await expect(page.locator('text=User Dashboard')).toBeVisible();
  });
});

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }));
    });
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.goto('/dashboard/user');
    
    // Test navigation to different sections
    await page.click('text=Bookings');
    await expect(page).toHaveURL('/dashboard/user/bookings');
    
    await page.click('text=Profile');
    await expect(page).toHaveURL('/dashboard/user/profile');
    
    await page.click('text=Settings');
    await expect(page).toHaveURL('/dashboard/user/settings');
  });

  test('should display user profile information', async ({ page }) => {
    await page.goto('/dashboard/user/profile');
    
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();
  });
});

test.describe('Vendor Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock vendor session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'vendor-id',
        name: 'Vendor User',
        email: 'vendor@example.com',
        role: 'vendor'
      }));
    });
  });

  test('should display vendor analytics', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/analytics/vendor', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalBookings: 25,
            totalRevenue: 1250000,
            averageRating: 4.5,
            monthlyBookings: 8,
            monthlyRevenue: 400000,
            topVenues: [],
            recentReviews: []
          }
        })
      });
    });

    await page.goto('/dashboard/vendor/analytics');
    
    await expect(page.locator('text=25')).toBeVisible(); // Total bookings
    await expect(page.locator('text=LKR 1,250,000')).toBeVisible(); // Total revenue
    await expect(page.locator('text=4.5')).toBeVisible(); // Average rating
  });

  test('should display vendor bookings', async ({ page }) => {
    await page.goto('/dashboard/vendor/bookings');
    
    await expect(page.locator('text=Bookings')).toBeVisible();
    // Should show bookings table or empty state
  });

  test('should display vendor venues', async ({ page }) => {
    await page.goto('/dashboard/vendor/venues');
    
    await expect(page.locator('text=Venues')).toBeVisible();
    // Should show venues list or empty state
  });
});

test.describe('Admin Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin session
    await page.addInitScript(() => {
      window.localStorage.setItem('user', JSON.stringify({
        id: 'admin-id',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }));
    });
  });

  test('should display admin analytics', async ({ page }) => {
    // Mock analytics API response
    await page.route('**/api/analytics?type=overview', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalUsers: 150,
            totalVendors: 25,
            totalVenues: 50,
            totalBookings: 200,
            totalRevenue: 5000000,
            averageRating: 4.3,
            conversionRate: 15.5,
            monthlyGrowth: {
              users: 12.5,
              vendors: 8.3,
              bookings: 25.0,
              revenue: 18.7
            }
          }
        })
      });
    });

    await page.goto('/dashboard/admin/analytics');
    
    await expect(page.locator('text=150')).toBeVisible(); // Total users
    await expect(page.locator('text=25')).toBeVisible(); // Total vendors
    await expect(page.locator('text=200')).toBeVisible(); // Total bookings
    await expect(page.locator('text=LKR 5,000,000')).toBeVisible(); // Total revenue
  });

  test('should display user management', async ({ page }) => {
    await page.goto('/dashboard/admin/users');
    
    await expect(page.locator('text=User Management')).toBeVisible();
    // Should show users table
  });

  test('should display vendor management', async ({ page }) => {
    await page.goto('/dashboard/admin/vendors');
    
    await expect(page.locator('text=Vendor Management')).toBeVisible();
    // Should show vendors table
  });
});


