import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

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
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
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
