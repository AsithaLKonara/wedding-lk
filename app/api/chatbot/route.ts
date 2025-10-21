import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple chatbot response for GET requests
    return NextResponse.json({
      response: "Hello! I'm the WeddingLK chatbot. How can I help you plan your perfect wedding?",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing chatbot request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, context } = await request.json()

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
      text: "Hello! I'm here to help you plan your perfect wedding. What would you like to know?",
      suggestions: [
        "Find venues",
        "Browse vendors", 
        "View packages",
        "Get planning tips"
      ],
      type: 'greeting'
    }
  }

  // Help responses
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return {
      text: "I can help you with:",
      suggestions: [
        "Finding wedding venues",
        "Discovering vendors",
        "Exploring packages",
        "Planning timeline",
        "Budget planning"
      ],
      type: 'help'
    }
  }

  // Venue search
  if (lowerMessage.includes('venue') || lowerMessage.includes('location') || lowerMessage.includes('place')) {
    return {
      text: "Here are some popular venues I found for you:",
      data: [
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
      ],
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
    return {
      text: "Here are some top-rated vendors:",
      data: [
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
      ],
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
    return {
      text: "Here are some amazing wedding packages:",
      data: [
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
      ],
      suggestions: [
        "Show premium packages",
        "Show budget packages",
        "Customize package",
        "Compare packages"
      ],
      type: 'packages'
    }
  }

  // Default response
  return {
    text: "I'd be happy to help you with your wedding planning! You can ask me about venues, vendors, packages, or any other wedding-related questions.",
    suggestions: [
      "Find venues",
      "Browse vendors",
      "View packages",
      "Get planning tips"
    ],
    type: 'default'
  }
}

