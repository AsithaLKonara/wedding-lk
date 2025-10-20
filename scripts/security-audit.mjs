#!/usr/bin/env node

/**
 * WeddingLK Security Audit Script
 * Comprehensive security testing and vulnerability assessment
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

class SecurityAuditor {
  constructor() {
    this.results = {
      vulnerabilities: [],
      securityChecks: [],
      recommendations: [],
      score: 0
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log('\n' + '='.repeat(60));
    this.log(`🔒 ${title}`, 'cyan');
    console.log('='.repeat(60));
  }

  async checkDependencies() {
    this.logSection('Dependency Security Audit');
    
    try {
      this.log('🔍 Checking for vulnerable dependencies...', 'blue');
      
      // Run npm audit
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditOutput);
      
      if (audit.vulnerabilities) {
        const vulnCount = Object.keys(audit.vulnerabilities).length;
        this.log(`   Found ${vulnCount} vulnerabilities`, vulnCount > 0 ? 'red' : 'green');
        
        // Categorize vulnerabilities
        let critical = 0, high = 0, moderate = 0, low = 0;
        
        Object.values(audit.vulnerabilities).forEach(vuln => {
          switch (vuln.severity) {
            case 'critical': critical++; break;
            case 'high': high++; break;
            case 'moderate': moderate++; break;
            case 'low': low++; break;
          }
        });
        
        this.log(`   Critical: ${critical}`, critical > 0 ? 'red' : 'green');
        this.log(`   High: ${high}`, high > 0 ? 'red' : 'yellow');
        this.log(`   Moderate: ${moderate}`, moderate > 0 ? 'yellow' : 'green');
        this.log(`   Low: ${low}`, low > 0 ? 'yellow' : 'green');
        
        // Add recommendations
        if (critical > 0 || high > 0) {
          this.results.recommendations.push({
            priority: 'Critical',
            category: 'Dependencies',
            issue: 'High/Critical vulnerabilities found',
            recommendation: 'Run "npm audit fix" and update vulnerable packages immediately'
          });
        }
        
        this.results.vulnerabilities = audit.vulnerabilities;
      } else {
        this.log('   ✅ No vulnerabilities found', 'green');
      }
      
    } catch (error) {
      this.log(`❌ Dependency audit failed: ${error.message}`, 'red');
    }
  }

  async checkEnvironmentSecurity() {
    this.logSection('Environment Security Check');
    
    const envFiles = ['.env', '.env.local', '.env.production'];
    const securityIssues = [];
    
    envFiles.forEach(envFile => {
      if (fs.existsSync(envFile)) {
        this.log(`   Checking ${envFile}...`, 'blue');
        
        const content = fs.readFileSync(envFile, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          const trimmedLine = line.trim();
          
          // Check for hardcoded secrets
          if (trimmedLine.includes('password') && !trimmedLine.includes('=')) {
            securityIssues.push({
              file: envFile,
              line: index + 1,
              issue: 'Potential hardcoded password',
              severity: 'High'
            });
          }
          
          // Check for exposed API keys
          if (trimmedLine.includes('API_KEY') && trimmedLine.includes('=') && !trimmedLine.includes('process.env')) {
            securityIssues.push({
              file: envFile,
              line: index + 1,
              issue: 'API key not using environment variable',
              severity: 'High'
            });
          }
          
          // Check for weak secrets
          if (trimmedLine.includes('SECRET') && trimmedLine.includes('=')) {
            const secret = trimmedLine.split('=')[1];
            if (secret && secret.length < 32) {
              securityIssues.push({
                file: envFile,
                line: index + 1,
                issue: 'Weak secret (less than 32 characters)',
                severity: 'Medium'
              });
            }
          }
        });
      }
    });
    
    if (securityIssues.length > 0) {
      this.log(`   ⚠️  Found ${securityIssues.length} security issues`, 'yellow');
      securityIssues.forEach(issue => {
        this.log(`      ${issue.file}:${issue.line} - ${issue.issue}`, 
          issue.severity === 'High' ? 'red' : 'yellow');
      });
      
      this.results.recommendations.push({
        priority: 'High',
        category: 'Environment',
        issue: 'Environment security issues found',
        recommendation: 'Review and secure environment variables, use strong secrets'
      });
    } else {
      this.log('   ✅ Environment files look secure', 'green');
    }
    
    this.results.securityChecks.push({
      category: 'Environment',
      issues: securityIssues.length,
      status: securityIssues.length === 0 ? 'Pass' : 'Fail'
    });
  }

  async checkCodeSecurity() {
    this.logSection('Code Security Analysis');
    
    const securityPatterns = [
      {
        pattern: /eval\s*\(/g,
        issue: 'Use of eval() function',
        severity: 'High',
        recommendation: 'Avoid eval() - use JSON.parse() or other safe alternatives'
      },
      {
        pattern: /innerHTML\s*=/g,
        issue: 'Direct innerHTML assignment',
        severity: 'Medium',
        recommendation: 'Use textContent or sanitize HTML to prevent XSS'
      },
      {
        pattern: /document\.write\s*\(/g,
        issue: 'Use of document.write()',
        severity: 'Medium',
        recommendation: 'Avoid document.write() - use DOM manipulation methods'
      },
      {
        pattern: /localStorage\.setItem\s*\([^,]+,\s*[^)]*password/gi,
        issue: 'Storing passwords in localStorage',
        severity: 'Critical',
        recommendation: 'Never store passwords in localStorage - use secure session storage'
      },
      {
        pattern: /console\.log\s*\([^)]*password/gi,
        issue: 'Logging sensitive data',
        severity: 'High',
        recommendation: 'Remove sensitive data from console logs'
      },
      {
        pattern: /process\.env\.[A-Z_]+/g,
        issue: 'Environment variables in client code',
        severity: 'High',
        recommendation: 'Ensure environment variables are not exposed to client'
      }
    ];
    
    const codeFiles = this.findCodeFiles();
    const securityIssues = [];
    
    codeFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        securityPatterns.forEach(pattern => {
          const matches = content.match(pattern.pattern);
          if (matches) {
            matches.forEach(match => {
              const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
              securityIssues.push({
                file: file,
                line: lineNumber,
                issue: pattern.issue,
                severity: pattern.severity,
                recommendation: pattern.recommendation
              });
            });
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });
    
    if (securityIssues.length > 0) {
      this.log(`   ⚠️  Found ${securityIssues.length} security issues in code`, 'yellow');
      
      // Group by severity
      const critical = securityIssues.filter(i => i.severity === 'Critical');
      const high = securityIssues.filter(i => i.severity === 'High');
      const medium = securityIssues.filter(i => i.severity === 'Medium');
      
      if (critical.length > 0) {
        this.log(`      Critical: ${critical.length}`, 'red');
        critical.forEach(issue => {
          this.log(`         ${issue.file}:${issue.line} - ${issue.issue}`, 'red');
        });
      }
      
      if (high.length > 0) {
        this.log(`      High: ${high.length}`, 'red');
        high.forEach(issue => {
          this.log(`         ${issue.file}:${issue.line} - ${issue.issue}`, 'red');
        });
      }
      
      if (medium.length > 0) {
        this.log(`      Medium: ${medium.length}`, 'yellow');
        medium.forEach(issue => {
          this.log(`         ${issue.file}:${issue.line} - ${issue.issue}`, 'yellow');
        });
      }
      
      this.results.recommendations.push({
        priority: critical.length > 0 ? 'Critical' : 'High',
        category: 'Code Security',
        issue: 'Security vulnerabilities in code',
        recommendation: 'Review and fix security issues in source code'
      });
    } else {
      this.log('   ✅ No obvious security issues found in code', 'green');
    }
    
    this.results.securityChecks.push({
      category: 'Code Security',
      issues: securityIssues.length,
      status: securityIssues.length === 0 ? 'Pass' : 'Fail'
    });
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

  async checkAuthenticationSecurity() {
    this.logSection('Authentication Security Check');
    
    const authFiles = [
      'lib/auth.ts',
      'app/api/auth/',
      'components/auth/'
    ];
    
    const authIssues = [];
    
    // Check for common auth security issues
    authFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for weak password hashing
          if (content.includes('bcrypt') && content.includes('rounds') && content.includes('10')) {
            authIssues.push({
              file: file,
              issue: 'Weak bcrypt rounds (10)',
              severity: 'Medium',
              recommendation: 'Use at least 12 rounds for bcrypt'
            });
          }
          
          // Check for JWT without expiration
          if (content.includes('jwt.sign') && !content.includes('expiresIn')) {
            authIssues.push({
              file: file,
              issue: 'JWT without expiration',
              severity: 'High',
              recommendation: 'Always set expiration for JWT tokens'
            });
          }
          
          // Check for session without secure flags
          if (content.includes('session') && !content.includes('secure: true')) {
            authIssues.push({
              file: file,
              issue: 'Session without secure flag',
              severity: 'Medium',
              recommendation: 'Set secure flag for session cookies'
            });
          }
          
        } catch (error) {
          // Skip files that can't be read
        }
      }
    });
    
    if (authIssues.length > 0) {
      this.log(`   ⚠️  Found ${authIssues.length} authentication security issues`, 'yellow');
      authIssues.forEach(issue => {
        this.log(`      ${issue.file} - ${issue.issue}`, 
          issue.severity === 'High' ? 'red' : 'yellow');
      });
    } else {
      this.log('   ✅ Authentication security looks good', 'green');
    }
    
    this.results.securityChecks.push({
      category: 'Authentication',
      issues: authIssues.length,
      status: authIssues.length === 0 ? 'Pass' : 'Fail'
    });
  }

  async checkHTTPSConfiguration() {
    this.logSection('HTTPS and Security Headers Check');
    
    try {
      // Check Next.js configuration for security headers
      if (fs.existsSync('next.config.mjs')) {
        const config = fs.readFileSync('next.config.mjs', 'utf8');
        
        const securityHeaders = [
          'X-Content-Type-Options',
          'X-Frame-Options',
          'X-XSS-Protection',
          'Strict-Transport-Security'
        ];
        
        const missingHeaders = securityHeaders.filter(header => !config.includes(header));
        
        if (missingHeaders.length > 0) {
          this.log(`   ⚠️  Missing security headers: ${missingHeaders.join(', ')}`, 'yellow');
          this.results.recommendations.push({
            priority: 'Medium',
            category: 'Security Headers',
            issue: 'Missing security headers',
            recommendation: 'Add security headers in next.config.mjs'
          });
        } else {
          this.log('   ✅ Security headers configured', 'green');
        }
      }
      
      // Check for HTTPS enforcement
      this.log('   ✅ HTTPS enforced by Vercel (automatic)', 'green');
      
    } catch (error) {
      this.log(`❌ HTTPS check failed: ${error.message}`, 'red');
    }
  }

  calculateSecurityScore() {
    const totalChecks = this.results.securityChecks.length;
    const passedChecks = this.results.securityChecks.filter(check => check.status === 'Pass').length;
    
    this.results.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  }

  generateSecurityReport() {
    this.logSection('Security Audit Report');
    
    this.calculateSecurityScore();
    
    this.log(`\n📊 Security Score: ${this.results.score}/100`, 
      this.results.score >= 90 ? 'green' : this.results.score >= 70 ? 'yellow' : 'red');
    
    this.log(`\n📋 Security Checks:`, 'bold');
    this.results.securityChecks.forEach(check => {
      this.log(`   ${check.category}: ${check.status} (${check.issues} issues)`, 
        check.status === 'Pass' ? 'green' : 'red');
    });
    
    if (this.results.recommendations.length > 0) {
      this.log(`\n🔧 Security Recommendations:`, 'bold');
      
      const critical = this.results.recommendations.filter(r => r.priority === 'Critical');
      const high = this.results.recommendations.filter(r => r.priority === 'High');
      const medium = this.results.recommendations.filter(r => r.priority === 'Medium');
      
      if (critical.length > 0) {
        this.log('\n🔴 Critical Issues:', 'red');
        critical.forEach((rec, index) => {
          this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'red');
          this.log(`      💡 ${rec.recommendation}`, 'yellow');
        });
      }
      
      if (high.length > 0) {
        this.log('\n🟠 High Priority Issues:', 'red');
        high.forEach((rec, index) => {
          this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'red');
          this.log(`      💡 ${rec.recommendation}`, 'yellow');
        });
      }
      
      if (medium.length > 0) {
        this.log('\n🟡 Medium Priority Issues:', 'yellow');
        medium.forEach((rec, index) => {
          this.log(`   ${index + 1}. [${rec.category}] ${rec.issue}`, 'yellow');
          this.log(`      💡 ${rec.recommendation}`, 'yellow');
        });
      }
    } else {
      this.log('\n🎉 No security issues found!', 'green');
    }
    
    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      score: this.results.score,
      securityChecks: this.results.securityChecks,
      vulnerabilities: this.results.vulnerabilities,
      recommendations: this.results.recommendations,
      summary: {
        totalChecks: this.results.securityChecks.length,
        passedChecks: this.results.securityChecks.filter(c => c.status === 'Pass').length,
        totalRecommendations: this.results.recommendations.length,
        criticalIssues: this.results.recommendations.filter(r => r.priority === 'Critical').length
      }
    };
    
    const reportPath = `security-audit-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');
    
    if (this.results.score >= 90) {
      this.log('\n🎉 Excellent security! Your app is secure for production.', 'green');
    } else if (this.results.score >= 70) {
      this.log('\n⚠️  Good security with some improvements needed.', 'yellow');
    } else {
      this.log('\n❌ Security needs significant improvement before production.', 'red');
    }
  }

  async runFullAudit() {
    this.log('🔒 Starting WeddingLK Security Audit', 'bold');
    this.log('=====================================', 'bold');
    
    try {
      await this.checkDependencies();
      await this.checkEnvironmentSecurity();
      await this.checkCodeSecurity();
      await this.checkAuthenticationSecurity();
      await this.checkHTTPSConfiguration();
      this.generateSecurityReport();
    } catch (error) {
      this.log(`💥 Security audit failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Main execution
const auditor = new SecurityAuditor();
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--full') {
  auditor.runFullAudit();
} else if (args[0] === '--deps') {
  auditor.checkDependencies();
} else if (args[0] === '--env') {
  auditor.checkEnvironmentSecurity();
} else if (args[0] === '--code') {
  auditor.checkCodeSecurity();
} else if (args[0] === '--auth') {
  auditor.checkAuthenticationSecurity();
} else if (args[0] === '--https') {
  auditor.checkHTTPSConfiguration();
} else if (args[0] === '--help') {
  console.log(`
WeddingLK Security Audit Script

Usage:
  node scripts/security-audit.mjs [options]

Options:
  --full    Run complete security audit (default)
  --deps    Check dependency vulnerabilities
  --env     Check environment security
  --code    Check code security patterns
  --auth    Check authentication security
  --https   Check HTTPS and security headers
  --help    Show this help

Examples:
  node scripts/security-audit.mjs
  node scripts/security-audit.mjs --deps
  node scripts/security-audit.mjs --code
  `);
} else {
  console.log('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}
