#!/bin/bash

# Quick Deployment Script for WeddingLK to Vercel
# This script handles immediate deployment with proper URL configuration

set -e

echo "🚀 Quick Deploy: WeddingLK to Vercel"
echo "====================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

# Set the correct NEXTAUTH_URL for Vercel
export NEXTAUTH_URL="https://wedding-lkcom.vercel.app"
print_status "Set NEXTAUTH_URL to: $NEXTAUTH_URL"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run quick checks
print_status "Running type check..."
npm run type-check

print_status "Running lint check..."
npm run lint

# Build the application
print_status "Building application..."
npm run build

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."

if [ "$1" = "--prod" ]; then
    print_status "Deploying to PRODUCTION..."
    vercel --prod --confirm
    DEPLOY_URL="https://wedding-lkcom.vercel.app"
else
    print_status "Deploying to PREVIEW..."
    vercel --confirm
    # Get the preview URL
    DEPLOY_URL=$(vercel ls --json | jq -r '.[0].url' | head -1)
fi

print_success "Deployment completed!"
print_success "URL: $DEPLOY_URL"

# Quick health check
print_status "Running quick health check..."
sleep 10

if curl -f "$DEPLOY_URL/api/health" > /dev/null 2>&1; then
    print_success "✅ Health check passed!"
else
    print_warning "⚠️ Health check failed, but deployment may still be processing..."
fi

echo ""
echo "🎉 Deployment Summary:"
echo "======================"
echo "URL: $DEPLOY_URL"
echo "Environment: ${1:-preview}"
echo "Time: $(date)"
echo ""

if [ "$1" = "--prod" ]; then
    echo "🔧 Next Steps:"
    echo "=============="
    echo "1. Visit: https://wedding-lkcom.vercel.app"
    echo "2. Test authentication"
    echo "3. Check admin dashboard"
    echo "4. Verify all features work"
    echo ""
    echo "📊 Monitor:"
    echo "==========="
    echo "• Vercel Dashboard: https://vercel.com/dashboard"
    echo "• Logs: vercel logs $DEPLOY_URL"
    echo "• Analytics: Check Vercel Analytics"
else
    echo "🔧 Next Steps:"
    echo "=============="
    echo "1. Test the preview: $DEPLOY_URL"
    echo "2. If everything works, deploy to production:"
    echo "   ./scripts/quick-deploy.sh --prod"
fi

print_success "Quick deployment completed! 🚀"

