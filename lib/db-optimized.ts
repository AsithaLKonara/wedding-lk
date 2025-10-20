// Database connection pool for better performance
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

// Connection pool configuration
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Skip database connection during build if no URI is provided
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI not provided, skipping database connection")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then((mongoose) => {
      console.log('Database connected with connection pool')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.warn("Database connection failed:", e)
    return null
  }

  return cached.conn
}

// Query optimization helpers
export class QueryOptimizer {
  static optimizeVenueQuery(filters: any = {}) {
    const query: any = {}
    
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' }
    }
    
    if (filters.capacity) {
      query.capacity = { $gte: filters.capacity }
    }
    
    if (filters.priceRange) {
      query.price = {
        $gte: filters.priceRange.min || 0,
        $lte: filters.priceRange.max || Infinity
      }
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $in: filters.amenities }
    }
    
    return query
  }
}

export default connectDB
