#!/usr/bin/env node

/**
 * Upstash Redis Test Script
 * Tests Upstash Redis Cloud connection using REST API
 */

require('dotenv').config({ path: '.env.local' });

async function testUpstashRedis() {
  console.log('🧪 Testing Upstash Redis Cloud Connection...\n');

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl || redisUrl.includes('your-redis-url')) {
    console.log('❌ Redis URL not configured properly');
    console.log('📝 Please configure REDIS_URL in .env.local');
    process.exit(1);
  }

  console.log(`🔗 Connecting to: ${redisUrl.replace(/:[^:]*@/, ':***@')}`);

  try {
    // Parse Redis URL to extract credentials
    const url = new URL(redisUrl);
    const password = url.password;
    const hostname = url.hostname;
    const port = url.port || (redisUrl.startsWith('rediss://') ? '6380' : '6379');
    
    // Upstash REST API URL (remove port for REST API)
    const restUrl = `https://${hostname}`;
    
    console.log(`🌐 REST API URL: ${restUrl}`);

    // Test connection with PING
    console.log('⏳ Testing connection...');
    const pingResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['PING'])
    });

    if (!pingResponse.ok) {
      throw new Error(`HTTP ${pingResponse.status}: ${pingResponse.statusText}`);
    }

    const pingResult = await pingResponse.json();
    console.log('✅ Connection successful! PONG received');

    // Test basic operations
    console.log('⏳ Testing basic operations...');
    
    // Set a test key
    const setResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SETEX', 'test:weddinglk', 60, 'Hello from WeddingLK!'])
    });

    if (!setResponse.ok) {
      throw new Error(`SET failed: ${setResponse.statusText}`);
    }
    console.log('✅ SET operation successful');

    // Get the test key
    const getResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'test:weddinglk'])
    });

    if (!getResponse.ok) {
      throw new Error(`GET failed: ${getResponse.statusText}`);
    }

    const getResult = await getResponse.json();
    console.log(`✅ GET operation successful: ${getResult.result}`);

    // Test hash operations
    const hsetResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['HMSET', 'test:user', 'name', 'WeddingLK User', 'email', 'user@weddinglk.com'])
    });

    if (!hsetResponse.ok) {
      throw new Error(`HSET failed: ${hsetResponse.statusText}`);
    }
    console.log('✅ HASH operations successful');

    // Test list operations
    const lpushResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['LPUSH', 'test:notifications', 'Welcome to WeddingLK!', 'New vendor added'])
    });

    if (!lpushResponse.ok) {
      throw new Error(`LPUSH failed: ${lpushResponse.statusText}`);
    }
    console.log('✅ LIST operations successful');

    // Test set operations
    const saddResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SADD', 'test:categories', 'photography', 'catering', 'venue'])
    });

    if (!saddResponse.ok) {
      throw new Error(`SADD failed: ${saddResponse.statusText}`);
    }
    console.log('✅ SET operations successful');

    // Test sorted set operations
    const zaddResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['ZADD', 'test:vendor_ratings', 4.8, 'vendor1', 4.5, 'vendor2', 4.9, 'vendor3'])
    });

    if (!zaddResponse.ok) {
      throw new Error(`ZADD failed: ${zaddResponse.statusText}`);
    }
    console.log('✅ SORTED SET operations successful');

    // Clean up test data
    const delResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['DEL', 'test:weddinglk', 'test:user', 'test:notifications', 'test:categories', 'test:vendor_ratings'])
    });

    if (delResponse.ok) {
      console.log('🧹 Test data cleaned up');
    }

    // Get Redis info
    const infoResponse = await fetch(restUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['INFO', 'server'])
    });

    if (infoResponse.ok) {
      const infoResult = await infoResponse.json();
      console.log('\n📊 Redis Server Info:');
      const info = infoResult.result;
      console.log(`   Version: ${info.match(/redis_version:([^\r\n]+)/)?.[1] || 'Unknown'}`);
      console.log(`   Uptime: ${info.match(/uptime_in_seconds:([^\r\n]+)/)?.[1] || 'Unknown'} seconds`);
      console.log(`   Memory: ${info.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'Unknown'}`);
    }

    console.log('\n🎉 All Upstash Redis tests passed! Your Redis Cloud is ready for production.');

  } catch (error) {
    console.error('❌ Upstash Redis connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Upstash Redis credentials');
    console.log('2. Ensure the database is active in Upstash dashboard');
    console.log('3. Verify the REST API endpoint is correct');
    console.log('4. Check if your IP is whitelisted (if applicable)');
    process.exit(1);
  }
}

// Run the test
testUpstashRedis().catch(console.error);
