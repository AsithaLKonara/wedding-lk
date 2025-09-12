import { NextRequest } from 'next/server';
import { z } from 'zod';

// Common validation schemas
export const commonSchemas = {
  id: z.string().min(1, 'ID is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  status: z.enum(['active', 'inactive', 'suspended', 'pending_verification']),
  role: z.enum(['user', 'vendor', 'wedding_planner', 'admin', 'maintainer']),
  currency: z.string().default('LKR'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
};

// User validation schemas
export const userSchemas = {
  create: z.object({
    email: commonSchemas.email,
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: commonSchemas.role,
    phone: commonSchemas.phone.optional(),
    location: z.object({
      country: z.string().min(2, 'Country is required'),
      state: z.string().min(2, 'State is required'),
      city: z.string().min(2, 'City is required'),
      zipCode: z.string().optional(),
      coordinates: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
      }).optional()
    })
  }),
  update: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: commonSchemas.phone.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    location: z.object({
      country: z.string().min(2, 'Country is required').optional(),
      state: z.string().min(2, 'State is required').optional(),
      city: z.string().min(2, 'City is required').optional(),
      zipCode: z.string().optional(),
      coordinates: z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
      }).optional()
    }).optional(),
    preferences: z.object({
      language: z.string().optional(),
      currency: z.string().optional(),
      timezone: z.string().optional(),
      notifications: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional()
      }).optional(),
      marketing: z.object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
        push: z.boolean().optional()
      }).optional()
    }).optional()
  })
};

// Vendor validation schemas
export const vendorSchemas = {
  create: z.object({
    businessName: z.string().min(2, 'Business name is required'),
    ownerName: z.string().min(2, 'Owner name is required'),
    email: commonSchemas.email,
    category: z.enum(['photographer', 'decorator', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.object({
      address: z.string().min(5, 'Address is required'),
      city: z.string().min(2, 'City is required'),
      province: z.string().min(2, 'Province is required'),
      serviceAreas: z.array(z.string()).optional()
    }),
    contact: z.object({
      phone: commonSchemas.phone,
      email: commonSchemas.email,
      website: z.string().url('Invalid website URL').optional(),
      socialMedia: z.object({
        facebook: z.string().url('Invalid Facebook URL').optional(),
        instagram: z.string().url('Invalid Instagram URL').optional(),
        youtube: z.string().url('Invalid YouTube URL').optional()
      }).optional()
    }),
    services: z.array(z.object({
      name: z.string().min(2, 'Service name is required'),
      description: z.string().optional(),
      price: z.number().min(0, 'Price must be positive').optional(),
      duration: z.string().optional()
    })).optional(),
    pricing: z.object({
      startingPrice: z.number().min(0, 'Starting price must be positive'),
      currency: commonSchemas.currency,
      packages: z.array(z.object({
        name: z.string().min(2, 'Package name is required'),
        price: z.number().min(0, 'Package price must be positive'),
        features: z.array(z.string()).optional()
      })).optional()
    })
  }),
  update: z.object({
    businessName: z.string().min(2, 'Business name is required').optional(),
    ownerName: z.string().min(2, 'Owner name is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    location: z.object({
      address: z.string().min(5, 'Address is required').optional(),
      city: z.string().min(2, 'City is required').optional(),
      province: z.string().min(2, 'Province is required').optional(),
      serviceAreas: z.array(z.string()).optional()
    }).optional(),
    contact: z.object({
      phone: commonSchemas.phone.optional(),
      website: z.string().url('Invalid website URL').optional(),
      socialMedia: z.object({
        facebook: z.string().url('Invalid Facebook URL').optional(),
        instagram: z.string().url('Invalid Instagram URL').optional(),
        youtube: z.string().url('Invalid YouTube URL').optional()
      }).optional()
    }).optional(),
    services: z.array(z.object({
      name: z.string().min(2, 'Service name is required'),
      description: z.string().optional(),
      price: z.number().min(0, 'Price must be positive').optional(),
      duration: z.string().optional()
    })).optional(),
    pricing: z.object({
      startingPrice: z.number().min(0, 'Starting price must be positive').optional(),
      currency: commonSchemas.currency.optional(),
      packages: z.array(z.object({
        name: z.string().min(2, 'Package name is required'),
        price: z.number().min(0, 'Package price must be positive'),
        features: z.array(z.string()).optional()
      })).optional()
    }).optional()
  })
};

// Venue validation schemas
export const venueSchemas = {
  create: z.object({
    name: z.string().min(2, 'Venue name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    location: z.object({
      address: z.string().min(5, 'Address is required'),
      city: z.string().min(2, 'City is required'),
      province: z.string().min(2, 'Province is required'),
      coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
      }).optional()
    }),
    capacity: z.object({
      min: z.number().min(1, 'Minimum capacity must be at least 1'),
      max: z.number().min(1, 'Maximum capacity must be at least 1')
    }),
    pricing: z.object({
      basePrice: z.number().min(0, 'Base price must be positive'),
      currency: commonSchemas.currency,
      pricePerGuest: z.number().min(0, 'Price per guest must be positive').optional()
    }),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    vendor: z.string().min(1, 'Vendor ID is required')
  }),
  update: z.object({
    name: z.string().min(2, 'Venue name is required').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    location: z.object({
      address: z.string().min(5, 'Address is required').optional(),
      city: z.string().min(2, 'City is required').optional(),
      province: z.string().min(2, 'Province is required').optional(),
      coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
      }).optional()
    }).optional(),
    capacity: z.object({
      min: z.number().min(1, 'Minimum capacity must be at least 1').optional(),
      max: z.number().min(1, 'Maximum capacity must be at least 1').optional()
    }).optional(),
    pricing: z.object({
      basePrice: z.number().min(0, 'Base price must be positive').optional(),
      currency: commonSchemas.currency.optional(),
      pricePerGuest: z.number().min(0, 'Price per guest must be positive').optional()
    }).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string().url('Invalid image URL')).optional()
  })
};

