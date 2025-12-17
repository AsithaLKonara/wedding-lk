module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/tests/unit',
    '<rootDir>/tests/integration',
    '<rootDir>/tests/api'
  ],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.ts',
    'app/api/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**',
    '!**/.next/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './lib/models/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './lib/utils/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './lib/middleware/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 15000, // Reduced to 15 seconds - fail fast
  verbose: true,
  maxWorkers: 1, // Run tests sequentially to avoid hanging
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  forceExit: true, // Force exit after tests complete
  detectOpenHandles: true, // Detect what's keeping tests alive
  // CRITICAL: Additional Jest configuration to ensure clean exit
  testEnvironmentOptions: {
    // Ensure test environment doesn't keep process alive
  },
  // CRITICAL: Ensure Jest doesn't wait for async operations
  // This forces Jest to exit even if there are pending timers or handles
  bail: false, // Don't bail on first failure
  // Load test environment variables
  setupFiles: ['<rootDir>/tests/setup-env.js'],
};
