#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Starting Performance Monitoring...')

// Function to run Lighthouse audit
async function runLighthouse() {
  try {
    console.log('📊 Running Lighthouse audit...')
    execSync('npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"', { stdio: 'inherit' })
    
    if (fs.existsSync('./lighthouse-report.json')) {
      const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'))
      
      console.log('\n📈 Performance Scores:')
      console.log(`Performance: ${Math.round(report.categories.performance.score * 100)}`)
      console.log(`Accessibility: ${Math.round(report.categories.accessibility.score * 100)}`)
      console.log(`Best Practices: ${Math.round(report.categories['best-practices'].score * 100)}`)
      console.log(`SEO: ${Math.round(report.categories.seo.score * 100)}`)
      
      // Save detailed report
      fs.writeFileSync('./performance-report.md', `
# Performance Report

Generated on: ${new Date().toISOString()}

## Scores
- Performance: ${Math.round(report.categories.performance.score * 100)}/100
- Accessibility: ${Math.round(report.categories.accessibility.score * 100)}/100
- Best Practices: ${Math.round(report.categories['best-practices'].score * 100)}/100
- SEO: ${Math.round(report.categories.seo.score * 100)}/100

## Core Web Vitals
- LCP: ${report.audits['largest-contentful-paint']?.displayValue || 'N/A'}
- FID: ${report.audits['max-potential-fid']?.displayValue || 'N/A'}
- CLS: ${report.audits['cumulative-layout-shift']?.displayValue || 'N/A'}

## Recommendations
${report.categories.performance.auditRefs
  .filter(audit => audit.score < 1)
  .map(audit => `- ${audit.title}: ${audit.description}`)
  .join('\n')}
      `)
      
      console.log('\n✅ Performance report generated: performance-report.md')
    }
  } catch (error) {
    console.error('❌ Error running Lighthouse:', error.message)
  }
}

// Function to analyze bundle size
async function analyzeBundle() {
  try {
    console.log('📦 Analyzing bundle size...')
    execSync('npm run build:analyze', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message)
  }
}

// Function to check build performance
async function checkBuildPerformance() {
  try {
    console.log('🔨 Checking build performance...')
    const startTime = Date.now()
    execSync('npm run build', { stdio: 'pipe' })
    const endTime = Date.now()
    const buildTime = (endTime - startTime) / 1000
    
    console.log(`⏱️ Build time: ${buildTime.toFixed(2)}s`)
    
    // Check bundle sizes
    const statsPath = path.join(process.cwd(), '.next', 'build-manifest.json')
    if (fs.existsSync(statsPath)) {
      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'))
      console.log('📊 Build manifest generated successfully')
    }
  } catch (error) {
    console.error('❌ Error checking build performance:', error.message)
  }
}

// Main execution
async function main() {
  console.log('🎯 Performance Monitoring Suite')
  console.log('================================')
  
  // Check if dev server is running
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' })
    console.log('✅ Development server is running')
  } catch (error) {
    console.log('⚠️ Development server not running. Please start it with: npm run dev')
    return
  }
  
  await runLighthouse()
  await analyzeBundle()
  await checkBuildPerformance()
  
  console.log('\n🎉 Performance monitoring completed!')
}

main().catch(console.error)
