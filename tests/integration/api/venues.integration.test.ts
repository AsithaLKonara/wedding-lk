import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/venues/route';
import { GET as searchHandler } from '@/app/api/venues/search/route';
import { GET as availabilityHandler } from '@/app/api/venues/availability/route';
import { Venue } from '@/lib/models/venue';
import { Booking } from '@/lib/models/booking';

// Use a simple string ID generator for tests
const generateTestId = () => 'test-id-' + Math.random().toString(36).substring(7);

// Helper to create chainable query mock that supports both .sort().skip().limit() and .sort().limit().skip() patterns
// Also ensures .lean() returns plain objects for JSON serialization
const createChainableQuery = (mockResult: any) => {
  // Convert mockResult to plain objects (no Mongoose documents) for JSON serialization
  const toPlainObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) {
      return obj.map(item => toPlainObject(item));
    }
    if (typeof obj === 'object') {
      const plain: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function' && typeof obj[key] !== 'symbol') {
          if (key === '_id') {
            // Convert _id to string explicitly
            plain._id = String(obj._id);
          } else if (!key.startsWith('_')) {
            plain[key] = toPlainObject(obj[key]);
          }
        }
      }
      return plain;
    }
    return String(obj);
  };
  
  const plainResult = toPlainObject(mockResult);
  
  // Create a thenable chain that supports both patterns
  // The chain is awaitable directly, and .lean() also returns a promise
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(), // Both skip and limit return this for chaining
    lean: jest.fn(() => Promise.resolve(plainResult)), // lean() resolves to plain result
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    // Make the chain itself awaitable (thenable)
    then: (onResolve: any, onReject?: any) => Promise.resolve(plainResult).then(onResolve, onReject),
    catch: (onReject: any) => Promise.resolve(plainResult).catch(onReject),
  };
  
  return chain;
};

// For these integration-style tests we call the route handlers directly and
// stub the underlying Mongoose models, so we don't depend on a real database.
jest.mock('@/lib/models/venue', () => {
  const VenueMock = jest.fn();
  VenueMock.find = jest.fn();
  VenueMock.countDocuments = jest.fn();
  VenueMock.create = jest.fn();
  VenueMock.findById = jest.fn();
  return {
    Venue: VenueMock,
  };
});

jest.mock('@/lib/models/booking', () => ({
  Booking: {
    find: jest.fn(),
  },
}));
jest.mock('@/lib/middleware/auth-middleware', () => ({
  withAuth: (handler: any) => handler,
  withAdmin: (handler: any) => handler,
}));

