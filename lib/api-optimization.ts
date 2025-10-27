/**
 * API Performance Optimization Utilities
 * Implements query optimization, response compression, and timeout handling
 */

import { connectDB } from './db'

/**
 * Database query optimization helpers
 */
export class QueryOptimizer {
  /**
   * Optimize MongoDB queries with lean() and select()
   */
  static optimizeQuery(query: any, selectFields?: string[]) {
    let optimized = query.lean() // Return plain objects instead of Mongoose documents
    
    if (selectFields && selectFields.length > 0) {
      const selectObj = selectFields.reduce((acc, field) => {
        acc[field] = 1
        return acc
      }, {} as Record<string, 1>)
      optimized = optimized.select(selectObj)
    }
    
    return optimized
  }

  /**
   * Add pagination to queries
   */
  static addPagination(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    return query.skip(skip).limit(Math.min(limit, 100)) // Max 100 items
  }

  /**
   * Add sorting to queries
   */
  static addSorting(query: any, sortBy: string = 'createdAt', order: 'asc' | 'desc' = 'desc') {
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
  static compressUser(user: any) {
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
      id: venue._id || venue.id,
      name: venue.name,
      location: venue.location,
      pricing: venue.pricing,
      images: venue.images?.slice(0, 3), // Only first 3 images
      rating: venue.rating,
      isActive: venue.isActive
    }
  }

  /**
   * Compress vendor data
   */
  static compressVendor(vendor: any) {
    if (!vendor) return null
    
    return {
      id: vendor._id || vendor.id,
      businessName: vendor.businessName,
      category: vendor.category,
      location: vendor.location,
      rating: vendor.rating,
      isActive: vendor.isActive,
      isVerified: vendor.isVerified
    }
  }

  /**
   * Compress booking data
   */
  static compressBooking(booking: any) {
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
  static error(message: string, code?: string, details?: any) {
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

