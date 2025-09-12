import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-utils';
import { User, Vendor, Venue, Post, Reel, Story } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || 'all';
    const sortBy = searchParams.get('sortBy') || 'trending';
    const location = searchParams.get('location') || '';
    const priceMin = searchParams.get('priceMin') || '0';
    const priceMax = searchParams.get('priceMax') || '1000000';
    const rating = searchParams.get('rating') || '0';

    // Build search criteria
    const searchCriteria: any = {};
    
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    if (location) {
      searchCriteria.location = { $regex: location, $options: 'i' };
    }

    if (rating && rating !== '0') {
      searchCriteria.rating = { $gte: parseFloat(rating) };
    }

    if (priceMin !== '0' || priceMax !== '1000000') {
      searchCriteria.price = {
        $gte: parseFloat(priceMin),
        $lte: parseFloat(priceMax)
      };
    }

    // Build sort criteria
    let sortCriteria: any = {};
    switch (sortBy) {
      case 'trending':
        sortCriteria = { trendingScore: -1, createdAt: -1 };
        break;
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'popular':
        sortCriteria = { 'engagement.likes': -1, 'engagement.comments': -1 };
        break;
      case 'nearby':
        // This would require geospatial queries
        sortCriteria = { createdAt: -1 };
        break;
      case 'price_low':
        sortCriteria = { price: 1 };
        break;
      case 'price_high':
        sortCriteria = { price: -1 };
        break;
      case 'rating':
        sortCriteria = { rating: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    const content: any[] = [];

    // Fetch vendors
    if (category === 'all' || category === 'vendors') {
      const vendors = await Vendor.find(searchCriteria)
        .sort(sortCriteria)
        .limit(20)
        .populate('userId', 'name avatar');

      content.push(...vendors.map(vendor => ({
        id: vendor._id.toString(),
        type: 'vendor',
        title: vendor.businessName,
        description: vendor.description,
        image: vendor.images?.[0] || '/placeholder-vendor.jpg',
        author: {
          name: vendor.businessName,
          avatar: vendor.images?.[0] || '/placeholder-avatar.jpg',
          verified: vendor.isVerified,
          type: 'vendor'
        },
        location: vendor.location,
        rating: vendor.rating,
        price: vendor.pricing?.startingPrice,
        currency: 'LKR',
        tags: vendor.services?.map(s => s.name) || [],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: vendor.viewCount || 0
        },
        createdAt: vendor.createdAt,
        trendingScore: Math.random() * 100,
        aiRecommendation: {
          reason: 'Popular in your area',
          confidence: 0.85
        }
      })));
    }

    // Fetch venues
    if (category === 'all' || category === 'venues') {
      const venues = await Venue.find(searchCriteria)
        .sort(sortCriteria)
        .limit(20)
        .populate('vendorId', 'businessName images');

      content.push(...venues.map(venue => ({
        id: venue._id.toString(),
        type: 'venue',
        title: venue.name,
        description: venue.description,
        image: venue.images?.[0] || '/placeholder-venue.jpg',
        author: {
          name: venue.vendorId?.businessName || 'Unknown Vendor',
          avatar: venue.vendorId?.images?.[0] || '/placeholder-avatar.jpg',
          verified: true,
          type: 'venue'
        },
        location: venue.location,
        rating: venue.rating,
        price: venue.pricing?.startingPrice,
        currency: 'LKR',
        tags: venue.amenities || [],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: venue.viewCount || 0
        },
        createdAt: venue.createdAt,
        trendingScore: Math.random() * 100,
        aiRecommendation: {
          reason: 'Perfect for your budget',
          confidence: 0.92
        }
      })));
    }

    // Fetch posts
    if (category === 'all' || category === 'posts') {
      const posts = await Post.find(searchCriteria)
        .sort(sortCriteria)
        .limit(20)
        .populate('author.id', 'name avatar');

      content.push(...posts.map(post => ({
        id: post._id.toString(),
        type: 'post',
        title: post.content.substring(0, 100) + '...',
        description: post.content,
        image: post.images?.[0] || '/placeholder-post.jpg',
        author: {
          name: post.author.name,
          avatar: post.author.avatar || '/placeholder-avatar.jpg',
          verified: post.author.verified,
          type: post.author.type
        },
        location: post.location,
        tags: post.tags,
        engagement: {
          likes: post.engagement.likes,
          comments: post.engagement.comments,
          shares: post.engagement.shares,
          views: post.engagement.views
        },
        createdAt: post.createdAt,
        trendingScore: Math.random() * 100,
        aiRecommendation: {
          reason: 'Matches your interests',
          confidence: 0.78
        }
      })));
    }

    // Fetch reels
    if (category === 'all' || category === 'reels') {
      const reels = await Reel.find(searchCriteria)
        .sort(sortCriteria)
        .limit(20)
        .populate('author.id', 'name avatar');

      content.push(...reels.map(reel => ({
        id: reel._id.toString(),
        type: 'reel',
        title: reel.caption.substring(0, 100) + '...',
        description: reel.caption,
        image: reel.video.thumbnail,
        author: {
          name: reel.author.name,
          avatar: reel.author.avatar || '/placeholder-avatar.jpg',
          verified: reel.author.verified,
          type: reel.author.type
        },
        tags: reel.hashtags,
        engagement: {
          likes: reel.metrics.likeCount,
          comments: reel.metrics.commentCount,
          shares: reel.metrics.shareCount,
          views: reel.metrics.viewCount
        },
        createdAt: reel.createdAt,
        trendingScore: reel.trendingScore,
        aiRecommendation: {
          reason: 'Trending in your area',
          confidence: 0.88
        }
      })));
    }

    // Fetch stories
    if (category === 'all' || category === 'stories') {
      const stories = await Story.find(searchCriteria)
        .sort(sortCriteria)
        .limit(20)
        .populate('author.id', 'name avatar');

      content.push(...stories.map(story => ({
        id: story._id.toString(),
        type: 'story',
        title: story.content.text?.substring(0, 100) + '...' || 'Story',
        description: story.content.text || '',
        image: story.content.media?.thumbnail || story.content.media?.url || '/placeholder-story.jpg',
        author: {
          name: story.author.name,
          avatar: story.author.avatar || '/placeholder-avatar.jpg',
          verified: story.author.verified,
          type: story.author.type
        },
        tags: [],
        engagement: {
          likes: 0,
          comments: story.replyCount,
          shares: story.shareCount,
          views: story.viewCount
        },
        createdAt: story.createdAt,
        trendingScore: Math.random() * 100,
        aiRecommendation: {
          reason: 'Fresh content from your network',
          confidence: 0.75
        }
      })));
    }

    // Sort combined results
    content.sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.trendingScore - a.trendingScore;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return (b.engagement.likes + b.engagement.comments + b.engagement.shares) - 
                 (a.engagement.likes + a.engagement.comments + a.engagement.shares);
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return NextResponse.json({ 
      content: content.slice(0, 30), // Limit to 30 items
      total: content.length,
      hasMore: content.length > 30
    });
  } catch (error) {
    console.error('Error fetching explore content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch explore content' },
      { status: 500 }
    );
  }
}


