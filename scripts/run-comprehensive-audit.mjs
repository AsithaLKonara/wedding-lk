#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const DEPLOY_URL = 'https://wedding-lkcom.vercel.app'
const REPORT_DIR = './audit-reports'
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-')

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true })
}

console.log('🔍 Starting Comprehensive WeddingLK Audit')
console.log(`📅 Timestamp: ${TIMESTAMP}`)
console.log(`🌐 Target URL: ${DEPLOY_URL}`)
console.log('=' * 60)

const auditResults = {
  timestamp: TIMESTAMP,
  deployUrl: DEPLOY_URL,
  checks: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
}

function runCheck(name, command, description) {
  console.log(`\n🔍 ${name}`)
  console.log(`📝 ${description}`)
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 30000 
    })
    
    auditResults.checks[name] = {
      status: 'PASSED',
      output: output,
      description: description
    }
    auditResults.summary.total++
    auditResults.summary.passed++
    console.log(`✅ ${name}: PASSED`)
    
  } catch (error) {
    auditResults.checks[name] = {
      status: 'FAILED',
      error: error.message,
      output: error.stdout || error.stderr,
      description: description
    }
    auditResults.summary.total++
    auditResults.summary.failed++
    console.log(`❌ ${name}: FAILED`)
    console.log(`   Error: ${error.message}`)
  }
}

function runWarningCheck(name, command, description) {
  console.log(`\n⚠️  ${name}`)
  console.log(`📝 ${description}`)
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 15000 
    })
    
    auditResults.checks[name] = {
      status: 'WARNING',
      output: output,
      description: description
    }
    auditResults.summary.total++
    auditResults.summary.warnings++
    console.log(`⚠️  ${name}: WARNING`)
    
  } catch (error) {
    auditResults.checks[name] = {
      status: 'WARNING',
      error: error.message,
      output: error.stdout || error.stderr,
      description: description
    }
    auditResults.summary.total++
    auditResults.summary.warnings++
    console.log(`⚠️  ${name}: WARNING`)
  }
}

// 1. Static Code Analysis
console.log('\n📊 PHASE 1: STATIC CODE ANALYSIS')
console.log('=' * 40)

runCheck(
  'ESLint Check',
  'npm run lint',
  'Check for JavaScript/TypeScript linting issues'
)

runCheck(
  'TypeScript Check',
  'npx tsc --noEmit',
  'Check for TypeScript compilation errors'
)

runCheck(
  'Build Check',
  'npm run build',
  'Verify production build succeeds'
)

// 2. Dependency & Security Analysis
console.log('\n🔒 PHASE 2: DEPENDENCY & SECURITY ANALYSIS')
console.log('=' * 40)

runCheck(
  'NPM Audit',
  'npm audit --production',
  'Check for known security vulnerabilities in dependencies'
)

runWarningCheck(
  'Dependency Check',
  'npx depcheck',
  'Check for unused dependencies'
)

runWarningCheck(
  'Outdated Packages',
  'npm outdated',
  'Check for outdated package versions'
)

// 3. Security Scans
console.log('\n🛡️  PHASE 3: SECURITY SCANS')
console.log('=' * 40)

runWarningCheck(
  'Git Secrets Scan',
  'npx gitleaks detect -s . --no-git',
  'Scan for accidentally committed secrets'
)

runWarningCheck(
  'Semgrep Security Scan',
  'npx semgrep --config=p/javascript --json',
  'Static security analysis with Semgrep'
)

// 4. E2E Testing with Playwright
console.log('\n🎭 PHASE 4: END-TO-END TESTING')
console.log('=' * 40)

runCheck(
  'Playwright Installation',
  'npx playwright install chromium',
  'Install Playwright browsers'
)

runCheck(
  'Playwright Comprehensive Tests',
  `npx playwright test tests/audit-comprehensive.spec.ts --project=chromium --reporter=json`,
  'Run comprehensive E2E tests against live deployment'
)

// 5. Performance & Accessibility
console.log('\n⚡ PHASE 5: PERFORMANCE & ACCESSIBILITY')
console.log('=' * 40)

