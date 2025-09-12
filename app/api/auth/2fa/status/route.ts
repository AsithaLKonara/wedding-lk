import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { TwoFactorAuth } from '@/lib/2fa';
import { apiRateLimit } from '@/lib/rate-limiting';

// GET /api/auth/2fa/status - Get 2FA status for current user
export async function GET(request: NextRequest) {
  return apiRateLimit.check(request).then(async (rateLimitResult) => {
    if (!rateLimitResult.allowed) {
      return rateLimitResult.error!;
    }

    try {
      const session = await getServerSession();
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const status = await TwoFactorAuth.get2FAStatus(session.user.id);

      return NextResponse.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('2FA status error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get 2FA status',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}


