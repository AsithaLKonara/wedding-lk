/**
 * Mock Database Helper for Unit Tests
 * 
 * This helper provides proper mocking for mongoose connections while
 * allowing models to be created and validated normally.
 */

import mongoose from 'mongoose';

// Mock ObjectId to work properly in tests
export const mockObjectId = (id?: string): mongoose.Types.ObjectId => {
  if (id) {
    return new mongoose.Types.ObjectId(id);
  }
  return new mongoose.Types.ObjectId();
};

// Setup function to be called in test files
// This mocks only the connection, not the models
export const setupMockDB = () => {
  // Mock mongoose.connect to prevent real database connections
  const originalConnect = mongoose.connect;
  mongoose.connect = jest.fn().mockResolvedValue(mongoose as any);
  
  // Mock connection object
  const originalConnection = mongoose.connection;
  Object.defineProperty(mongoose, 'connection', {
    get: () => ({
      ...originalConnection,
      readyState: 1, // connected (mocked)
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      once: jest.fn(),
      dropDatabase: jest.fn().mockResolvedValue(undefined),
    }),
    configurable: true,
  });
  
  return {
    restore: () => {
      mongoose.connect = originalConnect;
      Object.defineProperty(mongoose, 'connection', {
        get: () => originalConnection,
        configurable: true,
      });
    },
  };
};

// Cleanup function
export const cleanupMockDB = () => {
  jest.clearAllMocks();
  // Clear all models to prevent conflicts between tests
  mongoose.models = {};
  mongoose.modelSchemas = {};
};

