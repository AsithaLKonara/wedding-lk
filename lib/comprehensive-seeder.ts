import { connectDB } from '@/lib/db';
import { User, VendorProfile, WeddingPlannerProfile, Venue, Booking, Review, VendorPackage, Testimonial } from '@/lib/models';
import bcrypt from 'bcryptjs';

// Comprehensive seed data for all user roles
export async function createComprehensiveSeedData() {
  try {
    await connectDB();
    console.log('🌱 Starting comprehensive seed data creation...');

    // Clear existing data
    await clearAllCollections();

    // Create users with different roles
    const users = await createUsers();
    const vendors = await createVendors();
    const planners = await createWeddingPlanners();
    const admins = await createAdmins();
    
    // Create role-specific profiles
    await createVendorProfiles(vendors);
    await createWeddingPlannerProfiles(planners);
    
    // Create related data
    await createRelatedData(users, vendors, planners, admins);
    
    console.log('🎉 Comprehensive seed data creation completed!');
    return {
      users: [...users, ...vendors, ...planners, ...admins],
      vendors,
      planners,
      admins
    };
  } catch (error) {
    console.error('❌ Seed data creation failed:', error);
    throw error;
  }
}

async function clearAllCollections() {
  try {
    console.log('🧹 Clearing all collections...');
    await User.deleteMany({});
    await VendorProfile.deleteMany({});
    await WeddingPlannerProfile.deleteMany({});
    await Venue.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await VendorPackage.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('✅ All collections cleared');
  } catch (error) {
    console.error('❌ Error clearing collections:', error);
    throw error;
  }
}

