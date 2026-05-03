/**
 * API Performance Optimization Utilities
 * Implements query optimization, response compression, and timeout handling
 */

import { connectDB } from './db'

// Type definitions for optimization functions
interface UserData {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
  avatar?: string;
  lastLogin?: Date;
  [key: string]: unknown;
}

interface VenueData {
  _id?: string;
  id?: string;
  name?: string;
  location?: unknown;
  pricing?: unknown;
  images?: string[];
  rating?: unknown;
  isActive?: boolean;
  [key: string]: unknown;
}

interface VendorData {
  _id?: string;
  id?: string;
  businessName?: string;
  category?: string;
  location?: unknown;
  rating?: unknown;
  isActive?: boolean;
  isVerified?: boolean;
  [key: string]: unknown;
}

interface BookingData {
  _id?: string;
  id?: string;
  eventDate?: Date;
  eventTime?: string;
  status?: string;
  guestCount?: number;
  totalPrice?: number;
  currency?: string;
  createdAt?: Date;
  [key: string]: unknown;
}

/**
 * Database query optimization helpers
 */
export class QueryOptimizer {
  /**
   * Optimize MongoDB queries with lean() and select()
   */
  static optimizeQuery(query: { lean: () => unknown; select: (fields: Record<string, 1>) => unknown }, selectFields?: string[]) {
    let optimized = query.lean() // Return plain objects instead of Mongoose documents
    
    if (selectFields && selectFields.length > 0) {
      const selectObj = selectFields.reduce((acc, field) => {
        acc[field] = 1
        return acc
      }, {} as Record<string, 1>)
      optimized = (optimized as { select: (obj: Record<string, 1>) => unknown }).select(selectObj)
    }
    
    return optimized as unknown
  }

  /**
   * Add pagination to queries
   */
  static addPagination(query: { skip: (n: number) => unknown; limit: (n: number) => unknown }, page: number = 1, limit: number = 10): unknown {
    const skip = (page - 1) * limit
    const skipped = query.skip(skip) as unknown
    const result: unknown = (skipped as { limit: (n: number) => unknown }).limit(Math.min(limit, 100)) // Max 100 items
    return result
  }

  /**
   * Add sorting to queries
   */
  static addSorting(query: { sort: (obj: Record<string, 1 | -1>) => unknown }, sortBy: string = 'createdAt', order: 'asc' | 'desc' = 'desc') {
    const sortObj: Record<string, 1 | -1> = {}
    sortObj[sortBy] = order === 'desc' ? -1 : 1
    return query.sort(sortObj)
  }
}

/**
 * Response optimization helpers
 */
export class ResponseOptimizer {
  /**
   * Compress response data by removing unnecessary fields
   */
  static compressUser(user: UserData | null | undefined) {
    if (!user) return null
    
    return {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      avatar: user.avatar,
      lastLogin: user.lastLogin
    }
  }

  /**
   * Compress venue data
   */
  static compressVenue(venue: any) {
    if (!venue) return null
    
    return {
      _id: venue._id?.toString() || venue.id,
      name: venue.name,
      location: {
        city: venue.location?.city || 'Unknown',
        state: venue.location?.province || 'Sri Lanka',
        country: 'Sri Lanka'
      },
      capacity: venue.capacity?.max || venue.capacity || 0,
      pricing: venue.pricing,
      priceRange: venue.pricing?.basePrice ? (venue.pricing.basePrice > 300000 ? '$$$$' : venue.pricing.basePrice > 150000 ? '$$$' : '$$') : '$$',
      images: venue.images || [],
      coverImage: venue.images?.[0],
      rating: venue.rating?.average || 0,
      reviewCount: venue.rating?.count || 0,
      isActive: venue.isActive,
      description: venue.description,
      venueType: venue.venueType || 'Hotel',
      isAvailable: venue.isAvailable ?? true
    }
  }

  /**
   * Compress vendor data
   */
  static compressVendor(vendor: any) {
    if (!vendor) return null
    
    return {
      _id: vendor._id?.toString() || vendor.id,
      businessName: vendor.businessName,
      name: vendor.name || vendor.businessName,
      category: vendor.category,
      location: {
        city: vendor.location?.city || 'Unknown',
        state: vendor.location?.province || 'Sri Lanka',
        country: 'Sri Lanka'
      },
      rating: vendor.rating?.average || 0,
      reviewCount: vendor.rating?.count || 0,
      isActive: vendor.isActive,
      isVerified: vendor.isVerified,
      description: vendor.description,
      priceRange: vendor.pricing?.startingPrice ? (vendor.pricing.startingPrice > 200000 ? '$$$$' : vendor.pricing.startingPrice > 100000 ? '$$$' : '$$') : '$$',
      coverImage: vendor.portfolio?.[0] || vendor.images?.[0],
      yearsInBusiness: vendor.yearsInBusiness || 5,
      responseTime: vendor.responseTime || 'Under 2 hours'
    }
  }

  /**
   * Compress booking data
   */
  static compressBooking(booking: BookingData | null | undefined) {
    if (!booking) return null
    
    return {
      id: booking._id || booking.id,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,
      status: booking.status,
      guestCount: booking.guestCount,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      createdAt: booking.createdAt
    }
  }
}

/**
 * Timeout and error handling
 */
export class TimeoutHandler {
  /**
   * Wrap async operations with timeout
   */
  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number = 10000,
    errorMessage: string = 'Operation timed out'
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
      )
    ])
  }

  /**
   * Retry operation with exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError!
  }
}

/**
 * Database connection optimization
 */
export class DatabaseOptimizer {
  /**
   * Ensure database connection with retry
   */
  static async ensureConnection(maxRetries: number = 3): Promise<void> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await connectDB()
        console.log('[DB] Connection established')
        return
      } catch (error) {
        console.warn(`[DB] Connection attempt ${attempt + 1} failed:`, error)
        
        if (attempt === maxRetries - 1) {
          throw new Error('Failed to connect to database after multiple attempts')
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  /**
   * Optimize database queries with connection pooling
   */
  static async withConnection<T>(operation: () => Promise<T>): Promise<T> {
    try {
      await this.ensureConnection()
      return await operation()
    } catch (error) {
      console.error('[DB] Database operation failed:', error)
      throw error
    }
  }
}

/**
 * API response standardization
 */
export class APIResponse {
  /**
   * Create standardized success response
   */
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create standardized error response
   */
  static error(message: string, code?: string, details?: unknown) {
    return {
      success: false,
      error: message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Create paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      message,
      timestamp: new Date().toISOString()
    }
  }
}

