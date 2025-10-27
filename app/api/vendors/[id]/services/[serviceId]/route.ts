import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Vendor } from '@/lib/models'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, serviceId: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { vendorId, serviceId } = params
    await connectDB()

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    if (vendor.userId?.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const updateData = await request.json()

    // Find and update the service
    const serviceIndex = vendor.services?.findIndex(
      (s: any) => s._id?.toString() === serviceId
    )

    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    vendor.services[serviceIndex] = {
      ...vendor.services[serviceIndex],
      ...updateData
    }

    await vendor.save()

    return NextResponse.json(
      { success: true, service: vendor.services[serviceIndex] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, serviceId: string } }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { vendorId, serviceId } = params
    await connectDB()

    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }

    if (vendor.userId?.toString() !== authResult.user.id && authResult.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Find and remove the service
    const serviceIndex = vendor.services?.findIndex(
      (s: any) => s._id?.toString() === serviceId
    )

    if (serviceIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    vendor.services.splice(serviceIndex, 1)
    await vendor.save()

    return NextResponse.json(
      { success: true, message: 'Service deleted' },
      { status: 204 }
    )
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

