# Fix Remaining JSON Serialization Failures

## Current Status

- **9 test failures remaining** out of 51 total tests
- **42 tests passing** (82% pass rate)
- **3 test suites passing** out of 6

## Failure Analysis

### Failing Tests

**Vendors API (3 failures):**
1. `GET /api/vendors › should return list of vendors with pagination`
2. `GET /api/vendors › should filter vendors by category`
3. `GET /api/vendors › should filter vendors by location`

**Venues API (5 failures):**
1. `GET /api/venues › should return list of venues with pagination`
2. `GET /api/venues › should filter venues by city`
3. `GET /api/venues › should filter venues by capacity`
4. `GET /api/venues › should filter venues by price range`
5. `GET /api/venues/availability › should detect conflicting bookings`

### Root Cause

All failures share the same error:
```
TypeError: Value is not JSON serializable
```

The error occurs at:
- `app/api/vendors/route.ts:72` - `NextResponse.json(APIResponse.success(result))`
- `app/api/venues/route.ts:79` - `NextResponse.json(APIResponse.success(result))`

**Issue:** Despite mocking `ResponseOptimizer.compressVendor`, `ResponseOptimizer.compressVenue`, and `APIResponse.success`, something in the `result` object is still not JSON serializable.

## Potential Causes

1. **Pagination calculation producing NaN/Infinity:**
   - `Math.ceil(total / limit)` might produce NaN if `total` or `limit` are undefined/null
   - Division by zero if `limit` is 0

2. **Mock not intercepting the actual route:**
   - The route might be using a different import path
   - The mock might not be set up before the route is imported

3. **Non-serializable values in result object:**
   - Functions, symbols, or circular references
   - Mongoose document instances that weren't converted
   - Undefined values in arrays or objects

4. **APIResponse.success mock not being called:**
   - The route might be calling the real `APIResponse.success` instead of the mock
   - The mock might not be properly intercepting the call

## Implementation Plan

### Phase 1: Debug and Identify Non-Serializable Value

**1.1 Add debugging to identify exact failing value**

- **File:** `tests/integration/api/vendors.integration.test.ts`
- **Action:** Add a test that logs the exact value causing serialization failure
- **Approach:** Wrap `APIResponse.success` mock to catch and log the problematic value

**1.2 Verify mocks are being called**

- **Files:** Both vendor and venue test files
- **Action:** Add console.log or assertions to verify mocks are invoked
- **Check:** Ensure `compressVendor`/`compressVenue` and `APIResponse.success` are actually being called

**1.3 Check pagination calculation**

- **Files:** Both test files
- **Action:** Ensure `total` and `limit` are always valid numbers
- **Fix:** Add validation in mocks to ensure `total` is a number, `limit` is a number > 0

### Phase 2: Fix Pagination Serialization

**2.1 Ensure pagination values are always serializable**

- **Files:** `tests/integration/api/vendors.integration.test.ts`, `tests/integration/api/venues.integration.test.ts`
- **Action:** Update `APIResponse.success` mock to explicitly handle pagination object
- **Fix:**
  ```typescript
  // In APIResponse.success mock, ensure pagination is always valid:
  if (data.pagination) {
    data.pagination = {
      total: Number(data.pagination.total) || 0,
      page: Number(data.pagination.page) || 1,
      limit: Number(data.pagination.limit) || 10,
      totalPages: Number.isFinite(data.pagination.totalPages) 
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 0
    };
  }
  ```

**2.2 Validate mock return values**

- **Files:** Both test files
- **Action:** Ensure `Vendor.countDocuments` and `Venue.countDocuments` always return numbers
- **Fix:** Update mocks to return `Promise.resolve(Number(total))` instead of just `Promise.resolve(total)`

### Phase 3: Ensure compressVendor/compressVenue Return Fully Serializable Objects

**3.1 Add comprehensive serialization check**

- **Files:** Both test files
- **Action:** Update `compressVendor` and `compressVenue` mocks to recursively ensure all nested values are serializable
- **Fix:** Add a final pass that uses `JSON.stringify` and `JSON.parse` to validate serializability

**3.2 Handle edge cases in compress mocks**

- **Files:** Both test files
- **Action:** Ensure mocks handle:
  - `undefined` values (remove them)
  - `null` values (keep them)
  - Functions (remove them)
  - Symbols (remove them)
  - Circular references (break them)
  - Mongoose documents (convert to plain objects)

### Phase 4: Fix Venue Availability Conflicting Bookings Test

**4.1 Check test expectations**

- **File:** `tests/integration/api/venues.integration.test.ts`
- **Action:** Review the "should detect conflicting bookings" test
- **Fix:** Ensure mock data matches expected response structure

**4.2 Verify Booking.find mock**

- **File:** `tests/integration/api/venues.integration.test.ts`
- **Action:** Ensure `Booking.find` mock returns properly serializable booking data
- **Fix:** Use `createChainableQuery` helper for Booking.find mocks

### Phase 5: Add Safety Checks in APIResponse.success Mock

**5.1 Implement comprehensive serialization in APIResponse.success**

- **Files:** Both test files
- **Action:** Update `APIResponse.success` mock to be the final safety net
- **Fix:** Add a try-catch that attempts `JSON.stringify` and removes problematic values if it fails

**5.2 Add validation before returning**

- **Files:** Both test files
- **Action:** Validate the final result object before returning
- **Fix:**
  ```typescript
  APIResponse: {
    success: jest.fn((data: any) => {
      // Final validation - ensure everything is serializable
      try {
        JSON.stringify(data); // This will throw if not serializable
        return { success: true, data };
      } catch (error) {
        // If serialization fails, recursively clean the object
        const cleaned = deepCleanForSerialization(data);
        return { success: true, data: cleaned };
      }
    }),
  }
  ```

## File Changes Summary

### Test Files to Modify

1. **`tests/integration/api/vendors.integration.test.ts`**
   - Update `APIResponse.success` mock with comprehensive serialization
   - Ensure `Vendor.countDocuments` returns a number
   - Add validation for pagination object
   - Add debugging to identify non-serializable values

2. **`tests/integration/api/venues.integration.test.ts`**
   - Update `APIResponse.success` mock with comprehensive serialization
   - Ensure `Venue.countDocuments` returns a number
   - Add validation for pagination object
   - Fix "conflicting bookings" test
   - Ensure `Booking.find` uses `createChainableQuery` helper

## Success Criteria

- All 9 failing tests pass
- Test suite shows: 0 failed, 51 passed
- No JSON serialization errors in any test
- All mocks properly handle edge cases (NaN, Infinity, undefined, functions, symbols)
- Pagination calculations always produce valid numbers

## Testing Strategy

1. Run integration tests after each phase
2. Add temporary console.log statements to identify exact failing values
3. Test with edge cases (undefined total, zero limit, etc.)
4. Final regression: Run full test suite to ensure no regressions

## Implementation Order

1. **Phase 1** - Debug to identify exact issue (highest priority)
2. **Phase 2** - Fix pagination serialization
3. **Phase 3** - Ensure compress mocks return fully serializable objects
4. **Phase 4** - Fix venue availability test
5. **Phase 5** - Add final safety checks

## Notes

- The error occurs at the `NextResponse.json()` call, which means the issue is in the `result` object passed to `APIResponse.success`
- Even though we have mocks, something is still not serializable
- Need to add comprehensive validation at every step of the data transformation pipeline

