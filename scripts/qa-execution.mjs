#!/usr/bin/env node

/**
 * WeddingLK QA Execution Script
 * Comprehensive testing automation for production readiness
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class QAExecutor {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      total: 0
    };
    this.startTime = Date.now();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log('\n' + '='.repeat(60));
    this.log(`🧪 ${title}`, 'cyan');
    console.log('='.repeat(60));
  }

  logStep(step, status = 'info') {
    const statusIcon = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    };
    this.log(`${statusIcon[status]} ${step}`, status === 'error' ? 'red' : status === 'success' ? 'green' : status === 'warning' ? 'yellow' : 'reset');
  }

  async runCommand(command, description) {
    try {
      this.logStep(`Running: ${description}`, 'info');
      const output = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      this.logStep(`✅ ${description} completed`, 'success');
      this.results.passed++;
      return { success: true, output };
    } catch (error) {
      this.logStep(`❌ ${description} failed: ${error.message}`, 'error');
      this.results.failed++;
      return { success: false, error: error.message };
    } finally {
      this.results.total++;
    }
  }

  async checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.logStep(`✅ ${description} exists`, 'success');
      this.results.passed++;
    } else {
      this.logStep(`❌ ${description} missing`, 'error');
      this.results.failed++;
    }
    this.results.total++;
  }

  async phase1_preTestingSetup() {
    this.logSection('Phase 1: Pre-Testing Setup');
    
    // Check dependencies
    await this.runCommand('npm list --depth=0', 'Checking dependencies');
    
    // TypeScript compilation
    await this.runCommand('npm run type-check', 'TypeScript compilation check');
    
    // Build process
    await this.runCommand('npm run build', 'Production build test');
    
    // Linting
    await this.runCommand('npm run lint', 'Code linting check');
    
    // Check Playwright installation
    await this.runCommand('npx playwright --version', 'Playwright version check');
    
    // Install Playwright browsers if needed
    await this.runCommand('npx playwright install', 'Playwright browser installation');
  }

  async phase2_functionalTesting() {
    this.logSection('Phase 2: Functional Testing');
    
    // Authentication tests
    await this.runCommand('npx playwright test tests/02-auth.spec.ts --reporter=list', 'Authentication flow testing');
    
    // Venue CRUD tests
    await this.runCommand('npx playwright test tests/02-venues-crud.spec.ts --reporter=list', 'Venue management testing');
    
    // Booking and payment tests
    await this.runCommand('npx playwright test tests/04-bookings-payments.spec.ts --reporter=list', 'Booking system testing');
    
    // Dashboard tests
    await this.runCommand('npx playwright test tests/05-dashboard-system.spec.ts --reporter=list', 'Dashboard functionality testing');
    
    // AI and chat tests
    await this.runCommand('npx playwright test tests/06-ai-search-chat.spec.ts --reporter=list', 'AI features testing');
  }

  async phase3_uiUxTesting() {
    this.logSection('Phase 3: UI/UX Testing');
    
    // Mobile responsiveness
    await this.runCommand('npx playwright test tests/09-mobile-responsiveness.spec.ts --reporter=list', 'Mobile responsiveness testing');
    
    // Cross-browser testing
    await this.runCommand('npx playwright test --project=chromium --project=firefox --project="Mobile Chrome" --reporter=list', 'Cross-browser testing');
  }

  async phase4_performanceTesting() {
    this.logSection('Phase 4: Performance Testing');
    
    // Performance monitoring
    await this.runCommand('npm run performance', 'Performance monitoring');
    
    // Bundle analysis
    await this.runCommand('npm run bundle-analyzer', 'Bundle size analysis');
    
    // Test coverage
    await this.runCommand('npm run test:coverage', 'Test coverage analysis');
  }

  async phase5_securityTesting() {
    this.logSection('Phase 5: Security Testing');
    
    // Security tests
    await this.runCommand('npx playwright test tests/10-performance-security.spec.ts --reporter=list', 'Security testing');
    
    // NPM audit
    await this.runCommand('npm audit --audit-level moderate', 'Security vulnerability check');
  }

  async phase6_automatedTesting() {
    this.logSection('Phase 6: Automated Testing Execution');
    
    // All tests
    await this.runCommand('npm run test:all', 'Complete test suite');
    
    // Comprehensive tests
    await this.runCommand('npm run test:comprehensive', 'Comprehensive testing');
    
    // Frontend integration
    await this.runCommand('npm run test:frontend', 'Frontend integration testing');
    
    // 404 error check
    await this.runCommand('npm run test:404', '404 error checking');
  }

  async phase7_deploymentValidation() {
    this.logSection('Phase 7: Deployment Validation');
    
    // Check environment files
    await this.checkFileExists('.env.local', 'Environment configuration');
    await this.checkFileExists('vercel.json', 'Vercel configuration');
    
    // Verify build artifacts
    await this.checkFileExists('.next', 'Next.js build output');
    await this.checkFileExists('.next/static', 'Static assets');
    
    // Live deployment tests
    await this.runCommand('npx playwright test tests/live-deployment-comprehensive.spec.ts --reporter=list', 'Live deployment testing');
  }

  async generateReport() {
    this.logSection('QA Execution Report');
    
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    this.log(`\n📊 Test Results Summary:`, 'bold');
    this.log(`   Total Tests: ${this.results.total}`, 'blue');
    this.log(`   Passed: ${this.results.passed}`, 'green');
    this.log(`   Failed: ${this.results.failed}`, 'red');
    this.log(`   Warnings: ${this.results.warnings}`, 'yellow');
    this.log(`   Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
    this.log(`   Duration: ${duration}s`, 'blue');
    
    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      results: this.results,
      successRate: `${successRate}%`,
      status: successRate >= 90 ? 'PASS' : successRate >= 70 ? 'WARN' : 'FAIL'
    };
    
    const reportPath = `qa-report-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');
    
    if (this.results.failed > 0) {
      this.log(`\n⚠️  ${this.results.failed} tests failed. Please review the output above.`, 'yellow');
      process.exit(1);
    } else {
      this.log(`\n🎉 All tests passed! WeddingLK is ready for production.`, 'green');
    }
  }

  async runFullQA() {
    this.log('🚀 Starting WeddingLK QA Execution', 'bold');
    this.log('=====================================', 'bold');
    
    try {
      await this.phase1_preTestingSetup();
      await this.phase2_functionalTesting();
      await this.phase3_uiUxTesting();
      await this.phase4_performanceTesting();
      await this.phase5_securityTesting();
      await this.phase6_automatedTesting();
      await this.phase7_deploymentValidation();
      
      await this.generateReport();
    } catch (error) {
      this.log(`\n💥 QA Execution failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async runPhase(phaseName) {
    this.log(`🎯 Running Phase: ${phaseName}`, 'bold');
    
    switch (phaseName.toLowerCase()) {
      case 'setup':
      case '1':
        await this.phase1_preTestingSetup();
        break;
      case 'functional':
      case '2':
        await this.phase2_functionalTesting();
        break;
      case 'ui':
      case '3':
        await this.phase3_uiUxTesting();
        break;
      case 'performance':
      case '4':
        await this.phase4_performanceTesting();
        break;
      case 'security':
      case '5':
        await this.phase5_securityTesting();
        break;
      case 'automated':
      case '6':
        await this.phase6_automatedTesting();
        break;
      case 'deployment':
      case '7':
        await this.phase7_deploymentValidation();
        break;
      default:
        this.log(`❌ Unknown phase: ${phaseName}`, 'red');
        this.log('Available phases: setup, functional, ui, performance, security, automated, deployment', 'yellow');
        process.exit(1);
    }
    
    await this.generateReport();
  }
}

// Main execution
const qaExecutor = new QAExecutor();
const args = process.argv.slice(2);

if (args.length === 0) {
  // Run full QA suite
  qaExecutor.runFullQA();
} else if (args[0] === '--phase' && args[1]) {
  // Run specific phase
  qaExecutor.runPhase(args[1]);
} else if (args[0] === '--help') {
  console.log(`
WeddingLK QA Execution Script

Usage:
  node scripts/qa-execution.mjs                    # Run full QA suite
  node scripts/qa-execution.mjs --phase <phase>    # Run specific phase
  node scripts/qa-execution.mjs --help             # Show this help

Available phases:
  setup        - Pre-testing setup and environment verification
  functional   - Core functionality testing
  ui           - UI/UX and responsive design testing
  performance  - Performance and optimization testing
  security     - Security and vulnerability testing
  automated    - Automated test execution
  deployment   - Deployment validation and smoke testing

Examples:
  node scripts/qa-execution.mjs --phase functional
  node scripts/qa-execution.mjs --phase performance
  `);
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}
