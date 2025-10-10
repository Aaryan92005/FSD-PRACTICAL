# Vercel Frontend Deployment Guide

## Prerequisites
1. Your backend should already be deployed on Render
2. You need a Vercel account (free tier works)
3. Your backend URL from Render (e.g., `https://grocery-erp-backend.onrender.com`)

## Step 1: Deploy Backend on Render (if not done already)
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Use the existing `render.yaml` configuration
4. Note your backend URL after deployment

## Step 2: Deploy Frontend on Vercel

### Option A: Using Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd grocery-erp-frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Set environment variables during deployment or in Vercel dashboard:
   - `REACT_APP_API_URL`: Your Render backend URL
   - `REACT_APP_SOCKET_URL`: Your Render backend URL
   - `GENERATE_SOURCEMAP`: false

### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `grocery-erp-frontend` folder as root directory
5. Set Framework Preset to "Create React App"
6. Add environment variables:
   - `REACT_APP_API_URL`: `https://your-backend-app.onrender.com`
   - `REACT_APP_SOCKET_URL`: `https://your-backend-app.onrender.com`
   - `GENERATE_SOURCEMAP`: `false`
7. Click "Deploy"

## Step 3: Update Backend CORS Settings
After frontend deployment, update your backend to allow your Vercel domain:

1. In your backend `server.js` or CORS configuration, add your Vercel URL:
   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://your-app.vercel.app', // Add your Vercel URL here
       process.env.FRONTEND_URL
     ],
     credentials: true
   };
   ```

## Step 4: Update Environment Variables
1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Update `REACT_APP_API_URL` with your actual Render backend URL

2. **In Render Dashboard (Backend):**
   - Update `FRONTEND_URL` to your Vercel app URL
   - This ensures proper CORS configuration

## Step 5: Test the Connection
1. Visit your Vercel app URL
2. Test login/authentication
3. Check browser console for any CORS errors
4. Verify API calls are going to your Render backend

## Troubleshooting

### CORS Issues
If you get CORS errors:
1. Check that your backend CORS settings include your Vercel URL
2. Ensure credentials are properly configured
3. Verify environment variables are set correctly

### Build Issues
If build fails:
1. Check that all dependencies are in `package.json`
2. Verify environment variables are set
3. Check build logs in Vercel dashboard

### API Connection Issues
1. Verify `REACT_APP_API_URL` points to correct Render URL
2. Check that backend is running and accessible
3. Test API endpoints directly in browser/Postman

## Environment Variables Summary

### Frontend (Vercel)
- `REACT_APP_API_URL`: `https://grocery-erp-backend.onrender.com`
- `REACT_APP_SOCKET_URL`: `https://grocery-erp-backend.onrender.com`
- `GENERATE_SOURCEMAP`: `false`

### Backend (Render)
- `FRONTEND_URL`: `https://your-app.vercel.app`
- All other existing environment variables remain the same

## Custom Domain (Optional)
1. In Vercel dashboard, go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update backend CORS settings to include custom domain