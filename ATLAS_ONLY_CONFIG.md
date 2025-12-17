# MongoDB Atlas Only Configuration

## Overview

This project is configured to use **MongoDB Atlas (cloud) only**. Local MongoDB is not supported due to macOS compatibility constraints.

## Changes Made

### 1. Removed Localhost Fallbacks

- **`lib/db.ts`**: Removed localhost fallback (`mongodb://localhost:27017/weddinglk-dev`). Now throws an error if `MONGODB_URI` is not set.
- **`tests/helpers/db-seed.ts`**: Updated to use MongoDB Atlas URI instead of localhost fallback.

### 2. Updated MongoDB Connection Test

- **`tests/integration/database/mongodb-connection.test.ts`**: 
  - Gated behind `TEST_MONGODB_URI` environment variable
  - When `TEST_MONGODB_URI` is set, uses real MongoDB Atlas connection
  - When not set, uses mocks (default behavior)

### 3. Updated Documentation

- **`README-TESTING.md`**: Updated to reflect Atlas-only setup, removed Docker/local MongoDB instructions

## Configuration

### Environment Variables

All environments require `MONGODB_URI` to be set to a MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Test Environment

For tests, you can use:
- `MONGODB_URI` - Standard MongoDB Atlas URI
- `TEST_DB_URI` - Override for test-specific database
- `TEST_MONGODB_URI` - Enable real connection tests in `mongodb-connection.test.ts`

Default test database URI (if not set):
```
mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0
```

## Running Tests

### Standard Tests (Mocked Connection)
```bash
npm run test:unit
npm run test:integration
```

### Real Connection Tests
To run tests with real MongoDB Atlas connection:
```bash
TEST_MONGODB_URI="your-atlas-uri" npm run test:integration
```

## Error Handling

If `MONGODB_URI` is not set:
- **Development/Production**: Application will throw an error and fail to start
- **Tests**: Tests will use the default Atlas URI from `tests/setup.js`

## Benefits

1. **No Local Setup Required**: No need to install or configure local MongoDB
2. **Consistent Environment**: All developers use the same cloud database
3. **macOS Compatibility**: Avoids version compatibility issues with local MongoDB
4. **Production Parity**: Test environment matches production environment

## Migration Notes

If you previously used local MongoDB:
1. Ensure `MONGODB_URI` is set in your `.env.local` or `.env.test`
2. Remove any local MongoDB installation (not required)
3. Update any scripts or documentation that reference `mongodb://localhost`

