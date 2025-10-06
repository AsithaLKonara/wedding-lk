import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/user'
import { Vendor } from '@/lib/models/vendor'
import { Venue } from '@/lib/models/venue'
import { Package } from '@/lib/models/package'

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

    await connectDB()

    // Simple AI chatbot logic (can be enhanced with OpenAI API)
    const response = await generateBotResponse(message, userId, context)

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing chatbot request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateBotResponse(message: string, userId?: string, context?: any) {
  const lowerMessage = message.toLowerCase()

  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      text: "Hello! I'm your WeddingLK assistant. How can I help you plan your perfect wedding today?",
      suggestions: [
        "Find venues",
        "Browse vendors", 
        "Check packages",
        "Get planning tips"
      ],
      type: 'greeting'
    }
  }

  // Venue search
  if (lowerMessage.includes('venue') || lowerMessage.includes('location') || lowerMessage.includes('place')) {
    const venues = await Venue.find({ isActive: true }).limit(5)
    return {
      text: "Here are some popular venues I found for you:",
      data: venues.map(venue => ({
        name: venue.name,
        location: venue.location.city,
        capacity: venue.capacity,
        price: venue.pricing.startingPrice
      })),
      suggestions: [
        "Show more venues",
        "Filter by location",
        "Filter by capacity",
        "View venue details"
      ],
      type: 'venues'
    }
  }

  // Vendor search
  if (lowerMessage.includes('vendor') || lowerMessage.includes('photographer') || lowerMessage.includes('catering') || lowerMessage.includes('music')) {
    const vendors = await Vendor.find({ isActive: true }).limit(5)
    return {
      text: "Here are some top-rated vendors:",
      data: vendors.map(vendor => ({
        name: vendor.name,
        category: vendor.category,
        location: vendor.location.city,
        rating: vendor.rating.average
      })),
      suggestions: [
        "Show photographers",
        "Show caterers",
        "Show musicians",
        "View all vendors"
      ],
      type: 'vendors'
    }
  }

  // Package search
  if (lowerMessage.includes('package') || lowerMessage.includes('deal') || lowerMessage.includes('offer')) {
    const packages = await Package.find({ isActive: true }).limit(5)
    return {
      text: "Here are some amazing wedding packages:",
      data: packages.map(pkg => ({
        name: pkg.name,
        price: pkg.price,
        category: pkg.category,
        features: pkg.features.slice(0, 3)
      })),
      suggestions: [
        "Show premium packages",
        "Show budget packages",
        "Customize package",
        "Compare packages"
      ],
      type: 'packages'
    }
  }

  // Budget help
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return {
      text: "I can help you with budget planning! Here are some tips:",
      data: [
        "Allocate 40-50% for venue and catering",
        "Set aside 10-15% for photography",
        "Budget 5-10% for flowers and decorations",
        "Keep 5-10% for unexpected expenses"
      ],
      suggestions: [
        "Budget calculator",
        "Cost breakdown",
        "Money-saving tips",
        "Budget-friendly vendors"
      ],
      type: 'budget'
    }
  }

  // Planning timeline
  if (lowerMessage.includes('timeline') || lowerMessage.includes('schedule') || lowerMessage.includes('planning')) {
    return {
      text: "Here's a typical wedding planning timeline:",
      data: [
        "12 months before: Set budget and guest list",
        "10 months before: Book venue and vendors",
        "6 months before: Order dress and send invitations",
        "1 month before: Final details and seating chart"
      ],
      suggestions: [
        "Create timeline",
        "Set reminders",
        "Checklist template",
        "Planning tips"
      ],
      type: 'timeline'
    }
  }

  // Help and support
  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
    return {
      text: "I'm here to help! Here's what I can assist you with:",
      data: [
        "Finding venues and vendors",
        "Wedding planning tips",
        "Budget planning",
        "Timeline creation",
        "Package recommendations"
      ],
      suggestions: [
        "Contact support",
        "Browse FAQ",
        "Live chat",
        "Schedule consultation"
      ],
      type: 'help'
    }
  }

  // Default response
  return {
    text: "I understand you're looking for help with your wedding planning. Could you be more specific about what you need? I can help you find venues, vendors, packages, or provide planning tips!",
    suggestions: [
      "Find venues",
      "Browse vendors",
      "Check packages",
      "Get planning help",
      "Budget planning"
    ],
    type: 'general'
  }
}



