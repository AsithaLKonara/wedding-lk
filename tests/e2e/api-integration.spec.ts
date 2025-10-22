import { test, expect } from '@playwright/test';

/**
 * 🔌 COMPREHENSIVE API INTEGRATION TESTS
 * 
 * This test suite covers all API endpoints with proper authentication,
 * authorization, and data validation for the WeddingLK application.
 */

// Test data for API testing
const testData = {
  user: {
    name: 'API Test User',
    email: 'apitest@example.com',
    password: 'ApiTest123!',
    phone: '+94771234567'
  },
  vendor: {
    businessName: 'Test Photography Studio',
    email: 'vendor@test.com',
    password: 'VendorTest123!',
    phone: '+94771234568',
    description: 'Professional wedding photography services'
  },
  booking: {
    eventDate: '2024-12-25',
    guestCount: 100,
    specialRequests: 'Outdoor ceremony with garden setup',
    totalPrice: 50000
  },
  venue: {
    name: 'Test Wedding Venue',
    location: 'Colombo, Sri Lanka',
    capacity: 200,
    price: 50000,
    description: 'Beautiful outdoor venue for weddings'
  }
};

// Helper function to get auth token
async function getAuthToken(page: any, email: string, password: string) {
  const response = await page.request.post('/api/auth/login', {
    data: { email, password }
  });
  const data = await response.json();
  return data.token;
}

// Helper function to make authenticated API request
async function authenticatedRequest(page: any, method: string, url: string, data?: any, token?: string) {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  return page.request[method.toLowerCase()](url, { data, headers });
}

test.describe('🔐 Authentication API Tests', () => {
  test('User Registration API', async ({ page }) => {
    const response = await page.request.post('/api/auth/register', {
      data: {
        name: testData.user.name,
        email: testData.user.email,
        password: testData.user.password,
        confirmPassword: testData.user.password
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('User registered successfully');
  });

  test('User Login API', async ({ page }) => {
    const response = await page.request.post('/api/auth/login', {
      data: {
        email: testData.user.email,
        password: testData.user.password
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.user).toBeDefined();
  });

  test('Invalid Login API', async ({ page }) => {
    const response = await page.request.post('/api/auth/login', {
      data: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    });
    
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Invalid credentials');
  });

  test('Password Reset API', async ({ page }) => {
    const response = await page.request.post('/api/auth/forgot-password', {
      data: { email: testData.user.email }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Password reset email sent');
  });

  test('Email Verification API', async ({ page }) => {
    const response = await page.request.post('/api/auth/verify-email', {
      data: { token: 'test-verification-token' }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});

test.describe('👤 User Management API Tests', () => {
  test('Get User Profile API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/user/profile', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testData.user.email);
  });

  test('Update User Profile API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'PUT', '/api/user/profile', {
      phone: testData.user.phone,
      bio: 'Updated bio for testing'
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Profile updated successfully');
  });

  test('Get User Favorites API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/user/favorites', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.favorites).toBeDefined();
  });

  test('Add User Favorite API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/user/favorites', {
      entityType: 'venue',
      entityId: 'test-venue-id'
    }, token);
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Added to favorites');
  });
});

test.describe('🏢 Vendor Management API Tests', () => {
  test('Vendor Registration API', async ({ page }) => {
    const response = await page.request.post('/api/vendors/register', {
      data: {
        businessName: testData.vendor.businessName,
        email: testData.vendor.email,
        password: testData.vendor.password,
        phone: testData.vendor.phone,
        description: testData.vendor.description
      }
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Vendor registration submitted');
  });

  test('Get Vendor Services API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/vendor/services', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.services).toBeDefined();
  });

  test('Create Vendor Service API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/services', {
      name: 'Wedding Photography',
      description: 'Full day wedding photography service',
      price: 50000,
      category: 'photography'
    }, token);
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.service).toBeDefined();
  });

  test('Update Vendor Service API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'PUT', '/api/services/test-service-id', {
      name: 'Updated Wedding Photography',
      price: 55000
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Service updated successfully');
  });

  test('Delete Vendor Service API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'DELETE', '/api/services/test-service-id', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Service deleted successfully');
  });

  test('Get Vendor Analytics API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/vendor/analytics', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.analytics).toBeDefined();
    expect(data.analytics.revenue).toBeDefined();
    expect(data.analytics.bookings).toBeDefined();
  });
});

