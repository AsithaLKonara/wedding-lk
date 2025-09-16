#!/usr/bin/env node

const https = require('https');

const PRODUCTION_URL = 'https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app';

async function populateContent() {
  console.log('🌱 Populating Production Content...\n');
  console.log(`📍 Target: ${PRODUCTION_URL}\n`);
  
  try {
    // Test comprehensive seed endpoint
    console.log('Testing comprehensive seed endpoint...');
    const response = await makeRequest('/api/admin/comprehensive-seed', 'POST');
    
    if (response.success) {
      console.log('✅ Content population successful!');
      console.log('📊 Response:', response.data);
    } else {
      console.log('❌ Content population failed:', response.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Verify content in production database');
  console.log('2. Test user registration and login');
  console.log('3. Test vendor registration');
  console.log('4. Test package browsing and booking');
  console.log('5. Test payment processing');
}

function makeRequest(path, method = 'GET') {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}${path}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 400,
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            success: false,
            status: res.statusCode,
            error: 'Invalid JSON response',
            data: data
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

populateContent().catch(console.error);
