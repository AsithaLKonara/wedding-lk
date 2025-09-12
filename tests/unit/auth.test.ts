import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { authMiddleware, withAuth, requireUser, requireAdmin } from '@/lib/middleware/auth-middleware';

// Mock NextAuth
vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn()
}));

describe('Authentication Middleware', () => {
  let mockRequest: NextRequest;
  let mockGetToken: any;

  beforeEach(() => {
    mockRequest = new NextRequest('http://localhost:3000/api/test');
    mockGetToken = vi.fn();
    vi.doMock('next-auth/jwt', () => ({
      getToken: mockGetToken
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should allow access when user is authenticated', async () => {
      mockGetToken.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });

      const result = await authMiddleware(mockRequest, { requireAuth: true });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });
    });

    it('should deny access when user is not authenticated', async () => {
      mockGetToken.mockResolvedValue(null);

      const result = await authMiddleware(mockRequest, { requireAuth: true });

      expect(result.success).toBe(false);
      expect(result.response?.status).toBe(401);
    });

    it('should check role-based access', async () => {
      mockGetToken.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });

      const result = await authMiddleware(mockRequest, { 
        requireAuth: true, 
        requiredRoles: ['admin'] 
      });

      expect(result.success).toBe(false);
      expect(result.response?.status).toBe(403);
    });

    it('should allow admin access for admin role', async () => {
      mockGetToken.mockResolvedValue({
        id: 'admin123',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      });

      const result = await authMiddleware(mockRequest, { 
        requireAuth: true, 
        requiredRoles: ['admin'] 
      });

      expect(result.success).toBe(true);
      expect(result.user?.role).toBe('admin');
    });
  });

  describe('withAuth wrapper', () => {
    it('should call handler when authentication passes', async () => {
      mockGetToken.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });

      const mockHandler = vi.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withAuth(mockHandler, requireUser());

      await wrappedHandler(mockRequest);

      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: 'user123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user'
          })
        })
      );
    });

    it('should return 401 when authentication fails', async () => {
      mockGetToken.mockResolvedValue(null);

      const mockHandler = vi.fn();
      const wrappedHandler = withAuth(mockHandler, requireUser());

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(401);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('Role helpers', () => {
    it('should create correct options for requireUser', () => {
      const options = requireUser();
      expect(options.requiredRoles).toEqual(['user', 'vendor', 'wedding_planner', 'admin']);
    });

    it('should create correct options for requireAdmin', () => {
      const options = requireAdmin();
      expect(options.requiredRoles).toEqual(['admin']);
    });
  });
});

