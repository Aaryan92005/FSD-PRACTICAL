#!/bin/bash

# Render Backend Build Script
set -e

echo "🔨 Building Grocery ERP Backend for Render..."

# Navigate to backend directory
cd grocery-erp-backend

# Install production dependencies only
echo "📦 Installing production dependencies..."
npm ci --only=production --silent

# Verify installation
echo "✅ Dependencies installed successfully"
echo "📊 Installed packages:"
npm list --depth=0 --only=production

echo "🎉 Backend build completed!"