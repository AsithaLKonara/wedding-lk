import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
  role: z.enum(['user', 'vendor', 'admin', 'planner']).default('user'),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500).optional(),
  profilePicture: z.string().url().optional(),
});

// Vendor validation schemas
export const vendorRegistrationSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(2, 'Location is required'),
  category: z.enum(['venue', 'catering', 'photography', 'decoration', 'music', 'transport', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  website: z.string().url().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
});

export const vendorUpdateSchema = z.object({
  businessName: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).optional(),
  location: z.string().min(2).optional(),
  category: z.enum(['venue', 'catering', 'photography', 'decoration', 'music', 'transport', 'other']).optional(),
  description: z.string().min(10).max(1000).optional(),
  website: z.string().url().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
  isActive: z.boolean().optional(),
});

// Venue validation schemas
export const venueCreateSchema = z.object({
  name: z.string().min(2, 'Venue name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(10000),
  pricePerHour: z.number().min(0, 'Price cannot be negative'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  availability: z.object({
    monday: z.boolean().default(true),
    tuesday: z.boolean().default(true),
    wednesday: z.boolean().default(true),
    thursday: z.boolean().default(true),
    friday: z.boolean().default(true),
    saturday: z.boolean().default(true),
    sunday: z.boolean().default(true),
  }).optional(),
  contactInfo: z.object({
    phone: z.string().min(10),
    email: z.string().email(),
  }),
});

export const venueUpdateSchema = venueCreateSchema.partial();

// Booking validation schemas
export const bookingCreateSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  vendorId: z.string().min(1, 'Vendor ID is required'),
  eventDate: z.string().datetime('Invalid date format'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  guestCount: z.number().min(1, 'Guest count must be at least 1').max(10000),
  totalAmount: z.number().min(0, 'Total amount cannot be negative'),
  specialRequests: z.string().max(500).optional(),
  contactInfo: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
});

export const bookingUpdateSchema = z.object({
  eventDate: z.string().datetime().optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  guestCount: z.number().min(1).max(10000).optional(),
  totalAmount: z.number().min(0).optional(),
  specialRequests: z.string().max(500).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
});

// Review validation schemas
export const reviewCreateSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be less than 500 characters'),
  photos: z.array(z.string().url()).optional(),
});

export const reviewUpdateSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(10).max(500).optional(),
  photos: z.array(z.string().url()).optional(),
});

// Payment validation schemas
export const paymentCreateSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('LKR'),
  paymentMethod: z.enum(['stripe', 'paypal', 'bank_transfer']),
  description: z.string().max(200).optional(),
});

// Boost package validation schemas
export const boostPackageCreateSchema = z.object({
  name: z.string().min(2, 'Package name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  price: z.number().min(0, 'Price cannot be negative'),
  duration: z.number().min(1, 'Duration must be at least 1 day').max(365, 'Duration cannot exceed 365 days'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  isActive: z.boolean().default(true),
});

export const boostPurchaseSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  vendorId: z.string().min(1, 'Vendor ID is required'),
  paymentMethod: z.enum(['stripe', 'paypal', 'bank_transfer']),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  category: z.enum(['venue', 'vendor', 'all']).default('all'),
  location: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  availability: z.string().datetime().optional(),
  sortBy: z.enum(['price', 'rating', 'distance', 'relevance']).default('relevance'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

// Notification validation schemas
export const notificationCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['booking', 'payment', 'review', 'system', 'promotion']),
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  data: z.record(z.unknown()).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Task validation schemas
export const taskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  assignedTo: z.string().optional(),
  category: z.string().optional(),
});

export const taskUpdateSchema = taskCreateSchema.partial();

// Timeline event validation schemas
export const timelineEventCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  eventDate: z.string().datetime('Invalid date format'),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  category: z.enum(['ceremony', 'reception', 'preparation', 'other']),
  location: z.string().optional(),
  assignedTo: z.string().optional(),
  isCompleted: z.boolean().default(false),
});

export const timelineEventUpdateSchema = timelineEventCreateSchema.partial();

// Budget item validation schemas
export const budgetItemCreateSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  item: z.string().min(1, 'Item name is required').max(100),
  estimatedCost: z.number().min(0, 'Cost cannot be negative'),
  actualCost: z.number().min(0).optional(),
  notes: z.string().max(200).optional(),
  isPaid: z.boolean().default(false),
  dueDate: z.string().datetime().optional(),
});

export const budgetItemUpdateSchema = budgetItemCreateSchema.partial();

// AI query validation schemas
export const aiQuerySchema = z.object({
  query: z.string().min(1, 'Query is required').max(1000),
  context: z.record(z.unknown()).optional(),
  type: z.enum(['venue-recommendation', 'vendor-matching', 'budget-optimization', 'cultural-guidance', 'timeline-generation', 'general']).default('general'),
});

// Analytics validation schemas
export const analyticsQuerySchema = z.object({
  type: z.enum(['overview', 'charts', 'realtime', 'performance', 'security']).default('overview'),
  timeRange: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  filters: z.record(z.unknown()).optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['image', 'document', 'video']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).optional(),
});

// Common validation utilities
export const validateId = z.string().min(1, 'ID is required');
export const validateEmail = z.string().email('Invalid email address');
export const validatePhone = z.string().min(10, 'Phone number must be at least 10 digits');
export const validateUrl = z.string().url('Invalid URL');
export const validateDate = z.string().datetime('Invalid date format');
export const validateTime = z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)');

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Generic validation helper
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}


