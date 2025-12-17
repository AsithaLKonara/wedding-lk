import { Page, ConsoleMessage } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export type ConsoleLogType = 'log' | 'error' | 'warn' | 'info' | 'debug';

export interface ConsoleLogEntry {
  type: ConsoleLogType;
  text: string;
  timestamp: number;
  url?: string;
  stack?: string;
}

export interface ConsoleLogCollection {
  logs: ConsoleLogEntry[];
  errors: ConsoleLogEntry[];
  warnings: ConsoleLogEntry[];
  info: ConsoleLogEntry[];
  debug: ConsoleLogEntry[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    debug: number;
    logs: number;
  };
}

/**
 * Setup console listener on a page
 */
export function setupConsoleListener(page: Page): ConsoleLogCollection {
  const collection: ConsoleLogCollection = {
    logs: [],
    errors: [],
    warnings: [],
    info: [],
    debug: [],
    summary: {
      total: 0,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
      logs: 0,
    },
  };

  page.on('console', (msg: ConsoleMessage) => {
    const logEntry: ConsoleLogEntry = {
      type: msg.type() as ConsoleLogType,
      text: msg.text(),
      timestamp: Date.now(),
      url: page.url(),
    };

    // Add stack trace for errors
    if (msg.type() === 'error') {
      const location = msg.location();
      logEntry.stack = `${location.url}:${location.lineNumber}:${location.columnNumber}`;
    }

    // Add to appropriate collection
    collection.logs.push(logEntry);
    collection.summary.total++;

    switch (msg.type()) {
      case 'error':
        collection.errors.push(logEntry);
        collection.summary.errors++;
        break;
      case 'warn':
        collection.warnings.push(logEntry);
        collection.summary.warnings++;
        break;
      case 'info':
        collection.info.push(logEntry);
        collection.summary.info++;
        break;
      case 'debug':
        collection.debug.push(logEntry);
        collection.summary.debug++;
        break;
      default:
        collection.summary.logs++;
        break;
    }
  });

  return collection;
}

/**
 * Collect console logs from page
 */
export async function collectConsoleLogs(page: Page): Promise<ConsoleLogCollection> {
  const collection = setupConsoleListener(page);
  
  // Wait a bit to collect any initial logs
  await page.waitForTimeout(1000);
  
  return collection;
}

/**
 * Filter console logs by type
 */
export function filterConsoleByType(
  collection: ConsoleLogCollection,
  type: ConsoleLogType
): ConsoleLogEntry[] {
  switch (type) {
    case 'error':
      return collection.errors;
    case 'warn':
      return collection.warnings;
    case 'info':
      return collection.info;
    case 'debug':
      return collection.debug;
    default:
      return collection.logs.filter(log => log.type === type);
  }
}

/**
 * Analyze console errors for patterns
 */
export interface ErrorAnalysis {
  errorCount: number;
  uniqueErrors: string[];
  errorPatterns: Map<string, number>;
  criticalErrors: ConsoleLogEntry[];
  apiErrors: ConsoleLogEntry[];
  authErrors: ConsoleLogEntry[];
  networkErrors: ConsoleLogEntry[];
}

export function analyzeConsoleErrors(collection: ConsoleLogCollection): ErrorAnalysis {
  const analysis: ErrorAnalysis = {
    errorCount: collection.errors.length,
    uniqueErrors: [],
    errorPatterns: new Map(),
    criticalErrors: [],
    apiErrors: [],
    authErrors: [],
    networkErrors: [],
  };

  const errorTexts = new Set<string>();

  collection.errors.forEach(error => {
    const text = error.text.toLowerCase();
    
    // Track unique errors
    if (!errorTexts.has(error.text)) {
      errorTexts.add(error.text);
      analysis.uniqueErrors.push(error.text);
    }

    // Track error patterns
    const pattern = extractErrorPattern(error.text);
    analysis.errorPatterns.set(pattern, (analysis.errorPatterns.get(pattern) || 0) + 1);

    // Categorize errors
    if (text.includes('failed') || text.includes('critical') || text.includes('fatal')) {
      analysis.criticalErrors.push(error);
    }
    
    if (text.includes('api') || text.includes('fetch') || text.includes('network') || text.includes('request')) {
      analysis.apiErrors.push(error);
    }
    
    if (text.includes('auth') || text.includes('login') || text.includes('token') || text.includes('unauthorized')) {
      analysis.authErrors.push(error);
    }
    
    if (text.includes('network') || text.includes('connection') || text.includes('timeout') || text.includes('failed to fetch')) {
      analysis.networkErrors.push(error);
    }
  });

  return analysis;
}

/**
 * Extract error pattern from error message
 */
function extractErrorPattern(errorText: string): string {
  // Extract common error patterns
  if (errorText.includes('TypeError')) return 'TypeError';
  if (errorText.includes('ReferenceError')) return 'ReferenceError';
  if (errorText.includes('SyntaxError')) return 'SyntaxError';
  if (errorText.includes('NetworkError')) return 'NetworkError';
  if (errorText.includes('Failed to fetch')) return 'Failed to fetch';
  if (errorText.includes('401')) return '401 Unauthorized';
  if (errorText.includes('403')) return '403 Forbidden';
  if (errorText.includes('404')) return '404 Not Found';
  if (errorText.includes('500')) return '500 Server Error';
  
  // Extract first few words as pattern
  const words = errorText.split(' ').slice(0, 3).join(' ');
  return words.length > 50 ? words.substring(0, 50) + '...' : words;
}

/**
 * Generate console report
 */
