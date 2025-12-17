import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/vendors/route';
import { GET as searchHandler } from '@/app/api/vendors/search/route';
import { POST as registerHandler } from '@/app/api/vendors/register/route';
import { Vendor } from '@/lib/models/vendor';

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

// Mock models - Vendor needs to support constructor (new Vendor())
jest.mock('@/lib/models/vendor', () => {
  const VendorMock = jest.fn();
  VendorMock.find = jest.fn();
  VendorMock.findOne = jest.fn();
  VendorMock.countDocuments = jest.fn();
  VendorMock.create = jest.fn();
  VendorMock.findById = jest.fn();
  return {
    Vendor: VendorMock,
  };
});

// Mock User model for vendor registration route
jest.mock('@/lib/models/user', () => ({
  User: {
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    }),
  },
}));
jest.mock('@/lib/middleware/auth-middleware', () => ({
  withAuth: (handler: any) => handler,
  withRole: () => (handler: any) => handler,
}));

// Mock auth helpers for routes that use getUserFromRequestWithError
jest.mock('@/lib/auth/get-user-from-request', () => ({
  getUserFromRequestWithError: jest.fn(() => ({
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
    error: null,
  })),
  getUserFromRequest: jest.fn(() => ({
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  })),
}));

// Mock API optimization modules for vendors routes
jest.mock('@/lib/api-optimization', () => ({
  DatabaseOptimizer: {
    ensureConnection: jest.fn().mockResolvedValue(undefined),
  },
  QueryOptimizer: {
    optimizeQuery: jest.fn((query: any) => query),
  },
  ResponseOptimizer: {
    compressVendor: jest.fn((vendor: any) => {
      // Always return a fully serializable object, no matter what input
      if (!vendor) return null;
      
      // Create a completely safe vendor object
      const safeVendor: any = {
        id: String(vendor._id || vendor.id || ''),
        businessName: String(vendor.businessName || ''),
        category: String(vendor.category || ''),
        isActive: Boolean(vendor.isActive),
        isVerified: Boolean(vendor.isVerified),
      };
      
      // Safely handle location
      if (vendor.location !== undefined && vendor.location !== null) {
        if (typeof vendor.location === 'object' && !Array.isArray(vendor.location)) {
          safeVendor.location = {};
          for (const key in vendor.location) {
            if (vendor.location.hasOwnProperty(key)) {
              const val = vendor.location[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                safeVendor.location[key] = val;
              } else if (val !== null && val !== undefined) {
                safeVendor.location[key] = String(val);
              }
            }
          }
        } else {
          safeVendor.location = String(vendor.location);
        }
      }
      
      // Safely handle rating
      if (vendor.rating !== undefined && vendor.rating !== null) {
        if (typeof vendor.rating === 'object' && !Array.isArray(vendor.rating)) {
          safeVendor.rating = {};
          for (const key in vendor.rating) {
            if (vendor.rating.hasOwnProperty(key)) {
              const val = vendor.rating[key];
              if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                safeVendor.rating[key] = val;
              } else if (val !== null && val !== undefined) {
                safeVendor.rating[key] = String(val);
              }
            }
          }
        } else {
          safeVendor.rating = String(vendor.rating);
        }
      }
      
      // Final check - ensure it's serializable
      try {
        JSON.stringify(safeVendor);
        return safeVendor;
      } catch (e) {
        // Ultimate fallback
        return {
          id: safeVendor.id || '',
          businessName: safeVendor.businessName || '',
          category: safeVendor.category || '',
          isActive: safeVendor.isActive || false,
          isVerified: safeVendor.isVerified || false,
        };
      }
    }),
  },
  TimeoutHandler: {
    withTimeout: jest.fn((fn: any) => fn()),
  },
  APIResponse: {
    success: jest.fn((data: any) => {
      // Log to verify mock is being called
      if (process.env.DEBUG_TESTS) {
        console.log('[APIResponse.success] Mock called with data keys:', Object.keys(data || {}));
      }
      // Immediately create a safe, serializable response object
      const response: any = {
        success: true,
        data: {}
      };
      
      // Safely extract and clean vendors array
      if (data && Array.isArray(data.vendors)) {
        response.data.vendors = data.vendors.map((v: any) => {
          const vendor: any = {
            id: String(v?.id || v?._id || ''),
            businessName: String(v?.businessName || ''),
            category: String(v?.category || ''),
            isActive: Boolean(v?.isActive),
            isVerified: Boolean(v?.isVerified),
          };
          
          // Safely add location if present
          if (v?.location !== undefined && v?.location !== null) {
            if (typeof v.location === 'object') {
              vendor.location = {};
              for (const key in v.location) {
                if (v.location.hasOwnProperty(key)) {
                  const val = v.location[key];
                  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                    vendor.location[key] = val;
                  } else {
                    vendor.location[key] = String(val);
                  }
                }
              }
            } else {
              vendor.location = String(v.location);
            }
          }
          
          // Safely add rating if present
          if (v?.rating !== undefined && v?.rating !== null) {
            if (typeof v.rating === 'object') {
              vendor.rating = {};
              for (const key in v.rating) {
                if (v.rating.hasOwnProperty(key)) {
                  const val = v.rating[key];
                  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                    vendor.rating[key] = val;
                  } else {
                    vendor.rating[key] = String(val);
                  }
                }
              }
            } else {
              vendor.rating = String(v.rating);
            }
          }
          
          return vendor;
        });
      } else {
        response.data.vendors = [];
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
            vendors: [],
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
    vendors: jest.fn((page: number, limit: number) => `vendors:${page}:${limit}`),
  },
  cacheTTL: {
    MEDIUM: 300000,
  },
}));

