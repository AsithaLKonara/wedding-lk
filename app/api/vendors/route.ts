import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockVendors = [
      {
        _id: '1',
        name: 'Elegant Photography',
        category: 'Photography',
        location: 'Colombo',
        rating: 4.8,
        priceRange: 'Rs. 50,000 - 100,000',
        email: 'info@elegantphoto.lk',
        phone: '+94 11 234 5678'
      },
      {
        _id: '2',
        name: 'Royal Catering Services',
        category: 'Catering',
        location: 'Kandy',
        rating: 4.9,
        priceRange: 'Rs. 2,000 - 3,000 per person',
        email: 'info@royalcatering.lk',
        phone: '+94 81 234 5678'
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockVendors,
      count: mockVendors.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockVendor = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockVendor
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}
