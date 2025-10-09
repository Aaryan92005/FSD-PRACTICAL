#!/bin/bash

# Render Frontend Build Script
echo "Starting frontend build for Render deployment..."

# Install and build frontend
echo "Installing frontend dependencies..."
npm install --prefix grocery-erp-frontend

echo "Building React application..."
npm run build --prefix grocery-erp-frontend

# Verify build directory exists
echo "Verifying build directory..."
ls -la grocery-erp-frontend/build/

echo "Frontend build completed successfully!"