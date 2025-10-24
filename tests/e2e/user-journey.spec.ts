import { test, expect } from '@playwright/test';

/**
 * 🚀 COMPREHENSIVE USER JOURNEY TESTS
 * 
 * This test suite covers complete user journeys from registration to booking completion,
 * testing the entire application flow for different user types and scenarios.
 */

// Test data for user journeys
const journeyData = {
  couple: {
    name: 'John & Jane Smith',
    email: 'john.jane@test.com',
    password: 'CouplePass123!',
    phone: '+94771234567',
    weddingDate: '2024-12-25',
    guestCount: 150,
    budget: 500000
  },
  photographer: {
    businessName: 'Dream Photography Studio',
    email: 'photographer@test.com',
    password: 'PhotoPass123!',
    phone: '+94771234568',
    services: ['Wedding Photography', 'Engagement Shoots', 'Photo Albums'],
    pricing: {
      'Wedding Photography': 75000,
      'Engagement Shoots': 25000,
      'Photo Albums': 15000
    }
  },
  venue: {
    name: 'Garden Paradise',
    location: 'Colombo, Sri Lanka',
    capacity: 200,
    price: 100000,
    features: ['Outdoor Ceremony', 'Garden Reception', 'Parking']
  }
};

test.describe.skip('DISABLED ', () => {
  test.skip('DISABLED: End-to-End Wedding Planning Journey', async ({ page }) => {
    // Step 1: Registration and Profile Setup
    await page.goto('/register');
    await page.fill('input[name="name"]', journeyData.couple.name);
    await page.fill('input[name="email"]', journeyData.couple.email);
    await page.fill('input[name="password"]', journeyData.couple.password);
    await page.fill('input[name="confirmPassword"]', journeyData.couple.password);
    await page.click('button[type="submit"]');
    
    // Verify registration success
    await expect(page.locator('text=Registration successful')).toBeVisible();
    
    // Step 2: Email Verification (simulated)
    await page.goto('/auth/verify-email');
    await page.fill('input[name="token"]', 'test-verification-token');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email verified successfully')).toBeVisible();
    
    // Step 3: Complete Profile Setup
    await page.goto('/dashboard/profile');
    await page.fill('input[name="phone"]', journeyData.couple.phone);
    await page.fill('input[name="weddingDate"]', journeyData.couple.weddingDate);
    await page.fill('input[name="guestCount"]', journeyData.couple.guestCount.toString());
    await page.fill('input[name="budget"]', journeyData.couple.budget.toString());
    await page.click('button:has-text("Save Profile")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    
    // Step 4: Wedding Planning Dashboard
    await page.goto('/dashboard/planning');
    await expect(page.locator('text=Wedding Planning')).toBeVisible();
    
    // Create wedding timeline
    await page.click('button:has-text("Create Timeline")');
    await page.fill('input[name="timelineName"]', 'Our Dream Wedding');
    await page.click('button:has-text("Save Timeline")');
    await expect(page.locator('text=Timeline created successfully')).toBeVisible();
    
    // Add planning tasks
    await page.click('button:has-text("Add Task")');
    await page.fill('input[name="taskTitle"]', 'Book Venue');
    await page.fill('textarea[name="taskDescription"]', 'Research and book wedding venue');
    await page.selectOption('select[name="priority"]', 'high');
    await page.fill('input[name="dueDate"]', '2024-10-01');
    await page.click('button:has-text("Add Task")');
    await expect(page.locator('text=Task added successfully')).toBeVisible();
    
    // Step 5: Search and Browse Venues
    await page.goto('/venues');
    await expect(page.locator('text=Wedding Venues')).toBeVisible();
    
    // Search for venues
    await page.fill('input[placeholder*="Search venues"]', 'Colombo');
    await page.click('button:has-text("Search")');
    await expect(page.locator('text=Search Results')).toBeVisible();
    
    // Apply filters
    await page.click('button:has-text("Filters")');
    await page.check('input[name="outdoor"]');
    await page.fill('input[name="maxPrice"]', '150000');
    await page.click('button:has-text("Apply Filters")');
    
    // Select a venue
    await page.click('div[data-testid="venue-card"]:first-child');
    await expect(page.locator('text=Venue Details')).toBeVisible();
    
    // Add to favorites
    await page.click('button:has-text("Add to Favorites")');
    await expect(page.locator('text=Added to favorites')).toBeVisible();
    
    // Step 6: Book Venue
    await page.click('button:has-text("Book Now")');
    await expect(page.locator('text=Booking Form')).toBeVisible();
    
    // Fill booking details
    await page.fill('input[name="eventDate"]', journeyData.couple.weddingDate);
    await page.fill('input[name="guestCount"]', journeyData.couple.guestCount.toString());
    await page.fill('textarea[name="specialRequests"]', 'Outdoor ceremony with garden setup');
    await page.click('button:has-text("Continue to Payment")');
    
    // Step 7: Payment Process
    await expect(page.locator('text=Payment Details')).toBeVisible();
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    await page.fill('input[name="cardholderName"]', journeyData.couple.name);
    await page.click('button:has-text("Pay Now")');
    
    // Verify payment success
    await expect(page.locator('text=Payment successful')).toBeVisible();
    await expect(page.locator('text=Booking confirmed')).toBeVisible();
    
    // Step 8: Post-Booking Management
    await page.goto('/dashboard/bookings');
    await expect(page.locator('text=My Bookings')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    
    // View booking details
    await page.click('button:has-text("View Details")');
    await expect(page.locator('text=Booking Details')).toBeVisible();
    
    // Step 9: Vendor Search and Booking
    await page.goto('/vendors');
    await page.fill('input[placeholder*="Search vendors"]', 'photography');
    await page.click('button:has-text("Search")');
    
    // Select photographer
    await page.click('div[data-testid="vendor-card"]:first-child');
    await expect(page.locator('text=Vendor Profile')).toBeVisible();
    
    // Book photographer
    await page.click('button:has-text("Book Service")');
    await page.selectOption('select[name="service"]', 'Wedding Photography');
    await page.fill('input[name="eventDate"]', journeyData.couple.weddingDate);
    await page.fill('textarea[name="specialRequests"]', 'Full day coverage with engagement shoot');
    await page.click('button:has-text("Confirm Booking")');
    
    // Step 10: Communication with Vendors
    await page.goto('/dashboard/messages');
    await expect(page.locator('text=Messages')).toBeVisible();
    
    // Send message to vendor
    await page.click('button:has-text("New Message")');
    await page.fill('input[name="recipient"]', 'photographer@test.com');
    await page.fill('input[name="subject"]', 'Wedding Photography Discussion');
    await page.fill('textarea[name="message"]', 'Hi, I would like to discuss the photography details for our wedding.');
    await page.click('button:has-text("Send Message")');
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
    
    // Step 11: Final Planning Review
    await page.goto('/dashboard/planning');
    await expect(page.locator('text=Wedding Planning')).toBeVisible();
    
    // Mark tasks as completed
    await page.click('button:has-text("Mark Complete")');
    await expect(page.locator('text=Task completed')).toBeVisible();
    
    // View planning progress
    await expect(page.locator('text=Planning Progress')).toBeVisible();
    await expect(page.locator('text=75% Complete')).toBeVisible();
  });
});

test.describe.skip('DISABLED: 📸 Vendor Business Journey', () => {
  test.skip('DISABLED: Complete Vendor Onboarding and Management Journey', async ({ page }) => {
    // Step 1: Vendor Registration
    await page.goto('/vendor/register');
    await page.fill('input[name="businessName"]', journeyData.photographer.businessName);
    await page.fill('input[name="email"]', journeyData.photographer.email);
    await page.fill('input[name="password"]', journeyData.photographer.password);
    await page.fill('input[name="phone"]', journeyData.photographer.phone);
    await page.fill('textarea[name="description"]', 'Professional wedding photography services with 10+ years experience');
    await page.click('button[type="submit"]');
    
    // Verify registration
    await expect(page.locator('text=Vendor registration submitted')).toBeVisible();
    
    // Step 2: Vendor Login
    await page.goto('/login');
    await page.fill('input[name="email"]', journeyData.photographer.email);
    await page.fill('input[name="password"]', journeyData.photographer.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Step 3: Vendor Dashboard Setup
    await page.goto('/dashboard/vendor');
    await expect(page.locator('text=Vendor Dashboard')).toBeVisible();
    
    // Complete vendor profile
    await page.click('button:has-text("Complete Profile")');
    await page.fill('input[name="website"]', 'https://dreamphotography.com');
    await page.fill('input[name="experience"]', '10');
    await page.fill('textarea[name="specialties"]', 'Wedding Photography, Engagement Shoots, Photo Albums');
    await page.click('button:has-text("Save Profile")');
    await expect(page.locator('text=Profile completed successfully')).toBeVisible();
    
    // Step 4: Add Services
    await page.goto('/dashboard/vendor/services');
    await expect(page.locator('text=My Services')).toBeVisible();
    
    // Add photography services
    for (const [serviceName, price] of Object.entries(journeyData.photographer.pricing)) {
      await page.click('button:has-text("Add Service")');
      await page.fill('input[name="serviceName"]', serviceName);
      await page.fill('textarea[name="description"]', `Professional ${serviceName.toLowerCase()} service`);
      await page.fill('input[name="price"]', price.toString());
      await page.selectOption('select[name="category"]', 'photography');
      await page.click('button:has-text("Save Service")');
      await expect(page.locator(`text=${serviceName}`)).toBeVisible();
    }
    
    // Step 5: Portfolio Management
    await page.goto('/dashboard/vendor/portfolio');
    await expect(page.locator('text=Portfolio Management')).toBeVisible();
    
    // Upload portfolio images
    await page.click('button:has-text("Upload Images")');
    await page.setInputFiles('input[type="file"]', 'test-files/portfolio1.jpg');
    await page.fill('input[name="imageTitle"]', 'Wedding Ceremony');
    await page.fill('textarea[name="imageDescription"]', 'Beautiful outdoor wedding ceremony');
    await page.click('button:has-text("Upload")');
    await expect(page.locator('text=Image uploaded successfully')).toBeVisible();
    
    // Step 6: Availability Management
    await page.goto('/dashboard/vendor/availability');
    await expect(page.locator('text=Availability Management')).toBeVisible();
    
    // Set availability
    await page.click('button:has-text("Set Availability")');
    await page.fill('input[name="date"]', '2024-12-25');
    await page.selectOption('select[name="status"]', 'available');
    await page.fill('input[name="startTime"]', '08:00');
    await page.fill('input[name="endTime"]', '20:00');
    await page.click('button:has-text("Save Availability")');
    await expect(page.locator('text=Availability updated successfully')).toBeVisible();
    
    // Step 7: Booking Management
    await page.goto('/dashboard/vendor/bookings');
    await expect(page.locator('text=Booking Requests')).toBeVisible();
    
    // Simulate receiving a booking request
    await expect(page.locator('text=New Booking Request')).toBeVisible();
    await page.click('button:has-text("View Details")');
    await expect(page.locator('text=Booking Details')).toBeVisible();
    
    // Accept booking
    await page.click('button:has-text("Accept")');
    await expect(page.locator('text=Booking accepted')).toBeVisible();
    
    // Step 8: Analytics and Performance
    await page.goto('/dashboard/vendor/analytics');
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Booking Statistics')).toBeVisible();
    await expect(page.locator('text=Customer Reviews')).toBeVisible();
    
    // View performance metrics
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Completed Bookings')).toBeVisible();
    await expect(page.locator('text=Average Rating')).toBeVisible();
    
    // Step 9: Customer Communication
    await page.goto('/dashboard/vendor/messages');
    await expect(page.locator('text=Messages')).toBeVisible();
    
    // Reply to customer message
    await page.click('div[data-testid="message-thread"]:first-child');
    await page.fill('textarea[name="reply"]', 'Thank you for choosing our services! We are excited to capture your special day.');
    await page.click('button:has-text("Send Reply")');
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
    
    // Step 10: Boost Campaign Management
    await page.goto('/dashboard/vendor/boost-campaigns');
    await expect(page.locator('text=Boost Campaigns')).toBeVisible();
    
    // Create boost campaign
    await page.click('button:has-text("Create Campaign")');
    await page.fill('input[name="campaignName"]', 'Holiday Season Promotion');
    await page.fill('textarea[name="description"]', 'Special discount for December weddings');
    await page.fill('input[name="budget"]', '50000');
    await page.selectOption('select[name="duration"]', '30');
    await page.click('button:has-text("Create Campaign")');
    await expect(page.locator('text=Campaign created successfully')).toBeVisible();
  });
});

test.describe.skip('DISABLED: 👰 Wedding Planner Professional Journey', () => {
  test.skip('DISABLED: Complete Wedding Planner Workflow', async ({ page }) => {
    // Step 1: Planner Registration and Setup
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Emma Wedding Planner');
    await page.fill('input[name="email"]', 'planner@test.com');
    await page.fill('input[name="password"]', 'PlannerPass123!');
    await page.fill('input[name="confirmPassword"]', 'PlannerPass123!');
    await page.selectOption('select[name="role"]', 'wedding_planner');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Registration successful')).toBeVisible();
    
    // Step 2: Planner Dashboard
    await page.goto('/login');
    await page.fill('input[name="email"]', 'planner@test.com');
    await page.fill('input[name="password"]', 'PlannerPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Step 3: Client Management
    await page.goto('/dashboard/planner/clients');
    await expect(page.locator('text=Client Management')).toBeVisible();
    
    // Add new client
    await page.click('button:has-text("Add Client")');
    await page.fill('input[name="clientName"]', journeyData.couple.name);
    await page.fill('input[name="clientEmail"]', journeyData.couple.email);
    await page.fill('input[name="clientPhone"]', journeyData.couple.phone);
    await page.fill('input[name="weddingDate"]', journeyData.couple.weddingDate);
    await page.fill('input[name="guestCount"]', journeyData.couple.guestCount.toString());
    await page.fill('input[name="budget"]', journeyData.couple.budget.toString());
    await page.click('button:has-text("Save Client")');
    await expect(page.locator('text=Client added successfully')).toBeVisible();
    
    // Step 4: Task Management
    await page.goto('/dashboard/planner/tasks');
    await expect(page.locator('text=Task Management')).toBeVisible();
    
    // Create planning tasks
    const tasks = [
      { title: 'Book Venue', priority: 'high', dueDate: '2024-10-01' },
      { title: 'Book Photographer', priority: 'high', dueDate: '2024-10-15' },
      { title: 'Book Caterer', priority: 'medium', dueDate: '2024-11-01' },
      { title: 'Order Flowers', priority: 'medium', dueDate: '2024-11-15' }
    ];
    
    for (const task of tasks) {
      await page.click('button:has-text("Add Task")');
      await page.fill('input[name="taskTitle"]', task.title);
      await page.fill('textarea[name="taskDescription"]', `Plan and execute ${task.title.toLowerCase()}`);
      await page.selectOption('select[name="priority"]', task.priority);
      await page.fill('input[name="dueDate"]', task.dueDate);
      await page.selectOption('select[name="clientId"]', journeyData.couple.name);
      await page.click('button:has-text("Create Task")');
      await expect(page.locator(`text=${task.title}`)).toBeVisible();
    }
    
    // Step 5: Timeline Management
    await page.goto('/dashboard/planner/timeline');
    await expect(page.locator('text=Wedding Timeline')).toBeVisible();
    
    // Create wedding timeline
    await page.click('button:has-text("Create Timeline")');
    await page.fill('input[name="timelineName"]', `${journeyData.couple.name} Wedding Timeline`);
    await page.click('button:has-text("Save Timeline")');
    await expect(page.locator('text=Timeline created successfully')).toBeVisible();
    
    // Add timeline events
    const timelineEvents = [
      { time: '08:00', event: 'Bride Preparation', location: 'Bride\'s Home' },
      { time: '10:00', event: 'Groom Preparation', location: 'Groom\'s Home' },
      { time: '14:00', event: 'Ceremony', location: 'Garden Paradise' },
      { time: '15:30', event: 'Cocktail Hour', location: 'Garden Paradise' },
      { time: '17:00', event: 'Reception', location: 'Garden Paradise' }
    ];
    
    for (const event of timelineEvents) {
      await page.click('button:has-text("Add Event")');
      await page.fill('input[name="eventTime"]', event.time);
      await page.fill('input[name="eventName"]', event.event);
      await page.fill('input[name="eventLocation"]', event.location);
      await page.click('button:has-text("Save Event")');
      await expect(page.locator(`text=${event.event}`)).toBeVisible();
    }
    
    // Step 6: Vendor Coordination
    await page.goto('/vendors');
    await page.fill('input[placeholder*="Search vendors"]', 'photography');
    await page.click('button:has-text("Search")');
    
    // Select and contact vendors
    await page.click('div[data-testid="vendor-card"]:first-child');
    await page.click('button:has-text("Contact Vendor")');
    await page.fill('textarea[name="message"]', `Hello, I am coordinating a wedding for ${journeyData.couple.name} on ${journeyData.couple.weddingDate}. Would you be available?`);
    await page.click('button:has-text("Send Message")');
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
    
    // Step 7: Progress Tracking
    await page.goto('/dashboard/planner/tasks');
    
    // Mark tasks as completed
    await page.click('button:has-text("Mark Complete"):first-child');
    await expect(page.locator('text=Task completed successfully')).toBeVisible();
    
    // View progress overview
    await expect(page.locator('text=Progress Overview')).toBeVisible();
    await expect(page.locator('text=25% Complete')).toBeVisible();
    
    // Step 8: Client Communication
    await page.goto('/dashboard/planner/messages');
    await expect(page.locator('text=Client Messages')).toBeVisible();
    
    // Send update to client
    await page.click('button:has-text("New Message")');
    await page.selectOption('select[name="recipient"]', journeyData.couple.name);
    await page.fill('input[name="subject"]', 'Wedding Planning Update');
    await page.fill('textarea[name="message"]', 'Hi! I wanted to update you on our progress. We have successfully booked the venue and photographer. Next steps include booking the caterer and florist.');
    await page.click('button:has-text("Send Message")');
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
    
    // Step 9: Final Coordination
    await page.goto('/dashboard/planner/timeline');
    
    // Review final timeline
    await expect(page.locator('text=Final Wedding Timeline')).toBeVisible();
    await expect(page.locator('text=All events scheduled')).toBeVisible();
    
    // Export timeline
    await page.click('button:has-text("Export Timeline")');
    await expect(page.locator('text=Timeline exported successfully')).toBeVisible();
  });
});

test.describe.skip('DISABLED: 👑 Admin Platform Management Journey', () => {
  test.skip('DISABLED: Complete Admin Platform Management', async ({ page }) => {
    // Step 1: Admin Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@test.com');
    await page.fill('input[name="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Step 2: Admin Dashboard Overview
    await page.goto('/dashboard/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Platform Statistics')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    
    // Step 3: User Management
    await page.goto('/dashboard/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible();
    
    // View all users
    await expect(page.locator('text=All Users')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=New Registrations')).toBeVisible();
    
    // Update user role
    await page.click('button:has-text("Edit Role"):first-child');
    await page.selectOption('select[name="role"]', 'vendor');
    await page.click('button:has-text("Update Role")');
    await expect(page.locator('text=User role updated successfully')).toBeVisible();
    
    // Step 4: Vendor Management
    await page.goto('/dashboard/admin/vendors');
    await expect(page.locator('text=Vendor Management')).toBeVisible();
    
    // Approve vendor
    await page.click('button:has-text("Approve"):first-child');
    await expect(page.locator('text=Vendor approved successfully')).toBeVisible();
    
    // View vendor details
    await page.click('button:has-text("View Details"):first-child');
    await expect(page.locator('text=Vendor Details')).toBeVisible();
    
    // Step 5: Analytics and Reports
    await page.goto('/dashboard/admin/reports');
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
    
    // Generate monthly report
    await page.click('button:has-text("Generate Report")');
    await page.selectOption('select[name="reportType"]', 'monthly');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await page.click('button:has-text("Generate")');
    await expect(page.locator('text=Report generated successfully')).toBeVisible();
    
    // View analytics dashboard
    await expect(page.locator('text=User Growth')).toBeVisible();
    await expect(page.locator('text=Revenue Analytics')).toBeVisible();
    await expect(page.locator('text=Booking Trends')).toBeVisible();
    
    // Step 6: System Settings
    await page.goto('/dashboard/admin/settings');
    await expect(page.locator('text=System Settings')).toBeVisible();
    
    // Update platform settings
    await page.fill('input[name="siteName"]', 'WeddingLK Pro');
    await page.fill('input[name="supportEmail"]', 'support@weddinglk.com');
    await page.fill('input[name="maxFileSize"]', '10');
    await page.click('button:has-text("Save Settings")');
    await expect(page.locator('text=Settings updated successfully')).toBeVisible();
    
    // Step 7: Content Management
    await page.goto('/dashboard/admin/content');
    await expect(page.locator('text=Content Management')).toBeVisible();
    
    // Manage featured vendors
    await page.click('button:has-text("Manage Featured")');
    await page.check('input[name="featured-vendor-1"]');
    await page.check('input[name="featured-vendor-2"]');
    await page.click('button:has-text("Update Featured")');
    await expect(page.locator('text=Featured vendors updated')).toBeVisible();
    
    // Step 8: Security and Monitoring
    await page.goto('/dashboard/admin/security');
    await expect(page.locator('text=Security Dashboard')).toBeVisible();
    
    // View security logs
    await expect(page.locator('text=Login Attempts')).toBeVisible();
    await expect(page.locator('text=Failed Logins')).toBeVisible();
    await expect(page.locator('text=Suspicious Activity')).toBeVisible();
    
    // Step 9: Performance Monitoring
    await page.goto('/dashboard/admin/performance');
    await expect(page.locator('text=Performance Monitoring')).toBeVisible();
    
    // View system metrics
    await expect(page.locator('text=Server Performance')).toBeVisible();
    await expect(page.locator('text=Database Performance')).toBeVisible();
    await expect(page.locator('text=API Response Times')).toBeVisible();
    
    // Step 10: Backup and Maintenance
    await page.goto('/dashboard/admin/maintenance');
    await expect(page.locator('text=System Maintenance')).toBeVisible();
    
    // Create system backup
    await page.click('button:has-text("Create Backup")');
    await expect(page.locator('text=Backup created successfully')).toBeVisible();
    
    // Clear system cache
    await page.click('button:has-text("Clear Cache")');
    await expect(page.locator('text=Cache cleared successfully')).toBeVisible();
  });
});

test.describe.skip('DISABLED: 🔄 Cross-Platform Integration Journey', () => {
  test.skip('DISABLED: Mobile and Web Integration', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile login
    await page.goto('/login');
    await page.fill('input[name="email"]', journeyData.couple.email);
    await page.fill('input[name="password"]', journeyData.couple.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Mobile navigation
    await page.click('button[data-testid="mobile-menu"]');
    await expect(page.locator('nav[data-testid="mobile-nav"]')).toBeVisible();
    
    // Mobile booking
    await page.goto('/venues');
    await page.click('div[data-testid="venue-card"]:first-child');
    await page.click('button:has-text("Book Now")');
    
    // Mobile form interaction
    await page.fill('input[name="eventDate"]', journeyData.couple.weddingDate);
    await page.fill('input[name="guestCount"]', journeyData.couple.guestCount.toString());
    await page.click('button:has-text("Continue")');
    
    // Switch to desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    // Continue on desktop
    await expect(page.locator('text=Payment Details')).toBeVisible();
    await page.fill('input[name="cardNumber"]', '4242424242424242');
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    await page.click('button:has-text("Pay Now")');
    
    // Verify cross-platform consistency
    await expect(page.locator('text=Payment successful')).toBeVisible();
  });
});

test.describe.skip('DISABLED: 🚨 Error Handling and Recovery Journey', () => {
  test.skip('DISABLED: Application Error Recovery', async ({ page }) => {
    // Test network error handling
    await page.route('**/api/venues', route => route.abort());
    
    await page.goto('/venues');
    await expect(page.locator('text=Unable to load venues')).toBeVisible();
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
    
    // Test retry functionality
    await page.unroute('**/api/venues');
    await page.click('button:has-text("Retry")');
    await expect(page.locator('text=Wedding Venues')).toBeVisible();
    
    // Test form validation errors
    await page.goto('/register');
    await page.fill('input[name="name"]', '');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    await expect(page.locator('text=Password too short')).toBeVisible();
    
    // Test payment error handling
    await page.goto('/checkout');
    await page.fill('input[name="cardNumber"]', '4000000000000002'); // Declined card
    await page.fill('input[name="expiryDate"]', '12/25');
    await page.fill('input[name="cvv"]', '123');
    await page.click('button:has-text("Pay Now")');
    
    await expect(page.locator('text=Payment failed')).toBeVisible();
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });
});
