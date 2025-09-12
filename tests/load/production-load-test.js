import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be below 10%
    errors: ['rate<0.1'],              // Custom error rate must be below 10%
  },
};

const BASE_URL = 'https://wedding-9f2773v90-asithalkonaras-projects.vercel.app';

export default function() {
  // Test homepage
  const homepageResponse = http.get(`${BASE_URL}/`);
  check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads within 2s': (r) => r.timings.duration < 2000,
    'homepage contains title': (r) => r.body.includes('WeddingLK'),
  });
  errorRate.add(homepageResponse.status !== 200);

  sleep(1);

  // Test vendors API
  const vendorsResponse = http.get(`${BASE_URL}/api/vendors`);
  check(vendorsResponse, {
    'vendors API status is 200': (r) => r.status === 200,
    'vendors API responds within 1s': (r) => r.timings.duration < 1000,
    'vendors API returns data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && Array.isArray(data.vendors);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(vendorsResponse.status !== 200);

  sleep(1);

  // Test venues API
  const venuesResponse = http.get(`${BASE_URL}/api/venues`);
  check(venuesResponse, {
    'venues API status is 200': (r) => r.status === 200,
    'venues API responds within 1s': (r) => r.timings.duration < 1000,
    'venues API returns data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true && Array.isArray(data.venues);
      } catch {
        return false;
      }
    },
  });
  errorRate.add(venuesResponse.status !== 200);

  sleep(1);

  // Test search API
  const searchResponse = http.get(`${BASE_URL}/api/search?vendors=photography&location=Colombo`);
  check(searchResponse, {
    'search API status is 200': (r) => r.status === 200,
    'search API responds within 2s': (r) => r.timings.duration < 2000,
    'search API returns data': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.success === true;
      } catch {
        return false;
      }
    },
  });
  errorRate.add(searchResponse.status !== 200);

  sleep(1);

  // Test health check
  const healthResponse = http.get(`${BASE_URL}/api/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check responds within 1s': (r) => r.timings.duration < 1000,
    'health check returns healthy status': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.status === 'healthy' || data.status === 'degraded';
      } catch {
        return false;
      }
    },
  });
  errorRate.add(healthResponse.status !== 200);

  sleep(1);

  // Test authentication flow
  const authData = {
    email: `testuser${__VU}@weddinglk.com`,
    password: 'TestPassword123!',
  };

  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(authData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login API responds': (r) => r.status === 200 || r.status === 401,
    'login API responds within 1s': (r) => r.timings.duration < 1000,
  });

  if (loginResponse.status === 200) {
    const loginData = JSON.parse(loginResponse.body);
    const token = loginData.token;

    // Test authenticated endpoint
    const profileResponse = http.get(`${BASE_URL}/api/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    check(profileResponse, {
      'profile API status is 200': (r) => r.status === 200,
      'profile API responds within 1s': (r) => r.timings.duration < 1000,
    });
    errorRate.add(profileResponse.status !== 200);
  }

  sleep(2);
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    'load-test-summary.txt': `
Load Test Summary for WeddingLK Production
==========================================

Test Duration: ${data.metrics.iteration_duration.values.avg.toFixed(2)}ms
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${data.metrics.http_req_failed.values.count}
Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%

Response Times:
- Average: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
- 95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
- 99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms

VU (Virtual Users):
- Average: ${data.metrics.vus.values.avg.toFixed(2)}
- Maximum: ${data.metrics.vus.values.max}

Data Transferred:
- Total: ${(data.metrics.data_sent.values.count / 1024 / 1024).toFixed(2)} MB
- Received: ${(data.metrics.data_received.values.count / 1024 / 1024).toFixed(2)} MB

Status: ${data.metrics.http_req_failed.values.rate < 0.1 ? 'PASSED' : 'FAILED'}
    `,
  };
}
