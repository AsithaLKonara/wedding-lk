/**
 * Redis Connection Service
 * Handles Redis connection with proper error handling
 */

import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        commandTimeout: 5000,
      }
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis Client Connected');
    });

    client.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });

    client.on('end', () => {
      console.log('⚠️ Redis Client Disconnected');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return null;
  }
}

export async function closeRedisClient() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Test Redis connection
export async function testRedisConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await getRedisClient();
    if (!client) {
      return { success: false, error: 'Failed to create Redis client' };
    }

    await client.ping();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown Redis error' 
    };
  }
}

export default {
  getRedisClient,
  closeRedisClient,
  testRedisConnection
};