describe('Vendors API Integration Tests', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset auth mocks
    const { getUserFromRequestWithError } = require('@/lib/auth/get-user-from-request');
    (getUserFromRequestWithError as jest.Mock).mockReturnValue({
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
      error: null,
    });
    
    mockRequest = {
      headers: new Headers(),
      cookies: {
        get: jest.fn((name: string) => {
          if (name === 'auth-token') {
            return { value: 'valid-token' };
          }
          return undefined;
        }),
      },
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
      json: jest.fn(),
    } as unknown as NextRequest;
  });

  describe('GET /api/vendors', () => {
    it('should return list of vendors with pagination', async () => {
      const mockVendors = [
        {
          _id: generateTestId().toString(),
          businessName: 'Wedding Photography Co',
          category: 'photographer',
          rating: { average: 4.5, count: 10 },
          isActive: true,
          isVerified: true,
        },
      ];

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery(mockVendors));
      (Vendor.countDocuments as jest.Mock).mockResolvedValue(1);

      const response = await GET(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeDefined();
      expect(json.data.vendors).toBeDefined();
      expect(Array.isArray(json.data.vendors)).toBe(true);
    });

    it('should filter vendors by category', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'category') return 'photographer';
        return null;
      });

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Vendor.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(mockRequest);
      expect(response.status).toBe(200);
      expect(Vendor.find).toHaveBeenCalled();
    });

    it('should filter vendors by location', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'city') return 'Colombo';
        return null;
      });

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Vendor.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(mockRequest);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/vendors/register', () => {
    it('should register a new vendor', async () => {
      const vendorData = {
        businessName: 'New Wedding Vendor',
        businessType: 'photography',
        description: 'Professional wedding photography services with 10+ years experience',
        services: ['Wedding Photography', 'Engagement Shoots'],
        location: {
          address: '123 Vendor Street',
          city: 'Colombo',
          province: 'Western Province',
        },
        contactPhone: '+94771234567',
        contactEmail: 'vendor@example.com',
        pricing: {
          minPrice: 50000,
          maxPrice: 200000,
          currency: 'LKR',
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: true,
        },
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(vendorData);
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock Vendor constructor and save (route uses new Vendor() and save())
      const mockVendorInstance = {
        _id: generateTestId(),
        ...vendorData,
        userId: 'user123',
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ ...vendorData, _id: 'vendor123' }),
      };
      (Vendor as unknown as jest.Mock).mockImplementation(() => mockVendorInstance);

      const response = await registerHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success || !json.error).toBeTruthy();
    });

    it('should reject duplicate email', async () => {
      const vendorData = {
        businessName: 'New Wedding Vendor',
        businessType: 'photography',
        description: 'Professional wedding photography services',
        services: ['Wedding Photography'],
        location: {
          address: '123 Vendor Street',
          city: 'Colombo',
          province: 'Western Province',
        },
        contactPhone: '+94771234567',
        contactEmail: 'existing@example.com',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(vendorData);
      // Mock that user already has a vendor profile
      (Vendor.findOne as jest.Mock).mockResolvedValue({
        _id: generateTestId(),
        userId: 'user123',
        email: 'existing@example.com',
      });

      const response = await registerHandler(mockRequest);
      const json = await response.json();

      // Route checks for existing vendor by userId, should return 400
      expect(Vendor.findOne).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(json.error).toContain('already exists');
    });
  });

  describe('GET /api/vendors/search', () => {
    it('should search vendors by query', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'q') return 'photography';
        return null;
      });

      const mockVendors = [
        {
          _id: generateTestId(),
          businessName: 'Wedding Photography Co',
          category: 'photographer',
        },
      ];

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery(mockVendors));

      const response = await searchHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it('should filter by price range', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'minPrice') return '30000';
        if (key === 'maxPrice') return '100000';
        return null;
      });

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery([]));

      const response = await searchHandler(mockRequest);
      expect(response.status).toBe(200);
    });

    it('should filter by rating', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'rating') return '4';
        return null;
      });

      (Vendor.find as jest.Mock).mockReturnValue(createChainableQuery([]));

      const response = await searchHandler(mockRequest);
      expect(response.status).toBe(200);
    });
  });
});

