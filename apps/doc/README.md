# CollegeGram Health Dashboard

A real-time health monitoring dashboard built with React, TypeScript, and shadcn/ui components.

## 🚀 Features

- **Real-time Health Monitoring**: Live service status updates every 30 seconds
- **System Metrics**: CPU, memory, disk, and network usage visualization
- **Service Status Cards**: Individual health checks for each service
- **Infrastructure Overview**: Server information and quick links
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🎨 Design System

### Color Palette
- **Primary**: `#F6881F` (Orange) - Main brand color
- **Secondary**: `#EA5A69` (Red-Pink) - Accent color
- **Neutral**: `#ffffff` (White), `#000000` (Black), Gray variants
- **Status Colors**: Green (healthy), Yellow (warning), Red (unhealthy)

### Components
- **Cards**: Service status and metrics display
- **Badges**: Status indicators and labels
- **Progress Bars**: System resource usage
- **Buttons**: Actions and refresh controls

## 🏗️ Architecture

```
src/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── button.tsx
│   ├── HealthCard.tsx      # Individual service status
│   ├── SystemMetrics.tsx   # System resource monitoring
│   └── OverallStatus.tsx   # System overview
├── hooks/
│   └── useHealthCheck.ts   # Health data fetching logic
├── types/
│   └── health.ts          # TypeScript definitions
├── lib/
│   └── utils.ts           # Utility functions
└── App.tsx                # Main application component
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or pnpm

### Setup
```bash
cd apps/doc
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Docker
```bash
docker build -t collagegram-doc .
docker run -p 3002:80 collagegram-doc
```

## 📊 Health Check API

The dashboard connects to the API health endpoint:

```typescript
// API Response Format
interface HealthCheckResponse {
  overall: "healthy" | "unhealthy" | "warning";
  services: ServiceStatus[];
  timestamp: string;
  uptime: number;
}

interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy" | "warning";
  message: string;
  details?: any;
  responseTime?: number;
  lastChecked?: string;
}
```

### Monitored Services
- **MongoDB**: Database connectivity and performance
- **Redis**: Cache service status
- **Elasticsearch**: Search service health
- **Email Service**: SMTP connection verification
- **API Server**: Overall application health

## 🌐 Deployment

### Production (Docker Compose)
The dashboard is included in the main docker-compose.yaml:

```yaml
doc:
  build: ./apps/doc
  container_name: monorepo-doc
  restart: unless-stopped
  ports:
    - "3002:80"
```

### Access URLs
- **Development**: http://localhost:3002
- **Production**: http://82.115.13.86:3002

## 🔍 Monitoring Features

### Real-time Updates
- Automatic refresh every 30 seconds
- Manual refresh button
- Error handling with fallback data
- Connection status indicators

### Service Health Cards
- Visual status indicators (✅ ⚠️ ❌)
- Response time metrics
- Detailed error information
- Last checked timestamps

### System Metrics
- CPU usage with color-coded progress bars
- Memory utilization tracking
- Disk space monitoring
- Network traffic (in/out)

### Infrastructure Info
- Server IP address
- Environment details
- Container information
- Quick links to related services

## 🎯 Usage in Presentation

### 3-Minute Demo Points
1. **Real-time Monitoring**: Show live service status updates
2. **Visual Design**: Highlight modern UI with brand colors
3. **System Metrics**: Demonstrate resource monitoring
4. **Error Handling**: Show how failures are displayed
5. **Infrastructure Overview**: Display server information

### Key Talking Points
- "Real-time health monitoring with 30-second updates"
- "Modern UI built with shadcn/ui and Tailwind CSS"
- "Comprehensive service monitoring including databases and external services"
- "Production-ready with Docker deployment"
- "Responsive design works on all devices"

## 🔮 Future Enhancements

### Planned Features
- [ ] Historical metrics and trending
- [ ] Alert notifications and thresholds
- [ ] Service dependency mapping
- [ ] Performance analytics dashboard
- [ ] Mobile app for monitoring

### Technical Improvements
- [ ] WebSocket for real-time updates
- [ ] Caching for better performance
- [ ] Advanced filtering and search
- [ ] Export capabilities (PDF, CSV)
- [ ] Integration with external monitoring tools

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow shadcn/ui component patterns
4. Maintain responsive design principles
5. Add proper error handling
6. Update documentation for new features

## 📝 License

Part of the CollegeGram monorepo project.