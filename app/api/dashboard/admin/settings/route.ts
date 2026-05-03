import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { SystemSettings } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const settings = await SystemSettings.find();
    
    // Group settings by category
    const groupedSettings: any = {};
    settings.forEach(s => {
      if (!groupedSettings[s.category]) groupedSettings[s.category] = {};
      groupedSettings[s.category][s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      settings: groupedSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { section, settings } = await request.json();
    await connectDB();

    for (const [key, value] of Object.entries(settings)) {
      await SystemSettings.findOneAndUpdate(
        { key, category: section },
        { value },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}