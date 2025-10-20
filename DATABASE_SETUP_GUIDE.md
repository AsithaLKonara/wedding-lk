# 🗄️ Database Setup Guide for WeddingLK

## 📋 Current Database Models

Your WeddingLK application has the following database models:

### 1. **User Model** (`lib/models/user.ts`)
- **Fields**: firstName, lastName, email, phone, password, userType, weddingDate, profileImage, isVerified
- **User Types**: couple, vendor, planner, admin
- **Features**: 2FA, subscription plans, preferences, favorites
- **Relationships**: References to venues and vendors

### 2. **Venue Model** (`lib/models/venue.ts`)
- **Fields**: name, description, location, capacity, pricing, amenities, images
- **Features**: Availability calendar, ratings, reviews, owner reference
- **Location**: Address, city, province, coordinates

### 3. **Vendor Model** (`lib/models/vendor.ts`)
- **Fields**: name, businessName, category, description, contact info
- **Categories**: photographer, decorator, catering, music, transport, makeup, jewelry, clothing
- **Features**: Services, portfolio, pricing packages, availability, ratings

### 4. **Package Model** (`lib/models/package.ts`)
- **Fields**: name, description, price, features, category, images, rating
- **Categories**: Premium, Standard, Basic, Custom
- **Features**: Feature mapping, active status, timestamps

### 5. **Additional Models**
- **Booking** (`lib/models/booking.ts`) - Wedding bookings and reservations
- **Review** (`lib/models/review.ts`) - User reviews and ratings
- **Message** (`lib/models/message.ts`) - Chat messages
- **ChatRoom** (`lib/models/chat-room.ts`) - Chat rooms
- **Notification** (`lib/models/notification.ts`) - User notifications
- **Task** (`lib/models/task.ts`) - Wedding planning tasks
- **Service** (`lib/models/service.ts`) - Service definitions

## 🚀 Database Setup Options

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster

2. **Configure Database**
   ```bash
   # Create .env.local file
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk?retryWrites=true&w=majority
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here
   ```

3. **Test Connection**
   ```bash
   npm run dev
   # Check console for database connection status
   ```

### Option 2: Local MongoDB (Development)

1. **Install MongoDB Locally**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```

2. **Configure Local Connection**
   ```bash
   # Create .env.local file
   MONGODB_URI=mongodb://localhost:27017/weddinglk
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here
   ```

## 🔧 Database Connection Status

**Current Status**: 
- ✅ Database models are properly defined
- ✅ Connection logic is implemented in `lib/db.ts`
- ⚠️ No MONGODB_URI configured (using sample data)
- ✅ Graceful fallback to sample data when no database

## 📊 Sample Data Structure

Currently, your app uses sample data for:
- **Packages**: 3 sample packages (Premium, Standard, Basic)
- **Chatbot**: Sample venues, vendors, and packages
- **API Responses**: Mock data for development

## 🎯 Next Steps

### To Enable Real Database:

1. **Set up MongoDB Atlas** (recommended)
2. **Create `.env.local`** with your connection string
3. **Update API routes** to use real database queries
4. **Add data seeding** for initial data

### Current Working Features:
- ✅ All pages load correctly
- ✅ Sample data displays properly
- ✅ API endpoints respond with mock data
- ✅ No database connection errors
- ✅ Production deployment working

## 🔍 Database Schema Overview

```
WeddingLK Database Schema:
├── Users (Authentication & Profiles)
├── Venues (Wedding Locations)
├── Vendors (Service Providers)
├── Packages (Wedding Packages)
├── Bookings (Reservations)
├── Reviews (Ratings & Feedback)
├── Messages (Chat System)
├── Notifications (User Alerts)
└── Tasks (Planning Tasks)
```

## 💡 Recommendations

1. **For Development**: Continue using sample data (current setup)
2. **For Production**: Set up MongoDB Atlas with proper environment variables
3. **For Testing**: Use in-memory database or test-specific MongoDB instance
4. **For Scaling**: Consider database indexing and connection pooling

Your application is fully functional with the current sample data setup! 🎉
