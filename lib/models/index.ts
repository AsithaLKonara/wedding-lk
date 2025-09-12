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
import Post from './post';
import { BoostPackage } from './boostPackage';
import { Favorite } from './favorite';
import Availability from './availability';
import Quotation from './quotation';
import QuotationRequest from './quotationRequest';
import Invoice from './invoice';
import Story from './story';
import Reel from './reel';
import Verification from './verification';
import ServicePackage from './servicePackage';
import Subscription from './subscription';
import SubscriptionPlan from './subscriptionPlan';
import Moderation from './moderation';
import Commission from './commission';
import EnhancedPost from './enhancedPost';
import Group from './group';
import EnhancedBooking from './enhancedBooking';
import DynamicPricing from './dynamicPricing';
import VendorPackage from './vendorPackage';
import Comment from './comment';
import { MetaAdsCampaign, MetaAdsAdSet, MetaAdsCreative, MetaAdsAccount } from './metaAds';
import Testimonial from './testimonial';

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
  Post,
  BoostPackage,
  Favorite,
  Availability,
  Quotation,
  QuotationRequest,
  Invoice,
  Story,
  Reel,
  Verification,
  ServicePackage,
  Subscription,
  SubscriptionPlan,
  Moderation,
  Commission,
  EnhancedPost,
  Group,
  EnhancedBooking,
  DynamicPricing,
  VendorPackage,
  Comment,
  MetaAdsCampaign,
  MetaAdsAdSet,
  MetaAdsCreative,
  MetaAdsAccount,
  Testimonial,
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