import { validateBookingDate, validateEmail, validatePhone, validatePassword } from '../../lib/validations/schemas';

describe('Validation Functions', () => {
  describe('validateBookingDate', () => {
    test('rejects past dates', () => {
      const past = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
      expect(() => validateBookingDate(past)).toThrow(/past date/);
    });

    test('accepts future dates', () => {
      const future = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
      expect(() => validateBookingDate(future)).not.toThrow();
    });

    test('rejects dates more than 2 years in future', () => {
      const tooFar = new Date(Date.now() + 3 * 365 * 24 * 3600 * 1000).toISOString();
      expect(() => validateBookingDate(tooFar)).toThrow(/too far in future/);
    });
  });

  describe('validateEmail', () => {
    test('accepts valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];
      
      validEmails.forEach(email => {
        expect(() => validateEmail(email)).not.toThrow();
      });
    });

    test('rejects invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(() => validateEmail(email)).toThrow(/invalid email/i);
      });
    });
  });

  describe('validatePhone', () => {
    test('accepts valid Sri Lankan phone numbers', () => {
      const validPhones = [
        '+94771234567',
        '0771234567',
        '+94112345678',
        '0112345678'
      ];
      
      validPhones.forEach(phone => {
        expect(() => validatePhone(phone)).not.toThrow();
      });
    });

    test('rejects invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        '+1234567890',
        'invalid',
        ''
      ];
      
      invalidPhones.forEach(phone => {
        expect(() => validatePhone(phone)).toThrow(/invalid phone/i);
      });
    });
  });

  describe('validatePassword', () => {
    test('accepts strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MySecure@Pass1',
        'WeddingLK2024#'
      ];
      
      strongPasswords.forEach(password => {
        expect(() => validatePassword(password)).not.toThrow();
      });
    });

    test('rejects weak passwords', () => {
      const weakPasswords = [
        '123',
        'password',
        'Password',
        'Password123',
        'P@ss'
      ];
      
      weakPasswords.forEach(password => {
        expect(() => validatePassword(password)).toThrow(/password does not meet requirements/i);
      });
    });
  });
});
