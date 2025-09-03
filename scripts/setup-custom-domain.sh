#!/bin/bash

# Custom Domain Setup Script for WeddingLK
# This script helps you set up a custom domain for stable URLs

echo "🌐 Setting up Custom Domain for WeddingLK..."
echo "============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo ""
echo "📋 Custom Domain Setup Options:"
echo "1. Use Vercel's free subdomain (recommended for testing)"
echo "2. Set up your own custom domain"
echo "3. Use Vercel's stable production URL"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up Vercel subdomain..."
        echo "This will give you a stable URL like: your-project-name.vercel.app"
        
        # Get current project info
        echo "Getting project information..."
        vercel ls
        
        echo ""
        echo "📝 To set up a stable subdomain:"
        echo "1. Go to your Vercel dashboard"
        echo "2. Select your project"
        echo "3. Go to Settings > Domains"
        echo "4. Add a custom domain or use the default stable URL"
        echo "5. The stable URL format is: [project-name].vercel.app"
        ;;
        
    2)
        echo ""
        echo "🌐 Setting up custom domain..."
        read -p "Enter your domain (e.g., weddinglk.com): " domain
        
        if [ -z "$domain" ]; then
            echo "❌ Domain cannot be empty"
            exit 1
        fi
        
        echo "Adding domain to Vercel..."
        vercel domains add $domain
        
        echo ""
        echo "📝 DNS Configuration needed:"
        echo "Add these DNS records to your domain provider:"
        echo "Type: A"
        echo "Name: @"
        echo "Value: 76.76.19.61"
        echo ""
        echo "Type: CNAME"
        echo "Name: www"
        echo "Value: cname.vercel-dns.com"
        echo ""
        echo "After DNS propagation (5-10 minutes), your domain will be active!"
        ;;
        
    3)
        echo ""
        echo "🔗 Using Vercel's stable production URL..."
        echo "Getting your stable production URL..."
        
        # Get the production URL
        vercel --prod --confirm
        
        echo ""
        echo "✅ Your stable production URL is now active!"
        echo "This URL will remain the same for your production deployments."
        ;;
        
    *)
        echo "❌ Invalid option. Please choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🔧 Next steps:"
echo "1. Update your OAuth provider settings with the new stable URL"
echo "2. Update your environment variables"
echo "3. Test authentication with the new URL"
echo "4. Deploy your changes: vercel --prod"
