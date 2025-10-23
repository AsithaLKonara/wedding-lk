import { test, expect } from '@playwright/test';

/**
 * 🛡️ COMPREHENSIVE RBAC (ROLE-BASED ACCESS CONTROL) TESTS
 * 
 * This test suite comprehensively tests all RBAC functionality including:
 * - Role-based navigation access
 * - Permission-based feature access
 * - Middleware route protection
 * - API endpoint authorization
 * - UI component visibility based on roles
 */

// Test users with different roles
const testUsers = {
  user: {
    name: 'John User',
    email: 'user@test.com',
    password: 'UserPass123!',
    role: 'user'
  },
  vendor: {
    name: 'Sarah Vendor',
    email: 'vendor@test.com',
    password: 'VendorPass123!',
    role: 'vendor'
  },
  wedding_planner: {
    name: 'Emma Planner',
    email: 'planner@test.com',
    password: 'PlannerPass123!',
    role: 'wedding_planner'
  },
  admin: {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'admin'
  },
  maintainer: {
    name: 'Maintainer User',
    email: 'maintainer@test.com',
    password: 'MaintainerPass123!',
    role: 'maintainer'
  }
};

// Helper function to login with specific role
async function loginAsRole(page: any, role: keyof typeof testUsers) {
  const user = testUsers[role];
  await page.goto('/login');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
}

// Helper function to test navigation access
async function testNavigationAccess(page: any, allowedRoutes: string[], deniedRoutes: string[]) {
  // Test allowed routes
  for (const route of allowedRoutes) {
    await page.goto(route);
    await expect(page.locator('body')).not.toContainText('Access Denied');
    await expect(page.locator('body')).not.toContainText('403');
    await expect(page.locator('body')).not.toContainText('Unauthorized');
  }
  
  // Test denied routes
  for (const route of deniedRoutes) {
    await page.goto(route);
    await expect(page.locator('body')).toContainText(/Access Denied|403|Unauthorized/);
  }
}

