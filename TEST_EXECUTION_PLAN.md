# Comprehensive Test Execution Plan with Runtime Error Tracking
**Date:** October 24, 2025  
**Version:** 2.0 - Production Ready

---

## Executive Summary

This plan implements a comprehensive, clean test suite with **runtime error tracking** for the Wedding.LK platform. The approach:
- ✅ Keeps only active, relevant tests
- ✅ Removes legacy/disabled tests
- ✅ Creates comprehensive API validation suite
- ✅ Tracks all runtime errors systematically
- ✅ Provides detailed execution reports

---

## Test Suite Architecture

### Active Test Files (7 files)

```
tests/e2e/
├── critical-features.spec.ts        (14 tests) - Core functionality
├── auth.spec.ts                      (3 tests)  - Authentication
├── quick-verification.spec.ts        (6 tests)  - Quick checks
├── navigation-tests.spec.ts          (20 tests) - Page navigation
├── user-journey-tests.spec.ts        (30 tests) - User journeys
├── responsive-tests.spec.ts          (15 tests) - Responsive design
├── error-handling-tests.spec.ts      (15 tests) - Error scenarios
│
tests/api/
└── comprehensive-api.spec.ts         (50+ tests) - All API endpoints
```

**Total: 150+ Active Tests**

---

## Comprehensive API Test Suite Details

### Test Case: `comprehensive-api.spec.ts`

**Purpose:** Validate all API endpoints data passing with runtime error tracking

**Coverage:**
- ✅ Authentication APIs (3 endpoints)
- ✅ Dashboard APIs (4 endpoints)
- ✅ Venue APIs (4 endpoints)
- ✅ Vendor APIs (4 endpoints)
- ✅ Booking APIs (2 endpoints)
- ✅ User APIs (2 endpoints)
- ✅ Search APIs (2 endpoints)
- ✅ Homepage APIs (2 endpoints)
- ✅ Health Check APIs (1 endpoint)

**Total: 24 Core API Endpoints**

### Runtime Error Tracking Features

Each API test tracks:
```
{
  endpoint: string          // e.g., "GET /api/venues"
  method: string           // HTTP method (GET, POST, etc)
  status: number           // HTTP response status code
  duration: number         // Response time in milliseconds
  passed: boolean          // Test passed/failed
  error?: string           // Error message if failed
}
```

### Test Execution Output Example

```
✓ GET    /api/auth/signin                              200 (145ms)
✓ GET    /api/auth/me                                  200 (89ms)
✓ POST   /api/auth/signout                             200 (52ms)
✓ GET    /api/dashboard/stats                          200 (125ms)
✓ GET    /api/venues?page=1&limit=10                  200 (178ms)
✗ GET    /api/venues/search?q=venue                    404 (98ms)
  Error: Expected 200, got 404

=========================================================
📊 API Test Results Summary:
✅ Passed: 23
❌ Failed: 1
⏱️  Total Time: 2847ms
=========================================================

🔴 Failed Endpoints:
  GET /api/venues/search?q=venue: 404 - Expected 200, got 404
```

---

## Test Execution Process

### Step 1: Environment Setup
```bash
# Ensure you're in project root
cd "/Users/asithalakmal/Documents/web/final project/WeddingLK-next copy"

# Install dependencies (if needed)
npm install

# Start local dev server
npm run dev
# Server should be running on http://localhost:3000
```

### Step 2: Run Unit Tests (Includes API tests)
```bash
# Run all unit tests (including comprehensive API suite)
npm run test:unit

# Output will include:
# - All test results
# - Runtime error tracking
# - Performance metrics
# - Failed endpoints categorization
```

### Step 3: Run E2E Tests
```bash
# Run critical tests
npm run test:critical

# Run all E2E tests
npm run test:e2e

# Run specific E2E test file
npx playwright test tests/e2e/navigation-tests.spec.ts
```

### Step 4: Run Full Test Suite
```bash
# Run everything
npm run test

# This runs:
# 1. Unit tests (including comprehensive API tests)
# 2. E2E tests (Playwright)
# 3. Generates HTML report
```

### Step 5: Deploy and Test on Production
```bash
# Deploy to Vercel
vercel deploy --prod

# Run tests on production URL
E2E_BASE_URL="https://wedding-lk.vercel.app" npm run test:e2e

# Generate production test report
```

---

## Runtime Error Tracking

### Error Categories

#### 1. **Authentication Errors**
- 401 Unauthorized
- Invalid token
- Missing credentials

#### 2. **API Errors**
- 404 Not Found
- 400 Bad Request
- 500 Internal Server Error

#### 3. **Performance Errors**
- Timeout exceeded
- Response time > threshold
- Slow database queries

#### 4. **Data Validation Errors**
- Missing required fields
- Invalid data types
- Failed assertions

### Error Log Format

```
[ERROR] timestamp: 2025-10-24T20:30:45.123Z
[ERROR] endpoint: GET /api/venues/search
[ERROR] status: 404
[ERROR] message: Not Found
[ERROR] duration: 98ms
[ERROR] stack: [full error stack]
```

---

## Test Cleanup Process

### Remove Legacy Tests
```bash
# Run cleanup script to remove old disabled tests
npx ts-node scripts/cleanup-tests.ts

# This will:
# - Remove all legacy/disabled test files
# - Keep only 7 active test files
# - Keep comprehensive API suite
# - Optimize test suite for clarity
```

