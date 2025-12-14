/**
 * Populated Document Type Definitions
 * Provides type-safe definitions for Mongoose populated documents
 */

import { Document, Types } from 'mongoose';

/**
 * Base populated field type
 */
export type PopulatedField<T> = T | Types.ObjectId | string;

/**
 * Populated user in various contexts
 */
export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
  verified?: boolean;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

/**
 * Populated vendor
 */
export interface PopulatedVendor {
  _id: Types.ObjectId;
  businessName: string;
  contactEmail?: string;
  email?: string;
  images?: string[];
  category?: string;
  location?: string;
  rating?: {
    average?: number;
    count?: number;
  };
}

/**
 * Populated venue
 */
export interface PopulatedVenue {
  _id: Types.ObjectId;
  name: string;
  location?: string;
  address?: string;
  city?: string;
  images?: string[];
  capacity?: number;
  pricing?: {
    startingPrice?: number;
  };
}

/**
 * Populated booking
 */
export interface PopulatedBooking extends Document {
  _id: Types.ObjectId;
  userId: PopulatedField<PopulatedUser>;
  vendorId: PopulatedField<PopulatedVendor>;
  venueId?: PopulatedField<PopulatedVenue>;
  totalPrice: number;
  status: string;
  date: Date;
  items?: unknown[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Populated comment
 */
export interface PopulatedComment extends Document {
  _id: Types.ObjectId;
  author: {
    type: string;
    id: PopulatedField<PopulatedUser>;
    name?: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  likes?: Array<{
    user: PopulatedField<PopulatedUser>;
    likedAt?: Date;
  }>;
  dislikes?: Array<{
    user: PopulatedField<PopulatedUser>;
    dislikedAt?: Date;
  }>;
  postId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Populated review
 */
export interface PopulatedReview extends Document {
  _id: Types.ObjectId;
  userId: PopulatedField<PopulatedUser>;
  vendorId: PopulatedField<PopulatedVendor>;
  venueId?: PopulatedField<PopulatedVenue>;
  overallRating: number;
  rating?: number;
  title?: string;
  comment?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Generic populated document helper
 * Replaces a field K in type T with type P
 */
export type WithPopulated<T, K extends keyof T, P> = Omit<T, K> & {
  [Key in K]: P;
};

/**
 * Helper type for documents with multiple populated fields
 */
export type WithPopulatedFields<T, Fields extends Record<keyof T, unknown>> = Omit<T, keyof Fields> & Fields;

