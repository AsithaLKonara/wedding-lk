# 🗄️ **COMPLETE DATABASE SCHEMA - WeddingLK Platform**

## **Database: `weddinglk`**

---

## **📋 COLLECTION OVERVIEW**

| Collection | Purpose | Key Features |
|------------|---------|--------------|
| **users** | User management & authentication | Multi-role support, social auth, preferences |
| **vendors** | Service providers | Categories, portfolios, pricing, availability |
| **venues** | Wedding venues | Capacity, amenities, location, pricing |
| **bookings** | Booking management | Event scheduling, payment tracking |
| **payments** | Payment processing | Stripe integration, multiple methods |
| **reviews** | Rating & review system | Multi-category ratings, media support |
| **services** | Service catalog | Vendor services, packages, pricing |
| **messages** | Communication system | Real-time messaging, attachments |
| **notifications** | User notifications | Multi-channel, preferences |
| **posts** | Social feed | Content sharing, engagement |
| **favorites** | User favorites | Saved items, wishlists |
| **subscriptions** | Premium features | Plans, billing, usage tracking |

---

## **👥 USERS COLLECTION**

### **Purpose**: User management, authentication, and profiles

### **Fields**:
```javascript
{
  // Basic Information
  _id: ObjectId,
  email: String (required, unique, lowercase),
  password: String (min 8 chars, required if no social accounts),
  name: String (required),
  phone: String,
  dateOfBirth: Date,
  gender: String (enum: ['male', 'female', 'other', 'prefer_not_to_say']),
  
  // Role Management
  role: String (enum: ['user', 'vendor', 'wedding_planner', 'admin', 'maintainer'], default: 'user'),
  roleVerified: Boolean (default: false),
  roleVerifiedAt: Date,
  roleVerifiedBy: ObjectId (ref: 'User'),
  
  // Profile Information
  avatar: String (URL),
  bio: String (max 500 chars),
  location: {
    country: String (default: 'Sri Lanka'),
    state: String (default: 'Western Province'),
    city: String (default: 'Colombo'),
    zipCode: String,
    coordinates: {
      latitude: Number (-90 to 90),
      longitude: Number (-180 to 180)
    }
  },
  
  // Preferences
  preferences: {
    language: String (default: 'en'),
    currency: String (default: 'LKR'),
    timezone: String,
    notifications: {
      email: Boolean (default: true),
      sms: Boolean (default: true),
      push: Boolean (default: true)
    },
    marketing: {
      email: Boolean (default: false),
      sms: Boolean (default: false),
      push: Boolean (default: false)
    }
  },
  
  // Social Authentication
  socialAccounts: [{
    provider: String,
    providerId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    scope: String,
    idToken: String,
    linkedAt: Date,
    lastUsed: Date
  }],
  
  // Verification Status
  isEmailVerified: Boolean (default: false),
  isPhoneVerified: Boolean (default: false),
  isIdentityVerified: Boolean (default: false),
  verificationDocuments: [ObjectId],
  
  // Account Status
  status: String (enum: ['active', 'inactive', 'suspended', 'pending_verification'], default: 'active'),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  lastLogin: Date,
  loginCount: Number (default: 0),
  loginAttempts: Number (default: 0),
  lockedUntil: Date,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Email Verification
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Wedding Details
  weddingDetails: {
    partnerName: String,
    weddingDate: Date,
    budget: Number,
    guestCount: Number,
    venue: String,
    theme: String,
    colors: [String],
    preferences: [String]
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ email: 1 }` (unique)
- `{ role: 1, isActive: 1 }`
- `{ 'location.city': 1, 'location.state': 1 }`
- `{ createdAt: -1 }`

---

## **🏢 VENDORS COLLECTION**

### **Purpose**: Service provider management