---

## Expected Results

### Critical Tests (Core Functionality)
```
✅ Homepage loads: PASSING
✅ API endpoints responding: PASSING
✅ Navigation working: PASSING
✅ Responsiveness: PASSING
✅ No JS errors: PASSING
✅ Authentication: PASSING

Result: 6/6 PASSING (100%)
```

### API Tests (Comprehensive)
```
✅ Authentication APIs: 3/3 PASSING
✅ Dashboard APIs: 4/4 PASSING
✅ Venue APIs: 4/4 PASSING
✅ Vendor APIs: 4/4 PASSING
✅ Booking APIs: 2/2 PASSING
✅ User APIs: 2/2 PASSING
✅ Search APIs: 2/2 PASSING
✅ Homepage APIs: 2/2 PASSING
✅ Health Check: 1/1 PASSING

Result: 24+/24+ PASSING (100%)
```

### E2E Tests
```
✅ Navigation: 20/20 PASSING
✅ User Journeys: 30/30 PASSING
✅ Responsive: 15/15 PASSING
✅ Error Handling: 15/15 PASSING
✅ Authentication: 3/3 PASSING
✅ Critical Features: 14/14 PASSING

Result: 97+/97+ PASSING (100%)
```

---

## Command Reference

### Test Commands

```bash
# Development
npm run dev                          # Start dev server

# Unit/API Tests
npm run test:unit                    # Run all unit tests

# E2E Tests
npm run test:critical                # Critical tests only
npm run test:e2e                     # Full E2E suite

# Complete Suite
npm run test                         # Everything (unit + E2E)

# Specific Tests
npm run test -- comprehensive-api    # Just API tests
npx playwright test critical         # Just critical E2E

# With Production URL
E2E_BASE_URL="https://wedding-lk.vercel.app" npm run test:e2e
```

### Report Generation

```bash
# View HTML report
npm run test -- --reporter=html     # Generates HTML report

# View in browser
open test-results/index.html

# JSON report for CI/CD
npm run test -- --reporter=json
```

---

## Error Handling Strategy

### 1. **Immediate Feedback**
- Console output shows each test result instantly
- Errors highlighted in red with details
- Performance metrics for each endpoint

### 2. **Detailed Logging**
- Full error stack traces captured
- Request/response bodies logged
- Timing information for performance analysis

### 3. **Failure Categorization**
- Grouped by error type (Auth, API, Performance, Data)
- Sorted by frequency and impact
- Trackable for systematic fixes

### 4. **Recovery Procedures**
```
If tests fail:
1. Check error category
2. Review detailed log
3. Check endpoint status: curl http://localhost:3000/api/endpoint
4. Review recent changes
5. Re-run specific test: npm run test -- specific-test
6. Check production: E2E_BASE_URL="https://..." npm run test:e2e
```

---

## Cleanup Summary

### Files to Remove (Legacy)
- ❌ tests/e2e/api-integration.spec.ts
- ❌ tests/e2e/rbac-comprehensive.spec.ts
- ❌ tests/e2e/realistic-live-deployment.spec.ts
- ❌ tests/e2e/simple.spec.ts
- ❌ tests/e2e/user-journey.spec.ts (old version)
- ❌ tests/e2e/vendor.spec.ts
- ❌ tests/e2e/venue.spec.ts

**Reason:** All disabled tests or outdated implementations

### Files to Keep (Active)
- ✅ tests/e2e/critical-features.spec.ts
- ✅ tests/e2e/auth.spec.ts
- ✅ tests/e2e/quick-verification.spec.ts
- ✅ tests/e2e/navigation-tests.spec.ts
- ✅ tests/e2e/user-journey-tests.spec.ts (redesigned)
- ✅ tests/e2e/responsive-tests.spec.ts
- ✅ tests/e2e/error-handling-tests.spec.ts
- ✅ tests/api/comprehensive-api.spec.ts (NEW)

**Total: 150+ Active, Clean Tests**

---

## CI/CD Integration

### GitHub Actions / Vercel Integration

```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run test
```

---

## Success Criteria

✅ **All Critical Tests Passing:** 100% (6/6 core tests)
✅ **All API Tests Passing:** 100% (24+ endpoints)
✅ **All E2E Tests Passing:** 95%+ (145+ tests)
✅ **No Runtime Errors:** 0 critical errors
✅ **Performance Acceptable:** <3s per test average
✅ **Clean Test Suite:** No legacy/disabled tests
✅ **Production Deployment:** Live and functional

---

## Next Steps

1. ✅ **Run Tests Locally**
   ```bash
   npm run dev &
   npm run test
   ```

2. ✅ **Review Results**
   - Check error tracking output
   - Categorize any failures
   - Document improvements

3. ✅ **Deploy to Vercel**
   ```bash
   vercel deploy --prod
   ```

4. ✅ **Run Production Tests**
   ```bash
   E2E_BASE_URL="https://wedding-lk.vercel.app" npm run test
   ```

5. ✅ **Monitor & Maintain**
   - Track test failures over time
   - Monitor API performance
   - Update tests as features evolve

---

**Status:** ✅ READY FOR EXECUTION
**Last Updated:** October 24, 2025, 8:15 PM UTC
