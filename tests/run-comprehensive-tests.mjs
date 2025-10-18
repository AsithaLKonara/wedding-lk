#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting Comprehensive WeddingLK Test Suite');
console.log('=' .repeat(60));

const testFiles = [
  '00-comprehensive-homepage.spec.ts',
  '01-auth-system.spec.ts', 
  '02-venues-crud.spec.ts',
  '03-vendors-crud.spec.ts',
  '04-bookings-payments.spec.ts',
  '05-dashboard-system.spec.ts',
  '06-ai-search-chat.spec.ts',
  '07-reviews-ratings.spec.ts',
  '08-comprehensive-api.spec.ts',
  '09-mobile-responsiveness.spec.ts',
  '10-performance-security.spec.ts'
];

const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

async function runTestSuite() {
  console.log('📋 Test Files to Execute:');
  testFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log('');

  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    console.log('✅ Playwright is installed');
  } catch (error) {
    console.log('❌ Playwright not found. Installing...');
    execSync('npm install @playwright/test', { stdio: 'inherit' });
    execSync('npx playwright install chromium', { stdio: 'inherit' });
  }

  // Check if live deployment is accessible
  try {
    execSync('curl -s https://wedding-lkcom.vercel.app > /dev/null', { stdio: 'pipe' });
    console.log('✅ Live deployment is accessible at https://wedding-lkcom.vercel.app');
  } catch (error) {
    console.log('❌ Live deployment not accessible. Please check the deployment status.');
    console.log('   Deployment URL: https://wedding-lkcom.vercel.app');
    process.exit(1);
  }

  console.log('');
  console.log('🧪 Starting Test Execution...');
  console.log('');

  for (const testFile of testFiles) {
    const testPath = join('tests', testFile);
    
    if (!existsSync(testPath)) {
      console.log(`⚠️  Test file not found: ${testFile}`);
      continue;
    }

    console.log(`\n🔍 Running: ${testFile}`);
    console.log('-'.repeat(50));

    try {
      const startTime = Date.now();
      
      // Run individual test file
      const result = execSync(`npx playwright test ${testPath} --project=chromium --reporter=line`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`✅ ${testFile} - PASSED (${duration}s)`);
      testResults.passed++;
      testResults.details.push({
        file: testFile,
        status: 'PASSED',
        duration: duration
      });
      
    } catch (error) {
      console.log(`❌ ${testFile} - FAILED`);
      console.log(`   Error: ${error.message.split('\n')[0]}`);
      testResults.failed++;
      testResults.details.push({
        file: testFile,
        status: 'FAILED',
        error: error.message.split('\n')[0]
      });
    }
    
    testResults.total++;
  }

  // Generate comprehensive test report
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n📈 Summary:`);
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   Passed: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`   Failed: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)`);
  
  console.log(`\n📋 Detailed Results:`);
  testResults.details.forEach((result, index) => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    const duration = result.duration ? `(${result.duration}s)` : '';
    console.log(`   ${index + 1}. ${status} ${result.file} ${duration}`);
    if (result.error) {
      console.log(`      Error: ${result.error}`);
    }
  });

  // Generate test coverage summary
  console.log(`\n🎯 Test Coverage Areas:`);
  const coverageAreas = [
    'Homepage & Navigation',
    'Authentication System', 
    'Venues CRUD Operations',
    'Vendors CRUD Operations',
    'Bookings & Payments',
    'Dashboard System',
    'AI Search & Chat',
    'Reviews & Ratings',
    'API Integration',
    'Mobile Responsiveness',
    'Performance & Security'
  ];

  coverageAreas.forEach((area, index) => {
    const result = testResults.details[index];
    const status = result && result.status === 'PASSED' ? '✅' : '❌';
    console.log(`   ${status} ${area}`);
  });

  // Recommendations
  console.log(`\n💡 Recommendations:`);
  if (testResults.failed > 0) {
    console.log(`   • Fix ${testResults.failed} failing test(s) before production deployment`);
    console.log(`   • Review error messages and implement necessary fixes`);
    console.log(`   • Re-run specific test files to verify fixes`);
  } else {
    console.log(`   • All tests passed! 🎉`);
    console.log(`   • Application is ready for production deployment`);
    console.log(`   • Consider running additional load tests`);
  }

  console.log(`\n🔧 Next Steps:`);
  console.log(`   • Run: npx playwright show-report (to view detailed HTML report)`);
  console.log(`   • Run: npx playwright test --ui (for interactive test debugging)`);
  console.log(`   • Fix any failing tests and re-run this suite`);
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Suite Complete');
  console.log('='.repeat(60));

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error.message);
  process.exit(1);
});

// Run the test suite
runTestSuite().catch(error => {
  console.error('❌ Test Suite Error:', error.message);
  process.exit(1);
});
