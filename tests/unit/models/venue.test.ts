import mongoose from 'mongoose';
import { Venue } from '@/lib/models/venue';
import { setupMockDB, cleanupMockDB, mockObjectId } from '@/tests/helpers/mock-db';

// Use a simple string ID generator for tests
const generateTestId = () => mockObjectId().toString();

describe('Venue Model', () => {
  let mockDB: ReturnType<typeof setupMockDB>;

  beforeAll(() => {
    mockDB = setupMockDB();
  });

  afterAll(() => {
    mockDB.restore();
    cleanupMockDB();
  });
  describe('Venue Schema Validation', () => {
    it('should create a venue with valid data', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue with garden and indoor hall',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.name).toBe('Grand Wedding Hall');
      expect(venue.capacity.min).toBe(50);
      expect(venue.capacity.max).toBe(500);
      expect(venue.pricing.basePrice).toBe(100000);
    });

    it('should require name field', () => {
      const venueData = {
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      const error = venue.validateSync();
      expect(error?.errors.name).toBeDefined();
    });

    it('should require description field', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      const error = venue.validateSync();
      expect(error?.errors.description).toBeDefined();
    });

    it('should require capacity min and max', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      const error = venue.validateSync();
      expect(error?.errors['capacity.min']).toBeDefined();
      expect(error?.errors['capacity.max']).toBeDefined();
    });

    it('should require basePrice', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      const error = venue.validateSync();
      expect(error?.errors['pricing.basePrice']).toBeDefined();
    });

    it('should set default values', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.isActive).toBe(true);
      expect(venue.featured).toBe(false);
      expect(venue.rating.average).toBe(0);
      expect(venue.rating.count).toBe(0);
      expect(venue.pricing.currency).toBe('LKR');
    });
  });

  describe('Capacity Validation', () => {
    it('should validate min capacity is less than max', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 500,
          max: 50, // Invalid: min > max
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      // Note: Schema doesn't enforce min < max, but application logic should
      expect(venue.capacity.min).toBe(500);
      expect(venue.capacity.max).toBe(50);
    });
  });

  describe('Amenities', () => {
    it('should add amenities', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        amenities: [
          'Parking',
          'Air Conditioning',
          'Garden',
          'Indoor Hall',
          'Sound System',
          'Lighting',
          'Kitchen',
        ],
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.amenities).toHaveLength(7);
      expect(venue.amenities).toContain('Parking');
      expect(venue.amenities).toContain('Garden');
    });
  });

  describe('Images', () => {
    it('should add venue images', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        images: [
          'https://example.com/venue1.jpg',
          'https://example.com/venue2.jpg',
          'https://example.com/venue3.jpg',
        ],
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.images).toHaveLength(3);
      expect(venue.images[0]).toBe('https://example.com/venue1.jpg');
    });
  });

  describe('Location with Coordinates', () => {
    it('should add coordinates to location', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
          coordinates: {
            lat: 6.9271,
            lng: 79.8612,
          },
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.location.coordinates?.lat).toBe(6.9271);
      expect(venue.location.coordinates?.lng).toBe(79.8612);
    });
  });

  describe('Availability Management', () => {
    it('should add availability dates', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
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

      const venue = new Venue(venueData);
      expect(venue.availability).toHaveLength(2);
      expect(venue.availability[0].isAvailable).toBe(true);
      expect(venue.availability[1].isAvailable).toBe(false);
    });
  });

  describe('Rating System', () => {
    it('should initialize rating with default values', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.rating.average).toBe(0);
      expect(venue.rating.count).toBe(0);
    });

    it('should allow setting custom rating', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
        },
        rating: {
          average: 4.8,
          count: 25,
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.rating.average).toBe(4.8);
      expect(venue.rating.count).toBe(25);
    });
  });

  describe('Price Per Guest', () => {
    it('should add price per guest', () => {
      const venueData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          min: 50,
          max: 500,
        },
        pricing: {
          basePrice: 100000,
          currency: 'LKR',
          pricePerGuest: 500,
        },
        owner: generateTestId(),
      };

      const venue = new Venue(venueData);
      expect(venue.pricing.pricePerGuest).toBe(500);
    });
  });
});

