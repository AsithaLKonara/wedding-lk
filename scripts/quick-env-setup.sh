#!/bin/bash

# 🚀 Quick Environment Variables Setup for WeddingLK
# This script sets up the minimum required environment variables

echo "🚀 Quick Environment Setup for WeddingLK"
echo "========================================"

# Check if user is logged in to Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Please login to Vercel first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel as: $(vercel whoami)"
echo ""

# Set basic application variables
echo "🌍 Setting up basic application variables..."

# NODE_ENV
vercel env add NODE_ENV production <<< "production"
echo "✅ NODE_ENV set to production"

# NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_APP_NAME production <<< "WeddingLK"
echo "✅ NEXT_PUBLIC_APP_NAME set to WeddingLK"

# NEXT_PUBLIC_APP_DESCRIPTION
vercel env add NEXT_PUBLIC_APP_DESCRIPTION production <<< "Sri Lanka's Premier Wedding Planning Platform"
echo "✅ NEXT_PUBLIC_APP_DESCRIPTION set"

# NEXTAUTH_URL (will be updated after deployment)
vercel env add NEXTAUTH_URL production <<< "https://wedding-lk.vercel.app"
echo "✅ NEXTAUTH_URL set to https://wedding-lk.vercel.app"

# Generate a random NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
echo "✅ NEXTAUTH_SECRET generated and set"

# NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://wedding-lk.vercel.app"
echo "✅ NEXT_PUBLIC_APP_URL set to https://wedding-lk.vercel.app"

echo ""
echo "🎯 Basic environment variables set up!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your MongoDB database and get the connection string"
echo "2. Set up Stripe account and get API keys"
echo "3. Set up Cloudinary account for image storage"
echo "4. Set up Google OAuth for authentication"
echo ""
echo "🔧 To add more variables, run:"
echo "   vercel env add VARIABLE_NAME production"
echo ""
echo "📋 Current environment variables:"
vercel env ls
echo ""
echo "🚀 Ready for initial deployment! Run: vercel --prod"