export interface ConsoleReport {
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    debug: number;
    logs: number;
  };
  errorAnalysis: ErrorAnalysis;
  warnings: ConsoleLogEntry[];
  recentErrors: ConsoleLogEntry[];
  recommendations: string[];
}

export function generateConsoleReport(collection: ConsoleLogCollection): ConsoleReport {
  const errorAnalysis = analyzeConsoleErrors(collection);
  const recentErrors = collection.errors.slice(-10); // Last 10 errors
  
  const recommendations: string[] = [];
  
  if (errorAnalysis.errorCount > 0) {
    recommendations.push(`Found ${errorAnalysis.errorCount} console errors that need attention`);
  }
  
  if (errorAnalysis.criticalErrors.length > 0) {
    recommendations.push(`Found ${errorAnalysis.criticalErrors.length} critical errors`);
  }
  
  if (errorAnalysis.apiErrors.length > 0) {
    recommendations.push(`Found ${errorAnalysis.apiErrors.length} API-related errors`);
  }
  
  if (errorAnalysis.authErrors.length > 0) {
    recommendations.push(`Found ${errorAnalysis.authErrors.length} authentication-related errors`);
  }
  
  if (errorAnalysis.networkErrors.length > 0) {
    recommendations.push(`Found ${errorAnalysis.networkErrors.length} network-related errors`);
  }
  
  if (collection.warnings.length > 0) {
    recommendations.push(`Found ${collection.warnings.length} warnings that should be reviewed`);
  }

  return {
    summary: collection.summary,
    errorAnalysis,
    warnings: collection.warnings,
    recentErrors,
    recommendations,
  };
}

/**
 * Assert no console errors (or allow specific errors)
 */
export function assertNoConsoleErrors(
  collection: ConsoleLogCollection,
  allowedErrors: string[] = []
): void {
  const criticalErrors = collection.errors.filter(error => {
    const text = error.text.toLowerCase();
    return !allowedErrors.some(allowed => text.includes(allowed.toLowerCase()));
  });

  if (criticalErrors.length > 0) {
    const errorMessages = criticalErrors.map(e => e.text).join('\n');
    throw new Error(`Found ${criticalErrors.length} console errors:\n${errorMessages}`);
  }
}

/**
 * Save console report to file
 */
export async function saveConsoleReport(
  report: ConsoleReport,
  testName: string,
  outputDir: string = 'test-results/console-reports'
): Promise<string> {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `console-report-${testName}-${timestamp}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

  return filepath;
}

/**
 * Generate HTML console report
 */
export function generateHTMLConsoleReport(report: ConsoleReport, testName: string): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Console Report - ${testName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
    .stat-card.error { border-left-color: #dc3545; }
    .stat-card.warning { border-left-color: #ffc107; }
    .stat-card.info { border-left-color: #17a2b8; }
    .stat-number { font-size: 24px; font-weight: bold; color: #333; }
    .stat-label { color: #666; font-size: 14px; }
    .section { margin: 30px 0; }
    .error-item { background: #fff3cd; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #ffc107; }
    .critical-error { background: #f8d7da; border-left-color: #dc3545; }
    .recommendations { background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .recommendations ul { margin: 10px 0; padding-left: 20px; }
    .recommendations li { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Console Report: ${testName}</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
      <div class="stat-card error">
        <div class="stat-number">${report.summary.errors}</div>
        <div class="stat-label">Errors</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-number">${report.summary.warnings}</div>
        <div class="stat-label">Warnings</div>
      </div>
      <div class="stat-card info">
        <div class="stat-number">${report.summary.info}</div>
        <div class="stat-label">Info</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${report.summary.total}</div>
        <div class="stat-label">Total Logs</div>
      </div>
    </div>

    <div class="section">
      <h2>Error Analysis</h2>
      <p><strong>Total Errors:</strong> ${report.errorAnalysis.errorCount}</p>
      <p><strong>Unique Errors:</strong> ${report.errorAnalysis.uniqueErrors.length}</p>
      <p><strong>Critical Errors:</strong> ${report.errorAnalysis.criticalErrors.length}</p>
      <p><strong>API Errors:</strong> ${report.errorAnalysis.apiErrors.length}</p>
      <p><strong>Auth Errors:</strong> ${report.errorAnalysis.authErrors.length}</p>
      <p><strong>Network Errors:</strong> ${report.errorAnalysis.networkErrors.length}</p>
    </div>

    <div class="section">
      <h2>Recent Errors</h2>
      ${report.recentErrors.map(error => `
        <div class="error-item ${error.text.toLowerCase().includes('critical') || error.text.toLowerCase().includes('fatal') ? 'critical-error' : ''}">
          <strong>${error.type.toUpperCase()}:</strong> ${error.text}
          ${error.stack ? `<br><small>${error.stack}</small>` : ''}
          <br><small>Time: ${new Date(error.timestamp).toLocaleString()}</small>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>Warnings</h2>
      ${report.warnings.slice(0, 20).map(warning => `
        <div class="error-item">
          <strong>WARN:</strong> ${warning.text}
          <br><small>Time: ${new Date(warning.timestamp).toLocaleString()}</small>
        </div>
      `).join('')}
    </div>

    <div class="recommendations">
      <h2>Recommendations</h2>
      <ul>
        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Save HTML console report
 */
export async function saveHTMLConsoleReport(
  report: ConsoleReport,
  testName: string,
  outputDir: string = 'test-results/console-reports'
): Promise<string> {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `console-report-${testName}-${timestamp}.html`;
  const filepath = path.join(outputDir, filename);

  const html = generateHTMLConsoleReport(report, testName);
  fs.writeFileSync(filepath, html);

  return filepath;
}

