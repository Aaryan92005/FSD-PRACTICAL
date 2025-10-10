# Manual Render Setup Guide

If the Blueprint deployment isn't working, follow these steps to deploy manually:

## Step 1: Deploy Backend Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Aaryan92005/FSD-PRACTICAL`
4. Configure the service:

**Basic Settings:**
- Name: `grocery-erp-backend`
- Root Directory: `grocery-erp-backend`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://aaryanshetye9:Aaryan92005@cluster1.kvcvjdf.mongodb.net/grocery-erp?retryWrites=true&w=majority
JWT_SECRET=grocery-erp-production-jwt-secret-2024-secure-key
JWT_EXPIRES_IN=7d
```

5. Click "Create Web Service"

## Step 2: Deploy Frontend Service

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the service:

**Basic Settings:**
- Name: `grocery-erp-frontend`
- Root Directory: `grocery-erp-frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

**Environment Variables:**
```
REACT_APP_API_URL=https://grocery-erp-backend.onrender.com
GENERATE_SOURCEMAP=false
NODE_ENV=production
CI=false
```

4. Click "Create Static Site"

## Step 3: Update Backend Environment

After both services are deployed:

1. Go to your backend service settings
2. Add this environment variable:
   - `FRONTEND_URL` = `https://grocery-erp-frontend.onrender.com`

## Step 4: Test the Deployment

1. Backend health check: `https://grocery-erp-backend.onrender.com/api/health`
2. Frontend: `https://grocery-erp-frontend.onrender.com`

## Troubleshooting

If frontend build fails:
- Check the build logs for specific errors
- Ensure all environment variables are set correctly
- Try rebuilding the service