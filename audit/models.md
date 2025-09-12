# Data Models & Relations Audit

## Executive Summary
The WeddingLK project has a comprehensive data model structure with 15+ models covering all major entities. The models are well-designed with proper relationships, but some critical models are missing for complete functionality.

## Model Inventory

### ✅ Implemented Models

#### Core User Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| User | `lib/models/user.ts` | ✅ Complete | Self-referential (roleVerifiedBy) | Comprehensive user model with roles |
| VendorProfile | `lib/models/vendorProfile.ts` | ✅ Complete | User (userId) | Business information and services |
| WeddingPlannerProfile | `lib/models/weddingPlannerProfile.ts` | ✅ Complete | User (userId) | Professional planner details |

#### Business Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| Vendor | `lib/models/vendor.ts` | ✅ Complete | User, Venue, Service | Vendor business entity |
| Venue | `lib/models/venue.ts` | ✅ Complete | User (owner), Booking | Venue information and availability |
| Service | `lib/models/service.ts` | ✅ Complete | Vendor, Booking | Individual services offered |
| Booking | `lib/models/booking.ts` | ✅ Complete | User, Vendor, Venue, Payment | Core booking entity |

#### Transaction Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| Payment | `lib/models/Payment.ts` | ✅ Complete | User, Booking | Payment processing |
| Review | `lib/models/review.ts` | ✅ Complete | User, Vendor, Venue, Booking | Review and rating system |

#### Communication Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| Message | `lib/models/message.ts` | ✅ Complete | User, Conversation | Individual messages |
| Conversation | `lib/models/conversation.ts` | ✅ Complete | User, Message | Message threads |
| Notification | `lib/models/notification.ts` | ✅ Complete | User | User notifications |

#### Planning Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| Task | `lib/models/task.ts` | ✅ Complete | User, Client | Task management |
| Client | `lib/models/client.ts` | ✅ Complete | User (planner) | Client management for planners |

#### Content Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| Post | `lib/models/post.ts` | ✅ Complete | User | Social media posts |
| Document | `lib/models/document.ts` | ✅ Complete | User | File uploads and documents |

#### Marketing Models
| Model | File | Status | Relationships | Notes |
|-------|------|--------|---------------|-------|
| VenueBoost | `lib/models/venueBoost.ts` | ✅ Complete | Venue, User (owner) | Boost campaigns |

### ❌ Missing Critical Models

#### 1. Boost Package Model (P1 - High)
**Status**: Missing
**Impact**: Cannot create boost packages for purchase
**Required Implementation**:

```typescript
// lib/models/boostPackage.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBoostPackage extends Document {
  name: string;
  description: string;
  type: 'featured' | 'premium' | 'sponsored';
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  maxImpressions?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BoostPackageSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['featured', 'premium', 'sponsored'], 
    required: true 
  },
  price: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  duration: { type: Number, required: true },
  features: [{ type: String }],
  maxImpressions: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const BoostPackage = mongoose.model<IBoostPackage>('BoostPackage', BoostPackageSchema);
```

#### 2. Favorite Model (P1 - High)
**Status**: Missing
**Impact**: Users cannot save favorites
**Required Implementation**:

```typescript
// lib/models/favorite.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  type: 'vendor' | 'venue' | 'service';
  itemId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['vendor', 'venue', 'service'], 
    required: true 
  },
  itemId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound index for uniqueness
FavoriteSchema.index({ user: 1, type: 1, itemId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
```

#### 3. Audit Log Model (P2 - Medium)
**Status**: Missing
**Impact**: No audit trail for security
**Required Implementation**:

```typescript
// lib/models/auditLog.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
```

#### 4. Package Model (P2 - Medium)
**Status**: Partial (exists but incomplete)
**Impact**: Wedding packages not fully functional
**Current Issues**:
- Missing pricing structure
- No package features
- No availability tracking

