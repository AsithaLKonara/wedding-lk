import { test, expect } from '@playwright/test';

test.describe('API Endpoints Tests', () => {
  test('should test authentication endpoints', async ({ request }) => {
    // Test login endpoint
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPassword123!'
      }
    });
    expect(loginResponse.status()).toBe(200);
    
    // Test register endpoint
    const registerResponse = await request.post('/api/auth/register', {
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'user'
      }
    });
    expect(registerResponse.status()).toBe(201);
  });

  test('should test venues CRUD endpoints', async ({ request }) => {
    // Test get venues
    const getVenuesResponse = await request.get('/api/venues');
    expect(getVenuesResponse.status()).toBe(200);
    
    // Test create venue
    const createVenueResponse = await request.post('/api/venues', {
      data: {
        name: 'Test Venue',
        description: 'Beautiful test venue',
        location: 'Colombo, Sri Lanka',
        capacity: 200,
        price: 50000
      }
    });
    expect(createVenueResponse.status()).toBe(201);
    
    const venueId = (await createVenueResponse.json()).id;
    
    // Test get single venue
    const getVenueResponse = await request.get(`/api/venues/${venueId}`);
    expect(getVenueResponse.status()).toBe(200);
    
    // Test update venue
    const updateVenueResponse = await request.put(`/api/venues/${venueId}`, {
      data: {
        name: 'Updated Test Venue'
      }
    });
    expect(updateVenueResponse.status()).toBe(200);
    
    // Test delete venue
    const deleteVenueResponse = await request.delete(`/api/venues/${venueId}`);
    expect(deleteVenueResponse.status()).toBe(200);
  });

  test('should test vendors CRUD endpoints', async ({ request }) => {
    // Test get vendors
    const getVendorsResponse = await request.get('/api/vendors');
    expect(getVendorsResponse.status()).toBe(200);
    
    // Test create vendor
    const createVendorResponse = await request.post('/api/vendors', {
      data: {
        businessName: 'Test Photography',
        description: 'Professional wedding photography',
        location: 'Colombo, Sri Lanka',
        phone: '+94771234567',
        email: 'photographer@example.com',
        services: ['photography']
      }
    });
    expect(createVendorResponse.status()).toBe(201);
    
    const vendorId = (await createVendorResponse.json()).id;
    
    // Test get single vendor
    const getVendorResponse = await request.get(`/api/vendors/${vendorId}`);
    expect(getVendorResponse.status()).toBe(200);
    
    // Test update vendor
    const updateVendorResponse = await request.put(`/api/vendors/${vendorId}`, {
      data: {
        businessName: 'Updated Test Photography'
      }
    });
    expect(updateVendorResponse.status()).toBe(200);
    
    // Test delete vendor
    const deleteVendorResponse = await request.delete(`/api/vendors/${vendorId}`);
    expect(deleteVendorResponse.status()).toBe(200);
  });

  test('should test bookings CRUD endpoints', async ({ request }) => {
    // Test get bookings
    const getBookingsResponse = await request.get('/api/bookings');
    expect(getBookingsResponse.status()).toBe(200);
    
    // Test create booking
    const createBookingResponse = await request.post('/api/bookings', {
      data: {
        eventDate: '2024-12-25',
        startTime: '18:00',
        endTime: '23:00',
        guestCount: 100,
        brideName: 'Jane Doe',
        groomName: 'John Doe',
        specialRequests: 'Outdoor ceremony preferred'
      }
    });
    expect(createBookingResponse.status()).toBe(201);
    
    const bookingId = (await createBookingResponse.json()).id;
    
    // Test get single booking
    const getBookingResponse = await request.get(`/api/bookings/${bookingId}`);
    expect(getBookingResponse.status()).toBe(200);
    
    // Test update booking
    const updateBookingResponse = await request.put(`/api/bookings/${bookingId}`, {
      data: {
        guestCount: 150
      }
    });
    expect(updateBookingResponse.status()).toBe(200);
    
    // Test delete booking
    const deleteBookingResponse = await request.delete(`/api/bookings/${bookingId}`);
    expect(deleteBookingResponse.status()).toBe(200);
  });

  test('should test payments endpoints', async ({ request }) => {
    // Test create payment intent
    const createPaymentIntentResponse = await request.post('/api/payments/create-intent', {
      data: {
        amount: 50000,
        currency: 'lkr',
        description: 'Wedding venue booking'
      }
    });
    expect(createPaymentIntentResponse.status()).toBe(200);
    
    // Test get payments
    const getPaymentsResponse = await request.get('/api/payments');
    expect(getPaymentsResponse.status()).toBe(200);
  });

  test('should test posts CRUD endpoints', async ({ request }) => {
    // Test get posts
    const getPostsResponse = await request.get('/api/posts');
    expect(getPostsResponse.status()).toBe(200);
    
    // Test create post
    const createPostResponse = await request.post('/api/posts', {
      data: {
        content: 'Beautiful wedding at the beach! 🌊💒',
        hashtags: ['wedding', 'beach', 'love'],
        images: []
      }
    });
    expect(createPostResponse.status()).toBe(201);
    
    const postId = (await createPostResponse.json()).id;
    
    // Test get single post
    const getPostResponse = await request.get(`/api/posts/${postId}`);
    expect(getPostResponse.status()).toBe(200);
    
    // Test update post
    const updatePostResponse = await request.put(`/api/posts/${postId}`, {
      data: {
        content: 'Updated post content'
      }
    });
    expect(updatePostResponse.status()).toBe(200);
    
    // Test delete post
    const deletePostResponse = await request.delete(`/api/posts/${postId}`);
    expect(deletePostResponse.status()).toBe(200);
  });

  test('should test messages endpoints', async ({ request }) => {
    // Test get messages
    const getMessagesResponse = await request.get('/api/messages');
    expect(getMessagesResponse.status()).toBe(200);
    
    // Test create message
    const createMessageResponse = await request.post('/api/messages', {
      data: {
        recipientId: 'user123',
        content: 'Hello! How are you?',
        type: 'text'
      }
    });
    expect(createMessageResponse.status()).toBe(201);
    
    const messageId = (await createMessageResponse.json()).id;
    
    // Test get single message
    const getMessageResponse = await request.get(`/api/messages/${messageId}`);
    expect(getMessageResponse.status()).toBe(200);
    
    // Test update message
    const updateMessageResponse = await request.put(`/api/messages/${messageId}`, {
      data: {
        content: 'Updated message content'
      }
    });
    expect(updateMessageResponse.status()).toBe(200);
    
    // Test delete message
    const deleteMessageResponse = await request.delete(`/api/messages/${messageId}`);
    expect(deleteMessageResponse.status()).toBe(200);
  });

  test('should test search endpoints', async ({ request }) => {
    // Test search venues
    const searchVenuesResponse = await request.get('/api/search/venues?q=hotel');
    expect(searchVenuesResponse.status()).toBe(200);
    
    // Test search vendors
    const searchVendorsResponse = await request.get('/api/search/vendors?q=photography');
    expect(searchVendorsResponse.status()).toBe(200);
    
    // Test search posts
    const searchPostsResponse = await request.get('/api/search/posts?q=wedding');
    expect(searchPostsResponse.status()).toBe(200);
  });

  test('should test analytics endpoints', async ({ request }) => {
    // Test get analytics
    const getAnalyticsResponse = await request.get('/api/analytics');
    expect(getAnalyticsResponse.status()).toBe(200);
    
    // Test get user analytics
    const getUserAnalyticsResponse = await request.get('/api/analytics/users');
    expect(getUserAnalyticsResponse.status()).toBe(200);
    
    // Test get booking analytics
    const getBookingAnalyticsResponse = await request.get('/api/analytics/bookings');
    expect(getBookingAnalyticsResponse.status()).toBe(200);
  });

  test('should test file upload endpoints', async ({ request }) => {
    // Test upload image
    const uploadImageResponse = await request.post('/api/upload/image', {
      multipart: {
        file: new File(['test image content'], 'test.jpg', { type: 'image/jpeg' })
      }
    });
    expect(uploadImageResponse.status()).toBe(200);
    
    // Test upload document
    const uploadDocumentResponse = await request.post('/api/upload/document', {
      multipart: {
        file: new File(['test document content'], 'test.pdf', { type: 'application/pdf' })
      }
    });
    expect(uploadDocumentResponse.status()).toBe(200);
  });

  test('should test notification endpoints', async ({ request }) => {
    // Test get notifications
    const getNotificationsResponse = await request.get('/api/notifications');
    expect(getNotificationsResponse.status()).toBe(200);
    
    // Test create notification
    const createNotificationResponse = await request.post('/api/notifications', {
      data: {
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        userId: 'user123'
      }
    });
    expect(createNotificationResponse.status()).toBe(201);
    
    const notificationId = (await createNotificationResponse.json()).id;
    
    // Test mark notification as read
    const markReadResponse = await request.put(`/api/notifications/${notificationId}/read`);
    expect(markReadResponse.status()).toBe(200);
    
    // Test delete notification
    const deleteNotificationResponse = await request.delete(`/api/notifications/${notificationId}`);
    expect(deleteNotificationResponse.status()).toBe(200);
  });

  test('should test error handling', async ({ request }) => {
    // Test 404 error
    const notFoundResponse = await request.get('/api/non-existent-endpoint');
    expect(notFoundResponse.status()).toBe(404);
    
    // Test 400 error
    const badRequestResponse = await request.post('/api/auth/login', {
      data: {
        email: 'invalid-email'
      }
    });
    expect(badRequestResponse.status()).toBe(400);
    
    // Test 401 error
    const unauthorizedResponse = await request.get('/api/dashboard');
    expect(unauthorizedResponse.status()).toBe(401);
  });

  test('should test rate limiting', async ({ request }) => {
    // Test rate limiting by making multiple requests
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(request.get('/api/venues'));
    }
    
    const responses = await Promise.all(requests);
    
    // Some requests should be rate limited
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('should test CORS headers', async ({ request }) => {
    // Test CORS preflight request
    const corsResponse = await request.options('/api/venues');
    expect(corsResponse.status()).toBe(200);
    
    // Check CORS headers
    const headers = corsResponse.headers();
    expect(headers['access-control-allow-origin']).toBeDefined();
    expect(headers['access-control-allow-methods']).toBeDefined();
  });
});
