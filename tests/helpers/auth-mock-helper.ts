/**
 * Shared auth mocking utilities for integration tests
 * Provides consistent mocking patterns for authentication helpers
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive?: boolean;
  isVerified?: boolean;
}

/**
 * Creates a mock user object with default values
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    isActive: true,
    isVerified: true,
    ...overrides,
  };
}

/**
 * Mocks getUserFromRequestWithError to return { user, error: null }
 * This matches the actual return structure of the helper
 */
export function mockGetUserFromRequestWithError(user: MockUser | null = null) {
  const mockUser = user || createMockUser();
  return {
    user: mockUser,
    error: null,
  };
}

/**
 * Mocks getUserFromRequest to return a user object
 */
export function mockGetUserFromRequest(user: MockUser | null = null): MockUser {
  return user || createMockUser();
}

/**
 * Mocks verifyToken to return a user object
 */
export function mockVerifyToken(token: string, user: MockUser | null = null): MockUser | null {
  if (token === 'valid-token' || token) {
    return user || createMockUser();
  }
  return null;
}

/**
 * Sets up Jest mocks for auth helpers
 */
export function setupAuthMocks(user: MockUser | null = null) {
  const mockUser = user || createMockUser();
  
  jest.mock('@/lib/auth/get-user-from-request', () => ({
    getUserFromRequestWithError: jest.fn(() => ({
      user: mockUser,
      error: null,
    })),
    getUserFromRequest: jest.fn(() => mockUser),
  }));
  
  jest.mock('@/lib/auth/custom-auth', () => ({
    verifyToken: jest.fn((token: string) => {
      if (token === 'valid-token' || token) {
        return mockUser;
      }
      return null;
    }),
    signUp: jest.fn(),
    signIn: jest.fn(),
    generateToken: jest.fn(() => 'mock-jwt-token'),
  }));
}

