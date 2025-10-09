@echo off
echo 🔌 Docker Container Port Mapping
echo ================================

echo.
echo 📊 Container Status with Ports:
docker-compose ps

echo.
echo 🔍 Individual Port Mappings:
echo.

echo Frontend (React App):
docker port grocery-erp-frontend 2>nul
if errorlevel 1 echo   No ports mapped

echo.
echo Backend (API):
docker port grocery-erp-backend 2>nul
if errorlevel 1 echo   No ports mapped

echo.
echo MongoDB (Database):
docker port grocery-erp-mongodb 2>nul
if errorlevel 1 echo   No ports mapped

echo.
echo Redis (Cache):
docker port grocery-erp-redis 2>nul
if errorlevel 1 echo   No ports mapped

echo.
echo Nginx (Load Balancer):
docker port grocery-erp-nginx 2>nul
if errorlevel 1 echo   No ports mapped

echo.
echo 🌐 Access URLs:
echo   Frontend:      http://localhost:80
echo   Backend API:   http://localhost:5000
echo   Health Check:  http://localhost:5000/health
echo   Load Balancer: http://localhost:8081
echo   MongoDB:       localhost:27017
echo   Redis:         localhost:6379

echo.
echo 📈 Network Listening Ports:
netstat -an | findstr "LISTENING" | findstr ":80\|:5000\|:8081\|:27017\|:6379"

pause