### **Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  businessName: String (required),
  category: String (enum: ['photographer', 'decorator', 'catering', 'music', 'transport', 'makeup', 'jewelry', 'clothing'], required),
  description: String (required),
  
  location: {
    address: String (required),
    city: String (required),
    province: String (required),
    serviceAreas: [String]
  },
  
  contact: {
    phone: String (required),
    email: String (required),
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      youtube: String
    }
  },
  
  services: [{
    name: String (required),
    description: String,
    price: Number,
    duration: String
  }],
  
  portfolio: [String], // Image URLs
  pricing: {
    startingPrice: Number (required),
    currency: String (default: 'LKR'),
    packages: [{
      name: String,
      price: Number,
      features: [String]
    }]
  },
  
  availability: [{
    date: Date,
    isAvailable: Boolean (default: true)
  }],
  
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  
  reviews: [{
    user: ObjectId (ref: 'User'),
    rating: Number (required, 1-5),
    comment: String,
    images: [String],
    createdAt: Date (default: Date.now)
  }],
  
  owner: ObjectId (ref: 'User', required),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  featured: Boolean (default: false),
  onboardingComplete: Boolean (default: false),
  
  subscription: {
    plan: String (enum: ['basic', 'premium', 'pro'], default: 'basic'),
    expiresAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ businessName: 'text', description: 'text', 'services.name': 'text' }`
- `{ category: 1 }`
- `{ 'location.city': 1, 'location.province': 1 }`
- `{ 'pricing.startingPrice': 1 }`
- `{ 'rating.average': -1 }`
- `{ isActive: 1, isVerified: 1 }`

---

## **🏛️ VENUES COLLECTION**

### **Purpose**: Wedding venue management

### **Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  
  location: {
    address: String (required),
    city: String (required),
    province: String (required),
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  capacity: {
    min: Number (required),
    max: Number (required)
  },
  
  pricing: {
    basePrice: Number (required),
    currency: String (default: 'LKR'),
    pricePerGuest: Number
  },
  
  amenities: [String],
  images: [String], // Image URLs
  availability: [{
    date: Date,
    isAvailable: Boolean (default: true)
  }],
  
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  
  reviews: [{
    user: ObjectId (ref: 'User'),
    rating: Number (required, 1-5),
    comment: String,
    images: [String],
    createdAt: Date (default: Date.now)
  }],
  
  owner: ObjectId (ref: 'User', required),
  isActive: Boolean (default: true),
  featured: Boolean (default: false),
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ name: 'text', description: 'text' }`
- `{ 'location.city': 1, 'location.province': 1 }`
- `{ 'pricing.basePrice': 1 }`
- `{ 'rating.average': -1 }`
- `{ isActive: 1, featured: 1 }`

---

## **📅 BOOKINGS COLLECTION**

### **Purpose**: Event booking management

### **Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  vendor: ObjectId (ref: 'Vendor'),
  venue: ObjectId (ref: 'Venue'),
  planner: ObjectId (ref: 'User'),
  
  service: {
    name: String,
    description: String,
    price: Number
  },
  
  eventDate: Date (required),
  eventTime: String,
  duration: Number, // in minutes
  guestCount: Number (min: 1),
  
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in_progress'], default: 'pending'),
  
  payment: {
    amount: Number (required, min: 0),
    currency: String (default: 'LKR'),
    status: String (enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'),
    method: String (enum: ['bank_transfer', 'card', 'cash'], default: 'bank_transfer'),
    transactionId: String
  },
  
  notes: String,
  isActive: Boolean (default: true),
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ user: 1, eventDate: -1 }`
- `{ vendor: 1, eventDate: -1 }`
- `{ venue: 1, eventDate: -1 }`
- `{ status: 1 }`
- `{ eventDate: 1 }`

---

## **💳 PAYMENTS COLLECTION**

### **Purpose**: Payment processing and tracking

### **Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  userId: ObjectId (ref: 'User'),
  vendor: ObjectId (ref: 'Vendor'),
  venue: ObjectId (ref: 'Venue'),
  booking: ObjectId (ref: 'Booking'),
  
  amount: Number (required, min: 0),
  currency: String (default: 'LKR'),
  status: String (enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending'),
  type: String (enum: ['booking', 'ads_payment', 'ads_subscription', 'subscription'], default: 'booking'),
  
  paymentMethod: String (required),
  transactionId: String,
  stripePaymentIntentId: String,
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  
  gatewayResponse: Mixed,
  description: String,
  metadata: Mixed,
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ user: 1, createdAt: -1 }`
- `{ vendor: 1, createdAt: -1 }`
- `{ venue: 1, createdAt: -1 }`
- `{ status: 1 }`
- `{ transactionId: 1 }` (unique)

---

## **⭐ REVIEWS COLLECTION**

### **Purpose**: Rating and review system