test.describe('📅 Booking Management API Tests', () => {
  test('Create Booking API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/bookings', {
      venueId: 'test-venue-id',
      eventDate: testData.booking.eventDate,
      guestCount: testData.booking.guestCount,
      specialRequests: testData.booking.specialRequests,
      totalPrice: testData.booking.totalPrice
    }, token);
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.booking).toBeDefined();
    expect(data.booking.id).toBeDefined();
  });

  test('Get User Bookings API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/bookings', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.bookings).toBeDefined();
  });

  test('Update Booking API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'PUT', '/api/bookings/test-booking-id', {
      guestCount: 120,
      specialRequests: 'Updated special requests'
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Booking updated successfully');
  });

  test('Cancel Booking API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'DELETE', '/api/bookings/test-booking-id', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Booking cancelled successfully');
  });

  test('Get Vendor Bookings API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/vendor/bookings', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.bookings).toBeDefined();
  });

  test('Update Booking Status API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'PUT', '/api/bookings/test-booking-id/status', {
      status: 'confirmed'
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Booking status updated');
  });
});

test.describe('🏛️ Venue Management API Tests', () => {
  test('Get Venues API', async ({ page }) => {
    const response = await page.request.get('/api/venues');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.venues).toBeDefined();
  });

  test('Get Venue by ID API', async ({ page }) => {
    const response = await page.request.get('/api/venues/test-venue-id');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.venue).toBeDefined();
  });

  test('Search Venues API', async ({ page }) => {
    const response = await page.request.get('/api/venues/search?location=Colombo&capacity=100');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.venues).toBeDefined();
  });

  test('Get Venue Availability API', async ({ page }) => {
    const response = await page.request.get('/api/venues/availability?venueId=test-venue-id&date=2024-12-25');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.availability).toBeDefined();
  });
});

test.describe('💳 Payment API Tests', () => {
  test('Create Payment Intent API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/payments/create-intent', {
      amount: 50000,
      currency: 'LKR',
      bookingId: 'test-booking-id'
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.clientSecret).toBeDefined();
  });

  test('Get Payment History API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/payments', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.payments).toBeDefined();
  });

  test('Get Payment by ID API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/payments/test-payment-id', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.payment).toBeDefined();
  });
});

test.describe('📊 Dashboard API Tests', () => {
  test('Get Dashboard Stats API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/stats', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.stats).toBeDefined();
    expect(data.stats.overview).toBeDefined();
    expect(data.stats.performance).toBeDefined();
  });

  test('Get Dashboard Activity API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/activity', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.activities).toBeDefined();
  });

  test('Get User Dashboard Stats API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/user-stats', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.stats).toBeDefined();
  });

  test('Get Vendor Dashboard Stats API', async ({ page }) => {
    const token = await getAuthToken(page, testData.vendor.email, testData.vendor.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/vendor/stats', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.stats).toBeDefined();
  });

  test('Get Admin Dashboard Stats API', async ({ page }) => {
    const token = await getAuthToken(page, 'admin@test.com', 'AdminPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/admin/stats', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.stats).toBeDefined();
  });
});

test.describe('👥 Wedding Planner API Tests', () => {
  test('Get Planner Clients API', async ({ page }) => {
    const token = await getAuthToken(page, 'planner@test.com', 'PlannerPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/planner/clients', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.clients).toBeDefined();
  });

  test('Create Planner Client API', async ({ page }) => {
    const token = await getAuthToken(page, 'planner@test.com', 'PlannerPass123!');
    
    const response = await authenticatedRequest(page, 'POST', '/api/clients', {
      name: 'Jane & John Smith',
      email: 'jane.smith@email.com',
      weddingDate: '2024-12-25',
      phone: '+94771234567'
    }, token);
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.client).toBeDefined();
  });

  test('Get Planner Tasks API', async ({ page }) => {
    const token = await getAuthToken(page, 'planner@test.com', 'PlannerPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/planner/tasks', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.tasks).toBeDefined();
  });

  test('Create Planner Task API', async ({ page }) => {
    const token = await getAuthToken(page, 'planner@test.com', 'PlannerPass123!');
    
    const response = await authenticatedRequest(page, 'POST', '/api/tasks', {
      title: 'Book photographer',
      description: 'Research and book wedding photographer',
      priority: 'high',
      dueDate: '2024-11-01',
      clientId: 'test-client-id'
    }, token);
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.task).toBeDefined();
  });
});