test.describe('🔐 User Role RBAC Tests', () => {
  test('User Role - Allowed Access', async ({ page }) => {
    await loginAsRole(page, 'user');
    
    const allowedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/planning',
      '/dashboard/favorites',
      '/dashboard/bookings',
      '/dashboard/messages',
      '/dashboard/payments'
    ];
    
    const deniedRoutes = [
      '/dashboard/admin',
      '/dashboard/admin/users',
      '/dashboard/admin/vendors',
      '/dashboard/admin/reports',
      '/dashboard/admin/settings',
      '/dashboard/vendor/services',
      '/dashboard/vendor/analytics',
      '/dashboard/vendor/boost-campaigns',
      '/dashboard/planner/clients',
      '/dashboard/planner/tasks'
    ];
    
    await testNavigationAccess(page, allowedRoutes, deniedRoutes);
  });

  test('User Role - Navigation Items Visibility', async ({ page }) => {
    await loginAsRole(page, 'user');
    
    // Check that user-specific navigation items are visible
    await expect(page.locator('text=Planning')).toBeVisible();
    await expect(page.locator('text=Favorites')).toBeVisible();
    
    // Check that admin navigation items are not visible
    await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();
    await expect(page.locator('text=User Management')).not.toBeVisible();
    
    // Check that vendor navigation items are not visible
    await expect(page.locator('text=Services')).not.toBeVisible();
    await expect(page.locator('text=Boost Campaigns')).not.toBeVisible();
    
    // Check that planner navigation items are not visible
    await expect(page.locator('text=Tasks')).not.toBeVisible();
    await expect(page.locator('text=Clients')).not.toBeVisible();
  });

  test('User Role - Feature Access Control', async ({ page }) => {
    await loginAsRole(page, 'user');
    
    // Test user can access planning features
    await page.goto('/dashboard/planning');
    await expect(page.locator('text=Wedding Planning')).toBeVisible();
    await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
    
    // Test user can access favorites
    await page.goto('/dashboard/favorites');
    await expect(page.locator('text=My Favorites')).toBeVisible();
    await expect(page.locator('button:has-text("Add to Favorites")')).toBeVisible();
    
    // Test user cannot access admin features
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});

test.describe('🏢 Vendor Role RBAC Tests', () => {
  test('Vendor Role - Allowed Access', async ({ page }) => {
    await loginAsRole(page, 'vendor');
    
    const allowedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/vendor/services',
      '/dashboard/vendor/analytics',
      '/dashboard/vendor/boost-campaigns',
      '/dashboard/vendor/bookings',
      '/dashboard/vendor/messages',
      '/dashboard/vendor/payments'
    ];
    
    const deniedRoutes = [
      '/dashboard/admin',
      '/dashboard/admin/users',
      '/dashboard/admin/vendors',
      '/dashboard/admin/reports',
      '/dashboard/planner/clients',
      '/dashboard/planner/tasks',
      '/dashboard/planning',
      '/dashboard/favorites'
    ];
    
    await testNavigationAccess(page, allowedRoutes, deniedRoutes);
  });

  test('Vendor Role - Navigation Items Visibility', async ({ page }) => {
    await loginAsRole(page, 'vendor');
    
    // Check that vendor-specific navigation items are visible
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Boost Campaigns')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    
    // Check that admin navigation items are not visible
    await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();
    await expect(page.locator('text=User Management')).not.toBeVisible();
    
    // Check that planner navigation items are not visible
    await expect(page.locator('text=Tasks')).not.toBeVisible();
    await expect(page.locator('text=Clients')).not.toBeVisible();
    
    // Check that user-specific items are not visible
    await expect(page.locator('text=Planning')).not.toBeVisible();
    await expect(page.locator('text=Favorites')).not.toBeVisible();
  });

  test('Vendor Role - Feature Access Control', async ({ page }) => {
    await loginAsRole(page, 'vendor');
    
    // Test vendor can access service management
    await page.goto('/dashboard/vendor/services');
    await expect(page.locator('text=My Services')).toBeVisible();
    await expect(page.locator('button:has-text("Add Service")')).toBeVisible();
    
    // Test vendor can access analytics
    await page.goto('/dashboard/vendor/analytics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Booking Statistics')).toBeVisible();
    
    // Test vendor cannot access admin features
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test vendor cannot access planner features
    await page.goto('/dashboard/planner/clients');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});

test.describe('👥 Wedding Planner Role RBAC Tests', () => {
  test('Wedding Planner Role - Allowed Access', async ({ page }) => {
    await loginAsRole(page, 'wedding_planner');
    
    const allowedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/planner/clients',
      '/dashboard/planner/tasks',
      '/dashboard/planner/timeline',
      '/dashboard/bookings',
      '/dashboard/messages',
      '/dashboard/payments'
    ];
    
    const deniedRoutes = [
      '/dashboard/admin',
      '/dashboard/admin/users',
      '/dashboard/admin/vendors',
      '/dashboard/admin/reports',
      '/dashboard/vendor/services',
      '/dashboard/vendor/analytics',
      '/dashboard/planning',
      '/dashboard/favorites'
    ];
    
    await testNavigationAccess(page, allowedRoutes, deniedRoutes);
  });

  test('Wedding Planner Role - Navigation Items Visibility', async ({ page }) => {
    await loginAsRole(page, 'wedding_planner');
    
    // Check that planner-specific navigation items are visible
    await expect(page.locator('text=Tasks')).toBeVisible();
    await expect(page.locator('text=Clients')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    
    // Check that admin navigation items are not visible
    await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();
    await expect(page.locator('text=User Management')).not.toBeVisible();
    
    // Check that vendor navigation items are not visible
    await expect(page.locator('text=Services')).not.toBeVisible();
    await expect(page.locator('text=Boost Campaigns')).not.toBeVisible();
    
    // Check that user-specific items are not visible
    await expect(page.locator('text=Planning')).not.toBeVisible();
    await expect(page.locator('text=Favorites')).not.toBeVisible();
  });

  test('Wedding Planner Role - Feature Access Control', async ({ page }) => {
    await loginAsRole(page, 'wedding_planner');
    
    // Test planner can access client management
    await page.goto('/dashboard/planner/clients');
    await expect(page.locator('text=Client Management')).toBeVisible();
    await expect(page.locator('button:has-text("Add Client")')).toBeVisible();
    
    // Test planner can access task management
    await page.goto('/dashboard/planner/tasks');
    await expect(page.locator('text=Task Management')).toBeVisible();
    await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
    
    // Test planner cannot access admin features
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test planner cannot access vendor features
    await page.goto('/dashboard/vendor/services');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});

test.describe('👑 Admin Role RBAC Tests', () => {
  test('Admin Role - Allowed Access', async ({ page }) => {
    await loginAsRole(page, 'admin');
    
    const allowedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/admin',
      '/dashboard/admin/users',
      '/dashboard/admin/vendors',
      '/dashboard/admin/reports',
      '/dashboard/admin/settings',
      '/dashboard/bookings',
      '/dashboard/messages',
      '/dashboard/payments'
    ];
    
    const deniedRoutes = [
      '/dashboard/vendor/services',
      '/dashboard/vendor/analytics',
      '/dashboard/planner/clients',
      '/dashboard/planner/tasks',
      '/dashboard/planning',
      '/dashboard/favorites'
    ];
    
    await testNavigationAccess(page, allowedRoutes, deniedRoutes);
  });

  test('Admin Role - Navigation Items Visibility', async ({ page }) => {
    await loginAsRole(page, 'admin');
    
    // Check that admin-specific navigation items are visible
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=User Management')).toBeVisible();
    await expect(page.locator('text=Vendor Management')).toBeVisible();
    await expect(page.locator('text=Reports & Analytics')).toBeVisible();
    await expect(page.locator('text=System Settings')).toBeVisible();
    
    // Check that vendor navigation items are not visible
    await expect(page.locator('text=Services')).not.toBeVisible();
    await expect(page.locator('text=Boost Campaigns')).not.toBeVisible();
    
    // Check that planner navigation items are not visible
    await expect(page.locator('text=Tasks')).not.toBeVisible();
    await expect(page.locator('text=Clients')).not.toBeVisible();
    
    // Check that user-specific items are not visible
    await expect(page.locator('text=Planning')).not.toBeVisible();
    await expect(page.locator('text=Favorites')).not.toBeVisible();
  });

  test('Admin Role - Feature Access Control', async ({ page }) => {
    await loginAsRole(page, 'admin');
    
    // Test admin can access user management
    await page.goto('/dashboard/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible();
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
    
    // Test admin can access vendor management
    await page.goto('/dashboard/admin/vendors');
    await expect(page.locator('text=Vendor Management')).toBeVisible();
    await expect(page.locator('button:has-text("Approve Vendor")')).toBeVisible();
    
    // Test admin can access reports
    await page.goto('/dashboard/admin/reports');
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Report")')).toBeVisible();
    
    // Test admin can access system settings
    await page.goto('/dashboard/admin/settings');
    await expect(page.locator('text=System Settings')).toBeVisible();
    await expect(page.locator('button:has-text("Save Settings")')).toBeVisible();
  });
});

test.describe('🔧 Maintainer Role RBAC Tests', () => {
  test('Maintainer Role - Allowed Access', async ({ page }) => {
    await loginAsRole(page, 'maintainer');
    
    const allowedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/admin',
      '/dashboard/admin/users',
      '/dashboard/admin/vendors',
      '/dashboard/admin/reports',
      '/dashboard/admin/settings',
      '/dashboard/bookings',
      '/dashboard/messages',
      '/dashboard/payments',
      '/debug-runtime',
      '/api/debug-db',
      '/api/test-role-access',
      '/api/test-auth',
      '/api/test-dashboard-debug'
    ];
    
    const deniedRoutes = [
      '/dashboard/vendor/services',
      '/dashboard/vendor/analytics',
      '/dashboard/planner/clients',
      '/dashboard/planner/tasks',
      '/dashboard/planning',
      '/dashboard/favorites'
    ];
    
    await testNavigationAccess(page, allowedRoutes, deniedRoutes);
  });

  test('Maintainer Role - Debug Access', async ({ page }) => {
    await loginAsRole(page, 'maintainer');
    
    // Test maintainer can access debug routes
    await page.goto('/debug-runtime');
    await expect(page.locator('text=Debug Runtime')).toBeVisible();
    
    // Test maintainer can access debug API
    await page.goto('/api/debug-db');
    await expect(page.locator('text=Database Debug')).toBeVisible();
  });
});

test.describe('🛡️ Middleware Route Protection Tests', () => {
  test('Unauthenticated Access Protection', async ({ page }) => {
    // Test that unauthenticated users are redirected to login
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/profile',
      '/dashboard/settings',
      '/dashboard/admin',
      '/dashboard/vendor/services',
      '/dashboard/planner/clients'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/auth\/signin/);
    }
  });

  test('Role-Based Route Protection', async ({ page }) => {
    // Test user role protection
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test vendor role protection
    await loginAsRole(page, 'vendor');
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test planner role protection
    await loginAsRole(page, 'wedding_planner');
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test admin role access
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });
});

