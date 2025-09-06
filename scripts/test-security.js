#!/usr/bin/env node

/**
 * Security Testing Script for WeddingLK
 * Tests for common security vulnerabilities and RBAC enforcement
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SECURITY_RESULTS_FILE = 'security-test-results.json';

const securityResults = {
  timestamp: new Date().toISOString(),
  baseUrl: BASE_URL,
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  },
  tests: []
};

// Security test cases
const securityTests = [
  // Authentication bypass tests
  {
    id: 'auth_bypass_admin',
    name: 'Admin Route Bypass',
    description: 'Attempt to access admin routes without authentication',
    severity: 'critical',
    method: 'GET',
    path: '/dashboard/admin/stats',
    headers: {},
    expectedStatus: 401,
    category: 'authentication'
  },
  {
    id: 'auth_bypass_vendor',
    name: 'Vendor Route Bypass',
    description: 'Attempt to access vendor routes without authentication',
    severity: 'critical',
    method: 'GET',
    path: '/dashboard/vendor/stats',
    headers: {},
    expectedStatus: 401,
    category: 'authentication'
  },
  {
    id: 'auth_bypass_user',
    name: 'User Route Bypass',
    description: 'Attempt to access user routes without authentication',
    severity: 'critical',
    method: 'GET',
    path: '/dashboard/user/stats',
    headers: {},
    expectedStatus: 401,
    category: 'authentication'
  },

  // Role escalation tests
  {
    id: 'role_escalation_user_to_admin',
    name: 'User to Admin Escalation',
    description: 'User attempting to access admin-only endpoints',
    severity: 'critical',
    method: 'GET',
    path: '/api/dashboard/admin/stats',
    headers: { 'Authorization': 'Bearer fake_user_token' },
    expectedStatus: 401,
    category: 'authorization'
  },
  {
    id: 'role_escalation_vendor_to_admin',
    name: 'Vendor to Admin Escalation',
    description: 'Vendor attempting to access admin-only endpoints',
    severity: 'critical',
    method: 'GET',
    path: '/api/dashboard/admin/users',
    headers: { 'Authorization': 'Bearer fake_vendor_token' },
    expectedStatus: 401,
    category: 'authorization'
  },

  // SQL Injection tests
  {
    id: 'sql_injection_user_id',
    name: 'SQL Injection in User ID',
    description: 'Test for SQL injection in user ID parameter',
    severity: 'high',
    method: 'GET',
    path: '/api/users/1\' OR \'1\'=\'1',
    headers: {},
    expectedStatus: 400,
    category: 'injection'
  },
  {
    id: 'sql_injection_search',
    name: 'SQL Injection in Search',
    description: 'Test for SQL injection in search parameters',
    severity: 'high',
    method: 'GET',
    path: '/api/vendors?search=\' OR 1=1--',
    headers: {},
    expectedStatus: 400,
    category: 'injection'
  },

  // XSS tests
  {
    id: 'xss_script_tag',
    name: 'XSS Script Tag',
    description: 'Test for XSS with script tag injection',
    severity: 'high',
    method: 'POST',
    path: '/api/reviews',
    body: { comment: '<script>alert("XSS")</script>' },
    headers: {},
    expectedStatus: 400,
    category: 'xss'
  },
  {
    id: 'xss_img_tag',
    name: 'XSS Image Tag',
    description: 'Test for XSS with image tag injection',
    severity: 'high',
    method: 'POST',
    path: '/api/reviews',
    body: { comment: '<img src="x" onerror="alert(\'XSS\')">' },
    headers: {},
    expectedStatus: 400,
    category: 'xss'
  },

  // CSRF tests
  {
    id: 'csrf_missing_token',
    name: 'CSRF Missing Token',
    description: 'Test for CSRF protection on state-changing operations',
    severity: 'medium',
    method: 'POST',
    path: '/api/users',
    body: { name: 'Test User', email: 'test@example.com' },
    headers: {},
    expectedStatus: 403,
    category: 'csrf'
  },

  // Input validation tests
  {
    id: 'email_validation',
    name: 'Email Validation',
    description: 'Test email validation on user registration',
    severity: 'medium',
    method: 'POST',
    path: '/api/register',
    body: { name: 'Test', email: 'invalid-email', password: 'password123' },
    headers: {},
    expectedStatus: 400,
    category: 'validation'
  },
  {
    id: 'password_validation',
    name: 'Password Validation',
    description: 'Test password validation on user registration',
    severity: 'medium',
    method: 'POST',
    path: '/api/register',
    body: { name: 'Test', email: 'test@example.com', password: '123' },
    headers: {},
    expectedStatus: 400,
    category: 'validation'
  },

  // File upload tests
  {
    id: 'file_upload_executable',
    name: 'Executable File Upload',
    description: 'Test for executable file upload prevention',
    severity: 'high',
    method: 'POST',
    path: '/api/upload',
    body: { file: 'malicious.exe' },
    headers: {},
    expectedStatus: 400,
    category: 'file_upload'
  },

  // Rate limiting tests
  {
    id: 'rate_limiting',
    name: 'Rate Limiting',
    description: 'Test rate limiting on API endpoints',
    severity: 'medium',
    method: 'GET',
    path: '/api/health',
    headers: {},
    expectedStatus: 429,
    category: 'rate_limiting',
    iterations: 100
  },

  // Information disclosure tests
  {
    id: 'info_disclosure_error',
    name: 'Error Information Disclosure',
    description: 'Test for sensitive information in error messages',
    severity: 'low',
    method: 'GET',
    path: '/api/nonexistent',
    headers: {},
    expectedStatus: 404,
    category: 'info_disclosure'
  }
];

function makeRequest(method, url, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            raw: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runSecurityTest(test) {
  const startTime = Date.now();
  
  try {
    let response;
    
    if (test.iterations) {
      // For rate limiting tests, make multiple requests
      const promises = [];
      for (let i = 0; i < test.iterations; i++) {
        promises.push(makeRequest(test.method, `${BASE_URL}${test.path}`, test.headers, test.body));
      }
      const responses = await Promise.all(promises);
      response = responses[responses.length - 1]; // Get the last response
    } else {
      response = await makeRequest(test.method, `${BASE_URL}${test.path}`, test.headers, test.body);
    }

    const duration = Date.now() - startTime;
    const success = response.status === test.expectedStatus;
    
    // Check for sensitive information in error messages
    let infoDisclosure = false;
    if (test.category === 'info_disclosure' && response.raw) {
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /key/i,
        /token/i,
        /database/i,
        /sql/i,
        /error.*line/i,
        /stack.*trace/i
      ];
      
      infoDisclosure = sensitivePatterns.some(pattern => pattern.test(response.raw));
    }

    const result = {
      id: test.id,
      name: test.name,
      description: test.description,
      severity: test.severity,
      category: test.category,
      status: success ? 'passed' : 'failed',
      response: {
        status: response.status,
        expectedStatus: test.expectedStatus,
        duration: `${duration}ms`,
        data: response.data
      },
      error: success ? null : `Expected ${test.expectedStatus}, got ${response.status}`,
      infoDisclosure: infoDisclosure,
      timestamp: new Date().toISOString()
    };

    securityResults.tests.push(result);
    securityResults.summary.total++;
    
    if (success) {
      securityResults.summary.passed++;
      console.log(`✅ ${test.name} - ${test.severity.toUpperCase()}`);
    } else {
      securityResults.summary.failed++;
      securityResults.summary[test.severity]++;
      console.log(`❌ ${test.name} - ${test.severity.toUpperCase()} - Expected ${test.expectedStatus}, got ${response.status}`);
    }

    if (infoDisclosure) {
      console.log(`⚠️  ${test.name} - Information disclosure detected`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const result = {
      id: test.id,
      name: test.name,
      description: test.description,
      severity: test.severity,
      category: test.category,
      status: 'failed',
      response: {
        status: 0,
        expectedStatus: test.expectedStatus,
        duration: `${duration}ms`,
        data: null
      },
      error: error.message,
      infoDisclosure: false,
      timestamp: new Date().toISOString()
    };

    securityResults.tests.push(result);
    securityResults.summary.total++;
    securityResults.summary.failed++;
    securityResults.summary[test.severity]++;
    
    console.log(`❌ ${test.name} - ${test.severity.toUpperCase()} - ERROR: ${error.message}`);
    return result;
  }
}

async function runAllSecurityTests() {
  console.log('🔒 Starting WeddingLK Security Tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Group tests by category
  const testsByCategory = securityTests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {});

  // Run tests by category
  for (const [category, tests] of Object.entries(testsByCategory)) {
    console.log(`\n📋 Testing ${category.toUpperCase()}...`);
    
    for (const test of tests) {
      await runSecurityTest(test);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
    }
  }

  // Generate security report
  console.log('\n📊 Security Test Summary:');
  console.log(`Total Tests: ${securityResults.summary.total}`);
  console.log(`Passed: ${securityResults.summary.passed}`);
  console.log(`Failed: ${securityResults.summary.failed}`);
  console.log(`Critical Issues: ${securityResults.summary.critical}`);
  console.log(`High Issues: ${securityResults.summary.high}`);
  console.log(`Medium Issues: ${securityResults.summary.medium}`);
  console.log(`Low Issues: ${securityResults.summary.low}`);

  const securityScore = ((securityResults.summary.passed / securityResults.summary.total) * 100).toFixed(2);
  console.log(`Security Score: ${securityScore}%`);

  // Security recommendations
  console.log('\n🔍 Security Recommendations:');
  
  const failedTests = securityResults.tests.filter(t => t.status === 'failed');
  const criticalIssues = failedTests.filter(t => t.severity === 'critical');
  const highIssues = failedTests.filter(t => t.severity === 'high');
  
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Fix Immediately):');
    criticalIssues.forEach(test => {
      console.log(`- ${test.name}: ${test.error}`);
    });
  }
  
  if (highIssues.length > 0) {
    console.log('\n⚠️  HIGH PRIORITY ISSUES:');
    highIssues.forEach(test => {
      console.log(`- ${test.name}: ${test.error}`);
    });
  }

  // Save results to file
  fs.writeFileSync(SECURITY_RESULTS_FILE, JSON.stringify(securityResults, null, 2));
  console.log(`\n📄 Detailed security results saved to: ${SECURITY_RESULTS_FILE}`);

  // Exit with appropriate code
  if (securityResults.summary.critical > 0) {
    console.log('\n❌ Critical security issues found. Fix immediately before deployment.');
    process.exit(1);
  } else if (securityResults.summary.high > 0) {
    console.log('\n⚠️  High priority security issues found. Address before deployment.');
    process.exit(1);
  } else {
    console.log('\n✅ Security tests passed!');
    process.exit(0);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllSecurityTests().catch(error => {
    console.error('Security test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runAllSecurityTests, runSecurityTest };
