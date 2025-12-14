import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import VendorPackage from '@/lib/models/vendorPackage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: packageId } = await params

    // Find the package by ID
    const packageData = await VendorPackage.findById(packageId)
      .populate('venues', 'name rating images location')
      .populate('vendors', 'name businessName category rating')
      .lean()

    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Format the package data
    const typedPackage = packageData as {
      _id: unknown;
      name?: string;
      description?: string;
      price?: number;
      originalPrice?: number;
      rating?: number;
      reviewCount?: number;
      features?: unknown[];
      venues?: unknown[];
      vendors?: unknown[];
      badge?: string;
      badgeColor?: string;
      location?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
    const formattedPackage = {
      _id: typedPackage._id,
      name: typedPackage.name || '',
      description: typedPackage.description || '',
      price: typedPackage.price || 0,
      originalPrice: typedPackage.originalPrice || (typedPackage.price || 0) * 1.3,
      rating: {
        average: typedPackage.rating || 4.5,
        count: typedPackage.reviewCount || 0
      },
      features: typedPackage.features || [],
      venues: typedPackage.venues || [],
      vendors: typedPackage.vendors || [],
      badge: typedPackage.badge,
      badgeColor: typedPackage.badgeColor,
      location: typedPackage.location,
      createdAt: typedPackage.createdAt,
      updatedAt: typedPackage.updatedAt
    }

    return NextResponse.json({
      success: true,
      package: formattedPackage
    })

  } catch (error) {
    console.error('Error fetching package details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch package details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: packageId } = await params
    const body = await request.json()

    // Update the package
    const updatedPackage = await VendorPackage.findByIdAndUpdate(
      packageId,
      body,
      { new: true, runValidators: true }
    )
      .populate('venues', 'name rating images location')
      .populate('vendors', 'name businessName category rating')
      .lean()

    if (!updatedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      package: updatedPackage
    })

  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id: packageId } = await params

    // Delete the package
    const deletedPackage = await VendorPackage.findByIdAndDelete(packageId)

    if (!deletedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}

