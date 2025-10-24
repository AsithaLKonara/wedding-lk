import { test, expect } from '@playwright/test';

/**
 * 🧪 COMPREHENSIVE CRUD & USER FLOW TESTS
 * 
 * This test suite covers ALL CRUD operations, user flows, and RBAC functionality
 * for the WeddingLK application. Tests are organized by user role and functionality.
 */

// Test data
const testUsers = {
  regularUser: {
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: 'TestPass123!',
    role: 'user'
  },
  vendor: {
    name: 'Sarah Photography',
    email: 'sarah@photography.com',
    password: 'VendorPass123!',
    role: 'vendor'
  },
  weddingPlanner: {
    name: 'Emma Planner',
    email: 'emma@planner.com',
    password: 'PlannerPass123!',
    role: 'wedding_planner'
  },
  admin: {
    name: 'Admin User',
    email: 'admin@weddinglk.com',
    password: 'AdminPass123!',
    role: 'admin'
  }
};

const testVenue = {
  name: 'Test Wedding Venue',
  location: 'Colombo, Sri Lanka',
  capacity: 200,
  price: 50000
};

const testBooking = {
  eventDate: '2024-12-25',
  guestCount: 100,
  specialRequests: 'Outdoor ceremony with garden setup'
};

test.describe('🔐 Authentication & User Management CRUD', () => {
  test.skip('DISABLED: User Registration Flow', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="name"]', testUsers.regularUser.name);
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.fill('input[name="confirmPassword"]', testUsers.regularUser.password);
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Verify success message or redirect
    await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 10000 });
  });

  test('User Login Flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    
    // Submit login
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('User Profile CRUD Operations', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to profile
    await page.goto('/dashboard/profile');
    
    // READ: View profile information
    await expect(page.locator('text=Profile Information')).toBeVisible();
    
    // UPDATE: Edit profile
    await page.click('button:has-text("Edit Profile")');
    await page.fill('input[name="phone"]', '+94771234567');
    await page.fill('textarea[name="bio"]', 'Planning my dream wedding!');
    await page.click('button:has-text("Save Changes")');
    
    // Verify update
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('User Settings CRUD Operations', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to settings
    await page.goto('/dashboard/settings');
    
    // READ: View settings
    await expect(page.locator('text=Account Settings')).toBeVisible();
    
    // UPDATE: Change notification preferences
    await page.check('input[name="emailNotifications"]');
    await page.check('input[name="smsNotifications"]');
    await page.click('button:has-text("Save Settings")');
    
    // Verify update
    await expect(page.locator('text=Settings updated successfully')).toBeVisible();
  });
});

test.describe('🏢 Vendor Management CRUD', () => {
  test.skip('DISABLED: Vendor Registration Flow', async ({ page }) => {
    await page.goto('/vendor/register');
    
    // Fill vendor registration form
    await page.fill('input[name="businessName"]', testUsers.vendor.name);
    await page.fill('input[name="email"]', testUsers.vendor.email);
    await page.fill('input[name="password"]', testUsers.vendor.password);
    await page.fill('input[name="phone"]', '+94771234567');
    await page.fill('textarea[name="description"]', 'Professional wedding photography services');
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('text=Vendor registration submitted')).toBeVisible();
  });

  test('Vendor Services CRUD Operations', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.vendor.email);
    await page.fill('input[name="password"]', testUsers.vendor.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to services
    await page.goto('/dashboard/vendor/services');
    
    // CREATE: Add new service
    await page.click('button:has-text("Add Service")');
    await page.fill('input[name="serviceName"]', 'Wedding Photography');
    await page.fill('textarea[name="description"]', 'Full day wedding photography');
    await page.fill('input[name="price"]', '50000');
    await page.click('button:has-text("Save Service")');
    
    // READ: Verify service was created
    await expect(page.locator('text=Wedding Photography')).toBeVisible();
    
    // UPDATE: Edit service
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="price"]', '55000');
    await page.click('button:has-text("Update Service")');
    
    // DELETE: Remove service
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm Delete")');
    
    // Verify deletion
    await expect(page.locator('text=Wedding Photography')).not.toBeVisible();
  });

  test('Vendor Analytics & Reports', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.vendor.email);
    await page.fill('input[name="password"]', testUsers.vendor.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to analytics
    await page.goto('/dashboard/vendor/analytics');
    
    // READ: View analytics data
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Booking Statistics')).toBeVisible();
    await expect(page.locator('text=Customer Reviews')).toBeVisible();
  });
});

