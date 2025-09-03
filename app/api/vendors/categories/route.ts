import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log('Vendors categories API called');
  
  try {
    // Mock data for vendor categories - always return this data
    const categories = [
      { _id: 'photography', count: 25 },
      { _id: 'catering', count: 18 },
      { _id: 'venue', count: 32 },
      { _id: 'music', count: 15 },
      { _id: 'flowers', count: 12 },
      { _id: 'makeup', count: 8 },
      { _id: 'transportation', count: 6 },
      { _id: 'decorations', count: 14 }
    ];

    // Get featured categories (top 5)
    const featuredCategories = categories.slice(0, 5);

    // Get all categories for filter dropdown
    const allCategories = categories.map(cat => ({
      value: cat._id,
      label: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
      count: cat.count
    }));

    const response = {
      success: true,
      featured: featuredCategories,
      all: allCategories,
      timestamp: new Date().toISOString()
    };

    console.log('Vendors categories response:', response);
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error("Error fetching vendor categories:", error);
    
    // Return fallback data even on error
    const fallbackResponse = {
      success: false,
      featured: [
        { _id: 'photography', count: 25 },
        { _id: 'catering', count: 18 },
        { _id: 'venue', count: 32 }
      ],
      all: [
        { value: 'photography', label: 'Photography', count: 25 },
        { value: 'catering', label: 'Catering', count: 18 },
        { value: 'venue', label: 'Venue', count: 32 }
      ],
      error: "Using fallback data",
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(fallbackResponse, { 
      status: 200, // Return 200 with fallback data
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 