### **Fields**:
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId (ref: 'Vendor', required),
  venueId: ObjectId (ref: 'Venue'),
  userId: ObjectId (ref: 'User', required),
  bookingId: ObjectId (ref: 'Booking'),
  
  // Rating Details
  overallRating: Number (required, 1-5),
  categoryRatings: {
    service: Number (1-5, default: 5),
    quality: Number (1-5, default: 5),
    value: Number (1-5, default: 5),
    communication: Number (1-5, default: 5),
    timeliness: Number (1-5, default: 5)
  },
  
  // Review Content
  title: String (required, max 100 chars),
  comment: String (required, max 2000 chars),
  pros: [String] (max 200 chars each),
  cons: [String] (max 200 chars each),
  
  // Media
  images: [String] (max 10 images),
  videos: [String] (max 3 videos),
  
  // Verification
  isVerified: Boolean (default: false),
  verifiedAt: Date,
  isAnonymous: Boolean (default: false),
  
  // Engagement
  helpful: [ObjectId] (ref: 'User'),
  notHelpful: [ObjectId] (ref: 'User'),
  reportCount: Number (default: 0),
  
  // Response
  vendorResponse: {
    comment: String (max 1000 chars),
    respondedAt: Date,
    respondedBy: ObjectId (ref: 'User')
  },
  
  // Moderation
  status: String (enum: ['pending', 'approved', 'rejected', 'flagged'], default: 'pending'),
  moderationNotes: String (max 500 chars),
  moderatedBy: ObjectId (ref: 'User'),
  moderatedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ vendorId: 1, status: 1, createdAt: -1 }`
- `{ userId: 1, createdAt: -1 }`
- `{ overallRating: 1, status: 1 }`
- `{ isVerified: 1, status: 1 }`
- `{ vendorId: 1, userId: 1 }` (unique)

---

## **📧 MESSAGES COLLECTION**

### **Purpose**: Real-time communication system

### **Fields**:
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: 'Conversation', required),
  sender: ObjectId (ref: 'User', required),
  recipient: ObjectId (ref: 'User', required),
  
  content: String (required),
  type: String (enum: ['text', 'image', 'file', 'location', 'booking'], default: 'text'),
  
  attachments: [{
    type: String (enum: ['image', 'file', 'video', 'audio']),
    url: String,
    filename: String,
    size: Number,
    mimeType: String
  }],
  
  isRead: Boolean (default: false),
  readAt: Date,
  isEdited: Boolean (default: false),
  editedAt: Date,
  
  replyTo: ObjectId (ref: 'Message'),
  isDeleted: Boolean (default: false),
  deletedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ conversationId: 1, createdAt: -1 }`
- `{ sender: 1, createdAt: -1 }`
- `{ recipient: 1, isRead: 1 }`

---

## **🔔 NOTIFICATIONS COLLECTION**

### **Purpose**: User notification system

### **Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  type: String (enum: ['booking', 'payment', 'message', 'review', 'system', 'promotion'], required),
  title: String (required),
  message: String (required),
  
  data: {
    bookingId: ObjectId (ref: 'Booking'),
    paymentId: ObjectId (ref: 'Payment'),
    vendorId: ObjectId (ref: 'Vendor'),
    venueId: ObjectId (ref: 'Venue'),
    customData: Mixed
  },
  
  channels: [String] (enum: ['email', 'sms', 'push', 'in_app']),
  status: String (enum: ['pending', 'sent', 'delivered', 'failed'], default: 'pending'),
  
  sentAt: Date,
  deliveredAt: Date,
  readAt: Date,
  clickedAt: Date,
  
  priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  expiresAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ user: 1, createdAt: -1 }`
- `{ type: 1, status: 1 }`
- `{ status: 1, createdAt: 1 }`

---

## **📱 POSTS COLLECTION**

### **Purpose**: Social feed and content sharing

### **Fields**:
```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: 'User', required),
  type: String (enum: ['text', 'image', 'video', 'story', 'reel'], required),
  
  content: String,
  media: [{
    type: String (enum: ['image', 'video', 'audio']),
    url: String,
    thumbnail: String,
    duration: Number, // for videos
    size: Number
  }],
  
  hashtags: [String],
  mentions: [ObjectId] (ref: 'User'),
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  engagement: {
    likes: [ObjectId] (ref: 'User'),
    comments: [ObjectId] (ref: 'Comment'),
    shares: [ObjectId] (ref: 'User'),
    bookmarks: [ObjectId] (ref: 'User'),
    views: Number (default: 0)
  },
  
  visibility: String (enum: ['public', 'followers', 'private'], default: 'public'),
  isActive: Boolean (default: true),
  
  // Moderation
  isModerated: Boolean (default: false),
  moderationStatus: String (enum: ['pending', 'approved', 'rejected']),
  moderatedBy: ObjectId (ref: 'User'),
  moderatedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ author: 1, createdAt: -1 }`
- `{ type: 1, isActive: 1 }`
- `{ hashtags: 1 }`
- `{ 'engagement.likes': 1 }`

---

## **❤️ FAVORITES COLLECTION**

### **Purpose**: User favorites and wishlists

### **Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  itemType: String (enum: ['vendor', 'venue', 'service', 'post'], required),
  itemId: ObjectId (required),
  
  category: String,
  tags: [String],
  notes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ user: 1, itemType: 1, createdAt: -1 }`
