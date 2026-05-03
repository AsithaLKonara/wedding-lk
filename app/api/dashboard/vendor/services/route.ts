import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request';
import { User, Vendor, Booking } from '@/lib/models';
import mongoose from 'mongoose';

// GET - Fetch vendor services
export async function GET(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    // Get vendor profile with services
    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Get vendor bookings to calculate service statistics
    const bookings = await Booking.find({ vendor: vendor._id });

    // Format services for frontend
    const vendorServices = vendor.services ? vendor.services.map((service: any) => {
      const serviceBookings = bookings.filter(b => 
        b.service?.name === service.name
      ).length;

      return {
        id: service._id,
        name: service.name,
        category: vendor.category || 'general',
        price: service.price,
        description: service.description,
        isActive: true,
        bookings: serviceBookings,
        rating: vendor.rating?.average || 0
      };
    }) : [];

    return NextResponse.json({
      success: true,
      services: vendorServices
    });

  } catch (error) {
    console.error('❌ Error fetching vendor services:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vendor services',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Add new service
export async function POST(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { name, description, price, duration } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Add service to array
    vendor.services.push({
      name,
      description,
      price,
      duration: duration?.toString() || "1"
    });

    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Service added successfully',
      service: vendor.services[vendor.services.length - 1]
    });

  } catch (error) {
    console.error('❌ Error adding vendor service:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add vendor service'
    }, { status: 500 });
  }
}

// PATCH - Update service
export async function PATCH(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const { serviceId, updates } = await request.json();
    
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Find and update service in array
    const serviceIndex = vendor.services.findIndex((s: any) => s._id.toString() === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (updates.name) vendor.services[serviceIndex].name = updates.name;
    if (updates.description) vendor.services[serviceIndex].description = updates.description;
    if (updates.price) vendor.services[serviceIndex].price = updates.price;
    if (updates.duration) vendor.services[serviceIndex].duration = updates.duration.toString();

    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating vendor service:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update vendor service'
    }, { status: 500 });
  }
}

// DELETE - Remove service
export async function DELETE(request: NextRequest) {
  try {
    const { user: authUser, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!authUser || authUser.role !== 'vendor') {
      return NextResponse.json({ error: "Vendor access required" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ owner: authUser.id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Remove service from array
    vendor.services = vendor.services.filter((s: any) => s._id.toString() !== serviceId);
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting vendor service:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete vendor service'
    }, { status: 500 });
  }
}