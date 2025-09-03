// Import all models
import { User } from './user';
import { Vendor } from './vendor';
import { Venue } from './venue';
import { Booking } from './booking';
import { Payment } from './Payment';
import { Review } from './review';
import { Service } from './service';
import { Message } from './message';
import { Notification } from './notification';
import { Task } from './task';
import VenueBoost from './venueBoost';
import { Client } from './client';
import { Conversation } from './conversation';
import { VendorProfile } from './vendorProfile';
import { WeddingPlannerProfile } from './weddingPlannerProfile';
import Document from './document';

// Export all models
export {
  User,
  Vendor,
  Venue,
  Booking,
  Payment,
  Review,
  Service,
  Message,
  Notification,
  Task,
  Client,
  Conversation,
  VendorProfile,
  WeddingPlannerProfile,
  Document,
};

// Export VenueBoost as default
export { default as VenueBoost } from './venueBoost';

// Export User as default as well (for backward compatibility)
export { User as default } from './user';

// Performance optimization: Create compound indexes for common queries
// Note: These indexes are now defined in individual schema files to avoid duplicates
export const createPerformanceIndexes = async () => {
  try {
    // Performance indexes are defined in individual schema files
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('⚠️ Index creation skipped:', errorMessage);
  }
};

  // All models registered successfully 