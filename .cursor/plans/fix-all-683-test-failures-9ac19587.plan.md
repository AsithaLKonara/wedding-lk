<!-- 9ac19587-673f-490d-a62a-167356611804 5f839f02-4a2f-45b2-8d8b-24e8af91f48d -->
# Final Production Setup & Complete Test Suite Update

## Phase 1: Authentication System Cleanup (20 min)

### A. Delete Obsolete Auth Routes & Files

Delete all 2FA, forgot password, OAuth, and old NextAuth files:

- `app/api/auth/2fa/` (entire directory + backup-codes, setup, status, verify)
- `app/api/auth/2fa-send.ts`
- `app/api/auth/2fa-verify.ts`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `app/api/auth/verify-email/route.ts`
- `app/api/auth/send-verification/route.ts`
- `app/api/auth/validate-reset-token/route.ts`
- `app/api/auth/error/route.ts`
- `app/api/auth/register/route.ts` (duplicate of signup)
- `app/api/auth/test-login/route.ts`
- `app/api/auth/[...nextauth]/` (old NextAuth route)
- `app/api/auth/oauth/` empty directories (facebook, google, instagram, linkedin)
- `app/api/auth/social-accounts/` empty directory
- `app/api/auth/social-login/` empty directory
- `app/api/auth/logout/route.ts` (use signout instead)
- `app/api/auth/session/route.ts` (use /me instead)
- `lib/auth.ts` (old NextAuth config)
- `lib/auth.simple.ts` (old NextAuth declarations)

### B. Verify Core Auth Routes Work

Keep only these essential routes:

- ✅ `/api/auth/signin` - Login endpoint
- ✅ `/api/auth/signup` - Registration endpoint
- ✅ `/api/auth/signout` - Logout endpoint
- ✅ `/api/auth/me` - Get current user session
- ✅ `/api/test/reset-users` - Test user seeding

## Phase 2: Database Credentials Verification (15 min)

### A. Check MongoDB Connection

Test connection with actual database:

```bash
curl https://wedding-lk.vercel.app/api/health
```

### B. Seed Test Users

Reset and verify test users in production:

```bash
curl -X POST https://wedding-lk.vercel.app/api/test/reset-users
```

Expected users:

- user@test.local / Test123! (role: user)
- vendor@test.local / Test123! (role: vendor)
- admin@test.local / Test123! (role: admin)

### C. Test Login System Twice

Test each user credential:

```bash
# Test user login
curl -X POST https://wedding-lk.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.local","password":"Test123!"}'

# Test vendor login
curl -X POST https://wedding-lk.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@test.local","password":"Test123!"}'

# Test admin login
curl -X POST https://wedding-lk.vercel.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.local","password":"Test123!"}'
```

### D. Verify Integration Credentials

Check `.env` or Vercel environment variables:

- MONGODB_URI - ✅ Connection string
- REDIS_URL - ✅ Upstash Redis
- CLOUDINARY_URL - ✅ Image service
- STRIPE_SECRET_KEY - ✅ Payment processing
- NEXTAUTH_SECRET - ✅ JWT signing key

## Phase 3: Dashboard Routes Verification (15 min)

### A. Check All Dashboard API Routes

Verify these routes exist and work:

- `/api/dashboard/user/stats`
- `/api/dashboard/user/bookings`
- `/api/dashboard/user/favorites`
- `/api/dashboard/user/profile`
- `/api/dashboard/vendor/stats`
- `/api/dashboard/vendor/bookings`
- `/api/dashboard/vendor/analytics`
- `/api/dashboard/admin/stats`
- `/api/dashboard/admin/users`
- `/api/dashboard/admin/vendors`
- `/api/dashboard/planner/stats`
- `/api/dashboard/planner/clients`

### B. Check Dashboard Pages

Verify these pages exist:

- `/dashboard` - Unified dashboard
- `/dashboard/user` - User dashboard
- `/dashboard/vendor` - Vendor dashboard
- `/dashboard/admin` - Admin dashboard
- `/dashboard/planner` - Wedding planner dashboard

## Phase 4: Update ALL 27 Test Files (90 min)

Update pattern for EVERY test file:

### Pattern A: Update Auth Routes

```typescript
// OLD
await page.goto('/auth/signin')
await page.goto('/auth/signup')

// NEW
await page.goto('/login')
await page.goto('/register')
```

### Pattern B: Remove 2FA Expectations

```typescript
// REMOVE these expectations
await expect(page.locator('[data-testid="2fa-setup"]')).toBeVisible()
await page.fill('input[name="2faCode"]', '123456')
```

### Pattern C: Remove Forgot Password Expectations

```typescript
// REMOVE these expectations
await page.goto('/auth/forgot-password')
await expect(page).toHaveURL(/\/auth\/reset-password/)
```

### Pattern D: Remove Social Login Expectations

```typescript
// REMOVE these expectations
await page.click('button[data-testid="google-login"]')
await page.click('button[data-testid="facebook-login"]')
```

