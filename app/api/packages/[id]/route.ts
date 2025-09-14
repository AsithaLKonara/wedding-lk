import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import VendorPackage from '@/lib/models/vendorPackage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const packageId = params.id

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
    const formattedPackage = {
      _id: packageData._id,
      name: packageData.name,
      description: packageData.description,
      price: packageData.price,
      originalPrice: packageData.originalPrice || packageData.price * 1.3,
      rating: {
        average: packageData.rating || 4.5,
        count: packageData.reviewCount || 0
      },
      features: packageData.features || [],
      venues: packageData.venues || [],
      vendors: packageData.vendors || [],
      badge: packageData.badge,
      badgeColor: packageData.badgeColor,
      location: packageData.location,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const packageId = params.id
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const packageId = params.id

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