test.describe('📅 Booking System CRUD', () => {
  test('Create Booking Flow', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to venues
    await page.goto('/venues');
    
    // Select a venue
    await page.click('div[data-testid="venue-card"]:first-child');
    await page.click('button:has-text("Book Now")');
    
    // Fill booking form
    await page.fill('input[name="eventDate"]', testBooking.eventDate);
    await page.fill('input[name="guestCount"]', testBooking.guestCount.toString());
    await page.fill('textarea[name="specialRequests"]', testBooking.specialRequests);
    
    // Submit booking
    await page.click('button:has-text("Confirm Booking")');
    
    // Verify booking creation
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
  });

  test('Booking Management CRUD', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to bookings
    await page.goto('/dashboard/bookings');
    
    // READ: View bookings list
    await expect(page.locator('text=My Bookings')).toBeVisible();
    
    // UPDATE: Modify booking
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="guestCount"]', '120');
    await page.click('button:has-text("Update Booking")');
    
    // Verify update
    await expect(page.locator('text=Booking updated successfully')).toBeVisible();
    
    // CANCEL: Cancel booking
    await page.click('button:has-text("Cancel")');
    await page.click('button:has-text("Confirm Cancellation")');
    
    // Verify cancellation
    await expect(page.locator('text=Booking cancelled')).toBeVisible();
  });

  test('Booking Status Tracking', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.vendor.email);
    await page.fill('input[name="password"]', testUsers.vendor.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to vendor bookings
    await page.goto('/dashboard/vendor/bookings');
    
    // READ: View booking requests
    await expect(page.locator('text=Booking Requests')).toBeVisible();
    
    // UPDATE: Change booking status
    await page.click('button:has-text("Accept")');
    await expect(page.locator('text=Booking accepted')).toBeVisible();
    
    // UPDATE: Mark as completed
    await page.click('button:has-text("Mark Complete")');
    await expect(page.locator('text=Booking completed')).toBeVisible();
  });
});

test.describe('👥 Wedding Planner CRUD Operations', () => {
  test('Planner Client Management', async ({ page }) => {
    // Login as wedding planner
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.weddingPlanner.email);
    await page.fill('input[name="password"]', testUsers.weddingPlanner.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to clients
    await page.goto('/dashboard/planner/clients');
    
    // CREATE: Add new client
    await page.click('button:has-text("Add Client")');
    await page.fill('input[name="clientName"]', 'Jane & John Smith');
    await page.fill('input[name="clientEmail"]', 'jane.smith@email.com');
    await page.fill('input[name="weddingDate"]', '2024-12-25');
    await page.click('button:has-text("Save Client")');
    
    // READ: Verify client was added
    await expect(page.locator('text=Jane & John Smith')).toBeVisible();
    
    // UPDATE: Edit client information
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="clientPhone"]', '+94771234567');
    await page.click('button:has-text("Update Client")');
    
    // Verify update
    await expect(page.locator('text=Client updated successfully')).toBeVisible();
  });

  test('Planner Task Management', async ({ page }) => {
    // Login as wedding planner
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.weddingPlanner.email);
    await page.fill('input[name="password"]', testUsers.weddingPlanner.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to tasks
    await page.goto('/dashboard/planner/tasks');
    
    // CREATE: Add new task
    await page.click('button:has-text("Add Task")');
    await page.fill('input[name="taskTitle"]', 'Book photographer');
    await page.fill('textarea[name="taskDescription"]', 'Research and book wedding photographer');
    await page.selectOption('select[name="priority"]', 'high');
    await page.fill('input[name="dueDate"]', '2024-11-01');
    await page.click('button:has-text("Create Task")');
    
    // READ: Verify task was created
    await expect(page.locator('text=Book photographer')).toBeVisible();
    
    // UPDATE: Mark task as completed
    await page.click('button:has-text("Mark Complete")');
    await expect(page.locator('text=Task completed')).toBeVisible();
  });
});

