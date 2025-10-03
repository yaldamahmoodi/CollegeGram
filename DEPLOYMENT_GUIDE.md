# CollegeGram Monorepo - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- pnpm (package manager)

### Development Setup
```bash
# Clone and setup
git clone <repository>
cd monorepo
pnpm install

# Start all services
docker-compose up -d

# Development servers
pnpm dev  # Starts all apps in development mode
```

### Production Deployment
```bash
# Build and deploy all services
docker-compose --profile production up -d

# Or build individual services
docker-compose up -d api web doc nginx
```

## 🌐 Service URLs

### Development
- **Main App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Health Dashboard**: http://localhost:3002
- **API Docs**: http://localhost:3001/api/docs

### Production (82.115.13.86)
- **Main App**: http://82.115.13.86
- **API Server**: http://82.115.13.86/api
- **Health Dashboard**: http://82.115.13.86/health-dashboard
- **Mailpit**: http://82.115.13.86/mailpit
- **API Docs**: http://82.115.13.86/api/docs

## 📦 Docker Services

### Core Application Services
```yaml
api:          # Node.js/Express backend
web:          # React frontend
doc:          # Health dashboard
nginx:        # Reverse proxy
```

### Infrastructure Services
```yaml
mongo:        # MongoDB database
redis:        # Cache and sessions
elasticsearch: # Search engine
mailpit:      # Email testing (dev)
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in each app directory:

**apps/api/.env**
```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:admin@mongo:27017/collagegram?authSource=admin
REDIS_URL=redis://redis:6379
ELASTIC_URL=http://elasticsearch:9200
SMTP_HOST=mailpit
SMTP_PORT=1025
ACCESS_TOKEN_SECRET=your_secret_here
COOKIE_SECRET=your_cookie_secret_here
```

**apps/web/.env**
```env
VITE_API_URL=http://82.115.13.86/api
```

### Docker Compose Profiles
- **Default**: Development services (mongo, redis, elasticsearch, mailpit)
- **Production**: All services including nginx reverse proxy

## 🏗️ Build Process

### Individual App Builds
```bash
# API
cd apps/api
npm run build

# Web
cd apps/web
npm run build

# Doc (Health Dashboard)
cd apps/doc
npm run build
```

### Monorepo Build (Turborepo)
```bash
# Build all apps
pnpm build

# Development mode
pnpm dev
```

## 🔍 Health Monitoring

### Health Check Endpoints
- **API Health**: `GET /api/health`
- **Service Status**: Real-time monitoring dashboard
- **System Metrics**: CPU, memory, disk, network

### Monitoring Features
- ✅ Automatic service discovery
- ✅ Real-time status updates (30s intervals)
- ✅ Error tracking and alerting
- ✅ Performance metrics
- ✅ Infrastructure overview

## 🔒 Security Configuration

### Nginx Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### API Security
- JWT authentication with refresh tokens
- CORS configuration for cross-origin requests
- Helmet.js for security headers
- Input validation with Yup schemas
- File upload restrictions

## 📊 Performance Optimization

### Frontend Optimizations
- Code splitting with dynamic imports
- Asset optimization and caching
- Gzip compression via Nginx
- CDN-ready static asset serving

### Backend Optimizations
- Database connection pooling
- Redis caching for sessions
- Elasticsearch indexing for search
- Async/await for non-blocking operations

## 🐛 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :3000
# Kill process if needed
sudo kill -9 <PID>
```

**Docker Issues**
```bash
# Clean up containers
docker-compose down
docker system prune -f

# Rebuild images
docker-compose build --no-cache
```

**Database Connection**
```bash
# Check MongoDB connection
docker exec -it collagegram-mongo mongosh
# Check Redis connection
docker exec -it collagegram-redis redis-cli ping
```

### Log Analysis
```bash
# View service logs
docker-compose logs api
docker-compose logs web
docker-compose logs doc
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f api
```

## 🔄 CI/CD Pipeline

### Automated Deployment
```bash
# Production deployment script
#!/bin/bash
git pull origin main
docker-compose --profile production down
docker-compose --profile production build
docker-compose --profile production up -d
```

### Health Checks
```bash
# Verify deployment
curl http://82.115.13.86/api/health
curl http://82.115.13.86/health-dashboard
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Multiple API instances behind load balancer
- Database replica sets for read scaling
- Redis cluster for high availability
- CDN integration for static assets

### Monitoring & Alerting
- Health dashboard for real-time monitoring
- Log aggregation and analysis
- Performance metrics tracking
- Automated alerting for service failures

## 🔮 Future Enhancements

### Infrastructure
- [ ] Kubernetes migration for container orchestration
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Automated testing and deployment
- [ ] Advanced monitoring with Prometheus/Grafana

### Application
- [ ] WebSocket integration for real-time updates
- [ ] Advanced caching strategies
- [ ] API rate limiting and throttling
- [ ] Mobile application development

This deployment guide provides everything needed to run the CollegeGram monorepo in both development and production environments, with comprehensive monitoring and troubleshooting information.
