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

echo "✅ Frontend build completed!"
echo "📊 Build directory contents:"
ls -la build/