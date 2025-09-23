#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Starting optimized development server...');

// Clear Next.js cache
try {
  const { execSync } = await import('child_process');
  execSync('rm -rf .next', { stdio: 'inherit' });
  console.log('🧹 Cleared Next.js cache');
} catch (error) {
  console.log('⚠️  Could not clear cache, continuing...');
}

// Start development server with optimizations
const devProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'development'
  }
});

devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
});

devProcess.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});
