import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
export const errorRate = new Rate('errors');
export const responseTime = new Trend('response_time');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://wedding-lkcom.vercel.app';

export default function() {
  // Test scenarios
  const scenarios = [
    testHomepage,
    testVendorSearch,
    testUserRegistration,
    testVendorDetails,
    testBookingFlow,
    testReviewSystem,
    testAnalyticsAPI,
  ];

  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario();
  
  sleep(1);
}

function testHomepage() {
  const response = http.get(`${BASE_URL}/`);
  
  check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads within 2s': (r) => r.timings.duration < 2000,
    'homepage has correct content': (r) => r.body.includes('WeddingLK'),
  });
  
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
}

function testVendorSearch() {
  const searchParams = [
    'photography',
    'catering',
    'venue',
    'music',
    'decorations'
  ];
  
  const query = searchParams[Math.floor(Math.random() * searchParams.length)];
  const response = http.get(`${BASE_URL}/api/search?q=${query}&limit=20`);
  
  check(response, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 1s': (r) => r.timings.duration < 1000,
    'search returns results': (r) => {
      const data = JSON.parse(r.body);
      return data.success && Array.isArray(data.results);
    },
  });
  
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);
}

function testUserRegistration() {
  const userData = {
    name: `Test User ${Math.random().toString(36).substr(2, 9)}`,
    email: `test${Math.random().toString(36).substr(2, 9)}@example.com`,
    password: 'password123',
    phone: '+94771234567',
    role: 'user',
    location: {
      country: 'Sri Lanka',
      state: 'Western Province',
      city: 'Colombo'
    }
  };

  const response = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(response, {
    'registration status is 201': (r) => r.status === 201,
    'registration response time < 2s': (r) => r.timings.duration < 2000,
    'registration returns success': (r) => {
      const data = JSON.parse(r.body);
      return data.success || data.message;
    },
  });
  
  errorRate.add(response.status !== 201);
  responseTime.add(response.timings.duration);
}

function testVendorDetails() {
  // First get a list of vendors
  const vendorsResponse = http.get(`${BASE_URL}/api/vendors?limit=10`);
  
  if (vendorsResponse.status === 200) {
    const vendorsData = JSON.parse(vendorsResponse.body);
    if (vendorsData.vendors && vendorsData.vendors.length > 0) {
      const vendorId = vendorsData.vendors[0]._id;
      const response = http.get(`${BASE_URL}/api/vendors/${vendorId}`);
      
      check(response, {
        'vendor details status is 200': (r) => r.status === 200,
        'vendor details response time < 1s': (r) => r.timings.duration < 1000,
        'vendor details has correct data': (r) => {
          const data = JSON.parse(r.body);
          return data.success && data.vendor;
        },
      });
      
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);
    }
  }
}

function testBookingFlow() {
  // This would require authentication, so we'll test the booking API endpoint
  const bookingData = {
    vendorId: '507f1f77bcf86cd799439011', // Mock vendor ID
    serviceType: 'Wedding Photography',
    bookingDate: '2024-06-15',
    amount: 50000,
    details: {
      eventType: 'Wedding',
      guestCount: 100,
      location: 'Colombo'
    }
  };

  const response = http.post(`${BASE_URL}/api/bookings`, JSON.stringify(bookingData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // We expect this to fail without authentication, but we test the response time
  check(response, {
    'booking API responds': (r) => r.status >= 200 && r.status < 500,
    'booking API response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(response.status >= 500);
  responseTime.add(response.timings.duration);
}

function testReviewSystem() {
  const reviewData = {
    vendorId: '507f1f77bcf86cd799439011', // Mock vendor ID
    overallRating: 5,
    title: 'Great Service',
    comment: 'Excellent photography service!',
    categoryRatings: {
      service: 5,
      quality: 5,
      value: 4,
      communication: 5,
      timeliness: 5
    }
  };

  const response = http.post(`${BASE_URL}/api/reviews`, JSON.stringify(reviewData), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // We expect this to fail without authentication, but we test the response time
  check(response, {
    'review API responds': (r) => r.status >= 200 && r.status < 500,
    'review API response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  errorRate.add(response.status >= 500);
  responseTime.add(response.timings.duration);
}

function testAnalyticsAPI() {
  const response = http.get(`${BASE_URL}/api/analytics/dashboard`);
  
  check(response, {
    'analytics API responds': (r) => r.status >= 200 && r.status < 500,
    'analytics API response time < 3s': (r) => r.timings.duration < 3000,
  });
  
  errorRate.add(response.status >= 500);
  responseTime.add(response.timings.duration);
}

