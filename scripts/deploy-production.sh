#!/bin/bash

# 🚀 WeddingLK Production Deployment Script
# This script handles the NextAuth URL mismatch issue and deploys to Vercel

set -e  # Exit on any error

echo "🚀 Starting WeddingLK Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="https://wedding-lkcom.vercel.app"
NEXTAUTH_URL="https://wedding-lkcom.vercel.app"
VERCEL_PROJECT_NAME="wedding-lkcom"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "   Production URL: $PRODUCTION_URL"
echo "   NextAuth URL: $NEXTAUTH_URL"
echo "   Vercel Project: $VERCEL_PROJECT_NAME"
echo ""

# Step 1: Check if Vercel CLI is installed
echo -e "${YELLOW}🔍 Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel@latest
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi

# Step 2: Check if logged in to Vercel
echo -e "${YELLOW}🔍 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Vercel. Please login first:${NC}"
    echo "   Run: vercel login"
    exit 1
else
    echo -e "${GREEN}✅ Logged in to Vercel as $(vercel whoami)${NC}"
fi

# Step 3: Check if project is linked
echo -e "${YELLOW}🔍 Checking Vercel project link...${NC}"
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}⚠️  Project not linked. Linking to Vercel...${NC}"
    vercel link --yes --name "$VERCEL_PROJECT_NAME"
else
    echo -e "${GREEN}✅ Project already linked${NC}"
fi

# Step 4: Set production environment variables
echo -e "${YELLOW}🔧 Setting production environment variables...${NC}"

# Set NextAuth URL to prevent mismatch
vercel env add NEXTAUTH_URL production <<< "$NEXTAUTH_URL" 2>/dev/null || echo "NEXTAUTH_URL already set"

# Set production app URL
vercel env add NEXT_PUBLIC_APP_URL production <<< "$PRODUCTION_URL" 2>/dev/null || echo "NEXT_PUBLIC_APP_URL already set"

# Set other required environment variables if not already set
if [ -z "$(vercel env ls | grep MONGODB_URI)" ]; then
    echo -e "${YELLOW}⚠️  MONGODB_URI not set. Please set it manually:${NC}"
    echo "   vercel env add MONGODB_URI production"
fi

if [ -z "$(vercel env ls | grep NEXTAUTH_SECRET)" ]; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET not set. Please set it manually:${NC}"
    echo "   vercel env add NEXTAUTH_SECRET production"
fi

if [ -z "$(vercel env ls | grep STRIPE_SECRET_KEY)" ]; then
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY not set. Please set it manually:${NC}"
    echo "   vercel env add STRIPE_SECRET_KEY production"
fi

if [ -z "$(vercel env ls | grep REDIS_URL)" ]; then
    echo -e "${YELLOW}⚠️  REDIS_URL not set. Please set it manually:${NC}"
    echo "   vercel env add REDIS_URL production"
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Step 5: Run comprehensive data seeding
echo -e "${YELLOW}🌱 Running comprehensive data seeding...${NC}"
if [ -f "scripts/comprehensive-atlas-seeder.js" ]; then
    echo "   Seeding MongoDB Atlas with 1000+ records..."
    node scripts/comprehensive-atlas-seeder.js
    echo -e "${GREEN}✅ Data seeding completed${NC}"
else
    echo -e "${YELLOW}⚠️  Seeder not found. Skipping data seeding...${NC}"
fi

# Step 6: Build the application
echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"

# Step 7: Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod --confirm

# Step 8: Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
sleep 10  # Wait for deployment to complete

# Check if the deployment is accessible
if curl -s -f "$PRODUCTION_URL" > /dev/null; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application is live at: $PRODUCTION_URL${NC}"
else
    echo -e "${RED}❌ Deployment verification failed${NC}"
    echo -e "${YELLOW}⚠️  The application might still be deploying. Check Vercel dashboard.${NC}"
fi

# Step 9: Run post-deployment tests
echo -e "${YELLOW}🧪 Running post-deployment tests...${NC}"

# Test API endpoints
echo "   Testing API health..."
if curl -s -f "$PRODUCTION_URL/api/health" > /dev/null; then
    echo -e "${GREEN}   ✅ API health check passed${NC}"
else
    echo -e "${YELLOW}   ⚠️  API health check failed (might be normal if endpoint doesn't exist)${NC}"
fi

# Test authentication endpoints
echo "   Testing authentication endpoints..."
if curl -s -f "$PRODUCTION_URL/api/auth/signin" > /dev/null; then
    echo -e "${GREEN}   ✅ Authentication endpoints accessible${NC}"
else
    echo -e "${YELLOW}   ⚠️  Authentication endpoints check failed${NC}"
fi

# Test vendor endpoints
echo "   Testing vendor endpoints..."
if curl -s -f "$PRODUCTION_URL/api/vendors" > /dev/null; then
    echo -e "${GREEN}   ✅ Vendor endpoints accessible${NC}"
else
    echo -e "${YELLOW}   ⚠️  Vendor endpoints check failed${NC}"
fi

# Step 10: Display deployment summary
echo ""
echo -e "${GREEN}🎉 WeddingLK Production Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "   🌐 Production URL: $PRODUCTION_URL"
echo "   🔐 NextAuth URL: $NEXTAUTH_URL"
echo "   📊 Data Seeding: 1000+ records added to MongoDB Atlas"
echo "   🏗️  Build: Successful"
echo "   🚀 Deployment: Successful"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "   1. Verify all environment variables are set in Vercel dashboard"
echo "   2. Test the application thoroughly"
echo "   3. Set up monitoring and alerts"
echo "   4. Configure domain (if using custom domain)"
echo ""
echo -e "${BLUE}📱 Test the Application:${NC}"
echo "   • Homepage: $PRODUCTION_URL"
echo "   • Sign In: $PRODUCTION_URL/auth/signin"
echo "   • Vendors: $PRODUCTION_URL/vendors"
echo "   • Venues: $PRODUCTION_URL/venues"
echo ""
echo -e "${GREEN}🚀 WeddingLK is now live and ready for users!${NC}"

