import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AuthUser } from '@/lib/auth/custom-auth';

/**
 * Get authenticated user from request
 * Returns user object or null if not authenticated
 */
export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return null;
  }
  
  const user = verifyToken(token);
  return user || null;
}

/**
 * Get authenticated user from request with error response
 * Returns { user, error } - if error is present, user will be null
 */
export function getUserFromRequestWithError(request: NextRequest): {
  user: AuthUser | null;
  error: NextResponse | null;
} {
  const user = getUserFromRequest(request);
  
  if (!user || !user.id) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      ),
    };
  }
  
  return { user, error: null };
}

