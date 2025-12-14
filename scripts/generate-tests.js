#!/usr/bin/env node

/**
 * Cursor AI Test Generation Script
 * 
 * This script uses Cursor AI to generate test cases based on:
 * - API route descriptions
 * - UI component specifications
 * - User flow requirements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  cursorApiKey: process.env.CURSOR_API_KEY,
  projectRoot: process.cwd(),
  testDir: path.join(process.cwd(), 'tests'),
  e2eDir: path.join(process.cwd(), 'tests/e2e'),
  unitDir: path.join(process.cwd(), 'tests/unit'),
  apiDir: path.join(process.cwd(), 'tests/api')
};

// Test generation prompts
const PROMPTS = {
  e2e: {
    auth: `
Generate a comprehensive Playwright E2E test for the authentication flow in WeddingLK.
Include:
- User registration with email verification
- Login with valid/invalid credentials
- Password reset flow
- Social login (Google, Facebook)
- Two-factor authentication setup
- Logout functionality

Use the following selectors and patterns:
- Input fields: input[name="email"], input[name="password"]
- Buttons: button[type="submit"], button[data-testid="login"]
- Success messages: .toast-success, [data-testid="success-message"]
- Error messages: .toast-error, [data-testid="error-message"]

Include proper test data generation with faker.js and mock external API calls.
    `,
    
    booking: `
Generate a comprehensive Playwright E2E test for the booking system in WeddingLK.
Include:
- Vendor/venue search and selection
- Booking form completion
- Payment processing (mocked)
- Booking confirmation
- Booking modification and cancellation
- Communication between customer and vendor

Use the following patterns:
- Search: input[placeholder*="Search"], button:has-text("Search")
- Booking form: input[name="eventDate"], input[name="guestCount"]
- Payment: Mock Stripe/PayHere endpoints
- Confirmation: text=Booking confirmed, text=Payment successful

Include proper error handling and edge cases.
    `,
    
    vendor: `
Generate a comprehensive Playwright E2E test for vendor management in WeddingLK.
Include:
- Vendor registration and onboarding
- Service creation and portfolio upload
- Booking management (accept/decline)
- Profile and portfolio management
- Analytics and performance tracking

Use the following patterns:
- Vendor dashboard: /dashboard/vendor
- Service creation: input[name="title"], textarea[name="description"]
- File uploads: input[type="file"]
- Booking actions: button:has-text("Accept"), button:has-text("Decline")

Include proper test data setup and cleanup.
    `
  },
  
  unit: {
    validators: `
Generate Jest unit tests for validation functions in WeddingLK.
Test the following functions:
- validateBookingDate (reject past dates, accept future dates)
- validateEmail (valid/invalid email formats)
- validatePhone (Sri Lankan phone number formats)
- validatePassword (password strength requirements)

Include edge cases and error scenarios.
    `,
    
    utils: `
Generate Jest unit tests for utility functions in WeddingLK.
Test the following functions:
- formatCurrency (LKR, USD formatting)
- formatDate (different date formats)
- generateBookingId (unique ID generation)
- calculateTotalPrice (price calculations with services)

Include various input scenarios and edge cases.
    `
  },
  
  api: {
    auth: `
Generate Supertest API tests for authentication endpoints in WeddingLK.
Test the following endpoints:
- POST /api/auth/register (user registration)
- POST /api/auth/login (user login)
- POST /api/auth/forgot-password (password reset)
- POST /api/auth/reset-password (password reset confirmation)
- POST /api/auth/verify-email (email verification)

Include:
- Valid request scenarios
- Invalid input handling
- Error response testing
- Database interaction testing

Use test database setup and cleanup.
    `
  }
};

// Cursor AI API integration
class CursorAIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.cursor.sh/v1';
  }

  async generateTest(prompt, testType, testName) {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          context: {
            project: 'WeddingLK',
            framework: testType === 'e2e' ? 'Playwright' : 'Jest',
            language: 'TypeScript'
          },
          options: {
            includeImports: true,
            includeTestData: true,
            includeHelpers: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Cursor AI API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.generatedCode;
    } catch (error) {
      console.error('Error generating test with Cursor AI:', error);
      return null;
    }
  }
}

// Test file generators
class TestGenerator {
  constructor(cursorClient) {
    this.cursorClient = cursorClient;
  }

  async generateE2ETest(testName, prompt) {
    const generatedCode = await this.cursorClient.generateTest(
      prompt,
      'e2e',
      testName
    );

    if (generatedCode) {
      const filePath = path.join(CONFIG.e2eDir, `${testName}.spec.ts`);
      fs.writeFileSync(filePath, generatedCode);
      console.log(`✅ Generated E2E test: ${filePath}`);
      return filePath;
    } else {
      console.error(`❌ Failed to generate E2E test: ${testName}`);
      return null;
    }
  }

  async generateUnitTest(testName, prompt) {
    const generatedCode = await this.cursorClient.generateTest(
      prompt,
      'unit',
      testName
    );

    if (generatedCode) {
      const filePath = path.join(CONFIG.unitDir, `${testName}.spec.ts`);
      fs.writeFileSync(filePath, generatedCode);
      console.log(`✅ Generated unit test: ${filePath}`);
      return filePath;
    } else {
      console.error(`❌ Failed to generate unit test: ${testName}`);
      return null;
    }
  }

  async generateAPITest(testName, prompt) {
    const generatedCode = await this.cursorClient.generateTest(
      prompt,
      'api',
      testName
    );

    if (generatedCode) {
      const filePath = path.join(CONFIG.apiDir, `${testName}.spec.ts`);
      fs.writeFileSync(filePath, generatedCode);
      console.log(`✅ Generated API test: ${filePath}`);
      return filePath;
    } else {
      console.error(`❌ Failed to generate API test: ${testName}`);
      return null;
    }
  }
}

// Test data generators
class TestDataGenerator {
  constructor(cursorClient) {
    this.cursorClient = cursorClient;
  }

  async generateTestData(dataType, count = 10) {
    const prompt = `
Generate ${count} test data entries for ${dataType} in WeddingLK.
Include realistic data with proper relationships and edge cases.
Return as JSON format.

Data type: ${dataType}
Count: ${count}
Include: valid entries, invalid entries, edge cases
    `;

    const generatedData = await this.cursorClient.generateTest(
      prompt,
      'data',
      dataType
    );

    if (generatedData) {
      const filePath = path.join(CONFIG.testDir, 'fixtures', `${dataType}.json`);
      fs.writeFileSync(filePath, generatedData);
      console.log(`✅ Generated test data: ${filePath}`);
      return filePath;
    } else {
      console.error(`❌ Failed to generate test data: ${dataType}`);
      return null;
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Cursor AI test generation...');

  if (!CONFIG.cursorApiKey) {
    console.error('❌ CURSOR_API_KEY environment variable is required');
    process.exit(1);
  }

  const cursorClient = new CursorAIClient(CONFIG.cursorApiKey);
  const testGenerator = new TestGenerator(cursorClient);
  const dataGenerator = new TestDataGenerator(cursorClient);

  try {
    // Generate E2E tests
    console.log('\n📝 Generating E2E tests...');
    await testGenerator.generateE2ETest('auth', PROMPTS.e2e.auth);
    await testGenerator.generateE2ETest('booking', PROMPTS.e2e.booking);
    await testGenerator.generateE2ETest('vendor', PROMPTS.e2e.vendor);

    // Generate unit tests
    console.log('\n🧪 Generating unit tests...');
    await testGenerator.generateUnitTest('validators', PROMPTS.unit.validators);
    await testGenerator.generateUnitTest('utils', PROMPTS.unit.utils);

    // Generate API tests
    console.log('\n🔌 Generating API tests...');
    await testGenerator.generateAPITest('auth', PROMPTS.api.auth);

    // Generate test data
    console.log('\n📊 Generating test data...');
    await dataGenerator.generateTestData('users', 20);
    await dataGenerator.generateTestData('bookings', 15);
    await dataGenerator.generateTestData('payments', 10);

    console.log('\n✅ Test generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Review generated tests');
    console.log('2. Run tests: npm run test');
    console.log('3. Customize tests as needed');
    console.log('4. Add to CI/CD pipeline');

  } catch (error) {
    console.error('❌ Test generation failed:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Cursor AI Test Generator for WeddingLK

Usage:
  node scripts/generate-tests.js [options]

Options:
  --help, -h          Show this help message
  --e2e-only          Generate only E2E tests
  --unit-only         Generate only unit tests
  --api-only          Generate only API tests
  --data-only         Generate only test data

Environment Variables:
  CURSOR_API_KEY      Required: Cursor AI API key
    `);
    process.exit(0);
  }

  if (args.includes('--e2e-only')) {
    console.log('🎭 Generating E2E tests only...');
    // Implementation for E2E only
  } else if (args.includes('--unit-only')) {
    console.log('🧪 Generating unit tests only...');
    // Implementation for unit only
  } else if (args.includes('--api-only')) {
    console.log('🔌 Generating API tests only...');
    // Implementation for API only
  } else if (args.includes('--data-only')) {
    console.log('📊 Generating test data only...');
    // Implementation for data only
  } else {
    main();
  }
}

module.exports = {
  CursorAIClient,
  TestGenerator,
  TestDataGenerator,
  PROMPTS
};
