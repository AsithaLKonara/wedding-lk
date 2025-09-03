import { NextRequest, NextResponse } from "next/server"
import { UserAvatarService } from "@/lib/services/user-avatar-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (vendorId) {
      // Get single vendor with owner avatar
      const vendor = await UserAvatarService.getVendorWithOwner(vendorId)
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
      }
      return NextResponse.json({ vendor })
    }

    // Get all vendors with owner avatars
    const vendors = await UserAvatarService.getAllVendorsWithOwners()
    return NextResponse.json({ 
      vendors: vendors.slice(0, limit),
      total: vendors.length 
    })

  } catch (error) {
    console.error('Error fetching vendors with avatars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors with avatars' },
      { status: 500 }
    )
  }
} 