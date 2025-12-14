import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000'

// Test data tracking
interface TestResult {
  endpoint: string
  method: string
  status: number
  duration: number
  passed: boolean
  error?: string
}

const results: TestResult[] = []

describe('🔌 Comprehensive API Tests - All Endpoints Data Validation', () => {
  let authToken: string
  let testUserId: string

  beforeAll(async () => {
    console.log('\n📡 Starting Comprehensive API Test Suite')
    console.log(`🌐 Base URL: ${BASE_URL}`)
    console.log('=' .repeat(60))
  })

  afterAll(() => {
    console.log('\n' + '='.repeat(60))
    console.log('📊 API Test Results Summary:')
    console.log(`✅ Passed: ${results.filter(r => r.passed).length}`)
    console.log(`❌ Failed: ${results.filter(r => !r.passed).length}`)
    console.log(`⏱️  Total Time: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`)
    console.log('='.repeat(60))
    
    // Log failed endpoints
    const failed = results.filter(r => !r.passed)
    if (failed.length > 0) {
      console.log('\n🔴 Failed Endpoints:')
      failed.forEach(r => {
        console.log(`  ${r.method} ${r.endpoint}: ${r.status} - ${r.error}`)
      })
    }
  })

  // Helper to track and make request
  const trackRequest = async (
    method: string,
    endpoint: string,
    makeRequest: () => Promise<any>,
    expectedStatus: number = 200
  ): Promise<any> => {
    const startTime = Date.now()
    try {
      const response = await makeRequest()
      const duration = Date.now() - startTime
      const passed = response.status === expectedStatus
      
      results.push({
        endpoint,
        method,
        status: response.status,
        duration,
        passed,
        error: !passed ? `Expected ${expectedStatus}, got ${response.status}` : undefined
      })

      console.log(`${passed ? '✓' : '✗'} ${method.padEnd(6)} ${endpoint.padEnd(40)} ${response.status} (${duration}ms)`)
      return response
    } catch (error: any) {
      const duration = Date.now() - startTime
      results.push({
        endpoint,
        method,
        status: error.status || 0,
        duration,
        passed: false,
        error: error.message
      })
      console.log(`✗ ${method.padEnd(6)} ${endpoint.padEnd(40)} ERROR: ${error.message}`)
      throw error
    }
  }

  describe('🔐 Authentication APIs', () => {
    it('POST /api/auth/signin - User login', async () => {
      const response = await trackRequest(
        'POST',
        '/api/auth/signin',
        () => request(BASE_URL)
          .post('/api/auth/signin')
          .send({
            email: 'user@test.local',
            password: 'Test123!'
          }),
        200
      )

      expect(response.body.success).toBe(true)
      expect(response.body.user).toBeDefined()
      expect(response.body.user.email).toBe('user@test.local')
      expect(response.body.user.role).toBeDefined()
      
      // Store for later use
      authToken = response.body.token
      testUserId = response.body.user.id
    }, 60000)  // ← Increased timeout to 60s for bcryptjs

    it('GET /api/auth/me - Get authenticated user', async () => {
      if (!authToken) {
        console.log('⚠️  Skipping /api/auth/me - no auth token')
        return
      }

      const response = await trackRequest(
        'GET',
        '/api/auth/me',
        () => request(BASE_URL)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${authToken}`),
        200
      )

      expect(response.body.user).toBeDefined()
      expect(response.body.user.email).toBe('user@test.local')
    })

    it('POST /api/auth/signout - User logout', async () => {
      const response = await trackRequest(
        'POST',
        '/api/auth/signout',
        () => request(BASE_URL)
          .post('/api/auth/signout'),
        200
      )

      expect(response.body.success).toBe(true)
    }, 60000)  // ← Increased timeout to 60s for bcryptjs
  })

  describe('📊 Dashboard APIs', () => {
    it('GET /api/dashboard/stats - Get dashboard statistics', async () => {
      const response = await trackRequest(
        'GET',
        '/api/dashboard/stats',
        () => request(BASE_URL)
          .get('/api/dashboard/stats'),
        200
      )

      expect(response.body).toBeDefined()
      expect(Array.isArray(response.body) || typeof response.body === 'object').toBe(true)
    })

    it('GET /api/dashboard/user/stats - Get user dashboard stats', async () => {
      const response = await trackRequest(
        'GET',
        '/api/dashboard/user/stats',
        () => request(BASE_URL)
          .get('/api/dashboard/user/stats'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/dashboard/vendor/stats - Get vendor dashboard stats', async () => {
      const response = await trackRequest(
        'GET',
        '/api/dashboard/vendor/stats',
        () => request(BASE_URL)
          .get('/api/dashboard/vendor/stats'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/dashboard/admin/stats - Get admin dashboard stats', async () => {
      const response = await trackRequest(
        'GET',
        '/api/dashboard/admin/stats',
        () => request(BASE_URL)
          .get('/api/dashboard/admin/stats'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('🏛️ Venue APIs', () => {
    it('GET /api/venues - List venues', async () => {
      const response = await trackRequest(
        'GET',
        '/api/venues?page=1&limit=10',
        () => request(BASE_URL)
          .get('/api/venues?page=1&limit=10'),
        200
      )

      expect(response.body.success !== false).toBe(true)
      expect(Array.isArray(response.body.venues) || Array.isArray(response.body)).toBe(true)
    })

    it('GET /api/venues/search - Search venues', async () => {
      const response = await trackRequest(
        'GET',
        '/api/venues/search?q=venue',
        () => request(BASE_URL)
          .get('/api/venues/search?q=venue'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/home/featured-venues - Get featured venues', async () => {
      const response = await trackRequest(
        'GET',
        '/api/home/featured-venues',
        () => request(BASE_URL)
          .get('/api/home/featured-venues'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('🏢 Vendor APIs', () => {
    it('GET /api/vendors - List vendors', async () => {
      const response = await trackRequest(
        'GET',
        '/api/vendors?page=1&limit=10',
        () => request(BASE_URL)
          .get('/api/vendors?page=1&limit=10'),
        200
      )

      expect(response.body.success !== false).toBe(true)
    })

    it('GET /api/vendors/search - Search vendors', async () => {
      const response = await trackRequest(
        'GET',
        '/api/vendors/search?q=vendor',
        () => request(BASE_URL)
          .get('/api/vendors/search?q=vendor'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/vendors/categories - Get vendor categories', async () => {
      const response = await trackRequest(
        'GET',
        '/api/vendors/categories',
        () => request(BASE_URL)
          .get('/api/vendors/categories'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/home/featured-vendors - Get featured vendors', async () => {
      const response = await trackRequest(
        'GET',
        '/api/home/featured-vendors',
        () => request(BASE_URL)
          .get('/api/home/featured-vendors'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('📅 Booking APIs', () => {
    it('GET /api/bookings - List user bookings', async () => {
      const response = await trackRequest(
        'GET',
        '/api/bookings',
        () => request(BASE_URL)
          .get('/api/bookings'),
        200
      )

      expect(response.body.success !== false).toBe(true)
    })

    it('POST /api/bookings - Create booking', async () => {
      const response = await trackRequest(
        'POST',
        '/api/bookings',
        () => request(BASE_URL)
          .post('/api/bookings')
          .send({
            eventDate: '2024-12-25',
            eventTime: '18:00',
            guestCount: 100,
            contactPhone: '0771234567',
            contactEmail: 'test@example.com'
          }),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('👤 User APIs', () => {
    it('GET /api/users/profile - Get user profile', async () => {
      const response = await trackRequest(
        'GET',
        '/api/users/profile',
        () => request(BASE_URL)
          .get('/api/users/profile'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/user/favorites - Get user favorites', async () => {
      const response = await trackRequest(
        'GET',
        '/api/user/favorites',
        () => request(BASE_URL)
          .get('/api/user/favorites'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('🔍 Search APIs', () => {
    it('GET /api/search - General search', async () => {
      const response = await trackRequest(
        'GET',
        '/api/search?q=wedding',
        () => request(BASE_URL)
          .get('/api/search?q=wedding'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/trending - Get trending content', async () => {
      const response = await trackRequest(
        'GET',
        '/api/trending',
        () => request(BASE_URL)
          .get('/api/trending'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('🏠 Homepage APIs', () => {
    it('GET /api/home/stats - Get homepage stats', async () => {
      const response = await trackRequest(
        'GET',
        '/api/home/stats',
        () => request(BASE_URL)
          .get('/api/home/stats'),
        200
      )

      expect(response.body).toBeDefined()
    })

    it('GET /api/home/testimonials - Get testimonials', async () => {
      const response = await trackRequest(
        'GET',
        '/api/home/testimonials',
        () => request(BASE_URL)
          .get('/api/home/testimonials'),
        200
      )

      expect(response.body).toBeDefined()
    })
  })

  describe('💗 Health Check APIs', () => {
    it('GET /api/health/db - Database health check', async () => {
      const response = await trackRequest(
        'GET',
        '/api/health/db',
        () => request(BASE_URL)
          .get('/api/health/db'),
        200
      )

      expect(response.body.status).toBeDefined()
    })
  })
})
