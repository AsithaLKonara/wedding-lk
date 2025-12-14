/**
 * Search Criteria Type Definitions
 * Provides type-safe definitions for common search patterns
 */

/**
 * Base search criteria
 */
export interface BaseSearchCriteria {
  query?: string;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: string;
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Vendor search criteria
 */
export interface VendorSearchCriteria extends BaseSearchCriteria {
  businessType?: string;
  businessName?: string;
  services?: string[];
  experience?: number;
  vendorId?: string;
  category?: string;
  verified?: boolean | string;
}

/**
 * Venue search criteria
 */
export interface VenueSearchCriteria extends BaseSearchCriteria {
  capacity?: number;
  amenities?: string[];
  venueType?: string;
  venueId?: string;
  city?: string;
  district?: string;
}

/**
 * Booking search criteria
 */
export interface BookingSearchCriteria {
  userId?: string;
  vendorId?: string;
  venueId?: string;
  clientId?: string;
  status?: string;
  date?: Date | { $gte?: Date; $lte?: Date };
  startDate?: Date | string;
  endDate?: Date | string;
  bookingId?: string;
}

/**
 * Review search criteria
 */
export interface ReviewSearchCriteria {
  vendorId?: string;
  venueId?: string;
  userId?: string;
  rating?: number;
  status?: string;
  verified?: boolean | string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Comment search criteria
 */
export interface CommentSearchCriteria {
  postId?: string;
  parentCommentId?: string;
  authorId?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Availability search criteria
 */
export interface AvailabilitySearchCriteria {
  vendorId?: string;
  venueId?: string;
  serviceId?: string;
  date?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}

/**
 * Package search criteria
 */
export interface PackageSearchCriteria extends BaseSearchCriteria {
  vendorId?: string;
  packageType?: string;
  minPrice?: number;
  maxPrice?: number;
  includes?: string[];
}

/**
 * Post/Story search criteria
 */
export interface PostSearchCriteria {
  authorId?: string;
  tags?: string[];
  location?: string;
  status?: string;
  isActive?: boolean;
  category?: string;
  venue?: string;
}

