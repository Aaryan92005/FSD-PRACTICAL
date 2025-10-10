#!/bin/bash

# Vercel Frontend Deployment Script
echo "🚀 Deploying Grocery ERP Frontend to Vercel..."

# Check if we're in the right directory
if [ ! -d "grocery-erp-frontend" ]; then
    echo "❌ Error: grocery-erp-frontend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to frontend directory
cd grocery-erp-frontend

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project locally to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Note your Vercel app URL from the output above"
echo "2. Update your Render backend FRONTEND_URL environment variable"
echo "3. Update REACT_APP_API_URL in Vercel dashboard if needed"
echo "4. Test your application!"
echo ""
echo "🔗 Useful links:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Render Dashboard: https://dashboard.render.com"