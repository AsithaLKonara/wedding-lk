import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { TwoFactorAuth } from '@/lib/2fa';
import { apiRateLimit } from '@/lib/rate-limiting';

// POST /api/auth/2fa/setup - Generate 2FA setup data
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

      // Check if user already has 2FA enabled
      const isEnabled = await TwoFactorAuth.is2FAEnabled(session.user.id);
      if (isEnabled) {
        return NextResponse.json(
          { error: '2FA is already enabled for this account' },
          { status: 400 }
        );
      }

      // Generate 2FA setup data
      const setupData = await TwoFactorAuth.generateSecret(
        session.user.id,
        session.user.email || ''
      );

      return NextResponse.json({
        success: true,
        data: {
          secret: setupData.secret,
          qrCodeUrl: setupData.qrCodeUrl,
          backupCodes: setupData.backupCodes,
        },
        message: '2FA setup data generated successfully'
      });

    } catch (error) {
      console.error('2FA setup error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate 2FA setup data',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}


