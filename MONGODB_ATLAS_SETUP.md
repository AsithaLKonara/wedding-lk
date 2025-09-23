# MongoDB Atlas Setup Guide

Since you're on macOS 12 and having compatibility issues with local MongoDB installation, here's how to set up MongoDB Atlas (cloud database):

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the "Free" plan (M0 tier)

## Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"

## Step 3: Set Up Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Set Up Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<database-name>` with your desired database name (e.g., "weddinglk")

## Step 6: Update Your Project

1. Create a `.env.local` file in your project root
2. Add your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/weddinglk?retryWrites=true&w=majority
```

## Step 7: Test Connection

Run your development server:
```bash
npm run dev
```

## Step 8: Connect MongoDB Compass

1. Open MongoDB Compass
2. Paste your connection string
3. Click "Connect"

## Benefits of MongoDB Atlas:

- ✅ No installation issues
- ✅ Free tier (512MB storage)
- ✅ Automatic backups
- ✅ Accessible from anywhere
- ✅ Works with MongoDB Compass
- ✅ No local setup required
- ✅ Automatic scaling

## Troubleshooting:

If you get connection errors:
1. Check your IP is whitelisted in Network Access
2. Verify username/password in connection string
3. Make sure database name is correct
4. Check if your cluster is running

## Next Steps:

Once connected, your application will automatically create the necessary collections when you register users or add data. 