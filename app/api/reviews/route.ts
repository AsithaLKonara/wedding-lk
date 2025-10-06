import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockReviews = [
      {
        _id: '1',
        rating: 5,
        comment: 'Excellent service and beautiful venue!',
        user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
        vendor: { name: 'Royal Garden Hotel' },
        createdAt: '2024-01-15T10:00:00Z'
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockReviews,
      count: mockReviews.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockReview = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockReview
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