// Mock API optimization modules
jest.mock('@/lib/api-optimization', () => ({
  DatabaseOptimizer: {
    ensureConnection: jest.fn().mockResolvedValue(undefined),
  },
  QueryOptimizer: {
    optimizeQuery: jest.fn((query: any) => query),
  },
  ResponseOptimizer: {
    compressVenue: jest.fn((venue: any) => {
      // Always return a fully serializable object, no matter what input
      if (!venue) return null;
      
      // Create a completely safe venue object
      const safeVenue: any = {
        id: String(venue._id || venue.id || ''),
        name: String(venue.name || ''),
        isActive: Boolean(venue.isActive),
      };
      
      // Safely handle location
      if (venue.location !== undefined && venue.location !== null) {
        if (typeof venue.location === 'object' && !Array.isArray(venue.location)) {
          safeVenue.location = {};
          for (const key in venue.location) {
            if (venue.location.hasOwnProperty(key)) {
              const val = venue.location[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                safeVenue.location[key] = val;
              } else if (val !== null && val !== undefined) {
                safeVenue.location[key] = String(val);
              }
            }
          }
        } else {
          safeVenue.location = String(venue.location);
        }
      }
      
      // Safely handle pricing
      if (venue.pricing !== undefined && venue.pricing !== null) {
        if (typeof venue.pricing === 'object' && !Array.isArray(venue.pricing)) {
          safeVenue.pricing = {};
          for (const key in venue.pricing) {
            if (venue.pricing.hasOwnProperty(key)) {
              const val = venue.pricing[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                safeVenue.pricing[key] = val;
              } else if (val !== null && val !== undefined) {
                safeVenue.pricing[key] = String(val);
              }
            }
          }
        } else {
          safeVenue.pricing = String(venue.pricing);
        }
      }
      
      // Safely handle images
      if (Array.isArray(venue.images)) {
        safeVenue.images = venue.images.map((img: any) => String(img));
      }
      
      // Safely handle rating
      if (venue.rating !== undefined && venue.rating !== null) {
        if (typeof venue.rating === 'object' && !Array.isArray(venue.rating)) {
          safeVenue.rating = {};
          for (const key in venue.rating) {
            if (venue.rating.hasOwnProperty(key)) {
              const val = venue.rating[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                safeVenue.rating[key] = val;
              } else if (val !== null && val !== undefined) {
                safeVenue.rating[key] = String(val);
              }
            }
          }
        } else {
          safeVenue.rating = String(venue.rating);
        }
      }
      
      // Final check - ensure it's serializable
      try {
        JSON.stringify(safeVenue);
        return safeVenue;
      } catch (e) {
        // Ultimate fallback
        return {
          id: safeVenue.id || '',
          name: safeVenue.name || '',
          isActive: safeVenue.isActive || false,
        };
      }
    }),
  },
  TimeoutHandler: {
    withTimeout: jest.fn((fn: any) => fn()),
  },
  APIResponse: {
    success: jest.fn((data: any) => {
      // Immediately create a safe, serializable response object
      const response: any = {
        success: true,
        data: {}
      };
      
      // Safely extract and clean venues array
      if (data && Array.isArray(data.venues)) {
        response.data.venues = data.venues.map((v: any) => {
          const venue: any = {
            id: String(v?.id || v?._id || ''),
            name: String(v?.name || ''),
            isActive: Boolean(v?.isActive),
          };
          
          // Safely add location if present
          if (v?.location !== undefined && v?.location !== null) {
            if (typeof v.location === 'object') {
              venue.location = {};
              for (const key in v.location) {
                if (v.location.hasOwnProperty(key)) {
                  const val = v.location[key];
                  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                    venue.location[key] = val;
                  } else {
                    venue.location[key] = String(val);
                  }
                }
              }
            } else {
              venue.location = String(v.location);
            }
          }
          
          // Safely add pricing if present
          if (v?.pricing !== undefined && v?.pricing !== null) {
            if (typeof v.pricing === 'object') {
              venue.pricing = {};
              for (const key in v.pricing) {
                if (v.pricing.hasOwnProperty(key)) {
                  const val = v.pricing[key];
                  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                    venue.pricing[key] = val;
                  } else {
                    venue.pricing[key] = String(val);
                  }
                }
              }
            } else {
              venue.pricing = String(v.pricing);
            }
          }
          
          // Safely add images if present
          if (Array.isArray(v?.images)) {
            venue.images = v.images.map((img: any) => String(img));
          }
          
          // Safely add rating if present
          if (v?.rating !== undefined && v?.rating !== null) {
            if (typeof v.rating === 'object') {
              venue.rating = {};
              for (const key in v.rating) {
                if (v.rating.hasOwnProperty(key)) {
                  const val = v.rating[key];
                  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                    venue.rating[key] = val;
                  } else {
                    venue.rating[key] = String(val);
                  }
                }
              }
            } else {
              venue.rating = String(v.rating);
            }
          }
          
          return venue;
        });
      } else {
        response.data.venues = [];
      }
      
      // Safely extract and validate pagination
      if (data && data.pagination) {
        const total = Number(data.pagination.total);
        const page = Number(data.pagination.page);
        const limit = Number(data.pagination.limit);
        
        response.data.pagination = {
          total: isNaN(total) ? 0 : total,
          page: isNaN(page) || page < 1 ? 1 : page,
          limit: isNaN(limit) || limit < 1 ? 10 : limit,
          totalPages: Math.ceil((isNaN(total) ? 0 : total) / (isNaN(limit) || limit < 1 ? 10 : limit))
        };
      } else {
        response.data.pagination = { total: 0, page: 1, limit: 10, totalPages: 0 };
      }
      
      // Final validation - ensure response is serializable
      try {
        JSON.stringify(response);
        return response;
      } catch (error: any) {
        // Ultimate fallback - return minimal safe structure
        return {
          success: true,
          data: {
            venues: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
          }
        };
      }
    }),
  },
}));

// Mock API cache
jest.mock('@/lib/api-cache', () => ({
  apiCache: {
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
  },
  cacheKeys: {
    venues: jest.fn((page: number, limit: number) => `venues:${page}:${limit}`),
  },
  cacheTTL: {
    MEDIUM: 300000,
  },
}));

