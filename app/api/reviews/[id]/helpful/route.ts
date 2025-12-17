import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { connectDB } from '@/lib/db'
import { Review } from '@/lib/models'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request)
    
    if (!authResult.authorized || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectDB()

    const review = await Review.findById(id)
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      )
    }

    // Initialize helpful array if it doesn't exist
    if (!review.helpful) {
      review.helpful = []
    }

    // Check if user already marked as helpful
    const userId = authResult.user.id
    const alreadyHelpful = review.helpful.includes(userId)

    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpful = review.helpful.filter((id: string) => id !== userId)
    } else {
      // Add helpful vote
      review.helpful.push(userId)
    }

    await review.save()

    return NextResponse.json({
      success: true,
      helpful: review.helpful.length,
      isHelpful: !alreadyHelpful
    })
  } catch (error) {
    console.error('Error marking review as helpful:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

