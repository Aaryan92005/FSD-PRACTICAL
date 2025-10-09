#!/bin/bash

# Grocery ERP Build Script for Render
set -e

echo "🔨 Starting Grocery ERP Build Process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Determine which service to build based on directory or environment
if [ "$RENDER_SERVICE_TYPE" = "web" ] && [ -f "grocery-erp-backend/package.json" ]; then
    print_status "Building backend service..."
    cd grocery-erp-backend
    
    # Install production dependencies
    print_status "Installing backend dependencies..."
    npm ci --only=production
    
    # Run any build steps if needed
    if npm run | grep -q "build"; then
        print_status "Running backend build..."
        npm run build
    fi
    
    print_status "Backend build completed ✓"
    
elif [ "$RENDER_SERVICE_TYPE" = "static" ] && [ -f "grocery-erp-frontend/package.json" ]; then
    print_status "Building frontend service..."
    cd grocery-erp-frontend
    
    # Install all dependencies (including dev dependencies for build)
    print_status "Installing frontend dependencies..."
    npm ci
    
    # Build the React app
    print_status "Building React application..."
    npm run build
    
    print_status "Frontend build completed ✓"
    print_status "Build output available in: grocery-erp-frontend/build"
    
else
    print_warning "Could not determine service type or package.json not found"
    print_status "Available directories:"
    ls -la
    
    # Fallback: try to build both if they exist
    if [ -d "grocery-erp-backend" ]; then
        print_status "Building backend as fallback..."
        cd grocery-erp-backend && npm ci --only=production && cd ..
    fi
    
    if [ -d "grocery-erp-frontend" ]; then
        print_status "Building frontend as fallback..."
        cd grocery-erp-frontend && npm ci && npm run build && cd ..
    fi
fi

print_status "🎉 Build process completed!"