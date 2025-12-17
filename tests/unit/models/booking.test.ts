import mongoose from 'mongoose';
import { Booking, IBooking } from '@/lib/models/booking';
import { setupMockDB, cleanupMockDB, mockObjectId } from '@/tests/helpers/mock-db';

// Use a simple string ID generator for tests
const generateTestId = () => mockObjectId().toString();

describe('Booking Model', () => {
  let mockDB: ReturnType<typeof setupMockDB>;

  beforeAll(() => {
    mockDB = setupMockDB();
  });

  afterAll(() => {
    mockDB.restore();
    cleanupMockDB();
  });
  describe('Booking Schema Validation', () => {
    it('should create a booking with valid data', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        venue: generateTestId(),
        eventDate: new Date('2024-12-25'),
        eventTime: '18:00',
        guestCount: 100,
        status: 'pending' as const,
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.user).toBeDefined();
      expect(booking.eventDate).toBeInstanceOf(Date);
      expect(booking.guestCount).toBe(100);
      expect(booking.status).toBe('pending');
      expect(booking.payment.amount).toBe(150000);
    });

    it('should require user field', () => {
      const bookingData = {
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors.user).toBeDefined();
    });

    it('should require eventDate field', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors.eventDate).toBeDefined();
    });

    it('should require payment amount', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors['payment.amount']).toBeDefined();
    });

    it('should set default status to pending', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.status).toBe('pending');
    });

    it('should set default isActive to true', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.isActive).toBe(true);
    });

    it('should validate status enum', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        status: 'invalid_status' as any,
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors.status).toBeDefined();
    });

    it('should validate payment status enum', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'invalid_status' as any,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors['payment.status']).toBeDefined();
    });

    it('should validate payment method enum', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'invalid_method' as any,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors['payment.method']).toBeDefined();
    });

    it('should validate guestCount minimum', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        guestCount: 0, // Below minimum
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      const error = booking.validateSync();
      expect(error?.errors.guestCount).toBeDefined();
    });
  });

  describe('Service Information', () => {
    it('should add service information', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        service: {
          name: 'Wedding Photography',
          description: 'Full day coverage',
          price: 75000,
        },
        payment: {
          amount: 75000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.service?.name).toBe('Wedding Photography');
      expect(booking.service?.price).toBe(75000);
    });
  });

  describe('Status Transitions', () => {
    it('should allow status transitions', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        status: 'pending' as const,
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.status).toBe('pending');

      booking.status = 'confirmed';
      expect(booking.status).toBe('confirmed');

      booking.status = 'completed';
      expect(booking.status).toBe('completed');
    });
  });

  describe('Payment Information', () => {
    it('should set default payment currency to LKR', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.payment.currency).toBe('LKR');
    });

    it('should allow setting transaction ID', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'completed' as const,
          method: 'card' as const,
          transactionId: 'tx_123456789',
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.payment.transactionId).toBe('tx_123456789');
    });
  });

  describe('Planner Assignment', () => {
    it('should allow assigning a wedding planner', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        venue: generateTestId(),
        planner: generateTestId(),
        eventDate: new Date('2024-12-25'),
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.planner).toBeDefined();
    });
  });

  describe('Notes', () => {
    it('should allow adding notes', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        notes: 'Special dietary requirements for 10 guests',
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.notes).toBe('Special dietary requirements for 10 guests');
    });
  });

  describe('Duration', () => {
    it('should allow setting event duration', () => {
      const bookingData = {
        user: generateTestId(),
        vendor: generateTestId(),
        eventDate: new Date('2024-12-25'),
        eventTime: '18:00',
        duration: 6, // 6 hours
        payment: {
          amount: 150000,
          currency: 'LKR',
          status: 'pending' as const,
          method: 'bank_transfer' as const,
        },
      };

      const booking = new Booking(bookingData);
      expect(booking.duration).toBe(6);
      expect(booking.eventTime).toBe('18:00');
    });
  });
});

