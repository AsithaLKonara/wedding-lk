import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('🔍 Debugging admin user...');
    
    await connectDB();
    
    // Find all admin users
    const adminUsers = await User.find({ email: 'admin@weddinglk.com' }).lean();
    console.log('🔍 Found admin users:', adminUsers.length);
    
    adminUsers.forEach((user, index) => {
      console.log(`Admin User ${index + 1}:`, {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        status: user.status,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      });
    });
    
    // Test password comparison for each admin user
    const passwordTests = [];
    for (const user of adminUsers) {
      if (user.password) {
        try {
          const isValid = await bcrypt.compare('admin123', user.password);
          passwordTests.push({
            userId: user._id,
            email: user.email,
            passwordValid: isValid
          });
        } catch (error) {
          passwordTests.push({
            userId: user._id,
            email: user.email,
            passwordValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      } else {
        passwordTests.push({
          userId: user._id,
          email: user.email,
          passwordValid: false,
          error: 'No password set'
        });
      }
    }
    
    // Find the first active admin user
    const activeAdmin = adminUsers.find(user => user.isActive && user.status === 'active');
    
    return NextResponse.json({
      success: true,
      data: {
        totalAdminUsers: adminUsers.length,
        adminUsers: adminUsers.map(user => ({
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          status: user.status,
          hasPassword: !!user.password,
          passwordLength: user.password ? user.password.length : 0
        })),
        passwordTests,
        activeAdmin: activeAdmin ? {
          id: activeAdmin._id,
          email: activeAdmin.email,
          name: activeAdmin.name,
          role: activeAdmin.role,
          isActive: activeAdmin.isActive,
          status: activeAdmin.status
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ Debug admin user failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🔧 Fixing admin user...');
    
    await connectDB();
    
    // Delete all existing admin users with this email
    const deleteResult = await User.deleteMany({ email: 'admin@weddinglk.com' });
    console.log('🗑️ Deleted admin users:', deleteResult.deletedCount);
    
    // Create a new admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const newAdmin = new User({
      name: 'Admin User',
      email: 'admin@weddinglk.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      status: 'active',
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
    
    await newAdmin.save();
    console.log('✅ Created new admin user:', newAdmin._id);
    
    // Test the new admin user
    const passwordValid = await bcrypt.compare('admin123', newAdmin.password);
    
    return NextResponse.json({
      success: true,
      message: 'Admin user fixed successfully',
      data: {
        deletedCount: deleteResult.deletedCount,
        newAdmin: {
          id: newAdmin._id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
          isActive: newAdmin.isActive,
          status: newAdmin.status
        },
        passwordTest: passwordValid
      }
    });
    
  } catch (error) {
    console.error('❌ Fix admin user failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
