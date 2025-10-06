import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockServices = [
      {
        _id: '1',
        name: 'Wedding Photography Package',
        description: 'Full day wedding photography with edited photos',
        price: 75000,
        vendor: { name: 'Elegant Photography', email: 'info@elegantphoto.lk' }
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockServices,
      count: mockServices.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockService = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockService
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
