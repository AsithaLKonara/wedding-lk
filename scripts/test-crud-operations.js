#!/usr/bin/env node

/**
 * Comprehensive CRUD Operations Test Script
 * Tests all implemented CRUD operations across all APIs
 */

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Test data
const testData = {
  user: {
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
    role: 'user',
    location: {
      country: 'Sri Lanka',
      state: 'Western',
      city: 'Colombo'
    }
  },
  vendor: {
    businessName: 'Test Photography Studio',
    ownerName: 'John Doe',
    email: 'test@photography.com',
    category: 'photographer',
    description: 'Professional wedding photography services',
    location: {
      address: '123 Main Street',
      city: 'Colombo',
      province: 'Western',
      serviceAreas: ['Colombo', 'Gampaha']
    },
    contact: {
      phone: '0771234567',
      email: 'test@photography.com'
    },
    pricing: {
      startingPrice: 50000,
      currency: 'LKR'
    }
  },
  venue: {
    name: 'Test Wedding Hall',
    description: 'Beautiful wedding venue with garden',
    location: {
      address: '456 Park Avenue',
      city: 'Colombo',
      province: 'Western'
    },
    capacity: {
      min: 50,
      max: 200
    },
    pricing: {
      basePrice: 100000,
      currency: 'LKR'
    },
    vendor: 'test-vendor-id'
  },
  booking: {
    user: 'test-user-id',
    vendor: 'test-vendor-id',
    venue: 'test-venue-id',
    date: new Date().toISOString(),
    totalAmount: 150000,
    guestCount: 100
  },
  payment: {
    user: 'test-user-id',
    vendor: 'test-vendor-id',
    booking: 'test-booking-id',
    amount: 150000,
    paymentMethod: 'credit_card'
  },
  review: {
    itemId: 'test-vendor-id',
    itemType: 'vendor',
    rating: 5,
    comment: 'Excellent service!'
  },
  message: {
    receiverId: 'test-user-id',
    content: 'Hello, this is a test message',
    messageType: 'text'
  },
  favorite: {
    userId: 'test-user-id',
    itemId: 'test-vendor-id',
    type: 'vendor'
  }
};

// Utility functions
async function makeRequest(method, url, data = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { response, result };
  } catch (error) {
    return { error: error.message };
  }
}

function logTest(testName, status, details = '') {
  testResults.total++;
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${testName}: PASS`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: FAIL - ${details}`);
  }
  testResults.details.push({ testName, status, details });
}

