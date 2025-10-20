import { test, expect, Page, BrowserContext } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.DEPLOY_URL || 'http://localhost:3000'
const TEST_TIMEOUT = 30000

// Test data
const testUsers = {
  admin: {
    email: 'admin@weddinglk.com',
    password: 'Admin123!',
    role: 'admin'
  },
  vendor: {
    email: 'vendor@weddinglk.com',
    password: 'Vendor123!',
    role: 'vendor'
  },
  client: {
    email: 'client@weddinglk.com',
    password: 'Client123!',
    role: 'client'
  }
}

// Helper functions
async function loginAs(page: Page, userType: keyof typeof testUsers) {
  const user = testUsers[userType]
  
  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('networkidle')
  
  await page.fill('input[name="email"]', user.email)
  await page.fill('input[name="password"]', user.password)
  await page.click('button[type="submit"]')
  
  await page.waitForURL('**/dashboard**', { timeout: 10000 })
  await expect(page).toHaveURL(/.*dashboard/)
}

async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="logout-button"]')
  await page.waitForURL('**/login**')
}

async function createTestData(page: Page, type: string, data: any) {
  // Navigate to create page
  await page.goto(`${BASE_URL}/${type}/create`)
  await page.waitForLoadState('networkidle')
  
  // Fill form fields
  for (const [key, value] of Object.entries(data)) {
    const field = page.locator(`[name="${key}"]`)
    if (await field.isVisible()) {
      await field.fill(String(value))
    }
  }
  
  // Submit form
  await page.click('button[type="submit"]')
  await page.waitForLoadState('networkidle')
  
  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
}

async function updateTestData(page: Page, type: string, id: string, data: any) {
  // Navigate to edit page
  await page.goto(`${BASE_URL}/${type}/${id}/edit`)
  await page.waitForLoadState('networkidle')
  
  // Update form fields
  for (const [key, value] of Object.entries(data)) {
    const field = page.locator(`[name="${key}"]`)
    if (await field.isVisible()) {
      await field.clear()
      await field.fill(String(value))
    }
  }
  
  // Submit form
  await page.click('button[type="submit"]')
  await page.waitForLoadState('networkidle')
  
  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
}

async function deleteTestData(page: Page, type: string, id: string) {
  // Navigate to detail page
  await page.goto(`${BASE_URL}/${type}/${id}`)
  await page.waitForLoadState('networkidle')
  
  // Click delete button
  await page.click('[data-testid="delete-button"]')
  
  // Confirm deletion
  await page.click('[data-testid="confirm-delete"]')
  await page.waitForLoadState('networkidle')
  
  // Verify success
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
}

