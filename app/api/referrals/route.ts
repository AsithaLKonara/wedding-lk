import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Referral } from '@/lib/models/referral';
import { User } from '@/lib/models/user';
import { withAuth, requireUser } from '@/lib/middleware/auth-middleware';
import { withRateLimit, rateLimitConfigs } from '@/lib/middleware/rate-limit-middleware';

// GET - Get user's referrals
async function getReferrals(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'sent' | 'received' | 'all'
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    await connectDB();

    // Build query
    const query: any = {};
    
    if (type === 'sent') {
      query.referrerId = user.id;
    } else if (type === 'received') {
      query.refereeId = user.id;
    } else {
      query.$or = [
        { referrerId: user.id },
        { refereeId: user.id }
      ];
    }
    
    if (status !== 'all') {
      query.status = status;
    }

    const referrals = await Referral.find(query)
      .populate('referrerId', 'name email avatar')
      .populate('refereeId', 'name email avatar')
      .populate('bookingId', 'bookingDate amount status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Referral.countDocuments(query);

    // Get referral statistics
    const stats = await Referral.aggregate([
      {
        $match: {
          $or: [
            { referrerId: user.id },
            { refereeId: user.id }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalSent: {
            $sum: { $cond: [{ $eq: ['$referrerId', user.id] }, 1, 0] }
          },
          totalReceived: {
            $sum: { $cond: [{ $eq: ['$refereeId', user.id] }, 1, 0] }
          },
          completedSent: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$referrerId', user.id] }, { $eq: ['$status', 'completed'] }] },
                1,
                0
              ]
            }
          },
          completedReceived: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$refereeId', user.id] }, { $eq: ['$status', 'completed'] }] },
                1,
                0
              ]
            }
          },
          totalEarned: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$referrerId', user.id] }, { $eq: ['$status', 'completed'] }] },
                '$referrerReward.amount',
                0
              ]
            }
          },
          totalSaved: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$refereeId', user.id] }, { $eq: ['$status', 'completed'] }] },
                '$refereeReward.amount',
                0
              ]
            }
          }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      referrals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      statistics: stats[0] || {
        totalSent: 0,
        totalReceived: 0,
        completedSent: 0,
        completedReceived: 0,
        totalEarned: 0,
        totalSaved: 0
      }
    });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch referrals'
    }, { status: 500 });
  }
}

// POST - Create a new referral
async function createReferral(request: NextRequest) {
  try {
    const user = (request as any).user;
    const {
      refereeEmail,
      referralType = 'user_signup',
      source = 'direct',
      campaignId,
      utmParams
    } = await request.json();

    if (!refereeEmail) {
      return NextResponse.json({
        success: false,
        error: 'Referee email is required'
      }, { status: 400 });
    }

    await connectDB();

    // Check if referee already exists
    const existingReferee = await User.findOne({ email: refereeEmail.toLowerCase() });
    if (existingReferee) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 });
    }

    // Check if user has already referred this email
    const existingReferral = await Referral.findOne({
      referrerId: user.id,
      refereeId: existingReferee?._id || refereeEmail
    });

    if (existingReferral) {
      return NextResponse.json({
        success: false,
        error: 'You have already referred this email'
      }, { status: 400 });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode(user.id);

    // Get reward configuration based on referral type
    const rewards = getRewardConfiguration(referralType);

    // Create referral
    const referral = new Referral({
      referrerId: user.id,
      refereeId: refereeEmail, // Will be updated when referee signs up
      referralCode,
      referralType,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      referrerReward: rewards.referrer,
      refereeReward: rewards.referee,
      source,
      campaignId,
      utmParams
    });

    await referral.save();

    // Send referral email (implement email service)
    await sendReferralEmail(refereeEmail, user.name, referralCode);

    return NextResponse.json({
      success: true,
      referral: {
        id: referral._id,
        referralCode: referral.referralCode,
        referralLink: referral.referralLink,
        expiresAt: referral.expiresAt,
        rewards: {
          referrer: referral.referrerReward,
          referee: referral.refereeReward
        }
      },
      message: 'Referral created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create referral'
    }, { status: 500 });
  }
}

// Helper function to generate unique referral code
function generateReferralCode(userId: string): string {
  const prefix = 'WED';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

// Helper function to get reward configuration
function getRewardConfiguration(type: string) {
  const configurations = {
    user_signup: {
      referrer: {
        type: 'credit',
        amount: 1000, // LKR
        currency: 'LKR',
        description: 'LKR 1,000 credit for successful referral'
      },
      referee: {
        type: 'discount',
        amount: 500, // LKR
        currency: 'LKR',
        description: 'LKR 500 discount on first booking'
      }
    },
    vendor_signup: {
      referrer: {
        type: 'commission',
        amount: 5, // 5%
        currency: 'LKR',
        description: '5% commission on referred vendor bookings'
      },
      referee: {
        type: 'discount',
        amount: 10, // 10%
        currency: 'LKR',
        description: '10% discount on platform fees for first 3 months'
      }
    },
    booking: {
      referrer: {
        type: 'credit',
        amount: 500, // LKR
        currency: 'LKR',
        description: 'LKR 500 credit for each booking referral'
      },
      referee: {
        type: 'discount',
        amount: 200, // LKR
        currency: 'LKR',
        description: 'LKR 200 discount on booking'
      }
    },
    first_booking: {
      referrer: {
        type: 'credit',
        amount: 2000, // LKR
        currency: 'LKR',
        description: 'LKR 2,000 credit for first booking referral'
      },
      referee: {
        type: 'discount',
        amount: 1000, // LKR
        currency: 'LKR',
        description: 'LKR 1,000 discount on first booking'
      }
    }
  };

  return configurations[type] || configurations.user_signup;
}

// Helper function to send referral email
async function sendReferralEmail(email: string, referrerName: string, referralCode: string) {
  // Implement email service integration
  console.log(`Sending referral email to ${email} from ${referrerName} with code ${referralCode}`);
  // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
}

export const GET = withRateLimit(
  rateLimitConfigs.api,
  withAuth(getReferrals, requireUser())
);

export const POST = withRateLimit(
  rateLimitConfigs.api,
  withAuth(createReferral, requireUser())
);

