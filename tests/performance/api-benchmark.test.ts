import { test, expect } from '@playwright/test';

test.describe('API Performance Benchmarks', () => {
  test('Homepage API responds within 200ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(200); // P95 target: < 200ms
  });

  test('Venues API responds within 200ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/venues');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(200);
  });

  test('Vendors API responds within 200ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/vendors');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(200);
  });

  test('Search API handles concurrent requests', async ({ request }) => {
    // Make 10 concurrent search requests
    const requests = Array(10).fill(null).map(() =>
      request.get('/api/venues/search?q=garden')
    );
    
    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();
    const avgResponseTime = (endTime - startTime) / 10;
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Average response time should be reasonable
    expect(avgResponseTime).toBeLessThan(500);
  });

  test('Database query performance', async ({ request }) => {
    // Test paginated query performance
    const startTime = Date.now();
    const response = await request.get('/api/venues?page=1&limit=20');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(300); // Paginated queries may take slightly longer
  });

  test('API handles large payloads efficiently', async ({ request }) => {
    // Create large booking data
    const largePayload = {
      venue: 'venue123',
      eventDate: '2024-12-25',
      guestCount: 500,
      services: Array(20).fill(null).map((_, i) => ({
        name: `Service ${i}`,
        price: 1000 * i,
        description: 'A'.repeat(100), // Long description
      })),
    };
    
    const startTime = Date.now();
    const response = await request.post('/api/bookings', {
      data: largePayload,
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Should handle large payloads without timeout
    expect(response.status()).not.toBe(408); // Not timeout
    expect(responseTime).toBeLessThan(1000);
  });
});

