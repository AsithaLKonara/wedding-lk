import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"
import { Vendor } from "@/lib/models/vendor"
import { Venue } from "@/lib/models/venue"

export interface UserAvatarData {
  _id: string
  name: string
  email: string
  avatar?: string
  role: string
  phone?: string
  isVerified?: boolean
  isActive?: boolean
}

export interface VendorAvatarData {
  _id: string
  name: string
  businessName: string
  avatar?: string
  category: string
  location: {
    city: string
    province: string
  }
  rating?: {
    average: number
    count: number
  }
  isVerified?: boolean
  owner?: UserAvatarData
}

export interface VenueAvatarData {
  _id: string
  name: string
  avatar?: string
  location: {
    city: string
    province: string
  }
  capacity: number
  priceRange: {
    min: number
    max: number
  }
  rating?: {
    average: number
    count: number
  }
  isVerified?: boolean
}

export class UserAvatarService {
  /**
   * Get user avatar and basic info by ID
   */
  static async getUserById(userId: string): Promise<UserAvatarData | null> {
    try {
      await connectDB()
      const user = await User.findById(userId).select('name email avatar role phone isVerified isActive')
      return user ? user.toObject() : null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  /**
   * Get user avatar and basic info by email
   */
  static async getUserByEmail(email: string): Promise<UserAvatarData | null> {
    try {
      await connectDB()
      const user = await User.findOne({ email }).select('name email avatar role phone isVerified isActive')
      return user ? user.toObject() : null
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  /**
   * Get multiple users by IDs
   */
  static async getUsersByIds(userIds: string[]): Promise<UserAvatarData[]> {
    try {
      await connectDB()
      const users = await User.find({ _id: { $in: userIds } })
        .select('name email avatar role phone isVerified isActive')
      return users.map(user => user.toObject())
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  /**
   * Get all users
   */
  static async getAllUsers(): Promise<UserAvatarData[]> {
    try {
      await connectDB()
      const users = await User.find()
        .select('name email avatar role phone isVerified isActive')
      return users.map(user => user.toObject())
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }

  /**
   * Get vendor with owner avatar data
   */
  static async getVendorWithOwner(vendorId: string): Promise<VendorAvatarData | null> {
    try {
      await connectDB()
      const vendor = await Vendor.findById(vendorId)
        .populate('owner', 'name email avatar role phone isVerified isActive')
        .select('name businessName avatar category location rating isVerified owner')
      
      if (!vendor) return null

      const vendorData = vendor.toObject()
      return {
        ...vendorData,
        owner: vendorData.owner as UserAvatarData
      }
    } catch (error) {
      console.error('Error fetching vendor with owner:', error)
      return null
    }
  }

  /**
   * Get all vendors with owner avatar data
   */
  static async getAllVendorsWithOwners(): Promise<VendorAvatarData[]> {
    try {
      await connectDB()
      const vendors = await Vendor.find()
        .populate('owner', 'name email avatar role phone isVerified isActive')
        .select('name businessName avatar category location rating isVerified owner')
      
      return vendors.map(vendor => {
        const vendorData = vendor.toObject()
        return {
          ...vendorData,
          owner: vendorData.owner as UserAvatarData
        }
      })
    } catch (error) {
      console.error('Error fetching vendors with owners:', error)
      return []
    }
  }

  /**
   * Get all venues
   */
  static async getAllVenues(): Promise<VenueAvatarData[]> {
    try {
      await connectDB()
      const venues = await Venue.find()
        .select('name avatar location capacity priceRange rating isVerified')
      return venues.map(venue => venue.toObject())
    } catch (error) {
      console.error('Error fetching venues:', error)
      return []
    }
  }

  /**
   * Get venue by ID
   */
  static async getVenueById(venueId: string): Promise<VenueAvatarData | null> {
    try {
      await connectDB()
      const venue = await Venue.findById(venueId)
        .select('name avatar location capacity priceRange rating isVerified')
      return venue ? venue.toObject() : null
    } catch (error) {
      console.error('Error fetching venue:', error)
      return null
    }
  }
} 