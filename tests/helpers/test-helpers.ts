import { Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

export interface TestUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'vendor' | 'admin' | 'wedding_planner';
}

export interface TestVendor {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

export interface TestVenue {
  name: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
}

export interface TestBooking {
  customerName: string;
  customerEmail: string;
  eventDate: string;
  guestCount: number;
  package: string;
  vendorId?: string;
  venueId?: string;
}

// User Management Helpers
export function createTestUser(role: TestUser['role'] = 'user'): TestUser {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'TestPass123!',
    role
  };
}

export function createTestVendor(): TestVendor {
  return {
    name: faker.person.fullName(),
    businessName: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    category: faker.helpers.arrayElement(['photographer', 'catering', 'music', 'decorator']),
    services: [
      {
        name: 'Wedding Photography Basic',
        price: 45000,
        description: '6 hours coverage with 300+ edited photos'
      },
      {
        name: 'Wedding Photography Premium',
        price: 75000,
        description: '8 hours coverage with 500+ edited photos and online gallery'
      }
    ]
  };
}

export function createTestVenue(): TestVenue {
  return {
    name: faker.company.name() + ' Venue',
    description: faker.lorem.paragraph(),
    address: faker.location.streetAddress(),
    city: faker.helpers.arrayElement(['Colombo', 'Kandy', 'Galle', 'Negombo']),
    capacity: faker.number.int({ min: 50, max: 500 }),
    basePrice: faker.number.int({ min: 30000, max: 200000 }),
    amenities: faker.helpers.arrayElements([
      'Parking', 'Air Conditioning', 'Garden', 'Indoor Hall', 
      'Sound System', 'Lighting', 'Kitchen', 'Restrooms'
    ], { min: 3, max: 6 })
  };
}

export function createTestBooking(): TestBooking {
  const futureDate = faker.date.future({ years: 1 });
  return {
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    eventDate: futureDate.toISOString().split('T')[0],
    guestCount: faker.number.int({ min: 50, max: 300 }),
    package: faker.helpers.arrayElement(['Basic', 'Premium', 'Deluxe'])
  };
}

// Playwright Helpers
export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/auth/signin');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await loginAs(
    page, 
    process.env.TEST_ADMIN_EMAIL || 'admin@test.local',
    process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!'
  );
}

export async function loginAsVendor(page: Page): Promise<void> {
  await loginAs(
    page,
    process.env.TEST_VENDOR_EMAIL || 'vendor@test.local',
    process.env.TEST_VENDOR_PASSWORD || 'VendorPass123!'
  );
}

export async function loginAsCustomer(page: Page): Promise<void> {
  await loginAs(
    page,
    process.env.TEST_CUSTOMER_EMAIL || 'customer@test.local',
    process.env.TEST_CUSTOMER_PASSWORD || 'CustomerPass123!'
  );
}

// API Helpers
export async function createTestUserViaAPI(page: Page, user: TestUser): Promise<any> {
  const response = await page.request.post('/api/test/create-user', {
    data: user
  });
  return response.json();
}

export async function createTestVendorViaAPI(page: Page, vendor: TestVendor): Promise<any> {
  const response = await page.request.post('/api/test/create-vendor', {
    data: vendor
  });
  return response.json();
}

export async function createTestVenueViaAPI(page: Page, venue: TestVenue): Promise<any> {
  const response = await page.request.post('/api/test/create-venue', {
    data: venue
  });
  return response.json();
}

export async function createTestBookingViaAPI(page: Page, booking: TestBooking): Promise<any> {
  const response = await page.request.post('/api/test/create-booking', {
    data: booking
  });
  return response.json();
}

// Database Helpers
export async function seedTestData(page: Page): Promise<void> {
  // Create test users
  const admin = createTestUser('admin');
  const vendor = createTestUser('vendor');
  const customer = createTestUser('user');
  
  await createTestUserViaAPI(page, admin);
  await createTestUserViaAPI(page, vendor);
  await createTestUserViaAPI(page, customer);
  
  // Create test vendor
  const testVendor = createTestVendor();
  await createTestVendorViaAPI(page, testVendor);
  
  // Create test venue
  const testVenue = createTestVenue();
  await createTestVenueViaAPI(page, testVenue);
}

export async function cleanupTestData(page: Page): Promise<void> {
  await page.request.post('/api/test/cleanup');
}

// Payment Helpers
export async function mockStripePayment(page: Page, success: boolean = true): Promise<void> {
  if (success) {
    await page.route('**/api/payments/create-intent', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          clientSecret: 'pi_test_secret_123',
          paymentIntentId: 'pi_123456789'
        })
      })
    );
    
    await page.route('**/api/payments/confirm', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'succeeded',
          transactionId: 'tx_123456789'
        })
      })
    );
  } else {
    await page.route('**/api/payments/create-intent', route =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Payment method declined',
          code: 'card_declined'
        })
      })
    );
  }
}

export async function mockPayHerePayment(page: Page, success: boolean = true): Promise<void> {
  if (success) {
    await page.route('**/api/payments/payhere/create', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paymentUrl: 'https://sandbox.payhere.lk/pay/checkout',
          merchantId: 'test_merchant_123',
          orderId: 'order_123456'
        })
      })
    );
  }
}

// File Upload Helpers
export async function uploadTestImage(page: Page, selector: string, filename: string = 'test-image.jpg'): Promise<void> {
  await page.setInputFiles(selector, `tests/fixtures/${filename}`);
}

// Wait Helpers
export async function waitForSuccessMessage(page: Page): Promise<void> {
  await page.waitForSelector('.toast-success, .success-message, [data-testid="success-message"]');
}

export async function waitForErrorMessage(page: Page): Promise<void> {
  await page.waitForSelector('.toast-error, .error-message, [data-testid="error-message"]');
}

// Navigation Helpers
export async function navigateToDashboard(page: Page): Promise<void> {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
}

export async function navigateToVendorDashboard(page: Page): Promise<void> {
  await page.goto('/dashboard/vendor');
  await page.waitForLoadState('networkidle');
}

export async function navigateToAdminDashboard(page: Page): Promise<void> {
  await page.goto('/dashboard/admin');
  await page.waitForLoadState('networkidle');
}
