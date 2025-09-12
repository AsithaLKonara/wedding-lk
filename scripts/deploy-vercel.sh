#!/bin/bash

# WeddingLK Vercel Deployment Script
# This script handles the deployment to Vercel with proper environment setup

set -e

echo "🚀 Starting WeddingLK deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing now..."
    npm install -g vercel@latest
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run type check
print_status "Running TypeScript type check..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Run tests
print_status "Running tests..."
npm run test:unit -- --ci --coverage

# Build the application
print_status "Building application..."
npm run build

# Check if Vercel is logged in
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

# Set environment variables for production
export NEXTAUTH_URL="https://wedding-lkcom.vercel.app"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
export MONGODB_URI="${MONGODB_URI}"
export REDIS_URL="${REDIS_URL}"
export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"
export STRIPE_PUBLISHABLE_KEY="${STRIPE_PUBLISHABLE_KEY}"
export CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}"
export CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}"
export CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}"
export OPENAI_API_KEY="${OPENAI_API_KEY}"

# Deploy to Vercel
print_status "Deploying to Vercel..."

if [ "$1" = "--prod" ]; then
    print_status "Deploying to production..."
    vercel --prod --confirm
    DEPLOY_URL="https://wedding-lkcom.vercel.app"
else
    print_status "Deploying to preview..."
    vercel --confirm
    DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' | head -1)
fi

print_success "Deployment completed!"
print_success "Deployment URL: $DEPLOY_URL"

# Run post-deployment tests
print_status "Running post-deployment tests..."

# Wait for deployment to be ready
sleep 30

# Test critical endpoints
print_status "Testing health endpoint..."
if curl -f "$DEPLOY_URL/api/health" > /dev/null 2>&1; then
    print_success "Health endpoint is working"
else
    print_error "Health endpoint failed"
    exit 1
fi

print_status "Testing vendors endpoint..."
if curl -f "$DEPLOY_URL/api/vendors" > /dev/null 2>&1; then
    print_success "Vendors endpoint is working"
else
    print_error "Vendors endpoint failed"
    exit 1
fi

print_status "Testing venues endpoint..."
if curl -f "$DEPLOY_URL/api/venues" > /dev/null 2>&1; then
    print_success "Venues endpoint is working"
else
    print_error "Venues endpoint failed"
    exit 1
fi

print_success "All post-deployment tests passed!"
print_success "🎉 WeddingLK is successfully deployed to $DEPLOY_URL"

# Display deployment information
echo ""
echo "📊 Deployment Summary:"
echo "======================"
echo "URL: $DEPLOY_URL"
echo "Environment: ${1:-preview}"
echo "Build Time: $(date)"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo ""

# Display next steps
echo "🔧 Next Steps:"
echo "=============="
echo "1. Verify the deployment at: $DEPLOY_URL"
echo "2. Check the admin dashboard: $DEPLOY_URL/dashboard"
echo "3. Test authentication: $DEPLOY_URL/auth/signin"
echo "4. Monitor logs: vercel logs $DEPLOY_URL"
echo ""

print_success "Deployment script completed successfully!"