describe('Venues API Integration Tests', () => {
  let mockRequest: NextRequest;

  function createMockRequest(url: string = 'http://localhost:3000/api/venues'): NextRequest {
    const urlObj = new URL(url);
    return {
      url,
      headers: new Headers(),
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'valid-token' }),
      },
      nextUrl: {
        searchParams: urlObj.searchParams,
      },
      json: jest.fn(),
    } as unknown as NextRequest;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = createMockRequest();
  });

  describe('GET /api/venues', () => {
    it('should return list of venues with pagination', async () => {
      const venuesRequest = createMockRequest('http://localhost:3000/api/venues');
      const mockVenues = [
        {
          _id: generateTestId(),
          name: 'Grand Wedding Hall',
          location: { city: 'Colombo', province: 'Western Province' },
          capacity: { min: 50, max: 500 },
          pricing: { basePrice: 100000 },
          rating: { average: 4.5, count: 10 },
          isActive: true,
        },
      ];

      (Venue.find as jest.Mock).mockReturnValue(createChainableQuery(mockVenues));
      (Venue.countDocuments as jest.Mock).mockResolvedValue(1);

      const response = await GET(venuesRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data?.venues || json.data)).toBe(true);
    });

    it('should filter venues by city', async () => {
      const cityRequest = createMockRequest('http://localhost:3000/api/venues?city=Colombo');

      (Venue.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Venue.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(cityRequest);
      expect(response.status).toBe(200);
    });

    it('should filter venues by capacity', async () => {
      const capacityRequest = createMockRequest('http://localhost:3000/api/venues?minCapacity=100&maxCapacity=500');

      (Venue.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Venue.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(capacityRequest);
      expect(response.status).toBe(200);
    });

    it('should filter venues by price range', async () => {
      const priceRequest = createMockRequest('http://localhost:3000/api/venues?minPrice=50000&maxPrice=200000');

      (Venue.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Venue.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(priceRequest);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/venues', () => {
    it('should create a new venue (admin only)', async () => {
      const venueData = {
        name: 'New Wedding Venue',
        description: 'Beautiful wedding venue with garden', // At least 10 chars
        location: {
          address: '123 Venue Street', // At least 5 chars
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
        amenities: ['Parking', 'Air Conditioning', 'Garden'],
        owner: generateTestId(), // Required field
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(venueData);
      
      // Mock Venue constructor and save (route uses new Venue() and save())
      const mockVenueInstance = {
        _id: generateTestId(),
        ...venueData,
        isActive: true,
        isAvailable: true,
        rating: { average: 0, count: 0 },
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ ...venueData, _id: 'venue123' }),
      };
      
      // Mock Venue as a constructor
      (Venue as unknown as jest.Mock).mockImplementation(() => mockVenueInstance);

      const response = await POST(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: 'New Venue',
        // Missing required fields
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);

      const response = await POST(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });
  });

  describe('GET /api/venues/search', () => {
    it('should search venues by query', async () => {
      const searchRequest = createMockRequest('http://localhost:3000/api/venues/search?search=garden');

      const mockVenues = [
        {
          _id: generateTestId(),
          name: 'Garden Wedding Hall',
          description: 'Beautiful garden venue',
        },
      ];

      (Venue.find as jest.Mock).mockReturnValue(createChainableQuery(mockVenues));
      (Venue.countDocuments as jest.Mock).mockResolvedValue(1);

      const response = await searchHandler(searchRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe('GET /api/venues/availability', () => {
    it('should check venue availability for date', async () => {
      const venueId = generateTestId();
      const availabilityRequest = createMockRequest(`http://localhost:3000/api/venues/availability?venueId=${venueId}&date=2024-12-25`);

      (Venue.findById as jest.Mock).mockResolvedValue({
        _id: venueId,
        name: 'Test Venue',
        isActive: true,
      });

      (Booking.find as jest.Mock).mockReturnValue(createChainableQuery([]));

      const response = await availabilityHandler(availabilityRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.isAvailable).toBe(true);
      expect(json.venueId).toBeDefined();
      expect(json.date).toBeDefined();
    });

    it('should detect conflicting bookings', async () => {
      const venueId = generateTestId();
      const availabilityRequest = createMockRequest(`http://localhost:3000/api/venues/availability?venueId=${venueId}&date=2024-12-25`);

      (Venue.findById as jest.Mock).mockResolvedValue({
        _id: venueId,
        name: 'Test Venue',
        isActive: true,
      });

      // Use createChainableQuery for Booking.find to ensure proper serialization
      const conflictingBooking = {
          _id: generateTestId(),
          venue: venueId,
        date: new Date('2024-12-25'),
          status: 'confirmed',
        startTime: '10:00',
        endTime: '12:00',
      };
      (Booking.find as jest.Mock).mockReturnValue(createChainableQuery([conflictingBooking]));

      const response = await availabilityHandler(availabilityRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.isAvailable).toBe(false);
      expect(json.conflictingBookings).toBeDefined();
      expect(Array.isArray(json.conflictingBookings)).toBe(true);
    });
  });
});

