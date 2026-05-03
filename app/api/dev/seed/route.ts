import { NextResponse } from 'next/server';
import { resetAndSeedDatabase } from '@/lib/comprehensive-seeder';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const result = await resetAndSeedDatabase();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
