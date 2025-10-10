@echo off
echo 🚀 Deploying Grocery ERP Frontend to Vercel...

REM Check if we're in the right directory
if not exist "grocery-erp-frontend" (
    echo ❌ Error: grocery-erp-frontend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd grocery-erp-frontend

REM Check if vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project locally to check for errors
echo 🔨 Building project...
npm run build

if errorlevel 1 (
    echo ❌ Build failed! Please fix the errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Note your Vercel app URL from the output above
echo 2. Update your Render backend FRONTEND_URL environment variable
echo 3. Update REACT_APP_API_URL in Vercel dashboard if needed
echo 4. Test your application!
echo.
echo 🔗 Useful links:
echo - Vercel Dashboard: https://vercel.com/dashboard
echo - Render Dashboard: https://dashboard.render.com

pause