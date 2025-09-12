import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🔧 Creating test users...');
    
    await connectDB();
    
    // Test users with different roles
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@weddinglk.com',
        password: 'admin123',
        role: 'admin' as const,
        isActive: true,
        status: 'active' as const
      },
      {
        name: 'Vendor User',
        email: 'vendor@weddinglk.com',
        password: 'vendor123',
        role: 'vendor' as const,
        isActive: true,
        status: 'active' as const
      },
      {
        name: 'Wedding Planner',
        email: 'planner@weddinglk.com',
        password: 'planner123',
        role: 'wedding_planner' as const,
        isActive: true,
        status: 'active' as const
      },
      {
        name: 'Regular User',
        email: 'user@weddinglk.com',
        password: 'user123',
        role: 'user' as const,
        isActive: true,
        status: 'active' as const
      }
    ];
    
    const createdUsers = [];
    
    for (const userData of testUsers) {
      // Check if user already exists
      let user = await User.findOne({ email: userData.email });
      
      if (!user) {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        // Create user
        user = new User({
          ...userData,
          password: hashedPassword,
          location: {
            country: 'Sri Lanka',
            state: 'Western Province',
            city: 'Colombo',
            zipCode: '00100'
          },
          preferences: {
            language: 'en',
            currency: 'LKR',
            timezone: 'Asia/Colombo',
            notifications: {
              email: true,
              sms: false,
              push: true
            },
            marketing: {
              email: false,
              sms: false,
              push: false
            }
          }
        });
        
        await user.save();
        console.log(`✅ Created ${userData.role} user: ${userData.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.email}`);
      }
      
      createdUsers.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        status: user.status
      });
    }
    
    // Get role distribution
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Test users created successfully',
      data: {
        createdUsers,
        roleDistribution: roleCounts,
        totalUsers: await User.countDocuments()
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find({}).select('name email role isActive status createdAt').lean();
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        roleDistribution: roleCounts,
        totalUsers: users.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

