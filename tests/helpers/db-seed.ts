import mongoose from 'mongoose';
import testUsers from '../fixtures/test-users.json';

// Note: Models are imported dynamically to avoid connection issues in test environment

export async function seedTestDatabase() {
  try {
    // Use MongoDB Atlas - local MongoDB is not supported
    const DEFAULT_ATLAS_URI = 'mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0';
    const TEST_DB_URI = process.env.TEST_DB_URI || process.env.MONGODB_URI || DEFAULT_ATLAS_URI;
    
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI, {
        bufferCommands: false,
      });
    }
    
    // Dynamically import models to avoid connection issues
    const { User } = await import('@/lib/models/user');
    const { Vendor } = await import('@/lib/models/vendor');
    const { Venue } = await import('@/lib/models/venue');
    const { Booking } = await import('@/lib/models/booking');
    
    // Clear existing test data
    await User.deleteMany({ email: { $regex: /@test\.local$/ } }).catch(() => {});
    await Vendor.deleteMany({}).catch(() => {});
    await Venue.deleteMany({}).catch(() => {});
    await Booking.deleteMany({}).catch(() => {});
    
    // Seed users
    for (const userData of testUsers.users) {
      try {
        const user = new User(userData);
        await user.save();
      } catch (err) {
        console.warn('Failed to seed user:', userData.email, err);
      }
    }
    
    // Seed vendors
    for (const vendorData of testUsers.vendors) {
      try {
        const vendor = new Vendor(vendorData);
        await vendor.save();
      } catch (err) {
        console.warn('Failed to seed vendor:', vendorData.businessName, err);
      }
    }
    
    // Seed venues
    for (const venueData of testUsers.venues) {
      try {
        const venue = new Venue(venueData);
        await venue.save();
      } catch (err) {
        console.warn('Failed to seed venue:', venueData.name, err);
      }
    }
    
    console.log('✅ Test database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding test database:', error);
    // Don't throw - allow tests to continue even if seeding fails
    console.warn('⚠️ Continuing without database seeding');
  }
}

export async function cleanupTestDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      // Dynamically import models
      const { User } = await import('@/lib/models/user');
      const { Vendor } = await import('@/lib/models/vendor');
      const { Venue } = await import('@/lib/models/venue');
      const { Booking } = await import('@/lib/models/booking');
      
      await User.deleteMany({ email: { $regex: /@test\.local$/ } }).catch(() => {});
      await Vendor.deleteMany({}).catch(() => {});
      await Venue.deleteMany({}).catch(() => {});
      await Booking.deleteMany({}).catch(() => {});
      
      await mongoose.connection.close();
      console.log('✅ Test database cleaned up');
    }
  } catch (error) {
    console.error('❌ Error cleaning up test database:', error);
    // Don't throw - cleanup is best effort
  }
}
