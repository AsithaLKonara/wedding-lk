import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { 
  getUserSocialAccounts, 
  unlinkSocialAccount, 
  hasPasswordSet,
  setPasswordForSocialUser 
} from '@/lib/auth/social-login-handler';

// GET /api/auth/social-accounts - Get user's linked social accounts
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const socialAccounts = await getUserSocialAccounts(session.user.id);
    const hasPassword = await hasPasswordSet(session.user.id);
    
    return NextResponse.json({
      success: true,
      data: {
        socialAccounts,
        hasPassword,
        canUnlink: socialAccounts.length > 1 || hasPassword
      }
    });

  } catch (error) {
    console.error('Get social accounts error:', error);
    return NextResponse.json(
      { error: 'Failed to get social accounts' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/social-accounts - Unlink a social account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    await connectDB();
    
    // Check if user has password or other social accounts
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasPassword = await hasPasswordSet(session.user.id);
    const socialAccounts = user.socialAccounts || [];
    
    if (socialAccounts.length <= 1 && !hasPassword) {
      return NextResponse.json({ 
        error: 'Cannot unlink the only authentication method. Please set a password first.' 
      }, { status: 400 });
    }

    const success = await unlinkSocialAccount(session.user.id, provider);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `${provider} account unlinked successfully`
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to unlink social account' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unlink social account error:', error);
    return NextResponse.json(
      { error: 'Failed to unlink social account' },
      { status: 500 }
    );
  }
}

// POST /api/auth/social-accounts/set-password - Set password for social-only users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;
    
    if (!password || password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }

    const success = await setPasswordForSocialUser(session.user.id, password);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Password set successfully'
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to set password' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Set password error:', error);
    return NextResponse.json(
      { error: 'Failed to set password' },
      { status: 500 }
    );
  }
}
