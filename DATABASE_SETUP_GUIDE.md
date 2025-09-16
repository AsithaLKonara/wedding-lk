# 🗄️ **WeddingLK Database Setup Guide**

## **📋 Overview**

This guide will help you set up the WeddingLK database with MongoDB Atlas, remove all mock data, and create comprehensive seed data with 5 users, 5 vendors, 5 wedding planners, and 5 admins with full relational data.

---

## **🔧 Step 1: Environment Configuration**

### **Required Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk

# Redis Cache (Optional but recommended)
REDIS_URL=rediss://username:password@host:port

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary (for image uploads)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Email Service (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@weddinglk.com
```

### **MongoDB Atlas Setup**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free account
   - Create a new cluster (M0 Sandbox is free)

2. **Configure Database Access**
   - Go to "Database Access"
   - Create a new database user
   - Set username and password
   - Grant "Read and write to any database" permissions

3. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (for development)
   - Or add your specific IP address

4. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `weddinglk`

---

## **🧹 Step 2: Database Cleanup**

### **Remove Mock Data**

The following files contain mock data that will be replaced:

- `lib/seed-data.ts` - Contains sample vendor/venue data
- `app/checkout/page.tsx` - Contains mock checkout items
- `app/dashboard/user/budget/page.tsx` - Contains mock budget data
- Various dashboard pages with mock data

### **Update Database Connection**

The database connection is already configured for MongoDB Atlas in `lib/db.ts`. No changes needed.

---

## **🌱 Step 3: Create Comprehensive Seed Data**

### **Option 1: Using the Admin Interface**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the admin page:**
   ```
   http://localhost:3000/admin/reset-database
   ```

3. **Enter admin key:** `weddinglk-admin-2024`

4. **Click "Reset Database & Create Seed Data"**

### **Option 2: Using API Endpoint**

```bash
curl -X POST "http://localhost:3000/api/admin/reset-database?adminKey=weddinglk-admin-2024"
```

### **Option 3: Using Node.js Script**

```bash
node -e "
const { resetAndSeedDatabase } = require('./lib/database-cleanup-and-seed.ts');
resetAndSeedDatabase().then(() => console.log('Done')).catch(console.error);
"
```

---

## **📊 Step 4: Verify Seed Data**

### **What Will Be Created**

#### **👥 Users (5 Regular Users)**
1. **John Doe** (Colombo) - Traditional wedding, 150 guests, LKR 2M budget
2. **Jane Smith** (Kandy) - Modern wedding, 100 guests, LKR 1.5M budget
3. **Mike Wilson** (Galle) - Beach wedding, 200 guests, LKR 3M budget
4. **Sarah Brown** (Negombo) - Rustic wedding, 120 guests, LKR 1.8M budget
5. **David Jones** (Anuradhapura) - Cultural wedding, 80 guests, LKR 1.2M budget

#### **🏢 Vendors (5 Service Providers)**
1. **Elegant Events by Sarah** (Event Planning) - Colombo
2. **Royal Photography Studio** (Photography) - Kandy
3. **Garden Fresh Catering** (Catering) - Galle
4. **Bloom & Blossom Florist** (Floral Design) - Negombo
5. **Melody Music Ensemble** (Music & Entertainment) - Anuradhapura

#### **📋 Wedding Planners (5 Professional Planners)**
1. **Dream Weddings by Emma** (Luxury Weddings) - Colombo
2. **Perfect Day Events** (Intimate Weddings) - Kandy
3. **Bliss Events & Planning** (Beach Weddings) - Galle
4. **Elegance Planning Studio** (High-end Events) - Negombo
5. **Harmony Events & Design** (Cultural Weddings) - Anuradhapura

#### **👨‍💼 Admins (5 System Administrators)**
1. **System Administrator** (Full permissions)
2. **Support Admin** (Support & moderation)
3. **Content Moderator** (Content management)
4. **Finance Admin** (Finance & payments)
5. **Analytics Admin** (Analytics & reports)

---

## **🔗 Step 5: Related Data Created**

### **For Each User Type, the following data is created:**

#### **Users (Couples)**
- ✅ User profile with preferences
- ✅ Wedding tasks and planning items
- ✅ Guest list management
- ✅ Budget planning data
- ✅ Favorites and wishlists
- ✅ Social posts and interactions
- ✅ Notifications and messages

#### **Vendors**
- ✅ Business profiles and services
- ✅ Service packages and pricing
- ✅ Availability schedules
- ✅ Reviews and ratings
- ✅ Boost packages and promotions
- ✅ Meta Ads campaigns
- ✅ Subscription plans

#### **Wedding Planners**
- ✅ Professional profiles
- ✅ Client relationships
- ✅ Planning timelines
- ✅ Task management
- ✅ Vendor networks
- ✅ Portfolio and testimonials

#### **Admins**
- ✅ Admin profiles with permissions
- ✅ System notifications
- ✅ Analytics and reports
- ✅ Moderation tools
- ✅ Platform management

---

## **📈 Step 6: Database Collections Populated**

All **48 collections** will be populated with relevant data:

| Collection | Purpose | Sample Data |
|------------|---------|-------------|
| `users` | User accounts | 20 users (5 each type) |
| `vendors` | Vendor profiles | 5 vendor businesses |
| `venues` | Wedding venues | 5 venues across Sri Lanka |
| `bookings` | Booking records | 5 confirmed bookings |
| `payments` | Payment transactions | 5 payment records |
| `reviews` | Customer reviews | 5 reviews with ratings |
| `posts` | Social media posts | 20 posts from all users |
| `notifications` | User notifications | 20 welcome notifications |
| `tasks` | Planning tasks | 10 wedding planning tasks |
| `subscriptions` | User subscriptions | 10 active subscriptions |

---

## **🚀 Step 7: Testing the Setup**

### **Test Database Connection**

1. **Check environment variables:**
   ```
   http://localhost:3000/api/env-test
   ```

2. **Test database connection:**
   ```
   http://localhost:3000/api/db-test
   ```

3. **Check health status:**
   ```
   http://localhost:3000/api/health
   ```

### **Test User Authentication**

1. **Register a new user:**
   ```
   http://localhost:3000/register
   ```

2. **Login with existing users:**
   - Email: `john.doe@email.com`
   - Password: `password123`

3. **Test different user roles:**
   - Vendor: `elegant.events@vendor.com` / `vendor123`
   - Planner: `dream.weddings@planner.com` / `planner123`
   - Admin: `admin@weddinglk.com` / `admin123`

---

## **🔧 Step 8: Production Deployment**

### **Vercel Deployment**

1. **Set environment variables in Vercel:**
   ```bash
   vercel env add MONGODB_URI production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   # ... add all other environment variables
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Run database seeding in production:**
   ```bash
   curl -X POST "https://your-domain.vercel.app/api/admin/reset-database?adminKey=weddinglk-admin-2024"
   ```

---

## **📋 Step 9: Verification Checklist**

### **✅ Database Setup**
- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured
- [ ] Connection string added to environment variables

### **✅ Seed Data Creation**
- [ ] Database cleared successfully
- [ ] 5 users created with profiles
- [ ] 5 vendors created with services
- [ ] 5 wedding planners created
- [ ] 5 admins created
- [ ] Related data populated in all collections

### **✅ Testing**
- [ ] Database connection working
- [ ] User authentication working
- [ ] All user roles accessible
- [ ] API endpoints responding
- [ ] Social features working

---

## **🎉 Success!**

Your WeddingLK database is now fully set up with:

- ✅ **MongoDB Atlas** connection
- ✅ **48 collections** populated
- ✅ **20 users** with different roles
- ✅ **Comprehensive relational data**
- ✅ **Production-ready** configuration

The platform is ready for development, testing, and production deployment! 🚀

---

## **🆘 Troubleshooting**

### **Common Issues**

1. **Connection Error:**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Ensure database user has proper permissions

2. **Seed Data Not Created:**
   - Check admin key is correct
   - Verify environment variables
   - Check console for error messages

3. **Authentication Issues:**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure all required environment variables are set

### **Support**

If you encounter any issues, check the console logs and ensure all environment variables are properly configured.
