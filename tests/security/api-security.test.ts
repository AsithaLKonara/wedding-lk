import { test, expect } from '@playwright/test';

test.describe('API Security Tests', () => {
  test('API endpoint requires authentication', async ({ request }) => {
    // Try to access protected endpoint without auth
    const response = await request.get('/api/bookings');
    
    expect(response.status()).toBe(401);
    const json = await response.json();
    expect(json.error || json.message).toContain(/unauthorized|authentication|login/i);
  });

  test('API endpoint validates JWT token', async ({ request }) => {
    // Try with invalid token
    const response = await request.get('/api/bookings', {
      headers: {
        'Authorization': 'Bearer invalid-token-12345',
      },
    });
    
    expect(response.status()).toBe(401);
  });

  test('API endpoint enforces role-based access', async ({ request }) => {
    // This would require a valid user token with 'user' role
    // Trying to access admin endpoint
    const response = await request.get('/api/admin/users', {
      headers: {
        'Authorization': 'Bearer user-token', // Non-admin token
      },
    });
    
    expect(response.status()).toBe(403);
  });

  test('API endpoint validates input data', async ({ request }) => {
    // Try to create booking with invalid data
    const response = await request.post('/api/bookings', {
      data: {
        eventDate: 'invalid-date',
        guestCount: -1,
      },
    });
    
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.error || json.message).toBeDefined();
  });

  test('API endpoint prevents SQL injection', async ({ request }) => {
    // Try SQL injection in search parameter
    const response = await request.get('/api/venues/search?q=test%27%20OR%20%271%27%3D%271');
    
    // Should not return 500 error (should handle gracefully)
    expect(response.status()).not.toBe(500);
  });

  test('API endpoint prevents XSS attacks', async ({ request }) => {
    // Try XSS payload in input
    const xssPayload = '<script>alert("XSS")</script>';
    const response = await request.post('/api/reviews', {
      data: {
        comment: xssPayload,
        rating: 5,
      },
    });
    
    // Should sanitize input
    const json = await response.json();
    if (json.data) {
      expect(json.data.comment).not.toContain('<script>');
    }
  });

  test('API endpoint enforces rate limiting', async ({ request }) => {
    // Make multiple rapid requests
    const requests = Array(100).fill(null).map(() =>
      request.get('/api/venues')
    );
    
    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited (429)
    const rateLimited = responses.filter(r => r.status() === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  test('API endpoint validates file uploads', async ({ request }) => {
    // Try to upload invalid file type
    const formData = new FormData();
    const blob = new Blob(['malicious content'], { type: 'application/x-executable' });
    formData.append('file', blob, 'malicious.exe');
    
    const response = await request.post('/api/upload', {
      multipart: formData,
    });
    
    expect(response.status()).toBe(400);
  });

  test('API endpoint prevents CSRF attacks', async ({ request }) => {
    // Try request without CSRF token (if implemented)
    const response = await request.post('/api/bookings', {
      data: {
        venue: 'venue123',
        eventDate: '2024-12-25',
      },
      headers: {
        'Origin': 'https://malicious-site.com',
      },
    });
    
    // Should reject if origin doesn't match
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('API endpoint sanitizes error messages', async ({ request }) => {
    // Try to trigger error that might leak sensitive info
    const response = await request.get('/api/bookings/invalid-id-that-does-not-exist-12345');
    
    const json = await response.json();
    
    // Error message should not contain sensitive info
    const errorMessage = JSON.stringify(json);
    expect(errorMessage).not.toContain('password');
    expect(errorMessage).not.toContain('secret');
    expect(errorMessage).not.toContain('token');
    expect(errorMessage).not.toContain('private');
  });
});

