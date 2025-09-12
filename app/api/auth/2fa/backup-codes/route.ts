import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { TwoFactorAuth } from '@/lib/2fa';
import { apiRateLimit } from '@/lib/rate-limiting';

// GET /api/auth/2fa/backup-codes - Get backup codes
// POST /api/auth/2fa/backup-codes - Regenerate backup codes
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
      
      if (!status.enabled) {
        return NextResponse.json(
          { error: '2FA is not enabled for this account' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          hasBackupCodes: status.hasBackupCodes,
          // Don't return actual backup codes for security
          message: status.hasBackupCodes 
            ? 'Backup codes are available' 
            : 'No backup codes available'
        }
      });

    } catch (error) {
      console.error('Get backup codes error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get backup codes status',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}

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

      const status = await TwoFactorAuth.get2FAStatus(session.user.id);
      
      if (!status.enabled) {
        return NextResponse.json(
          { error: '2FA is not enabled for this account' },
          { status: 400 }
        );
      }

      // Regenerate backup codes
      const newBackupCodes = await TwoFactorAuth.regenerateBackupCodes(session.user.id);

      return NextResponse.json({
        success: true,
        data: {
          backupCodes: newBackupCodes
        },
        message: 'New backup codes generated successfully'
      });

    } catch (error) {
      console.error('Regenerate backup codes error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to regenerate backup codes',
          message: 'Internal server error'
        },
        { status: 500 }
      );
    }
  });
}


