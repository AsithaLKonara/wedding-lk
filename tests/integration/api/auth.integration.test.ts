import { NextRequest } from 'next/server';
import { POST as signupHandler } from '@/app/api/auth/signup/route';
import { POST as signinHandler } from '@/app/api/auth/signin/route';
import { POST as signoutHandler } from '@/app/api/auth/signout/route';
import { GET as meHandler } from '@/app/api/auth/me/route';
import { User } from '@/lib/models/user';

// Use a simple string ID generator for tests instead of mongoose.Types.ObjectId
const generateTestId = () => 'test-id-' + Math.random().toString(36).substring(7);

// Mock database connection
jest.mock('@/lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

// Mock session functions
jest.mock('@/lib/auth/session', () => ({
  clearSession: jest.fn().mockResolvedValue(undefined),
  setSession: jest.fn().mockResolvedValue(undefined),
  getSession: jest.fn().mockResolvedValue(null),
}));

// Mock custom-auth functions
jest.mock('@/lib/auth/custom-auth', () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  generateToken: jest.fn((user: any) => `mock-token-${user.id}`),
  verifyToken: jest.fn((token: string) => {
    if (token === 'valid-token' || token?.startsWith('mock-token-')) {
      return {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        isActive: true,
        isVerified: true,
      };
    }
    return null;
  }),
}));

// Mock User model with chainable query methods
const createMockQuery = (mockResult: any) => {
  const query = {
    select: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockResult),
    then: (onResolve: any) => Promise.resolve(mockResult).then(onResolve),
    catch: (onReject: any) => Promise.resolve(mockResult).catch(onReject),
  };
  return query;
};

jest.mock('@/lib/models/user', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

describe('Authentication API Integration Tests', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: new Headers(),
      cookies: {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      },
      json: jest.fn(),
    } as unknown as NextRequest;
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        role: 'user',
      };

      const mockUser = {
        id: 'user123',
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isActive: true,
        isVerified: true,
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(userData);
      const { signUp, generateToken } = require('@/lib/auth/custom-auth');
      (signUp as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });
      (generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const response = await signupHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200); // Route returns 200, not 201
      expect(json.success).toBe(true);
      expect(json.user).toBeDefined();
      expect(json.token).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'TestPass123!',
        role: 'user',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(userData);
      const { signUp } = require('@/lib/auth/custom-auth');
      (signUp as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Email already registered',
      });

      const response = await signupHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error?.toLowerCase()).toContain('email');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'test@example.com',
        // Missing name and password
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(invalidData);
      const { signUp } = require('@/lib/auth/custom-auth');
      (signUp as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Name, email, and password are required',
      });

      const response = await signupHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('should validate password strength', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak', // Too weak
        role: 'user',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(userData);
      const { signUp } = require('@/lib/auth/custom-auth');
      (signUp as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Password must be at least 6 characters',
      });

      const response = await signupHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error || json.message).toBeDefined();
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPass123!',
      };

      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        isActive: true,
        isVerified: true,
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(loginData);
      const { signIn, generateToken } = require('@/lib/auth/custom-auth');
      (signIn as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
      });
      (generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const response = await signinHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.token).toBeDefined();
      expect(json.user).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123!',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(loginData);
      const { signIn } = require('@/lib/auth/custom-auth');
      (signIn as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const response = await signinHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.error).toContain('Invalid');
    });

    it('should reject incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(loginData);
      const { signIn } = require('@/lib/auth/custom-auth');
      (signIn as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials',
      });

      const response = await signinHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.error).toContain('Invalid');
    });

    it('should handle locked accounts', async () => {
      const loginData = {
        email: 'locked@example.com',
        password: 'TestPass123!',
      };

      (mockRequest.json as jest.Mock).mockResolvedValue(loginData);
      const { signIn } = require('@/lib/auth/custom-auth');
      (signIn as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Account is locked',
      });

      const response = await signinHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(401); // Route returns 401 for any auth failure
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });
  });

  describe('POST /api/auth/signout', () => {
    it('should sign out user successfully', async () => {
      const response = await signoutHandler(mockRequest as any);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.success !== false).toBeTruthy();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = {
        _id: generateTestId(),
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        toJSON: () => ({
          _id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        }),
      };

      // Mock verifyToken to return user with required properties
      const { verifyToken } = require('@/lib/auth/custom-auth');
      (verifyToken as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        isActive: true,
        isVerified: true,
      });

      (mockRequest.cookies.get as jest.Mock).mockImplementation((name: string) => {
        if (name === 'auth-token') {
          return { value: 'valid-token' };
        }
        return undefined;
      });

      const response = await meHandler(mockRequest);
      expect(response.status).toBe(200);
    });

    it('should return 401 when not authenticated', async () => {
      (mockRequest.cookies.get as jest.Mock).mockReturnValue(null);

      const response = await meHandler(mockRequest);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error || json.message).toBeDefined();
    });
  });
});

