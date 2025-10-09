#!/bin/bash

# Grocery ERP Deployment Script
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs/backend
mkdir -p logs/frontend
mkdir -p mongodb-init

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true

# Remove old images (optional)
if [ "$1" = "--clean" ]; then
    print_warning "Cleaning up old images..."
    docker system prune -f
fi

# Build and start services
print_status "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ MongoDB is healthy"
else
    print_error "❌ MongoDB is not responding"
fi

# Check Backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    print_status "✅ Backend API is healthy"
else
    print_error "❌ Backend API is not responding"
fi

# Check Frontend
if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_error "❌ Frontend is not responding"
fi

# Display service URLs
echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
echo "📱 Service URLs:"
echo "   Frontend: http://localhost:80"
echo "   Backend API: http://localhost:5000"
echo "   API Health: http://localhost:5000/health"
echo "   MongoDB: localhost:27017"
echo ""
echo "📊 Monitoring:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""

