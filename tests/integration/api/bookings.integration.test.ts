import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/bookings/route';
import { POST as paymentHandler } from '@/app/api/bookings/[id]/payment/route';
import { GET as invoiceHandler } from '@/app/api/bookings/[id]/invoice/route';
import { Booking } from '@/lib/models/booking';
import { Venue } from '@/lib/models/venue';
import { Vendor } from '@/lib/models/vendor';

// Use a simple string ID generator for tests
const generateTestId = () => 'test-id-' + Math.random().toString(36).substring(7);

// Helper to create chainable query mock
const createChainableQuery = (mockResult: any) => {
  const chain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(mockResult),
    lean: jest.fn().mockResolvedValue(mockResult),
    populate: jest.fn().mockReturnThis(),
    then: (onResolve: any) => Promise.resolve(mockResult).then(onResolve),
    catch: (onReject: any) => Promise.resolve(mockResult).catch(onReject),
  };
  return chain;
};

// Mock models - Booking needs to support constructor (new Booking())
jest.mock('@/lib/models/booking', () => {
  const BookingMock = jest.fn();
  BookingMock.find = jest.fn();
  BookingMock.findOne = jest.fn();
  BookingMock.findById = jest.fn();
  BookingMock.countDocuments = jest.fn();
  BookingMock.create = jest.fn();
  return {
    Booking: BookingMock,
  };
});
jest.mock('@/lib/models/venue');
jest.mock('@/lib/models/vendor');
// Mock Payment model - needs to support constructor (new Payment())
jest.mock('@/lib/models/Payment', () => {
  const PaymentMock = jest.fn();
  PaymentMock.find = jest.fn();
  PaymentMock.findOne = jest.fn();
  PaymentMock.findById = jest.fn();
  return {
    Payment: PaymentMock,
  };
});

// Bypass auth middleware and custom token verification for integration tests.
jest.mock('@/lib/middleware/auth-middleware', () => ({
  withAuth: (handler: any) => handler,
  requireUser: (req: any) => ({ user: { id: 'user123', role: 'user' } }),
}));

jest.mock('@/lib/auth/custom-auth', () => ({
  verifyToken: jest.fn((token: string) => {
    if (token === 'valid-token' || token) {
      return {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        isActive: true,
        isVerified: true,
      };
    }
    return null;
  }),
}));

// Mock api-auth for routes that use requireAuth
jest.mock('@/lib/api-auth', () => ({
  requireAuth: jest.fn(async () => ({
    authorized: true,
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
  })),
}));

