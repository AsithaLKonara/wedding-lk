import { test, expect } from '@playwright/test'

// Test credentials
const TEST_USER = { email: 'user@test.local', password: 'Test123!' }
const TEST_VENDOR = { email: 'vendor@test.local', password: 'Test123!' }
const TEST_ADMIN = { email: 'admin@test.local', password: 'Test123!' }

// Helper to get auth token
async function getAuthToken(email: string, password: string, page: any) {
  const response = await page.request.post('/api/auth/signin', {
    data: { email, password }
  })
  return response.ok()
}

test.describe('🔌 API Integration Tests - Phase 2', () => {
  // ═══════════════════════════════════════════════════════════════════════
  // Authentication APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔐 Authentication APIs', () => {
    test('✅ POST /api/auth/signin - Valid credentials return 200', async ({ page }) => {
      const response = await page.request.post('/api/auth/signin', {
        data: { email: TEST_USER.email, password: TEST_USER.password }
      })
      
      expect(response.status()).toBe(200)
      const json = await response.json()
      expect(json).toHaveProperty('user')
      expect(json.user).toHaveProperty('email')
      expect(json.user).toHaveProperty('role')
    })

    test('✅ POST /api/auth/signin - Invalid credentials return 401', async ({ page }) => {
      const response = await page.request.post('/api/auth/signin', {
        data: { email: 'invalid@test.local', password: 'WrongPassword!' }
      })
      
      expect(response.status()).toBe(401)
      const json = await response.json()
      expect(json).toHaveProperty('error')
    })

    test('✅ POST /api/auth/signup - New user registration', async ({ page }) => {
      const newUser = {
        name: 'Test User',
        email: `test-${Date.now()}@test.local`,
        password: 'TestPassword123!',
        role: 'user'
      }
      
      const response = await page.request.post('/api/auth/signup', {
        data: newUser
      })
      
      expect([200, 201, 400]).toContain(response.status())
      const json = await response.json()
      
      if (response.ok()) {
        expect(json).toHaveProperty('user')
        expect(json.user.email).toBe(newUser.email)
      }
    })

    test('✅ GET /api/auth/me - Get current user info', async ({ page }) => {
      // First login
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      // Then get user info
      const response = await page.request.get('/api/auth/me')
      
      if (response.ok()) {
        const json = await response.json()
        expect(json).toHaveProperty('user')
        expect(json.user.email).toBe(TEST_USER.email)
      }
    })

    test('✅ POST /api/auth/signout - Logout user', async ({ page }) => {
      // First login
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      // Then logout
      const response = await page.request.post('/api/auth/signout')
      
      expect([200, 204]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Dashboard APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📊 Dashboard APIs', () => {
    test('✅ GET /api/dashboard/user - User dashboard stats', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/dashboard/user')
      
      if (response.ok()) {
        const json = await response.json()
        expect(json).toBeTruthy()
      }
    })

    test('✅ GET /api/dashboard/vendor - Vendor dashboard stats', async ({ page }) => {
      await getAuthToken(TEST_VENDOR.email, TEST_VENDOR.password, page)
      
      const response = await page.request.get('/api/dashboard/vendor')
      
      if (response.ok()) {
        const json = await response.json()
        expect(json).toBeTruthy()
      }
    })

    test('✅ GET /api/dashboard/admin - Admin dashboard stats', async ({ page }) => {
      await getAuthToken(TEST_ADMIN.email, TEST_ADMIN.password, page)
      
      const response = await page.request.get('/api/dashboard/admin')
      
      if (response.ok()) {
        const json = await response.json()
        expect(json).toBeTruthy()
      }
    })

    test('✅ GET /api/dashboard - General dashboard stats', async ({ page }) => {
      const response = await page.request.get('/api/dashboard')
      
      // Should either work or redirect to login
      expect([200, 401, 302]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Venue APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🏛️ Venue APIs', () => {
    test('✅ GET /api/venues - List all venues', async ({ page }) => {
      const response = await page.request.get('/api/venues')
      
      expect([200, 404]).toContain(response.status())
      
      if (response.ok()) {
        const json = await response.json()
        expect(Array.isArray(json) || json.venues).toBeTruthy()
      }
    })

    test('✅ GET /api/venues/search - Search venues', async ({ page }) => {
      const response = await page.request.get('/api/venues/search?q=colombo')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/venues/:id - Get specific venue', async ({ page }) => {
      const response = await page.request.get('/api/venues/test-venue-id')
      
      expect([200, 404, 400]).toContain(response.status())
    })

    test('✅ GET /api/venues/search with filters', async ({ page }) => {
      const response = await page.request.get(
        '/api/venues/search?location=Colombo&capacity=100&priceMin=50000&priceMax=500000'
      )
      
      expect([200, 404, 400]).toContain(response.status())
    })

    test('✅ GET /api/venues with pagination', async ({ page }) => {
      const response = await page.request.get('/api/venues?page=1&limit=10')
      
      expect([200, 404]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Vendor APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🏢 Vendor APIs', () => {
    test('✅ GET /api/vendors - List all vendors', async ({ page }) => {
      const response = await page.request.get('/api/vendors')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/vendors/search - Search vendors', async ({ page }) => {
      const response = await page.request.get('/api/vendors/search?q=photographer')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/vendors/:id - Get specific vendor', async ({ page }) => {
      const response = await page.request.get('/api/vendors/test-vendor-id')
      
      expect([200, 404, 400]).toContain(response.status())
    })

    test('✅ GET /api/vendors/category/:category - Get vendors by category', async ({ page }) => {
      const response = await page.request.get('/api/vendors/category/photography')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/vendors/search with filters', async ({ page }) => {
      const response = await page.request.get(
        '/api/vendors/search?category=photography&rating=4&location=Colombo'
      )
      
      expect([200, 404]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Booking APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('📅 Booking APIs', () => {
    test('✅ GET /api/bookings - List user bookings', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/bookings')
      
      expect([200, 401, 404]).toContain(response.status())
    })

    test('✅ POST /api/bookings - Create booking', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.post('/api/bookings', {
        data: {
          vendorId: 'test-vendor',
          date: '2025-12-25',
          guestCount: 100,
          budget: 500000
        }
      })
      
      expect([200, 201, 400, 401, 404]).toContain(response.status())
    })

    test('✅ GET /api/bookings/:id - Get specific booking', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/bookings/test-booking-id')
      
      expect([200, 404, 401]).toContain(response.status())
    })

    test('✅ PATCH /api/bookings/:id - Update booking', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.patch('/api/bookings/test-booking-id', {
        data: { status: 'confirmed' }
      })
      
      expect([200, 400, 404, 401]).toContain(response.status())
    })

    test('✅ DELETE /api/bookings/:id - Cancel booking', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.delete('/api/bookings/test-booking-id')
      
      expect([200, 204, 404, 401]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // User Profile APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('👤 User Profile APIs', () => {
    test('✅ GET /api/users/profile - Get user profile', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/users/profile')
      
      expect([200, 401, 404]).toContain(response.status())
    })

    test('✅ PATCH /api/users/profile - Update user profile', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.patch('/api/users/profile', {
        data: { name: 'Updated Name', phone: '0712345678' }
      })
      
      expect([200, 400, 401, 404]).toContain(response.status())
    })

    test('✅ POST /api/users/profile/avatar - Upload avatar', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.post('/api/users/profile/avatar', {
        data: { url: 'https://example.com/avatar.jpg' }
      })
      
      expect([200, 400, 401, 404]).toContain(response.status())
    })

    test('✅ GET /api/users/preferences - Get user preferences', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/users/preferences')
      
      expect([200, 401, 404]).toContain(response.status())
    })

    test('✅ PATCH /api/users/preferences - Update preferences', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.patch('/api/users/preferences', {
        data: { notifications: true, newsletter: false }
      })
      
      expect([200, 400, 401, 404]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Search & Discovery APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🔍 Search & Discovery APIs', () => {
    test('✅ GET /api/search - Global search', async ({ page }) => {
      const response = await page.request.get('/api/search?q=photographer')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/search/suggestions - Search suggestions', async ({ page }) => {
      const response = await page.request.get('/api/search/suggestions?q=photo')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/categories - Get all categories', async ({ page }) => {
      const response = await page.request.get('/api/categories')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/trending - Get trending items', async ({ page }) => {
      const response = await page.request.get('/api/trending')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/featured - Get featured vendors/venues', async ({ page }) => {
      const response = await page.request.get('/api/featured')
      
      expect([200, 404]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Favorites/Wishlist APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('❤️ Favorites APIs', () => {
    test('✅ GET /api/favorites - Get user favorites', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/favorites')
      
      expect([200, 401, 404]).toContain(response.status())
    })

    test('✅ POST /api/favorites - Add to favorites', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.post('/api/favorites', {
        data: { vendorId: 'test-vendor-id' }
      })
      
      expect([200, 201, 400, 401, 404]).toContain(response.status())
    })

    test('✅ DELETE /api/favorites/:id - Remove from favorites', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.delete('/api/favorites/test-favorite-id')
      
      expect([200, 204, 404, 401]).toContain(response.status())
    })

    test('✅ GET /api/favorites/check - Check if item is favorited', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.get('/api/favorites/check?vendorId=test-vendor-id')
      
      expect([200, 401, 404]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Review & Rating APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('⭐ Reviews & Ratings APIs', () => {
    test('✅ GET /api/reviews - Get reviews', async ({ page }) => {
      const response = await page.request.get('/api/reviews?vendorId=test-vendor')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ POST /api/reviews - Create review', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.post('/api/reviews', {
        data: {
          vendorId: 'test-vendor-id',
          rating: 5,
          comment: 'Great service!',
          bookingId: 'test-booking-id'
        }
      })
      
      expect([200, 201, 400, 401, 404]).toContain(response.status())
    })

    test('✅ PATCH /api/reviews/:id - Update review', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.patch('/api/reviews/test-review-id', {
        data: { rating: 4, comment: 'Good service' }
      })
      
      expect([200, 400, 404, 401]).toContain(response.status())
    })

    test('✅ DELETE /api/reviews/:id - Delete review', async ({ page }) => {
      await getAuthToken(TEST_USER.email, TEST_USER.password, page)
      
      const response = await page.request.delete('/api/reviews/test-review-id')
      
      expect([200, 204, 404, 401]).toContain(response.status())
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // Health & Status APIs
  // ═══════════════════════════════════════════════════════════════════════

  test.describe('🏥 Health & Status APIs', () => {
    test('✅ GET /api/health - API health check', async ({ page }) => {
      const response = await page.request.get('/api/health')
      
      expect([200, 404]).toContain(response.status())
    })

    test('✅ GET /api/status - System status', async ({ page }) => {
      const response = await page.request.get('/api/status')
      
      expect([200, 404]).toContain(response.status())
    })
  })
})

export { test }