test.describe('🛡️ RBAC (Role-Based Access Control) Tests', () => {
  test('User Role Access Control', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Test user can access their allowed pages
    await page.goto('/dashboard/planning');
    await expect(page.locator('text=Wedding Planning')).toBeVisible();
    
    await page.goto('/dashboard/favorites');
    await expect(page.locator('text=My Favorites')).toBeVisible();
    
    // Test user cannot access admin pages
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test user cannot access vendor pages
    await page.goto('/dashboard/vendor/services');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });

  test('Vendor Role Access Control', async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.vendor.email);
    await page.fill('input[name="password"]', testUsers.vendor.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Test vendor can access their allowed pages
    await page.goto('/dashboard/vendor/services');
    await expect(page.locator('text=My Services')).toBeVisible();
    
    await page.goto('/dashboard/vendor/analytics');
    await expect(page.locator('text=Analytics')).toBeVisible();
    
    // Test vendor cannot access admin pages
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Access Denied')).toBeVisible();
    
    // Test vendor cannot access planner pages
    await page.goto('/dashboard/planner/clients');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });

  test('Admin Role Access Control', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.admin.email);
    await page.fill('input[name="password"]', testUsers.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Test admin can access all pages
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    await page.goto('/dashboard/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible();
    
    await page.goto('/dashboard/admin/vendors');
    await expect(page.locator('text=Vendor Management')).toBeVisible();
    
    await page.goto('/dashboard/admin/reports');
    await expect(page.locator('text=Reports & Analytics')).toBeVisible();
  });

  test('Middleware Route Protection', async ({ page }) => {
    // Test unauthenticated access to protected routes
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/auth\/signin/);
    
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});

test.describe('💳 Payment & Financial CRUD', () => {
  test('Payment Processing Flow', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to checkout
    await page.goto('/checkout');
    
    // Fill payment form
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    await page.fill('input[name="cardholderName"]', 'John Doe');
    
    // Submit payment
    await page.click('button:has-text("Pay Now")');
    
    // Verify payment success
    await expect(page.locator('text=Payment successful')).toBeVisible();
  });

  test('Payment History & Management', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to payments
    await page.goto('/dashboard/payments');
    
    // READ: View payment history
    await expect(page.locator('text=Payment History')).toBeVisible();
    
    // READ: View payment details
    await page.click('button:has-text("View Details")');
    await expect(page.locator('text=Payment Details')).toBeVisible();
  });
});

test.describe('📱 Mobile & Responsive CRUD', () => {
  test('Mobile Navigation & CRUD Operations', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Test mobile navigation
    await page.click('button[data-testid="mobile-menu"]');
    await expect(page.locator('nav[data-testid="mobile-nav"]')).toBeVisible();
    
    // Test mobile CRUD operations
    await page.goto('/dashboard/profile');
    await expect(page.locator('text=Profile Information')).toBeVisible();
    
    // Test mobile form interactions
    await page.click('button:has-text("Edit Profile")');
    await page.fill('input[name="phone"]', '+94771234567');
    await page.click('button:has-text("Save Changes")');
    
    // Verify mobile update
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });
});

test.describe('🔍 Search & Filter CRUD', () => {
  test('Venue Search & Filter Operations', async ({ page }) => {
    await page.goto('/venues');
    
    // Search for venues
    await page.fill('input[placeholder*="Search venues"]', 'Colombo');
    await page.click('button:has-text("Search")');
    
    // Apply filters
    await page.click('button:has-text("Filters")');
    await page.check('input[name="outdoor"]');
    await page.fill('input[name="maxPrice"]', '100000');
    await page.click('button:has-text("Apply Filters")');
    
    // Verify filtered results
    await expect(page.locator('text=Filtered Results')).toBeVisible();
  });

  test('Vendor Search & Filter Operations', async ({ page }) => {
    await page.goto('/vendors');
    
    // Search for vendors
    await page.fill('input[placeholder*="Search vendors"]', 'photography');
    await page.click('button:has-text("Search")');
    
    // Apply category filters
    await page.click('button:has-text("Photography")');
    await page.click('button:has-text("Videography")');
    
    // Verify filtered results
    await expect(page.locator('text=Photography Services')).toBeVisible();
  });
});

