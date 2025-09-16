import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { withAdmin } from '@/lib/middleware/auth-middleware';

async function handler(req: NextRequest) {
  try {
    await connectDB();

    const users = await User.find({})
      .select('-password -resetPasswordToken -resetPasswordExpires -emailVerificationToken -emailVerificationExpires')
      .sort({ createdAt: -1 })
      .limit(100);

    const userStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending_verification').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      verified: users.filter(u => u.isEmailVerified).length,
      byRole: {
        user: users.filter(u => u.role === 'user').length,
        vendor: users.filter(u => u.role === 'vendor').length,
        wedding_planner: users.filter(u => u.role === 'wedding_planner').length,
        admin: users.filter(u => u.role === 'admin').length,
      }
    };

    return NextResponse.json({
      success: true,
      users,
      stats: userStats
    });

  } catch (error: unknown) {
    console.error('❌ Admin users fetch error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(handler);
