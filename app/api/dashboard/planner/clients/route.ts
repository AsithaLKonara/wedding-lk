import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { Client } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'wedding_planner') {
      return NextResponse.json({ error: "Planner access required" }, { status: 403 });
    }

    await connectDB();
    const clients = await Client.find({ plannerId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      clients: clients.map(c => ({
        id: c._id,
        name: c.name,
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        weddingDate: c.weddingDate,
        status: 'active' // Default status
      }))
    });
  } catch (error) {
    console.error('Error fetching planner clients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await request.json();
    await connectDB();
    
    const client = new Client({
      ...data,
      plannerId: user.id
    });
    await client.save();

    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