runWarningCheck(
  'Lighthouse Performance',
  `npx lighthouse ${DEPLOY_URL} --output=json --output-path=${REPORT_DIR}/lighthouse-${TIMESTAMP}.json --chrome-flags="--headless"`,
  'Run Lighthouse performance audit'
)

// 6. API Testing
console.log('\n🔌 PHASE 6: API ENDPOINT TESTING')
console.log('=' * 40)

const apiEndpoints = [
  '/api/venues',
  '/api/vendors',
  '/api/services',
  '/api/bookings',
  '/api/users'
]

for (const endpoint of apiEndpoints) {
  runWarningCheck(
    `API ${endpoint}`,
    `curl -s -o /dev/null -w "%{http_code}" ${DEPLOY_URL}${endpoint}`,
    `Test API endpoint ${endpoint} availability`
  )
}

// 7. Generate Reports
console.log('\n📋 PHASE 7: GENERATING REPORTS')
console.log('=' * 40)

// Save audit results
const reportPath = path.join(REPORT_DIR, `audit-results-${TIMESTAMP}.json`)
fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2))

// Generate summary report
const summaryReport = `
# WeddingLK Comprehensive Audit Report

**Timestamp:** ${TIMESTAMP}  
**Target URL:** ${DEPLOY_URL}  
**Total Checks:** ${auditResults.summary.total}  
**Passed:** ${auditResults.summary.passed}  
**Failed:** ${auditResults.summary.failed}  
**Warnings:** ${auditResults.summary.warnings}  

## Summary

${auditResults.summary.failed === 0 ? '✅ All critical checks passed!' : `❌ ${auditResults.summary.failed} critical issues found`}

## Detailed Results

${Object.entries(auditResults.checks).map(([name, result]) => `
### ${name}
- **Status:** ${result.status}
- **Description:** ${result.description}
${result.error ? `- **Error:** ${result.error}` : ''}
${result.output ? `- **Output:** \`\`\`\n${result.output.substring(0, 500)}${result.output.length > 500 ? '...' : ''}\n\`\`\`` : ''}
`).join('\n')}

## Next Steps

${auditResults.summary.failed > 0 ? `
### Critical Issues to Fix:
${Object.entries(auditResults.checks)
  .filter(([_, result]) => result.status === 'FAILED')
  .map(([name, _]) => `- Fix ${name}`)
  .join('\n')}
` : ''}

${auditResults.summary.warnings > 0 ? `
### Warnings to Address:
${Object.entries(auditResults.checks)
  .filter(([_, result]) => result.status === 'WARNING')
  .map(([name, _]) => `- Review ${name}`)
  .join('\n')}
` : ''}

### Recommended Actions:
1. Review failed checks and fix critical issues
2. Address warnings to improve code quality
3. Set up CI/CD pipeline to run these checks automatically
4. Implement monitoring for production deployment
5. Add automated testing to prevent regressions

---
*Generated by WeddingLK Audit Script*
`

const summaryPath = path.join(REPORT_DIR, `audit-summary-${TIMESTAMP}.md`)
fs.writeFileSync(summaryPath, summaryReport)

// 8. Final Summary
console.log('\n🎉 AUDIT COMPLETE')
console.log('=' * 60)
console.log(`📊 Total Checks: ${auditResults.summary.total}`)
console.log(`✅ Passed: ${auditResults.summary.passed}`)
console.log(`❌ Failed: ${auditResults.summary.failed}`)
console.log(`⚠️  Warnings: ${auditResults.summary.warnings}`)
console.log(`\n📁 Reports saved to: ${REPORT_DIR}`)
console.log(`📋 Summary: ${summaryPath}`)
console.log(`📊 Details: ${reportPath}`)

if (auditResults.summary.failed > 0) {
  console.log(`\n🚨 ${auditResults.summary.failed} critical issues found - please review and fix`)
  process.exit(1)
} else {
  console.log(`\n✅ All critical checks passed!`)
  process.exit(0)
}
