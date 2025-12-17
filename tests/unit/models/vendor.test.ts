import mongoose from 'mongoose';
import { Vendor } from '@/lib/models/vendor';
import { setupMockDB, cleanupMockDB, mockObjectId } from '@/tests/helpers/mock-db';

// Use a simple string ID generator for tests
const generateTestId = () => mockObjectId().toString();

describe('Vendor Model', () => {
  let mockDB: ReturnType<typeof setupMockDB>;

  beforeAll(() => {
    mockDB = setupMockDB();
  });

  afterAll(() => {
    mockDB.restore();
    cleanupMockDB();
  });

  describe('Vendor Schema Validation', () => {
    it('should create a vendor with valid data', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.name).toBe('John Doe');
      expect(vendor.businessName).toBe('Wedding Photography Co');
      expect(vendor.category).toBe('photographer');
      expect(vendor.pricing.startingPrice).toBe(50000);
    });

    it('should require name field', () => {
      const vendorData = {
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      const error = vendor.validateSync();
      expect(error?.errors.name).toBeDefined();
    });

    it('should require businessName field', () => {
      const vendorData = {
        name: 'John Doe',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      const error = vendor.validateSync();
      expect(error?.errors.businessName).toBeDefined();
    });

    it('should require category field', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      const error = vendor.validateSync();
      expect(error?.errors.category).toBeDefined();
    });

    it('should validate category enum', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'invalid_category' as any,
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      const error = vendor.validateSync();
      expect(error?.errors.category).toBeDefined();
    });

    it('should set default values', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.isVerified).toBe(false);
      expect(vendor.isActive).toBe(true);
      expect(vendor.featured).toBe(false);
      expect(vendor.onboardingComplete).toBe(false);
      expect(vendor.rating.average).toBe(0);
      expect(vendor.rating.count).toBe(0);
      expect(vendor.pricing.currency).toBe('LKR');
    });
  });

  describe('Services Management', () => {
    it('should add services to vendor', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        services: [
          {
            name: 'Basic Package',
            description: '6 hours coverage',
            price: 45000,
            duration: '6 hours',
          },
          {
            name: 'Premium Package',
            description: '8 hours coverage',
            price: 75000,
            duration: '8 hours',
          },
        ],
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.services).toHaveLength(2);
      expect(vendor.services[0].name).toBe('Basic Package');
      expect(vendor.services[1].price).toBe(75000);
    });
  });

  describe('Rating System', () => {
    it('should initialize rating with default values', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.rating.average).toBe(0);
      expect(vendor.rating.count).toBe(0);
    });

    it('should allow setting custom rating', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        rating: {
          average: 4.5,
          count: 10,
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.rating.average).toBe(4.5);
      expect(vendor.rating.count).toBe(10);
    });
  });

  describe('Availability Management', () => {
    it('should add availability dates', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        availability: [
          {
            date: new Date('2024-12-25'),
            isAvailable: true,
          },
          {
            date: new Date('2024-12-26'),
            isAvailable: false,
          },
        ],
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.availability).toHaveLength(2);
      expect(vendor.availability[0].isAvailable).toBe(true);
      expect(vendor.availability[1].isAvailable).toBe(false);
    });
  });

  describe('Portfolio Management', () => {
    it('should add portfolio images', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        portfolio: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg',
        ],
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.portfolio).toHaveLength(3);
      expect(vendor.portfolio[0]).toBe('https://example.com/image1.jpg');
    });
  });

  describe('Social Media Links', () => {
    it('should add social media links', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
          socialMedia: {
            facebook: 'https://facebook.com/vendor',
            instagram: 'https://instagram.com/vendor',
            youtube: 'https://youtube.com/vendor',
          },
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.contact.socialMedia?.facebook).toBe('https://facebook.com/vendor');
      expect(vendor.contact.socialMedia?.instagram).toBe('https://instagram.com/vendor');
      expect(vendor.contact.socialMedia?.youtube).toBe('https://youtube.com/vendor');
    });
  });

  describe('Subscription Management', () => {
    it('should set default subscription plan', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.subscription.plan).toBe('basic');
    });

    it('should allow setting premium subscription', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        subscription: {
          plan: 'premium' as const,
          expiresAt: new Date('2025-12-31'),
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.subscription.plan).toBe('premium');
      expect(vendor.subscription.expiresAt).toBeDefined();
    });
  });

  describe('Service Areas', () => {
    it('should add service areas', () => {
      const vendorData = {
        name: 'John Doe',
        businessName: 'Wedding Photography Co',
        category: 'photographer',
        description: 'Professional wedding photography services',
        location: {
          address: '123 Main St',
          city: 'Colombo',
          province: 'Western Province',
          serviceAreas: ['Colombo', 'Kandy', 'Galle'],
        },
        contact: {
          phone: '+94771234567',
          email: 'vendor@example.com',
        },
        pricing: {
          startingPrice: 50000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const vendor = new Vendor(vendorData);
      expect(vendor.location.serviceAreas).toHaveLength(3);
      expect(vendor.location.serviceAreas).toContain('Colombo');
      expect(vendor.location.serviceAreas).toContain('Kandy');
    });
  });
});

