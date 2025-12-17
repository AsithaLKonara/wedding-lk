import mongoose from 'mongoose';
import { Payment, IPayment } from '@/lib/models/Payment';
import { setupMockDB, cleanupMockDB, mockObjectId } from '@/tests/helpers/mock-db';

// Use a simple string ID generator for tests
const generateTestId = () => mockObjectId().toString();

describe('Payment Model', () => {
  let mockDB: ReturnType<typeof setupMockDB>;

  beforeAll(() => {
    mockDB = setupMockDB();
  });

  afterAll(() => {
    mockDB.restore();
    cleanupMockDB();
  });
  describe('Payment Schema Validation', () => {
    it('should create a payment with valid data', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'pending' as const,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.user).toBeDefined();
      expect(payment.amount).toBe(150000);
      expect(payment.currency).toBe('LKR');
      expect(payment.status).toBe('pending');
      expect(payment.type).toBe('booking');
    });

    it('should require user field', () => {
      const paymentData = {
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'pending' as const,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.user).toBeDefined();
    });

    it('should require amount field', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        currency: 'LKR',
        status: 'pending' as const,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.amount).toBeDefined();
    });

    it('should require paymentMethod field', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'pending' as const,
        type: 'booking' as const,
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.paymentMethod).toBeDefined();
    });

    it('should validate amount minimum', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: -100, // Invalid: negative amount
        currency: 'LKR',
        status: 'pending' as const,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.amount).toBeDefined();
    });

    it('should set default status to pending', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.status).toBe('pending');
    });

    it('should set default currency to LKR', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.currency).toBe('LKR');
    });

    it('should set default type to booking', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.type).toBe('booking');
    });

    it('should validate status enum', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'invalid_status' as any,
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.status).toBeDefined();
    });

    it('should validate type enum', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'pending' as const,
        type: 'invalid_type' as any,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      const error = payment.validateSync();
      expect(error?.errors.type).toBeDefined();
    });
  });

  describe('Payment Types', () => {
    it('should allow booking payment type', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.type).toBe('booking');
    });

    it('should allow ads_payment type', () => {
      const paymentData = {
        user: generateTestId(),
        amount: 5000,
        currency: 'LKR',
        type: 'ads_payment' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.type).toBe('ads_payment');
    });

    it('should allow subscription type', () => {
      const paymentData = {
        user: generateTestId(),
        amount: 10000,
        currency: 'LKR',
        type: 'subscription' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.type).toBe('subscription');
    });
  });

  describe('Stripe Integration', () => {
    it('should store Stripe payment intent ID', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        stripePaymentIntentId: 'pi_123456789',
      };

      const payment = new Payment(paymentData);
      expect(payment.stripePaymentIntentId).toBe('pi_123456789');
    });

    it('should store Stripe customer ID', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        stripeCustomerId: 'cus_123456789',
      };

      const payment = new Payment(paymentData);
      expect(payment.stripeCustomerId).toBe('cus_123456789');
    });

    it('should store Stripe subscription ID', () => {
      const paymentData = {
        user: generateTestId(),
        amount: 10000,
        currency: 'LKR',
        type: 'subscription' as const,
        paymentMethod: 'card',
        stripeSubscriptionId: 'sub_123456789',
      };

      const payment = new Payment(paymentData);
      expect(payment.stripeSubscriptionId).toBe('sub_123456789');
    });
  });

  describe('Transaction ID', () => {
    it('should store transaction ID', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        transactionId: 'tx_123456789',
      };

      const payment = new Payment(paymentData);
      expect(payment.transactionId).toBe('tx_123456789');
    });
  });

  describe('Gateway Response', () => {
    it('should store gateway response metadata', () => {
      const gatewayResponse = {
        id: 'pi_123456789',
        status: 'succeeded',
        amount: 150000,
        currency: 'lkr',
      };

      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        gatewayResponse: gatewayResponse,
      };

      const payment = new Payment(paymentData);
      expect(payment.gatewayResponse).toEqual(gatewayResponse);
    });
  });

  describe('Metadata', () => {
    it('should store custom metadata', () => {
      const metadata = {
        bookingId: 'BK123456',
        userId: 'user123',
        vendorId: 'vendor456',
      };

      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        metadata: metadata,
      };

      const payment = new Payment(paymentData);
      expect(payment.metadata).toEqual(metadata);
    });
  });

  describe('Vendor and Venue References', () => {
    it('should allow vendor reference', () => {
      const paymentData = {
        user: generateTestId(),
        vendor: generateTestId(),
        amount: 75000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.vendor).toBeDefined();
    });

    it('should allow venue reference', () => {
      const paymentData = {
        user: generateTestId(),
        venue: generateTestId(),
        amount: 100000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
      };

      const payment = new Payment(paymentData);
      expect(payment.venue).toBeDefined();
    });
  });

  describe('Completed At Timestamp', () => {
    it('should store completion timestamp', () => {
      const completedAt = new Date();
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        status: 'completed' as const,
        type: 'booking' as const,
        paymentMethod: 'card',
        completedAt: completedAt,
      };

      const payment = new Payment(paymentData);
      expect(payment.completedAt).toEqual(completedAt);
    });
  });

  describe('Description', () => {
    it('should allow adding payment description', () => {
      const paymentData = {
        user: generateTestId(),
        booking: generateTestId(),
        amount: 150000,
        currency: 'LKR',
        type: 'booking' as const,
        paymentMethod: 'card',
        description: 'Wedding venue booking payment',
      };

      const payment = new Payment(paymentData);
      expect(payment.description).toBe('Wedding venue booking payment');
    });
  });
});