// Create 5 regular users (couples)
async function createUsers() {
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 12);

  const userData = [
    {
      name: 'John & Sarah Silva',
      email: 'john.sarah@email.com',
      phone: '+94 71 123 4567',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      role: 'user',
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
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Mike & Lisa Fernando',
      email: 'mike.lisa@email.com',
      phone: '+94 71 234 5678',
      dateOfBirth: new Date('1988-08-22'),
      gender: 'male',
      role: 'user',
      location: {
        country: 'Sri Lanka',
        state: 'Central Province',
        city: 'Kandy',
        zipCode: '20000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'David & Emma Perera',
      email: 'david.emma@email.com',
      phone: '+94 71 345 6789',
      dateOfBirth: new Date('1992-12-10'),
      gender: 'male',
      role: 'user',
      location: {
        country: 'Sri Lanka',
        state: 'Southern Province',
        city: 'Galle',
        zipCode: '80000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: false, sms: false, push: false }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Raj & Priya Kumar',
      email: 'raj.priya@email.com',
      phone: '+94 71 456 7890',
      dateOfBirth: new Date('1985-03-18'),
      gender: 'male',
      role: 'user',
      location: {
        country: 'Sri Lanka',
        state: 'Northern Province',
        city: 'Jaffna',
        zipCode: '40000'
      },
      preferences: {
        language: 'ta',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Saman & Nethmi Wickramasinghe',
      email: 'saman.nethmi@email.com',
      phone: '+94 71 567 8901',
      dateOfBirth: new Date('1991-07-25'),
      gender: 'male',
      role: 'user',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Negombo',
        zipCode: '11500'
      },
      preferences: {
        language: 'si',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    }
  ];

  for (const userInfo of userData) {
    const user = new User({
      ...userInfo,
      password: hashedPassword
    });
    await user.save();
    users.push(user);
  }

  console.log(`✅ Created ${users.length} regular users`);
  return users;
}

// Create 5 vendors with business information
async function createVendors() {
  const vendors = [];
  const hashedPassword = await bcrypt.hash('password123', 12);

  const vendorData = [
    {
      name: 'Perfect Moments Photography',
      email: 'photographer@perfectmoments.com',
      phone: '+94 71 678 9012',
      dateOfBirth: new Date('1980-04-12'),
      gender: 'male',
      role: 'vendor',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo',
        zipCode: '00300'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Elegant Decorators',
      email: 'decorator@elegant.com',
      phone: '+94 71 789 0123',
      dateOfBirth: new Date('1975-09-30'),
      gender: 'female',
      role: 'vendor',
      location: {
        country: 'Sri Lanka',
        state: 'Central Province',
        city: 'Kandy',
        zipCode: '20000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Sweet Dreams Catering',
      email: 'catering@sweetdreams.com',
      phone: '+94 71 890 1234',
      dateOfBirth: new Date('1982-11-15'),
      gender: 'female',
      role: 'vendor',
      location: {
        country: 'Sri Lanka',
        state: 'Southern Province',
        city: 'Galle',
        zipCode: '80000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Melody Music Band',
      email: 'music@melody.com',
      phone: '+94 71 901 2345',
      dateOfBirth: new Date('1978-06-08'),
      gender: 'male',
      role: 'vendor',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo',
        zipCode: '00400'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Royal Wedding Cakes',
      email: 'cakes@royal.com',
      phone: '+94 71 012 3456',
      dateOfBirth: new Date('1985-01-20'),
      gender: 'female',
      role: 'vendor',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Colombo',
        zipCode: '00500'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    }
  ];

  for (const vendorInfo of vendorData) {
    const vendor = new User({
      ...vendorInfo,
      password: hashedPassword
    });
    await vendor.save();
    vendors.push(vendor);
  }

  console.log(`✅ Created ${vendors.length} vendors`);
  return vendors;
}

// Create vendor profiles with business information
async function createVendorProfiles(vendors: any[]) {
  const vendorProfiles = [];

  const profileData = [
    {
      businessName: 'Perfect Moments Photography',
      businessType: 'company',
      yearsInBusiness: 8,
      businessRegistrationNumber: 'BR-2023-001',
      taxIdentificationNumber: 'TIN-001234567',
      services: [
        {
          category: 'Photography',
          subcategory: 'Wedding Photography',
          description: 'Professional wedding photography with modern and traditional styles',
          pricing: { type: 'fixed', amount: 150000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '08:00', end: '20:00' }, isAvailable: true }
        },
        {
          category: 'Videography',
          subcategory: 'Wedding Videography',
          description: 'Cinematic wedding videos and highlight reels',
          pricing: { type: 'fixed', amount: 200000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '08:00', end: '20:00' }, isAvailable: true }
        }
      ],
      serviceAreas: [
        { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', radius: 50 },
        { city: 'Kandy', state: 'Central Province', country: 'Sri Lanka', radius: 30 }
      ],
      emergencyContact: {
        name: 'John Silva',
        relationship: 'Business Partner',
        phone: '+94 71 999 0001',
        email: 'emergency@perfectmoments.com'
      },
      verificationStatus: 'verified'
    },
    {
      businessName: 'Elegant Decorators',
      businessType: 'company',
      yearsInBusiness: 12,
      businessRegistrationNumber: 'BR-2023-002',
      taxIdentificationNumber: 'TIN-002345678',
      services: [
        {
          category: 'Venue Decoration',
          subcategory: 'Wedding Decoration',
          description: 'Complete wedding venue decoration with flowers and lighting',
          pricing: { type: 'fixed', amount: 100000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '07:00', end: '22:00' }, isAvailable: true }
        },
        {
          category: 'Floral Design',
          subcategory: 'Wedding Flowers',
          description: 'Beautiful flower arrangements and bouquets',
          pricing: { type: 'fixed', amount: 75000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '07:00', end: '18:00' }, isAvailable: true }
        }
      ],
      serviceAreas: [
        { city: 'Kandy', state: 'Central Province', country: 'Sri Lanka', radius: 40 },
        { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', radius: 30 }
      ],
      emergencyContact: {
        name: 'Lisa Fernando',
        relationship: 'Manager',
        phone: '+94 71 999 0002',
        email: 'emergency@elegant.com'
      },
      verificationStatus: 'verified'
    },
    {
      businessName: 'Sweet Dreams Catering',
      businessType: 'company',
      yearsInBusiness: 15,
      businessRegistrationNumber: 'BR-2023-003',
      taxIdentificationNumber: 'TIN-003456789',
      services: [
        {
          category: 'Catering',
          subcategory: 'Wedding Catering',
          description: 'Complete wedding catering with traditional and international cuisine',
          pricing: { type: 'fixed', amount: 2500, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '06:00', end: '23:00' }, isAvailable: true }
        }
      ],
      serviceAreas: [
        { city: 'Galle', state: 'Southern Province', country: 'Sri Lanka', radius: 60 },
        { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', radius: 50 }
      ],
      emergencyContact: {
        name: 'Emma Perera',
        relationship: 'Operations Manager',
        phone: '+94 71 999 0003',
        email: 'emergency@sweetdreams.com'
      },
      verificationStatus: 'verified'
    },
    {
      businessName: 'Melody Music Band',
      businessType: 'individual',
      yearsInBusiness: 6,
      businessRegistrationNumber: 'BR-2023-004',
      taxIdentificationNumber: 'TIN-004567890',
      services: [
        {
          category: 'Music & DJ',
          subcategory: 'Wedding Band',
          description: 'Live music performance for wedding ceremonies and receptions',
          pricing: { type: 'fixed', amount: 120000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6, 0], hours: { start: '18:00', end: '02:00' }, isAvailable: true }
        }
      ],
      serviceAreas: [
        { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', radius: 40 }
      ],
      emergencyContact: {
        name: 'Raj Kumar',
        relationship: 'Band Manager',
        phone: '+94 71 999 0004',
        email: 'emergency@melody.com'
      },
      verificationStatus: 'verified'
    },
    {
      businessName: 'Royal Wedding Cakes',
      businessType: 'company',
      yearsInBusiness: 10,
      businessRegistrationNumber: 'BR-2023-005',
      taxIdentificationNumber: 'TIN-005678901',
      services: [
        {
          category: 'Wedding Cake',
          subcategory: 'Custom Wedding Cakes',
          description: 'Custom designed wedding cakes with various flavors and decorations',
          pricing: { type: 'fixed', amount: 45000, currency: 'LKR' },
          availability: { days: [1, 2, 3, 4, 5, 6], hours: { start: '09:00', end: '17:00' }, isAvailable: true }
        }
      ],
      serviceAreas: [
        { city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', radius: 30 }
      ],
      emergencyContact: {
        name: 'Nethmi Wickramasinghe',
        relationship: 'Head Baker',
        phone: '+94 71 999 0005',
        email: 'emergency@royal.com'
      },
      verificationStatus: 'verified'
    }
  ];

  for (let i = 0; i < vendors.length; i++) {
    const profile = new VendorProfile({
      userId: vendors[i]._id,
      ...profileData[i]
    });
    await profile.save();
    vendorProfiles.push(profile);
  }

  console.log(`✅ Created ${vendorProfiles.length} vendor profiles`);
  return vendorProfiles;
}

// Create 5 wedding planners
async function createWeddingPlanners() {
  const planners = [];
  const hashedPassword = await bcrypt.hash('password123', 12);

  const plannerData = [
    {
      name: 'Sarah Wedding Planner',
      email: 'sarah@weddingplanner.com',
      phone: '+94 71 123 4567',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      role: 'wedding_planner',
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
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'David Event Coordinator',
      email: 'david@eventcoordinator.com',
      phone: '+94 71 234 5678',
      dateOfBirth: new Date('1980-07-22'),
      gender: 'male',
      role: 'wedding_planner',
      location: {
        country: 'Sri Lanka',
        state: 'Central Province',
        city: 'Kandy',
        zipCode: '20000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Emma Luxury Planner',
      email: 'emma@luxuryplanner.com',
      phone: '+94 71 345 6789',
      dateOfBirth: new Date('1988-11-10'),
      gender: 'female',
      role: 'wedding_planner',
      location: {
        country: 'Sri Lanka',
        state: 'Southern Province',
        city: 'Galle',
        zipCode: '80000'
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: false, push: true },
        marketing: { email: false, sms: false, push: false }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Raj Cultural Planner',
      email: 'raj@culturalplanner.com',
      phone: '+94 71 456 7890',
      dateOfBirth: new Date('1982-05-18'),
      gender: 'male',
      role: 'wedding_planner',
      location: {
        country: 'Sri Lanka',
        state: 'Northern Province',
        city: 'Jaffna',
        zipCode: '40000'
      },
      preferences: {
        language: 'ta',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: true, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Nethmi Traditional Planner',
      email: 'nethmi@traditionalplanner.com',
      phone: '+94 71 567 8901',
      dateOfBirth: new Date('1987-09-25'),
      gender: 'female',
      role: 'wedding_planner',
      location: {
        country: 'Sri Lanka',
        state: 'Western Province',
        city: 'Negombo',
        zipCode: '11500'
      },
      preferences: {
        language: 'si',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        notifications: { email: true, sms: true, push: true },
        marketing: { email: true, sms: false, push: true }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    }
  ];

  for (const plannerInfo of plannerData) {
    const planner = new User({
      ...plannerInfo,
      password: hashedPassword
    });
    await planner.save();
    planners.push(planner);
  }

  console.log(`✅ Created ${planners.length} wedding planners`);
  return planners;
}

// Create wedding planner profiles
async function createWeddingPlannerProfiles(planners: any[]) {
  const plannerProfiles = [];

  const profileData = [
    {
      professionalTitle: 'Senior Wedding Planner',
      yearsOfExperience: 8,
      specialization: ['Traditional Weddings', 'Modern Weddings', 'Luxury Weddings'],
      languages: ['Sinhala', 'Tamil', 'English'],
      businessPhone: '+94 11 234 5678',
      businessEmail: 'sarah@weddingplanner.com',
      emergencyContact: {
        name: 'John Silva',
        relationship: 'Business Partner',
        phone: '+94 71 999 1001',
        email: 'emergency@sarahplanner.com'
      },
      professionalLiability: {
        provider: 'Ceylinco Insurance',
        policyNumber: 'PL-2024-001',
        coverageAmount: 5000000,
        expiryDate: new Date('2025-12-31'),
        documentUrl: '/documents/liability/sarah-planner.pdf'
      },
      verificationStatus: 'verified'
    },
    {
      professionalTitle: 'Event Coordinator',
      yearsOfExperience: 12,
      specialization: ['Cultural Weddings', 'Outdoor Weddings', 'Large Scale Events'],
      languages: ['Sinhala', 'English'],
      businessPhone: '+94 81 234 5678',
      businessEmail: 'david@eventcoordinator.com',
      emergencyContact: {
        name: 'Lisa Fernando',
        relationship: 'Assistant',
        phone: '+94 71 999 1002',
        email: 'emergency@davidcoordinator.com'
      },
      professionalLiability: {
        provider: 'Sri Lanka Insurance',
        policyNumber: 'PL-2024-002',
        coverageAmount: 3000000,
        expiryDate: new Date('2025-11-30'),
        documentUrl: '/documents/liability/david-coordinator.pdf'
      },
      verificationStatus: 'verified'
    },
    {
      professionalTitle: 'Luxury Wedding Consultant',
      yearsOfExperience: 6,
      specialization: ['Luxury Weddings', 'Destination Weddings', 'Intimate Weddings'],
      languages: ['English', 'French'],
      businessPhone: '+94 91 234 5678',
      businessEmail: 'emma@luxuryplanner.com',
      emergencyContact: {
        name: 'Emma Perera',
        relationship: 'Business Manager',
        phone: '+94 71 999 1003',
        email: 'emergency@emmaluxury.com'
      },
      professionalLiability: {
        provider: 'Allianz Insurance',
        policyNumber: 'PL-2024-003',
        coverageAmount: 10000000,
        expiryDate: new Date('2025-10-15'),
        documentUrl: '/documents/liability/emma-luxury.pdf'
      },
      verificationStatus: 'verified'
    },
    {
      professionalTitle: 'Cultural Wedding Specialist',
      yearsOfExperience: 10,
      specialization: ['Cultural Weddings', 'Traditional Weddings', 'Budget Weddings'],
      languages: ['Tamil', 'Sinhala', 'English'],
      businessPhone: '+94 21 234 5678',
      businessEmail: 'raj@culturalplanner.com',
      emergencyContact: {
        name: 'Raj Kumar',
        relationship: 'Family Member',
        phone: '+94 71 999 1004',
        email: 'emergency@rajcultural.com'
      },
      professionalLiability: {
        provider: 'Union Assurance',
        policyNumber: 'PL-2024-004',
        coverageAmount: 4000000,
        expiryDate: new Date('2025-09-20'),
        documentUrl: '/documents/liability/raj-cultural.pdf'
      },
      verificationStatus: 'verified'
    },
    {
      professionalTitle: 'Traditional Wedding Expert',
      yearsOfExperience: 7,
      specialization: ['Traditional Weddings', 'Cultural Weddings', 'Budget Weddings'],
      languages: ['Sinhala', 'English'],
      businessPhone: '+94 31 234 5678',
      businessEmail: 'nethmi@traditionalplanner.com',
      emergencyContact: {
        name: 'Nethmi Wickramasinghe',
        relationship: 'Sister',
        phone: '+94 71 999 1005',
        email: 'emergency@nethmitraditional.com'
      },
      professionalLiability: {
        provider: 'Janashakthi Insurance',
        policyNumber: 'PL-2024-005',
        coverageAmount: 3500000,
        expiryDate: new Date('2025-08-25'),
        documentUrl: '/documents/liability/nethmi-traditional.pdf'
      },
      verificationStatus: 'verified'
    }
  ];

  for (let i = 0; i < planners.length; i++) {
    const profile = new WeddingPlannerProfile({
      userId: planners[i]._id,
      ...profileData[i]
    });
    await profile.save();
    plannerProfiles.push(profile);
  }

  console.log(`✅ Created ${plannerProfiles.length} wedding planner profiles`);
  return plannerProfiles;
}

// Create 2 admin users
async function createAdmins() {
  const admins = [];
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminData = [
    {
      name: 'Admin User',
      email: 'admin@weddinglk.com',
      phone: '+94 11 000 0001',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'male',
      role: 'admin',
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
        notifications: { email: true, sms: true, push: true },
        marketing: { email: false, sms: false, push: false }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    },
    {
      name: 'Super Admin',
      email: 'superadmin@weddinglk.com',
      phone: '+94 11 000 0002',
      dateOfBirth: new Date('1975-01-01'),
      gender: 'male',
      role: 'admin',
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
        notifications: { email: true, sms: true, push: true },
        marketing: { email: false, sms: false, push: false }
      },
      status: 'active',
      isVerified: true,
      isActive: true
    }
  ];

  for (const adminInfo of adminData) {
    const admin = new User({
      ...adminInfo,
      password: hashedPassword
    });
    await admin.save();
    admins.push(admin);
  }

  console.log(`✅ Created ${admins.length} admin users`);
  return admins;
}

// Create related data (venues, bookings, reviews, etc.)
async function createRelatedData(users: any[], vendors: any[], planners: any[], admins: any[]) {
  // Create venues
  await createVenues(admins[0]._id);
  
  // Create packages
  await createPackages(vendors);
  
  // Create testimonials
  await createTestimonials(users);
  
  // Create bookings
  await createBookings(users, vendors);
  
  // Create reviews
  await createReviews(users, vendors);
  
  console.log('✅ Created all related data');
}

async function createVenues(adminId: string) {
  const venues = [
    {
      name: 'Grand Ballroom Hotel',
      description: 'Elegant ballroom with crystal chandeliers and marble floors',
      owner: adminId,
      location: {
        address: '123 Galle Road, Colombo 03',
        city: 'Colombo',
        state: 'Western Province',
        province: 'Western Province',
        country: 'Sri Lanka',
        coordinates: { latitude: 6.9271, longitude: 79.8612 }
      },
      capacity: {
        min: 50,
        max: 300
      },
      amenities: ['Air Conditioning', 'Parking', 'Catering Kitchen', 'Bridal Suite'],
      pricing: {
        basePrice: 200000,
        currency: 'LKR',
        pricingType: 'per_event'
      },
      images: ['/images/venues/grand-ballroom-1.jpg', '/images/venues/grand-ballroom-2.jpg'],
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Kandy Garden Hotel',
      description: 'Beautiful garden setting with mountain views',
      owner: adminId,
      location: {
        address: '456 Peradeniya Road, Kandy',
        city: 'Kandy',
        state: 'Central Province',
        province: 'Central Province',
        country: 'Sri Lanka',
        coordinates: { latitude: 7.2906, longitude: 80.6337 }
      },
      capacity: {
        min: 30,
        max: 200
      },
      amenities: ['Garden Setting', 'Parking', 'Outdoor Ceremony', 'Indoor Reception'],
      pricing: {
        basePrice: 150000,
        currency: 'LKR',
        pricingType: 'per_event'
      },
      images: ['/images/venues/kandy-garden-1.jpg', '/images/venues/kandy-garden-2.jpg'],
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Galle Fort Heritage',
      description: 'Historic fort venue with colonial charm',
      owner: adminId,
      location: {
        address: '789 Church Street, Galle Fort',
        city: 'Galle',
        state: 'Southern Province',
        province: 'Southern Province',
        country: 'Sri Lanka',
        coordinates: { latitude: 6.0535, longitude: 80.2210 }
      },
      capacity: {
        min: 20,
        max: 150
      },
      amenities: ['Historic Setting', 'Ocean Views', 'Photography Spots', 'Catering Available'],
      pricing: {
        basePrice: 180000,
        currency: 'LKR',
        pricingType: 'per_event'
      },
      images: ['/images/venues/galle-fort-1.jpg', '/images/venues/galle-fort-2.jpg'],
      isActive: true,
      isFeatured: true
    }
  ];

  const createdVenues = await Venue.insertMany(venues);
  console.log(`✅ Created ${createdVenues.length} venues`);
  return createdVenues;
}

async function createPackages(vendors: any[]) {
  const packages = [
    {
      name: 'Complete Wedding Photography Package',
      description: 'Full day wedding photography with edited photos and online gallery',
      category: 'photography',
      vendor: vendors[0]._id,
      pricing: {
        basePrice: 150000,
        currency: 'LKR',
        isNegotiable: false
      },
      services: [
        { 
          name: 'Pre-wedding shoot',
          service: vendors[0]._id, 
          description: 'Romantic pre-wedding photo session',
          price: 25000,
          unit: 'session',
          quantity: 1
        },
        { 
          name: 'Wedding day coverage',
          service: vendors[0]._id, 
          description: 'Full day photography coverage',
          price: 100000,
          unit: 'day',
          quantity: 1
        },
        { 
          name: 'Edited photos',
          service: vendors[0]._id, 
          description: 'Professionally edited high-resolution photos',
          price: 20000,
          unit: 'photos',
          quantity: 100
        },
        { 
          name: 'Online gallery',
          service: vendors[0]._id, 
          description: 'Digital gallery for easy sharing',
          price: 5000,
          unit: 'gallery',
          quantity: 1
        }
      ],
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Elegant Decoration Package',
      description: 'Complete venue decoration with flowers and lighting',
      category: 'decorations',
      vendor: vendors[1]._id,
      pricing: {
        basePrice: 100000,
        currency: 'LKR',
        isNegotiable: true
      },
      services: [
        { 
          name: 'Entrance decoration',
          service: vendors[1]._id, 
          description: 'Beautiful entrance setup',
          price: 15000,
          unit: 'setup',
          quantity: 1
        },
        { 
          name: 'Stage setup',
          service: vendors[1]._id, 
          description: 'Elegant stage decoration',
          price: 25000,
          unit: 'setup',
          quantity: 1
        },
        { 
          name: 'Table arrangements',
          service: vendors[1]._id, 
          description: 'Centerpieces and table settings',
          price: 30000,
          unit: 'tables',
          quantity: 10
        },
        { 
          name: 'Lighting',
          service: vendors[1]._id, 
          description: 'Ambient lighting setup',
          price: 30000,
          unit: 'setup',
          quantity: 1
        }
      ],
      isActive: true,
      isFeatured: false
    },
    {
      name: 'Premium Catering Package',
      description: 'Complete wedding catering for up to 200 guests',
      category: 'catering',
      vendor: vendors[2]._id,
      pricing: {
        basePrice: 500000,
        currency: 'LKR',
        isNegotiable: true
      },
      services: [
        { 
          name: 'Appetizers',
          service: vendors[2]._id, 
          description: 'Selection of appetizers',
          price: 50000,
          unit: 'guests',
          quantity: 200
        },
        { 
          name: 'Main course',
          service: vendors[2]._id, 
          description: 'Traditional and international dishes',
          price: 200000,
          unit: 'guests',
          quantity: 200
        },
        { 
          name: 'Desserts',
          service: vendors[2]._id, 
          description: 'Sweet treats and wedding cake',
          price: 75000,
          unit: 'guests',
          quantity: 200
        },
        { 
          name: 'Beverages',
          service: vendors[2]._id, 
          description: 'Soft drinks and refreshments',
          price: 50000,
          unit: 'guests',
          quantity: 200
        },
        { 
          name: 'Service staff',
          service: vendors[2]._id, 
          description: 'Professional serving staff',
          price: 125000,
          unit: 'staff',
          quantity: 10
        }
      ],
      isActive: true,
      isFeatured: true
    }
  ];

  const createdPackages = await VendorPackage.insertMany(packages);
  console.log(`✅ Created ${createdPackages.length} packages`);
  return createdPackages;
}

async function createTestimonials(users: any[]) {
  const testimonials = [
    {
      name: 'John & Sarah Silva',
      location: 'Colombo',
      rating: 5,
      text: 'Perfect Moments Photography made our wedding day absolutely magical. The photos are stunning!',
      weddingDate: '2024-06-15',
      venue: 'Grand Ballroom Hotel',
      vendor: 'Perfect Moments Photography',
      isVerified: true,
      isActive: true,
      featured: true
    },
    {
      name: 'Mike & Lisa Fernando',
      location: 'Kandy',
      rating: 5,
      text: 'Elegant Decorators transformed our venue into a fairy tale. Highly recommended!',
      weddingDate: '2024-05-20',
      venue: 'Kandy Garden Hotel',
      vendor: 'Elegant Decorators',
      isVerified: true,
      isActive: true,
      featured: false
    },
    {
      name: 'David & Emma Perera',
      location: 'Galle',
      rating: 4,
      text: 'Sweet Dreams Catering provided excellent food and service. Our guests loved it!',
      weddingDate: '2024-04-10',
      venue: 'Galle Fort Heritage',
      vendor: 'Sweet Dreams Catering',
      isVerified: true,
      isActive: true,
      featured: true
    }
  ];

  const createdTestimonials = await Testimonial.insertMany(testimonials);
  console.log(`✅ Created ${createdTestimonials.length} testimonials`);
  return createdTestimonials;
}

async function createBookings(users: any[], vendors: any[]) {
  const bookings = [
    {
      user: users[0]._id,
      vendor: vendors[0]._id,
      date: new Date('2024-07-15'),
      startTime: '08:00',
      endTime: '20:00',
      guestCount: 200,
      status: 'confirmed',
      totalAmount: 150000,
      depositAmount: 50000,
      depositPaid: true,
      notes: 'Include drone photography'
    },
    {
      user: users[1]._id,
      vendor: vendors[1]._id,
      date: new Date('2024-08-20'),
      startTime: '07:00',
      endTime: '22:00',
      guestCount: 150,
      status: 'pending',
      totalAmount: 100000,
      depositAmount: 30000,
      depositPaid: false,
      notes: 'Traditional Sri Lankan theme'
    },
    {
      user: users[2]._id,
      vendor: vendors[2]._id,
      date: new Date('2024-09-10'),
      startTime: '06:00',
      endTime: '23:00',
      guestCount: 250,
      status: 'confirmed',
      totalAmount: 500000,
      depositAmount: 150000,
      depositPaid: true,
      notes: 'Vegetarian options available'
    }
  ];

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`✅ Created ${createdBookings.length} bookings`);
  return createdBookings;
}

async function createReviews(users: any[], vendors: any[]) {
  const reviews = [
    {
      userId: users[0]._id,
      vendorId: vendors[0]._id,
      overallRating: 5,
      categoryRatings: {
        service: 5,
        quality: 5,
        value: 4,
        communication: 5,
        timeliness: 5
      },
      title: 'Excellent Photography Service',
      comment: 'Excellent photography service. Professional and creative team.',
      pros: ['Professional team', 'High quality photos', 'Great communication'],
      cons: ['Slightly expensive'],
      images: [],
      videos: [],
      isVerified: true,
      isAnonymous: false,
      helpful: [],
      notHelpful: [],
      reportCount: 0,
      status: 'approved'
    },
    {
      userId: users[1]._id,
      vendorId: vendors[1]._id,
      overallRating: 5,
      categoryRatings: {
        service: 5,
        quality: 5,
        value: 5,
        communication: 4,
        timeliness: 5
      },
      title: 'Beautiful Decorations',
      comment: 'Beautiful decorations that exceeded our expectations.',
      pros: ['Creative designs', 'On-time delivery', 'Great value'],
      cons: [],
      images: [],
      videos: [],
      isVerified: true,
      isAnonymous: false,
      helpful: [],
      notHelpful: [],
      reportCount: 0,
      status: 'approved'
    },
    {
      userId: users[2]._id,
      vendorId: vendors[2]._id,
      overallRating: 4,
      categoryRatings: {
        service: 4,
        quality: 4,
        value: 4,
        communication: 4,
        timeliness: 4
      },
      title: 'Great Food and Service',
      comment: 'Great food and service. Would recommend to others.',
      pros: ['Delicious food', 'Good service', 'Reasonable price'],
      cons: ['Limited vegetarian options'],
      images: [],
      videos: [],
      isVerified: true,
      isAnonymous: false,
      helpful: [],
      notHelpful: [],
      reportCount: 0,
      status: 'approved'
    }
  ];

  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${createdReviews.length} reviews`);
  return createdReviews;
}

// Main function to run comprehensive seeding
export async function resetAndSeedDatabase() {
  try {
    console.log('🚀 Starting comprehensive database reset and seeding...');
    
    const result = await createComprehensiveSeedData();
    
    console.log('🎉 Comprehensive database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 5 Regular Users (couples)');
    console.log('   - 5 Vendors with business profiles');
    console.log('   - 5 Wedding Planners with professional profiles');
    console.log('   - 2 Admin users');
    console.log('   - 3 Venues');
    console.log('   - 3 Service packages');
    console.log('   - 3 Testimonials');
    console.log('   - 3 Bookings');
    console.log('   - 3 Reviews');
    
    return result;
  } catch (error) {
    console.error('❌ Comprehensive database seeding failed:', error);
    throw error;
  }
}
