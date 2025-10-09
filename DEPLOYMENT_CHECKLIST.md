# ✅ Deployment Checklist

## Pre-Deployment Checklist

### 🔍 Code Preparation
- [x] MongoDB Atlas connection string configured
- [x] Environment variables set up for production
- [x] Health check endpoints working (`/health` and `/api/health`)
- [x] Database initialization script ready
- [x] CORS configuration updated for production
- [x] Build scripts optimized for Render

### 📁 Files Created/Updated
- [x] `render.yaml` - Infrastructure as code
- [x] `grocery-erp-backend/.env` - Development environment
- [x] `grocery-erp-backend/.env.production` - Production template
- [x] `grocery-erp-frontend/.env.production` - Frontend production config
- [x] `.github/workflows/deploy.yml` - CI/CD pipeline
- [x] Health check routes and scripts
- [x] Database connection test script
- [x] Deployment documentation

## Deployment Steps

### 1. GitHub Repository
- [ ] Push all code to GitHub main branch
- [ ] Verify all files are committed
- [ ] Check that workflows are enabled

### 2. MongoDB Atlas Setup
- [x] Cluster created and running
- [x] Database user created with proper permissions
- [x] Connection string tested and working
- [ ] IP whitelist configured (add 0.0.0.0/0 for Render)
- [x] Sample data initialized

### 3. Render Account Setup
- [ ] Create account at render.com
- [ ] Connect GitHub repository
- [ ] Verify billing information (even for free tier)

### 4. Backend Service Deployment
- [ ] Create Web Service in Render
- [ ] Configure build command: `cd grocery-erp-backend && npm install`
- [ ] Configure start command: `cd grocery-erp-backend && npm start`
- [ ] Set environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=mongodb+srv://aaryanshetye9:Aaryan92005@cluster1.kvcvjdf.mongodb.net/grocery-erp?retryWrites=true&w=majority&appName=Cluster1`
  - [ ] `JWT_SECRET=grocery-erp-production-jwt-secret-2024-secure-key`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `FRONTEND_URL=https://grocery-erp-frontend.onrender.com`
- [ ] Deploy and verify health endpoint works

### 5. Frontend Service Deployment
- [ ] Create Static Site in Render
- [ ] Configure build command: `cd grocery-erp-frontend && npm install && npm run build`
- [ ] Configure publish directory: `grocery-erp-frontend/build`
- [ ] Set environment variables:
  - [ ] `REACT_APP_API_URL=https://grocery-erp-backend.onrender.com`
  - [ ] `REACT_APP_SOCKET_URL=https://grocery-erp-backend.onrender.com`
  - [ ] `GENERATE_SOURCEMAP=false`
- [ ] Deploy and verify frontend loads

### 6. GitHub Actions Setup (Optional)
- [ ] Add GitHub secrets:
  - [ ] `RENDER_API_KEY`
  - [ ] `RENDER_BACKEND_SERVICE_ID`
  - [ ] `RENDER_FRONTEND_SERVICE_ID`
- [ ] Test workflow by pushing to main branch
- [ ] Verify automatic deployments work

## Post-Deployment Verification

### 🧪 Testing Checklist
- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Simple health check: `https://your-backend.onrender.com/health`
- [ ] Database connectivity verified in health response
- [ ] Frontend loads successfully
- [ ] Frontend can connect to backend API
- [ ] Sample products visible in frontend
- [ ] Real-time features working (if applicable)

### 🔧 Performance Checks
- [ ] Backend response time < 2 seconds
- [ ] Frontend loads in < 5 seconds
- [ ] Database queries executing properly
- [ ] No console errors in browser
- [ ] Mobile responsiveness working

### 🛡️ Security Verification
- [ ] HTTPS enabled on both services
- [ ] CORS properly configured
- [ ] Environment variables not exposed in frontend
- [ ] Rate limiting working
- [ ] Input validation functioning

## Troubleshooting Commands

```bash
# Test database connection
cd grocery-erp-backend && npm run test-db

# Test health endpoints
curl https://your-backend.onrender.com/api/health
curl https://your-backend.onrender.com/health

# Test API endpoints
curl https://your-backend.onrender.com/api/v1/products

# Build frontend locally to test
cd grocery-erp-frontend && npm run build

# Run health check script
node scripts/health-check.js
```

## Expected URLs After Deployment

### Backend Service
- **Main URL**: `https://grocery-erp-backend.onrender.com`
- **Health Check**: `https://grocery-erp-backend.onrender.com/api/health`
- **API Base**: `https://grocery-erp-backend.onrender.com/api/v1`

### Frontend Service
- **Main URL**: `https://grocery-erp-frontend.onrender.com`
- **Should connect to backend automatically**

## Success Criteria

✅ **Deployment is successful when:**
1. Both services show "Live" status in Render dashboard
2. Health endpoints return 200 status
3. Frontend loads and displays data from backend
4. Database connection is stable
5. No critical errors in service logs

## 🎉 Congratulations!

Once all items are checked, your Grocery ERP system is successfully deployed to production!

**Next Steps:**
- Monitor service performance
- Set up custom domain (optional)
- Configure monitoring and alerts
- Plan for scaling as usage grows