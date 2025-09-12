import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Booking } from '@/lib/models/booking';

// Test database setup
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  await connectDB();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean up database before each test
  await User.deleteMany({});
  await Vendor.deleteMany({});
  await Booking.deleteMany({});
});

describe('API Integration Tests', () => {
  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+94771234567',
        role: 'user',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      };

      const user = new User(userData);
      await user.save();

      const savedUser = await User.findOne({ email: 'test@example.com' });
      expect(savedUser).toBeTruthy();
      expect(savedUser?.name).toBe('Test User');
      expect(savedUser?.role).toBe('user');
    });

    it('should not allow duplicate email registration', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+94771234567',
        role: 'user',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      await expect(user2.save()).rejects.toThrow();
    });
  });

  describe('Vendor Management', () => {
    it('should create a vendor profile', async () => {
      const vendorData = {
        businessName: 'Test Photography',
        email: 'photographer@example.com',
        phone: '+94771234567',
        category: 'photography',
        description: 'Professional wedding photography',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        },
        services: ['Wedding Photography', 'Engagement Shoots'],
        pricing: {
          wedding: 50000,
          engagement: 15000
        }
      };

      const vendor = new Vendor(vendorData);
      await vendor.save();

      const savedVendor = await Vendor.findOne({ email: 'photographer@example.com' });
      expect(savedVendor).toBeTruthy();
      expect(savedVendor?.businessName).toBe('Test Photography');
      expect(savedVendor?.category).toBe('photography');
    });
  });

  describe('Booking System', () => {
    it('should create a booking successfully', async () => {
      // Create test user
      const user = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      });
      await user.save();

      // Create test vendor
      const vendor = new Vendor({
        businessName: 'Test Photography',
        email: 'photographer@example.com',
        category: 'photography',
        location: {
          country: 'Sri Lanka',
          state: 'Western Province',
          city: 'Colombo'
        }
      });
      await vendor.save();

      // Create booking
      const bookingData = {
        userId: user._id,
        vendorId: vendor._id,
        serviceType: 'Wedding Photography',
        bookingDate: new Date('2024-06-15'),
        amount: 50000,
        status: 'pending',
        details: {
          eventType: 'Wedding',
          guestCount: 100,
          location: 'Colombo',
          specialRequests: 'Outdoor ceremony photos'
        }
      };

      const booking = new Booking(bookingData);
      await booking.save();

      const savedBooking = await Booking.findOne({ userId: user._id });
      expect(savedBooking).toBeTruthy();
      expect(savedBooking?.amount).toBe(50000);
      expect(savedBooking?.status).toBe('pending');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      // Create test vendors
      const vendors = [
        {
          businessName: 'Colombo Photography',
          category: 'photography',
          location: { city: 'Colombo' },
          services: ['Wedding Photography'],
          pricing: { wedding: 50000 }
        },
        {
          businessName: 'Kandy Photography',
          category: 'photography',
          location: { city: 'Kandy' },
          services: ['Wedding Photography'],
          pricing: { wedding: 45000 }
        },
        {
          businessName: 'Colombo Catering',
          category: 'catering',
          location: { city: 'Colombo' },
          services: ['Wedding Catering'],
          pricing: { wedding: 80000 }
        }
      ];

      for (const vendorData of vendors) {
        const vendor = new Vendor(vendorData);
        await vendor.save();
      }
    });

    it('should search vendors by category', async () => {
      const photographyVendors = await Vendor.find({ category: 'photography' });
      expect(photographyVendors).toHaveLength(2);
    });

    it('should search vendors by location', async () => {
      const colomboVendors = await Vendor.find({ 'location.city': 'Colombo' });
      expect(colomboVendors).toHaveLength(2);
    });

    it('should search vendors by price range', async () => {
      const affordableVendors = await Vendor.find({
        'pricing.wedding': { $lte: 50000 }
      });
      expect(affordableVendors).toHaveLength(2);
    });
  });
});

