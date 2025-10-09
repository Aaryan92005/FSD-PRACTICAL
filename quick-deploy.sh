#!/bin/bash

# Quick Deploy Script for Grocery ERP to Render
set -e

echo "🚀 Grocery ERP - Quick Deploy to Render"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Step 1: Verify prerequisites
print_step "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

print_success "All prerequisites are installed ✓"

# Step 2: Test database connection
print_step "Testing MongoDB Atlas connection..."
cd grocery-erp-backend
if npm run test-db; then
    print_success "Database connection successful ✓"
else
    echo "❌ Database connection failed. Please check your MongoDB Atlas setup."
    exit 1
fi
cd ..

# Step 3: Test backend health
print_step "Testing backend health endpoints..."
cd grocery-erp-backend
if npm run health-check; then
    print_success "Backend health check passed ✓"
else
    echo "❌ Backend health check failed. Please start the backend server first."
    exit 1
fi
cd ..

# Step 4: Build frontend
print_step "Testing frontend build..."
cd grocery-erp-frontend
if npm run build; then
    print_success "Frontend build successful ✓"
    rm -rf build  # Clean up build directory
else
    echo "❌ Frontend build failed. Please check for errors."
    exit 1
fi
cd ..

# Step 5: Git operations
print_step "Preparing Git repository..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_info "No changes to commit"
else
    print_info "Committing changes..."
    git commit -m "Add Render deployment configuration and setup

- Add render.yaml for infrastructure as code
- Configure MongoDB Atlas connection
- Add health check endpoints
- Set up CI/CD with GitHub Actions
- Add deployment documentation and scripts
- Ready for production deployment"
fi

print_success "Git repository prepared ✓"

# Step 6: Display next steps
echo ""
echo "🎉 Your Grocery ERP system is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/yourusername/grocery-erp-system.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Create account and connect GitHub"
echo "   - Follow the guide in RENDER_SETUP.md"
echo ""
echo "3. Use the deployment checklist:"
echo "   - Follow DEPLOYMENT_CHECKLIST.md step by step"
echo ""
echo "📚 Documentation:"
echo "   - RENDER_SETUP.md - Detailed deployment guide"
echo "   - DEPLOYMENT_CHECKLIST.md - Step-by-step checklist"
echo "   - DEPLOYMENT.md - Complete deployment documentation"
echo ""
echo "🔗 Your MongoDB Atlas is ready:"
echo "   Connection: mongodb+srv://aaryanshetye9:****@cluster1.kvcvjdf.mongodb.net/grocery-erp"
echo ""
echo "Happy deploying! 🚀"