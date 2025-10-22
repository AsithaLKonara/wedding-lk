// Jest setup file for WeddingLK tests

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.MONGODB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/weddinglk_test';

// Mock external services
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: { id: 'test-user-id', email: 'test@example.com' },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }))
}));

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_secret_123'
      }),
      confirm: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded'
      })
    },
    refunds: {
      create: jest.fn().mockResolvedValue({
        id: 'rf_test_123',
        status: 'succeeded'
      })
    }
  }));
});

// Mock MongoDB
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    close: jest.fn().mockResolvedValue({}),
    dropDatabase: jest.fn().mockResolvedValue({})
  },
  Schema: jest.fn(),
  model: jest.fn()
}));

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test-image-id',
        secure_url: 'https://res.cloudinary.com/test/image/upload/test-image-id.jpg'
      }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

// Global test utilities
global.testHelpers = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }),
  
  createMockVendor: (overrides = {}) => ({
    id: 'test-vendor-id',
    name: 'Test Vendor',
    businessName: 'Test Business',
    email: 'vendor@example.com',
    category: 'photographer',
    ...overrides
  }),
  
  createMockVenue: (overrides = {}) => ({
    id: 'test-venue-id',
    name: 'Test Venue',
    description: 'Test venue description',
    capacity: 100,
    basePrice: 50000,
    ...overrides
  }),
  
  createMockBooking: (overrides = {}) => ({
    id: 'test-booking-id',
    customerName: 'Test Customer',
    customerEmail: 'customer@example.com',
    eventDate: '2024-12-25',
    guestCount: 100,
    status: 'pending',
    ...overrides
  })
};

// Setup and teardown
beforeAll(async () => {
  // Setup test database
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup test database
  console.log('Cleaning up test environment...');
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Increase timeout for integration tests
jest.setTimeout(30000);