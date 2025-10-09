# 🚀 Render Deployment Setup Guide

## Quick Deployment Steps

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Account & Services

#### A. Sign up at [render.com](https://render.com)

#### B. Connect Your GitHub Repository
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select your `grocery-erp-system` repository

#### C. Create Backend Service
1. **Service Name**: `grocery-erp-backend`
2. **Environment**: `Node`
3. **Build Command**: `cd grocery-erp-backend && npm install`
4. **Start Command**: `cd grocery-erp-backend && npm start`
5. **Plan**: Free (or paid for better performance)

**Environment Variables for Backend:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://aaryanshetye9:Aaryan92005@cluster1.kvcvjdf.mongodb.net/grocery-erp?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=grocery-erp-production-jwt-secret-2024-secure-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://grocery-erp-frontend.onrender.com
```

#### D. Create Frontend Service
1. **Service Name**: `grocery-erp-frontend`
2. **Environment**: `Static Site`
3. **Build Command**: `cd grocery-erp-frontend && npm install && npm run build`
4. **Publish Directory**: `grocery-erp-frontend/build`
5. **Plan**: Free

**Environment Variables for Frontend:**
```
REACT_APP_API_URL=https://grocery-erp-backend.onrender.com
REACT_APP_SOCKET_URL=https://grocery-erp-backend.onrender.com
GENERATE_SOURCEMAP=false
```

### 3. Alternative: Use render.yaml (Recommended)

If you want to use Infrastructure as Code:

1. In Render Dashboard, click "New +" → "Blueprint"
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml`
4. Set the environment variables in the Render dashboard

### 4. Set Up GitHub Actions (Optional)

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
RENDER_API_KEY=your_render_api_key_here
RENDER_BACKEND_SERVICE_ID=srv_xxxxxxxxxxxxx
RENDER_FRONTEND_SERVICE_ID=srv_xxxxxxxxxxxxx
```

To get your Render API key:
1. Go to Render Dashboard → Account Settings → API Keys
2. Create a new API key

To get Service IDs:
1. Go to your service in Render Dashboard
2. Settings tab → Service ID

### 5. Test Your Deployment

After deployment, test these URLs:

**Backend:**
- Health Check: `https://your-backend-name.onrender.com/api/health`
- API Docs: `https://your-backend-name.onrender.com/api/v1/products`

**Frontend:**
- Main App: `https://your-frontend-name.onrender.com`

### 6. Update Frontend API URL

After backend is deployed, update the frontend environment variable:
1. Go to your frontend service in Render
2. Environment tab
3. Update `REACT_APP_API_URL` with your actual backend URL
4. Trigger a new deployment

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check if Render IPs are whitelisted in Atlas
   - Test connection using the test script: `npm run test-db`

3. **CORS Issues**
   - Update `FRONTEND_URL` in backend environment variables
   - Ensure both services are deployed and URLs are correct

4. **Environment Variables**
   - Double-check all required variables are set
   - Verify no typos in variable names
   - Check that URLs don't have trailing slashes

### Debugging Commands:

```bash
# Test database connection locally
cd grocery-erp-backend && npm run test-db

# Test health endpoints
curl https://your-backend.onrender.com/api/health
curl https://your-backend.onrender.com/health

# Check frontend build locally
cd grocery-erp-frontend && npm run build
```

## 📊 Expected Results

After successful deployment:

✅ **Backend Service:**
- URL: `https://grocery-erp-backend.onrender.com`
- Health: `https://grocery-erp-backend.onrender.com/api/health`
- Status: Should return 200 with database connection info

✅ **Frontend Service:**
- URL: `https://grocery-erp-frontend.onrender.com`
- Should load the React application
- Should connect to backend API successfully

✅ **Database:**
- MongoDB Atlas cluster should show active connections
- Sample data should be accessible via API

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add your custom domain in Render dashboard
   - Update DNS settings

2. **SSL Certificate**
   - Automatically provided by Render
   - No additional configuration needed

3. **Monitoring**
   - Set up uptime monitoring
   - Configure alerts for service downtime

4. **Scaling**
   - Monitor resource usage
   - Upgrade to paid plans if needed

---

## 🆘 Need Help?

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **GitHub Actions**: https://docs.github.com/en/actions

Your deployment should be live within 5-10 minutes after setup! 🚀