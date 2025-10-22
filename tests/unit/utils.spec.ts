import { formatCurrency, formatDate, generateBookingId, calculateTotalPrice } from '../../lib/utils/format';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats LKR currency correctly', () => {
      expect(formatCurrency(50000, 'LKR')).toBe('LKR 50,000.00');
      expect(formatCurrency(1000, 'LKR')).toBe('LKR 1,000.00');
      expect(formatCurrency(0, 'LKR')).toBe('LKR 0.00');
    });

    test('formats USD currency correctly', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00');
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
    });

    test('handles decimal values', () => {
      expect(formatCurrency(50000.50, 'LKR')).toBe('LKR 50,000.50');
    });
  });

  describe('formatDate', () => {
    test('formats dates correctly', () => {
      const date = new Date('2024-06-15T10:30:00Z');
      expect(formatDate(date, 'en-US')).toBe('June 15, 2024');
      expect(formatDate(date, 'si-LK')).toBe('2024 ජූනි 15');
    });

    test('handles different date formats', () => {
      const date = new Date('2024-12-25T00:00:00Z');
      expect(formatDate(date, 'short')).toBe('12/25/2024');
      expect(formatDate(date, 'long')).toBe('December 25, 2024');
    });
  });

  describe('generateBookingId', () => {
    test('generates unique booking IDs', () => {
      const id1 = generateBookingId();
      const id2 = generateBookingId();
      
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^BK\d{8}[A-Z0-9]{6}$/);
      expect(id2).toMatch(/^BK\d{8}[A-Z0-9]{6}$/);
    });

    test('includes date prefix', () => {
      const id = generateBookingId();
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      expect(id).toContain(today);
    });
  });

  describe('calculateTotalPrice', () => {
    test('calculates total price with base price only', () => {
      const total = calculateTotalPrice({
        basePrice: 50000,
        guestCount: 100,
        pricePerGuest: 0,
        additionalServices: []
      });
      expect(total).toBe(50000);
    });

    test('calculates total price with per-guest pricing', () => {
      const total = calculateTotalPrice({
        basePrice: 30000,
        guestCount: 150,
        pricePerGuest: 200,
        additionalServices: []
      });
      expect(total).toBe(30000 + (150 * 200)); // 30000 + 30000 = 60000
    });

    test('includes additional services', () => {
      const total = calculateTotalPrice({
        basePrice: 40000,
        guestCount: 100,
        pricePerGuest: 0,
        additionalServices: [
          { name: 'DJ', price: 15000 },
          { name: 'Decorations', price: 10000 }
        ]
      });
      expect(total).toBe(40000 + 15000 + 10000); // 65000
    });

    test('handles zero guest count', () => {
      const total = calculateTotalPrice({
        basePrice: 50000,
        guestCount: 0,
        pricePerGuest: 200,
        additionalServices: []
      });
      expect(total).toBe(50000);
    });
  });
});
