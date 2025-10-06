import { test, expect } from '@playwright/test';

test.describe('Database Integration', () => {
  test('should connect to database', async ({ request }) => {
    const response = await request.get('/api/test/database');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('message');
  });

  test('should handle venue CRUD operations', async ({ request }) => {
    // Test GET venues
    const getResponse = await request.get('/api/venues');
    expect(getResponse.status()).toBe(200);
    
    const venues = await getResponse.json();
    expect(Array.isArray(venues)).toBe(true);
  });

  test('should handle vendor CRUD operations', async ({ request }) => {
    // Test GET vendors
    const getResponse = await request.get('/api/vendors');
    expect(getResponse.status()).toBe(200);
    
    const vendors = await getResponse.json();
    expect(Array.isArray(vendors)).toBe(true);
  });

  test('should handle package CRUD operations', async ({ request }) => {
    // Test GET packages
    const getResponse = await request.get('/api/packages');
    expect(getResponse.status()).toBe(200);
    
    const packages = await getResponse.json();
    expect(Array.isArray(packages)).toBe(true);
  });

  test('should handle booking operations', async ({ request }) => {
    // Test GET bookings
    const getResponse = await request.get('/api/bookings');
    expect(getResponse.status()).toBe(200);
    
    const bookings = await getResponse.json();
    expect(Array.isArray(bookings)).toBe(true);
  });

  test('should handle review operations', async ({ request }) => {
    // Test GET reviews
    const getResponse = await request.get('/api/reviews');
    expect(getResponse.status()).toBe(200);
    
    const reviews = await getResponse.json();
    expect(Array.isArray(reviews)).toBe(true);
  });

  test('should handle user operations', async ({ request }) => {
    // Test GET users
    const getResponse = await request.get('/api/users');
    expect(getResponse.status()).toBe(200);
    
    const users = await getResponse.json();
    expect(Array.isArray(users)).toBe(true);
  });

  test('should handle service operations', async ({ request }) => {
    // Test GET services
    const getResponse = await request.get('/api/services');
    expect(getResponse.status()).toBe(200);
    
    const services = await getResponse.json();
    expect(Array.isArray(services)).toBe(true);
  });

  test('should handle client operations', async ({ request }) => {
    // Test GET clients
    const getResponse = await request.get('/api/clients');
    expect(getResponse.status()).toBe(200);
    
    const clients = await getResponse.json();
    expect(Array.isArray(clients)).toBe(true);
  });

  test('should handle task operations', async ({ request }) => {
    // Test GET tasks
    const getResponse = await request.get('/api/tasks');
    expect(getResponse.status()).toBe(200);
    
    const tasks = await getResponse.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  test('should handle notification operations', async ({ request }) => {
    // Test GET notifications
    const getResponse = await request.get('/api/notifications');
    expect(getResponse.status()).toBe(200);
    
    const notifications = await getResponse.json();
    expect(Array.isArray(notifications)).toBe(true);
  });

  test('should handle chat operations', async ({ request }) => {
    // Test GET chat rooms (expects 401 as it requires authentication)
    const getResponse = await request.get('/api/chat/rooms');
    expect(getResponse.status()).toBe(401);
  });
});



test.describe('Database Integration', () => {
  test('should connect to database', async ({ request }) => {
    const response = await request.get('/api/test/database');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('message');
  });

  test('should handle venue CRUD operations', async ({ request }) => {
    // Test GET venues
    const getResponse = await request.get('/api/venues');
    expect(getResponse.status()).toBe(200);
    
    const venues = await getResponse.json();
    expect(Array.isArray(venues)).toBe(true);
  });

  test('should handle vendor CRUD operations', async ({ request }) => {
    // Test GET vendors
    const getResponse = await request.get('/api/vendors');
    expect(getResponse.status()).toBe(200);
    
    const vendors = await getResponse.json();
    expect(Array.isArray(vendors)).toBe(true);
  });

  test('should handle package CRUD operations', async ({ request }) => {
    // Test GET packages
    const getResponse = await request.get('/api/packages');
    expect(getResponse.status()).toBe(200);
    
    const packages = await getResponse.json();
    expect(Array.isArray(packages)).toBe(true);
  });

  test('should handle booking operations', async ({ request }) => {
    // Test GET bookings
    const getResponse = await request.get('/api/bookings');
    expect(getResponse.status()).toBe(200);
    
    const bookings = await getResponse.json();
    expect(Array.isArray(bookings)).toBe(true);
  });

  test('should handle review operations', async ({ request }) => {
    // Test GET reviews
    const getResponse = await request.get('/api/reviews');
    expect(getResponse.status()).toBe(200);
    
    const reviews = await getResponse.json();
    expect(Array.isArray(reviews)).toBe(true);
  });

  test('should handle user operations', async ({ request }) => {
    // Test GET users
    const getResponse = await request.get('/api/users');
    expect(getResponse.status()).toBe(200);
    
    const users = await getResponse.json();
    expect(Array.isArray(users)).toBe(true);
  });

  test('should handle service operations', async ({ request }) => {
    // Test GET services
    const getResponse = await request.get('/api/services');
    expect(getResponse.status()).toBe(200);
    
    const services = await getResponse.json();
    expect(Array.isArray(services)).toBe(true);
  });

  test('should handle client operations', async ({ request }) => {
    // Test GET clients
    const getResponse = await request.get('/api/clients');
    expect(getResponse.status()).toBe(200);
    
    const clients = await getResponse.json();
    expect(Array.isArray(clients)).toBe(true);
  });

  test('should handle task operations', async ({ request }) => {
    // Test GET tasks
    const getResponse = await request.get('/api/tasks');
    expect(getResponse.status()).toBe(200);
    
    const tasks = await getResponse.json();
    expect(Array.isArray(tasks)).toBe(true);
  });

  test('should handle notification operations', async ({ request }) => {
    // Test GET notifications
    const getResponse = await request.get('/api/notifications');
    expect(getResponse.status()).toBe(200);
    
    const notifications = await getResponse.json();
    expect(Array.isArray(notifications)).toBe(true);
  });

  test('should handle chat operations', async ({ request }) => {
    // Test GET chat rooms (expects 401 as it requires authentication)
    const getResponse = await request.get('/api/chat/rooms');
    expect(getResponse.status()).toBe(401);
  });
});