test.describe('👑 Admin Management API Tests', () => {
  test('Get All Users API', async ({ page }) => {
    const token = await getAuthToken(page, 'admin@test.com', 'AdminPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/admin/users', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.users).toBeDefined();
  });

  test('Get All Vendors API', async ({ page }) => {
    const token = await getAuthToken(page, 'admin@test.com', 'AdminPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/admin/vendors', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.vendors).toBeDefined();
  });

  test('Update User Role API', async ({ page }) => {
    const token = await getAuthToken(page, 'admin@test.com', 'AdminPass123!');
    
    const response = await authenticatedRequest(page, 'PUT', '/api/users/test-user-id/role', {
      role: 'vendor'
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('User role updated successfully');
  });

  test('Get Admin Reports API', async ({ page }) => {
    const token = await getAuthToken(page, 'admin@test.com', 'AdminPass123!');
    
    const response = await authenticatedRequest(page, 'GET', '/api/dashboard/admin/reports', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.reports).toBeDefined();
  });
});

test.describe('🔍 Search and Filter API Tests', () => {
  test('Search Venues API', async ({ page }) => {
    const response = await page.request.get('/api/venues/search?q=Colombo&category=outdoor');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.venues).toBeDefined();
  });

  test('Search Vendors API', async ({ page }) => {
    const response = await page.request.get('/api/vendors/search?q=photography&category=photography');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.vendors).toBeDefined();
  });

  test('Filter Venues by Price API', async ({ page }) => {
    const response = await page.request.get('/api/venues/search?minPrice=30000&maxPrice=100000');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.venues).toBeDefined();
  });
});

test.describe('📱 Mobile API Tests', () => {
  test('Mobile App Data API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/mobile', {
      action: 'user-data',
      data: { userId: 'test-user-id' }
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });

  test('Mobile Venues API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'POST', '/api/mobile', {
      action: 'venues',
      data: { filters: { location: 'Colombo' } }
    }, token);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
  });
});

test.describe('🔔 Notification API Tests', () => {
  test('Get Notifications API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'GET', '/api/notifications', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.notifications).toBeDefined();
  });

  test('Mark Notification as Read API', async ({ page }) => {
    const token = await getAuthToken(page, testData.user.email, testData.user.password);
    
    const response = await authenticatedRequest(page, 'PUT', '/api/notifications/test-notification-id/read', null, token);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Notification marked as read');
  });
});

test.describe('🛡️ Security and Error Handling API Tests', () => {
  test('Unauthorized API Access', async ({ page }) => {
    const response = await page.request.get('/api/dashboard/stats');
    expect(response.status()).toBe(401);
    
    const data = await response.json();
    expect(data.error).toContain('Unauthorized');
  });

  test('Invalid Token API Access', async ({ page }) => {
    const response = await page.request.get('/api/dashboard/stats', {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    expect(response.status()).toBe(401);
  });

  test('Rate Limiting API', async ({ page }) => {
    // Make multiple requests to test rate limiting
    const promises = Array(10).fill(null).map(() => 
      page.request.get('/api/venues')
    );
    
    const responses = await Promise.all(promises);
    const rateLimitedResponses = responses.filter(r => r.status() === 429);
    
    // At least one request should be rate limited
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('Input Validation API', async ({ page }) => {
    const response = await page.request.post('/api/auth/register', {
      data: {
        name: '', // Invalid empty name
        email: 'invalid-email', // Invalid email format
        password: '123' // Too short password
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.errors).toBeDefined();
  });
});

test.describe('📊 Analytics and Monitoring API Tests', () => {
  test('Performance Monitoring API', async ({ page }) => {
    const response = await page.request.get('/api/performance');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.metrics).toBeDefined();
  });

  test('Health Check API', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
  });

  test('Error Tracking API', async ({ page }) => {
    const response = await page.request.get('/api/errors');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.errors).toBeDefined();
  });
});
