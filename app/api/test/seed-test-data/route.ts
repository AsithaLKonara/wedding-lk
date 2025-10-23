import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Vendor } from '@/lib/models/vendor';
import { Venue } from '@/lib/models/venue';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Create test users with different roles
    const testUsers = [
      {
        name: 'Test User',
        email: 'user@test.local',
        password: 'UserPass123!',
        role: 'user'
      },
      {
        name: 'Test Vendor',
        email: 'vendor@test.local',
        password: 'VendorPass123!',
        role: 'vendor'
      },
      {
        name: 'Test Planner',
        email: 'planner@test.local',
        password: 'PlannerPass123!',
        role: 'wedding_planner'
      },
      {
        name: 'Test Admin',
        email: 'admin@test.local',
        password: 'AdminPass123!',
        role: 'admin'
      }
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      
      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          status: 'active',
          isVerified: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await user.save();
      }

      createdUsers.push({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      });
    }

    // Create test vendors
    const testVendors = [
      {
        name: 'Test Photography Studio',
        businessName: 'Perfect Moments Photography',
        email: 'photography@test.local',
        category: 'photography',
        location: 'Colombo',
        rating: { average: 4.8, count: 25 }
      },
      {
        name: 'Test Catering Service',
        businessName: 'Royal Catering',
        email: 'catering@test.local',
        category: 'catering',
        location: 'Kandy',
        rating: { average: 4.6, count: 18 }
      }
    ];

    const createdVendors = [];

    for (const vendorData of testVendors) {
      let vendor = await Vendor.findOne({ email: vendorData.email });
      
      if (!vendor) {
        vendor = new Vendor({
          ...vendorData,
          status: 'active',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await vendor.save();
      }

      createdVendors.push({
        id: vendor._id.toString(),
        name: vendor.name,
        businessName: vendor.businessName,
        category: vendor.category
      });
    }

    // Create test venues
    const testVenues = [
      {
        name: 'Test Wedding Hall',
        location: 'Colombo',
        capacity: 200,
        price: 50000,
        rating: { average: 4.7, count: 12 }
      },
      {
        name: 'Test Garden Venue',
        location: 'Kandy',
        capacity: 150,
        price: 35000,
        rating: { average: 4.5, count: 8 }
      }
    ];

    const createdVenues = [];

    for (const venueData of testVenues) {
      let venue = await Venue.findOne({ name: venueData.name });
      
      if (!venue) {
        venue = new Venue({
          ...venueData,
          status: 'active',
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        await venue.save();
      }

      createdVenues.push({
        id: venue._id.toString(),
        name: venue.name,
        location: venue.location,
        capacity: venue.capacity
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test data seeded successfully',
      data: {
        users: createdUsers,
        vendors: createdVendors,
        venues: createdVenues
      }
    });

  } catch (error) {
    console.error('Error seeding test data:', error);
    return NextResponse.json(
      { error: 'Failed to seed test data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test data seeding endpoint',
    usage: 'POST to seed test users, vendors, and venues'
  });
}
