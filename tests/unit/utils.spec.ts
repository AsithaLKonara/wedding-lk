import {
  formatCurrency,
  formatLKR,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  daysUntil,
  getRelativeTime,
  getRoleDisplayName,
  getRoleTheme,
  generateBookingId,
  calculateTotalPrice,
  safeToLocaleString,
} from '../../lib/utils/format';

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

    test('handles null and undefined', () => {
      expect(formatCurrency(null, 'LKR')).toBe('LKR 0.00');
      expect(formatCurrency(undefined, 'LKR')).toBe('LKR 0.00');
      expect(formatCurrency(null, 'USD')).toBe('$0.00');
    });

    test('handles NaN values', () => {
      expect(formatCurrency(NaN, 'LKR')).toBe('LKR 0.00');
    });
  });

  describe('formatLKR', () => {
    test('formats LKR with locale string', () => {
      expect(formatLKR(50000)).toBe('LKR 50,000');
      expect(formatLKR(1000)).toBe('LKR 1,000');
    });

    test('handles null and undefined', () => {
      expect(formatLKR(null)).toBe('LKR 0');
      expect(formatLKR(undefined)).toBe('LKR 0');
    });
  });

  describe('formatDate', () => {
    test('formats dates correctly', () => {
      const date = new Date('2024-06-15T10:30:00Z');
      expect(formatDate(date, 'en-US')).toContain('June');
      expect(formatDate(date, 'si-LK')).toBeDefined();
    });

    test('handles different date formats', () => {
      const date = new Date('2024-12-25T00:00:00Z');
      expect(formatDate(date, 'short')).toBeDefined();
      expect(formatDate(date, 'long')).toContain('December');
    });

    test('handles null and undefined', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
    });

    test('handles invalid dates', () => {
      const invalidDate = new Date('invalid');
      expect(formatDate(invalidDate)).toBe('Invalid Date');
    });

    test('handles string dates', () => {
      const dateString = '2024-12-25';
      expect(formatDate(dateString)).toBeDefined();
    });
  });

  describe('formatDateTime', () => {
    test('formats date and time correctly', () => {
      const date = new Date('2024-12-25T18:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toBeDefined();
      expect(formatted).not.toBe('N/A');
    });

    test('handles null and undefined', () => {
      expect(formatDateTime(null)).toBe('N/A');
      expect(formatDateTime(undefined)).toBe('N/A');
    });
  });

  describe('formatNumber', () => {
    test('formats large numbers with suffixes', () => {
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1000000000)).toBe('1.0B');
    });

    test('handles small numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(50)).toBe('50');
    });

    test('handles null and undefined', () => {
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    test('calculates percentage correctly', () => {
      expect(formatPercentage(50, 100)).toBe('50%');
      expect(formatPercentage(25, 100)).toBe('25%');
      expect(formatPercentage(75, 100)).toBe('75%');
    });

    test('handles zero total', () => {
      expect(formatPercentage(50, 0)).toBe('0%');
    });

    test('rounds percentage', () => {
      expect(formatPercentage(33, 100)).toBe('33%');
      expect(formatPercentage(66.6, 100)).toBe('67%');
    });
  });

  describe('daysUntil', () => {
    test('calculates days until future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const days = daysUntil(futureDate);
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(7);
    });

    test('returns 0 for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      expect(daysUntil(pastDate)).toBeLessThanOrEqual(0);
    });

    test('handles null and undefined', () => {
      expect(daysUntil(null)).toBe(0);
      expect(daysUntil(undefined)).toBe(0);
    });
  });

  describe('getRelativeTime', () => {
    test('returns "Just now" for recent times', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('Just now');
    });

    test('returns minutes ago', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 30);
      expect(getRelativeTime(date)).toContain('m ago');
    });

    test('returns hours ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 5);
      expect(getRelativeTime(date)).toContain('h ago');
    });

    test('returns days ago', () => {
      const date = new Date();
      date.setDate(date.getDate() - 3);
      expect(getRelativeTime(date)).toContain('d ago');
    });

    test('handles null and undefined', () => {
      expect(getRelativeTime(null)).toBe('N/A');
      expect(getRelativeTime(undefined)).toBe('N/A');
    });
  });

  describe('getRoleDisplayName', () => {
    test('returns correct display names', () => {
      expect(getRoleDisplayName('admin')).toBe('Administrator');
      expect(getRoleDisplayName('vendor')).toBe('Vendor');
      expect(getRoleDisplayName('wedding_planner')).toBe('Wedding Planner');
      expect(getRoleDisplayName('user')).toBe('User');
    });

    test('returns default for unknown roles', () => {
      expect(getRoleDisplayName('unknown')).toBe('User');
    });
  });

  describe('getRoleTheme', () => {
    test('returns theme for admin', () => {
      const theme = getRoleTheme('admin');
      expect(theme.primary).toBe('red');
      expect(theme.primaryHex).toBe('#dc2626');
    });

    test('returns theme for vendor', () => {
      const theme = getRoleTheme('vendor');
      expect(theme.primary).toBe('blue');
      expect(theme.primaryHex).toBe('#2563eb');
    });

    test('returns default theme for unknown roles', () => {
      const theme = getRoleTheme('unknown');
      expect(theme.primary).toBe('gray');
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
      expect(total).toBe(30000 + (150 * 200));
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
      expect(total).toBe(40000 + 15000 + 10000);
    });

    test('handles service quantities', () => {
      const total = calculateTotalPrice({
        basePrice: 40000,
        guestCount: 100,
        pricePerGuest: 0,
        additionalServices: [
          { name: 'DJ', price: 15000, quantity: 2 }
        ]
      });
      expect(total).toBe(40000 + (15000 * 2));
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

  describe('safeToLocaleString', () => {
    test('formats numbers', () => {
      expect(safeToLocaleString(1000)).toBe('1,000');
      expect(safeToLocaleString(50000)).toBe('50,000');
    });

    test('formats dates', () => {
      const date = new Date('2024-12-25');
      expect(safeToLocaleString(date)).toBeDefined();
    });

    test('handles null and undefined', () => {
      expect(safeToLocaleString(null)).toBe('N/A');
      expect(safeToLocaleString(undefined)).toBe('N/A');
      expect(safeToLocaleString(null, 'Custom')).toBe('Custom');
    });

    test('handles invalid values', () => {
      expect(safeToLocaleString('invalid')).toBe('N/A');
      expect(safeToLocaleString({})).toBe('N/A');
    });
  });
});