### Pattern E: Update Logout

```typescript
// OLD
await signOut()

// NEW
await page.request.post('/api/auth/signout')
await page.goto('/login')
```

### Files to Update (in order of priority):

#### Critical (Update First):

1. `tests/02-authentication.spec.ts` - Main auth tests
2. `tests/03-dashboard.spec.ts` - Dashboard tests
3. `tests/e2e/auth.spec.ts` - E2E auth (already done)
4. `tests/e2e/rbac-comprehensive.spec.ts` - RBAC tests
5. `tests/api/auth.api.spec.ts` - Auth API tests

#### E2E Tests:

6. `tests/e2e/user-journey.spec.ts`
7. `tests/e2e/comprehensive-crud.spec.ts`
8. `tests/e2e/api-integration.spec.ts`
9. `tests/e2e/comprehensive-live-deployment.spec.ts`
10. `tests/e2e/realistic-live-deployment.spec.ts`
11. `tests/e2e/quick-verification.spec.ts` (already done)
12. `tests/e2e/production.spec.ts`
13. `tests/e2e/simple.spec.ts`
14. `tests/e2e/booking.spec.ts`
15. `tests/e2e/payment.spec.ts`
16. `tests/e2e/vendor.spec.ts`
17. `tests/e2e/venue.spec.ts`

#### Feature Tests:

18. `tests/01-homepage.spec.ts`
19. `tests/04-venues.spec.ts`
20. `tests/05-vendors.spec.ts`
21. `tests/06-booking.spec.ts`
22. `tests/07-payments.spec.ts`
23. `tests/08-social.spec.ts`
24. `tests/09-admin.spec.ts`
25. `tests/10-api.spec.ts`

#### Unit Tests:

26. `tests/unit/utils.spec.ts`
27. `tests/unit/validators.spec.ts`

## Phase 5: Local Build Verification Loop (30 min)

Run build in loop until error/warning free:

```bash
while true; do
  echo "🔨 Building project..."
  npm run build 2>&1 | tee build.log
  
  if [ $? -eq 0 ] && ! grep -i "error\|warning" build.log; then
    echo "✅ Build successful with no errors or warnings!"
    break
  else
    echo "❌ Build has errors/warnings. Analyzing..."
    # Show errors
    grep -i "error" build.log
    # Show warnings
    grep -i "warning" build.log
    # Prompt to fix
    read -p "Press Enter after fixing issues..."
  fi
done
```

### Common Build Issues to Fix:

1. **Unused imports** - Remove them
2. **Type errors** - Fix TypeScript issues
3. **Missing dependencies** - Install them
4. **Linter errors** - Fix ESLint issues
5. **Module resolution** - Update paths
6. **Edge Runtime issues** - Remove Node.js specific code from middleware

## Phase 6: Final Deployment (15 min)

### A. Commit & Push

```bash
git add .
git commit -m "Final production setup: Clean auth, update 700+ tests, verify database, fix all build errors"
git push
```

### B. Wait for Deployment

```bash
sleep 90  # Wait for Vercel build
```

### C. Verify Deployment

```bash
curl -I https://wedding-lk.vercel.app
curl https://wedding-lk.vercel.app/api/health
```

## Phase 7: Run Complete Test Suite (30 min)

### A. Run All Tests

```bash
# Run critical tests first
npm run test:critical

# Run all E2E tests
npm run test:e2e

# Run all tests
npm test
```

### B. Generate Test Report

```bash
npx playwright show-report
```

### C. Verify Test Results

Target metrics:

- **Critical tests:** 12-14/14 passing (85-100%)
- **All tests:** 630+/700 passing (90%+)
- **Auth tests:** 100% passing
- **RBAC tests:** 100% passing
- **Dashboard tests:** 90%+ passing

## Success Criteria

### Authentication:

- ✅ Login working with test users
- ✅ Registration working
- ✅ Logout working
- ✅ Session management working
- ✅ No 2FA, forgot password, or social login

### Database:

- ✅ MongoDB connection verified
- ✅ Test users exist with correct passwords
- ✅ All credentials working

### Build:

- ✅ Local build succeeds
- ✅ No errors
- ✅ No warnings
- ✅ Production deployment successful

### Tests:

- ✅ 90%+ pass rate (630+ of 700 tests)
- ✅ All critical tests passing
- ✅ All auth tests passing
- ✅ All RBAC tests passing

### Code Quality:

- ✅ No obsolete auth files
- ✅ Clean auth routes
- ✅ Updated test suite
- ✅ All linter errors fixed
- ✅ Production ready

## Estimated Time: 3-4 hours

## Key Deliverables

1. Clean authentication system (email/password only)
2. Verified database and credentials
3. Updated 700+ test suite matching current implementation
4. Error/warning-free local build
5. Successful production deployment
6. 90%+ test pass rate on deployment
7. Production-ready, clean codebase

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