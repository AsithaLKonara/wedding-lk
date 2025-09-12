import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GuestList } from '@/lib/models/guestList';
import { withAuth, requireUser } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get guest list for a wedding
async function getGuestList(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('weddingId');
    const status = searchParams.get('status'); // 'all' | 'attending' | 'not_attending' | 'pending'
    const side = searchParams.get('side'); // 'bride' | 'groom' | 'both' | 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    await connectDB();

    if (!weddingId) {
      return NextResponse.json({
        success: false,
        error: 'Wedding ID is required'
      }, { status: 400 });
    }

    // Find guest list
    const guestList = await GuestList.findOne({
      weddingId,
      userId: user.id
    });

    if (!guestList) {
      return NextResponse.json({
        success: false,
        error: 'Guest list not found'
      }, { status: 404 });
    }

    // Filter guests based on criteria
    let filteredGuests = guestList.guests;

    if (status && status !== 'all') {
      filteredGuests = filteredGuests.filter(guest => guest.rsvpStatus === status);
    }

    if (side && side !== 'all') {
      filteredGuests = filteredGuests.filter(guest => guest.side === side);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGuests = filteredGuests.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      guestList: {
        id: guestList._id,
        weddingId: guestList.weddingId,
        weddingDate: guestList.weddingDate,
        weddingLocation: guestList.weddingLocation,
        guests: paginatedGuests,
        settings: guestList.settings,
        statistics: guestList.statistics
      },
      pagination: {
        page,
        limit,
        total: filteredGuests.length,
        totalPages: Math.ceil(filteredGuests.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching guest list:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch guest list'
    }, { status: 500 });
  }
}

// POST - Create or update guest list
async function createGuestList(request: NextRequest) {
  try {
    const user = (request as any).user;
    const {
      weddingId,
      weddingDate,
      weddingLocation,
      guests,
      settings
    } = await request.json();

    if (!weddingId || !weddingDate || !weddingLocation) {
      return NextResponse.json({
        success: false,
        error: 'Wedding ID, date, and location are required'
      }, { status: 400 });
    }

    await connectDB();

    // Check if guest list already exists
    let guestList = await GuestList.findOne({
      weddingId,
      userId: user.id
    });

    if (guestList) {
      // Update existing guest list
      guestList.weddingDate = new Date(weddingDate);
      guestList.weddingLocation = weddingLocation;
      guestList.guests = guests || guestList.guests;
      guestList.settings = { ...guestList.settings, ...settings };
      
      await guestList.save();
    } else {
      // Create new guest list
      guestList = new GuestList({
        weddingId,
        userId: user.id,
        weddingDate: new Date(weddingDate),
        weddingLocation,
        guests: guests || [],
        settings: {
          allowPlusOnes: true,
          maxPlusOnes: 1,
          rsvpDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          requireDietaryInfo: false,
          allowGiftTracking: true,
          sendReminders: true,
          reminderDays: [7, 3, 1], // 7 days, 3 days, 1 day before
          ...settings
        }
      });

      await guestList.save();
    }

    return NextResponse.json({
      success: true,
      guestList: {
        id: guestList._id,
        weddingId: guestList.weddingId,
        weddingDate: guestList.weddingDate,
        weddingLocation: guestList.weddingLocation,
        statistics: guestList.statistics
      },
      message: 'Guest list saved successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating guest list:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create guest list'
    }, { status: 500 });
  }
}

// PUT - Update guest RSVP
async function updateGuestRSVP(request: NextRequest) {
  try {
    const user = (request as any).user;
    const {
      weddingId,
      guestId,
      rsvpStatus,
      rsvpNotes,
      dietaryRequirements,
      allergies,
      specialRequests,
      plusOneName,
      plusOneEmail,
      plusOnePhone
    } = await request.json();

    if (!weddingId || !guestId || !rsvpStatus) {
      return NextResponse.json({
        success: false,
        error: 'Wedding ID, guest ID, and RSVP status are required'
      }, { status: 400 });
    }

    await connectDB();

    const guestList = await GuestList.findOne({
      weddingId,
      userId: user.id
    });

    if (!guestList) {
      return NextResponse.json({
        success: false,
        error: 'Guest list not found'
      }, { status: 404 });
    }

    const guest = guestList.guests.find(g => g.id === guestId);
    if (!guest) {
      return NextResponse.json({
        success: false,
        error: 'Guest not found'
      }, { status: 404 });
    }

    // Update guest RSVP
    guest.rsvpStatus = rsvpStatus;
    guest.rsvpDate = new Date();
    guest.rsvpNotes = rsvpNotes || guest.rsvpNotes;
    guest.dietaryRequirements = dietaryRequirements || guest.dietaryRequirements;
    guest.allergies = allergies || guest.allergies;
    guest.specialRequests = specialRequests || guest.specialRequests;
    
    if (plusOneName) guest.plusOneName = plusOneName;
    if (plusOneEmail) guest.plusOneEmail = plusOneEmail;
    if (plusOnePhone) guest.plusOnePhone = plusOnePhone;

    await guestList.save();

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        name: `${guest.firstName} ${guest.lastName}`,
        rsvpStatus: guest.rsvpStatus,
        rsvpDate: guest.rsvpDate
      },
      message: 'RSVP updated successfully'
    });

  } catch (error) {
    console.error('Error updating guest RSVP:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update RSVP'
    }, { status: 500 });
  }
}

export const GET = withRateLimit(
  rateLimitConfigs.api,
  withAuth(getGuestList, requireUser())
);

export const POST = withRateLimit(
  rateLimitConfigs.api,
  withAuth(createGuestList, requireUser())
);

export const PUT = withRateLimit(
  rateLimitConfigs.api,
  withAuth(updateGuestRSVP, requireUser())
);

