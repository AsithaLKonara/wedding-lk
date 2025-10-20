#!/usr/bin/env node

/**
 * WeddingLK Deployment Validation Script
 * Comprehensive pre and post-deployment validation
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

class DeploymentValidator {
  constructor() {
    this.results = {
      preDeployment: {},
      postDeployment: {},
      issues: [],
      recommendations: []
    };
    this.deploymentUrl = 'https://wedding-kv4wiotpq-asithalkonaras-projects.vercel.app';
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log('\n' + '='.repeat(60));
    this.log(`🚀 ${title}`, 'cyan');
    console.log('='.repeat(60));
  }

  async checkPreDeployment() {
    this.logSection('Pre-Deployment Validation');
    
    // Check build process
    await this.checkBuildProcess();
    
    // Check environment variables
    await this.checkEnvironmentVariables();
    
    // Check security
    await this.checkSecurity();
    
    // Check performance
    await this.checkPerformance();
    
    // Check test coverage
    await this.checkTestCoverage();
  }

  async checkBuildProcess() {
    this.log('🔨 Checking build process...', 'blue');
    
    try {
      // Clean previous build
      if (fs.existsSync('.next')) {
        execSync('rm -rf .next', { stdio: 'pipe' });
      }
      
      // Run build
      const buildOutput = execSync('npm run build', { encoding: 'utf8' });
      
      // Check for build errors
      if (buildOutput.includes('Error') || buildOutput.includes('Failed')) {
        this.results.issues.push({
          category: 'Build',
          severity: 'Critical',
          issue: 'Build process failed',
          details: buildOutput
        });
        this.log('   ❌ Build failed', 'red');
      } else {
        this.log('   ✅ Build successful', 'green');
        this.results.preDeployment.build = 'Pass';
      }
      
      // Check build artifacts
      const buildArtifacts = [
        '.next/static',
        '.next/server',
        '.next/standalone'
      ];
      
      buildArtifacts.forEach(artifact => {
        if (fs.existsSync(artifact)) {
          this.log(`   ✅ ${artifact} exists`, 'green');
        } else {
          this.log(`   ⚠️  ${artifact} missing`, 'yellow');
        }
      });
      
    } catch (error) {
      this.log(`   ❌ Build check failed: ${error.message}`, 'red');
      this.results.issues.push({
        category: 'Build',
        severity: 'Critical',
        issue: 'Build process error',
        details: error.message
      });
    }
  }

  async checkEnvironmentVariables() {
    this.log('🔧 Checking environment variables...', 'blue');
    
    const requiredEnvVars = [
      'MONGODB_URI',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY'
    ];
    
    const envFile = '.env.local';
    if (fs.existsSync(envFile)) {
      const envContent = fs.readFileSync(envFile, 'utf8');
      
      requiredEnvVars.forEach(envVar => {
        if (envContent.includes(envVar)) {
          this.log(`   ✅ ${envVar} configured`, 'green');
        } else {
          this.log(`   ❌ ${envVar} missing`, 'red');
          this.results.issues.push({
            category: 'Environment',
            severity: 'High',
            issue: `Missing environment variable: ${envVar}`,
            recommendation: `Add ${envVar} to your environment configuration`
          });
        }
      });
    } else {
      this.log('   ⚠️  .env.local file not found', 'yellow');
      this.results.issues.push({
        category: 'Environment',
        severity: 'High',
        issue: 'Environment file missing',
        recommendation: 'Create .env.local file with required variables'
      });
    }
  }

  async checkSecurity() {
    this.log('🔒 Checking security...', 'blue');
    
    try {
      // Run security audit
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditOutput);
      
      if (audit.vulnerabilities) {
        const vulnCount = Object.keys(audit.vulnerabilities).length;
        if (vulnCount > 0) {
          this.log(`   ⚠️  ${vulnCount} vulnerabilities found`, 'yellow');
          this.results.issues.push({
            category: 'Security',
            severity: vulnCount > 5 ? 'High' : 'Medium',
            issue: 'Security vulnerabilities detected',
            recommendation: 'Run "npm audit fix" to resolve vulnerabilities'
          });
        } else {
          this.log('   ✅ No vulnerabilities found', 'green');
        }
      }
      
      // Check for sensitive data in code
      const sensitivePatterns = [
        /password\s*=\s*['"][^'"]+['"]/gi,
        /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
        /secret\s*=\s*['"][^'"]+['"]/gi
      ];
      
      const codeFiles = this.findCodeFiles();
      let sensitiveDataFound = false;
      
      codeFiles.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          sensitivePatterns.forEach(pattern => {
            if (pattern.test(content)) {
              sensitiveDataFound = true;
            }
          });
        } catch (error) {
          // Skip files that can't be read
        }
      });
      
      if (sensitiveDataFound) {
        this.log('   ⚠️  Potential sensitive data in code', 'yellow');
        this.results.issues.push({
          category: 'Security',
          severity: 'High',
          issue: 'Sensitive data in source code',
          recommendation: 'Remove hardcoded secrets and use environment variables'
        });
      } else {
        this.log('   ✅ No sensitive data found in code', 'green');
      }
      
    } catch (error) {
      this.log(`   ❌ Security check failed: ${error.message}`, 'red');
    }
  }

  async checkPerformance() {
    this.log('⚡ Checking performance...', 'blue');
    
    try {
      // Check bundle size
      const bundleSize = this.getDirectorySize('.next/static');
      const totalSize = bundleSize.reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = totalSize / 1024 / 1024;
      
      this.log(`   Bundle size: ${totalSizeMB.toFixed(2)} MB`, 
        totalSizeMB > 5 ? 'red' : totalSizeMB > 2 ? 'yellow' : 'green');
      
      if (totalSizeMB > 5) {
        this.results.issues.push({
          category: 'Performance',
          severity: 'High',
          issue: 'Large bundle size',
          recommendation: 'Optimize bundle size using code splitting and tree shaking'
        });
      }
      
      // Check for large files
      const largeFiles = bundleSize.filter(file => file.size > 1024 * 1024);
      if (largeFiles.length > 0) {
        this.log(`   ⚠️  ${largeFiles.length} large files found`, 'yellow');
        largeFiles.forEach(file => {
          this.log(`      ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)} MB`, 'yellow');
        });
      }
      
    } catch (error) {
      this.log(`   ❌ Performance check failed: ${error.message}`, 'red');
    }
  }

  async checkTestCoverage() {
    this.log('🧪 Checking test coverage...', 'blue');
    
    try {
      // Run test coverage
      execSync('npm run test:coverage', { stdio: 'pipe' });
      
      // Read coverage report
      const coveragePath = './coverage/coverage-summary.json';
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        const lineCoverage = coverage.total.lines.pct;
        
        this.log(`   Test coverage: ${lineCoverage}%`, 
          lineCoverage >= 80 ? 'green' : lineCoverage >= 60 ? 'yellow' : 'red');
        
        if (lineCoverage < 80) {
          this.results.issues.push({
            category: 'Testing',
            severity: 'Medium',
            issue: 'Low test coverage',
            recommendation: 'Increase test coverage to at least 80%'
          });
        }
      }
      
    } catch (error) {
      this.log(`   ❌ Test coverage check failed: ${error.message}`, 'red');
    }
  }

  async checkPostDeployment() {
    this.logSection('Post-Deployment Validation');
    
    // Check if deployment is accessible
    await this.checkDeploymentAccess();
    
    // Check critical pages
    await this.checkCriticalPages();
    
    // Check API endpoints
    await this.checkAPIEndpoints();
    
    // Check performance
    await this.checkDeploymentPerformance();
  }

  async checkDeploymentAccess() {
    this.log('🌐 Checking deployment access...', 'blue');
    
    try {
      const response = await fetch(this.deploymentUrl);
      
      if (response.ok) {
        this.log('   ✅ Deployment is accessible', 'green');
        this.results.postDeployment.access = 'Pass';
      } else {
        this.log(`   ❌ Deployment returned status: ${response.status}`, 'red');
        this.results.issues.push({
          category: 'Deployment',
          severity: 'Critical',
          issue: 'Deployment not accessible',
          details: `HTTP ${response.status}`
        });
      }
      
    } catch (error) {
      this.log(`   ❌ Cannot access deployment: ${error.message}`, 'red');
      this.results.issues.push({
        category: 'Deployment',
        severity: 'Critical',
        issue: 'Deployment unreachable',
        details: error.message
      });
    }
  }

  async checkCriticalPages() {
    this.log('📄 Checking critical pages...', 'blue');
    
    const criticalPages = [
      '/',
      '/login',
      '/register',
      '/venues',
      '/vendors',
      '/about',
      '/contact'
    ];
    
    for (const page of criticalPages) {
      try {
        const response = await fetch(`${this.deploymentUrl}${page}`);
        
        if (response.ok) {
          this.log(`   ✅ ${page} - OK`, 'green');
        } else {
          this.log(`   ❌ ${page} - ${response.status}`, 'red');
          this.results.issues.push({
            category: 'Pages',
            severity: 'High',
            issue: `Page ${page} not accessible`,
            details: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        this.log(`   ❌ ${page} - Error: ${error.message}`, 'red');
      }
    }
  }

  async checkAPIEndpoints() {
    this.log('🔌 Checking API endpoints...', 'blue');
    
    const apiEndpoints = [
      '/api/venues',
      '/api/vendors',
      '/api/users',
      '/api/auth/session'
    ];
    
    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(`${this.deploymentUrl}${endpoint}`);
        
        if (response.ok || response.status === 401) { // 401 is OK for auth endpoints
          this.log(`   ✅ ${endpoint} - OK`, 'green');
        } else {
          this.log(`   ❌ ${endpoint} - ${response.status}`, 'red');
          this.results.issues.push({
            category: 'API',
            severity: 'High',
            issue: `API endpoint ${endpoint} not working`,
            details: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        this.log(`   ❌ ${endpoint} - Error: ${error.message}`, 'red');
      }
    }
  }

  async checkDeploymentPerformance() {
    this.log('⚡ Checking deployment performance...', 'blue');
    
    try {
      const startTime = Date.now();
      const response = await fetch(this.deploymentUrl);
      const loadTime = Date.now() - startTime;
      
      this.log(`   Load time: ${loadTime}ms`, 
        loadTime < 1000 ? 'green' : loadTime < 3000 ? 'yellow' : 'red');
      
      if (loadTime > 3000) {
        this.results.issues.push({
          category: 'Performance',
          severity: 'High',
          issue: 'Slow page load time',
          recommendation: 'Optimize page loading performance'
        });
      }
      
    } catch (error) {
      this.log(`   ❌ Performance check failed: ${error.message}`, 'red');
    }
  }

  findCodeFiles() {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    const files = [];
    
    function scanDirectory(dir) {
      try {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scanDirectory(itemPath);
          } else if (stats.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(itemPath);
          }
        });
      } catch (error) {
        // Skip directories that can't be read
      }
    }
    
    scanDirectory('.');
    return files;
  }

  getDirectorySize(dirPath) {
    const files = [];
    
    function scanDirectory(currentPath) {
      try {
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
      } catch (error) {
        // Skip directories that can't be read
      }
    }
    
    scanDirectory(dirPath);
    return files;
  }

  generateReport() {
    this.logSection('Deployment Validation Report');
    
    const criticalIssues = this.results.issues.filter(issue => issue.severity === 'Critical');
    const highIssues = this.results.issues.filter(issue => issue.severity === 'High');
    const mediumIssues = this.results.issues.filter(issue => issue.severity === 'Medium');
    
    this.log(`\n📊 Validation Summary:`, 'bold');
    this.log(`   Critical Issues: ${criticalIssues.length}`, criticalIssues.length > 0 ? 'red' : 'green');
    this.log(`   High Issues: ${highIssues.length}`, highIssues.length > 0 ? 'red' : 'green');
    this.log(`   Medium Issues: ${mediumIssues.length}`, mediumIssues.length > 0 ? 'yellow' : 'green');
    
    if (this.results.issues.length > 0) {
      this.log(`\n🔧 Issues Found:`, 'bold');
      
      this.results.issues.forEach((issue, index) => {
        this.log(`   ${index + 1}. [${issue.category}] ${issue.issue}`, 
          issue.severity === 'Critical' ? 'red' : issue.severity === 'High' ? 'red' : 'yellow');
        this.log(`      💡 ${issue.recommendation}`, 'yellow');
      });
    } else {
      this.log('\n🎉 No issues found! Deployment is ready.', 'green');
    }
    
    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      deploymentUrl: this.deploymentUrl,
      preDeployment: this.results.preDeployment,
      postDeployment: this.results.postDeployment,
      issues: this.results.issues,
      summary: {
        totalIssues: this.results.issues.length,
        criticalIssues: criticalIssues.length,
        highIssues: highIssues.length,
        mediumIssues: mediumIssues.length,
        deploymentReady: criticalIssues.length === 0 && highIssues.length === 0
      }
    };
    
    const reportPath = `deployment-validation-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');
    
    if (criticalIssues.length > 0) {
      this.log('\n❌ Deployment NOT ready - Critical issues must be resolved.', 'red');
      process.exit(1);
    } else if (highIssues.length > 0) {
      this.log('\n⚠️  Deployment ready with warnings - High priority issues should be addressed.', 'yellow');
    } else {
      this.log('\n🎉 Deployment is ready for production!', 'green');
    }
  }

  async runFullValidation() {
    this.log('🚀 Starting WeddingLK Deployment Validation', 'bold');
    this.log('============================================', 'bold');
    
    try {
      await this.checkPreDeployment();
      await this.checkPostDeployment();
      this.generateReport();
    } catch (error) {
      this.log(`💥 Validation failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Main execution
const validator = new DeploymentValidator();
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--full') {
  validator.runFullValidation();
} else if (args[0] === '--pre') {
  validator.checkPreDeployment();
} else if (args[0] === '--post') {
  validator.checkPostDeployment();
} else if (args[0] === '--help') {
  console.log(`
WeddingLK Deployment Validation Script

Usage:
  node scripts/deployment-validation.mjs [options]

Options:
  --full    Run complete validation (default)
  --pre     Run only pre-deployment checks
  --post    Run only post-deployment checks
  --help    Show this help

Examples:
  node scripts/deployment-validation.mjs
  node scripts/deployment-validation.mjs --pre
  node scripts/deployment-validation.mjs --post
  `);
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}