**Required Enhancement**:
```typescript
// Enhanced package model
export interface IPackage extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  duration: number; // in hours
  maxGuests: number;
  isActive: boolean;
  vendor: mongoose.Types.ObjectId;
  category: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Relationship Analysis

### ✅ Well-Designed Relationships

#### User-Centric Design
- **User → VendorProfile**: One-to-one relationship
- **User → WeddingPlannerProfile**: One-to-one relationship
- **User → Booking**: One-to-many relationship
- **User → Review**: One-to-many relationship
- **User → Message**: One-to-many relationship

#### Business Logic Relationships
- **Vendor → Venue**: One-to-many relationship
- **Vendor → Service**: One-to-many relationship
- **Venue → Booking**: One-to-many relationship
- **Booking → Payment**: One-to-one relationship
- **Booking → Review**: One-to-one relationship

### ❌ Relationship Issues

#### 1. Missing Foreign Key Constraints
**Problem**: No database-level referential integrity
**Impact**: Data inconsistency possible

**Example Fix**:
```typescript
// Add proper references
const BookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
  // ... other fields
});
```

#### 2. Inconsistent Naming Conventions
**Problem**: Mixed naming patterns across models
**Examples**:
- `userId` vs `user` (inconsistent reference naming)
- `createdAt` vs `created_at` (inconsistent timestamp naming)

#### 3. Missing Cascade Deletes
**Problem**: No cascade delete rules
**Impact**: Orphaned records possible

## Index Analysis

### ✅ Existing Indexes
- **User Model**: Email index for authentication
- **VenueBoost Model**: Compound indexes for queries
- **Message Model**: User and conversation indexes

### ❌ Missing Critical Indexes

#### 1. Search Performance Indexes
```typescript
// Venue search optimization
VenueSchema.index({ 
  name: 'text', 
  description: 'text', 
  location: 'text' 
});

// Booking query optimization
BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ vendor: 1, status: 1 });
BookingSchema.index({ venue: 1, date: 1 });
```

#### 2. Performance Indexes
```typescript
// Review aggregation
ReviewSchema.index({ vendor: 1, rating: 1 });
ReviewSchema.index({ venue: 1, rating: 1 });

// Payment tracking
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true });
```

## Data Validation

### ✅ Existing Validation
- **User Model**: Email format, password length
- **Venue Model**: Required fields, enum values
- **Booking Model**: Date validation, status enums

### ❌ Missing Validation

#### 1. Business Logic Validation
```typescript
// Booking validation
BookingSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('Start date must be before end date'));
  }
  next();
});

// Payment validation
PaymentSchema.pre('save', function(next) {
  if (this.amount <= 0) {
    next(new Error('Payment amount must be positive'));
  }
  next();
});
```

#### 2. Cross-Model Validation
```typescript
// Ensure vendor owns venue
VenueSchema.pre('save', async function(next) {
  const vendor = await Vendor.findById(this.owner);
  if (!vendor) {
    next(new Error('Venue owner must be a valid vendor'));
  }
  next();
});
```

## Migration Requirements

### 1. Add Missing Models
- Create BoostPackage model
- Create Favorite model
- Create AuditLog model
- Enhance Package model

### 2. Add Missing Indexes
- Search indexes for venues and vendors
- Performance indexes for bookings and payments
- Unique constraints for critical fields

### 3. Data Migration
- Migrate existing favorites data
- Add missing foreign key references
- Standardize naming conventions

## Security Considerations

### 1. Data Access Control
- Implement row-level security
- Add ownership validation
- Secure sensitive fields

### 2. Data Encryption
- Encrypt sensitive user data
- Hash payment information
- Secure file uploads

### 3. Audit Trail
- Track all data modifications
- Log access patterns
- Monitor suspicious activity

## Performance Optimization

### 1. Query Optimization
- Add proper indexes
- Optimize aggregation pipelines
- Implement query caching

### 2. Data Archiving
- Archive old bookings
- Clean up expired boosts
- Manage log retention

### 3. Caching Strategy
- Cache frequently accessed data
- Implement Redis for sessions
- Use CDN for static assets

## Testing Requirements

### 1. Model Testing
- Unit tests for each model
- Validation testing
- Relationship testing

### 2. Integration Testing
- Cross-model operations
- Data consistency testing
- Performance testing

### 3. Security Testing
- Access control testing
- Data encryption testing
- Audit trail testing

## Recommendations

### Immediate Actions (P0)
1. **Add Missing Models**: Implement BoostPackage, Favorite, and AuditLog models
2. **Fix Relationships**: Add proper foreign key constraints
3. **Add Indexes**: Implement critical performance indexes

### High Priority (P1)
1. **Data Validation**: Add business logic validation
2. **Security**: Implement row-level security
3. **Migration**: Create migration scripts for existing data

### Medium Priority (P2)
1. **Performance**: Optimize queries and add caching
2. **Monitoring**: Implement data monitoring and alerting
3. **Documentation**: Create comprehensive model documentation

## Summary
The data model structure is solid but requires completion of missing models and relationship improvements. Focus on implementing the missing critical models and adding proper indexes for production readiness.



