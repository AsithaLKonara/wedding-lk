#!/bin/bash

# Vercel Setup Script for WeddingLK
# This script helps set up a stable Vercel deployment with proper environment variables

echo "🚀 Setting up Vercel for WeddingLK..."
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully"
else
    echo "✅ Vercel CLI is already installed"
fi

# Login to Vercel
echo ""
echo "🔐 Logging into Vercel..."
vercel login

# Link the project
echo ""
echo "🔗 Linking project to Vercel..."
vercel link

# Set up environment variables
echo ""
echo "🔧 Setting up environment variables..."

# Core application variables
vercel env add NODE_ENV production
vercel env add NEXTAUTH_SECRET "uySZNrT47dnlxKvccTLtkUqoQ+TqNdCDDcbGANmt2Yk="
vercel env add JWT_SECRET "aa809ecf0459083f1ff94b3a814217a9f3a7ce986f766dc4ba79fab9bf4e89ad"

# OAuth Providers
vercel env add GOOGLE_CLIENT_ID "your-google-client-id"
vercel env add GOOGLE_CLIENT_SECRET "your-google-client-secret"
vercel env add FACEBOOK_CLIENT_ID "1933059507642871"
vercel env add FACEBOOK_CLIENT_SECRET "fe3c478f108ecea4cfcbdd02b0d70200"

# AI Services
vercel env add OPENAI_API_KEY "your-openai-api-key"

# Database
vercel env add MONGODB_URI "your-mongodb-uri"

# Redis
vercel env add REDIS_URL "your-redis-url"

# Stripe
vercel env add STRIPE_PUBLISHABLE_KEY "your-stripe-publishable-key"
vercel env add STRIPE_SECRET_KEY "your-stripe-secret-key"
vercel env add STRIPE_WEBHOOK_SECRET "your-stripe-webhook-secret"

# PayHere
vercel env add PAYHERE_MERCHANT_ID "your-payhere-merchant-id"
vercel env add PAYHERE_SECRET_KEY "your-payhere-secret-key"
vercel env add PAYHERE_SANDBOX_MODE "true"

# Cloudinary
vercel env add CLOUDINARY_CLOUD_NAME "dl2h9t0le"
vercel env add CLOUDINARY_API_KEY "136527429911654"
vercel env add CLOUDINARY_API_SECRET "rLy6xSu_3pXaB0GFgHUH3oRCXM8"
vercel env add CLOUDINARY_URL "cloudinary://136527429911654:rLy6xSu_3pXaB0GFgHUH3oRCXM8@dl2h9t0le"

# Email Service
vercel env add SMTP_HOST "smtp.gmail.com"
vercel env add SMTP_PORT "587"
vercel env add SMTP_USER "asithalakmalkonara11992081@gmail.com"
vercel env add SMTP_PASS "xddgtmbfxkgzkrun"
vercel env add SMTP_FROM "WeddingLK <noreply@weddinglk.com>"

# Security & Performance
vercel env add RATE_LIMIT_WINDOW_MS "900000"
vercel env add RATE_LIMIT_MAX_REQUESTS "100"
vercel env add REDIS_CACHE_TTL "3600"
vercel env add MONGODB_POOL_SIZE "5"
vercel env add MONGODB_SERVER_SELECTION_TIMEOUT_MS "5000"
vercel env add MONGODB_SOCKET_TIMEOUT_MS "45000"

# Monitoring
vercel env add ENABLE_HEALTH_CHECKS "true"
vercel env add ENABLE_PERFORMANCE_MONITORING "true"
vercel env add LOG_LEVEL "info"
vercel env add SKIP_AUTH "false"
vercel env add SKIP_HEALTH_CHECKS "false"

# Push Notifications
vercel env add NEXT_PUBLIC_VAPID_KEY "BFjaDuXTFcCL6KX2MG58DG_3-ljjVEO7idN1-BDZ4YDRyCCOqEqXS7qWK5QRB4L5Ul1bx9Ng6mB6clI09_O4PAI"
vercel env add VAPID_PRIVATE_KEY "JRv7FZyA3XufMMCsd6GH7yMqEjo232zzdBDxcFuEqJ0"

# Feature Flags
vercel env add ENABLE_AI_FEATURES "true"
vercel env add ENABLE_PAYMENTS "true"
vercel env add ENABLE_SMS "false"
vercel env add ENABLE_EMAIL "true"

echo ""
echo "✅ Environment variables set up successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Get your stable Vercel URL: vercel --prod"
echo "2. Update OAuth providers with the stable URL"
echo "3. Set up custom domain (optional but recommended)"
echo "4. Deploy: vercel --prod"
