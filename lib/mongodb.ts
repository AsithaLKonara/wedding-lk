import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongodbConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  connecting?: boolean;
}

declare global {
  var mongooseMongodb: MongodbConnectionCache | undefined;
}

let cached: MongodbConnectionCache | undefined = (global as any).mongooseMongodb

if (!cached) {
  cached = (global as any).mongooseMongodb = { conn: null, promise: null, connecting: false }
}

async function connectDB() {
  if (cached && cached.conn) {
    return cached.conn
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.connecting = true;
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      if (cached) {
        cached.connecting = false;
      }
      return mongoose
    })
  }

  try {
    if (cached) {
      cached.conn = await cached.promise
    }
  } catch (e) {
    if (cached) {
      cached.promise = null
      cached.connecting = false;
    }
    throw e
  }

  return cached?.conn
}

export default connectDB
export { connectDB }
