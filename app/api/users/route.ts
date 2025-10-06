import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockUsers = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'client',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'vendor',
        createdAt: '2024-01-20T14:30:00Z'
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockUser = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockUser
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
