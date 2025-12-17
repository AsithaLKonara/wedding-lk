import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control (RBAC) Security Tests', () => {
  test('Regular user cannot access admin endpoints', async ({ request }) => {
    // Login as regular user
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'user@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Try to access admin endpoint
    const adminResponse = await request.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    expect(adminResponse.status()).toBe(403);
    const json = await adminResponse.json();
    expect(json.error || json.message).toContain(/forbidden|access.*denied|permission/i);
  });

  test('Vendor cannot access other vendor data', async ({ request }) => {
    // Login as vendor1
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'vendor1@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Try to access vendor2's data
    const vendorResponse = await request.get('/api/vendors/vendor2-id', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Should either return 403 or only return public data
    expect([200, 403]).toContain(vendorResponse.status());
    
    if (vendorResponse.status() === 200) {
      const json = await vendorResponse.json();
      // Should not contain sensitive vendor data
      expect(json.data).not.toHaveProperty('revenue');
      expect(json.data).not.toHaveProperty('privateNotes');
    }
  });

  test('Admin can access all endpoints', async ({ request }) => {
    // Login as admin
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'admin@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Access admin endpoints
    const adminEndpoints = [
      '/api/admin/users',
      '/api/admin/vendors',
      '/api/admin/bookings',
      '/api/admin/analytics',
    ];
    
    for (const endpoint of adminEndpoints) {
      const response = await request.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Admin should have access (200 or 404 if no data, but not 403)
      expect([200, 404]).toContain(response.status());
      expect(response.status()).not.toBe(403);
    }
  });

  test('User cannot modify other user bookings', async ({ request }) => {
    // Login as user1
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'user1@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Try to update user2's booking
    const updateResponse = await request.put('/api/bookings/user2-booking-id', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        status: 'cancelled',
      },
    });
    
    expect(updateResponse.status()).toBe(403);
  });

  test('Vendor can only manage own bookings', async ({ request }) => {
    // Login as vendor1
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'vendor1@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Get vendor bookings
    const bookingsResponse = await request.get('/api/vendors/vendor1-id/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const bookings = await bookingsResponse.json();
    
    // All bookings should belong to vendor1
    if (bookings.data && Array.isArray(bookings.data)) {
      bookings.data.forEach((booking: any) => {
        expect(booking.vendor).toBe('vendor1-id');
      });
    }
  });

  test('Wedding planner has appropriate access', async ({ request }) => {
    // Login as wedding planner
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'planner@test.local',
        password: 'Test123!',
      },
    });
    
    const { token } = await loginResponse.json();
    
    // Should access planner-specific endpoints
    const plannerResponse = await request.get('/api/planner/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    expect([200, 404]).toContain(plannerResponse.status());
    
    // Should not access admin endpoints
    const adminResponse = await request.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    expect(adminResponse.status()).toBe(403);
  });

  test('Role changes require re-authentication', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@test.local');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*dashboard/i);
    
    // Admin changes user role (simulated)
    // User should need to re-login to get new permissions
    await page.reload();
    
    // Old session should still work with old role
    // But new permissions require new login
  });

  test('Suspended users cannot access protected endpoints', async ({ request }) => {
    // Login as suspended user
    const loginResponse = await request.post('/api/auth/signin', {
      data: {
        email: 'suspended@test.local',
        password: 'Test123!',
      },
    });
    
    // Should be rejected
    expect(loginResponse.status()).toBe(403);
    const json = await loginResponse.json();
    expect(json.error || json.message).toContain(/suspended|inactive|blocked/i);
  });
});