// Booking validation schemas
export const bookingSchemas = {
  create: z.object({
    user: z.string().min(1, 'User ID is required'),
    vendor: z.string().min(1, 'Vendor ID is required').optional(),
    venue: z.string().min(1, 'Venue ID is required').optional(),
    date: z.string().datetime('Invalid date format'),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    guestCount: z.number().min(1, 'Guest count must be at least 1').optional(),
    totalAmount: z.number().min(0, 'Total amount must be positive'),
    depositAmount: z.number().min(0, 'Deposit amount must be positive').optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    specialRequirements: z.string().max(1000, 'Special requirements must be less than 1000 characters').optional()
  }),
  update: z.object({
    date: z.string().datetime('Invalid date format').optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    guestCount: z.number().min(1, 'Guest count must be at least 1').optional(),
    totalAmount: z.number().min(0, 'Total amount must be positive').optional(),
    depositAmount: z.number().min(0, 'Deposit amount must be positive').optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    specialRequirements: z.string().max(1000, 'Special requirements must be less than 1000 characters').optional()
  })
};

// Payment validation schemas
export const paymentSchemas = {
  create: z.object({
    user: z.string().min(1, 'User ID is required'),
    vendor: z.string().min(1, 'Vendor ID is required').optional(),
    venue: z.string().min(1, 'Venue ID is required').optional(),
    booking: z.string().min(1, 'Booking ID is required').optional(),
    amount: z.number().min(0, 'Amount must be positive'),
    currency: commonSchemas.currency,
    paymentMethod: z.string().min(1, 'Payment method is required'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    metadata: z.record(z.any()).optional()
  }),
  update: z.object({
    amount: z.number().min(0, 'Amount must be positive').optional(),
    currency: commonSchemas.currency.optional(),
    paymentMethod: z.string().min(1, 'Payment method is required').optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'refunded']).optional(),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    metadata: z.record(z.any()).optional()
  })
};

// Review validation schemas
export const reviewSchemas = {
  create: z.object({
    itemId: z.string().min(1, 'Item ID is required'),
    itemType: z.enum(['vendor', 'venue']),
    rating: commonSchemas.rating,
    comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
    images: z.array(z.string().url('Invalid image URL')).optional()
  }),
  update: z.object({
    rating: commonSchemas.rating.optional(),
    comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
    images: z.array(z.string().url('Invalid image URL')).optional()
  })
};

// Message validation schemas
export const messageSchemas = {
  create: z.object({
    receiverId: z.string().min(1, 'Receiver ID is required'),
    content: z.string().min(1, 'Message content is required').max(2000, 'Message must be less than 2000 characters'),
    messageType: z.enum(['text', 'image', 'file', 'audio', 'video']).default('text'),
    attachments: z.array(z.string().url('Invalid attachment URL')).optional(),
    replyTo: z.string().min(1, 'Reply to message ID is required').optional()
  }),
  update: z.object({
    content: z.string().min(1, 'Message content is required').max(2000, 'Message must be less than 2000 characters').optional(),
    messageType: z.enum(['text', 'image', 'file', 'audio', 'video']).optional(),
    attachments: z.array(z.string().url('Invalid attachment URL')).optional()
  })
};

// Favorite validation schemas
export const favoriteSchemas = {
  create: z.object({
    userId: z.string().min(1, 'User ID is required'),
    itemId: z.string().min(1, 'Item ID is required'),
    type: z.enum(['vendor', 'venue'])
  })
};

// Bulk operation validation schemas
export const bulkSchemas = {
  operation: z.object({
    operation: z.enum(['delete', 'update', 'activate', 'deactivate', 'verify', 'unverify']),
    entity: z.enum(['users', 'vendors', 'venues', 'bookings', 'payments', 'reviews', 'messages', 'favorites']),
    ids: z.array(z.string().min(1, 'ID is required')).min(1, 'At least one ID is required'),
    data: z.record(z.any()).optional()
  })
};

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: any): { success: true; data: T } | { success: false; error: string } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>, request: NextRequest): { success: true; data: T } | { success: false; error: string } {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Convert string numbers to actual numbers
    if (params.page) params.page = parseInt(params.page);
    if (params.limit) params.limit = parseInt(params.limit);
    
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Query validation failed' };
  }
}

export function validateRequestBody<T>(schema: z.ZodSchema<T>, request: NextRequest): Promise<{ success: true; data: T } | { success: false; error: string }> {
  return request.json().then(data => validateRequest(schema, data)).catch(() => ({
    success: false,
    error: 'Invalid JSON in request body'
  }));
}

// Common validation middleware
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest) => {
    const result = await validateRequestBody(schema, request);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    return result.data;
  };
}