test.describe('📊 Analytics & Reporting CRUD', () => {
  test('User Analytics Dashboard', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to analytics
    await page.goto('/dashboard/analytics');
    
    // READ: View user analytics
    await expect(page.locator('text=My Analytics')).toBeVisible();
    await expect(page.locator('text=Booking History')).toBeVisible();
    await expect(page.locator('text=Spending Overview')).toBeVisible();
  });

  test('Admin Analytics & Reports', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.admin.email);
    await page.fill('input[name="password"]', testUsers.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to admin analytics
    await page.goto('/dashboard/admin/reports');
    
    // READ: View admin reports
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
    await expect(page.locator('text=User Statistics')).toBeVisible();
    await expect(page.locator('text=Revenue Reports')).toBeVisible();
    
    // Generate custom report
    await page.click('button:has-text("Generate Report")');
    await page.selectOption('select[name="reportType"]', 'monthly');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await page.click('button:has-text("Generate")');
    
    // Verify report generation
    await expect(page.locator('text=Report generated successfully')).toBeVisible();
  });
});

test.describe('🔔 Notification & Communication CRUD', () => {
  test('Notification Management', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to notifications
    await page.goto('/dashboard/notifications');
    
    // READ: View notifications
    await expect(page.locator('text=Notifications')).toBeVisible();
    
    // UPDATE: Mark notification as read
    await page.click('button:has-text("Mark as Read")');
    await expect(page.locator('text=Notification marked as read')).toBeVisible();
    
    // DELETE: Delete notification
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Notification deleted')).toBeVisible();
  });

  test('Message System CRUD', async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.regularUser.email);
    await page.fill('input[name="password"]', testUsers.regularUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to messages
    await page.goto('/dashboard/messages');
    
    // CREATE: Send new message
    await page.click('button:has-text("New Message")');
    await page.fill('input[name="recipient"]', 'vendor@example.com');
    await page.fill('input[name="subject"]', 'Wedding Photography Inquiry');
    await page.fill('textarea[name="message"]', 'Hi, I would like to inquire about your photography services.');
    await page.click('button:has-text("Send Message")');
    
    // READ: View sent messages
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
    
    // READ: View received messages
    await page.click('button:has-text("Inbox")');
    await expect(page.locator('text=Inbox')).toBeVisible();
  });
});

test.describe('🔄 Data Synchronization & Cache CRUD', () => {
  test('Data Cache Management', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.admin.email);
    await page.fill('input[name="password"]', testUsers.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to cache management
    await page.goto('/dashboard/cache-demo');
    
    // READ: View cache status
    await expect(page.locator('text=Cache Status')).toBeVisible();
    
    // UPDATE: Clear cache
    await page.click('button:has-text("Clear Cache")');
    await expect(page.locator('text=Cache cleared successfully')).toBeVisible();
    
    // UPDATE: Refresh cache
    await page.click('button:has-text("Refresh Cache")');
    await expect(page.locator('text=Cache refreshed successfully')).toBeVisible();
  });
});

test.describe('🛠️ System Administration CRUD', () => {
  test('User Management Operations', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.admin.email);
    await page.fill('input[name="password"]', testUsers.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to user management
    await page.goto('/dashboard/admin/users');
    
    // READ: View users list
    await expect(page.locator('text=User Management')).toBeVisible();
    
    // UPDATE: Edit user role
    await page.click('button:has-text("Edit Role")');
    await page.selectOption('select[name="role"]', 'vendor');
    await page.click('button:has-text("Update Role")');
    
    // Verify role update
    await expect(page.locator('text=User role updated successfully')).toBeVisible();
    
    // DELETE: Deactivate user
    await page.click('button:has-text("Deactivate")');
    await page.click('button:has-text("Confirm Deactivation")');
    await expect(page.locator('text=User deactivated successfully')).toBeVisible();
  });

  test('System Settings Management', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', testUsers.admin.email);
    await page.fill('input[name="password"]', testUsers.admin.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to system settings
    await page.goto('/dashboard/admin/settings');
    
    // READ: View system settings
    await expect(page.locator('text=System Settings')).toBeVisible();
    
    // UPDATE: Modify system settings
    await page.fill('input[name="siteName"]', 'WeddingLK Pro');
    await page.fill('input[name="supportEmail"]', 'support@weddinglk.com');
    await page.click('button:has-text("Save Settings")');
    
    // Verify settings update
    await expect(page.locator('text=Settings updated successfully')).toBeVisible();
  });
});
