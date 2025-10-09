@echo off
REM Grocery ERP Deployment Script for Windows
setlocal enabledelayedexpansion

echo 🚀 Starting Grocery ERP Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "logs\backend" mkdir logs\backend
if not exist "logs\frontend" mkdir logs\frontend
if not exist "mongodb-init" mkdir mongodb-init

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose down 2>nul

REM Clean up old images if requested
if "%1"=="--clean" (
    echo [WARNING] Cleaning up old images...
    docker system prune -f
)

REM Build and start services
echo [INFO] Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo [INFO] Checking service health...

REM Check Backend
curl -f http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ❌ Backend API is not responding
) else (
    echo [INFO] ✅ Backend API is healthy
)

REM Check Frontend
curl -f http://localhost:80 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ❌ Frontend is not responding
) else (
    echo [INFO] ✅ Frontend is healthy
)

REM Display service URLs
echo.
echo [INFO] 🎉 Deployment completed successfully!
echo.
echo 📱 Service URLs:
echo    Frontend: http://localhost:80
echo    Backend API: http://localhost:5000
echo    API Health: http://localhost:5000/health
echo    MongoDB: localhost:27017
echo.
echo 📊 Monitoring:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo.

pause