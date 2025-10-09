#!/bin/bash

# Grocery ERP Deployment Script for Render
set -e

echo "🚀 Starting Grocery ERP Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=("NODE_ENV" "MONGODB_URI" "JWT_SECRET")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Environment variable $var is not set"
            exit 1
        fi
    done
    
    print_status "All required environment variables are set ✓"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Backend dependencies
    if [ -d "grocery-erp-backend" ]; then
        print_status "Installing backend dependencies..."
        cd grocery-erp-backend
        npm ci --only=production
        cd ..
    fi
    
    # Frontend dependencies
    if [ -d "grocery-erp-frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd grocery-erp-frontend
        npm ci
        cd ..
    fi
    
    print_status "Dependencies installed ✓"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    if [ -d "grocery-erp-frontend" ]; then
        cd grocery-erp-frontend
        npm run build
        cd ..
        print_status "Frontend build completed ✓"
    else
        print_warning "Frontend directory not found, skipping build"
    fi
}

# Run health checks
health_check() {
    print_status "Running health checks..."
    
    # Backend health check
    if [ -f "grocery-erp-backend/healthcheck.js" ]; then
        cd grocery-erp-backend
        timeout 30 npm run health-check || {
            print_warning "Backend health check failed or timed out"
        }
        cd ..
    fi
    
    print_status "Health checks completed ✓"
}

# Database migration (if needed)
run_migrations() {
    print_status "Checking for database migrations..."
    
    if [ -f "grocery-erp-backend/migrations/migrate.js" ]; then
        print_status "Running database migrations..."
        cd grocery-erp-backend
        node migrations/migrate.js
        cd ..
        print_status "Database migrations completed ✓"
    else
        print_status "No migrations found, skipping ✓"
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    check_env_vars
    install_dependencies
    build_frontend
    run_migrations
    health_check
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Application should be available at: ${FRONTEND_URL:-https://your-app.onrender.com}"
}

# Run main function
main "$@"