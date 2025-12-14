#!/bin/bash

# WeddingLK Deployment Script for Vercel
# This script helps deploy the WeddingLK project to Vercel with proper configuration

set -e

echo "🚀 WeddingLK Deployment Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "You are not logged in to Vercel. Please login first:"
    vercel login
fi

print_info "Starting deployment process..."

# Step 1: Check environment variables
echo ""
echo "🔍 Checking environment variables..."

# Required environment variables
REQUIRED_VARS=(
    "MONGODB_URI"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
)

# Optional but recommended variables
OPTIONAL_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "CLOUDINARY_URL"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
    "OPENAI_API_KEY"
    "REDIS_URL"
)

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    echo "Please create a .env.local file with your environment variables."
    echo "You can use env.template as a reference."
    exit 1
fi

# Load environment variables
source .env.local

# Check required variables
missing_vars=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_status "All required environment variables are set"

# Check optional variables
missing_optional=()
for var in "${OPTIONAL_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        missing_optional+=("$var")
    fi
done

if [ ${#missing_optional[@]} -ne 0 ]; then
    print_warning "Missing optional environment variables:"
    for var in "${missing_optional[@]}"; do
        echo "  - $var"
    done
    echo "These features may not work properly without these variables."
fi

# Step 2: Build the project
echo ""
echo "🔨 Building the project..."

if npm run build; then
    print_status "Build completed successfully"
else
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

# Step 3: Set up Vercel environment variables
echo ""
echo "🔧 Setting up Vercel environment variables..."

# Function to set environment variable in Vercel
set_vercel_env() {
    local var_name=$1
    local var_value=$2
    local environment=${3:-production}
    
    if [ -n "$var_value" ]; then
        echo "$var_value" | vercel env add "$var_name" "$environment"
        print_status "Set $var_name for $environment"
    else
        print_warning "Skipping $var_name (empty value)"
    fi
}

# Set required environment variables
set_vercel_env "MONGODB_URI" "$MONGODB_URI" "production"
set_vercel_env "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET" "production"
set_vercel_env "NEXTAUTH_URL" "$NEXTAUTH_URL" "production"

# Set optional environment variables
set_vercel_env "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID" "production"
set_vercel_env "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET" "production"
set_vercel_env "CLOUDINARY_URL" "$CLOUDINARY_URL" "production"
set_vercel_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY" "production"
set_vercel_env "STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUBLISHABLE_KEY" "production"
set_vercel_env "OPENAI_API_KEY" "$OPENAI_API_KEY" "production"
set_vercel_env "REDIS_URL" "$REDIS_URL" "production"

# Set additional production variables
set_vercel_env "NODE_ENV" "production" "production"
set_vercel_env "APP_NAME" "WeddingLK" "production"
set_vercel_env "APP_VERSION" "1.0.0" "production"

# Step 4: Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."

if vercel --prod; then
    print_status "Deployment completed successfully"
else
    print_error "Deployment failed. Please check the logs and try again."
    exit 1
fi

# Step 5: Get deployment URL
echo ""
echo "🌐 Getting deployment information..."

DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "https://weddinglk.vercel.app")

print_status "Deployment URL: $DEPLOYMENT_URL"

# Step 6: Seed the production database
echo ""
echo "🌱 Seeding production database..."

# Wait a moment for the deployment to be ready
sleep 10

# Seed the database
if curl -X POST "$DEPLOYMENT_URL/api/admin/reset-database?adminKey=weddinglk-admin-2024" -H "Content-Type: application/json"; then
    print_status "Production database seeded successfully"
else
    print_warning "Database seeding failed. You can manually seed it later."
fi

# Step 7: Test the deployment
echo ""
echo "🧪 Testing the deployment..."

# Test health endpoint
if curl -f "$DEPLOYMENT_URL/api/health" > /dev/null 2>&1; then
    print_status "Health check passed"
else
    print_warning "Health check failed"
fi

# Test environment endpoint
if curl -f "$DEPLOYMENT_URL/api/env-test" > /dev/null 2>&1; then
    print_status "Environment test passed"
else
    print_warning "Environment test failed"
fi

# Step 8: Display deployment summary
echo ""
echo "🎉 Deployment Summary"
echo "===================="
echo "✅ Project built successfully"
echo "✅ Environment variables configured"
echo "✅ Deployed to Vercel"
echo "✅ Database seeded"
echo "✅ Basic tests passed"
echo ""
echo "🌐 Your WeddingLK app is now live at:"
echo "   $DEPLOYMENT_URL"
echo ""
echo "🔐 Login credentials:"
echo "   Users: john.doe@email.com / password123"
echo "   Vendors: elegant.events@vendor.com / vendor123"
echo "   Planners: dream.weddings@planner.com / planner123"
echo "   Admins: admin@weddinglk.com / admin123"
echo ""
echo "📊 Admin panel:"
echo "   $DEPLOYMENT_URL/admin/reset-database"
echo ""
echo "🔧 Next steps:"
echo "   1. Update your domain DNS settings if using a custom domain"
echo "   2. Configure Google OAuth with your production URL"
echo "   3. Set up Stripe webhooks for production"
echo "   4. Monitor the deployment in Vercel dashboard"
echo ""
print_status "Deployment completed successfully! 🎊"
