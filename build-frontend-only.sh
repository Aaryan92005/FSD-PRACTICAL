#!/bin/bash
set -e

echo "🔨 Building Frontend Only..."
echo "📁 Current directory: $(pwd)"
echo "📋 Directory contents:"
ls -la

# Navigate to frontend directory
echo "📂 Navigating to frontend directory..."
cd grocery-erp-frontend

echo "📦 Installing frontend dependencies..."
npm ci

echo "🏗️ Building React app..."
npm run build

echo "📁 Creating dist directory for Render..."
if [ -d "build" ]; then
    # Copy build to dist for Render compatibility
    cp -r build dist
    echo "✅ Created dist directory from build"
    ls -la dist/
else
    echo "❌ Build directory not found!"
    exit 1
fi

echo "✅ Frontend build completed!"
echo "📊 Build directory contents:"
ls -la build/
echo "📊 Dist directory contents:"
ls -la dist/