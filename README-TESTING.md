# 🧪 WeddingLK Testing Suite

A comprehensive testing framework for the WeddingLK wedding planning platform, featuring Playwright E2E tests, Jest unit tests, and Cursor AI integration for automated test generation.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Cursor AI Integration](#cursor-ai-integration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This testing suite provides:

- **E2E Tests**: Playwright-based tests for complete user flows
- **Unit Tests**: Jest-based tests for individual functions and components
- **API Tests**: Integration tests for API endpoints
- **Cursor AI Integration**: Automated test generation and optimization
- **CI/CD Pipeline**: GitHub Actions for automated testing

## 📁 Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts        # Authentication flows
│   ├── vendor.spec.ts      # Vendor management
│   ├── venue.spec.ts       # Venue management
│   ├── booking.spec.ts     # Booking system
│   └── payment.spec.ts     # Payment processing
├── unit/                   # Unit tests
│   ├── validators.spec.ts  # Validation functions
│   └── utils.spec.ts       # Utility functions
├── api/                    # API integration tests
│   └── auth.api.spec.ts    # Authentication API
├── helpers/                # Test helpers
│   ├── test-helpers.ts     # Common test utilities
│   └── db-setup.js         # Database setup
├── fixtures/               # Test data
│   ├── users.json          # User test data
│   ├── vendors.json        # Vendor test data
│   └── venues.json         # Venue test data
└── setup.js               # Jest setup
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (for testing)
- Cursor AI API key (optional, for AI integration)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run test:install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.test
   ```

   Add to `.env.test`:
   ```env
   NODE_ENV=test
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk_test?retryWrites=true&w=majority
   NEXTAUTH_SECRET=test-secret
   NEXTAUTH_URL=http://localhost:3000
   CURSOR_API_KEY=your-cursor-api-key
   ```

   **Note:** This project uses MongoDB Atlas (cloud) only. Local MongoDB is not supported due to macOS compatibility constraints.

4. **Database Setup:**
   ```bash
   # No local database setup needed - uses MongoDB Atlas
   # Ensure MONGODB_URI is set to your Atlas connection string
   
   # Or using local MongoDB
   mongod --dbpath ./test-data
   ```

## 🏃‍♂️ Running Tests

### All Tests
```bash
npm run test
```

### Unit Tests Only
```bash
npm run test:unit
```

### E2E Tests Only
```bash
npm run test:e2e
```

### API Tests Only
```bash
npm run test:api
```

### Specific Test Files
```bash
# Run specific E2E test
npx playwright test tests/e2e/auth.spec.ts

# Run specific unit test
npm run test:unit -- tests/unit/validators.spec.ts
```

### Test Coverage
```bash
npm run test:coverage
```

### Debug Mode
```bash
# Debug E2E tests
npm run test:debug

# Debug with UI
npm run test:ui
```

## 🤖 Cursor AI Integration

### Basic Test Generation
```bash
# Generate tests using Cursor AI
npm run test:generate
```

### Advanced Test Generation
```bash
# Generate comprehensive test suite
npm run test:generate-advanced
```

### Test Optimization
```bash
# Optimize existing tests
npm run test:optimize
```

### Codebase Analysis
```bash
# Analyze codebase for test opportunities
npm run test:analyze
```

### Manual Cursor AI Usage

1. **Set up Cursor AI API key:**
   ```bash
   export CURSOR_API_KEY="your-api-key"
   ```

2. **Generate tests for specific features:**
   ```bash
   node scripts/generate-tests.js --e2e-only
   node scripts/generate-tests.js --unit-only
   node scripts/generate-tests.js --api-only
   ```

3. **Use advanced integration:**
   ```bash
   node scripts/cursor-ai-integration.js --analyze-only
   node scripts/cursor-ai-integration.js --generate-only
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

The CI pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Pipeline Stages

1. **Setup**: Install dependencies and browsers
2. **Linting**: Code quality checks
3. **Type Checking**: TypeScript validation
4. **Unit Tests**: Jest unit tests
5. **E2E Tests**: Playwright tests
6. **Security**: Security audit
7. **Build**: Production build
8. **Deploy**: Deploy to Vercel (main branch only)

### Local CI Simulation

```bash
# Run full CI pipeline locally
npm run lint
npm run type-check
npm run test:unit
npm run test:e2e
npm audit
npm run build
```

## 📊 Test Reports

### Playwright Reports
```bash
# View HTML report
npm run test:report

# Reports are saved to:
# - playwright-report/index.html
# - test-results.json
# - test-results.xml
```

### Coverage Reports
```bash
# View coverage report
npm run test:coverage

# Coverage reports are saved to:
# - coverage/lcov-report/index.html
# - coverage/coverage.json
```

## 🎯 Best Practices

### Test Organization

1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the scenario
3. **Keep tests independent** - no shared state between tests
4. **Use test helpers** for common operations
5. **Mock external services** consistently

### Test Data Management

1. **Use fixtures** for static test data
2. **Generate dynamic data** with faker.js
3. **Clean up test data** after each test
4. **Use factories** for complex object creation

### Performance Optimization

1. **Run tests in parallel** where possible
2. **Mock external API calls** to avoid network delays
3. **Use test database** separate from development
4. **Optimize test data** size and complexity

### Cursor AI Integration

1. **Provide clear prompts** for better test generation
2. **Review generated tests** before committing
3. **Customize prompts** for specific requirements
4. **Use optimization features** to improve test quality

## 🐛 Troubleshooting

### Common Issues

#### Playwright Tests Failing
```bash
# Reinstall browsers
npm run test:install

# Check browser compatibility
npx playwright test --list
```

#### Database Connection Issues
```bash
# Check MongoDB Atlas connection (replace with your Atlas URI)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/weddinglk_test"

# Verify environment variable is set
echo $MONGODB_URI

# Reset test database (drops test database on Atlas)
npm run test:cleanup
```

#### Cursor AI Integration Issues
```bash
# Check API key
echo $CURSOR_API_KEY

# Test API connection
node scripts/cursor-ai-integration.js --analyze-only
```

### Debug Commands

```bash
# Debug specific test
npx playwright test tests/e2e/auth.spec.ts --debug

# Run with verbose output
npm run test:unit -- --verbose

# Check test environment
npm run test:analyze
```

### Performance Issues

```bash
# Run performance analysis
npm run test:optimize

# Check test execution time
npx playwright test --reporter=line

# Profile test performance
npm run test:coverage -- --collectCoverageFrom="lib/**/*.js"
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Cursor AI Documentation](https://cursor.sh/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

1. **Write tests** for new features
2. **Update test data** when adding new models
3. **Run full test suite** before submitting PRs
4. **Use Cursor AI** to generate additional test coverage
5. **Follow best practices** outlined in this document

## 📝 License

This testing suite is part of the WeddingLK project and follows the same license terms.