test.describe('🔌 API Endpoint Authorization Tests', () => {
  test('API Authentication Requirements', async ({ page }) => {
    // Test API endpoints require authentication
    const apiEndpoints = [
      '/api/dashboard/stats',
      '/api/dashboard/activity',
      '/api/users',
      '/api/bookings',
      '/api/payments'
    ];
    
    for (const endpoint of apiEndpoints) {
      const response = await page.request.get(endpoint);
      expect(response.status()).toBe(401);
    }
  });

  test('API Role-Based Authorization', async ({ page }) => {
    // Login as user
    await loginAsRole(page, 'user');
    
    // Test user can access user-specific APIs
    const userResponse = await page.request.get('/api/dashboard/user-stats');
    expect(userResponse.status()).toBe(200);
    
    // Test user cannot access admin APIs
    const adminResponse = await page.request.get('/api/dashboard/admin/stats');
    expect(adminResponse.status()).toBe(403);
    
    // Test user cannot access vendor APIs
    const vendorResponse = await page.request.get('/api/dashboard/vendor/stats');
    expect(vendorResponse.status()).toBe(403);
  });

  test('API Permission-Based Authorization', async ({ page }) => {
    // Login as admin
    await loginAsRole(page, 'admin');
    
    // Test admin can access all APIs
    const adminResponse = await page.request.get('/api/dashboard/admin/stats');
    expect(adminResponse.status()).toBe(200);
    
    const userResponse = await page.request.get('/api/dashboard/user-stats');
    expect(userResponse.status()).toBe(200);
    
    const vendorResponse = await page.request.get('/api/dashboard/vendor/stats');
    expect(vendorResponse.status()).toBe(200);
  });
});

