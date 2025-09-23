#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class Error404Checker {
  constructor() {
    this.results = {
      missingPages: [],
      missingApiEndpoints: [],
      brokenLinks: [],
      suggestions: []
    };
  }

  async checkAll() {
    console.log('🔍 Checking for 404 errors and missing pages...\n');
    
    await this.checkMissingPages();
    await this.checkMissingApiEndpoints();
    await this.checkBrokenInternalLinks();
    await this.generateReport();
  }

  async checkMissingPages() {
    console.log('📄 Checking for missing pages...');
    
    const expectedPages = [
      'app/page.tsx',
      'app/about/page.tsx',
      'app/contact/page.tsx',
      'app/login/page.tsx',
      'app/register/page.tsx',
      'app/dashboard/page.tsx',
      'app/venues/page.tsx',
      'app/vendors/page.tsx',
      'app/packages/compare/page.tsx',
      'app/packages/custom/page.tsx',
      'app/premium/page.tsx',
      'app/subscription/page.tsx',
      'app/planning/page.tsx',
      'app/gallery/page.tsx',
      'app/favorites/page.tsx',
      'app/feed/page.tsx',
      'app/verify-email/page.tsx',
      'app/status/page.tsx',
      'app/roadmap/page.tsx',
      'app/features/ai-enhancements/page.tsx',
      'app/features/mobile-app/page.tsx',
      'app/debug/page.tsx',
      'app/debug/issues/page.tsx',
      'app/test/page.tsx',
      'app/test/comprehensive/page.tsx',
      'app/test-demo/page.tsx'
    ];

    for (const page of expectedPages) {
      const fullPath = path.join(process.cwd(), page);
      if (!fs.existsSync(fullPath)) {
        this.results.missingPages.push(page);
        console.log(`❌ Missing page: ${page}`);
      } else {
        console.log(`✅ Found page: ${page}`);
      }
    }
  }

  async checkMissingApiEndpoints() {
    console.log('\n🌐 Checking for missing API endpoints...');
    
    const expectedApiEndpoints = [
      'app/api/venues/route.ts',
      'app/api/vendors/route.ts',
      'app/api/users/route.ts',
      'app/api/bookings/route.ts',
      'app/api/reviews/route.ts',
      'app/api/services/route.ts',
      'app/api/tasks/route.ts',
      'app/api/clients/route.ts',
      'app/api/payments/route.ts',
      'app/api/payments/webhook/route.ts',
      'app/api/auth/register/route.ts',
      'app/api/auth/verify-email/route.ts',
      'app/api/auth/2fa-send.ts',
      'app/api/auth/2fa-verify.ts',
      'app/api/ai-search/route.ts',
      'app/api/errors/route.ts',
      'app/api/test/database/route.ts',
      'app/api/test/environment/route.ts',
      'app/api/test/form-validation/route.ts'
    ];

    for (const endpoint of expectedApiEndpoints) {
      const fullPath = path.join(process.cwd(), endpoint);
      if (!fs.existsSync(fullPath)) {
        this.results.missingApiEndpoints.push(endpoint);
        console.log(`❌ Missing API endpoint: ${endpoint}`);
      } else {
        console.log(`✅ Found API endpoint: ${endpoint}`);
      }
    }
  }

  async checkBrokenInternalLinks() {
    console.log('\n🔗 Checking for broken internal links...');
    
    // Check for common internal link patterns in components
    const componentFiles = this.getComponentFiles();
    
    for (const file of componentFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const links = this.extractInternalLinks(content);
        
        for (const link of links) {
          if (!this.isValidInternalLink(link)) {
            this.results.brokenLinks.push({
              file: file,
              link: link,
              reason: 'Link may be broken or pointing to non-existent page'
            });
            console.log(`❌ Potential broken link in ${file}: ${link}`);
          }
        }
      } catch (error) {
        console.log(`⚠️  Error reading file ${file}: ${error.message}`);
      }
    }
  }

  getComponentFiles() {
    const componentDir = path.join(process.cwd(), 'components');
    const files = [];
    
    const walkDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    };
    
    if (fs.existsSync(componentDir)) {
      walkDir(componentDir);
    }
    
    return files;
  }

  extractInternalLinks(content) {
    const linkPatterns = [
      /href=["'](\/[^"']*)["']/g,
      /to=["'](\/[^"']*)["']/g,
      /router\.push\(["'](\/[^"']*)["']\)/g,
      /Link.*href=["'](\/[^"']*)["']/g
    ];
    
    const links = [];
    for (const pattern of linkPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        links.push(match[1]);
      }
    }
    
    return [...new Set(links)]; // Remove duplicates
  }

  isValidInternalLink(link) {
    // Skip external links and special routes
    if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:')) {
      return true;
    }
    
    // Check if the page exists
    const pagePath = path.join(process.cwd(), 'app', link, 'page.tsx');
    const indexPath = path.join(process.cwd(), 'app', link + '.tsx');
    const rootPath = path.join(process.cwd(), 'app', 'page.tsx');
    
    return fs.existsSync(pagePath) || fs.existsSync(indexPath) || (link === '/' && fs.existsSync(rootPath));
  }

  async generateReport() {
    console.log('\n📊 404 ERROR CHECK REPORT');
    console.log('========================\n');

    if (this.results.missingPages.length > 0) {
      console.log('❌ MISSING PAGES:');
      this.results.missingPages.forEach(page => {
        console.log(`  - ${page}`);
      });
      console.log('');
    }

    if (this.results.missingApiEndpoints.length > 0) {
      console.log('❌ MISSING API ENDPOINTS:');
      this.results.missingApiEndpoints.forEach(endpoint => {
        console.log(`  - ${endpoint}`);
      });
      console.log('');
    }

    if (this.results.brokenLinks.length > 0) {
      console.log('❌ POTENTIAL BROKEN LINKS:');
      this.results.brokenLinks.forEach(({ file, link, reason }) => {
        console.log(`  - ${file}: ${link} (${reason})`);
      });
      console.log('');
    }

    // Generate suggestions
    this.generateSuggestions();

    if (this.results.suggestions.length > 0) {
      console.log('💡 SUGGESTIONS:');
      this.results.suggestions.forEach(suggestion => {
        console.log(`  - ${suggestion}`);
      });
      console.log('');
    }

    const totalIssues = this.results.missingPages.length + 
                      this.results.missingApiEndpoints.length + 
                      this.results.brokenLinks.length;

    if (totalIssues === 0) {
      console.log('🎉 EXCELLENT! No 404 errors or missing pages found!');
    } else {
      console.log(`⚠️  Found ${totalIssues} potential issues that need attention.`);
    }
  }

  generateSuggestions() {
    if (this.results.missingPages.length > 0) {
      this.results.suggestions.push('Create missing page components in the app directory');
    }
    
    if (this.results.missingApiEndpoints.length > 0) {
      this.results.suggestions.push('Implement missing API endpoints in the app/api directory');
    }
    
    if (this.results.brokenLinks.length > 0) {
      this.results.suggestions.push('Fix broken internal links or create missing pages');
    }
    
    this.results.suggestions.push('Run comprehensive tests to verify all functionality');
    this.results.suggestions.push('Check browser console for any JavaScript errors');
    this.results.suggestions.push('Test all user flows end-to-end');
  }
}

// Run the 404 checker
const checker = new Error404Checker();
checker.checkAll().catch(console.error);
