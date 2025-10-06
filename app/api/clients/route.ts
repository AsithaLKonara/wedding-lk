import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockClients = [
      {
        _id: '1',
        name: 'John & Jane',
        weddingDate: '2024-06-15',
        budget: 500000,
        user: { name: 'John Doe', email: 'john@example.com' }
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockClients,
      count: mockClients.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockClient = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockClient
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
