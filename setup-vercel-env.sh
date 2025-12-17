#!/bin/bash
# Script to help set up Vercel environment variables
# Note: This requires Vercel CLI to be installed and authenticated

echo "Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Install it with: npm i -g vercel"
    exit 1
fi

# Set MongoDB URI
vercel env add MONGODB_URI production <<< "mongodb+srv://asithalakmalkonara11992081:1234@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0"

# Set NextAuth Secret (generate a random one)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"

# Set NextAuth URL
vercel env add NEXTAUTH_URL production <<< "https://wedding-lk.vercel.app"

# Set Node Environment
vercel env add NODE_ENV production <<< "production"

echo "Environment variables set! Please verify in Vercel dashboard."
echo "After setting variables, redeploy your application."
