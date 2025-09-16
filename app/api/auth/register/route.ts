import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { emailService } from '@/lib/services/email-service';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      role,
      location,
      // Vendor-specific fields
      businessName,
      businessType,
      yearsInBusiness,
      businessRegistrationNumber,
      taxId,
      services,
      serviceAreas,
      // Wedding planner specific fields
      professionalTitle,
      yearsOfExperience,
      specialization,
      languages,
      businessPhone,
      businessEmail,
    } = await request.json();

    console.log('🔐 Registration attempt:', { email, role, hasLocation: !!location });

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone || !role || !location) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Role-specific validation
    if (role === 'vendor' && (!businessName || !businessType || !yearsInBusiness || !services || services.length === 0)) {
      return NextResponse.json(
        { error: 'Vendor registration requires business information and at least one service' },
        { status: 400 }
      );
    }

    if (role === 'wedding_planner' && (!professionalTitle || !yearsOfExperience || !specialization || specialization.length === 0)) {
      return NextResponse.json(
        { error: 'Wedding planner registration requires professional information and specializations' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'vendor', 'wedding_planner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role selected' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours

    // Create new user
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      role,
      location,
      status: 'pending_verification',
      isVerified: false,
      isActive: true,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationTokenExpiry
    });

    await newUser.save();

    // Create role-specific profiles
    if (role === 'vendor') {
      const { VendorProfile } = await import('@/lib/models');
      const vendorProfile = new VendorProfile({
        userId: newUser._id,
        businessName,
        businessType,
        yearsInBusiness: parseInt(yearsInBusiness),
        businessRegistrationNumber,
        taxIdentificationNumber: taxId,
        services: services.map(service => ({
          category: service,
          subcategory: '',
          description: `Professional ${service.toLowerCase()} services`,
          pricing: {
            type: 'fixed',
            amount: 0,
            currency: 'LKR'
          },
          availability: {
            days: [1, 2, 3, 4, 5, 6, 0], // All days
            hours: { start: '09:00', end: '18:00' },
            isAvailable: true
          }
        })),
        serviceAreas: serviceAreas.map(area => ({
          city: area,
          state: location.state || 'Western Province',
          country: location.country || 'Sri Lanka',
          radius: 50
        })),
        verificationStatus: 'pending'
      });
      await vendorProfile.save();
    } else if (role === 'wedding_planner') {
      const { WeddingPlannerProfile } = await import('@/lib/models');
      const plannerProfile = new WeddingPlannerProfile({
        userId: newUser._id,
        professionalTitle,
        yearsOfExperience: parseInt(yearsOfExperience),
        specialization,
        languages,
        businessPhone,
        businessEmail,
        verificationStatus: 'pending'
      });
      await plannerProfile.save();
    }

    console.log(`✅ New user registered: ${email} with role: ${role}`);

    // Send verification email
    const verificationEmailSent = await emailService.sendVerificationEmail(email, verificationToken);
    
    // Send welcome email (after verification)
    // const welcomeEmailSent = await emailService.sendWelcomeEmail(email, newUser.name, role);

    return NextResponse.json(
      { 
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          isEmailVerified: newUser.isEmailVerified
        },
        verificationEmailSent,
        // In development, you might want to return the token for testing
        ...(process.env.NODE_ENV === 'development' && {
          verificationToken: verificationToken,
          verificationLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`
        })
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('❌ Registration error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}