// Test suite
test.describe('Comprehensive CRUD & RBAC Tests', () => {
  test.describe.configure({ mode: 'serial' })
  
  let context: BrowserContext
  let adminPage: Page
  let vendorPage: Page
  let clientPage: Page
  
  test.beforeAll(async ({ browser }) => {
    // Create separate contexts for different user types
    context = await browser.newContext()
    adminPage = await context.newPage()
    vendorPage = await context.newPage()
    clientPage = await context.newPage()
  })
  
  test.afterAll(async () => {
    await context.close()
  })
  
  test.describe('Authentication & Authorization', () => {
    test('Admin can login and access admin features', async () => {
      await loginAs(adminPage, 'admin')
      
      // Check admin dashboard
      await expect(adminPage.locator('[data-testid="admin-dashboard"]')).toBeVisible()
      
      // Check admin navigation
      await expect(adminPage.locator('[data-testid="admin-nav"]')).toBeVisible()
      
      // Check admin-specific features
      await expect(adminPage.locator('[data-testid="user-management"]')).toBeVisible()
      await expect(adminPage.locator('[data-testid="analytics"]')).toBeVisible()
    })
    
    test('Vendor can login and access vendor features', async () => {
      await loginAs(vendorPage, 'vendor')
      
      // Check vendor dashboard
      await expect(vendorPage.locator('[data-testid="vendor-dashboard"]')).toBeVisible()
      
      // Check vendor navigation
      await expect(vendorPage.locator('[data-testid="vendor-nav"]')).toBeVisible()
      
      // Check vendor-specific features
      await expect(vendorPage.locator('[data-testid="vendor-profile"]')).toBeVisible()
      await expect(vendorPage.locator('[data-testid="vendor-services"]')).toBeVisible()
    })
    
    test('Client can login and access client features', async () => {
      await loginAs(clientPage, 'client')
      
      // Check client dashboard
      await expect(clientPage.locator('[data-testid="client-dashboard"]')).toBeVisible()
      
      // Check client navigation
      await expect(clientPage.locator('[data-testid="client-nav"]')).toBeVisible()
      
      // Check client-specific features
      await expect(clientPage.locator('[data-testid="bookings"]')).toBeVisible()
      await expect(clientPage.locator('[data-testid="favorites"]')).toBeVisible()
    })
    
    test('Role-based access control works correctly', async () => {
      // Test admin accessing vendor features
      await adminPage.goto(`${BASE_URL}/vendor/dashboard`)
      await expect(adminPage.locator('[data-testid="access-denied"]')).toBeVisible()
      
      // Test vendor accessing admin features
      await vendorPage.goto(`${BASE_URL}/admin/dashboard`)
      await expect(vendorPage.locator('[data-testid="access-denied"]')).toBeVisible()
      
      // Test client accessing admin features
      await clientPage.goto(`${BASE_URL}/admin/dashboard`)
      await expect(clientPage.locator('[data-testid="access-denied"]')).toBeVisible()
    })
  })
  
  test.describe('User Management CRUD', () => {
    test('Admin can create new users', async () => {
      await loginAs(adminPage, 'admin')
      
      const newUser = {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Test123!',
        role: 'client',
        phone: '+94771234567'
      }
      
      await createTestData(adminPage, 'admin/users', newUser)
    })
    
    test('Admin can view all users', async () => {
      await adminPage.goto(`${BASE_URL}/admin/users`)
      await adminPage.waitForLoadState('networkidle')
      
      // Check users table
      await expect(adminPage.locator('[data-testid="users-table"]')).toBeVisible()
      
      // Check pagination
      await expect(adminPage.locator('[data-testid="pagination"]')).toBeVisible()
      
      // Check search functionality
      await adminPage.fill('[data-testid="search-input"]', 'test')
      await adminPage.click('[data-testid="search-button"]')
      await adminPage.waitForLoadState('networkidle')
    })
    
    test('Admin can update user details', async () => {
      const updatedData = {
        name: 'Updated Test User',
        phone: '+94771234568'
      }
      
      await updateTestData(adminPage, 'admin/users', 'test-user-id', updatedData)
    })
    
    test('Admin can delete users', async () => {
      await deleteTestData(adminPage, 'admin/users', 'test-user-id')
    })
  })
  
  test.describe('Venue Management CRUD', () => {
    test('Admin can create venues', async () => {
      await loginAs(adminPage, 'admin')
      
      const newVenue = {
        name: 'Test Venue',
        location: 'Colombo',
        capacity: 200,
        price: 50000,
        amenities: ['Parking', 'AC', 'Sound System'],
        description: 'A beautiful test venue',
        images: ['venue1.jpg', 'venue2.jpg']
      }
      
      await createTestData(adminPage, 'admin/venues', newVenue)
    })
    
    test('Vendor can create venues', async () => {
      await loginAs(vendorPage, 'vendor')
      
      const newVenue = {
        name: 'Vendor Venue',
        location: 'Kandy',
        capacity: 150,
        price: 40000,
        amenities: ['Parking', 'AC'],
        description: 'A vendor-managed venue',
        images: ['vendor-venue1.jpg']
      }
      
      await createTestData(vendorPage, 'vendor/venues', newVenue)
    })
    
    test('Users can view venues', async () => {
      await loginAs(clientPage, 'client')
      
      await clientPage.goto(`${BASE_URL}/venues`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check venue cards
      await expect(clientPage.locator('[data-testid="venue-card"]')).toBeVisible()
      
      // Test filtering
      await clientPage.click('[data-testid="filter-location"]')
      await clientPage.selectOption('[data-testid="location-select"]', 'Colombo')
      await clientPage.waitForLoadState('networkidle')
      
      // Test search
      await clientPage.fill('[data-testid="search-input"]', 'Test Venue')
      await clientPage.click('[data-testid="search-button"]')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can update venues', async () => {
      await loginAs(adminPage, 'admin')
      
      const updatedData = {
        name: 'Updated Test Venue',
        capacity: 250,
        price: 60000
      }
      
      await updateTestData(adminPage, 'admin/venues', 'test-venue-id', updatedData)
    })
    
    test('Admin can delete venues', async () => {
      await deleteTestData(adminPage, 'admin/venues', 'test-venue-id')
    })
  })
  
  test.describe('Vendor Management CRUD', () => {
    test('Admin can create vendors', async () => {
      await loginAs(adminPage, 'admin')
      
      const newVendor = {
        name: 'Test Vendor',
        category: 'Photography',
        location: 'Colombo',
        price: 25000,
        services: ['Wedding Photography', 'Engagement Shoots'],
        description: 'Professional wedding photographer',
        images: ['vendor1.jpg', 'vendor2.jpg']
      }
      
      await createTestData(adminPage, 'admin/vendors', newVendor)
    })
    
    test('Vendors can update their profiles', async () => {
      await loginAs(vendorPage, 'vendor')
      
      const updatedData = {
        name: 'Updated Vendor Name',
        description: 'Updated description',
        services: ['Wedding Photography', 'Engagement Shoots', 'Portrait Photography']
      }
      
      await updateTestData(vendorPage, 'vendor/profile', 'vendor-profile-id', updatedData)
    })
    
    test('Users can view vendors', async () => {
      await loginAs(clientPage, 'client')
      
      await clientPage.goto(`${BASE_URL}/vendors`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check vendor cards
      await expect(clientPage.locator('[data-testid="vendor-card"]')).toBeVisible()
      
      // Test category filtering
      await clientPage.click('[data-testid="filter-category"]')
      await clientPage.selectOption('[data-testid="category-select"]', 'Photography')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can delete vendors', async () => {
      await deleteTestData(adminPage, 'admin/vendors', 'test-vendor-id')
    })
  })
  
  test.describe('Package Management CRUD', () => {
    test('Admin can create packages', async () => {
      await loginAs(adminPage, 'admin')
      
      const newPackage = {
        name: 'Test Package',
        description: 'A comprehensive wedding package',
        price: 100000,
        features: {
          'Venue': true,
          'Photography': true,
          'Catering': true,
          'Music': false
        },
        category: 'Premium'
      }
      
      await createTestData(adminPage, 'admin/packages', newPackage)
    })
    
    test('Users can view packages', async () => {
      await loginAs(clientPage, 'client')
      
      await clientPage.goto(`${BASE_URL}/packages`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check package cards
      await expect(clientPage.locator('[data-testid="package-card"]')).toBeVisible()
      
      // Test package comparison
      await clientPage.click('[data-testid="compare-packages"]')
      await clientPage.waitForLoadState('networkidle')
      
      // Test package filtering
      await clientPage.click('[data-testid="filter-price"]')
      await clientPage.fill('[data-testid="min-price"]', '50000')
      await clientPage.fill('[data-testid="max-price"]', '150000')
      await clientPage.click('[data-testid="apply-filters"]')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can update packages', async () => {
      const updatedData = {
        name: 'Updated Test Package',
        price: 120000,
        features: {
          'Venue': true,
          'Photography': true,
          'Catering': true,
          'Music': true
        }
      }
      
      await updateTestData(adminPage, 'admin/packages', 'test-package-id', updatedData)
    })
    
    test('Admin can delete packages', async () => {
      await deleteTestData(adminPage, 'admin/packages', 'test-package-id')
    })
  })
  
  test.describe('Booking Management CRUD', () => {
    test('Clients can create bookings', async () => {
      await loginAs(clientPage, 'client')
      
      const newBooking = {
        venueId: 'test-venue-id',
        vendorIds: ['vendor1', 'vendor2'],
        packageId: 'test-package-id',
        eventDate: '2024-12-25',
        eventTime: '18:00',
        guestCount: 150,
        specialRequests: 'Outdoor ceremony preferred'
      }
      
      await createTestData(clientPage, 'bookings', newBooking)
    })
    
    test('Users can view their bookings', async () => {
      await loginAs(clientPage, 'client')
      
      await clientPage.goto(`${BASE_URL}/dashboard/bookings`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check bookings list
      await expect(clientPage.locator('[data-testid="bookings-list"]')).toBeVisible()
      
      // Test booking status filtering
      await clientPage.click('[data-testid="filter-status"]')
      await clientPage.selectOption('[data-testid="status-select"]', 'confirmed')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can view all bookings', async () => {
      await loginAs(adminPage, 'admin')
      
      await adminPage.goto(`${BASE_URL}/admin/bookings`)
      await adminPage.waitForLoadState('networkidle')
      
      // Check admin bookings view
      await expect(adminPage.locator('[data-testid="admin-bookings"]')).toBeVisible()
      
      // Test booking management
      await adminPage.click('[data-testid="booking-actions"]')
      await expect(adminPage.locator('[data-testid="booking-menu"]')).toBeVisible()
    })
    
    test('Users can update bookings', async () => {
      const updatedData = {
        guestCount: 200,
        specialRequests: 'Updated special requests'
      }
      
      await updateTestData(clientPage, 'bookings', 'test-booking-id', updatedData)
    })
    
    test('Users can cancel bookings', async () => {
      await clientPage.goto(`${BASE_URL}/bookings/test-booking-id`)
      await clientPage.waitForLoadState('networkidle')
      
      await clientPage.click('[data-testid="cancel-booking"]')
      await clientPage.click('[data-testid="confirm-cancel"]')
      await clientPage.waitForLoadState('networkidle')
      
      await expect(clientPage.locator('[data-testid="success-message"]')).toBeVisible()
    })
  })
  
  test.describe('Payment Management CRUD', () => {
    test('Users can create payments', async () => {
      await loginAs(clientPage, 'client')
      
      const newPayment = {
        bookingId: 'test-booking-id',
        amount: 50000,
        paymentMethod: 'card',
        currency: 'LKR'
      }
      
      await createTestData(clientPage, 'payments', newPayment)
    })
    
    test('Users can view payment history', async () => {
      await clientPage.goto(`${BASE_URL}/dashboard/payments`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check payments list
      await expect(clientPage.locator('[data-testid="payments-list"]')).toBeVisible()
      
      // Test payment status filtering
      await clientPage.click('[data-testid="filter-payment-status"]')
      await clientPage.selectOption('[data-testid="payment-status-select"]', 'completed')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can view all payments', async () => {
      await loginAs(adminPage, 'admin')
      
      await adminPage.goto(`${BASE_URL}/admin/payments`)
      await adminPage.waitForLoadState('networkidle')
      
      // Check admin payments view
      await expect(adminPage.locator('[data-testid="admin-payments"]')).toBeVisible()
    })
  })
  
  test.describe('Review Management CRUD', () => {
    test('Users can create reviews', async () => {
      await loginAs(clientPage, 'client')
      
      const newReview = {
        venueId: 'test-venue-id',
        vendorId: 'test-vendor-id',
        rating: 5,
        title: 'Excellent service!',
        comment: 'Great venue and professional service',
        images: ['review1.jpg']
      }
      
      await createTestData(clientPage, 'reviews', newReview)
    })
    
    test('Users can view reviews', async () => {
      await clientPage.goto(`${BASE_URL}/reviews`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check reviews list
      await expect(clientPage.locator('[data-testid="reviews-list"]')).toBeVisible()
      
      // Test rating filtering
      await clientPage.click('[data-testid="filter-rating"]')
      await clientPage.selectOption('[data-testid="rating-select"]', '5')
      await clientPage.waitForLoadState('networkidle')
    })
    
    test('Admin can moderate reviews', async () => {
      await loginAs(adminPage, 'admin')
      
      await adminPage.goto(`${BASE_URL}/admin/reviews`)
      await adminPage.waitForLoadState('networkidle')
      
      // Check admin reviews view
      await expect(adminPage.locator('[data-testid="admin-reviews"]')).toBeVisible()
      
      // Test review moderation
      await adminPage.click('[data-testid="moderate-review"]')
      await adminPage.selectOption('[data-testid="review-status"]', 'approved')
      await adminPage.click('[data-testid="save-review-status"]')
      await adminPage.waitForLoadState('networkidle')
    })
  })
  
  test.describe('AI Search & Features', () => {
    test('Users can use AI search', async () => {
      await loginAs(clientPage, 'client')
      
      await clientPage.goto(`${BASE_URL}/ai-search`)
      await clientPage.waitForLoadState('networkidle')
      
      // Test AI search form
      await clientPage.fill('[data-testid="ai-search-input"]', 'I want a beach wedding in Colombo for 100 guests')
      await clientPage.click('[data-testid="ai-search-button"]')
      await clientPage.waitForLoadState('networkidle')
      
      // Check AI search results
      await expect(clientPage.locator('[data-testid="ai-search-results"]')).toBeVisible()
    })
    
    test('Users can use chat feature', async () => {
      await clientPage.goto(`${BASE_URL}/chat`)
      await clientPage.waitForLoadState('networkidle')
      
      // Test chat functionality
      await clientPage.fill('[data-testid="chat-input"]', 'Hello, I need help with wedding planning')
      await clientPage.click('[data-testid="send-message"]')
      await clientPage.waitForLoadState('networkidle')
      
      // Check chat messages
      await expect(clientPage.locator('[data-testid="chat-messages"]')).toBeVisible()
    })
  })
  
  test.describe('Mobile Responsiveness', () => {
    test('All features work on mobile devices', async () => {
      await clientPage.setViewportSize({ width: 375, height: 667 })
      
      // Test mobile navigation
      await clientPage.goto(`${BASE_URL}/`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check mobile menu
      await clientPage.click('[data-testid="mobile-menu"]')
      await expect(clientPage.locator('[data-testid="mobile-nav"]')).toBeVisible()
      
      // Test mobile forms
      await clientPage.goto(`${BASE_URL}/venues`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check mobile venue cards
      await expect(clientPage.locator('[data-testid="venue-card"]')).toBeVisible()
    })
  })
  
  test.describe('Error Handling & Edge Cases', () => {
    test('Handles invalid data gracefully', async () => {
      await loginAs(clientPage, 'client')
      
      // Test invalid booking data
      await clientPage.goto(`${BASE_URL}/bookings/create`)
      await clientPage.waitForLoadState('networkidle')
      
      // Submit empty form
      await clientPage.click('button[type="submit"]')
      
      // Check validation errors
      await expect(clientPage.locator('[data-testid="validation-error"]')).toBeVisible()
    })
    
    test('Handles network errors gracefully', async () => {
      // Simulate network failure
      await clientPage.route('**/api/**', route => route.abort())
      
      await clientPage.goto(`${BASE_URL}/venues`)
      await clientPage.waitForLoadState('networkidle')
      
      // Check error handling
      await expect(clientPage.locator('[data-testid="error-message"]')).toBeVisible()
    })
  })
  
  test.describe('Performance & Load Testing', () => {
    test('Pages load within acceptable time', async () => {
      const startTime = Date.now()
      
      await clientPage.goto(`${BASE_URL}/venues`)
      await clientPage.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // 3 seconds max
    })
    
    test('Handles large datasets efficiently', async () => {
      await clientPage.goto(`${BASE_URL}/venues`)
      await clientPage.waitForLoadState('networkidle')
      
      // Test pagination with large dataset
      await clientPage.click('[data-testid="next-page"]')
      await clientPage.waitForLoadState('networkidle')
      
      // Check that data loads efficiently
      await expect(clientPage.locator('[data-testid="venue-card"]')).toBeVisible()
    })
  })
})
