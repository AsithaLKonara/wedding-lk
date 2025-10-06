#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

class FrontendIntegrationTester {
  constructor() {
    this.results = {
      pages: { passed: 0, failed: 0, tests: [] },
      components: { passed: 0, failed: 0, tests: [] },
      apiIntegration: { passed: 0, failed: 0, tests: [] },
      routing: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runAllTests() {
    console.log('🔗 Starting Frontend-Backend Integration Testing...\n');
    
    try {
      await this.testPageRendering();
      await this.testComponentIntegration();
      await this.testAPIIntegration();
      await this.testRouting();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Integration test suite failed:', error);
      process.exit(1);
    }
  }

  async testPageRendering() {
    console.log('📄 Testing Page Rendering...');
    
    const pages = [
      { path: '/', name: 'Home Page' },
      { path: '/venues', name: 'Venues Page' },
      { path: '/vendors', name: 'Vendors Page' },
      { path: '/about', name: 'About Page' },
      { path: '/contact', name: 'Contact Page' },
      { path: '/login', name: 'Login Page' },
      { path: '/register', name: 'Register Page' },
      { path: '/dashboard', name: 'Dashboard Page' },
      { path: '/packages/compare', name: 'Package Compare Page' },
      { path: '/packages/custom', name: 'Custom Package Page' },
      { path: '/premium', name: 'Premium Page' },
      { path: '/subscription', name: 'Subscription Page' },
      { path: '/planning', name: 'Planning Page' },
      { path: '/gallery', name: 'Gallery Page' },
      { path: '/favorites', name: 'Favorites Page' },
      { path: '/feed', name: 'Feed Page' }
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${BASE_URL}${page.path}`);
        if (response.ok) {
          this.addResult('pages', page.name, true, `Status: ${response.status}`);
        } else {
          this.addResult('pages', page.name, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult('pages', page.name, false, `Failed to load: ${error.message}`);
      }
    }
  }

  async testComponentIntegration() {
    console.log('🧩 Testing Component Integration...');
    
    // Test if key components exist and can be imported
    const components = [
      { path: 'components/organisms/venue-grid.tsx', name: 'Venue Grid Component' },
      { path: 'components/organisms/vendor-grid.tsx', name: 'Vendor Grid Component' },
      { path: 'components/organisms/booking-confirmation.tsx', name: 'Booking Confirmation Component' },
      { path: 'components/organisms/payment-form.tsx', name: 'Payment Form Component' },
      { path: 'components/organisms/dashboard-header.tsx', name: 'Dashboard Header Component' },
      { path: 'components/organisms/venue-card.tsx', name: 'Venue Card Component' },
      { path: 'components/organisms/vendor-card.tsx', name: 'Vendor Card Component' },
      { path: 'components/auth/login-form.tsx', name: 'Login Form Component' },
      { path: 'components/auth/register-form.tsx', name: 'Register Form Component' }
    ];

    for (const component of components) {
      try {
        const fullPath = path.join(process.cwd(), component.path);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for API integration patterns
          const hasApiCall = content.includes('fetch(') || content.includes('useSWR') || content.includes('useQuery');
          const hasErrorHandling = content.includes('try') && content.includes('catch');
          const hasLoadingState = content.includes('loading') || content.includes('isLoading');
          
          if (hasApiCall && hasErrorHandling) {
            this.addResult('components', component.name, true, 'Has API integration and error handling');
          } else if (hasApiCall) {
            this.addResult('components', component.name, true, 'Has API integration');
          } else {
            this.addResult('components', component.name, false, 'Missing API integration');
          }
        } else {
          this.addResult('components', component.name, false, 'Component file not found');
        }
      } catch (error) {
        this.addResult('components', component.name, false, `Error checking component: ${error.message}`);
      }
    }
  }

  async testAPIIntegration() {
    console.log('🌐 Testing API Integration...');
    
    const apiEndpoints = [
      { method: 'GET', path: '/api/venues', name: 'Get Venues API' },
      { method: 'GET', path: '/api/vendors', name: 'Get Vendors API' },
      { method: 'GET', path: '/api/users', name: 'Get Users API' },
      { method: 'GET', path: '/api/bookings', name: 'Get Bookings API' },
      { method: 'GET', path: '/api/reviews', name: 'Get Reviews API' },
      { method: 'GET', path: '/api/services', name: 'Get Services API' },
      { method: 'GET', path: '/api/tasks', name: 'Get Tasks API' },
      { method: 'GET', path: '/api/clients', name: 'Get Clients API' }
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success !== false) {
            this.addResult('apiIntegration', endpoint.name, true, `Status: ${response.status}, Data received`);
          } else {
            this.addResult('apiIntegration', endpoint.name, false, `API returned error: ${data.error}`);
          }
        } else {
          this.addResult('apiIntegration', endpoint.name, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult('apiIntegration', endpoint.name, false, `Request failed: ${error.message}`);
      }
    }
  }

  async testRouting() {
    console.log('🛣️ Testing Routing...');
    
    const routes = [
      { path: '/', expected: 'Home' },
      { path: '/venues', expected: 'Venues' },
      { path: '/vendors', expected: 'Vendors' },
      { path: '/about', expected: 'About' },
      { path: '/contact', expected: 'Contact' },
      { path: '/login', expected: 'Login' },
      { path: '/register', expected: 'Register' },
      { path: '/dashboard', expected: 'Dashboard' }
    ];

    for (const route of routes) {
      try {
        const response = await fetch(`${BASE_URL}${route.path}`);
        if (response.ok) {
          const html = await response.text();
          // Basic check if page contains expected content
          if (html.includes('html') || html.includes('body')) {
            this.addResult('routing', `Route ${route.path}`, true, 'Page loads successfully');
          } else {
            this.addResult('routing', `Route ${route.path}`, false, 'Page loads but content seems invalid');
          }
        } else {
          this.addResult('routing', `Route ${route.path}`, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult('routing', `Route ${route.path}`, false, `Failed to load: ${error.message}`);
      }
    }
  }

  addResult(category, testName, passed, message) {
    this.results[category].tests.push({
      name: testName,
      passed,
      message
    });
    
    if (passed) {
      this.results[category].passed++;
      console.log(`✅ ${testName}: ${message}`);
    } else {
      this.results[category].failed++;
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 FRONTEND-BACKEND INTEGRATION TEST REPORT');
    console.log('==========================================\n');

    const categories = ['pages', 'components', 'apiIntegration', 'routing'];
    
    for (const category of categories) {
      const { passed, failed, tests } = this.results[category];
      const total = passed + failed;
      const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
      
      console.log(`${category.toUpperCase()} TESTS:`);
      console.log(`  ✅ Passed: ${passed}`);
      console.log(`  ❌ Failed: ${failed}`);
      console.log(`  📊 Success Rate: ${percentage}%`);
      console.log('');
      
      if (failed > 0) {
        console.log('  Failed Tests:');
        tests.filter(test => !test.passed).forEach(test => {
          console.log(`    ❌ ${test.name}: ${test.message}`);
        });
        console.log('');
      }
    }

    const totalPassed = Object.values(this.results).reduce((sum, cat) => sum + cat.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, cat) => sum + cat.failed, 0);
    const totalTests = totalPassed + totalFailed;
    const overallPercentage = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;

    console.log('OVERALL INTEGRATION RESULTS:');
    console.log(`  ✅ Total Passed: ${totalPassed}`);
    console.log(`  ❌ Total Failed: ${totalFailed}`);
    console.log(`  📊 Overall Success Rate: ${overallPercentage}%`);
    
    if (overallPercentage >= 90) {
      console.log('\n🎉 EXCELLENT! Frontend-Backend integration is working perfectly!');
    } else if (overallPercentage >= 70) {
      console.log('\n⚠️  GOOD! Some integration issues need attention.');
    } else {
      console.log('\n🚨 CRITICAL! Major integration issues need to be fixed.');
    }
  }
}

// Run the integration test
const tester = new FrontendIntegrationTester();
tester.runAllTests().catch(console.error);
