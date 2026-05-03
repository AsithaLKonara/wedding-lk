import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { Vendor } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();
    const vendor = await Vendor.findOne({ owner: user.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      availability: vendor.availability || []
    });
  } catch (error) {
    console.error('Error fetching vendor availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    const { date, isAvailable } = await request.json();
    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 });
    }

    await connectDB();
    const vendor = await Vendor.findOne({ owner: user.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Update or add availability
    const existingIndex = vendor.availability.findIndex((a: any) => 
      new Date(a.date).toDateString() === new Date(date).toDateString()
    );

    if (existingIndex > -1) {
      vendor.availability[existingIndex].isAvailable = isAvailable;
    } else {
      vendor.availability.push({ date: new Date(date), isAvailable });
    }

    await vendor.save();

    return NextResponse.json({
      success: true,
      availability: vendor.availability
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
