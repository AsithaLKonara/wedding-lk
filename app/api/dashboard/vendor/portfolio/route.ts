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
      portfolio: vendor.portfolio || []
    });
  } catch (error) {
    console.error('Error fetching vendor portfolio:', error);
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

    const { imageUrl } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL required" }, { status: 400 });
    }

    await connectDB();
    const vendor = await Vendor.findOne({ owner: user.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    vendor.portfolio.push(imageUrl);
    await vendor.save();

    return NextResponse.json({
      success: true,
      portfolio: vendor.portfolio
    });
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
