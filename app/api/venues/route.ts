import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data for testing without database
    const mockVenues = [
      {
        _id: '1',
        name: 'Royal Garden Hotel',
        location: 'Colombo',
        capacity: 300,
        price: 150000,
        images: ['/placeholder.jpg'],
        amenities: ['Parking', 'Air Conditioning', 'Stage'],
        vendor: { name: 'Royal Hotels', email: 'info@royalhotels.lk' }
      },
      {
        _id: '2',
        name: 'Beach Paradise Resort',
        location: 'Negombo',
        capacity: 200,
        price: 120000,
        images: ['/placeholder.jpg'],
        amenities: ['Beach Access', 'Garden', 'Restaurant'],
        vendor: { name: 'Paradise Resorts', email: 'info@paradise.lk' }
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockVenues,
      count: mockVenues.length
    })
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for testing
    const mockVenue = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockVenue
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating venue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create venue' },
      { status: 500 }
    )
  }
}
