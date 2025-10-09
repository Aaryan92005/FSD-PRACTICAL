# Docker Deployment Guide - Grocery ERP System

## 🚀 Quick Start

Your application is already configured for Docker deployment! Here's how to deploy it:

### Prerequisites
- Docker installed on your system
- Docker Compose installed
- At least 4GB RAM available
- Ports 80, 5000, 27017, 6379 available

### 1. Deploy with One Command
```bash
# Make deployment script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 2. Or Deploy Manually
```bash
# Create necessary directories
mkdir -p logs/backend logs/frontend mongodb-init

# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps
```

## 📊 Service Architecture

Your deployment includes:

- **Frontend**: React app served by Nginx (Port 80)
- **Backend**: Node.js API server (Port 5000)
- **Database**: MongoDB with authentication (Port 27017)
- **Cache**: Redis for session storage (Port 6379)
- **Load Balancer**: Nginx proxy (Port 8081)

## 🔗 Access URLs

After deployment:
- **Application**: http://localhost
- **API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Load Balancer**: http://localhost:8081

## 🛠️ Management Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Clean rebuild
docker-compose down
docker-compose up --build -d

# Remove everything including volumes
docker-compose down -v
```

## 🔧 Environment Configuration

### Production Environment Variables

Update these files for production:

**Backend (.env.production):**
```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongodb:27017/grocery-erp?authSource=admin
JWT_SECRET=your-super-secure-jwt-secret-here
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env.production):**
```env
REACT_APP_API_BASE=https://api.yourdomain.com
```

## 🔒 Security Considerations

1. **Change default passwords** in docker-compose.yml
2. **Update JWT secrets** in environment files
3. **Use HTTPS** in production
4. **Configure firewall** rules
5. **Regular security updates**

## 📈 Scaling Options

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up --scale backend=3 -d

# Scale with load balancer
docker-compose up --scale backend=3 --scale nginx=1 -d
```

### Resource Limits
Add to docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## 🩺 Health Monitoring

### Built-in Health Checks
- MongoDB: `docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"`
- Backend: `curl http://localhost:5000/health`
- Frontend: `curl http://localhost`

### Monitoring Stack (Optional)
Add Prometheus + Grafana for advanced monitoring.

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :80
   netstat -tulpn | grep :5000
   ```

2. **Database connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Test connection
   docker-compose exec backend npm run test-db
   ```

3. **Build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose build --no-cache
   ```

4. **Memory issues**
   ```bash
   # Check resource usage
   docker stats
   
   # Increase Docker memory limit
   # (Docker Desktop: Settings > Resources > Memory)
   ```

## 🔄 CI/CD Integration

Your setup is ready for:
- GitHub Actions (see .github/workflows/)
- GitLab CI
- Jenkins
- Azure DevOps

## 📦 Backup Strategy

```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup

# Backup volumes
docker run --rm -v grocery-erp_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## 🎯 Next Steps

1. Configure domain and SSL certificates
2. Set up monitoring and alerting
3. Implement backup automation
4. Configure log aggregation
5. Set up staging environment