/**
 * Model Type Definitions Index
 * Central export for all model interface types
 */

// User Model
import type { IUser } from './user';
export type { IUser };
export type UserDocument = IUser;

// Booking Model
import type { IBooking } from './booking';
export type { IBooking };
export type BookingDocument = IBooking;

// Review Model
import type { IReview } from './review';
export type { IReview };
export type ReviewDocument = IReview;

// Comment Model
import type { IComment } from './comment';
export type { IComment };
export type CommentDocument = IComment;

// Analytics Model
import type { IAnalytics } from './analytics';
export type { IAnalytics };
export type AnalyticsDocument = IAnalytics;

// Add interfaces for models that don't have them yet
import { Document, Types } from 'mongoose';

// Vendor Interface (to be added to vendor.ts later)
export interface IVendor extends Document {
  _id: Types.ObjectId;
  name: string;
  businessName: string;
  category: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    serviceAreas?: string[];
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  services?: Array<{
    name: string;
    description?: string;
    price?: number;
    duration?: string;
  }>;
  portfolio?: string[];
  pricing: {
    startingPrice: number;
    currency: string;
    packages?: Array<{
      name?: string;
      price?: number;
      features?: string[];
    }>;
  };
  availability?: Array<{
    date: Date;
    isAvailable: boolean;
  }>;
  rating?: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isVerified: boolean;
  userId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VendorDocument = IVendor;

// Venue Interface (to be added to venue.ts later)
export interface IVenue extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  capacity: {
    min: number;
    max: number;
  };
  pricing: {
    basePrice: number;
    currency: string;
    pricePerGuest?: number;
  };
  amenities?: string[];
  images?: string[];
  availability?: Array<{
    date: Date;
    isAvailable: boolean;
  }>;
  rating: {
    average: number;
    count: number;
  };
  reviews?: Array<{
    user: Types.ObjectId;
    rating: number;
    comment?: string;
    images?: string[];
    createdAt: Date;
  }>;
  owner: Types.ObjectId;
  isActive: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VenueDocument = IVenue;

