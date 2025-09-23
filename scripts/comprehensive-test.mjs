#!/usr/bin/env node

import { connectDB } from '../lib/db.js';
import { User } from '../lib/models/user.js';
import { Venue } from '../lib/models/venue.js';
import { Vendor } from '../lib/models/vendor.js';
import { Booking } from '../lib/models/booking.js';
import { Review } from '../lib/models/review.js';
import { Service } from '../lib/models/service.js';
import { Task } from '../lib/models/task.js';
import { Client } from '../lib/models/client.js';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

class ComprehensiveTester {
  constructor() {
    this.results = {
      database: { passed: 0, failed: 0, tests: [] },
      api: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] },
      crud: { passed: 0, failed: 0, tests: [] }
    };
    this.testData = {};
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive E2E Testing...\n');
    
    try {
      await this.testDatabaseConnection();
      await this.testDatabaseModels();
      await this.testCRUDOperations();
      await this.testAPIEndpoints();
      await this.testFrontendBackendIntegration();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  async testDatabaseConnection() {
    console.log('📊 Testing Database Connection...');
    
    try {
      await connectDB();
      this.addResult('database', 'Database Connection', true, 'Successfully connected to MongoDB');
    } catch (error) {
      this.addResult('database', 'Database Connection', false, `Failed to connect: ${error.message}`);
    }
  }

  async testDatabaseModels() {
    console.log('📋 Testing Database Models...');
    
    const models = [
      { name: 'User', model: User, requiredFields: ['firstName', 'lastName', 'email', 'phone', 'password', 'userType'] },
      { name: 'Venue', model: Venue, requiredFields: ['name', 'description', 'location', 'capacity', 'pricing', 'owner'] },
      { name: 'Vendor', model: Vendor, requiredFields: ['name', 'businessName', 'category', 'description', 'location', 'contact', 'pricing', 'owner'] },
      { name: 'Booking', model: Booking, requiredFields: ['venueId', 'userId', 'date', 'guests', 'contactInfo'] },
      { name: 'Review', model: Review, requiredFields: ['vendorId', 'userId', 'rating'] },
      { name: 'Service', model: Service, requiredFields: ['vendorId', 'name', 'price'] },
      { name: 'Task', model: Task, requiredFields: ['plannerId', 'task', 'date'] },
      { name: 'Client', model: Client, requiredFields: ['plannerId', 'name'] }
    ];

    for (const { name, model, requiredFields } of models) {
      try {
        // Test model creation
        const schema = model.schema;
        const paths = Object.keys(schema.paths);
        
        // Check if all required fields exist
        const missingFields = requiredFields.filter(field => !paths.includes(field));
        
        if (missingFields.length > 0) {
          this.addResult('database', `${name} Model`, false, `Missing required fields: ${missingFields.join(', ')}`);
        } else {
          this.addResult('database', `${name} Model`, true, `All required fields present: ${requiredFields.join(', ')}`);
        }
      } catch (error) {
        this.addResult('database', `${name} Model`, false, `Model validation failed: ${error.message}`);
      }
    }
  }

  async testCRUDOperations() {
    console.log('🔄 Testing CRUD Operations...');
    
    // Test User CRUD
    await this.testUserCRUD();
    await this.testVenueCRUD();
    await this.testVendorCRUD();
    await this.testBookingCRUD();
  }

  async testUserCRUD() {
    try {
      // CREATE
      const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+94771234567',
        password: 'hashedpassword',
        userType: 'couple'
      };
      
      const createdUser = await User.create(testUser);
      this.testData.userId = createdUser._id;
      this.addResult('crud', 'User CREATE', true, 'User created successfully');
      
      // READ
      const foundUser = await User.findById(createdUser._id);
      if (foundUser) {
        this.addResult('crud', 'User READ', true, 'User retrieved successfully');
      } else {
        this.addResult('crud', 'User READ', false, 'User not found');
      }
      
      // UPDATE
      const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        { firstName: 'Updated' },
        { new: true }
      );
      if (updatedUser && updatedUser.firstName === 'Updated') {
        this.addResult('crud', 'User UPDATE', true, 'User updated successfully');
      } else {
        this.addResult('crud', 'User UPDATE', false, 'User update failed');
      }
      
      // DELETE
      await User.findByIdAndDelete(createdUser._id);
      const deletedUser = await User.findById(createdUser._id);
      if (!deletedUser) {
        this.addResult('crud', 'User DELETE', true, 'User deleted successfully');
      } else {
        this.addResult('crud', 'User DELETE', false, 'User deletion failed');
      }
      
    } catch (error) {
      this.addResult('crud', 'User CRUD', false, `User CRUD failed: ${error.message}`);
    }
  }

  async testVenueCRUD() {
    try {
      // First create a user for the venue owner
      const owner = await User.create({
        firstName: 'Venue',
        lastName: 'Owner',
        email: 'venueowner@example.com',
        phone: '+94771234568',
        password: 'hashedpassword',
        userType: 'vendor'
      });
      
      // CREATE
      const testVenue = {
        name: 'Test Venue',
        description: 'A beautiful test venue',
        location: {
          address: '123 Test Street',
          city: 'Colombo',
          province: 'Western'
        },
        capacity: { min: 50, max: 200 },
        pricing: { basePrice: 100000, currency: 'LKR' },
        owner: owner._id
      };
      
      const createdVenue = await Venue.create(testVenue);
      this.testData.venueId = createdVenue._id;
      this.addResult('crud', 'Venue CREATE', true, 'Venue created successfully');
      
      // READ
      const foundVenue = await Venue.findById(createdVenue._id);
      if (foundVenue) {
        this.addResult('crud', 'Venue READ', true, 'Venue retrieved successfully');
      } else {
        this.addResult('crud', 'Venue READ', false, 'Venue not found');
      }
      
      // UPDATE
      const updatedVenue = await Venue.findByIdAndUpdate(
        createdVenue._id,
        { name: 'Updated Venue' },
        { new: true }
      );
      if (updatedVenue && updatedVenue.name === 'Updated Venue') {
        this.addResult('crud', 'Venue UPDATE', true, 'Venue updated successfully');
      } else {
        this.addResult('crud', 'Venue UPDATE', false, 'Venue update failed');
      }
      
      // DELETE
      await Venue.findByIdAndDelete(createdVenue._id);
      await User.findByIdAndDelete(owner._id);
      const deletedVenue = await Venue.findById(createdVenue._id);
      if (!deletedVenue) {
        this.addResult('crud', 'Venue DELETE', true, 'Venue deleted successfully');
      } else {
        this.addResult('crud', 'Venue DELETE', false, 'Venue deletion failed');
      }
      
    } catch (error) {
      this.addResult('crud', 'Venue CRUD', false, `Venue CRUD failed: ${error.message}`);
    }
  }

  async testVendorCRUD() {
    try {
      // First create a user for the vendor owner
      const owner = await User.create({
        firstName: 'Vendor',
        lastName: 'Owner',
        email: 'vendorowner@example.com',
        phone: '+94771234569',
        password: 'hashedpassword',
        userType: 'vendor'
      });
      
      // CREATE
      const testVendor = {
        name: 'Test Vendor',
        businessName: 'Test Business',
        category: 'photographer',
        description: 'A test vendor',
        location: {
          address: '456 Test Avenue',
          city: 'Kandy',
          province: 'Central'
        },
        contact: {
          phone: '+94771234570',
          email: 'vendor@test.com'
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR'
        },
        owner: owner._id
      };
      
      const createdVendor = await Vendor.create(testVendor);
      this.testData.vendorId = createdVendor._id;
      this.addResult('crud', 'Vendor CREATE', true, 'Vendor created successfully');
      
      // READ
      const foundVendor = await Vendor.findById(createdVendor._id);
      if (foundVendor) {
        this.addResult('crud', 'Vendor READ', true, 'Vendor retrieved successfully');
      } else {
        this.addResult('crud', 'Vendor READ', false, 'Vendor not found');
      }
      
      // UPDATE
      const updatedVendor = await Vendor.findByIdAndUpdate(
        createdVendor._id,
        { name: 'Updated Vendor' },
        { new: true }
      );
      if (updatedVendor && updatedVendor.name === 'Updated Vendor') {
        this.addResult('crud', 'Vendor UPDATE', true, 'Vendor updated successfully');
      } else {
        this.addResult('crud', 'Vendor UPDATE', false, 'Vendor update failed');
      }
      
      // DELETE
      await Vendor.findByIdAndDelete(createdVendor._id);
      await User.findByIdAndDelete(owner._id);
      const deletedVendor = await Vendor.findById(createdVendor._id);
      if (!deletedVendor) {
        this.addResult('crud', 'Vendor DELETE', true, 'Vendor deleted successfully');
      } else {
        this.addResult('crud', 'Vendor DELETE', false, 'Vendor deletion failed');
      }
      
    } catch (error) {
      this.addResult('crud', 'Vendor CRUD', false, `Vendor CRUD failed: ${error.message}`);
    }
  }

  async testBookingCRUD() {
    try {
      // Create test users and venue
      const user = await User.create({
        firstName: 'Booking',
        lastName: 'User',
        email: 'bookinguser@example.com',
        phone: '+94771234571',
        password: 'hashedpassword',
        userType: 'couple'
      });
      
      const venueOwner = await User.create({
        firstName: 'Venue',
        lastName: 'Owner',
        email: 'venueowner2@example.com',
        phone: '+94771234572',
        password: 'hashedpassword',
        userType: 'vendor'
      });
      
      const venue = await Venue.create({
        name: 'Test Booking Venue',
        description: 'A venue for booking tests',
        location: {
          address: '789 Test Road',
          city: 'Galle',
          province: 'Southern'
        },
        capacity: { min: 100, max: 300 },
        pricing: { basePrice: 150000, currency: 'LKR' },
        owner: venueOwner._id
      });
      
      // CREATE
      const testBooking = {
        venueId: venue._id,
        userId: user._id,
        date: new Date('2024-12-25'),
        guests: 150,
        contactInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+94771234573'
        }
      };
      
      const createdBooking = await Booking.create(testBooking);
      this.addResult('crud', 'Booking CREATE', true, 'Booking created successfully');
      
      // READ
      const foundBooking = await Booking.findById(createdBooking._id);
      if (foundBooking) {
        this.addResult('crud', 'Booking READ', true, 'Booking retrieved successfully');
      } else {
        this.addResult('crud', 'Booking READ', false, 'Booking not found');
      }
      
      // UPDATE
      const updatedBooking = await Booking.findByIdAndUpdate(
        createdBooking._id,
        { status: 'confirmed' },
        { new: true }
      );
      if (updatedBooking && updatedBooking.status === 'confirmed') {
        this.addResult('crud', 'Booking UPDATE', true, 'Booking updated successfully');
      } else {
        this.addResult('crud', 'Booking UPDATE', false, 'Booking update failed');
      }
      
      // DELETE
      await Booking.findByIdAndDelete(createdBooking._id);
      await Venue.findByIdAndDelete(venue._id);
      await User.findByIdAndDelete(user._id);
      await User.findByIdAndDelete(venueOwner._id);
      const deletedBooking = await Booking.findById(createdBooking._id);
      if (!deletedBooking) {
        this.addResult('crud', 'Booking DELETE', true, 'Booking deleted successfully');
      } else {
        this.addResult('crud', 'Booking DELETE', false, 'Booking deletion failed');
      }
      
    } catch (error) {
      this.addResult('crud', 'Booking CRUD', false, `Booking CRUD failed: ${error.message}`);
    }
  }

  async testAPIEndpoints() {
    console.log('🌐 Testing API Endpoints...');
    
    const endpoints = [
      { method: 'GET', path: '/api/venues', name: 'Get Venues' },
      { method: 'POST', path: '/api/venues', name: 'Create Venue' },
      { method: 'GET', path: '/api/vendors', name: 'Get Vendors' },
      { method: 'POST', path: '/api/vendors', name: 'Create Vendor' },
      { method: 'GET', path: '/api/users', name: 'Get Users' },
      { method: 'POST', path: '/api/users', name: 'Create User' },
      { method: 'GET', path: '/api/bookings', name: 'Get Bookings' },
      { method: 'POST', path: '/api/bookings', name: 'Create Booking' },
      { method: 'GET', path: '/api/reviews', name: 'Get Reviews' },
      { method: 'POST', path: '/api/reviews', name: 'Create Review' },
      { method: 'GET', path: '/api/services', name: 'Get Services' },
      { method: 'POST', path: '/api/services', name: 'Create Service' },
      { method: 'GET', path: '/api/tasks', name: 'Get Tasks' },
      { method: 'POST', path: '/api/tasks', name: 'Create Task' },
      { method: 'GET', path: '/api/clients', name: 'Get Clients' },
      { method: 'POST', path: '/api/clients', name: 'Create Client' }
    ];

    for (const endpoint of endpoints) {
      await this.testEndpoint(endpoint);
    }
  }

  async testEndpoint({ method, path, name }) {
    try {
      const url = `${BASE_URL}${path}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (method === 'POST') {
        options.body = JSON.stringify(this.getTestDataForEndpoint(path));
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        this.addResult('api', name, true, `Status: ${response.status}, Response received`);
      } else {
        this.addResult('api', name, false, `Status: ${response.status}, Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      this.addResult('api', name, false, `Request failed: ${error.message}`);
    }
  }

  getTestDataForEndpoint(path) {
    const testData = {
      '/api/venues': {
        name: 'Test Venue',
        description: 'A test venue',
        location: {
          address: '123 Test Street',
          city: 'Colombo',
          province: 'Western'
        },
        capacity: { min: 50, max: 200 },
        pricing: { basePrice: 100000, currency: 'LKR' }
      },
      '/api/vendors': {
        name: 'Test Vendor',
        businessName: 'Test Business',
        category: 'photographer',
        description: 'A test vendor',
        location: {
          address: '456 Test Avenue',
          city: 'Kandy',
          province: 'Central'
        },
        contact: {
          phone: '+94771234570',
          email: 'vendor@test.com'
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR'
        }
      },
      '/api/users': {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+94771234567',
        password: 'hashedpassword',
        userType: 'couple'
      },
      '/api/bookings': {
        venueId: this.testData.venueId || '507f1f77bcf86cd799439011',
        date: '2024-12-25',
        guests: 150,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+94771234573'
      },
      '/api/reviews': {
        vendorId: this.testData.vendorId || '507f1f77bcf86cd799439012',
        userId: this.testData.userId || '507f1f77bcf86cd799439013',
        rating: 5,
        comment: 'Great service!'
      },
      '/api/services': {
        vendorId: this.testData.vendorId || '507f1f77bcf86cd799439012',
        name: 'Test Service',
        price: 25000,
        description: 'A test service'
      },
      '/api/tasks': {
        plannerId: this.testData.userId || '507f1f77bcf86cd799439013',
        task: 'Test Task',
        date: '2024-12-25'
      },
      '/api/clients': {
        plannerId: this.testData.userId || '507f1f77bcf86cd799439013',
        name: 'Test Client',
        email: 'client@example.com',
        phone: '+94771234574'
      }
    };

    return testData[path] || {};
  }

  async testFrontendBackendIntegration() {
    console.log('🔗 Testing Frontend-Backend Integration...');
    
    // Test if frontend pages can load without errors
    const pages = [
      '/',
      '/venues',
      '/vendors',
      '/about',
      '/contact',
      '/login',
      '/register',
      '/dashboard'
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${BASE_URL}${page}`);
        if (response.ok) {
          this.addResult('integration', `Page ${page}`, true, `Status: ${response.status}`);
        } else {
          this.addResult('integration', `Page ${page}`, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult('integration', `Page ${page}`, false, `Failed to load: ${error.message}`);
      }
    }
  }

  addResult(category, testName, passed, message) {
    this.results[category].tests.push({
      name: testName,
      passed,
      message
    });
    
    if (passed) {
      this.results[category].passed++;
      console.log(`✅ ${testName}: ${message}`);
    } else {
      this.results[category].failed++;
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('================================\n');

    const categories = ['database', 'api', 'integration', 'crud'];
    
    for (const category of categories) {
      const { passed, failed, tests } = this.results[category];
      const total = passed + failed;
      const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
      
      console.log(`${category.toUpperCase()} TESTS:`);
      console.log(`  ✅ Passed: ${passed}`);
      console.log(`  ❌ Failed: ${failed}`);
      console.log(`  📊 Success Rate: ${percentage}%`);
      console.log('');
      
      if (failed > 0) {
        console.log('  Failed Tests:');
        tests.filter(test => !test.passed).forEach(test => {
          console.log(`    ❌ ${test.name}: ${test.message}`);
        });
        console.log('');
      }
    }

    const totalPassed = Object.values(this.results).reduce((sum, cat) => sum + cat.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, cat) => sum + cat.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const overallPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

    console.log('OVERALL RESULTS:');
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📊 Overall Success Rate: ${overallPercentage}%`);
    
    if (overallPercentage >= 90) {
      console.log('\n🎉 EXCELLENT! Your application is ready for production!');
    } else if (overallPercentage >= 70) {
      console.log('\n⚠️  GOOD! Some issues need attention before production.');
    } else {
      console.log('\n🚨 CRITICAL! Major issues need to be fixed before production.');
    }
  }
}

// Run the comprehensive test
const tester = new ComprehensiveTester();
tester.runAllTests().catch(console.error);