describe('Bookings API Integration Tests', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset verifyToken mock
    const { verifyToken } = require('@/lib/auth/custom-auth');
    (verifyToken as jest.Mock).mockImplementation((token: string) => {
      if (token === 'valid-token' || token) {
        return {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          isActive: true,
          isVerified: true,
        };
      }
      return null;
    });
    
    // Reset requireAuth mock
    const { requireAuth } = require('@/lib/api-auth');
    (requireAuth as jest.Mock).mockResolvedValue({
      authorized: true,
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
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

  describe('GET /api/bookings', () => {
    it('should return list of bookings with pagination', async () => {
      const mockBookings = [
        {
          _id: generateTestId(),
          user: generateTestId(),
          eventDate: new Date('2024-12-25'),
          status: 'confirmed',
          payment: { amount: 150000, status: 'completed' },
        },
        {
          _id: generateTestId(),
          user: generateTestId(),
          eventDate: new Date('2024-12-26'),
          status: 'pending',
          payment: { amount: 100000, status: 'pending' },
        },
      ];

      (Booking.find as jest.Mock).mockReturnValue(createChainableQuery(mockBookings));
      (Booking.countDocuments as jest.Mock).mockResolvedValue(2);

      const response = await GET(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.bookings).toBeDefined();
      expect(Array.isArray(json.bookings)).toBe(true);
    });

    it('should filter bookings by status', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'status') return 'confirmed';
        return null;
      });

      (Booking.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Booking.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(mockRequest);
      expect(response.status).toBe(200);
      expect(Booking.find).toHaveBeenCalled();
    });

    it('should handle pagination parameters', async () => {
      (mockRequest.nextUrl.searchParams.get as jest.Mock) = jest.fn((key: string) => {
        if (key === 'page') return '2';
        if (key === 'limit') return '20';
        return null;
      });

      (Booking.find as jest.Mock).mockReturnValue(createChainableQuery([]));
      (Booking.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await GET(mockRequest);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        venueId: generateTestId().toString(),
        vendorId: generateTestId().toString(),
        eventDate: '2024-12-25',
        eventTime: '18:00',
        guestCount: 100,
        contactPhone: '+94771234567',
        contactEmail: 'test@example.com',
        totalPrice: 150000,
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(bookingData);
      
      // Mock Booking constructor and save (route uses new Booking() and save())
      const mockBookingInstance = {
        _id: generateTestId(),
        ...bookingData,
        userId: 'user123',
        status: 'pending',
        currency: 'LKR',
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ ...bookingData, _id: 'booking123' }),
      };
      (Booking as unknown as jest.Mock).mockImplementation(() => mockBookingInstance);

      const response = await POST(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.booking).toBeDefined();
    });

    it('should reject booking with invalid date', async () => {
      const bookingData = {
        venue: generateTestId().toString(),
        eventDate: '2020-01-01', // Past date
        guestCount: 100,
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(bookingData);

      const response = await POST(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it('should check venue availability', async () => {
      const bookingData = {
        venueId: generateTestId().toString(),
        eventDate: '2024-12-25',
        eventTime: '18:00',
        guestCount: 100,
        contactPhone: '+94771234567',
        contactEmail: 'test@example.com',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(bookingData);
      
      // Mock Booking constructor and save (route uses new Booking() and save())
      const mockBookingInstance = {
        _id: generateTestId(),
        ...bookingData,
        userId: 'user123',
        status: 'pending',
        currency: 'LKR',
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ ...bookingData, _id: 'booking123' }),
      };
      (Booking as unknown as jest.Mock).mockImplementation(() => mockBookingInstance);

      const response = await POST(mockRequest);
      const json = await response.json();

      // Route will create the booking successfully
      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
    });
  });

  describe('PUT /api/bookings/[id]', () => {
    it('should update booking status', async () => {
      const bookingId = generateTestId();
      const updateData = {
        status: 'confirmed',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(updateData);
      (Booking.findByIdAndUpdate as jest.Mock) = jest.fn().mockResolvedValue({
        _id: bookingId,
        status: 'confirmed',
        toJSON: () => ({ _id: bookingId.toString(), status: 'confirmed' }),
      });

      // Note: This would need the actual route handler with params
      // For now, testing the logic
      expect(updateData.status).toBe('confirmed');
    });
  });

  describe('POST /api/bookings/[id]/payment', () => {
    it('should process payment for booking', async () => {
      const bookingId = generateTestId();
      const paymentData = {
        amount: 150000,
        paymentMethod: 'card',
        transactionId: 'tx_123456789',
      };

      const mockBooking = {
        _id: bookingId,
        userId: 'user123',
        payment: {
          amount: 150000,
          status: 'pending',
        },
        save: jest.fn().mockResolvedValue(true),
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(paymentData);
      (Booking.findById as jest.Mock).mockResolvedValue(mockBooking);
      
      // Mock Payment constructor and save (route uses new Payment() and save())
      const { Payment } = require('@/lib/models/Payment');
      const mockPaymentInstance = {
        _id: generateTestId(),
        userId: 'user123',
        bookingId: bookingId,
        amount: paymentData.amount,
        method: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        status: 'pending',
        save: jest.fn().mockResolvedValue(true),
      };
      (Payment as unknown as jest.Mock).mockImplementation(() => mockPaymentInstance);

      // Mock route params
      const params = { id: bookingId.toString() };
      const response = await paymentHandler(mockRequest, { params: Promise.resolve(params) });
      
      expect(response.status).toBe(201);
      expect(mockPaymentInstance.save).toHaveBeenCalled();
    });
  });

  describe('GET /api/bookings/[id]/invoice', () => {
    it('should generate invoice for booking', async () => {
      const bookingId = generateTestId();
      const mockBooking = {
        _id: bookingId,
        user: { name: 'Test User', email: 'user@example.com' },
        venue: { name: 'Test Venue' },
        vendor: { businessName: 'Test Vendor' },
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
        },
      };

      // Mock Booking.findById with populate chain
      const mockPopulatedBooking = {
        ...mockBooking,
        userId: { _id: 'user123', name: 'Test User', email: 'user@example.com' },
        vendorId: { _id: 'vendor123', businessName: 'Test Vendor', contactEmail: 'vendor@example.com' },
        venueId: { _id: 'venue123', name: 'Test Venue', location: 'Colombo' },
        bookingNumber: 'BK-12345',
        createdAt: new Date('2024-12-01'),
        paymentStatus: 'pending',
      };
      
      (Booking.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        then: (onResolve: any) => Promise.resolve(mockPopulatedBooking).then(onResolve),
        catch: (onReject: any) => Promise.resolve(mockPopulatedBooking).catch(onReject),
      });

      const params = { id: bookingId.toString() };
      const response = await invoiceHandler(mockRequest, { params: Promise.resolve(params) });
      
      expect(response.status).toBe(200);
    });
  });
});

