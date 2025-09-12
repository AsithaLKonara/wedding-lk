#!/bin/bash

# 🚀 Vercel Environment Variables Setup Script
# This script helps you set up all required environment variables for WeddingLK

echo "🚀 Setting up Vercel Environment Variables for WeddingLK"
echo "=================================================="

# Check if user is logged in to Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ Please login to Vercel first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel as: $(vercel whoami)"
echo ""

# Essential Environment Variables
echo "🔐 Setting up ESSENTIAL environment variables..."
echo ""

# MongoDB
echo "📊 MongoDB Configuration:"
read -p "Enter your MongoDB URI: " MONGODB_URI
vercel env add MONGODB_URI production <<< "$MONGODB_URI"

# NextAuth
echo ""
echo "🔑 NextAuth Configuration:"
read -p "Enter your Vercel app URL (e.g., https://weddinglk.vercel.app): " NEXTAUTH_URL
vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL"

read -p "Enter a strong secret (min 32 characters): " NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"

# Stripe
echo ""
echo "💳 Stripe Configuration:"
read -p "Enter your Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY
vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET_KEY"

read -p "Enter your Stripe Publishable Key (pk_test_...): " STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PUBLISHABLE_KEY"

# Cloudinary
echo ""
echo "☁️ Cloudinary Configuration:"
read -p "Enter your Cloudinary Cloud Name: " CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_CLOUD_NAME production <<< "$CLOUDINARY_CLOUD_NAME"

read -p "Enter your Cloudinary API Key: " CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_KEY production <<< "$CLOUDINARY_API_KEY"

read -p "Enter your Cloudinary API Secret: " CLOUDINARY_API_SECRET
vercel env add CLOUDINARY_API_SECRET production <<< "$CLOUDINARY_API_SECRET"

# Google OAuth
echo ""
echo "🌐 Google OAuth Configuration:"
read -p "Enter your Google Client ID: " GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_ID production <<< "$GOOGLE_CLIENT_ID"

read -p "Enter your Google Client Secret: " GOOGLE_CLIENT_SECRET
vercel env add GOOGLE_CLIENT_SECRET production <<< "$GOOGLE_CLIENT_SECRET"

# Optional: Redis
echo ""
echo "📊 Redis Configuration (Optional - press Enter to skip):"
read -p "Enter your Upstash Redis URL (or press Enter to skip): " UPSTASH_REDIS_REST_URL
if [ ! -z "$UPSTASH_REDIS_REST_URL" ]; then
    vercel env add UPSTASH_REDIS_REST_URL production <<< "$UPSTASH_REDIS_REST_URL"
    
    read -p "Enter your Upstash Redis Token: " UPSTASH_REDIS_REST_TOKEN
    vercel env add UPSTASH_REDIS_REST_TOKEN production <<< "$UPSTASH_REDIS_REST_TOKEN"
fi

# Application Settings
echo ""
echo "🌍 Application Settings:"
vercel env add NODE_ENV production <<< "production"
vercel env add NEXT_PUBLIC_APP_URL production <<< "$NEXTAUTH_URL"
vercel env add NEXT_PUBLIC_APP_NAME production <<< "WeddingLK"
vercel env add NEXT_PUBLIC_APP_DESCRIPTION production <<< "Sri Lanka's Premier Wedding Planning Platform"

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Summary of configured variables:"
vercel env ls
echo ""
echo "🚀 Ready to deploy! Run: vercel --prod"
echo ""
echo "🔍 To verify your setup, you can also run:"
echo "   vercel env pull .env.local"
echo "   npm run dev"
