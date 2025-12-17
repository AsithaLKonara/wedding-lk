# Vercel Environment Variables Setup

This document contains the environment variables that need to be set up in Vercel for the deployment at https://wedding-lk.vercel.app/

## Required Environment Variables

Set these in your Vercel project settings:

### Database
```
MONGODB_URI=mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0
```

### Authentication
```
NEXTAUTH_SECRET=<generate-a-secure-random-string>
NEXTAUTH_URL=https://wedding-lk.vercel.app
```

### Application
```
NODE_ENV=production
```

### Testing (if needed)
```
TEST_DB_URI=mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk_test?retryWrites=true&w=majority&appName=Cluster0
E2E_BASE_URL=https://wedding-lk.vercel.app
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable above
4. Make sure to set them for **Production**, **Preview**, and **Development** environments as needed
5. Redeploy your application after adding variables

## Security Note

⚠️ **Important**: The MongoDB connection string contains credentials. Make sure:
- It's only stored in Vercel environment variables (not in code)
- Access to Vercel project is restricted
- Consider using MongoDB Atlas IP whitelist for additional security

## Testing the Deployment

After setting up environment variables, run:
```bash
npm run test:e2e
```

This will test the deployment at https://wedding-lk.vercel.app/

