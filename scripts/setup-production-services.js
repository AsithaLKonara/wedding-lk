#!/usr/bin/env node

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PRODUCTION_URL = 'https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app';

console.log('🚀 WeddingLK Production Setup Assistant\n');
console.log('This script will help you configure all production services.\n');

async function setupProductionServices() {
  console.log('📋 Production Services Setup Checklist:\n');
  
  const services = [
    {
      name: 'MongoDB Atlas',
      description: 'Production database cluster',
      url: 'https://cloud.mongodb.com/',
      required: true,
      steps: [
        '1. Create new cluster named "weddinglk-prod"',
        '2. Create database user (username: weddinglk)',
        '3. Whitelist IP addresses (add 0.0.0.0/0 for Vercel)',
        '4. Get connection string',
        '5. Update MONGODB_URI in Vercel environment variables'
      ]
    },
    {
      name: 'Stripe',
      description: 'Payment processing',
      url: 'https://dashboard.stripe.com/',
      required: true,
      steps: [
        '1. Switch to "Live mode"',
        '2. Get live API keys (pk_live_ and sk_live_)',
        '3. Set up webhook endpoint',
        '4. Update STRIPE keys in Vercel environment variables'
      ]
    },
    {
      name: 'Google OAuth',
      description: 'Authentication provider',
      url: 'https://console.developers.google.com/',
      required: true,
      steps: [
        '1. Create/select project',
        '2. Enable Google+ API',
        '3. Create OAuth 2.0 credentials',
        '4. Add redirect URI for production',
        '5. Update GOOGLE keys in Vercel environment variables'
      ]
    },
    {
      name: 'Upstash Redis',
      description: 'Caching and session storage',
      url: 'https://console.upstash.com/',
      required: true,
      steps: [
        '1. Create new Redis database',
        '2. Get connection URL',
        '3. Update REDIS_URL in Vercel environment variables'
      ]
    },
    {
      name: 'Email Service',
      description: 'SMTP for notifications',
      url: 'https://gmail.com',
      required: true,
      steps: [
        '1. Create Gmail account for production',
        '2. Enable 2-factor authentication',
        '3. Generate App Password',
        '4. Update EMAIL credentials in Vercel environment variables'
      ]
    }
  ];

  // Display services
  services.forEach((service, index) => {
    console.log(`${index + 1}. ${service.name} - ${service.description}`);
    console.log(`   URL: ${service.url}`);
    console.log(`   Required: ${service.required ? 'Yes' : 'No'}`);
    console.log(`   Steps:`);
    service.steps.forEach(step => console.log(`   ${step}`));
    console.log('');
  });

  console.log('🔧 Vercel Environment Variables Setup:\n');
  console.log('Go to: https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables\n');
  
  const envVars = [
    'MONGODB_URI=mongodb+srv://weddinglk:password@cluster.mongodb.net/weddinglk-prod',
    'NEXTAUTH_URL=https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app',
    'NEXTAUTH_SECRET=your-production-secret-key',
    'GOOGLE_CLIENT_ID=your-google-client-id',
    'GOOGLE_CLIENT_SECRET=your-google-client-secret',
    'STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key',
    'STRIPE_SECRET_KEY=sk_live_your-stripe-secret',
    'STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret',
    'REDIS_URL=your-redis-url',
    'OPENAI_API_KEY=your-openai-key',
    'EMAIL_SERVER_HOST=smtp.gmail.com',
    'EMAIL_SERVER_PORT=587',
    'EMAIL_SERVER_USER=your-email@gmail.com',
    'EMAIL_SERVER_PASSWORD=your-app-password',
    'EMAIL_FROM=noreply@weddinglk.com'
  ];

  envVars.forEach(envVar => {
    console.log(envVar);
  });

  console.log('\n📝 Next Steps:');
  console.log('1. Set up each service using the URLs above');
  console.log('2. Add environment variables to Vercel');
  console.log('3. Redeploy the application');
  console.log('4. Test all features');
  console.log('5. Populate sample content');

  console.log('\n🎯 Ready to start? (y/n)');
  
  rl.question('', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n🚀 Starting production setup...');
      await testCurrentStatus();
    } else {
      console.log('\n📋 Setup checklist saved. You can run this script again when ready.');
    }
    rl.close();
  });
}

async function testCurrentStatus() {
  console.log('\n🧪 Testing current production status...\n');
  
  try {
    const response = await makeRequest('/api/simple-health', 'GET');
    
    if (response.success) {
      console.log('✅ Basic health check passed');
      console.log('📊 Response:', response.data);
    } else {
      console.log('❌ Health check failed:', response.error);
      console.log('💡 This is expected if environment variables are not set yet');
    }
    
  } catch (error) {
    console.log('❌ Error testing production:', error.message);
  }
  
  console.log('\n🔗 Production URL:', PRODUCTION_URL);
  console.log('📋 Vercel Dashboard:', 'https://vercel.com/asithalkonaras-projects/wedding-lk');
  console.log('\n🎯 Continue with service setup using the checklist above!');
}

function makeRequest(path, method = 'GET') {
  return new Promise((resolve) => {
    const url = `${PRODUCTION_URL}${path}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
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
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

setupProductionServices().catch(console.error);
