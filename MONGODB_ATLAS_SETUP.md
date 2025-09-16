# MongoDB Atlas Production Setup Guide

## 🗄️ Setting Up MongoDB Atlas for WeddingLK Production

### Step 1: Create MongoDB Atlas Account
1. Go to https://cloud.mongodb.com/
2. Sign up or log in to your account
3. Create a new project or use existing

### Step 2: Create Production Cluster
1. Click "Create" → "Cluster"
2. Choose "Shared Clusters" (Free tier available)
3. Select "AWS" as cloud provider
4. Choose region closest to your users (e.g., Asia Pacific)
5. Name your cluster: `weddinglk-prod`
6. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `weddinglk`
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Add comment: "Vercel deployment access"
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Replace `<dbname>` with `weddinglk-prod`

### Step 6: Update Vercel Environment Variables
1. Go to https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables
2. Add new environment variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://weddinglk:YOUR_PASSWORD@weddinglk-prod.xxxxx.mongodb.net/weddinglk-prod?retryWrites=true&w=majority`
   - Environment: Production

### Step 7: Test Connection
After setting up the environment variable:
1. Redeploy your application: `vercel --prod`
2. Test the health endpoint: `https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/simple-health`

## 🔧 Example Connection String Format

```
mongodb+srv://weddinglk:your_password_here@weddinglk-prod.xxxxx.mongodb.net/weddinglk-prod?retryWrites=true&w=majority
```

## 📊 Database Collections That Will Be Created

Once connected, the following collections will be automatically created:

### Core Collections:
- `users` - User accounts and profiles
- `vendors` - Vendor profiles and information
- `venues` - Wedding venues
- `bookings` - Booking records
- `payments` - Payment transactions
- `reviews` - User reviews and ratings

### Extended Collections:
- `messages` - User messaging
- `notifications` - System notifications
- `favorites` - User favorites
- `packages` - Wedding packages
- `services` - Vendor services
- `availability` - Vendor availability
- `tasks` - Planning tasks
- `documents` - File uploads
- `posts` - Social media posts
- `stories` - User stories
- `reels` - Video content

### And 30+ more collections for comprehensive functionality

## 🚨 Important Security Notes

1. **Never commit passwords** to version control
2. **Use strong passwords** for database users
3. **Regularly rotate** database passwords
4. **Monitor access logs** in MongoDB Atlas
5. **Set up alerts** for unusual activity

## 🎯 Next Steps After MongoDB Setup

1. ✅ MongoDB Atlas configured
2. ⏳ Set up Stripe for payments
3. ⏳ Configure Google OAuth
4. ⏳ Set up Redis caching
5. ⏳ Configure email service
6. ⏳ Test all features
7. ⏳ Populate sample data

## 🔗 Useful Links

- [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
- [Vercel Environment Variables](https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables)
- [Production Health Check](https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/simple-health)

## 📞 Support

If you encounter issues:
1. Check MongoDB Atlas connection logs
2. Verify environment variables in Vercel
3. Test connection string format
4. Ensure IP whitelist includes 0.0.0.0/0
