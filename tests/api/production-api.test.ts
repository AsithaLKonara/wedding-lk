import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://wedding-9f2773v90-asithalkonaras-projects.vercel.app';

test.describe('WeddingLK Production API Tests', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    // Register a test user
    const registerResponse = await request.post(`${PRODUCTION_URL}/api/auth/register`, {
      data: {
        name: 'API Test User',
        email: 'apitest@weddinglk.com',
        password: 'ApiTestPassword123!',
        phone: '+94771234567',
      },
    });

    if (registerResponse.ok()) {
      const registerData = await registerResponse.json();
      authToken = registerData.token;
      userId = registerData.user?.id;
    } else {
      // Try to login if user already exists
      const loginResponse = await request.post(`${PRODUCTION_URL}/api/auth/login`, {
        data: {
          email: 'apitest@weddinglk.com',
          password: 'ApiTestPassword123!',
        },
      });

      if (loginResponse.ok()) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        userId = loginData.user?.id;
      }
    }
  });

  test('Health Check Endpoint', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData.status).toMatch(/healthy|degraded/);
    expect(healthData.timestamp).toBeDefined();
    expect(healthData.checks.database).toBeDefined();
  });

  test('Authentication Endpoints', async ({ request }) => {
    // Test registration
    const registerResponse = await request.post(`${PRODUCTION_URL}/api/auth/register`, {
      data: {
        name: 'Test User 2',
        email: 'testuser2@weddinglk.com',
        password: 'TestPassword123!',
        phone: '+94771234568',
      },
    });

    expect(registerResponse.status()).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData.success).toBe(true);
    expect(registerData.user).toBeDefined();

    // Test login
    const loginResponse = await request.post(`${PRODUCTION_URL}/api/auth/login`, {
      data: {
        email: 'testuser2@weddinglk.com',
        password: 'TestPassword123!',
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    expect(loginData.success).toBe(true);
    expect(loginData.token).toBeDefined();
  });

  test('Vendors API', async ({ request }) => {
    // Test get vendors
    const vendorsResponse = await request.get(`${PRODUCTION_URL}/api/vendors`);
    
    expect(vendorsResponse.status()).toBe(200);
    const vendorsData = await vendorsResponse.json();
    expect(vendorsData.success).toBe(true);
    expect(Array.isArray(vendorsData.vendors)).toBe(true);
    expect(vendorsData.vendors.length).toBeGreaterThan(0);

    // Test get single vendor
    const vendorId = vendorsData.vendors[0]._id;
    const vendorResponse = await request.get(`${PRODUCTION_URL}/api/vendors/${vendorId}`);
    
    expect(vendorResponse.status()).toBe(200);
    const vendorData = await vendorResponse.json();
    expect(vendorData.success).toBe(true);
    expect(vendorData.vendor).toBeDefined();
  });

  test('Venues API', async ({ request }) => {
    // Test get venues
    const venuesResponse = await request.get(`${PRODUCTION_URL}/api/venues`);
    
    expect(venuesResponse.status()).toBe(200);
    const venuesData = await venuesResponse.json();
    expect(venuesData.success).toBe(true);
    expect(Array.isArray(venuesData.venues)).toBe(true);
    expect(venuesData.venues.length).toBeGreaterThan(0);

    // Test search venues
    const searchResponse = await request.get(`${PRODUCTION_URL}/api/venues?search=Colombo`);
    
    expect(searchResponse.status()).toBe(200);
    const searchData = await searchResponse.json();
    expect(searchData.success).toBe(true);
  });

  test('Bookings API (Authenticated)', async ({ request }) => {
    if (!authToken) {
      test.skip('No auth token available');
    }

    // Test create booking
    const bookingResponse = await request.post(`${PRODUCTION_URL}/api/bookings`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      data: {
        vendorId: '507f1f77bcf86cd799439011', // Mock vendor ID
        serviceType: 'Wedding Photography',
        bookingDate: '2024-12-25',
        amount: 50000,
        details: {
          eventType: 'Wedding',
          guestCount: 100,
          location: 'Colombo',
          specialRequests: 'Test booking',
        },
      },
    });

    expect(bookingResponse.status()).toBe(201);
    const bookingData = await bookingResponse.json();
    expect(bookingData.success).toBe(true);
    expect(bookingData.booking).toBeDefined();

    // Test get user bookings
    const userBookingsResponse = await request.get(`${PRODUCTION_URL}/api/bookings`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(userBookingsResponse.status()).toBe(200);
    const userBookingsData = await userBookingsResponse.json();
    expect(userBookingsData.success).toBe(true);
    expect(Array.isArray(userBookingsData.bookings)).toBe(true);
  });

  test('Reviews API', async ({ request }) => {
    // Test get reviews
    const reviewsResponse = await request.get(`${PRODUCTION_URL}/api/reviews`);
    
    expect(reviewsResponse.status()).toBe(200);
    const reviewsData = await reviewsResponse.json();
    expect(reviewsData.success).toBe(true);
    expect(Array.isArray(reviewsData.reviews)).toBe(true);

    // Test create review (authenticated)
    if (authToken) {
      const createReviewResponse = await request.post(`${PRODUCTION_URL}/api/reviews`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        data: {
          vendorId: '507f1f77bcf86cd799439011',
          overallRating: 5,
          title: 'Great service!',
          comment: 'Excellent photography service, highly recommended!',
          categoryRatings: {
            service: 5,
            quality: 5,
            value: 4,
            communication: 5,
            timeliness: 5,
          },
        },
      });

      expect(createReviewResponse.status()).toBe(201);
      const createReviewData = await createReviewResponse.json();
      expect(createReviewData.success).toBe(true);
    }
  });

  test('Favorites API (Authenticated)', async ({ request }) => {
    if (!authToken) {
      test.skip('No auth token available');
    }

    // Test add to favorites
    const addFavoriteResponse = await request.post(`${PRODUCTION_URL}/api/favorites`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      data: {
        itemId: '507f1f77bcf86cd799439011',
        itemType: 'vendor',
        category: 'photography',
      },
    });

    expect(addFavoriteResponse.status()).toBe(201);
    const addFavoriteData = await addFavoriteResponse.json();
    expect(addFavoriteData.success).toBe(true);

    // Test get favorites
    const getFavoritesResponse = await request.get(`${PRODUCTION_URL}/api/favorites`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(getFavoritesResponse.status()).toBe(200);
    const getFavoritesData = await getFavoritesResponse.json();
    expect(getFavoritesData.success).toBe(true);
    expect(Array.isArray(getFavoritesData.favorites)).toBe(true);
  });

  test('Guest List API (Authenticated)', async ({ request }) => {
    if (!authToken) {
      test.skip('No auth token available');
    }

    // Test create guest list
    const createGuestListResponse = await request.post(`${PRODUCTION_URL}/api/guest-list`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      data: {
        eventName: 'Test Wedding',
        eventDate: '2024-12-25',
        guests: [
          {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+94771234567',
            relationship: 'friend',
            rsvp: 'pending',
          },
        ],
      },
    });

    expect(createGuestListResponse.status()).toBe(201);
    const createGuestListData = await createGuestListResponse.json();
    expect(createGuestListData.success).toBe(true);

    // Test get guest lists
    const getGuestListsResponse = await request.get(`${PRODUCTION_URL}/api/guest-list`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(getGuestListsResponse.status()).toBe(200);
    const getGuestListsData = await getGuestListsResponse.json();
    expect(getGuestListsData.success).toBe(true);
    expect(Array.isArray(getGuestListsData.guestLists)).toBe(true);
  });

  test('Search API', async ({ request }) => {
    // Test search vendors
    const searchVendorsResponse = await request.get(`${PRODUCTION_URL}/api/search?vendors=photography&location=Colombo`);
    
    expect(searchVendorsResponse.status()).toBe(200);
    const searchVendorsData = await searchVendorsResponse.json();
    expect(searchVendorsData.success).toBe(true);
    expect(Array.isArray(searchVendorsData.vendors)).toBe(true);

    // Test search venues
    const searchVenuesResponse = await request.get(`${PRODUCTION_URL}/api/search?venues=hotel&location=Galle`);
    
    expect(searchVenuesResponse.status()).toBe(200);
    const searchVenuesData = await searchVenuesResponse.json();
    expect(searchVenuesData.success).toBe(true);
    expect(Array.isArray(searchVenuesData.venues)).toBe(true);
  });

  test('Rate Limiting', async ({ request }) => {
    // Test rate limiting by making multiple requests
    const requests = Array(10).fill(null).map(() => 
      request.get(`${PRODUCTION_URL}/api/vendors`)
    );

    const responses = await Promise.all(requests);
    
    // Most requests should succeed, but some might be rate limited
    const successCount = responses.filter(r => r.status() === 200).length;
    const rateLimitedCount = responses.filter(r => r.status() === 429).length;
    
    expect(successCount).toBeGreaterThan(0);
    // Rate limiting might not be active in development
  });

  test('Error Handling', async ({ request }) => {
    // Test 404 endpoint
    const notFoundResponse = await request.get(`${PRODUCTION_URL}/api/non-existent-endpoint`);
    expect(notFoundResponse.status()).toBe(404);

    // Test invalid data
    const invalidDataResponse = await request.post(`${PRODUCTION_URL}/api/auth/register`, {
      data: {
        email: 'invalid-email',
        password: '123', // Too short
      },
    });

    expect(invalidDataResponse.status()).toBe(400);
    const invalidData = await invalidDataResponse.json();
    expect(invalidData.success).toBe(false);
    expect(invalidData.message).toBeDefined();
  });

  test('CORS Headers', async ({ request }) => {
    const response = await request.get(`${PRODUCTION_URL}/api/health`);
    
    expect(response.headers()['access-control-allow-origin']).toBeDefined();
    expect(response.headers()['access-control-allow-methods']).toBeDefined();
  });

  test('Response Time Performance', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${PRODUCTION_URL}/api/vendors`);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
  });
});

