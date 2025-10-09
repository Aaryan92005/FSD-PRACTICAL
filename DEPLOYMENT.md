# Grocery ERP - Render Deployment Guide

This guide walks you through deploying the Grocery ERP system to Render using GitHub Actions for CI/CD.

## 🚀 Quick Start

### Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas account (free tier available)

### 1. Set up MongoDB Atlas
1. Create a free MongoDB Atlas cluster
2. Create a database user
3. Get your connection string
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for simplicity)

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect the `render.yaml` file
4. Set environment variables in Render dashboard

#### Option B: Manual Setup
1. Create a Web Service for backend:
   - Build Command: `cd grocery-erp-backend && npm install`
   - Start Command: `cd grocery-erp-backend && npm start`
   - Environment: Node.js

2. Create a Static Site for frontend:
   - Build Command: `cd grocery-erp-frontend && npm install && npm run build`
   - Publish Directory: `grocery-erp-frontend/build`

### 3. Configure Environment Variables

#### Backend Environment Variables (Render Dashboard)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery-erp?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-app.onrender.com
```

#### Frontend Environment Variables (Render Dashboard)
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-app.onrender.com
```

### 4. Set up GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```
RENDER_API_KEY=your-render-api-key
RENDER_BACKEND_SERVICE_ID=srv-xxxxxxxxxxxxx
RENDER_FRONTEND_SERVICE_ID=srv-xxxxxxxxxxxxx
RENDER_STAGING_SERVICE_ID=srv-xxxxxxxxxxxxx (optional)
```

## 🔧 Configuration Details

### Render Services Configuration

#### Backend Service
- **Type**: Web Service
- **Environment**: Node.js
- **Build Command**: `cd grocery-erp-backend && npm install`
- **Start Command**: `cd grocery-erp-backend && npm start`
- **Health Check Path**: `/api/health`
- **Plan**: Free (or paid for better performance)

#### Frontend Service
- **Type**: Static Site
- **Build Command**: `cd grocery-erp-frontend && npm install && npm run build`
- **Publish Directory**: `grocery-erp-frontend/build`
- **Plan**: Free

### Database Configuration

#### MongoDB Atlas Setup
1. Create cluster: `grocery-erp-cluster`
2. Create database: `grocery_erp`
3. Create user with read/write permissions
4. Get connection string and add to environment variables

### GitHub Actions Workflow

The workflow includes:
- **Testing**: Runs tests for both frontend and backend
- **Security Scanning**: Audits npm packages for vulnerabilities
- **Staging Deployment**: Deploys to staging on `develop` branch
- **Production Deployment**: Deploys to production on `main` branch
- **Health Checks**: Verifies deployment success

## 🔍 Monitoring & Health Checks

### Health Check Endpoints
- Backend: `https://your-backend-app.onrender.com/api/health`
- Frontend: `https://your-frontend-app.onrender.com`

### Manual Health Check
```bash
# Run local health check
node scripts/health-check.js

# Check backend only
node scripts/health-check.js --backend-only
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs in Render dashboard

#### 2. Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist settings
- Ensure database user has correct permissions

#### 3. Environment Variables
- Double-check all required environment variables are set
- Verify variable names match exactly
- Check for typos in URLs

#### 4. CORS Issues
- Ensure FRONTEND_URL is set correctly in backend
- Check CORS configuration in backend code

### Debugging Commands
```bash
# Check service status
curl https://your-backend-app.onrender.com/api/health

# View logs (in Render dashboard)
# Go to your service > Logs tab

# Test local deployment
npm run start # in respective directories
```

## 📊 Performance Optimization

### Backend Optimizations
- Enable compression middleware
- Use connection pooling for MongoDB
- Implement caching with Redis (optional)
- Optimize API response sizes

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization
- Bundle size analysis
- CDN for static assets (handled by Render)

## 🔐 Security Best Practices

### Environment Variables
- Never commit secrets to version control
- Use strong, unique JWT secrets
- Rotate secrets regularly

### Database Security
- Use strong database passwords
- Enable MongoDB Atlas security features
- Regular security updates

### Application Security
- Keep dependencies updated
- Use HTTPS only
- Implement rate limiting
- Validate all inputs

## 📈 Scaling Considerations

### Free Tier Limitations
- Backend: Sleeps after 15 minutes of inactivity
- Database: 512MB storage limit on MongoDB Atlas free tier
- Bandwidth: Limited on free tier

### Upgrade Path
- Render Starter plan: $7/month per service
- MongoDB Atlas: Paid tiers for more storage/performance
- Consider Redis for caching on paid plans

## 🆘 Support

### Resources
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Getting Help
1. Check Render service logs
2. Review GitHub Actions workflow logs
3. Test health check endpoints
4. Check environment variable configuration

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring**: Configure uptime monitoring
2. **Custom domain**: Add your custom domain in Render
3. **SSL certificate**: Automatically provided by Render
4. **Backup strategy**: Set up MongoDB Atlas backups
5. **Performance monitoring**: Add application performance monitoring

Happy deploying! 🚀