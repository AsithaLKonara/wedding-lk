import {
  userRegistrationSchema,
  userLoginSchema,
  vendorRegistrationSchema,
  venueCreateSchema,
  bookingCreateSchema,
  reviewCreateSchema,
  paymentCreateSchema,
  searchSchema,
  validateSchema,
} from '@/lib/validations/schemas'

describe('Validation Schemas', () => {
  describe('userRegistrationSchema', () => {
    it('should validate correct user registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567890',
        location: 'New York',
      }

      const result = userRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.role).toBe('user')
      }
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Invalid email')
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject invalid role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'invalid-role',
      }

      const result = userRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('userLoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = userLoginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: '',
      }

      const result = userLoginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('vendorRegistrationSchema', () => {
    it('should validate correct vendor registration data', () => {
      const validData = {
        businessName: 'Wedding Planners Inc',
        email: 'info@weddingplanners.com',
        password: 'password123',
        phone: '+1234567890',
        location: 'Colombo',
        category: 'venue',
        description: 'Professional wedding planning services',
        website: 'https://weddingplanners.com',
        socialMedia: {
          facebook: 'https://facebook.com/weddingplanners',
          instagram: 'https://instagram.com/weddingplanners',
        },
      }

      const result = vendorRegistrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid category', () => {
      const invalidData = {
        businessName: 'Wedding Planners Inc',
        email: 'info@weddingplanners.com',
        password: 'password123',
        phone: '+1234567890',
        location: 'Colombo',
        category: 'invalid-category',
        description: 'Professional wedding planning services',
      }

      const result = vendorRegistrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('venueCreateSchema', () => {
    it('should validate correct venue data', () => {
      const validData = {
        name: 'Grand Ballroom',
        description: 'Elegant ballroom for weddings',
        location: 'Colombo',
        address: '123 Main Street, Colombo 01',
        capacity: 200,
        pricePerHour: 50000,
        amenities: ['parking', 'catering', 'sound-system'],
        images: ['https://example.com/image1.jpg'],
        contactInfo: {
          phone: '+1234567890',
          email: 'info@grandballroom.com',
        },
      }

      const result = venueCreateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative capacity', () => {
      const invalidData = {
        name: 'Grand Ballroom',
        description: 'Elegant ballroom for weddings',
        location: 'Colombo',
        address: '123 Main Street, Colombo 01',
        capacity: -1,
        pricePerHour: 50000,
        contactInfo: {
          phone: '+1234567890',
          email: 'info@grandballroom.com',
        },
      }

      const result = venueCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('bookingCreateSchema', () => {
    it('should validate correct booking data', () => {
      const validData = {
        venueId: 'venue-id-123',
        vendorId: 'vendor-id-123',
        eventDate: '2024-12-25T10:00:00Z',
        startTime: '10:00',
        endTime: '18:00',
        guestCount: 150,
        totalAmount: 500000,
        specialRequests: 'Vegetarian menu required',
        contactInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
      }

      const result = bookingCreateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid time format', () => {
      const invalidData = {
        venueId: 'venue-id-123',
        vendorId: 'vendor-id-123',
        eventDate: '2024-12-25T10:00:00Z',
        startTime: '25:00', // Invalid time
        endTime: '18:00',
        guestCount: 150,
        totalAmount: 500000,
        contactInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
      }

      const result = bookingCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('reviewCreateSchema', () => {
    it('should validate correct review data', () => {
      const validData = {
        bookingId: 'booking-id-123',
        rating: 5,
        comment: 'Excellent service and beautiful venue!',
        photos: ['https://example.com/photo1.jpg'],
      }

      const result = reviewCreateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject rating outside 1-5 range', () => {
      const invalidData = {
        bookingId: 'booking-id-123',
        rating: 6, // Invalid rating
        comment: 'Excellent service and beautiful venue!',
      }

      const result = reviewCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('paymentCreateSchema', () => {
    it('should validate correct payment data', () => {
      const validData = {
        bookingId: 'booking-id-123',
        amount: 500000,
        currency: 'LKR',
        paymentMethod: 'stripe',
        description: 'Wedding venue booking payment',
      }

      const result = paymentCreateSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative amount', () => {
      const invalidData = {
        bookingId: 'booking-id-123',
        amount: -100, // Invalid amount
        currency: 'LKR',
        paymentMethod: 'stripe',
      }

      const result = paymentCreateSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('searchSchema', () => {
    it('should validate correct search data', () => {
      const validData = {
        query: 'wedding venue',
        category: 'venue',
        location: 'Colombo',
        minPrice: 10000,
        maxPrice: 100000,
        rating: 4,
        availability: '2024-12-25T10:00:00Z',
        sortBy: 'price',
        page: 1,
        limit: 10,
      }

      const result = searchSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should use default values for optional fields', () => {
      const minimalData = {
        query: 'wedding venue',
      }

      const result = searchSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.category).toBe('all')
        expect(result.data.sortBy).toBe('relevance')
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(10)
      }
    })
  })

  describe('validateSchema helper', () => {
    it('should return success for valid data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const result = validateSchema(userRegistrationSchema, validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
      }
    })

    it('should return errors for invalid data', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: '123',
      }

      const result = validateSchema(userRegistrationSchema, invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toHaveLength(2) // Email and password errors
        expect(result.errors[0]).toContain('Invalid email')
        expect(result.errors[1]).toContain('at least 8 characters')
      }
    })
  })
})


