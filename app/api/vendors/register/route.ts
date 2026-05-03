import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Vendor, User } from '@/lib/models'
import { getUserFromRequestWithError } from '@/lib/auth/get-user-from-request'

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequestWithError(request);
    if (error) return error;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      businessName,
      businessType,
      description,
      services,
      location,
      contactPhone,
      contactEmail,
      website,
      experience,
      portfolio,
      certifications,
      pricing,
      availability
    } = await request.json()

    if (!businessName || !businessType || !description || !services || !location || !contactPhone || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ userId: user.id })
    if (existingVendor) {
      return NextResponse.json({ error: 'Vendor profile already exists' }, { status: 400 })
    }

    // Create vendor profile
    const vendor = new Vendor({
      userId: user.id,
      businessName,
      businessType,
      description,
      services,
      location,
      contactPhone,
      contactEmail,
      website: website || '',
      experience: experience || '',
      portfolio: portfolio || [],
      certifications: certifications || [],
      pricing: {
        minPrice: pricing.minPrice,
        maxPrice: pricing.maxPrice,
        currency: pricing.currency || 'LKR'
      },
      availability: {
        weekdays: availability.weekdays,
        weekends: availability.weekends,
        holidays: availability.holidays
      },
      status: 'pending', // Pending approval
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await vendor.save()

    // Update user role to vendor
    await User.findByIdAndUpdate(user.id, {
      role: 'vendor',
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        status: vendor.status
      }
    })
  } catch (error) {
    console.error('Vendor registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
