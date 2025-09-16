import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Display Preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  
  // Notification Preferences
  notifications: {
    email: {
      enabled: boolean;
      bookingUpdates: boolean;
      newMessages: boolean;
      marketing: boolean;
      security: boolean;
      weeklyDigest: boolean;
    };
    sms: {
      enabled: boolean;
      bookingReminders: boolean;
      securityAlerts: boolean;
    };
    push: {
      enabled: boolean;
      newMessages: boolean;
      bookingUpdates: boolean;
      socialActivity: boolean;
      marketing: boolean;
    };
    inApp: {
      enabled: boolean;
      showBanner: boolean;
      soundEnabled: boolean;
    };
  };
  
  // Privacy Preferences
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowDirectMessages: boolean;
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
    allowTagging: boolean;
  };
  
  // Wedding Planning Preferences
  weddingPlanning: {
    weddingDate?: Date;
    budget?: number;
    guestCount?: number;
    preferredLocations: string[];
    preferredStyles: string[];
    preferredColors: string[];
    dietaryRestrictions: string[];
    accessibilityNeeds: string[];
    culturalRequirements: string[];
  };
  
  // Search Preferences
  search: {
    defaultLocation?: string;
    searchRadius: number; // in kilometers
    priceRange: {
      min: number;
      max: number;
    };
    preferredCategories: string[];
    savedSearches: Array<{
      name: string;
      filters: any;
      createdAt: Date;
    }>;
  };
  
  // Content Preferences
  content: {
    feedPreferences: {
      showVendorPosts: boolean;
      showUserPosts: boolean;
      showSponsoredContent: boolean;
      preferredCategories: string[];
    };
    blockedUsers: mongoose.Types.ObjectId[];
    blockedKeywords: string[];
    contentFilters: {
      hideExplicitContent: boolean;
      hidePoliticalContent: boolean;
      hideReligiousContent: boolean;
    };
  };
  
  // Accessibility Preferences
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'auto'
  },
  language: {
    type: String,
    default: 'en'
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  timezone: {
    type: String,
    default: 'Asia/Colombo'
  },
  dateFormat: {
    type: String,
    enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    default: 'DD/MM/YYYY'
  },
  timeFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h'
  },
  
  notifications: {
    email: {
      enabled: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      bookingReminders: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true }
    },
    push: {
      enabled: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      socialActivity: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    inApp: {
      enabled: { type: Boolean, default: true },
      showBanner: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true }
    }
  },
  
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showLocation: { type: Boolean, default: true },
    allowDirectMessages: { type: Boolean, default: true },
    allowFriendRequests: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    allowTagging: { type: Boolean, default: true }
  },
  
  weddingPlanning: {
    weddingDate: Date,
    budget: Number,
    guestCount: Number,
    preferredLocations: [String],
    preferredStyles: [String],
    preferredColors: [String],
    dietaryRestrictions: [String],
    accessibilityNeeds: [String],
    culturalRequirements: [String]
  },
  
  search: {
    defaultLocation: String,
    searchRadius: { type: Number, default: 50 },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 1000000 }
    },
    preferredCategories: [String],
    savedSearches: [{
      name: String,
      filters: Schema.Types.Mixed,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  content: {
    feedPreferences: {
      showVendorPosts: { type: Boolean, default: true },
      showUserPosts: { type: Boolean, default: true },
      showSponsoredContent: { type: Boolean, default: true },
      preferredCategories: [String]
    },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedKeywords: [String],
    contentFilters: {
      hideExplicitContent: { type: Boolean, default: true },
      hidePoliticalContent: { type: Boolean, default: false },
      hideReligiousContent: { type: Boolean, default: false }
    }
  },
  
  accessibility: {
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'medium'
    },
    highContrast: { type: Boolean, default: false },
    reducedMotion: { type: Boolean, default: false },
    screenReader: { type: Boolean, default: false },
    keyboardNavigation: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes
UserPreferencesSchema.index({ userId: 1 });
UserPreferencesSchema.index({ 'weddingPlanning.weddingDate': 1 });
UserPreferencesSchema.index({ 'search.defaultLocation': 1 });

export const UserPreferences = mongoose.models.UserPreferences || mongoose.model('UserPreferences', UserPreferencesSchema);
