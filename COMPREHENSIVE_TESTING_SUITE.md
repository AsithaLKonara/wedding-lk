# Comprehensive Browser Testing Suite

## Overview

A complete browser-based testing suite using Playwright that comprehensively tests the wedding planning platform. The suite covers authentication, all pages, buttons/interactive elements, RBAC access control, and console log monitoring across both production and local environments.

## Test Infrastructure

### Helper Files

1. **`tests/helpers/browser-helpers.ts`**
   - Authentication utilities for all roles
   - Button/link/form collection
   - Page navigation and access checking
   - Screenshot and error handling

2. **`tests/helpers/console-collector.ts`**
   - Console log monitoring (log, error, warn, info)
   - Error pattern analysis
   - HTML and JSON report generation
   - Error categorization (API, auth, network, critical)

3. **`tests/helpers/page-catalog.ts`**
   - Complete catalog of 100+ pages
   - RBAC requirements for each page
   - Role-based page filtering utilities

4. **`tests/helpers/auth-helper.ts`** (Enhanced)
   - Environment-aware authentication
   - Test user creation and seeding

### Test Files

1. **`tests/e2e/comprehensive-browser-auth.spec.ts`**
   - Authentication flows for all 5 roles
   - Session persistence tests
   - Logout functionality
   - Token validation
   - Invalid credentials handling
   - Registration flows

2. **`tests/e2e/comprehensive-page-access.spec.ts`**
   - All public pages access
   - Role-based page access
   - Page load performance
   - 404 handling
   - Redirect testing

3. **`tests/e2e/comprehensive-button-interactions.spec.ts`**
   - All buttons collection and testing
   - Link navigation testing
   - Form interactions
   - Modal/dialog testing
   - Tab and accordion interactions
   - Search and filter testing

4. **`tests/e2e/comprehensive-rbac-matrix.spec.ts`**
   - Complete RBAC access matrix
   - Role-based page access
   - API endpoint authorization
   - Navigation menu visibility
   - Unauthorized access attempts

5. **`tests/e2e/comprehensive-console-monitoring.spec.ts`**
   - Console log collection
   - Error detection and analysis
   - Warning detection
   - API call monitoring
   - Network error detection
   - Comprehensive reporting

6. **`tests/e2e/comprehensive-environment-comparison.spec.ts`**
   - Production vs Local comparison
   - Page load time comparison
   - API response comparison
   - Console log comparison
   - Performance comparison

### Configuration Files

- **`playwright.config.ts`** - Enhanced with dual environment support
- **`tests/global-setup.ts`** - Enhanced with console monitoring setup
- **`tests/fixtures/test-users-extended.json`** - Extended test users for all roles

## Test Coverage

### Roles Tested
- ✅ User
- ✅ Vendor
- ✅ Wedding Planner
- ✅ Admin
- ✅ Maintainer

