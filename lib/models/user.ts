import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // Basic Information
  email: string;
  password?: string;
  name: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Role Management
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin' | 'maintainer';
  roleVerified: boolean;
  roleVerifiedAt?: Date;
  roleVerifiedBy?: mongoose.Types.ObjectId;
  
  // Profile Information
  avatar?: string;
  bio?: string;
  location: {
    country: string;
    state: string;
    city: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Preferences
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  
  // Verification Status
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  verificationDocuments: mongoose.Types.ObjectId[];
  
  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  loginCount: number;
  loginAttempts: number;
  lockedUntil?: Date;
  
  
  // Wedding Details
  weddingDetails?: {
    weddingDate?: Date;
    venue?: string;
    guestCount?: number;
    budget?: number;
    theme?: string;
    colors?: string[];
  };
  
  // Favorites
  favorites?: {
    vendors: mongoose.Types.ObjectId[];
    venues: mongoose.Types.ObjectId[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLastActive(): Promise<void>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  lockAccount(durationMinutes: number): Promise<void>;
  unlockAccount(): Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function(this: any) {
        // Password is required only if no social accounts
        return !this.socialAccounts || Object.keys(this.socialAccounts).length === 0;
      },
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    
    // Role Management
    role: {
      type: String,
      enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'],
      default: 'user',
      required: true,
    },
    roleVerified: {
      type: Boolean,
      default: false,
    },
    roleVerifiedAt: {
      type: Date,
    },
    roleVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    // Profile Information
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      country: {
        type: String,
        required: false,
        default: 'Sri Lanka',
      },
      state: {
        type: String,
        required: false,
        default: 'Western Province',
      },
      city: {
        type: String,
        required: false,
        default: 'Colombo',
      },
      zipCode: {
        type: String,
      },
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    
    // Preferences
    preferences: {
      language: {
        type: String,
        default: 'en',
      },
      currency: {
        type: String,
        default: 'USD',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      marketing: {
        email: {
          type: Boolean,
          default: false,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: false,
        },
      },
    },
    
    // Social Authentication
    socialAccounts: [{
      provider: {
        type: String,
        required: true,
        enum: ['google', 'facebook', 'instagram', 'linkedin']
      },
      providerId: {
        type: String,
        required: true
      },
      accessToken: String,
      refreshToken: String,
      expiresAt: Date,
      scope: String,
      idToken: String,
      linkedAt: {
        type: Date,
        default: Date.now
      },
      lastUsed: Date
    }],
    
    // Verification Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isIdentityVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    }],
    
    // Account Status
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending_verification'],
      default: 'pending_verification',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
    },
    
    
    // Wedding Details
    weddingDetails: {
      weddingDate: {
        type: Date,
      },
      venue: {
        type: String,
      },
      guestCount: {
        type: Number,
      },
      budget: {
        type: Number,
      },
      theme: {
        type: String,
      },
      colors: [{
        type: String,
      }],
    },
    
    // Favorites
    favorites: {
      vendors: [{
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
      }],
      venues: [{
        type: Schema.Types.ObjectId,
        ref: 'Venue',
      }],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ 'location.city': 1, 'location.state': 1 });
UserSchema.index({ 'socialAccounts.provider': 1, 'socialAccounts.providerId': 1 });

// Pre-save middleware - DISABLED (password is already hashed in registration)
// UserSchema.pre('save', async function(next) {
//   if (this.isModified('password') && this.password) {
//     try {
//       // Hash password with salt
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password as string, salt);
//     } catch (error) {
//       return next(error as Error);
//     }
//   }
//   
//   // Set lastActiveAt to current time
//   this.lastActiveAt = new Date();
//   
//   next();
// });

// Only set lastActiveAt on save
UserSchema.pre('save', async function(next) {
  // Set lastActiveAt to current time
  this.lastActiveAt = new Date();
  next();
});

// Instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateLastActive = async function(): Promise<void> {
  this.lastActiveAt = new Date();
  await this.save();
};

UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.loginAttempts = 0;
  this.lockedUntil = undefined;
  await this.save();
};

UserSchema.methods.lockAccount = async function(durationMinutes: number): Promise<void> {
  this.lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000);
  this.status = 'suspended';
  await this.save();
};

UserSchema.methods.unlockAccount = async function(): Promise<void> {
  this.lockedUntil = undefined;
  this.status = 'active';
  this.loginAttempts = 0;
  await this.save();
};

// Static methods
UserSchema.statics.findBySocialAccount = function(provider: string, providerId: string) {
  return this.findOne({ 
    'socialAccounts.provider': provider,
    'socialAccounts.providerId': providerId 
  });
};

UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
