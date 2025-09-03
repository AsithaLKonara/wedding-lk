import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { VendorProfile } from '@/lib/models/vendorProfile';
import { WeddingPlannerProfile } from '@/lib/models/weddingPlannerProfile';
import Document from '@/lib/models/document';
import { hashPassword, validatePassword } from '@/lib/auth/password-utils';
import { sendVerificationEmail } from '@/lib/email-service';
import { z } from 'zod';

// Validation schemas
const baseUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  location: z.object({
    country: z.string().min(2, 'Country is required'),
    state: z.string().min(2, 'State is required'),
    city: z.string().min(2, 'City is required'),
    zipCode: z.string().optional(),
  }),
  preferences: z.object({
    language: z.string().default('en'),
    currency: z.string().default('USD'),
    timezone: z.string().default('UTC'),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
    marketing: z.object({
      email: z.boolean().default(false),
      sms: z.boolean().default(false),
      push: z.boolean().default(false),
    }),
  }),
});

const vendorSchema = baseUserSchema.extend({
  role: z.literal('vendor'),
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['individual', 'company', 'partnership']),
  businessRegistrationNumber: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  yearsInBusiness: z.number().min(0, 'Years in business must be positive'),
  services: z.array(z.object({
    category: z.string().min(1, 'Service category is required'),
    subcategory: z.string().optional(),
    description: z.string().min(10, 'Service description must be at least 10 characters'),
    pricing: z.object({
      type: z.enum(['fixed', 'hourly', 'package', 'custom']),
      amount: z.number().positive('Amount must be positive'),
      currency: z.string().default('USD'),
      unit: z.string().optional(),
    }),
  })).min(1, 'At least one service is required'),
});

const weddingPlannerSchema = baseUserSchema.extend({
  role: z.literal('wedding_planner'),
  professionalTitle: z.string().min(2, 'Professional title is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be positive'),
  specialization: z.array(z.string()).min(1, 'At least one specialization is required'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.number().min(1900, 'Invalid year'),
  })).optional(),
});

const userSchema = baseUserSchema.extend({
  role: z.literal('user'),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { role, ...userData } = body;
    
    // Validate role
    const validRoles = ['user', 'vendor', 'wedding_planner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified', validRoles },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Validate data based on role
    let validatedData;
    try {
      switch (role) {
        case 'vendor':
          validatedData = vendorSchema.parse(body);
          break;
        case 'wedding_planner':
          validatedData = weddingPlannerSchema.parse(body);
          break;
        case 'user':
          validatedData = userSchema.parse(body);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid role specified' },
            { status: 400 }
          );
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: (validationError as any).errors?.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message
            })) || []
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }
    
    // Hash password if provided
    if (userData.password) {
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: 'Password does not meet requirements', details: passwordValidation.errors },
          { status: 400 }
        );
      }
      userData.password = await hashPassword(userData.password);
    }
    
    // Create user
    const user = new User({
      ...userData,
      role,
      status: 'pending_verification',
      isEmailVerified: false,
    });
    
    await user.save();
    
    // Create role-specific profile
    if (role === 'vendor') {
      const vendorData = validatedData as z.infer<typeof vendorSchema>;
      const vendorProfile = new VendorProfile({
        userId: user._id,
        businessName: vendorData.businessName,
        businessType: vendorData.businessType,
        businessRegistrationNumber: vendorData.businessRegistrationNumber,
        taxIdentificationNumber: vendorData.taxIdentificationNumber,
        yearsInBusiness: vendorData.yearsInBusiness,
        services: vendorData.services,
        verificationStatus: 'pending',
      });
      await vendorProfile.save();
    } else if (role === 'wedding_planner') {
      const plannerData = validatedData as z.infer<typeof weddingPlannerSchema>;
      const plannerProfile = new WeddingPlannerProfile({
        userId: user._id,
        professionalTitle: plannerData.professionalTitle,
        yearsOfExperience: plannerData.yearsOfExperience,
        specialization: plannerData.specialization,
        languages: plannerData.languages,
        education: plannerData.education,
        verificationStatus: 'pending',
      });
      await plannerProfile.save();
    }
    
    // Send verification email
    if (userData.email) {
      try {
        await sendVerificationEmail(userData.email, user._id.toString());
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
      role: user.role,
      status: user.status,
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed', message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const user = await User.findOne({ email }).select('role status isEmailVerified');
    
    if (!user) {
      return NextResponse.json({
        exists: false,
        message: 'User not found'
      });
    }
    
    return NextResponse.json({
      exists: true,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
    });
    
  } catch (error) {
    console.error('Registration status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    );
  }
}
