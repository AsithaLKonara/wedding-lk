<!-- 9ac19587-673f-490d-a62a-167356611804 62d0480f-6f98-4104-b860-e710298e0f48 -->
# Deep Fixing Plan for 374 Test Failures

## Executive Summary

Fix 374 failing tests (32.4% of 1,155) by systematically addressing root causes: authentication/sessions (~150 failures), missing API endpoints (~135 failures), timeouts/performance (~70 failures), UI selectors (~25 failures), and database/test data (~15 failures).

## Phase 1: Authentication & Session System Hardening

**Goal:** Fix ~150 authentication-related failures

### 1.1 Custom Login System Verification

- Verify `lib/auth/custom-auth.ts` implements complete auth flow:
- `loginUser()` validates credentials against MongoDB User model
- Password hashing with bcryptjs 
- JWT token generation with correct payload
- Token expiration handling
- Verify `lib/auth/session.ts` properly manages JWT cookies:
- `getUserSession()` correctly decodes and verifies JWT
- Cookie name matches across all API routes
- NEXTAUTH_SECRET environment variable is properly set
- Test edge cases: expired tokens, invalid signatures, missing cookies

### 1.2 API Route Authentication

- Verify all auth routes (`/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`, `/api/auth/me`):
- Request validation (email format, password strength)
- Response format consistency
- Error messages are informative
- Proper HTTP status codes (200, 201, 400, 401, 500)
- Add request logging to debug 401 errors
- Test with curl/Postman before running E2E tests

### 1.3 Middleware RBAC Integration

- Verify `middleware.ts` correctly:
- Parses JWT tokens without Mongoose (Edge Runtime compatible)
- Routes public vs protected paths
- Sets user context for API routes
- Handles missing/expired tokens gracefully
- Add custom header (`X-User-ID`, `X-User-Role`) for API debugging
- Test middleware with invalid/expired tokens

### 1.4 Dashboard Authentication Flow

- Verify `unified-dashboard.tsx` and `unified-dashboard-layout.tsx`:
- Fetch user session on mount with `/api/auth/me`
- Handle loading state properly
- Redirect to `/login` if unauthorized
- Display correct user role on dashboard
- Add error logging for failed session fetches

## Phase 2: Complete API Endpoint Audit & Implementation

**Goal:** Fix ~135 API endpoint failures

### 2.1 Authentication APIs (5 endpoints)

- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/signin` - Login with email/password
- `POST /api/auth/signout` - Logout (clear auth token)
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/test/reset-users` - Reset test user credentials

### 2.2 Dashboard APIs (4 endpoints)

- `GET /api/dashboard/user` - User dashboard statistics
- `GET /api/dashboard/vendor` - Vendor dashboard statistics
- `GET /api/dashboard/admin` - Admin dashboard statistics
- `GET /api/dashboard` - General dashboard data

### 2.3 Venue APIs (5 endpoints)

- `GET /api/venues` - List all venues with pagination
- `GET /api/venues/search` - Search venues with filters
- `GET /api/venues/:id` - Get specific venue details
- `POST /api/venues/:id/favorite` - Add venue to favorites
- `GET /api/venues/:id/availability` - Check venue availability

### 2.4 Vendor APIs (5 endpoints)

- `GET /api/vendors` - List all vendors with pagination
- `GET /api/vendors/search` - Search vendors by category/location
- `GET /api/vendors/:id` - Get vendor details
- `GET /api/vendors/category/:category` - Filter by category
- `POST /api/vendors/:id/services` - Vendor service listing

### 2.5 Booking APIs (4 endpoints)

- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status

