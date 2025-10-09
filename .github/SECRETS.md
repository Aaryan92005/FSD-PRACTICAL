# GitHub Secrets Configuration

This document lists all the GitHub secrets required for the CI/CD pipeline.

## Required Secrets

Add these secrets in your GitHub repository: **Settings > Secrets and variables > Actions**

### Render Configuration
```
RENDER_API_KEY
Description: Your Render API key for deployments
How to get: Render Dashboard > Account Settings > API Keys
Example: rnd_xxxxxxxxxxxxxxxxxxxxx
```

```
RENDER_BACKEND_SERVICE_ID
Description: Service ID for your backend service on Render
How to get: Render Dashboard > Your Backend Service > Settings > Service ID
Example: srv-xxxxxxxxxxxxx
```

```
RENDER_FRONTEND_SERVICE_ID
Description: Service ID for your frontend service on Render
How to get: Render Dashboard > Your Frontend Service > Settings > Service ID
Example: srv-xxxxxxxxxxxxx
```

```
RENDER_STAGING_SERVICE_ID (Optional)
Description: Service ID for staging environment
How to get: Create a staging service on Render and get its Service ID
Example: srv-xxxxxxxxxxxxx
```

### Database Configuration (Optional - if not using render.yaml)
```
MONGODB_URI
Description: MongoDB Atlas connection string
How to get: MongoDB Atlas > Clusters > Connect > Connect your application
Example: mongodb+srv://username:password@cluster.mongodb.net/grocery-erp?retryWrites=true&w=majority
```

```
JWT_SECRET
Description: Secret key for JWT token generation
How to get: Generate a secure random string (32+ characters)
Example: your-super-secure-jwt-secret-key-change-this-in-production
```

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Enter the secret name and value
6. Click **Add secret**

## Security Notes

- Never commit secrets to your repository
- Use strong, unique values for all secrets
- Rotate secrets regularly
- Only give secrets the minimum required permissions

## Testing Secrets

After adding secrets, you can test them by:
1. Pushing a commit to trigger the workflow
2. Checking the Actions tab for any secret-related errors
3. Verifying that deployments complete successfully

## Troubleshooting

### Common Issues:
- **Secret not found**: Check the secret name matches exactly (case-sensitive)
- **Invalid API key**: Regenerate the API key in Render dashboard
- **Service ID not found**: Verify the service exists and ID is correct