#!/bin/bash

# Render Frontend Build Script
echo "Starting frontend build for Render deployment..."

# Debug: Check current directory and structure
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la
echo "Looking for frontend directory..."
find . -name "grocery-erp-frontend" -type d

# Navigate to frontend directory
cd grocery-erp-frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the application
echo "Building React application..."
npm run build

# Verify build directory exists
echo "Verifying build directory..."
ls -la build/

echo "Frontend build completed successfully!"