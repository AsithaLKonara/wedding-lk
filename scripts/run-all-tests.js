#!/usr/bin/env node

/**
 * Master Test Runner for WeddingLK
 * Runs all tests: API, Security, UI, and Integration tests
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_RESULTS_DIR = 'test-results';
const FINAL_REPORT_FILE = 'test-report.html';

// Ensure test results directory exists
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

// Test configurations
const testSuites = [
  {
    name: 'API Tests',
    script: 'scripts/test-all-apis.js',
    description: 'Comprehensive API endpoint testing',
    timeout: 300000, // 5 minutes
    critical: true
  },
  {
    name: 'Security Tests',
    script: 'scripts/test-security.js',
    description: 'Security vulnerability and RBAC testing',
    timeout: 180000, // 3 minutes
    critical: true
  },
  {
    name: 'TypeScript Compilation',
    script: 'npx',
    args: ['tsc', '--noEmit'],
    description: 'TypeScript type checking',
    timeout: 60000, // 1 minute
    critical: true
  },
  {
    name: 'ESLint',
    script: 'npx',
    args: ['eslint', '--ext', '.ts,.tsx', '--max-warnings', '0', '.'],
    description: 'Code quality and style checking',
    timeout: 120000, // 2 minutes
    critical: false
  },
  {
    name: 'Build Test',
    script: 'npm',
    args: ['run', 'build'],
    description: 'Production build verification',
    timeout: 300000, // 5 minutes
    critical: true
  }
];

// Test results storage
const masterResults = {
  timestamp: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: process.platform,
    arch: process.arch
  },
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    criticalFailures: 0
  },
  suites: []
};

function runTest(testSuite) {
  return new Promise((resolve) => {
    console.log(`\n🚀 Running ${testSuite.name}...`);
    console.log(`📝 ${testSuite.description}`);
    
    const startTime = Date.now();
    const args = testSuite.args || [];
    const child = spawn(testSuite.script, args, {
      stdio: 'pipe',
      shell: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      const result = {
        name: testSuite.name,
        status: 'timeout',
        duration: Date.now() - startTime,
        error: `Test timed out after ${testSuite.timeout / 1000} seconds`,
        stdout,
        stderr,
        critical: testSuite.critical
      };
      resolve(result);
    }, testSuite.timeout);

    child.on('close', (code) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      
      let status;
      if (code === 0) {
        status = 'passed';
      } else if (code === null) {
        status = 'timeout';
      } else {
        status = 'failed';
      }

      const result = {
        name: testSuite.name,
        status,
        duration,
        exitCode: code,
        stdout,
        stderr,
        critical: testSuite.critical
      };

      console.log(`\n${status === 'passed' ? '✅' : '❌'} ${testSuite.name} - ${status.toUpperCase()} (${duration}ms)`);
      resolve(result);
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      const result = {
        name: testSuite.name,
        status: 'error',
        duration: Date.now() - startTime,
        error: error.message,
        stdout,
        stderr,
        critical: testSuite.critical
      };
      console.log(`\n❌ ${testSuite.name} - ERROR: ${error.message}`);
      resolve(result);
    });
  });
}

async function runAllTests() {
  console.log('🧪 WeddingLK Master Test Suite');
  console.log('================================\n');
  console.log(`Environment: ${process.platform} ${process.arch} (Node ${process.version})`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const startTime = Date.now();

  // Run all test suites
  for (const testSuite of testSuites) {
    const result = await runTest(testSuite);
    masterResults.suites.push(result);
    masterResults.summary.total++;
    
    if (result.status === 'passed') {
      masterResults.summary.passed++;
    } else if (result.status === 'failed' || result.status === 'error' || result.status === 'timeout') {
      masterResults.summary.failed++;
      if (result.critical) {
        masterResults.summary.criticalFailures++;
      }
    }
  }

  const totalDuration = Date.now() - startTime;

  // Generate summary
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`Total Tests: ${masterResults.summary.total}`);
  console.log(`Passed: ${masterResults.summary.passed}`);
  console.log(`Failed: ${masterResults.summary.failed}`);
  console.log(`Critical Failures: ${masterResults.summary.criticalFailures}`);
  console.log(`Total Duration: ${totalDuration}ms`);

  const successRate = ((masterResults.summary.passed / masterResults.summary.total) * 100).toFixed(2);
  console.log(`Success Rate: ${successRate}%`);

  // Generate detailed report
  generateHTMLReport();

  // Save JSON results
  const jsonFile = path.join(TEST_RESULTS_DIR, 'master-results.json');
  fs.writeFileSync(jsonFile, JSON.stringify(masterResults, null, 2));
  console.log(`\n📄 Detailed results saved to: ${jsonFile}`);

  // Exit with appropriate code
  if (masterResults.summary.criticalFailures > 0) {
    console.log('\n❌ Critical test failures detected. Fix before deployment.');
    process.exit(1);
  } else if (masterResults.summary.failed > 0) {
    console.log('\n⚠️  Some tests failed. Review and fix before deployment.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Ready for deployment.');
    process.exit(0);
  }
}

function generateHTMLReport() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeddingLK Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px; }
        .metric { text-align: center; padding: 20px; border-radius: 8px; }
        .metric.passed { background: #dcfce7; color: #166534; }
        .metric.failed { background: #fef2f2; color: #dc2626; }
        .metric.total { background: #f3f4f6; color: #374151; }
        .metric h3 { margin: 0 0 10px 0; font-size: 2em; }
        .metric p { margin: 0; font-weight: 500; }
        .suites { padding: 20px; }
        .suite { margin-bottom: 20px; padding: 15px; border-radius: 8px; border-left: 4px solid; }
        .suite.passed { background: #f0fdf4; border-color: #22c55e; }
        .suite.failed { background: #fef2f2; border-color: #ef4444; }
        .suite.error { background: #fef2f2; border-color: #dc2626; }
        .suite.timeout { background: #fffbeb; border-color: #f59e0b; }
        .suite h3 { margin: 0 0 10px 0; display: flex; align-items: center; gap: 10px; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .status.passed { background: #22c55e; color: white; }
        .status.failed { background: #ef4444; color: white; }
        .status.error { background: #dc2626; color: white; }
        .status.timeout { background: #f59e0b; color: white; }
        .details { margin-top: 10px; font-size: 0.9em; color: #6b7280; }
        .critical { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 4px; margin-top: 10px; }
        .footer { padding: 20px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 WeddingLK Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Environment: ${process.platform} ${process.arch} (Node ${process.version})</p>
        </div>
        
        <div class="summary">
            <div class="metric total">
                <h3>${masterResults.summary.total}</h3>
                <p>Total Tests</p>
            </div>
            <div class="metric passed">
                <h3>${masterResults.summary.passed}</h3>
                <p>Passed</p>
            </div>
            <div class="metric failed">
                <h3>${masterResults.summary.failed}</h3>
                <p>Failed</p>
            </div>
            <div class="metric ${masterResults.summary.criticalFailures > 0 ? 'failed' : 'passed'}">
                <h3>${masterResults.summary.criticalFailures}</h3>
                <p>Critical Issues</p>
            </div>
        </div>
        
        <div class="suites">
            <h2>Test Suites</h2>
            ${masterResults.suites.map(suite => `
                <div class="suite ${suite.status}">
                    <h3>
                        ${suite.status === 'passed' ? '✅' : suite.status === 'failed' ? '❌' : suite.status === 'error' ? '💥' : '⏰'}
                        ${suite.name}
                        <span class="status ${suite.status}">${suite.status.toUpperCase()}</span>
                    </h3>
                    <div class="details">
                        <p><strong>Duration:</strong> ${suite.duration}ms</p>
                        ${suite.critical ? '<p class="critical"><strong>⚠️ Critical Test</strong> - Must pass for deployment</p>' : ''}
                        ${suite.error ? `<p><strong>Error:</strong> ${suite.error}</p>` : ''}
                        ${suite.exitCode !== undefined ? `<p><strong>Exit Code:</strong> ${suite.exitCode}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>WeddingLK Test Suite - Automated Testing Report</p>
        </div>
    </div>
</body>
</html>`;

  const htmlFile = path.join(TEST_RESULTS_DIR, FINAL_REPORT_FILE);
  fs.writeFileSync(htmlFile, html);
  console.log(`📊 HTML report generated: ${htmlFile}`);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests };
