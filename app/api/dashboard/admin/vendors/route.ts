import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { Vendor } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    const mappedVendors = vendors.map(v => ({
      id: v._id,
      name: v.businessName,
      email: v.contact?.email || 'N/A',
      phone: v.contact?.phone || 'N/A',
      category: v.category,
      location: v.location?.city || 'Sri Lanka',
      status: v.status || 'pending',
      isVerified: v.isVerified || false,
      rating: v.rating?.average || 0,
      totalBookings: 0, // Need aggregation for real counts
      totalRevenue: 0,  // Need aggregation for real revenue
      joinedDate: (v as any).createdAt,
      lastActive: (v as any).updatedAt,
      services: (v.services || []).map((s: any) => s.name),
      documents: []
    }));

    return NextResponse.json({
      success: true,
      vendors: mappedVendors
    });
  } catch (error) {
    console.error('Error fetching admin vendors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { vendorId, status, isVerified } = await request.json();
    if (!vendorId) return NextResponse.json({ error: "Vendor ID required" }, { status: 400 });

    await connectDB();
    const update: any = {};
    if (status) update.status = status;
    if (isVerified !== undefined) update.isVerified = isVerified;

    const vendor = await Vendor.findByIdAndUpdate(vendorId, update, { new: true });
    if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}