- `{ itemId: 1, itemType: 1 }`
- `{ user: 1, itemId: 1, itemType: 1 }` (unique)

---

## **💎 SUBSCRIPTIONS COLLECTION**

### **Purpose**: Premium feature management

### **Fields**:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  plan: ObjectId (ref: 'SubscriptionPlan', required),
  
  status: String (enum: ['active', 'cancelled', 'expired', 'pending'], default: 'pending'),
  startDate: Date (required),
  endDate: Date (required),
  
  payment: {
    amount: Number (required),
    currency: String (default: 'LKR'),
    interval: String (enum: ['monthly', 'yearly'], required),
    nextBillingDate: Date,
    stripeSubscriptionId: String
  },
  
  features: [String], // Available features
  usage: {
    bookings: Number (default: 0),
    messages: Number (default: 0),
    storage: Number (default: 0) // in MB
  },
  
  autoRenew: Boolean (default: true),
  cancelledAt: Date,
  cancellationReason: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Indexes**:
- `{ user: 1, status: 1 }`
- `{ plan: 1, status: 1 }`
- `{ endDate: 1, status: 1 }`

---

## **📊 ADDITIONAL COLLECTIONS**

### **Services Collection**
- Vendor service catalog
- Service packages and pricing
- Availability management

### **Tasks Collection**
- Wedding planning tasks
- Vendor tasks
- Admin tasks

### **Analytics Collection**
- User behavior tracking
- Performance metrics
- Business intelligence

### **Moderation Collection**
- Content moderation
- User reports
- Admin actions

### **Commission Collection**
- Platform commission tracking
- Vendor payouts
- Financial reporting

---

## **🔧 DATABASE CONFIGURATION**

### **Connection String**:
```
mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority
```

### **Indexes for Performance**:
- Text search indexes on name, description fields
- Compound indexes for common queries
- Geospatial indexes for location-based searches
- TTL indexes for temporary data

### **Validation Rules**:
- Email format validation
- Phone number validation
- Password strength requirements
- File size and type restrictions
- Data length limits

### **Security**:
- Password hashing with bcrypt
- JWT token management
- Role-based access control
- Data encryption for sensitive fields

---

## **📈 ESTIMATED STORAGE REQUIREMENTS**

| Collection | Estimated Documents | Avg Document Size | Total Size |
|------------|-------------------|------------------|------------|
| users | 100,000 | 2KB | 200MB |
| vendors | 10,000 | 5KB | 50MB |
| venues | 5,000 | 4KB | 20MB |
| bookings | 500,000 | 1KB | 500MB |
| payments | 500,000 | 1KB | 500MB |
| reviews | 200,000 | 2KB | 400MB |
| messages | 1,000,000 | 0.5KB | 500MB |
| notifications | 2,000,000 | 0.3KB | 600MB |
| posts | 500,000 | 2KB | 1GB |
| **TOTAL** | **4,825,000** | **~1.5KB** | **~3.8GB** |

---

## **🚀 DEPLOYMENT CHECKLIST**

- [ ] Create MongoDB Atlas cluster
- [ ] Set up database user with appropriate permissions
- [ ] Configure connection string in environment variables
- [ ] Create all collections with proper schemas
- [ ] Set up indexes for performance
- [ ] Configure backup and monitoring
- [ ] Set up data validation rules
- [ ] Test all CRUD operations
- [ ] Implement data migration scripts if needed
- [ ] Set up database monitoring and alerts

---

**This schema supports a comprehensive wedding planning platform with user management, vendor services, venue booking, payment processing, social features, and premium subscriptions.**
