#!/bin/bash

# Wedding Platform Setup Commands for VS Code
echo "🎉 Setting up Wedding Dreams Lanka Platform..."

# 1. Create project directory (if not already created)
mkdir wedding-platform
cd wedding-platform

# 2. Initialize Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. Install required dependencies
echo "📦 Installing dependencies..."

# Core dependencies
npm install next@latest react@latest react-dom@latest typescript@latest

# UI Components (shadcn/ui)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar
npm install @radix-ui/react-button @radix-ui/react-calendar @radix-ui/react-card
npm install @radix-ui/react-checkbox @radix-ui/react-command @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover
npm install @radix-ui/react-progress @radix-ui/react-select @radix-ui/react-sheet
npm install @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-tooltip

# Styling
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install tailwind-merge clsx class-variance-authority
npm install tailwindcss-animate

# Icons
npm install lucide-react

# Authentication
npm install next-auth@beta bcryptjs
npm install @types/bcryptjs

# Database
npm install mongoose mongodb

# Forms and Validation
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# Animations
npm install framer-motion

# Development dependencies
npm install --save-dev @types/node @types/react @types/react-dom eslint eslint-config-next

echo "✅ Dependencies installed successfully!"
