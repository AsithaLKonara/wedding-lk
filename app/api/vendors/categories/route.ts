import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Vendor } from "@/lib/models/vendor"

export async function GET(request: NextRequest) {
  console.log('📊 Fetching vendor categories from MongoDB Atlas...');
  
  try {
    await connectDB()

    // Get categories with counts from MongoDB
    const categories = await Vendor.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

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

    console.log(`✅ Found ${categories.length} vendor categories`);
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error("Error fetching vendor categories:", error);
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch vendor categories",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 