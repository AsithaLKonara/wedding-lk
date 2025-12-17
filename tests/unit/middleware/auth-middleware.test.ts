import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRole, withAdmin, requireAdmin, requireUser } from '@/lib/middleware/auth-middleware';
import { getUserFromRequest } from '@/lib/auth/get-user-from-request';

// Mock the getUserFromRequest function
jest.mock('@/lib/auth/get-user-from-request', () => ({
  getUserFromRequest: jest.fn(),
}));

describe('Auth Middleware', () => {
  let mockRequest: NextRequest;
  let mockHandler: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: new Headers(),
      cookies: {
        get: jest.fn(),
      },
    } as unknown as NextRequest;
    mockHandler = jest.fn().mockResolvedValue(NextResponse.json({ success: true }));
  });

  describe('withAuth', () => {
    it('should call handler when user is authenticated', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      });

      const wrappedHandler = withAuth(mockHandler);
      await wrappedHandler(mockRequest);

      expect(getUserFromRequest).toHaveBeenCalledWith(mockRequest);
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue(null);

      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.error).toBe('Authentication required');
    });

    it('should attach user to request object', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      };
      (getUserFromRequest as jest.Mock).mockReturnValue(mockUser);

      const wrappedHandler = withAuth(mockHandler);
      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalled();
      const callArgs = mockHandler.mock.calls[0][0];
      expect(callArgs.user).toEqual(mockUser);
    });
  });

  describe('withRole', () => {
    it('should allow access for correct role', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'vendor@example.com',
        name: 'Test Vendor',
        role: 'vendor',
      });

      const wrappedHandler = withRole(['vendor', 'admin'])(mockHandler);
      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny access for incorrect role', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
      });

      const wrappedHandler = withRole(['vendor', 'admin'])(mockHandler);
      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
      const json = await response.json();
      expect(json.error).toContain('Insufficient permissions');
    });

    it('should return 401 when user is not authenticated', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue(null);

      const wrappedHandler = withRole(['vendor'])(mockHandler);
      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  describe('withAdmin', () => {
    it('should allow access for admin role', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'admin123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      });

      const wrappedHandler = withAdmin(mockHandler);
      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should deny access for non-admin role', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
      });

      const wrappedHandler = withAdmin(mockHandler);
      const response = await wrappedHandler(mockRequest);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
      const json = await response.json();
      expect(json.error).toContain('Insufficient permissions');
    });
  });

  describe('requireAdmin', () => {
    it('should be a middleware function', () => {
      // requireAdmin is actually withAdmin, which is a middleware wrapper
      expect(typeof requireAdmin).toBe('function');
    });
  });

  describe('requireUser', () => {
    it('should be a middleware function', () => {
      // requireUser is actually withAuth, which is a middleware wrapper
      expect(typeof requireUser).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle handler errors', async () => {
      (getUserFromRequest as jest.Mock).mockReturnValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      });

      const errorHandler = jest.fn().mockRejectedValue(new Error('Handler error'));
      const wrappedHandler = withAuth(errorHandler);

      const response = await wrappedHandler(mockRequest);
      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.error).toBe('Handler error');
    });

    it('should handle authentication errors gracefully', async () => {
      (getUserFromRequest as jest.Mock).mockImplementation(() => {
        throw new Error('Auth error');
      });

      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.error).toBe('Authentication failed');
    });
  });
});