### 2.6 User Profile APIs (4 endpoints)

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:id` - Add to favorites

### 2.7 Search & Discovery APIs (3 endpoints)

- `GET /api/search/ai` - AI-powered search
- `GET /api/search/public` - Public search
- `GET /api/trending` - Trending content

For each endpoint:

- Implement proper request validation
- Add authentication checks (where needed)
- Return correct response format and status codes
- Handle errors gracefully with proper messages

## Phase 3: Test Database Seeding Strategy

**Goal:** Ensure ~100% test data availability before tests run

### 3.1 Test User Setup

- Create robust seeding in `scripts/seed-test-users.ts`:
- 3 base users: user@test.local, vendor@test.local, admin@test.local
- All with password: Test123!
- All roles properly set: user, vendor, admin
- All marked as verified (isVerified: true)
- All marked as active (isActive: true)
- Create `app/api/test/reset-users/route.ts`:
- Endpoint to reset user passwords before test run
- Upsert users if they don't exist
- Hash passwords with bcryptjs
- Return success confirmation
- Create `tests/helpers/db-seed.ts`:
- Function to call reset-users API before test suite
- Verify seed completion before proceeding

### 3.2 Test Database Connection

- Create `tests/helpers/db-connect.ts`:
- Direct MongoDB connection for test setup
- Verify connection before tests run
- Handle connection pooling
- Add debug logging
- Create health check endpoint: `GET /api/health/db`
- Return database connection status
- Used in pre-test verification

### 3.3 Pre-Test Verification

- Update `playwright.config.ts`:
- Add `globalSetup` that seeds test users
- Verify API endpoints are responding
- Check database connectivity
- Log setup progress
- Create `tests/global-setup.ts`:
- Connect to MongoDB
- Seed test users
- Verify key endpoints
- Log all setup steps

## Phase 4: Performance & Timeout Optimization

**Goal:** Fix ~70 timeout-related failures

### 4.1 Endpoint Performance

- Profile slow endpoints with timing logs
- Add database indexing for frequently queried fields:
- User.email (for login)
- Venue.location (for search)
- Vendor.category (for filtering)
- Booking.userId (for user bookings)
- Implement pagination for list endpoints:
- Default limit: 10 items
- Max limit: 100 items
- Cursor-based pagination if possible

### 4.2 Test Configuration Optimization

- Update `playwright.config.ts`:
- Increase global timeout to 60 seconds
- Set actionTimeout to 15 seconds
- Set navigationTimeout to 30 seconds
- Add explicit `waitForLoadState('networkidle')`
- Update `jest.config.js`:
- Increase testTimeout to 30 seconds
- Set maxWorkers to 2 (reduce resource contention)

### 4.3 API Response Caching

- Add simple caching for static data:
- Venues list (cache for 1 hour)
- Vendors list (cache for 1 hour)
- Categories (cache for 24 hours)
- Use in-memory cache or Redis if available

## Phase 5: UI Selector & Element Visibility Fixes

**Goal:** Fix ~25 selector-related failures

### 5.1 Selector Audit

- Review all test selectors in Phase 1-6 test files:
- Replace ambiguous selectors (e.g., multiple elements matching)
- Use `.first()` or `.nth()` for specific elements
- Add `data-testid` attributes to critical elements
- For each failing selector:
- Update test to use correct locator
- Add explicit visibility check
- Use `waitForSelector()` with timeout

### 5.2 Element Visibility Issues

- Add visibility helpers for login page:
- Email input field
- Password input field
- Submit button
- Error message container
- Add visibility helpers for dashboard:
- Sidebar navigation
- Main content area
- User menu
- Logout button

### 5.3 Mobile Responsive Selectors

- Test selectors on mobile viewports:
- 375px (iPhone SE)
- 414px (iPhone 12)
- 768px (iPad)
- Update CSS selectors for responsive layouts

## Phase 6: Test Failure Categorization & Targeted Fixes

**Goal:** Address 374 failures systematically

### 6.1 Critical Features Phase 1 (~39 failures)

- Homepage loading: Verify all sections render
- Login/register page rendering: Check forms are visible
- Auth flows: Test valid/invalid login paths
- Dashboard access: Test role-based access
- RBAC enforcement: Test unauthorized access blocks
- AI search visibility: Verify on homepage
- Navigation: Check links work

### 6.2 API Integration Phase 2 (~135 failures)

- 50+ API endpoints need verification
- Test response formats match expectations
- Test error handling (400, 401, 404, 500)
- Test authorization on protected endpoints
- Test pagination and filtering

### 6.3 Navigation Tests Phase 3 (~58 failures)

- Public page navigation
- Dashboard navigation (authenticated)
- Vendor/admin dashboard navigation
- Back/forward buttons
- Link integrity

### 6.4 User Journey Tests Phase 4 (~70 failures)

- Bride/groom planning journey
- Vendor business journey
- Admin management journey
- Error recovery journeys
- Cross-platform consistency

### 6.5 Responsive Tests Phase 5 (~30 failures)

- Mobile layouts (375px, 414px)
- Tablet layouts (768px)
- Desktop layouts (1920px)
- Touch-friendly buttons
- Readable text on all sizes

### 6.6 Error Handling Phase 6 (~24 failures)

- Navigation error handling
- Network error simulation
- 404 page handling
- Unauthorized access (401)
- Server error (500)

## Implementation Steps

### Step 1: Setup & Verification (2 hours)

1. Verify custom auth system is complete
2. Verify middleware RBAC is working
3. Check JWT token handling
4. Test auth API endpoints manually

### Step 2: API Audit & Implementation (4 hours)

1. Audit all 27 API endpoints
2. Implement missing endpoints
3. Add request validation
4. Test endpoints with curl/Postman
5. Add proper error handling

### Step 3: Test Database Setup (1.5 hours)

1. Create comprehensive seeding script
2. Create global setup file
3. Add pre-test verification
4. Test seed process locally

### Step 4: Performance Optimization (1.5 hours)

1. Profile slow endpoints
2. Add database indexing
3. Implement caching
4. Update Playwright timeouts

### Step 5: Selector & UI Fixes (2 hours)

1. Add data-testid attributes to critical elements
2. Update test selectors
3. Fix element visibility issues
4. Test on mobile viewports

### Step 6: Comprehensive Testing (3 hours)

1. Run Phase 1 critical tests
2. Run Phase 2 API tests
3. Address any immediate failures
4. Run full suite on local
5. Deploy to Vercel
6. Run full suite on production
7. Analyze remaining failures

### Step 7: Iterative Fixing (2-3 hours)

1. Categorize remaining failures
2. Fix highest-impact issues first
3. Re-run tests after each fix
4. Document blockers

## Expected Outcomes

**After Phase 1-2:** 450+ passing tests (80%+ pass rate)

- Authentication working reliably
- All API endpoints responding correctly
- Basic dashboard access working

**After Phase 3-4:** 500+ passing tests (85%+ pass rate)

- Test data seeding 100% reliable
- Performance timeouts eliminated
- Endpoints responding quickly

**After Phase 5-6:** 550+ passing tests (90%+ pass rate)

- All selectors working
- UI elements visible correctly
- All critical paths functional

**Goal:** 600+ passing tests (95%+ pass rate) with comprehensive coverage

## Key Files to Modify

**Authentication:**

- `lib/auth/custom-auth.ts` (verify/enhance)
- `lib/auth/session.ts` (verify/enhance)
- `middleware.ts` (verify JWT handling)
- `app/api/auth/*` routes (verify all 4 routes)

**APIs:**

- `app/api/dashboard/*` (verify 3 routes)
- `app/api/venues/*` (verify 5 routes)
- `app/api/vendors/*` (verify 5 routes)
- `app/api/bookings/*` (verify 4 routes)
- `app/api/users/*` (verify 4 routes)
- `app/api/search/*` (verify 3 routes)

**Testing:**

- `tests/global-setup.ts` (create)
- `tests/helpers/db-seed.ts` (create)
- `tests/helpers/db-connect.ts` (create)
- `playwright.config.ts` (update timeouts)
- All Phase 1-6 test files (selector updates)

**Database:**

- `scripts/seed-test-users.ts` (enhance)
- MongoDB indexes (add)

## Success Criteria

- 550+ tests passing (95%+ pass rate)
- 0 critical failures
- All authentication flows working
- All core APIs responding correctly
- Test data seeding 100% reliable
- Performance acceptable (<3s per test)
- Dashboard fully functional
- RBAC properly enforced

### To-dos

- [ ] Delete all obsolete 2FA, forgot password, OAuth routes and files
- [ ] Verify MongoDB connection, seed test users, test login system twice
- [ ] Check all dashboard API routes and pages exist and work
- [ ] Update 5 critical test files (auth, dashboard, RBAC, API)
- [ ] Update 12 E2E test files
- [ ] Update 8 feature test files
- [ ] Update 2 unit test files
- [ ] Run local build in loop, fix all errors/warnings until clean
- [ ] Commit, push, wait for deployment, verify
- [ ] Run complete test suite (700+ tests) on deployment and verify 90%+ pass rate