import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Venue } from '@/lib/models/venue'
import { Vendor } from '@/lib/models/vendor'
import { Package } from '@/lib/models/package'

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

    // Connect to database
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
    try {
      const venues = await Venue.find({ isActive: true }).limit(5)
      
      if (venues.length > 0) {
        return {
          text: "Here are some popular venues I found for you:",
          data: venues.map(venue => ({
            name: venue.name,
            location: venue.location.city,
            capacity: venue.capacity.max,
            price: venue.pricing.basePrice
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
    } catch (error) {
      console.error('Venue search error:', error)
    }
    
    // Fallback to sample data
    const sampleVenues = [
      {
        name: 'Grand Ballroom Hotel',
        location: 'Colombo',
        capacity: 300,
        price: 200000
      },
      {
        name: 'Garden Paradise',
        location: 'Kandy',
        capacity: 150,
        price: 120000
      },
      {
        name: 'Beach Resort',
        location: 'Galle',
        capacity: 200,
        price: 180000
      }
    ]
    
    return {
      text: "Here are some popular venues I found for you:",
      data: sampleVenues,
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
    try {
      const vendors = await Vendor.find({ isActive: true }).limit(5)
      
      if (vendors.length > 0) {
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
    } catch (error) {
      console.error('Vendor search error:', error)
    }
    
    // Fallback to sample data
    const sampleVendors = [
      {
        name: 'Elite Photography',
        category: 'Photography',
        location: 'Colombo',
        rating: 4.8
      },
      {
        name: 'Royal Catering',
        category: 'Catering',
        location: 'Kandy',
        rating: 4.6
      },
      {
        name: 'Melody Band',
        category: 'Music',
        location: 'Galle',
        rating: 4.7
      }
    ]
    
    return {
      text: "Here are some top-rated vendors:",
      data: sampleVendors,
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
    try {
      const packages = await Package.find({ isActive: true }).limit(5)
      
      if (packages.length > 0) {
        return {
          text: "Here are some amazing wedding packages:",
          data: packages.map(pkg => {
            // Handle both Map and Object features
            let features = []
            if (pkg.features) {
              if (pkg.features instanceof Map) {
                features = Array.from(pkg.features.keys()).filter(key => pkg.features.get(key) === true).slice(0, 3)
              } else {
                features = Object.keys(pkg.features).filter(key => pkg.features[key] === true).slice(0, 3)
              }
            }
            return {
              name: pkg.name,
              price: pkg.price,
              category: pkg.category,
              features: features
            }
          }),
          suggestions: [
            "Show premium packages",
            "Show budget packages",
            "Customize package",
            "Compare packages"
          ],
          type: 'packages'
        }
      }
    } catch (error) {
      console.error('Package search error:', error)
    }
    
    // Fallback to sample data
    const samplePackages = [
      {
        name: 'Premium Wedding Package',
        price: 150000,
        category: 'Premium',
        features: ['Venue', 'Photography', 'Catering']
      },
      {
        name: 'Standard Wedding Package',
        price: 100000,
        category: 'Standard',
        features: ['Venue', 'Photography', 'Catering']
      },
      {
        name: 'Basic Wedding Package',
        price: 75000,
        category: 'Basic',
        features: ['Venue', 'Catering']
      }
    ]
    
    return {
      text: "Here are some amazing wedding packages:",
      data: samplePackages,
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






