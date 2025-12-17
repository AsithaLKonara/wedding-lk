import { z } from 'zod';
import {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  vendorRegistrationSchema,
  vendorUpdateSchema,
  venueCreateSchema,
  venueUpdateSchema,
  bookingCreateSchema,
  bookingUpdateSchema,
} from '../../lib/validations/schemas';

describe('Validation Schemas', () => {
  describe('User Registration Schema', () => {
    it('should validate valid user registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'user',
        phone: '+94771234567',
      };

      const result = userRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!',
        role: 'user',
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('email');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Short1!',
        role: 'user',
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('password');
      }
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'user',
      };

      const result = userRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default role to user', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      const result = userRegistrationSchema.parse(data);
      expect(result.role).toBe('user');
    });
  });

  describe('User Login Schema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      const result = userLoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      const result = userLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: '',
      };

      const result = userLoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('User Update Schema', () => {
    it('should validate partial update data', () => {
      const validData = {
        name: 'John Updated',
        bio: 'Updated bio',
      };

      const result = userUpdateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject bio longer than 500 characters', () => {
      const invalidData = {
        bio: 'a'.repeat(501),
      };

      const result = userUpdateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Vendor Registration Schema', () => {
    it('should validate valid vendor registration data', () => {
      const validData = {
        businessName: 'Wedding Photography Co',
        email: 'vendor@example.com',
        password: 'SecurePass123!',
        phone: '+94771234567',
        location: 'Colombo',
        category: 'photography',
        description: 'Professional wedding photography services with 10+ years experience',
      };

      const result = vendorRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short description', () => {
      const invalidData = {
        businessName: 'Wedding Photography Co',
        email: 'vendor@example.com',
        password: 'SecurePass123!',
        phone: '+94771234567',
        location: 'Colombo',
        category: 'photography',
        description: 'Short',
      };

      const result = vendorRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate category enum', () => {
      const invalidData = {
        businessName: 'Wedding Photography Co',
        email: 'vendor@example.com',
        password: 'SecurePass123!',
        phone: '+94771234567',
        location: 'Colombo',
        category: 'invalid_category',
        description: 'Professional wedding photography services',
      };

      const result = vendorRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Venue Create Schema', () => {
    it('should validate valid venue data', () => {
      const validData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue with garden and indoor hall',
        location: 'Colombo',
        address: '456 Wedding Road, Colombo',
        capacity: 500,
        pricePerHour: 100000,
        contactInfo: {
          phone: '+94771234567',
          email: 'venue@example.com',
        },
      };

      const result = venueCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require minimum capacity', () => {
      const invalidData = {
        name: 'Grand Wedding Hall',
        description: 'Beautiful wedding venue',
        location: {
          address: '456 Wedding Road',
          city: 'Colombo',
          province: 'Western Province',
        },
        capacity: {
          max: 500,
        },
        pricing: {
          basePrice: 100000,
        },
      };

      const result = venueCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Booking Create Schema', () => {
    it('should validate valid booking data', () => {
      const validData = {
        venueId: 'venue123',
        vendorId: 'vendor123',
        eventDate: new Date('2024-12-25').toISOString(),
        startTime: '18:00',
        endTime: '23:00',
        guestCount: 100,
        totalAmount: 150000,
        contactInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+94771234567',
        },
      };

      const result = bookingCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require eventDate', () => {
      const invalidData = {
        eventTime: '18:00',
        guestCount: 100,
      };

      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate guestCount minimum', () => {
      const invalidData = {
        eventDate: new Date('2024-12-25').toISOString(),
        guestCount: 0,
      };

      const result = bookingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
