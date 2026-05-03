import { NextRequest, NextResponse } from 'next/server';
// Removed NextAuth - using custom auth
import { seedDatabase, clearDatabase } from '@/lib/seed-data';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(req);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    let result;
    switch (action) {
      case 'seed':
        result = await seedDatabase();
        break;
      case 'clear':
        await clearDatabase();
        result = { message: 'Database cleared successfully' };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "seed" or "clear"' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Database operation completed successfully',
      data: result
    });

  } catch (error) {
    console.error('Database operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform database operation' },
      { status: 500 }
    );
  }
}
