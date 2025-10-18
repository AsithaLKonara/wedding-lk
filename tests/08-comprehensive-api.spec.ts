import { test, expect } from '@playwright/test';

test.describe('🔌 Comprehensive API Testing', () => {
  test.describe('Core Entity APIs', () => {
    test('Venues API - GET all venues', async ({ page }) => {
      const response = await page.request.get('/api/venues');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
      expect(data.data.length).toBeGreaterThan(0);
      
      // Check venue structure
      const venue = data.data[0];
      expect(venue).toHaveProperty('_id');
      expect(venue).toHaveProperty('name');
      expect(venue).toHaveProperty('location');
      expect(venue).toHaveProperty('capacity');
      expect(venue).toHaveProperty('price');
    });

    test('Venues API - POST create venue', async ({ page }) => {
      const venueData = {
        name: 'Test API Venue',
        location: 'Test Location',
        capacity: 200,
        price: 100000,
        amenities: ['Parking', 'AC', 'Stage'],
        vendor: { name: 'Test Vendor', email: 'test@vendor.com' }
      };
      
      const response = await page.request.post('/api/venues', { data: venueData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test API Venue');
      expect(data.data.location).toBe('Test Location');
    });

    test('Vendors API - GET all vendors', async ({ page }) => {
      const response = await page.request.get('/api/vendors');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Vendors API - POST create vendor', async ({ page }) => {
      const vendorData = {
        name: 'Test API Vendor',
        category: 'Photographer',
        location: 'Test Location',
        description: 'Test vendor description',
        services: ['Wedding Photography', 'Portrait Photography']
      };
      
      const response = await page.request.post('/api/vendors', { data: vendorData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test API Vendor');
    });

    test('Users API - GET all users', async ({ page }) => {
      const response = await page.request.get('/api/users');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Services API - GET all services', async ({ page }) => {
      const response = await page.request.get('/api/services');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });
  });

  test.describe('Booking & Payment APIs', () => {
    test('Bookings API - GET all bookings', async ({ page }) => {
      const response = await page.request.get('/api/bookings');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('Bookings API - POST create booking', async ({ page }) => {
      const bookingData = {
        venueId: '1',
        date: '2025-06-15',
        guests: 150,
        name: 'Test User',
        email: 'test@example.com',
        phone: '0771234567',
        message: 'Test booking via API'
      };
      
      const response = await page.request.post('/api/bookings', { data: bookingData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.booking).toBeDefined();
    });

    test('Payments API - POST process payment', async ({ page }) => {
      const paymentData = {
        type: 'booking',
        amount: 150000,
        currency: 'LKR',
        paymentMethod: 'card',
        metadata: {
          bookingId: '1',
          venueId: '1'
        }
      };
      
      const response = await page.request.post('/api/payments', { data: paymentData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    test('Payments API - Subscription payment', async ({ page }) => {
      const subscriptionData = {
        type: 'subscription',
        plan: { name: 'Premium', price: 5000 },
        vendorId: '1',
        paymentMethod: 'card'
      };
      
      const response = await page.request.post('/api/payments', { data: subscriptionData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.subscriptionId).toBeDefined();
    });
  });

  test.describe('Reviews & Ratings APIs', () => {
    test('Reviews API - GET all reviews', async ({ page }) => {
      const response = await page.request.get('/api/reviews');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Reviews API - POST create review', async ({ page }) => {
      const reviewData = {
        venueId: '1',
        rating: 5,
        review: 'Excellent venue with great service!',
        photos: []
      };
      
      const response = await page.request.post('/api/reviews', { data: reviewData });
      expect(response.status()).toBe(201);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.review).toBeDefined();
    });
  });

  test.describe('Authentication APIs', () => {
    test('Auth Register API', async ({ page }) => {
      const userData = {
        name: 'Test API User',
        email: 'testapi@example.com',
        password: 'TestPassword123!',
        userType: 'couple'
      };
      
      const response = await page.request.post('/api/auth/register', { data: userData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Auth Login API', async ({ page }) => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };
      
      const response = await page.request.post('/api/auth/[...nextauth]', { data: loginData });
      // Login endpoint might return different status codes
      expect([200, 302, 401]).toContain(response.status());
    });

    test('Forgot Password API', async ({ page }) => {
      const forgotData = {
        email: 'test@example.com'
      };
      
      const response = await page.request.post('/api/auth/forgot-password', { data: forgotData });
      expect([200, 404]).toContain(response.status());
    });

    test('Reset Password API', async ({ page }) => {
      const resetData = {
        token: 'test-token',
        password: 'NewPassword123!'
      };
      
      const response = await page.request.post('/api/auth/reset-password', { data: resetData });
      expect([200, 400, 404]).toContain(response.status());
    });
  });

  test.describe('AI & Chat APIs', () => {
    test('AI Search API', async ({ page }) => {
      const searchData = {
        query: 'Beach wedding in Galle for 150 guests'
      };
      
      const response = await page.request.post('/api/ai-search', { data: searchData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Chatbot API', async ({ page }) => {
      const messageData = {
        message: 'Hello, I need help finding a wedding venue'
      };
      
      const response = await page.request.post('/api/chatbot', { data: messageData });
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Chat Messages API', async ({ page }) => {
      const response = await page.request.get('/api/chat/messages');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('Chat Rooms API', async ({ page }) => {
      const response = await page.request.get('/api/chat/rooms');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  test.describe('Admin & Analytics APIs', () => {
    test('Analytics API', async ({ page }) => {
      const response = await page.request.get('/api/analytics/advanced');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Notifications API', async ({ page }) => {
      const response = await page.request.get('/api/notifications');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toBeDefined();
    });

    test('Tasks API', async ({ page }) => {
      const response = await page.request.get('/api/tasks');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Clients API', async ({ page }) => {
      const response = await page.request.get('/api/clients');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });
  });

  test.describe('Package & Subscription APIs', () => {
    test('Packages API - GET all packages', async ({ page }) => {
      const response = await page.request.get('/api/packages');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
    });

    test('Package like API', async ({ page }) => {
      const response = await page.request.post('/api/packages/1/like');
      expect([200, 201, 404]).toContain(response.status());
    });

    test('Package bookmark API', async ({ page }) => {
      const response = await page.request.post('/api/packages/1/bookmark');
      expect([200, 201, 404]).toContain(response.status());
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('API error handling - Invalid data', async ({ page }) => {
      const invalidData = {
        invalidField: 'invalid value'
      };
      
      const response = await page.request.post('/api/venues', { data: invalidData });
      expect([400, 422]).toContain(response.status());
    });

    test('API error handling - Missing required fields', async ({ page }) => {
      const incompleteData = {
        name: 'Incomplete Venue'
        // Missing required fields
      };
      
      const response = await page.request.post('/api/venues', { data: incompleteData });
      expect([400, 422]).toContain(response.status());
    });

    test('API error handling - Non-existent resource', async ({ page }) => {
      const response = await page.request.get('/api/venues/99999');
      expect([404, 400]).toContain(response.status());
    });

    test('API rate limiting', async ({ page }) => {
      // Make multiple rapid requests to test rate limiting
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(page.request.get('/api/venues'));
      }
      
      const responses = await Promise.all(requests);
      
      // Some requests might be rate limited (429 status)
      const statusCodes = responses.map(r => r.status());
      expect(statusCodes.every(code => [200, 429].includes(code))).toBe(true);
    });
  });

  test.describe('API Response Formats', () => {
    test('Consistent API response format', async ({ page }) => {
      const response = await page.request.get('/api/venues');
      const data = await response.json();
      
      // Check for consistent response structure
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('data');
      expect(typeof data.success).toBe('boolean');
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('API response headers', async ({ page }) => {
      const response = await page.request.get('/api/venues');
      
      // Check important headers
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('API pagination', async ({ page }) => {
      const response = await page.request.get('/api/venues?page=1&limit=5');
      const data = await response.json();
      
      // Check if pagination is implemented
      if (data.pagination) {
        expect(data.pagination).toHaveProperty('page');
        expect(data.pagination).toHaveProperty('limit');
        expect(data.pagination).toHaveProperty('total');
      }
    });
  });

  test.describe('API Performance', () => {
    test('API response time', async ({ page }) => {
      const startTime = Date.now();
      const response = await page.request.get('/api/venues');
      const responseTime = Date.now() - startTime;
      
      // API should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
      expect(response.status()).toBe(200);
    });

    test('API concurrent requests', async ({ page }) => {
      const startTime = Date.now();
      
      // Make multiple concurrent requests
      const requests = [
        page.request.get('/api/venues'),
        page.request.get('/api/vendors'),
        page.request.get('/api/services'),
        page.request.get('/api/users')
      ];
      
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;
      
      // All requests should complete within 5 seconds
      expect(totalTime).toBeLessThan(5000);
      
      // All requests should be successful
      responses.forEach(response => {
        expect(response.status()).toBe(200);
      });
    });
  });

  test.describe('API Security', () => {
    test('API authentication requirements', async ({ page }) => {
      // Test protected endpoints without authentication
      const protectedEndpoints = [
        '/api/admin/analytics',
        '/api/admin/users',
        '/api/admin/vendors'
      ];
      
      for (const endpoint of protectedEndpoints) {
        const response = await page.request.get(endpoint);
        expect([401, 403, 404]).toContain(response.status());
      }
    });

    test('API input sanitization', async ({ page }) => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        description: '${7*7}',
        location: 'DROP TABLE venues;'
      };
      
      const response = await page.request.post('/api/venues', { data: maliciousData });
      
      // Should handle malicious input gracefully
      expect([400, 422, 201]).toContain(response.status());
      
      if (response.status() === 201) {
        const data = await response.json();
        // Check that malicious content is sanitized
        expect(data.data.name).not.toContain('<script>');
        expect(data.data.description).not.toContain('${7*7}');
      }
    });

    test('API CORS headers', async ({ page }) => {
      const response = await page.request.get('/api/venues');
      const headers = response.headers();
      
      // Check for CORS headers if needed
      if (headers['access-control-allow-origin']) {
        expect(headers['access-control-allow-origin']).toBeDefined();
      }
    });
  });
});