test.describe('🎨 UI Component Visibility Tests', () => {
  test('Dashboard Components Based on Role', async ({ page }) => {
    // Test user dashboard components
    await loginAsRole(page, 'user');
    await page.goto('/dashboard');
    
    // User should see planning and favorites
    await expect(page.locator('text=Wedding Planning')).toBeVisible();
    await expect(page.locator('text=My Favorites')).toBeVisible();
    
    // User should not see admin components
    await expect(page.locator('text=User Management')).not.toBeVisible();
    await expect(page.locator('text=System Analytics')).not.toBeVisible();
  });

  test('Navigation Menu Based on Role', async ({ page }) => {
    // Test vendor navigation menu
    await loginAsRole(page, 'vendor');
    await page.goto('/dashboard');
    
    // Vendor should see service management
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
    
    // Vendor should not see admin menu
    await expect(page.locator('text=Admin Dashboard')).not.toBeVisible();
    await expect(page.locator('text=User Management')).not.toBeVisible();
  });

  test('Action Buttons Based on Permissions', async ({ page }) => {
    // Test admin can see all action buttons
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard/admin/users');
    
    await expect(page.locator('button:has-text("Add User")')).toBeVisible();
    await expect(page.locator('button:has-text("Bulk Actions")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Data")')).toBeVisible();
    
    // Test user cannot see admin action buttons
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/profile');
    
    await expect(page.locator('button:has-text("Add User")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Bulk Actions")')).not.toBeVisible();
  });
});

test.describe('🔄 Role Switching and Session Management', () => {
  test('Role-Based Session Persistence', async ({ page }) => {
    // Login as user
    await loginAsRole(page, 'user');
    await page.goto('/dashboard');
    await expect(page.locator('text=User Dashboard')).toBeVisible();
    
    // Refresh page and verify role persistence
    await page.reload();
    await expect(page.locator('text=User Dashboard')).toBeVisible();
    
    // Logout and login as different role
    await page.click('button:has-text("Logout")');
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('Role-Based Data Filtering', async ({ page }) => {
    // Test admin sees all data
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard/admin/users');
    await expect(page.locator('text=All Users')).toBeVisible();
    
    // Test user sees only their data
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/profile');
    await expect(page.locator('text=My Profile')).toBeVisible();
  });
});

test.describe('🚨 Security and Error Handling', () => {
  test('Unauthorized Access Attempts', async ({ page }) => {
    // Test direct URL access without authentication
    await page.goto('/dashboard/admin/users');
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    // Test role escalation attempts
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/admin/users');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });

  test('Permission Denied Handling', async ({ page }) => {
    // Test graceful permission denied handling
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/admin');
    
    // Should show proper error message
    await expect(page.locator('text=Access Denied')).toBeVisible();
    await expect(page.locator('text=You do not have permission')).toBeVisible();
    
    // Should provide navigation back to allowed areas
    await expect(page.locator('button:has-text("Go to Dashboard")')).toBeVisible();
  });
});

test.describe('📊 Analytics and Reporting RBAC', () => {
  test('Role-Based Analytics Access', async ({ page }) => {
    // Test user analytics access
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/analytics');
    await expect(page.locator('text=My Analytics')).toBeVisible();
    await expect(page.locator('text=Personal Statistics')).toBeVisible();
    
    // Test vendor analytics access
    await loginAsRole(page, 'vendor');
    await page.goto('/dashboard/vendor/analytics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Booking Statistics')).toBeVisible();
    
    // Test admin analytics access
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard/admin/reports');
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
    await expect(page.locator('text=System Statistics')).toBeVisible();
  });

  test('Data Visibility Based on Role', async ({ page }) => {
    // Test user sees only their data
    await loginAsRole(page, 'user');
    await page.goto('/dashboard/analytics');
    await expect(page.locator('text=My Bookings')).toBeVisible();
    await expect(page.locator('text=My Spending')).toBeVisible();
    
    // Test admin sees all data
    await loginAsRole(page, 'admin');
    await page.goto('/dashboard/admin/reports');
    await expect(page.locator('text=All Users')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Platform Statistics')).toBeVisible();
  });
});
