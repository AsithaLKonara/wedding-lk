#!/usr/bin/env node

/**
 * Redis Connection Test Script
 * Tests Redis Cloud connection and basic operations
 */

const Redis = require('ioredis');
require('dotenv').config({ path: '.env.local' });

async function testRedisConnection() {
  console.log('🧪 Testing Redis Cloud Connection...\n');

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl || redisUrl.includes('your-redis-url')) {
    console.log('❌ Redis URL not configured properly');
    console.log('📝 Please follow the setup guide in scripts/setup-redis-cloud.md');
    process.exit(1);
  }

  console.log(`🔗 Connecting to: ${redisUrl.replace(/:[^:]*@/, ':***@')}`);

  try {
    // Create Redis client with Upstash-specific configuration
    const redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
      family: 4, // Use IPv4
      keepAlive: true,
      tls: redisUrl.startsWith('rediss://') ? {} : undefined
    });

    // Test connection
    console.log('⏳ Testing connection...');
    await redis.ping();
    console.log('✅ Connection successful!');

    // Test basic operations
    console.log('⏳ Testing basic operations...');
    
    // Set a test key
    await redis.set('test:weddinglk', 'Hello from WeddingLK!', 'EX', 60);
    console.log('✅ SET operation successful');

    // Get the test key
    const value = await redis.get('test:weddinglk');
    console.log(`✅ GET operation successful: ${value}`);

    // Test hash operations
    await redis.hset('test:user', 'name', 'WeddingLK User', 'email', 'user@weddinglk.com');
    const user = await redis.hgetall('test:user');
    console.log('✅ HASH operations successful:', user);

    // Test list operations
    await redis.lpush('test:notifications', 'Welcome to WeddingLK!', 'New vendor added');
    const notifications = await redis.lrange('test:notifications', 0, -1);
    console.log('✅ LIST operations successful:', notifications);

    // Test set operations
    await redis.sadd('test:categories', 'photography', 'catering', 'venue');
    const categories = await redis.smembers('test:categories');
    console.log('✅ SET operations successful:', categories);

    // Test sorted set operations (for rankings)
    await redis.zadd('test:vendor_ratings', 4.8, 'vendor1', 4.5, 'vendor2', 4.9, 'vendor3');
    const topVendors = await redis.zrevrange('test:vendor_ratings', 0, 2, 'WITHSCORES');
    console.log('✅ SORTED SET operations successful:', topVendors);

    // Clean up test data
    await redis.del('test:weddinglk', 'test:user', 'test:notifications', 'test:categories', 'test:vendor_ratings');
    console.log('🧹 Test data cleaned up');

    // Get Redis info
    const info = await redis.info('server');
    console.log('\n📊 Redis Server Info:');
    console.log(`   Version: ${info.match(/redis_version:([^\r\n]+)/)?.[1] || 'Unknown'}`);
    console.log(`   Uptime: ${info.match(/uptime_in_seconds:([^\r\n]+)/)?.[1] || 'Unknown'} seconds`);
    console.log(`   Memory: ${info.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'Unknown'}`);

    // Close connection
    await redis.quit();
    console.log('\n🎉 All Redis tests passed! Your Redis Cloud is ready for production.');

  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Redis Cloud credentials');
    console.log('2. Ensure the database is active');
    console.log('3. Verify network connectivity');
    console.log('4. Check firewall settings');
    process.exit(1);
  }
}

// Run the test
testRedisConnection().catch(console.error);
