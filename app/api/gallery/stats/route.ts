import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Post from '@/lib/models/post';
import { Venue } from '@/lib/models/venue';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get category counts from posts with images
    const categoryStats = await Post.aggregate([
      { 
        $match: { 
          status: 'active', 
          isActive: true,
          images: { $exists: true, $ne: [] }
        } 
      },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get venue counts
    const venueStats = await Venue.find({ isActive: true })
      .select('name')
      .limit(10);

    // Format categories
    const categories = [
      { id: "all", label: "All Photos", count: await Post.countDocuments({ 
        status: 'active', 
        isActive: true,
        images: { $exists: true, $ne: [] }
      }) },
      { id: "ceremonies", label: "Ceremonies", count: getCategoryCount(categoryStats, ['ceremony', 'traditional']) },
      { id: "receptions", label: "Receptions", count: getCategoryCount(categoryStats, ['reception', 'party']) },
      { id: "decorations", label: "Decorations", count: getCategoryCount(categoryStats, ['decoration', 'flower']) },
      { id: "venues", label: "Venues", count: getCategoryCount(categoryStats, ['venue', 'architecture']) },
      { id: "couples", label: "Couples", count: getCategoryCount(categoryStats, ['couple', 'portrait']) },
      { id: "traditional", label: "Traditional", count: getCategoryCount(categoryStats, ['traditional', 'cultural']) },
      { id: "modern", label: "Modern", count: getCategoryCount(categoryStats, ['modern', 'contemporary']) },
    ];

    // Format venues
    const venues = [
      { id: "all", label: "All Venues" },
      ...venueStats.map(venue => ({
        id: venue.name.toLowerCase().replace(/\s+/g, '-'),
        label: venue.name
      }))
    ];

    return NextResponse.json({
      success: true,
      data: {
        categories,
        venues
      }
    });

  } catch (error) {
    console.error('❌ Error fetching gallery stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery statistics' },
      { status: 500 }
    );
  }
}

function getCategoryCount(stats: any[], keywords: string[]): number {
  return stats
    .filter(stat => 
      keywords.some(keyword => 
        stat._id.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    .reduce((sum, stat) => sum + stat.count, 0);
}
