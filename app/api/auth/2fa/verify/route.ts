import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { TwoFactorAuth } from '@/lib/2fa';
import { apiRateLimit } from '@/lib/rate-limiting';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(6).max(8),
  action: z.enum(['enable', 'disable', 'verify']).default('verify'),
});

// POST /api/auth/2fa/verify - Verify 2FA token
export async function POST(request: NextRequest) {
  return apiRateLimit.check(request).then(async (rateLimitResult) => {
    if (!rateLimitResult.allowed) {
      return rateLimitResult.error!;
    }

    try {
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();
      const validation = verifySchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request data',
            details: validation.error.errors
          },
          { status: 400 }
        );
      }

      const { token, action } = validation.data;

      let result: boolean;
      let message: string;

      switch (action) {
        case 'enable':
          result = await TwoFactorAuth.enable2FA(session.user.id, token);
          message = result ? '2FA enabled successfully' : 'Invalid token';
          break;
          
        case 'disable':
          result = await TwoFactorAuth.disable2FA(session.user.id, token);
          message = result ? '2FA disabled successfully' : 'Invalid token';
          break;
          
        case 'verify':
        default:
          const verification = await TwoFactorAuth.verifyToken(session.user.id, token);
          result = verification.isValid;
          message = result ? 'Token verified successfully' : 'Invalid token';
          break;
      }

      if (!result) {
        return NextResponse.json(
          {
            success: false,
            error: 'Verification failed',
            message
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message,
        data: {
          verified: true,
          action
        }
      });

    } catch (error) {
      console.error('2FA verification error:', error);
      return NextResponse.json(
        {
          success: false,
          error: '2FA verification failed',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}


