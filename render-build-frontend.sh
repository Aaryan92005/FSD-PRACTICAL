#!/bin/bash

# Render Frontend Build Script
echo "Starting frontend build for Render deployment..."

# Navigate to frontend directory
cd grocery-erp-frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build the application
echo "Building React application..."
npm run build

echo "Frontend build completed successfully!"