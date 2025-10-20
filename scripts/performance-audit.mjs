#!/usr/bin/env node

/**
 * WeddingLK Performance Audit Script
 * Comprehensive performance testing and optimization recommendations
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

class PerformanceAuditor {
  constructor() {
    this.results = {
      lighthouse: {},
      bundle: {},
      coverage: {},
      recommendations: []
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log('\n' + '='.repeat(60));
    this.log(`⚡ ${title}`, 'cyan');
    console.log('='.repeat(60));
  }

  async runLighthouseAudit() {
    this.logSection('Lighthouse Performance Audit');
    
    try {
      // Check if lighthouse is installed
      execSync('npx lighthouse --version', { stdio: 'pipe' });
      
      this.log('🔍 Running Lighthouse audit...', 'blue');
      
      // Run lighthouse audit
      const lighthouseCommand = `npx lighthouse https://wedding-kv4wiotpq-asithalkonaras-projects.vercel.app --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"`;
      
      execSync(lighthouseCommand, { stdio: 'pipe' });
      
      // Read and parse results
      const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
      const categories = report.categories;
      
      this.results.lighthouse = {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      };
      
      // Display results
      this.log(`\n📊 Lighthouse Scores:`, 'bold');
      this.log(`   Performance: ${this.results.lighthouse.performance}/100`, 
        this.results.lighthouse.performance >= 90 ? 'green' : this.results.lighthouse.performance >= 70 ? 'yellow' : 'red');
      this.log(`   Accessibility: ${this.results.lighthouse.accessibility}/100`, 
        this.results.lighthouse.accessibility >= 90 ? 'green' : this.results.lighthouse.accessibility >= 70 ? 'yellow' : 'red');
      this.log(`   Best Practices: ${this.results.lighthouse.bestPractices}/100`, 
        this.results.lighthouse.bestPractices >= 90 ? 'green' : this.results.lighthouse.bestPractices >= 70 ? 'yellow' : 'red');
      this.log(`   SEO: ${this.results.lighthouse.seo}/100`, 
        this.results.lighthouse.seo >= 90 ? 'green' : this.results.lighthouse.seo >= 70 ? 'yellow' : 'red');
      
      // Generate recommendations
      this.generateLighthouseRecommendations(report);
      
    } catch (error) {
      this.log(`❌ Lighthouse audit failed: ${error.message}`, 'red');
      this.log('💡 Install lighthouse: npm install -g lighthouse', 'yellow');
    }
  }

  generateLighthouseRecommendations(report) {
    const audits = report.audits;
    
    // Performance recommendations
    if (audits['first-contentful-paint']?.score < 0.9) {
      this.results.recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Slow First Contentful Paint',
        score: audits['first-contentful-paint'].score,
        recommendation: 'Optimize critical rendering path, reduce server response time, and minimize render-blocking resources'
      });
    }
    
    if (audits['largest-contentful-paint']?.score < 0.9) {
      this.results.recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Slow Largest Contentful Paint',
        score: audits['largest-contentful-paint'].score,
        recommendation: 'Optimize images, use efficient image formats (WebP/AVIF), and implement lazy loading'
      });
    }
    
    if (audits['cumulative-layout-shift']?.score < 0.9) {
      this.results.recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: 'Cumulative Layout Shift',
        score: audits['cumulative-layout-shift'].score,
        recommendation: 'Add size attributes to images and videos, avoid inserting content above existing content'
      });
    }
    
    if (audits['unused-css-rules']?.score < 0.9) {
      this.results.recommendations.push({
        category: 'Performance',
        priority: 'Medium',
        issue: 'Unused CSS Rules',
        score: audits['unused-css-rules'].score,
        recommendation: 'Remove unused CSS and implement critical CSS inlining'
      });
    }
    
    if (audits['unused-javascript']?.score < 0.9) {
      this.results.recommendations.push({
        category: 'Performance',
        priority: 'High',
        issue: 'Unused JavaScript',
        score: audits['unused-javascript'].score,
        recommendation: 'Remove unused JavaScript, implement code splitting, and use dynamic imports'
      });
    }
  }

  async runBundleAnalysis() {
    this.logSection('Bundle Size Analysis');
    
    try {
      this.log('📦 Analyzing bundle size...', 'blue');
      
      // Run bundle analyzer
      execSync('npm run build', { stdio: 'pipe' });
      
      // Check bundle sizes
      const nextDir = './.next/static';
      if (fs.existsSync(nextDir)) {
        const files = this.getDirectorySize(nextDir);
        this.results.bundle = files;
        
        this.log(`\n📊 Bundle Analysis:`, 'bold');
        files.forEach(file => {
          const size = (file.size / 1024 / 1024).toFixed(2);
          this.log(`   ${file.name}: ${size} MB`, 
            file.size > 1024 * 1024 ? 'red' : file.size > 512 * 1024 ? 'yellow' : 'green');
        });
        
        // Check for large bundles
        const largeFiles = files.filter(f => f.size > 1024 * 1024);
        if (largeFiles.length > 0) {
          this.results.recommendations.push({
            category: 'Bundle Size',
            priority: 'High',
            issue: 'Large JavaScript bundles detected',
            recommendation: 'Implement code splitting, lazy loading, and remove unused dependencies'
          });
        }
      }
      
    } catch (error) {
      this.log(`❌ Bundle analysis failed: ${error.message}`, 'red');
    }
  }

  getDirectorySize(dirPath) {
    const files = [];
    
    function scanDirectory(currentPath) {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDirectory(itemPath);
        } else if (item.endsWith('.js') || item.endsWith('.css')) {
          files.push({
            name: item,
            path: itemPath,
            size: stats.size
          });
        }
      });
    }
    
    scanDirectory(dirPath);
    return files.sort((a, b) => b.size - a.size);
  }

  async runCoverageAnalysis() {
    this.logSection('Test Coverage Analysis');
    
    try {
      this.log('🧪 Running test coverage analysis...', 'blue');
      
      execSync('npm run test:coverage', { stdio: 'pipe' });
      
      // Read coverage report
      const coveragePath = './coverage/coverage-summary.json';
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        this.results.coverage = coverage.total;
        
        this.log(`\n📊 Test Coverage:`, 'bold');
        this.log(`   Lines: ${coverage.total.lines.pct}%`, 
          coverage.total.lines.pct >= 80 ? 'green' : coverage.total.lines.pct >= 60 ? 'yellow' : 'red');
        this.log(`   Functions: ${coverage.total.functions.pct}%`, 
          coverage.total.functions.pct >= 80 ? 'green' : coverage.total.functions.pct >= 60 ? 'yellow' : 'red');
        this.log(`   Branches: ${coverage.total.branches.pct}%`, 
          coverage.total.branches.pct >= 80 ? 'green' : coverage.total.branches.pct >= 60 ? 'yellow' : 'red');
        this.log(`   Statements: ${coverage.total.statements.pct}%`, 
          coverage.total.statements.pct >= 80 ? 'green' : coverage.total.statements.pct >= 60 ? 'yellow' : 'red');
        
        if (coverage.total.lines.pct < 80) {
          this.results.recommendations.push({
            category: 'Test Coverage',
            priority: 'Medium',
            issue: 'Low test coverage',
            recommendation: 'Increase test coverage to at least 80% for critical paths'
          });
        }
      }
      
    } catch (error) {
      this.log(`❌ Coverage analysis failed: ${error.message}`, 'red');
    }
  }

  async runAPIPerformanceTest() {
    this.logSection('API Performance Testing');
    
    try {
      this.log('🚀 Testing API response times...', 'blue');
      
      // Test key API endpoints
      const endpoints = [
        '/api/auth/session',
        '/api/venues',
        '/api/vendors',
        '/api/bookings',
        '/api/users'
      ];
      
      const baseUrl = 'https://wedding-kv4wiotpq-asithalkonaras-projects.vercel.app';
      const results = [];
      
      for (const endpoint of endpoints) {
        try {
          const start = Date.now();
          const response = await fetch(`${baseUrl}${endpoint}`);
          const duration = Date.now() - start;
          
          results.push({
            endpoint,
            status: response.status,
            duration,
            success: response.ok
          });
          
          this.log(`   ${endpoint}: ${duration}ms ${response.ok ? '✅' : '❌'}`, 
            duration < 200 ? 'green' : duration < 500 ? 'yellow' : 'red');
            
        } catch (error) {
          this.log(`   ${endpoint}: Failed - ${error.message}`, 'red');
        }
      }
      
      // Check for slow APIs
      const slowAPIs = results.filter(r => r.duration > 500);
      if (slowAPIs.length > 0) {
        this.results.recommendations.push({
          category: 'API Performance',
          priority: 'High',
          issue: 'Slow API response times detected',
          recommendation: 'Optimize database queries, implement caching, and consider CDN for static assets'
        });
      }
      
    } catch (error) {
      this.log(`❌ API performance test failed: ${error.message}`, 'red');
    }
  }

  generateOptimizationPlan() {
    this.logSection('Optimization Recommendations');
    
    if (this.results.recommendations.length === 0) {
      this.log('🎉 No optimization recommendations! Your app is performing well.', 'green');
      return;
    }
    
    // Group recommendations by priority
    const highPriority = this.results.recommendations.filter(r => r.priority === 'High');
    const mediumPriority = this.results.recommendations.filter(r => r.priority === 'Medium');
    const lowPriority = this.results.recommendations.filter(r => r.priority === 'Low');
    
    if (highPriority.length > 0) {
      this.log('\n🔴 High Priority Issues:', 'red');
      highPriority.forEach((rec, index) => {
        this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'red');
        this.log(`      💡 ${rec.recommendation}`, 'yellow');
      });
    }
    
    if (mediumPriority.length > 0) {
      this.log('\n🟡 Medium Priority Issues:', 'yellow');
      mediumPriority.forEach((rec, index) => {
        this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'yellow');
        this.log(`      💡 ${rec.recommendation}`, 'yellow');
      });
    }
    
    if (lowPriority.length > 0) {
      this.log('\n🟢 Low Priority Issues:', 'green');
      lowPriority.forEach((rec, index) => {
        this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'green');
        this.log(`      💡 ${rec.recommendation}`, 'yellow');
      });
    }
  }

  async generateReport() {
    this.logSection('Performance Audit Report');
    
    const report = {
      timestamp: new Date().toISOString(),
      lighthouse: this.results.lighthouse,
      bundle: this.results.bundle,
      coverage: this.results.coverage,
      recommendations: this.results.recommendations,
      summary: {
        totalRecommendations: this.results.recommendations.length,
        highPriority: this.results.recommendations.filter(r => r.priority === 'High').length,
        mediumPriority: this.results.recommendations.filter(r => r.priority === 'Medium').length,
        lowPriority: this.results.recommendations.filter(r => r.priority === 'Low').length
      }
    };
    
    const reportPath = `performance-audit-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');
    
    // Overall performance score
    const performanceScore = this.results.lighthouse.performance || 0;
    const accessibilityScore = this.results.lighthouse.accessibility || 0;
    const bestPracticesScore = this.results.lighthouse.bestPractices || 0;
    const seoScore = this.results.lighthouse.seo || 0;
    
    const overallScore = (performanceScore + accessibilityScore + bestPracticesScore + seoScore) / 4;
    
    this.log(`\n🎯 Overall Performance Score: ${overallScore.toFixed(1)}/100`, 
      overallScore >= 90 ? 'green' : overallScore >= 70 ? 'yellow' : 'red');
    
    if (overallScore >= 90) {
      this.log('🎉 Excellent performance! Your app is production-ready.', 'green');
    } else if (overallScore >= 70) {
      this.log('⚠️  Good performance with room for improvement.', 'yellow');
    } else {
      this.log('❌ Performance needs significant improvement before production.', 'red');
    }
  }

  async runFullAudit() {
    this.log('⚡ Starting WeddingLK Performance Audit', 'bold');
    this.log('=========================================', 'bold');
    
    try {
      await this.runLighthouseAudit();
      await this.runBundleAnalysis();
      await this.runCoverageAnalysis();
      await this.runAPIPerformanceTest();
      this.generateOptimizationPlan();
      await this.generateReport();
    } catch (error) {
      this.log(`💥 Performance audit failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Main execution
const auditor = new PerformanceAuditor();
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--full') {
  auditor.runFullAudit();
} else if (args[0] === '--lighthouse') {
  auditor.runLighthouseAudit();
} else if (args[0] === '--bundle') {
  auditor.runBundleAnalysis();
} else if (args[0] === '--coverage') {
  auditor.runCoverageAnalysis();
} else if (args[0] === '--api') {
  auditor.runAPIPerformanceTest();
} else if (args[0] === '--help') {
  console.log(`
WeddingLK Performance Audit Script

Usage:
  node scripts/performance-audit.mjs [options]

Options:
  --full        Run complete performance audit (default)
  --lighthouse  Run only Lighthouse audit
  --bundle      Run only bundle analysis
  --coverage    Run only coverage analysis
  --api         Run only API performance test
  --help        Show this help

Examples:
  node scripts/performance-audit.mjs
  node scripts/performance-audit.mjs --lighthouse
  node scripts/performance-audit.mjs --bundle
  `);
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}
