#!/bin/bash

# Grocery ERP Monitoring Script

echo "📊 Grocery ERP System Monitoring"
echo "================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Check if services are running
echo "🔍 Checking service status..."

# Check Docker containers
echo ""
echo "Docker Containers:"
docker-compose ps

echo ""
echo "Service Health Checks:"

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_status "MongoDB is running"
else
    print_error "MongoDB is not responding"
fi

# Check Backend API
if curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
    print_status "Backend API is running"
    # Get API response time
    response_time=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:5000/health)
    echo "   Response time: ${response_time}s"
else
    print_error "Backend API is not responding"
fi

# Check Frontend
if curl -s -f http://localhost:80 > /dev/null 2>&1; then
    print_status "Frontend is running"
else
    print_error "Frontend is not responding"
fi

# Check Redis (if enabled)
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_status "Redis is running"
else
    print_warning "Redis is not responding (optional service)"
fi

echo ""
echo "📈 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "📋 Recent Logs (last 10 lines):"
echo "Backend logs:"
docker-compose logs --tail=10 backend

echo ""
echo "Frontend logs:"
docker-compose logs --tail=10 frontend

echo ""
echo "🔧 Useful Commands:"
echo "  View all logs: docker-compose logs -f"
echo "  Restart service: docker-compose restart [service-name]"
echo "  Stop all: docker-compose down"
echo "  Update images: docker-compose pull && docker-compose up -d"



