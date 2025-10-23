import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Vendor, User } from '@/lib/models'

export async function POST(request: NextRequest) {
  try {
    // Custom auth implementation
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!user?.user) {
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
      availability,
      userId
    } = await request.json()

    if (!businessName || !businessType || !description || !services || !location || !contactPhone || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ userId })
    if (existingVendor) {
      return NextResponse.json({ error: 'Vendor profile already exists' }, { status: 400 })
    }

    // Create vendor profile
    const vendor = new Vendor({
      userId,
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
    await User.findByIdAndUpdate(userId, {
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
