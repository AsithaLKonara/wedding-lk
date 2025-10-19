#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';

const exec = promisify(spawn);

class MasterTestRunner {
  constructor() {
    this.results = {
      database: { passed: 0, failed: 0, tests: [] },
      api: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] },
      frontend: { passed: 0, failed: 0, tests: [] },
      errors: { passed: 0, failed: 0, tests: [] }
    };
    this.startTime = Date.now();
  }

  async runAllTests() {
    console.log('🚀 Starting Master Test Suite - Comprehensive E2E Testing');
    console.log('========================================================\n');
    
    try {
      // 1. Check for 404 errors first
      await this.runTest('404 Error Check', 'node scripts/check-404-errors.mjs');
      
      // 2. Run comprehensive database and API tests
      await this.runTest('Comprehensive E2E Test', 'node scripts/comprehensive-test.mjs');
      
      // 3. Run frontend integration tests
      await this.runTest('Frontend Integration Test', 'node scripts/test-frontend-integration.mjs');
      
      // 4. Run Jest unit tests
      await this.runTest('Unit Tests', 'npm run test');
      
      // 5. Run type checking
      await this.runTest('Type Checking', 'npm run type-check');
      
      // 6. Run linting
      await this.runTest('Linting', 'npm run lint');
      
      await this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Master test suite failed:', error);
      process.exit(1);
    }
  }

  async runTest(testName, command) {
    console.log(`\n🧪 Running: ${testName}`);
    console.log(`Command: ${command}`);
    console.log('─'.repeat(50));
    
    try {
      const [cmd, ...args] = command.split(' ');
      const result = await this.executeCommand(cmd, args);
      
      if (result.success) {
        console.log(`✅ ${testName} completed successfully`);
        this.addResult('integration', testName, true, 'Test completed successfully');
      } else {
        console.log(`❌ ${testName} failed`);
        this.addResult('integration', testName, false, `Test failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${testName} failed with error: ${error.message}`);
      this.addResult('integration', testName, false, `Test failed: ${error.message}`);
    }
  }

  async executeCommand(command, args = []) {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: `Process exited with code ${code}` });
        }
      });

      child.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
    });
  }

  addResult(category, testName, passed, message) {
    this.results[category].tests.push({
      name: testName,
      passed,
      message
    });
    
    if (passed) {
      this.results[category].passed++;
    } else {
      this.results[category].failed++;
    }
  }

  async generateFinalReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log('\n🎯 MASTER TEST SUITE FINAL REPORT');
    console.log('==================================');
    console.log(`⏱️  Total Duration: ${duration} seconds\n`);

    const categories = ['database', 'api', 'integration', 'frontend', 'errors'];
    
    for (const category of categories) {
      const { passed, failed, tests } = this.results[category];
      const total = passed + failed;
      const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
      
      console.log(`${category.toUpperCase()} TESTS:`);
      console.log(`  ✅ Passed: ${passed}`);
      console.log(`  ❌ Failed: ${failed}`);
      console.log(`  📊 Success Rate: ${percentage}%`);
      
      if (failed > 0) {
        console.log('  Failed Tests:');
        tests.filter(test => !test.passed).forEach(test => {
          console.log(`    ❌ ${test.name}: ${test.message}`);
        });
      }
      console.log('');
    }

    const totalPassed = Object.values(this.results).reduce((sum, cat) => sum + cat.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, cat) => sum + cat.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const overallPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

    console.log('🏆 OVERALL RESULTS:');
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📊 Overall Success Rate: ${overallPercentage}%`);
    console.log(`  ⏱️  Total Duration: ${duration} seconds`);
    
    console.log('\n📋 NEXT STEPS:');
    
    if (overallPercentage >= 95) {
      console.log('🎉 OUTSTANDING! Your application is production-ready!');
      console.log('   - Deploy to production with confidence');
      console.log('   - Monitor performance and user feedback');
      console.log('   - Continue regular testing and updates');
    } else if (overallPercentage >= 85) {
      console.log('✅ EXCELLENT! Minor issues need attention before production.');
      console.log('   - Fix the remaining failed tests');
      console.log('   - Run tests again to verify fixes');
      console.log('   - Consider additional edge case testing');
    } else if (overallPercentage >= 70) {
      console.log('⚠️  GOOD! Several issues need attention before production.');
      console.log('   - Prioritize fixing critical functionality');
      console.log('   - Focus on database integration and API endpoints');
      console.log('   - Test user flows thoroughly');
    } else {
      console.log('🚨 CRITICAL! Major issues need to be fixed before production.');
      console.log('   - Fix database connectivity issues');
      console.log('   - Implement missing API endpoints');
      console.log('   - Fix frontend-backend integration');
      console.log('   - Address all 404 errors');
    }

    console.log('\n🔧 QUICK FIXES:');
    console.log('   - Run: npm run seed:comprehensive (to populate database)');
    console.log('   - Run: npm run fix:api (to fix API endpoints)');
    console.log('   - Run: npm run test:comprehensive (to verify fixes)');
    console.log('   - Run: npm run dev (to test in browser)');
    
    console.log('\n📚 DOCUMENTATION:');
    console.log('   - Check README.md for setup instructions');
    console.log('   - Review API documentation in app/api/');
    console.log('   - Test all user flows manually');
    
    if (overallPercentage < 70) {
      process.exit(1);
    }
  }
}

// Run the master test suite
const runner = new MasterTestRunner();
runner.runAllTests().catch(console.error);
