#!/bin/bash
set -e

echo "Starting frontend build for Render deployment..."

# Navigate to frontend directory
cd grocery-erp-frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm ci --only=production

# Build the application with production environment
echo "Building React application..."
REACT_APP_API_URL=$REACT_APP_API_URL npm run build

# Verify build directory exists
if [ -d "build" ]; then
    echo "Build directory created successfully"
    echo "Build contents:"
    ls build/
else
    echo "ERROR: Build directory not found!"
    exit 1
fi

echo "Frontend build completed successfully!"