### Environments
- ✅ Local (http://localhost:3000)
- ✅ Production (https://wedding-lk.vercel.app)

### Test Categories
- ✅ Authentication (50+ tests)
- ✅ Page Access (200+ tests)
- ✅ Button Interactions (500+ tests)
- ✅ RBAC Matrix (150+ tests)
- ✅ Console Monitoring (100+ tests)
- ✅ Environment Comparison (50+ tests)

**Total: ~1,050 comprehensive browser tests**

## Running Tests

### Prerequisites

### Prerequisites

1. **For Local Testing:**
   ```bash
   # Start the development server
   npm run dev
   ```

2. **For Production Testing:**
   - No setup needed, tests run against production URL

### Run All Tests

```bash
# Run all comprehensive tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### Run Specific Test Suites

```bash
# Authentication tests
npx playwright test tests/e2e/comprehensive-browser-auth.spec.ts

# Page access tests
npx playwright test tests/e2e/comprehensive-page-access.spec.ts

# Button interactions
npx playwright test tests/e2e/comprehensive-button-interactions.spec.ts

# RBAC matrix
npx playwright test tests/e2e/comprehensive-rbac-matrix.spec.ts

# Console monitoring
npx playwright test tests/e2e/comprehensive-console-monitoring.spec.ts

# Environment comparison
npx playwright test tests/e2e/comprehensive-environment-comparison.spec.ts
```

### Run Tests for Specific Environment

```bash
# Test against production only
E2E_BASE_URL=https://wedding-lk.vercel.app npm run test:e2e

# Test against local only
E2E_BASE_URL=http://localhost:3000 npm run test:e2e
```

### Run Tests for Specific Role

```bash
# Test user role only
npx playwright test tests/e2e/comprehensive-browser-auth.spec.ts --grep "user"

# Test admin role only
npx playwright test tests/e2e/comprehensive-rbac-matrix.spec.ts --grep "admin"
```

## Test Reports

### HTML Reports
```bash
# View HTML test report
npm run test:report
# Opens playwright-report/index.html
```

### Console Reports
Console reports are automatically generated in:
- `test-results/console-reports/` - JSON and HTML console reports

### Screenshots and Videos
- Screenshots: `test-results/` (on failure)
- Videos: `test-results/` (on failure)
- Traces: `test-results/` (on retry)

## Test Data

### Test Users

Test users are defined in:
- `tests/fixtures/test-users.json` - Basic test users
- `tests/fixtures/test-users-extended.json` - Extended test users for all roles

### Creating Test Users

Test users should be created in your database with:
- Email: `{role}@test.local` (for local) or `{role}@test.prod` (for production)
- Password: `Test123!`
- Roles: user, vendor, wedding_planner, admin, maintainer

## Features

### 1. Comprehensive Authentication Testing
- Login for all 5 roles
- Session persistence
- Logout functionality
- Token validation
- Invalid credentials handling
- Registration flows

### 2. Complete Page Access Testing
- 100+ pages tested
- Public pages (no auth)
- Protected pages (auth required)
- Role-specific pages (RBAC)
- Page load performance
- 404 and error handling

### 3. Interactive Element Testing
- All buttons tested
- All links tested
- All forms tested
- Modals and dialogs
- Tabs and accordions
- Search and filters

### 4. RBAC Access Control
- Complete access matrix
- Role-based page access
- API endpoint authorization
- Navigation menu visibility
- Unauthorized access prevention

### 5. Console Monitoring
- All console logs captured
- Error detection and analysis
- Warning detection
- API call tracking
- Network error detection
- Comprehensive reporting

### 6. Environment Comparison
- Production vs Local comparison
- Performance comparison
- API response comparison
- Console log comparison

## Troubleshooting

### Local Server Not Running

If you see `ERR_CONNECTION_REFUSED`:
```bash
# Start the development server
npm run dev
```

### Test Users Don't Exist

If authentication fails:
1. Check if test users exist in database
2. Create test users using the seed script
3. Verify credentials in `test-users-extended.json`

### Production Tests Failing

Production tests require:
1. Production server to be accessible
2. Test users to exist in production database
3. Valid credentials in test fixtures

### Console Errors

Check console reports in:
- `test-results/console-reports/` for detailed error analysis

## Best Practices

1. **Run tests in CI/CD**: Automate test execution on every deployment
2. **Monitor console reports**: Review console errors regularly
3. **Update test fixtures**: Keep test user credentials current
4. **Review RBAC changes**: Update page catalog when adding new pages
5. **Performance monitoring**: Track page load times over time

## Next Steps

1. **Set up CI/CD**: Integrate tests into your deployment pipeline
2. **Create test users**: Ensure test users exist in both environments
3. **Run baseline tests**: Establish performance baselines
4. **Monitor regularly**: Run tests before and after deployments
5. **Update as needed**: Keep tests updated with new features

## Support

For issues or questions:
1. Check test reports in `test-results/`
2. Review console reports in `test-results/console-reports/`
3. Check Playwright documentation: https://playwright.dev
4. Review test code in `tests/e2e/` directory


