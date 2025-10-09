@echo off
REM Health Check Script for Grocery ERP Docker Deployment
echo 🩺 Grocery ERP Health Check
echo ========================

REM Check Docker containers
echo.
echo 📦 Container Status:
docker-compose ps

echo.
echo 🔍 Service Health Checks:

REM Check MongoDB
echo Checking MongoDB...
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB: Not responding
) else (
    echo ✅ MongoDB: Healthy
)

REM Check Backend API
echo Checking Backend API...
curl -f -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API: Not responding
) else (
    echo ✅ Backend API: Healthy
)

REM Check Frontend
echo Checking Frontend...
curl -f -s http://localhost:80 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend: Not responding
) else (
    echo ✅ Frontend: Healthy
)

REM Check Redis
echo Checking Redis...
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo ❌ Redis: Not responding
) else (
    echo ✅ Redis: Healthy
)

echo.
echo 📊 Resource Usage:
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo.
echo 🔗 Access URLs:
echo    Application: http://localhost
echo    API: http://localhost:5000
echo    Health: http://localhost:5000/health

pause