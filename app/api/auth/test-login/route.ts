import { NextRequest, NextResponse } from 'next/server';

// Simple test authentication without database dependency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🧪 TEST LOGIN API CALLED');
    console.log('📧 Credentials:', { email, passwordLength: password?.length });

    // Simple test credentials (no database required)
    if (email === 'admin1@wedding.lk' && password === 'password123') {
      console.log('✅ Test credentials valid');
      
      return NextResponse.json({
        success: true,
        message: 'Test authentication successful',
        user: {
          id: 'test-user-id',
          email: 'admin1@wedding.lk',
          name: 'Test Admin',
          role: 'admin'
        }
      });
    } else {
      console.log('❌ Test credentials invalid');
      
      return NextResponse.json({
        success: false,
        message: 'Invalid test credentials'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('💥 Test login error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Test login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
