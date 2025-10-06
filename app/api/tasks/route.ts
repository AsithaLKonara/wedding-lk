import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockTasks = [
      {
        _id: '1',
        title: 'Book photographer',
        description: 'Find and book wedding photographer',
        status: 'pending',
        assignedTo: { name: 'John Doe', email: 'john@example.com' },
        createdBy: { name: 'Jane Smith', email: 'jane@example.com' }
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: mockTasks,
      count: mockTasks.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mockTask = {
      _id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockTask
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