// Test functions
async function testVendorsCRUD() {
  console.log('\n🏢 Testing Vendors CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/vendors`, testData.vendor);
  if (createResponse?.ok && createResult?.success) {
    logTest('Vendors CREATE', 'PASS');
    testData.vendorId = createResult.vendor?._id;
  } else {
    logTest('Vendors CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/vendors`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Vendors READ', 'PASS');
  } else {
    logTest('Vendors READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.vendorId) {
    const updateData = { businessName: 'Updated Photography Studio' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/vendors?id=${testData.vendorId}`, updateData);
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Vendors UPDATE', 'PASS');
    } else {
      logTest('Vendors UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.vendorId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/vendors?id=${testData.vendorId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Vendors DELETE', 'PASS');
    } else {
      logTest('Vendors DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testVenuesCRUD() {
  console.log('\n🏛️ Testing Venues CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/venues`, testData.venue);
  if (createResponse?.ok && createResult?.success) {
    logTest('Venues CREATE', 'PASS');
    testData.venueId = createResult.venue?._id;
  } else {
    logTest('Venues CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/venues`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Venues READ', 'PASS');
  } else {
    logTest('Venues READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.venueId) {
    const updateData = { name: 'Updated Wedding Hall' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/venues?id=${testData.venueId}`, updateData);
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Venues UPDATE', 'PASS');
    } else {
      logTest('Venues UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.venueId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/venues?id=${testData.venueId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Venues DELETE', 'PASS');
    } else {
      logTest('Venues DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testBookingsCRUD() {
  console.log('\n📅 Testing Bookings CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/bookings`, testData.booking);
  if (createResponse?.ok && createResult?.success) {
    logTest('Bookings CREATE', 'PASS');
    testData.bookingId = createResult.booking?._id;
  } else {
    logTest('Bookings CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/bookings`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Bookings READ', 'PASS');
  } else {
    logTest('Bookings READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.bookingId) {
    const updateData = { status: 'confirmed' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/bookings?id=${testData.bookingId}`, updateData);
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Bookings UPDATE', 'PASS');
    } else {
      logTest('Bookings UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.bookingId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/bookings?id=${testData.bookingId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Bookings DELETE', 'PASS');
    } else {
      logTest('Bookings DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testPaymentsCRUD() {
  console.log('\n💳 Testing Payments CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/payments`, testData.payment);
  if (createResponse?.ok && createResult?.success) {
    logTest('Payments CREATE', 'PASS');
    testData.paymentId = createResult.payment?._id;
  } else {
    logTest('Payments CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/payments`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Payments READ', 'PASS');
  } else {
    logTest('Payments READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.paymentId) {
    const updateData = { status: 'completed' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/payments?id=${testData.paymentId}`, updateData);
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Payments UPDATE', 'PASS');
    } else {
      logTest('Payments UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.paymentId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/payments?id=${testData.paymentId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Payments DELETE', 'PASS');
    } else {
      logTest('Payments DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testReviewsCRUD() {
  console.log('\n⭐ Testing Reviews CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/reviews`, testData.review);
  if (createResponse?.ok && createResult?.success) {
    logTest('Reviews CREATE', 'PASS');
    testData.reviewId = createResult.review?._id;
  } else {
    logTest('Reviews CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/reviews`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Reviews READ', 'PASS');
  } else {
    logTest('Reviews READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.reviewId) {
    const updateData = { rating: 4, comment: 'Updated review comment' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/reviews`, { reviewId: testData.reviewId, ...updateData });
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Reviews UPDATE', 'PASS');
    } else {
      logTest('Reviews UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.reviewId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/reviews?reviewId=${testData.reviewId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Reviews DELETE', 'PASS');
    } else {
      logTest('Reviews DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testMessagesCRUD() {
  console.log('\n💬 Testing Messages CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/messages`, testData.message);
  if (createResponse?.ok && createResult?.success) {
    logTest('Messages CREATE', 'PASS');
    testData.messageId = createResult.message?._id;
  } else {
    logTest('Messages CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/messages?conversationId=test-conversation`);
  if (readResponse?.ok && readResult?.messages) {
    logTest('Messages READ', 'PASS');
  } else {
    logTest('Messages READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test UPDATE
  if (testData.messageId) {
    const updateData = { content: 'Updated message content' };
    const { response: updateResponse, result: updateResult } = await makeRequest('PUT', `${baseUrl}/messages?id=${testData.messageId}`, updateData);
    if (updateResponse?.ok && updateResult?.success) {
      logTest('Messages UPDATE', 'PASS');
    } else {
      logTest('Messages UPDATE', 'FAIL', updateResult?.error || 'Unknown error');
    }
  }

  // Test DELETE
  if (testData.messageId) {
    const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/messages?id=${testData.messageId}`);
    if (deleteResponse?.ok && deleteResult?.success) {
      logTest('Messages DELETE', 'PASS');
    } else {
      logTest('Messages DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
    }
  }
}

async function testFavoritesCRUD() {
  console.log('\n❤️ Testing Favorites CRUD Operations...');
  
  // Test CREATE
  const { response: createResponse, result: createResult } = await makeRequest('POST', `${baseUrl}/favorites`, testData.favorite);
  if (createResponse?.ok && createResult?.success) {
    logTest('Favorites CREATE', 'PASS');
    testData.favoriteId = createResult.favorite?._id;
  } else {
    logTest('Favorites CREATE', 'FAIL', createResult?.error || 'Unknown error');
  }

  // Test READ
  const { response: readResponse, result: readResult } = await makeRequest('GET', `${baseUrl}/favorites?userId=${testData.favorite.userId}`);
  if (readResponse?.ok && readResult?.success) {
    logTest('Favorites READ', 'PASS');
  } else {
    logTest('Favorites READ', 'FAIL', readResult?.error || 'Unknown error');
  }

  // Test DELETE
  const { response: deleteResponse, result: deleteResult } = await makeRequest('DELETE', `${baseUrl}/favorites?userId=${testData.favorite.userId}&itemId=${testData.favorite.itemId}&type=${testData.favorite.type}`);
  if (deleteResponse?.ok && deleteResult?.success) {
    logTest('Favorites DELETE', 'PASS');
  } else {
    logTest('Favorites DELETE', 'FAIL', deleteResult?.error || 'Unknown error');
  }
}

async function testBulkOperations() {
  console.log('\n📦 Testing Bulk Operations...');
  
  // Test bulk statistics
  const { response: statsResponse, result: statsResult } = await makeRequest('GET', `${baseUrl}/admin/bulk`);
  if (statsResponse?.ok && statsResult?.success) {
    logTest('Bulk Statistics', 'PASS');
  } else {
    logTest('Bulk Statistics', 'FAIL', statsResult?.error || 'Unknown error');
  }

  // Test bulk operation (would need admin authentication in real scenario)
  const bulkData = {
    operation: 'activate',
    entity: 'vendors',
    ids: ['test-id-1', 'test-id-2']
  };
  
  const { response: bulkResponse, result: bulkResult } = await makeRequest('POST', `${baseUrl}/admin/bulk`, bulkData);
  // This will likely fail due to authentication, but we test the endpoint structure
  if (bulkResponse?.status === 401) {
    logTest('Bulk Operations Auth', 'PASS', 'Correctly requires authentication');
  } else {
    logTest('Bulk Operations Auth', 'FAIL', 'Should require authentication');
  }
}

async function testValidation() {
  console.log('\n🔍 Testing Input Validation...');
  
  // Test invalid vendor data
  const invalidVendorData = {
    businessName: '', // Invalid: empty string
    email: 'invalid-email', // Invalid: not an email
    category: 'invalid-category' // Invalid: not in enum
  };
  
  const { response: validationResponse, result: validationResult } = await makeRequest('POST', `${baseUrl}/vendors`, invalidVendorData);
  if (validationResponse?.status === 400 && validationResult?.error === 'Validation failed') {
    logTest('Input Validation', 'PASS', 'Correctly validates input data');
  } else {
    logTest('Input Validation', 'FAIL', 'Should validate input data');
  }
}

async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');
  
  // Test 404 error
  const { response: notFoundResponse, result: notFoundResult } = await makeRequest('GET', `${baseUrl}/vendors/non-existent-id`);
  if (notFoundResponse?.status === 404 || notFoundResult?.error) {
    logTest('404 Error Handling', 'PASS', 'Correctly handles not found');
  } else {
    logTest('404 Error Handling', 'FAIL', 'Should handle not found');
  }

  // Test invalid ID format
  const { response: invalidIdResponse, result: invalidIdResult } = await makeRequest('PUT', `${baseUrl}/vendors?id=invalid-id`, { businessName: 'Test' });
  if (invalidIdResponse?.status === 400 || invalidIdResult?.error) {
    logTest('Invalid ID Handling', 'PASS', 'Correctly handles invalid ID');
  } else {
    logTest('Invalid ID Handling', 'FAIL', 'Should handle invalid ID');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive CRUD Operations Test Suite...\n');
  console.log(`Testing against: ${baseUrl}\n`);

  try {
    await testVendorsCRUD();
    await testVenuesCRUD();
    await testBookingsCRUD();
    await testPaymentsCRUD();
    await testReviewsCRUD();
    await testMessagesCRUD();
    await testFavoritesCRUD();
    await testBulkOperations();
    await testValidation();
    await testErrorHandling();

    // Print summary
    console.log('\n📊 Test Summary:');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);

    if (testResults.failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.details
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`  - ${test.testName}: ${test.details}`));
    }

    // Exit with appropriate code
    process.exit(testResults.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Test suite failed with error:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testVendorsCRUD,
  testVenuesCRUD,
  testBookingsCRUD,
  testPaymentsCRUD,
  testReviewsCRUD,
  testMessagesCRUD,
  testFavoritesCRUD,
  testBulkOperations,
  testValidation,
  testErrorHandling
};

