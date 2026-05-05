import { NextRequest, NextResponse } from 'next/server';
import { enhancedAISearchService } from '@/lib/ai-search-enhanced';
import { verifyToken } from '@/lib/auth/tokens';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, location, date, guests } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    console.log('🤖 Processing AI wedding search...');
    
    // 1. Session Detection to identify user's preferred location
    const token = request.cookies.get('auth-token')?.value;
    let sessionUser = null;
    let preferredLocation = location || '';

    if (token) {
      try {
        const decoded = await verifyToken(token);
        if (decoded) {
          await connectDB();
          sessionUser = await User.findById(decoded.id);
          if (sessionUser && sessionUser.location) {
            const city = sessionUser.location.city;
            const province = sessionUser.location.state;
            preferredLocation = city ? `${city}, ${province || ''}` : (province || '');
          }
        }
      } catch (err) {
        console.error('Session detection error in AI search:', err);
      }
    }

    // 2. Fallback to popular places if no location can be identified
    const popularPlaces = [
      "Colombo, Western Province", 
      "Kandy, Central Province", 
      "Galle, Southern Province", 
      "Negombo, Western Province", 
      "Nuwara Eliya, Central Province"
    ];
    
    if (!preferredLocation || preferredLocation.trim() === 'Sri Lanka' || preferredLocation.trim() === '') {
      preferredLocation = popularPlaces[Math.floor(Math.random() * popularPlaces.length)];
    }

    const parts = preferredLocation.split(',');
    const queryCity = parts[0]?.trim() || "Colombo";
    const queryProvince = parts[1]?.trim() || "Western Province";

    // 3. Connect to DB and retrieve top-rated partners in user's region
    await connectDB();
    
    // Fetch top venues in this city/province sorted by rating
    let localVenues = await Venue.find({
      $or: [
        { 'location.city': { $regex: queryCity, $options: 'i' } },
        { 'location.state': { $regex: queryProvince, $options: 'i' } }
      ]
    }).sort({ 'rating.average': -1, rating: -1 }).limit(5);

    // Fetch top vendors sorted by rating
    let localVendors = await Vendor.find({
      $or: [
        { 'location.city': { $regex: queryCity, $options: 'i' } },
        { 'location.state': { $regex: queryProvince, $options: 'i' } }
      ]
    }).sort({ 'rating.average': -1, rating: -1 }).limit(10);

    // Global Fallback if no local items found in MongoDB
    if (localVenues.length === 0) {
      localVenues = await Venue.find({}).sort({ 'rating.average': -1 }).limit(5);
    }
    if (localVendors.length === 0) {
      localVendors = await Vendor.find({}).sort({ 'rating.average': -1 }).limit(10);
    }

    const context = {
      budget: 1000000, 
      guestCount: parseInt(guests) || 150,
      location: preferredLocation,
      date: date || new Date().toISOString().split('T')[0],
      style: 'Elegant',
      preferences: [],
      specialRequirements: []
    };

    const result = await enhancedAISearchService.searchWeddingPlan(query, context);

    // Extract key local partners
    const chosenVenue = localVenues[0] || result.venues[0] || { name: 'Grand Royal Hall', priceRange: 150000 };
    const chosenPhoto = localVendors.find(v => v.category?.toLowerCase() === 'photography') || localVendors[0] || { businessName: 'Lotus Photography', priceRange: 60000 };
    const chosenCatering = localVendors.find(v => v.category?.toLowerCase() === 'catering') || localVendors[1] || { businessName: 'Gold Plate Catering', priceRange: 80000 };
    const chosenDecor = localVendors.find(v => v.category?.toLowerCase() === 'decorations') || localVendors[2] || { businessName: 'Flora Decorators', priceRange: 50000 };

    const venuePrice = chosenVenue.priceRange || chosenVenue.pricing?.basePrice || 150000;
    const photoPrice = chosenPhoto.priceRange || chosenPhoto.pricing?.startingPrice || 60000;
    const caterPrice = chosenCatering.priceRange || chosenCatering.pricing?.startingPrice || 80000;
    const decorPrice = chosenDecor.priceRange || chosenDecor.pricing?.startingPrice || 50000;

    // 4. Synthesize exactly 3 price-tier custom packages
    const dynamicPackages = [];

    // TIER 1: Standard / Budget Friendly Package (150K - 350K)
    const tier1Price = Math.round((venuePrice * 0.7 + photoPrice * 0.8 + decorPrice * 0.7) * 0.9);
    dynamicPackages.push({
      _id: 'ai-budget-package',
      name: `Standard Dream Package (${queryCity})`,
      price: tier1Price,
      originalPrice: Math.round(tier1Price * 1.25),
      rating: 4.6,
      matchScore: 92,
      features: [
        `Venue: ${chosenVenue.name || 'Standard Banquet Hall'} (Shared Space)`,
        `Photography: ${chosenPhoto.businessName || chosenPhoto.name || 'Lotus Photography'} (Half Day session, 100 high-res photos)`,
        `Decorations: ${chosenDecor.businessName || chosenDecor.name || 'Flora Decorators'} (Elegant Poruwa and traditional oil lamp setup)`,
        `Target Guest Capacity: Up to ${context.guestCount} guests`,
        "Complimentary Soft Drinks and Traditional Sri Lankan Sweet items",
        "Interactive budget-planner tools & ceremony itinerary templates"
      ],
      description: "A highly affordable, premium quality package perfect for couples looking to host a spectacular, intimate celebration."
    });

    // TIER 2: Premium / Great Value Package (550K - 900K)
    const tier2Price = Math.round((venuePrice * 1.0 + photoPrice * 1.1 + caterPrice * 1.0 + decorPrice * 1.0) * 0.88);
    dynamicPackages.push({
      _id: 'ai-premium-package',
      name: `Premium Luxury Package (${queryCity})`,
      price: tier2Price,
      originalPrice: Math.round(tier2Price * 1.2),
      rating: 4.8,
      matchScore: 98,
      features: [
        `Venue: ${chosenVenue.name || 'Grand Ballroom'} (Exclusive full-day ballroom access)`,
        `Photography: ${chosenPhoto.businessName || chosenPhoto.name || 'Lotus Photography'} (Full day service, cinematic pre-shoot & album)`,
        `Catering: ${chosenCatering.businessName || chosenCatering.name || 'Gold Plate Catering'} (Luxury international buffet, 3 meats, 5 sides)`,
        `Decorations: ${chosenDecor.businessName || chosenDecor.name || 'Flora Decorators'} (Stunning customized backdrop & fresh flower centerpieces)`,
        `Dedicated Coordinator: Fully synchronized schedule with top-rating vendors`,
        "Professional Sound System, traditional dancers entrance, and custom wedding cake styling"
      ],
      description: "Our most popular balanced package. Combines the best-rated local partners into a seamless, high-end wedding celebration."
    });

    // TIER 3: Elite / Luxury Grand Celebration (1.2M - 2.5M)
    const tier3Price = Math.round((venuePrice * 1.8 + photoPrice * 2.0 + caterPrice * 1.8 + decorPrice * 1.8) * 0.85);
    dynamicPackages.push({
      _id: 'ai-elite-package',
      name: `Elite Grand Celebration Package (${queryCity})`,
      price: tier3Price,
      originalPrice: Math.round(tier3Price * 1.15),
      rating: 4.9,
      matchScore: 96,
      features: [
        `Venue: ${chosenVenue.name || '5-Star Grand Palace'} (Premium Presidential Ballroom with bridal changing room)`,
        `Photography: ${chosenPhoto.businessName || chosenPhoto.name || 'Lotus Photography'} (Multi-cam elite coverage, aerial drone filming, 2 luxury albums)`,
        `Catering: ${chosenCatering.businessName || chosenCatering.name || 'Gold Plate Catering'} (Elite gourmet catering, live cooking action stations, premium desserts)`,
        `Decorations: ${chosenDecor.businessName || chosenDecor.name || 'Flora Decorators'} (Exclusive fairytale lighting, walkway arrangements, imported florals)`,
        "VIP Welcome with traditional drumming crew, luxury saloon car bridal transport",
        "Dynamic live wedding band or DJ, high-definition LED visual screens & multi-tier cake structure"
      ],
      description: "An absolute fairytale celebration. Impeccable luxury styling, dedicated wedding coordinator, and elite execution with five-star partners."
    });

    const formattedResult = {
      interpretation: {
        weddingStyle: context.style,
        budget: { min: context.budget * 0.8, max: context.budget * 1.2 },
        preferences: context.preferences,
        detectedLocation: preferredLocation
      },
      recommendations: {
        venues: result.venues.map((v: any) => ({
          id: v._id,
          name: v.name,
          location: v.location?.city || 'Sri Lanka',
          rating: v.rating?.average || v.rating || 4.5,
          price: v.priceRange || v.pricing?.basePrice || 150000,
          image: v.images?.[0] || '/placeholder.svg?height=200&width=300',
          matchScore: 90 + Math.floor(Math.random() * 10),
          reasons: ['Excellent fit for your style', 'Available on your date']
        })),
        vendors: result.vendors.map((v: any) => ({
          id: v._id,
          name: v.businessName || v.name,
          category: v.category || 'Vendor',
          rating: v.rating?.average || v.rating || 4.5,
          price: v.priceRange || v.pricing?.startingPrice || 50000,
          matchScore: 85 + Math.floor(Math.random() * 15),
          reasons: ['Highly rated in your area', 'Professional service']
        })),
        packages: dynamicPackages.map((p: any) => ({
          id: p._id || p.id,
          title: p.name || p.title,
          price: p.price,
          originalPrice: p.originalPrice || (p.price * 1.2),
          rating: p.rating?.average || p.rating || 4.8,
          matchScore: p.matchScore || 95,
          features: p.features || [],
          description: p.description
        }))
      },
      insights: result.recommendations || result.insights || []
    };
    
    return NextResponse.json({
      success: true,
      data: formattedResult
    });
    
  } catch (error) {
    console.error('❌ Error in AI search:', error);
    return NextResponse.json(
      { error: 'AI search failed' },
      { status: 500 }
    );
  }
}