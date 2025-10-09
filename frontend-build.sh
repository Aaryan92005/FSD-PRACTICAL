#!/bin/bash
set -e

echo "🚀 Starting Frontend Build Process..."
echo "📁 Current directory: $(pwd)"

# Check if we're in the right place
if [ ! -d "grocery-erp-frontend" ]; then
    echo "❌ grocery-erp-frontend directory not found!"
    echo "📋 Available directories:"
    ls -la
    exit 1
fi

# Navigate to frontend directory
echo "📂 Entering frontend directory..."
cd grocery-erp-frontend

# Verify package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory!"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm ci --silent

echo "🏗️ Building React application..."
npm run build

# Verify build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not created!"
    exit 1
fi

echo "✅ Frontend build completed successfully!"
echo "📊 Build directory size:"
du -sh build/
echo "📋 Build contents:"
ls -la build/

echo "🎉 Frontend ready for deployment!"